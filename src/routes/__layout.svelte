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
	import { selectDB } from '$lib/db'
	import { dev } from '$app/env'

	let { info, fail, warn } = getLogger('Global layout', 'info')

	info('-- Initialization --')
	info(dev ? '. developpement version' : '. production version')
	// probleme de persistance entre l'instance de supabase et le jeton fourni par google Auth
	// le test de connexion doit se faire par supabase, quitte à refaire une authentification google
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
		let newUser
		if (connected) {
			// l'id de l'utilisateur est donné par supabase
			// on retrouve ensuite cet id dans les différentes tables avec l'entrée userId
			const u = supabaseClient.auth.user()
			newUser = {
				email: u.email,
				userId: u.id,
				avatarUrl: u.user_metadata.avatarUrl,
			}
			const data = await selectDB({ table: 'users', single: true })
			// let { data, error } = await supabaseClient
			// 	.from('users')
			// 	.select('*')
			// 	.eq('userId', u.id)
			// 	.maybeSingle()

			// if (error) {
			// fail(error)
			// } else
			if (data) {
				newUser = {
					...newUser,
					firstname: data.firstname,
					lastname: data.lastname,
					schoolId: data.schoolId,
					roles: data.roles,
					grade: data.grade,
					classes: data.classes,
					teacherId: data.teacherId,
				}
			} else {
				fail('User not found.')
			}

			user.set(newUser)
			info(`User ${u.email} logged in`, newUser)
		} else {
			if ($user) {
				const email = $user.email
				info(`user ${email} logged out`)
			}
			user.set(null)
		}
	}

	// on met à jour le profil utilisateur suivant l'état de connexion
	$: updateUser($connected)
</script>

<svelte:head>
	<title>UbuMaths - Les maths de la chandelle verte</title>
</svelte:head>

<SupaAuthHelper supabaseClient="{supabaseClient}" session="{session}">
	<slot />
</SupaAuthHelper>
