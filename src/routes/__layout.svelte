<script>
	import '../app.scss'
	import {
		touchDevice,
		toMarkup,
		formatLatex,
		mathliveReady,
		MathfieldElement,
	} from '$lib/stores'
	import { user, connected } from '$lib/sessionStore'
	import { getLogger } from '$lib/utils'
	import { onMount, onDestroy } from 'svelte'

	import { session } from '$app/stores'
	import { supabaseClient } from '$lib/supabase'
	import { SupaAuthHelper } from '@supabase/auth-helpers-svelte'
	import {selectDB} from '$lib/db'

	let { info, fail, warn } = getLogger('Global layout', 'info')

	info('Initialization')

	supabaseClient.auth.onAuthStateChange(() => {
		connected.set(!!supabaseClient.auth.user())
	})

	onMount(() => {
		// detects a touche screen device at the first touch
		//  https://codeburst.io/the-only-way-to-detect-touch-with-javascript-7791a3346685
		window.addEventListener(
			'touchstart',
			function onFirstTouch() {
				touchDevice.set(true)
				window.removeEventListener('touchstart', onFirstTouch, false)
			},
			false,
		)

		import('tinymathlive/dist/mathlive.min.mjs')
			.then((m) => {
				mathliveReady.set(true)
				MathfieldElement.set(m.MathfieldElement)
				toMarkup.set(m.convertLatexToMarkup)
				const regex = /\$\$(.*?)\$\$/g
				const replacement = (_, p1) => m.convertLatexToMarkup(p1)
				const _formatLatex = (o) => {
					if (!o) {
						return ''
					}
					if (Array.isArray(o)) {
						return o.map((elmt) => _formatLatex(elmt))
					} else if (o.text) {
						return { ...o, text: _formatLatex(o.text) }
					} else if (typeof o === 'string') {
						return o.replace(regex, replacement)
					} else {
						return o
					}
				}
				formatLatex.set(_formatLatex)
			})
			.catch((e) => {
				fail('erreur', e)
			})
	})

	async function updateUser(connected) {
		let new_u
		if (connected) {
			const u = supabaseClient.auth.user()
			new_u = {
				email: u.email,
				user_id: u.id,
				avatar_url: u.user_metadata.avatar_url,
			}
			const data = await selectDB({table:'users', single:true})
			// let { data, error } = await supabaseClient
			// 	.from('users')
			// 	.select('*')
			// 	.eq('user_id', u.id)
			// 	.maybeSingle()

			// if (error) {
				// fail(error)
			// } else 
			if (data) {
				new_u = {
					...new_u,
					firstname: data.firstname,
					lastname: data.lastname,
					school_id: data.school_id,
					roles: data.roles,
					grade: data.grade,
					classes: data.classes,
					teacher_id: data.teacher_id,
				}
			} else {
				fail('User not found.')
			}
			new_u.navadra = {}
			let { data:data2, error:error2 } = await supabaseClient
				.from('navadra_joueurs')
				.select('*')
				.eq('user_id', u.id)
				.maybeSingle()
			if (error2) {
				fail(error2)
			} else if (data2) {
				new_u.navadra.profile = data2
			} 

			user.set(new_u)
			info(`User ${u.email} logged in`, new_u)
		} else {
			if ($user) {
				const email = $user.email
				info(`user ${email} logged out`)
			}
			user.set(null)
		}
	}

	$: updateUser($connected)
</script>

<svelte:head>
	<title>UbuMaths - Les maths de la chandelle verte</title>
</svelte:head>

<SupaAuthHelper supabaseClient="{supabaseClient}" session="{session}">
	<slot />
</SupaAuthHelper>
