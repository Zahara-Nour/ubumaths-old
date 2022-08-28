<script>
	import { signInWithGoogle } from '$lib/auth'
	import { connected } from '$lib/sessionStore'
	import { player } from '$lib/navadraStore'
	import Button, { Label } from '@smui/button'
	import { playersManager } from './navadra/js/player'
	import CharacterCreation from './navadra/CharacterCreation.svelte'
	import { tuto } from '$lib/navadraState'
	import { State } from 'xstate'

	async function updatePlayer(connected) {
		if (connected) {
			const p = await playersManager.loadDB()
			if (p) {
				player.set(p)
				console.log('tuto', JSON.parse(p.profile.tuto))
				const previousState = State.create(JSON.parse(p.profile.tuto))
				tuto.start(previousState)
			}
		} else {
			player.set(null)
			tuto.stop()
		}

		// création des monstres enregistrés
		// newUser.navadra.profile.monstres = []
		// if (newUser.navadra.profile.monstres_ids.length) {
		// 	newUser.navadra.profile.monstres_ids.forEach(async (id) => {
		// 		const monstre_params = await selectDB({
		// 			table: 'navadra_monstres',
		// 			eqs: [['id', id]],
		// 			single: true,
		// 		})
		// 		const monstre = hydrateMonstre(monstre_params)
		// 		newUser.navadra.profile.monstres.push(monstre)
		// 		console.log('monstre', monstre)
		// 	})
		// }
	}

	$: updatePlayer($connected)
	
</script>

<svelte:head>
	<!-- Feuilles de styles en fonction largeur écran -->
	<link rel="stylesheet" href="/css/navadra/basic_styles.css?nvd_r=xxx" />
	<link
		rel="stylesheet"
		href="/css/navadra/styles_grands_ordis.css?nvd_r=xxx"
		media="only screen and (min-width: 1751px)"
	/>
	<link
		rel="stylesheet"
		href="/css/navadra/styles_ordis.css?nvd_r=xxx"
		media="only screen and (min-width: 992px) and (max-width: 1750px)"
	/>
	<link
		rel="stylesheet"
		href="/css/navadra/styles_tablettes.css?nvd_r=xxx"
		media="only screen and (min-width: 769px) and (max-width: 991px)"
	/>
	<link
		rel="stylesheet"
		href="/css/navadra/styles_mobiles.css?nvd_r=xxx"
		media="only screen and (max-width: 768px)"
	/>
</svelte:head>

{#if $connected && $player}
	<slot />
{:else if $connected}
	<CharacterCreation />
{:else}
	<p>
		Le jeu Navadra a été initialement créé par l'équipe de Michel Ferry qui a
		publié les sources du projet et l'a mis sous license libre. Merci à eux pour
		ce travail formidable ! Je l'ai complètement réécrit (en Javascript) afin
		qu'il s'incorpore au sein d'Ubumaths et que je puisse le modifier et
		l'étendre comme je veux. Pour pouvoir y jouer, il faut d'abord se connecter
		avec le compte du lycée.
	</p>
	<div class="flex justify-center">
		<Button on:click="{signInWithGoogle}" variant="raised">
			<Label>Se connecter</Label>
		</Button>
	</div>
{/if}
