<script>
	import Footer from './Footer.svelte'
	import Header from './Header.svelte'
	import { user } from '$lib/sessionStore'
	import { player } from '$lib/navadraStore'
	import { tutoriel } from './js/tuto'
	import { updateDB } from '$lib/db'
	import { monstersManager } from './js/monsters'
	import { playersManager } from './js/player'
	import { tuto } from '$lib/navadraState'

	let sum_challenges = 1
	let countFights = 2
	let msg_tuteur
	let displayArrowUp = false
	let displayPlayInverse = false
	let displayChevron1 = false
	let displayChevron2 = false

	function manageTuto() {
		msg_tuteur = tutoriel(1)
	}
	$: if ($tuto) manageTuto()
	$: console.log($tuto)
</script>

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
	src="{`/images/navadra${$player.profile.tutorImage}`}"
/>

<!-- Bulle du personnage si tuto fini-->
<div id="bulle_index" class="bulle">
	<span class="g" id="nom_tuteur">{$player.profile.tutor}</span>
	<!-- le texte qui apparaitra dans la bulle -->
	<span id="txt_bulle">
		{@html msg_tuteur}
	</span>
</div>
{#if displayPlayInverse}
	<img
		id="lancer_defi"
		alt="lancer défi"
		src="/images/navadra/icones/play_inverse.png"
	/>
{/if}
{#if displayArrowUp}
	<img
		id="spotTraining"
		alt="spotTraining"
		class="img_120"
		src="/images/navadra/icones/fleche4.png"
	/>
{/if}

<div id="commandes_tuto_index">
	{#if displayChevron1}
		<img
			id="tuto_precedent"
			alt="tuto_precedent"
			src="/images/navadra/icones/chevron1.png"
		/>
	{/if}
	{#if displayChevron2}
		<img
			id="tuto_suivant"
			alt="tuto_suivant"
			src="/images/navadra/icones/chevron2.png"
		/>
	{/if}
</div>
{#each $player.profile.monsters as id}
	{#await monstersManager.loadDB(id) then monster}
		{@const xinfo = monster.profile.position.x}
		{@const yinfo = monster.profile.position.y + 1.5}
		<a href="{`/navadra/Fight?monsterId=${monster.profile.id}`}">
			<div
				id="{`monstre_${monster.profile.id}`}"
				class="monstre_index"
				style="{`left:${xinfo}%;bottom:${yinfo}%`}"
			>
				<img
					alt="{`monstre_${monster.profile.id}`}"
					src="{`/images/navadra${monster.profile.imgHead}`}"
				/>
			</div>

			<div
				id="{`monstre_${monster.profile.id}`}_info"
				class="info_monstre"
				style="{`left:${xinfo}%;bottom:${yinfo}%`}"
			>
				<span
					class="ib nom_monstre"
					style="{`color:${monster.defineNameColorHex()}; border:2px solid ${monster.defineBorderColorHex()}`}"
					>{monster.profile.name}</span
				>
				<img
					class="fond_niveau_monstre"
					alt="fond_niveau_monstre"
					src="{`/images/navadra/monstres/niv_monstre_${monster.profile.element}.png`}"
				/>
				<span class="ib niveau_monstre">{monster.profile.level}</span>
			</div>
		</a>
	{/await}
{/each}

<Footer />
