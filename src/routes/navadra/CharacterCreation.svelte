<script>
	import { user } from '$lib/sessionStore'
	import { player } from '$lib/navadraStore'
	import { getLogger, getRandomIntInclusive } from '$lib/utils'
	import { tuto } from '$lib/navadraState'
	import { playersManager } from './js/player'
	import { monstersManager } from './js/monsters'
	
	let { info, fail, warn } = getLogger('CharacterCreation', 'info')
	let pseudo = ''
	let sex = 'fille'
	let num = 1
	let eyes = 'bleu'
	let skin = 'asi'
	let hair = 'blond'

	$: avatar = `${sex}_${num}_${hair}_${eyes}_${skin}.png`
	$: avatarHead = `tete_${avatar}`

	function checkPseudo() {}

	async function createPlayer() {
		let profile = {
			pseudo,
			avatar: `/avatars/${avatar}`,
			avatarHead: `/avatars/portraits/${avatarHead}`,
			sex,
			userId: $user.userId,
			monsters: [],
		}

		// attribution aléatoire d'un tuteur
		switch (getRandomIntInclusive(1, 4)) {
			case 1:
				profile.tutor = 'Namuka'
				profile.tutorImage = '/personnages/namuka.png'
				break
			case 2:
				profile.tutor = 'Katillys'
				profile.tutorImage = '/personnages/katillys.png'
				break
			case 3:
				profile.tutor = 'Sivem'
				profile.tutorImage = '/personnages/sivem.png'
				break
			case 4:
				profile.tutor = 'Leorn'
				profile.tutorImage = '/personnages/leorn.png'
				break
		}

		const p = await playersManager.createPlayer(profile)
		p.definePosition()
		tuto.start() // l'automate gérant le tutoriel
		p.profile.tuto = JSON.stringify($tuto)
		console.log('profile', p.profile)
		await playersManager.saveDB(p.profile)
		player.set(p)

		// création du premier monstre
		let params
		switch (p.element) {
			case 'feu':
				params = {
					name: 'Vipère',
					element: 'feu',
					category: 'offensif',
					img: '/monstres/vipere.png',
					imgHead: '/monstres/vipere_tete.png',
				}
				break
			case 'eau':
				params = {
					name: 'Couleuvre',
					element: 'eau',
					category: 'offensif',
					img: '/monstres/couleuvre.png',
					imgHead: '/monstres/couleuvre_tete.png',
				}
				break
			case 'vent':
				params = {
					name: 'Vautour',
					element: 'vent',
					category: 'equilibre',
					img: '/monstres/vautour.png',
					imgHead: '/monstres/vautour_tete.png',
				}
				break
			case 'terre':
				params = {
					name: 'Cobra',
					element: 'terre',
					category: 'offensif',
					img: '/monstres/cobra.png',
					imgHead: '/monstres/cobra_tete.png',
				}
				break
		}
		const monster = monstersManager.createMonster(params)
		monster.definePosition()
		const { id } = await monstersManager.saveDB(monster.profile)
		monster.profile.id = id
		console.log('premier monster', monster)
		$player.profile.monsters.push(id)
		$player.monsters = [monster]
		await playersManager.updateDB($player.profile)
	}
</script>

<!-- Fond contenant le formulaire -->
<div class="fond l70 mh2 prolonge_moyen">
	<div class="titre">Création du personnage</div>

	<!-- Début première page formulaire -->
	<div id="partie1">
		<div class="col50">
			<p>
				<span class="label">Pseudo :</span>
				<input
					class="champ input"
					autocomplete="off"
					type="text"
					title="Entre 3 et 15 caractères : lettres, chiffres, espace et certains caractères spéciaux (' -@_)"
					name="pseudo"
					bind:value="{pseudo}"
				/>
			</p>
		</div>

		<!-- Fin première page formulaire -->
	</div>

	<!-- Début deuxième page formulaire -->
	<div id="partie2">
		<div class="col50">
			<div class="label">
				<span>Tu es :</span>
			</div>
			<div id="sex" class="input">
				<input
					type="radio"
					name="sex"
					id="fille"
					value="fille"
					bind:group="{sex}"
				/><label for="fille">une fille</label>
				<input
					type="radio"
					name="sex"
					id="gars"
					value="gars"
					bind:group="{sex}"
				/><label for="gars">un gars</label>
			</div>
			<div class="label">Cheveux :</div>
			<div class="input">
				{#each ['blond', 'roux', 'brun', 'noir'] as c}
					<span
						on:click="{() => {
							hair = c
						}}"
						class:selected="{hair === c}"
						class="case_coul"
						id="{`cheveux_${c}`}"
					>
					</span>
				{/each}
			</div>
			<div class="label">Yeux :</div>
			<div class="input">
				{#each ['bleu', 'vert', 'marron', 'noir'] as y}
					<span
						on:click="{() => {
							eyes = y
						}}"
						class:selected="{eyes === y}"
						class="case_coul"
						id="{`yeux_${y}`}"
					>
					</span>
				{/each}
			</div>
			<div class="label">Peau :</div>
			<div class="input">
				{#each ['occ', 'asi', 'met', 'noi'] as p}
					<span
						on:click="{() => {
							skin = p
						}}"
						class:selected="{skin === p}"
						class="case_coul"
						id="{`peau_${p}`}"
					>
					</span>
				{/each}
			</div>
		</div>
		<div class="col50">
			<div class="input">
				<div class="ib l10 align_milieu devant">
					<img
						on:click="{() => {
							num = num === 1 ? 8 : num - 1
						}}"
						id="chevron1"
						alt="avatar suivant"
						src="/images/navadra/icones/chevron1.png"
					/>
				</div>
				<div class="ib l70 align_milieu derriere">
					<img
						id="modele_avatar"
						alt="avatar"
						src="{`/images/navadra/avatars/${avatar}`}"
					/>
				</div>
				<div class="ib l10 align_milieu devant">
					<img
						on:click="{() => {
							num = num === 8 ? 1 : num + 1
						}}"
						id="chevron2"
						alt="avatar précédent"
						src="/images/navadra/icones/chevron2.png"
					/>
				</div>
			</div>
			<!-- <input type="hidden" name="avatarHead" value="<?= $_POST["avatarHead"]; ?>"> -->
			<!-- <input type="hidden" name="avatar" value="<?= $_POST["avatar"]; ?>"> -->
		</div>

		<!-- Bouton pour valider le formulaire -->
		<span
			on:click="{createPlayer}"
			class="bouton form_droite"
			value="C'est parti !">C'est parti !</span
		>
		<img
			on:click="{createPlayer}"
			alt="valider personnage"
			class="icone_form_droite"
			src="/images/navadra/icones/play.png"
		/>

		<!-- Fin deuxième page formulaire -->
	</div>

	<!-- Fin du fond -->
</div>

<style>
	.selected {
		border: 3px solid #1c9500;
	}
</style>
