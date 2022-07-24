<script>
	import Footer from './Footer.svelte'
	import Header from './Header.svelte'
	import { user } from '$lib/sessionStore'
	import Inscription from './Inscription.svelte'
	import { createMonstre } from './js/monstres'
	import { tutoriel } from './js/tutoriel'
	import { updateDB } from '$lib/db'
	import { mdiConsoleNetworkOutline } from '@mdi/js'

	let sum_challenges = 1
	let countFights = 2
	let msg_tuteur

	async function initUser() {
		console.log('mnstres', $user.navadra.profile.monstres)
		let uprofile = $user.navadra.profile

		// le premier monstre
		msg_tuteur = tutoriel(1)
		let params
		switch (uprofile.element) {
			case 'feu':
				params = {
					nom: 'Vipère',
					element: 'feu',
					categorie: 'offensif',
					img: '/monstres/vipere.png',
					img_tete: '/monstres/vipere_tete.png',
				}
				break
			case 'eau':
				params = {
					nom: 'Couleuvre',
					element: 'eau',
					categorie: 'offensif',
					img: '/monstres/couleuvre.png',
					img_tete: '/monstres/couleuvre_tete.png',
				}
				break
			case 'vent':
				params = {
					nom: 'Vautour',
					element: 'vent',
					categorie: 'equilibre',
					img: '/monstres/vautour.png',
					img_tete: '/monstres/vautour_tete.png',
				}
				break
			case 'terre':
				params = {
					nom: 'Cobra',
					element: 'terre',
					categorie: 'offensif',
					img: '/monstres/cobra.png',
					img_tete: '/monstres/cobra_tete.png',
				}
				break
		}
		if (!uprofile.monstres_ids.length) {
			const monstre = await createMonstre(params)
			console.log('premier monstre', monstre)
			await updateDB({
				table: 'navadra_joueurs',
				columns: { monstres_ids: [monstre.id] },
			})
			console.log('updated profile', uprofile)

			$user.navadra.profile.monstres.push(monstre)
		}
	}

	$: if ($user) initUser()
</script>

{#if $user}
	<Header />

	<img
		id="indicatorChallenges"
		alt="indicatorChallenges"
		title="{`Il te reste ${sum_challenges} défi(s) aujourd'hui`}"
		src="/images/navadra/icones/indicatorChallenges.png"
	/>
	<img
		id="countChallengesBackground"
		alt="countChallengesBackground"
		src="/images/navadra/icones/backgroundIndicators.png"
	/>
	<div id="countChallenges">{sum_challenges}</div>

	<img
		id="indicatorFights"
		alt="indicatorFights"
		title="{`Il te reste ${countFights} combat(s) aujourd'hui`}"
		src="/images/navadra/icones/indicatorFights.png"
	/>
	<img
		id="countFightsBackground"
		alt="countFightsBackground"
		src="/images/navadra/icones/backgroundIndicators.png"
	/>
	<div id="countFights">{countFights}</div>

	<!-- Tuteur -->
	<img
		id="tuteur_index"
		alt="tuteur_index"
		src="{`/images/navadra${$user.navadra.profile.img_tuteur}`}"
	/>

	<!-- Bulle du personnage si tuto fini-->
	<div id="bulle_index" class="bulle">
		<span class="g" id="nom_tuteur">{$user.navadra.profile.tuteur}</span>
		<!-- le texte qui apparaitra dans la bulle -->
		<span id="txt_bulle">
			{@html msg_tuteur}
		</span>
	</div>

	<img
		id="lancer_defi"
		alt="lancer défi"
		src="/images/navadra/icones/play_inverse.png"
	/>
	<img
		id="spotTraining"
		alt="spotTraining"
		class="img_120"
		src="/images/navadra/icones/fleche4.png"
	/>

	<div id="commandes_tuto_index">
		<img
			id="tuto_precedent"
			alt="tuto_precedent"
			src="/images/navadra/icones/chevron1.png"
		/>
		<img
			id="tuto_suivant"
			alt="tuto_suivant"
			src="/images/navadra/icones/chevron2.png"
		/>
	</div>
	{#each $user.navadra.profile.monstres as monstre}
		{@const xinfo = monstre.position.x}
		{@const yinfo = monstre.position.y + 1.5}
		<a href="{`/navadra/Combat?id_monstre=${monstre.id}`}">
			<div
				id="{`monstre_${monstre.id}`}"
				class="monstre_index"
				style="{`left:${monstre.position.x}%;bottom:${monstre.position.y}%`}"
			>
				<img
					alt="{`monstre_${monstre.id}`}"
					src="{`/images/navadra${monstre.img_tete}`}"
				/>
			</div>

			<div
				id="{`monstre_${monstre.id}`}_info"
				class="info_monstre"
				style="{`left:${xinfo}%;bottom:${yinfo}%`}"
			>
				<span
					class="ib nom_monstre"
					style="{`color:${monstre.couleur_nom_hex()}; border:2px solid ${monstre.couleur_bordure_hex()}`}"
					>{monstre.nom}</span
				>
				<img
					class="fond_niveau_monstre"
					alt="fond_niveau_monstre"
					src="{`/images/navadra/monstres/niv_monstre_${monstre.element}.png`}"
				/>
				<span class="ib niveau_monstre">{monstre.niveau}</span>
			</div>
		</a>
	{/each}

	<Footer />
{:else}
	<Inscription />
{/if}
