<script>
	import { player } from '$lib/navadraStore'
	import { page } from '$app/stores'
	import { monstersManager } from './js/monsters'
	import { tuto } from '$lib/navadraState'
	import LinearProgress from '@smui/linear-progress'

	export let monsterId = JSON.parse(
		decodeURI($page.url.searchParams.get('monsterId')),
	)

	

	const monster = $player.monsters.find(
		(m) => (m.profile.monsterId = monsterId),
	)
	let beginFight = false
	console.log('tuto', $tuto)
	if ($tuto.value === 'index_1') {
		tuto.send('NEXT')
	}

	let leftPlayerStamina = $player.stamina
	let leftMonsterStamina = monster.stamina

	

</script>

{#if beginFight}
	<div
		class="fond_combat l100 h100"
		style="{`background-image:url("/images/navadra/combat_${monster.profile.element}.jpg")`}"
	>
		<span id="caracs_joueur_haut_gauche">
			<img
				class="fond_niveau_combattants"
				alt="fond_niveau_combattants"
				src="{`/images/navadra/monstres/niv_monstre_${$player.element}.png`}"
			/>
			<span class="niveau_combattants">{$player.profile.level}</span>
			<span class="{`noms_combattants monstre_${$player.element}`}"
				>{$player.profile.pseudo}</span
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
			<LinearProgress   progress={0.5}  />
			<span id="endu_joueur">{$player.stamina}</span>
			<span id="img_endu_joueur_descr" class="cache"
				>{$player.profile.descriptif_endu}</span
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
				alt="puissance magique"
				id="icon_pm_joueur"
				class="img_30"
				src="/images/navadra/icones/state_pm.png"
			/>
			<span id="pm_joueur" class="p1 g bulle_daide"
				>{$player.pm}</span
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
		<div id="case_joueur_combat" class="h60">
			<img
				id="img_joueur"
				alt="joueur"
				class="h80"
				src="/images/navadra{$player.profile.avatar}"
			/>
		</div>

		<!-- Nom, niveau et PM du monstre -->
		<span id="caracs_monstre_haut_droite">
			<img
				class="fond_niveau_combattants"
				alt="fond niveau combattants"
				src="/images/navadra/monstres/niv_monstre_{monster.profile.element}.png"
			/>
			<span id="niveau_monstre" class="ib niveau_combattants"
				>{monster.profile.level}</span
			>
			<span class="ib noms_combattants monstre_{monster.profile.element}"
				>{monster.profile.name}</span
			>
			<!-- Endu Monstre -->
			<span id="barre_endu_monstre" class="ib"></span>
			<span
				><img
					class="icone_endu_monstre"
					id="img_endu_monstre"
					alt="img_endu_monstre"
					src="/images/navadra/icones/endurance.png"
				/></span
			>
			<span id="endu_monstre" class="cache">{monster.profile.leftStamina}</span>
			<span id="endu_monstre_max" class="cache">{monster.profile.stamina}</span>
			<span id="img_endu_monstre_descr" class="cache"
				>{monster.profile.staminaDescription}</span
			>
		</span>

		<span class="monster_effects">
			<!-- Skip turn Monstre -->
			<!-- <img id="icon_skipturn_monstre" class="img_30" src="/images/navadra/icones/state_skipturn.png" > -->
			<!-- <span id="desc_skipturn_monstre" class="descriptif_sort p0">Le monstre passera son prochain tour</span> -->
			<!-- PM Monstre -->
			<span id="pm_monstre" class="p1 g bulle_daide">{monster.pm}</span>
			<img id="icon_pm_monstre" class="img_30" src="/images/navadra/icones/state_pm.png">
			<!-- <span id="desc_pm_monstre" class="descriptif_sort p0">La puissance magique du monstre</span> -->
		</span>

		<!-- CASE MONSTRE -->
		<div id="case_monstre_combat" class="h60">
			<img
				id="img_monstre"
				alt="monstre"
				class="h80"
				src="/images/navadra{monster.profile.img}"
			/>
		</div>
	</div>
{:else}
	<div id="screen_challenge">
		<span class="ib l100 pfun align_centre mh4 mb2">
			<span class="ib l100 p7 g">{monster.profile.name}</span>
			<span class="ib l100 p3 g">Niveau {monster.profile.level}</span>
		</span>
		<span class="ib l100 align_centre mb2"
			><img
				alt="monstre"
				class="l20"
				src="{`/images/navadra${monster.profile.img}`}"
			/></span
		>
		<span class="ib l100 align_centre p5 mb2" alt="loading" id="loading_msg"
			>{monster.profile.loading_msg}</span
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
