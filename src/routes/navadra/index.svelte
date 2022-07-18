<script>
	import Footer from './Footer.svelte'
	import Header from './Header.svelte'
    import {user} from '$lib/sessionStore'
    import Inscription from './Inscription.svelte';
import { createMonstre } from './js/monstres';

	let sum_challenges = 1
	let countFights = 2
	let msg_tuteur = 'salut'

    if ($user.navadra.profile) {
        const monstre = createMonstre()
        console.log('monstre', monstre)
    }
</script> 

{#if $user.navadra.profile}


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
	src="/images/navadra/personnages/katillys.png"
/>

<!-- Bulle du personnage si tuto fini-->
<div id="bulle_index" class="bulle">
	<span class="g" id="nom_tuteur">Katillys</span>
	<!-- le texte qui apparaitra dans la bulle -->
	<span id="txt_bulle">
		{msg_tuteur}
	</span>
</div>

<Footer />
{:else}
    <Inscription/>
{/if}
