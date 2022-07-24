<script>
	import { user } from '$lib/sessionStore'
	import { page } from '$app/stores'

	export let id_monstre = JSON.parse(
		decodeURI($page.url.searchParams.get('id_monstre')),
	)
	console.log('id_monstre', id_monstre)
	const monstre = $user.navadra.profile.monstres.find(
		(m) => m.id === id_monstre,
	)
	console.log('monstre combat', monstre)
	let beginFight = false
</script>

{#if beginFight}
	<div class="fond_combat l100 h100">
		<span id="caracs_joueur_haut_gauche">
			<img
				class="fond_niveau_combattants"
				alt="fond_niveau_combattants"
				src="{`/images/navadra/monstres/niv_monstre_${$user.navadra.profile.element}.png`}"
			/>
			<span class="niveau_combattants">{$user.navadra.profile.niveau}</span>
			<span
				class="{`noms_combattants monstre_${$user.navadra.profile.element}`}"
				>{$user.navadra.profile.pseudo}</span
			>

			<!-- Endu Joueur -->
			<span class="ib l100"
				><img
					class="icone_endu"
					alt="icone_endu"
					id="img_endu_joueur"
					src="/images/navadra/icones/endurance.png"
				/></span
			>
			<span id="barre_endu_joueur" class="ib"></span>
			<span id="endu_joueur" class="cache"
				>{$user.navadra.profile.endu_joueur}</span
			>
			<span id="img_endu_joueur_descr" class="cache"
				>{$user.navadra.profile.descriptif_endu}</span
			>
			<!-- player Combo gauge -->
			<span class="ib l100"
				><img
					class="icone_endu"
					alt="icone_endu"
					id="player_combo_img"
					src="/images/navadra/icones/puissance_magique.png"
				/></span
			>
			<span id="player_combo_bar" class="ib"></span>
			<span id="player_combo" class="cache">0</span>
			<span id="player_combo_img_descr" class="cache"
				>Lorsque cette barre est pleine, tu débloques un sort ultime !</span
			>
		</span>

		<span class="player_effects">
			<!-- PM Joueur -->
			<img
				id="icon_pm_joueur"
				class="img_30"
				src="/images/navadra/icones/state_pm.png"
			/>
			<span id="pm_joueur" class="p1 g bulle_daide"
				>{$user.navadra.profile.pm_joueur}</span
			>
			<!-- <span id="desc_pm_joueur" class="descriptif_sort p0"
				>Ta puissance magique</span
			> -->
			<!-- SendBack Joueur -->
			<!-- <img
				id="icon_sendback_joueur"
				class="img_30"
				src="/images/navadra/icones/state_sendback.png"
			/>
			<span id="sendback_joueur" class="p1 g bulle_daide"></span>
			<span id="desc_sendback_joueur" class="descriptif_sort p0"
				>Pourcentage de l'attaque du monstre qui lui est renvoyée</span
			> -->
			<!-- Absorb Joueur -->
			<!-- <img
				id="icon_absorb_joueur"
				class="img_30"
				src="/images/navadra/icones/state_absorb.png"
			/>
			<span id="absorb_joueur" class="p1 g bulle_daide"></span>
			<span id="desc_absorb_joueur" class="descriptif_sort p0"
				>Pourcentage de l'attaque du monstre que tu va absorber</span
			> -->
			<!-- Dodge icon -->
			<!-- <img
				id="icon_dodge_joueur"
				class="img_30"
				src="/images/navadra/icones/state_dodge.png"
			/>
			<span id="desc_dodge_joueur" class="descriptif_sort p0"
				>Tu esquiveras la prochaine attaque</span
			>
		</span> -->
		</span>
		<!-- CASE JOUEUR -->
		<div id="case_joueur_combat" class="h80">
			<img
				id="img_joueur"
				alt="joueur"
				class="h80"
				src="/images/navadra{$user.navadra.profile.avatar_entier}"
			/>
		</div>
	</div>
{:else}
	<div id="screen_challenge">
		<span class="ib l100 pfun align_centre mh4 mb2">
			<span class="ib l100 p7 g">{monstre.nom}</span>
			<span class="ib l100 p3 g">Niveau {monstre.niveau}</span>
		</span>
		<span class="ib l100 align_centre mb2"
			><img
				alt="monstre"
				class="l20"
				src="{`/images/navadra${monstre.img}`}"
			/></span
		>
		<span class="ib l100 align_centre p5 mb2" alt="loading" id="loading_msg"
			>{monstre.loading_msg}</span
		>
		<span
			class="ib l100 align_centre"
			on:click="{() => {
				beginFight = true
			}}"
			><img
				alt="go !"
				id="resume_challenge"
				title="C'est parti !"
				class="l8"
				src="/images/navadra/icones/resume.png"
			/></span
		>
	</div>
	<div id="exit_confirm" title="Abandonner le combat en cours ?">
		Si tu quittes le combat en cours, il sera considéré comme perdu...
	</div>
{/if}
