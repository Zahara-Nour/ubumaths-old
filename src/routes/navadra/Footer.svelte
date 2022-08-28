<script>
	import {player} from '$lib/navadraStore'
	let nb = ''

	function ornmentLvl(lvl) {
		if (lvl >= 40) {
			return 5
		} else if (lvl >= 30) {
			return 4
		} else if (lvl >= 20) {
			return 3
		} else if (lvl >= 10) {
			return 2
		} else if (lvl >= 5) {
			return 1
		} else {
			return 0
		}
	}
	let lvl = 15
	let element = $player.element
	let levelBackground = ornmentLvl(lvl)
    let portrait
</script>

<!-- Bloc avatar -->
<img
	id="bloc_avatar"
	alt="avatar"
	src="/images/navadra/icones/bloc_avatar.png"
/>
<a href="/profil">
	<div id="portrait_footer" class="portrait_container" title="profil">
		<img
            style="width:100%;position:absolute;bottom:0px; left:0px"
			src="{`/images/navadra/cadres_avatars/cadres_ronds/${element}_fond.png`}"
			alt="avatar"
		/>
        <img src={`/images/navadra/${$player.profile.avatarHead}`} alt='portrait' style='position:absolute; bottom:0; left:0 ; width:100%'/>

		<!-- {#if levelBackground > 0}
			<img
				alt="level"
				src="{`/images/navadra/cadres_avatars/cadres_ronds/${element}_niv_${levelBackground}.png`}"
			/>
		{/if} -->
	</div>
</a>

<img
	id="fond_niveau_joueur"
	alt="niveau"
	src="/images/navadra/icones/avatar_niveau.png"
/>
<div id="niveau_joueur" class="g">{$player.profile.level}</div>

<div id="xp_joueur" class="cache" title="XP : 34%">34%</div>

<!-- Barre menu gauche -->
<div id="barre_menu_gauche">
	<span id="pyrs_joueur">
		<!-- Pyrs de feu -->
		<span class="ib l8 md1 mh2">
			<a href="/navadra/grimoire?elem=feu">
				<span class="ib l100 align_centre"
					><img
						class="l60"
						alt="pyrs feu"
						src="/images/navadra/icones/pyrs_feu.png"
					/></span
				>
				<span id="pyrs_feu" class="ib l100 mh15 g">{$player.profile.firePyrs}</span>
			</a>
		</span>
		<!-- Pyrs d'eau -->
		<span class="ib l8 md1 mh2">
			<a href="/navadra/grimoire?elem=eau">
				<span class="ib l100 align_centre"
					><img
						class="l60"
						alt="pyrs eau"
						src="/images/navadra/icones/pyrs_eau.png"
					/></span
				>
				<span id="pyrs_eau" class="ib l100 mh15 g">{$player.profile.waterPyrs}</span>
			</a>
		</span>
		<!-- Pyrs du vent -->
		<span class="ib l8 md1 mh2">
			<a href="/navadra/grimoire?elem=vent">
				<span class="ib l100 align_centre"
					><img
						class="l60"
						alt="pyrs vent"
						src="/images/navadra/icones/pyrs_vent.png"
					/></span
				>
				<span id="pyrs_vent" class="ib l100 mh15 g">{$player.profile.windPyrs}</span>
			</a>
		</span>
		<!-- Pyrs de terre -->
		<span class="ib l8 md1 mh2">
			<a href="/navadra/grimoire?elem=terre">
				<span class="ib l100 align_centre"
					><img
						class="l60"
						alt="pyrs terre"
						src="/images/navadra/icones/pyrs_terre.png"
					/></span
				>
				<span id="pyrs_terre" class="ib l100 mh15 g">{$player.profile.earthPyrs}</span>
			</a>
		</span>
	</span>
	<!-- Prestige -->
	<span id="prestige_joueur" class="ib l12 md15 mh2">
		<span class="ib l100"
			><a class="lien_menu" href="/navadra/classement"
				><img
					id="icone_prestige"
					alt="prestige"
					class="l80 align_centre"
					title="classement"
					src="/images/navadra/icones/prestige.png"
				/></a
			></span
		>
		<span id="prestige" class="ib l100 mh15 g">{$player.profile.prestige}</span>
	</span>
</div>

<!-- Barre menu droite -->
<div id="barre_menu_droite">
	<!-- Grimoire -->
	<span class="ib l10 md7 mh2">
		<span class="ib l100"
			><a id="link_grimoire" href="/navadar/grimoire/"
				><img
					id="icone_grimoire"
					alt="grimoire"
					class="l100"
					title="grimoire"
					src="{`/images/navadra/icones/grimoire_normal${nb}.png`}"
				/></a
			></span
		>
	</span>
	<!-- Liste combats -->
	<span class="ib l10 md7 mh2">
		<span class="ib l100"
			><a href="/navadra/combats/"
				><img
					id="icone_combats"
					alt="combats"
					class="l100"
					title="combats"
					src="{`/images/navadra/icones/liste_combats_normal${nb}.png`}"
				/></a
			></span
		>
	</span>
	<!-- Cinématiques Histoire
    <span class="ib l10 md4 mh2">
        <span class="ib l100"><a href="<?= $link_histoire; ?>"><img id="icone_histoires" class="l100" title="<?= $titre_histoire; ?>" src="/images/navadra/icones/histoires_normal<?=$nb; ?>.png"></a></span>
    </span>
    -->
	<!-- Messages -->
	<span class="ib l10 md7 mh2">
		<span class="ib l100"
			><a href="/navadra/messages/"
				><img
					id="icone_messages"
					alt="messages"
					class="l100"
					title="messages"
					src="{`/images/navadra/icones/messages_normal${nb}.png`}"
				/></a
			></span
		>
	</span>
	<!-- Contacts -->
	<span class="ib l10 md7 mh2">
		<span class="ib l100"
			><a href="/navadra/contacts"
				><img
					id="icone_contacts"
					alt="contacts"
					class="l100"
					title="contacts"
					src="{`/images/navadra/icones/contacts_normal${nb}.png`}"
				/></a
			></span
		>
	</span>
	<!-- Recherche -->
	<span class="ib l10 md7 mh2">
		<span class="ib l100"
			><a href="/navadra/recherche/"
				><img
					id="icone_recherche"
					alt="recherche"
					class="l100"
					title="recherche"
					src="{`/images/navadra/icones/recherche_normal${nb}.png`}"
				/></a
			></span
		>
	</span>
</div>

<!-- Help -->
<!-- <span id="div_boussole" class="ib l12">
		<img id="fond_boussole" class="l100" src="/images/navadra/icones/boussole_fond.png">
	    <a id="boussole" class="l6"><img class="l100" title="Aide" src="/images/navadra/icones/boussole.png"></a>
	</span> -->

<!-- Notifications éventuelles -->
<!-- <?php if(isset($notif_parametres)){echo('<span class="petites_notifications cache" id="notif_parametres">'.$notif_parametres.'</span>');} ?>
<?php if(isset($notif_grimoire)){echo('<span class="notifications cache" id="notif_grimoire">'.$notif_grimoire.'</span>');} ?>
<?php if(isset($notif_combats)){echo('<span class="notifications cache" id="notif_combats">'.$notif_combats.'</span>');} ?>
<?php if(isset($notif_histoires)){echo('<span class="notifications cache" id="notif_histoires">'.$notif_histoires.'</span>');} ?>
<?php if(isset($notif_messages)){echo('<span class="notifications cache" id="notif_messages">'.$notif_messages.'</span>');} ?>
<?php if(isset($notif_ameliorations)){echo('<span class="notifications cache" id="notif_ameliorations">'.$notif_ameliorations.'</span>');} ?> -->
