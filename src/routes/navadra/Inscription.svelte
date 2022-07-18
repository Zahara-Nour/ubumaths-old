<script>
	import { supabaseClient } from '$lib/supabase'
	import { getLogger } from '$lib/utils'
	import { user } from '$lib/sessionStore'
    import {insertDB} from '$lib/db'
    import {determiner_position_joueur} from './js/joueur.js'

	let { info, fail, warn } = getLogger('Inscription', 'info')
	let pseudo = ''
	let sexe = 'fille'
	let num = 1
	let yeux = 'bleu'
	let peau = 'asi'
	let cheveux = 'blond'

	$: avatar_entier = `${sexe}_${num}_${cheveux}_${yeux}_${peau}.png`
	$: avatar_tete = `tete_${avatar_entier}`

	function checkPseudo() {}

	async function createPlayer() {
        console.log('user', $user)
        const position = determiner_position_joueur($user)
		const profile = {
			pseudo,
			avatar_entier: `/images/navadra/avatars/${avatar_entier}`,
			avatar_tete: `/images/navadra/avatars/portraits/${avatar_tete}`,
			sexe,
			user_id: $user.user_id,
            position
		}

        const data = await insertDB({table:'navadra_joueurs', rows:[profile]})
        $user.navadra.profile = data
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
			<div id="sexe" class="input">
				<input
					type="radio"
					name="sexe"
					id="fille"
					value="fille"
					bind:group="{sexe}"
				/><label for="fille">une fille</label>
				<input
					type="radio"
					name="sexe"
					id="gars"
					value="gars"
					bind:group="{sexe}"
				/><label for="gars">un gars</label>
			</div>
			<div class="label">Cheveux :</div>
			<div class="input">
				{#each ['blond', 'roux', 'brun', 'noir'] as c}
					<span
						on:click="{() => {
							cheveux = c
						}}"
						class:selected="{cheveux === c}"
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
							yeux = y
						}}"
						class:selected="{yeux === y}"
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
							peau = p
						}}"
						class:selected="{peau === p}"
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
						src="{`/images/navadra/avatars/${avatar_entier}`}"
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
			<!-- <input type="hidden" name="avatar_tete" value="<?= $_POST["avatar_tete"]; ?>"> -->
			<!-- <input type="hidden" name="avatar_entier" value="<?= $_POST["avatar_entier"]; ?>"> -->
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
