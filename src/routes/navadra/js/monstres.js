import { getRandomIntInclusive } from '$lib/utils'
import { user } from '$lib/sessionStore'
import { get } from 'svelte/store'
import { insertDB } from '../../../lib/db'

// prototype des montres
const PMonstre = {
	determiner_position() {
		const player = get(user).navadra
		const position_joueur = player.position
		let ok = 1
		const largeur_joueur = 10 //On prend la largeur du joueur et des monstres
		const hauteur_joueur = 10
		const largeur_monstre = 12
		const hauteur_monstre = 10
		let xmin, xmax, ymin, ymax
		let x, y
		while (ok > 0) {
			switch (
				this.element //Détermination de l'intervalle de position possible en fonction de l'élément du monstre
			) {
				case 'feu':
					xmin = 530
					xmax = 680
					ymin = 470
					ymax = 680
					break
				case 'eau':
					xmin = 210
					xmax = 400
					ymin = 210
					ymax = 400
					break
				case 'vent':
					xmin = 250
					xmax = 450
					ymin = 500
					ymax = 720
					break
				case 'terre':
					xmin = 500
					xmax = 680
					ymin = 170
					ymax = 380
					break
			}
			ok = 0
			x = getRandomIntInclusive(xmin, xmax) / 10
			y = getRandomIntInclusive(ymin, ymax) / 10
			if (
				Math.abs(x - position_joueur.x) <= largeur_joueur &&
				Math.abs(y - position_joueur.y) <= hauteur_joueur
			) {
				// Si la position générée se chevauche avec celle du joueur
				ok++
			}
			//On récupère chaque monstre pour tester le chevauchement de position
			player.monstres.foreach((monstre) => {
				if (
					Math.abs(x - monstre.position.x) <= largeur_monstre &&
					Math.abs(y - monstre.position.y) <= hauteur_monstre
				) {
					// Si la position générée se chevauche avec celle du monstre
					ok++
				}
			})
		}
		const position = {
			x,
			y,
		}
		return position
	},
}
export function createMonstre(params = {}) {
	const monstre = Object.create(PMonstre)
	const nb_chasseurs = params.nb_chasseurs || 1
	const caracs = carac_monstre(nb_chasseurs)
	Object.assign(monstre, {
		nb_chasseurs,
		monstres: [],
		...caracs,
		...params,
	})
	monstre.determiner_position()
	const data = insertDB({ table: 'navadra_monstres', rows: [monstre] })
	monstre.id = data.id
	return monstre
}

function carac_monstre(nb_chasseurs) {
	//Permet d'attribuer des caractéristiques aléatoire à un nouveau monstre en fonction du nb de chasseurs recommandé
	const caracs = []
	switch (nb_chasseurs) {
		case 1: {
			const rand = getRandomIntInclusive(1, 20)
			if (rand === 1) {
				caracs['nom'] = 'Iguane'
				caracs['element'] = 'feu'
				caracs['categorie'] = 'equilibre'
				caracs['img'] = '/images/navadra/monstres/iguane.png'
			}
			if (rand === 2) {
				caracs['nom'] = 'Scorpion'
				caracs['element'] = 'feu'
				caracs['categorie'] = 'defensif'
				caracs['img'] = '/images/navadra/monstres/scorpion.png'
			}
			if (rand === 3) {
				caracs['nom'] = 'Vipère'
				caracs['element'] = 'feu'
				caracs['categorie'] = 'offensif'
				caracs['img'] = '/images/navadra/monstres/vipere.png'
			}
			if (rand === 4) {
				caracs['nom'] = 'Lion'
				caracs['element'] = 'feu'
				caracs['categorie'] = 'offensif'
				caracs['img'] = '/images/navadra/monstres/lion.png'
			}
			if (rand === 5) {
				caracs['nom'] = 'Puma'
				caracs['element'] = 'feu'
				caracs['categorie'] = 'equilibre'
				caracs['img'] = '/images/navadra/monstres/puma.png'
			}
			if (rand === 6) {
				caracs['nom'] = 'Dendrobate'
				caracs['element'] = 'eau'
				caracs['categorie'] = 'equilibre'
				caracs['img'] = '/images/navadra/monstres/dendrobate.png'
			}
			if (rand === 7) {
				caracs['nom'] = 'Couleuvre'
				caracs['element'] = 'eau'
				caracs['categorie'] = 'offensif'
				caracs['img'] = '/images/navadra/monstres/couleuvre.png'
			}
			if (rand === 8) {
				caracs['nom'] = 'Sangsue'
				caracs['element'] = 'eau'
				caracs['categorie'] = 'defensif'
				caracs['img'] = '/images/navadra/monstres/sangsue.png'
			}
			if (rand === 9) {
				caracs['nom'] = 'Gavial'
				caracs['element'] = 'eau'
				caracs['categorie'] = 'defensif'
				caracs['img'] = '/images/navadra/monstres/gavial.png'
			}
			if (rand === 10) {
				caracs['nom'] = 'Rage des marais'
				caracs['element'] = 'eau'
				caracs['categorie'] = 'offensif'
				caracs['img'] = '/images/navadra/monstres/rage_des_marais.png'
			}
			if (rand === 11) {
				caracs['nom'] = 'Veuve noire'
				caracs['element'] = 'terre'
				caracs['categorie'] = 'defensif'
				caracs['img'] = '/images/navadra/monstres/veuve_noire.png'
			}
			if (rand === 12) {
				caracs['nom'] = 'Cobra'
				caracs['element'] = 'terre'
				caracs['categorie'] = 'offensif'
				caracs['img'] = '/images/navadra/monstres/cobra.png'
			}
			if (rand === 13) {
				caracs['nom'] = 'Loup'
				caracs['element'] = 'terre'
				caracs['categorie'] = 'equilibre'
				caracs['img'] = '/images/navadra/monstres/loup.png'
			}
			if (rand === 14) {
				caracs['nom'] = 'Sanglier'
				caracs['element'] = 'terre'
				caracs['categorie'] = 'defensif'
				caracs['img'] = '/images/navadra/monstres/sanglier.png'
			}
			if (rand === 15) {
				caracs['nom'] = 'Dévoreur'
				caracs['element'] = 'terre'
				caracs['categorie'] = 'equilibre'
				caracs['img'] = '/images/navadra/monstres/devoreur.png'
			}
			if (rand === 16) {
				caracs['nom'] = 'Chauve-souris'
				caracs['element'] = 'vent'
				caracs['categorie'] = 'defensif'
				caracs['img'] = '/images/navadra/monstres/chauve_souris.png'
			}
			if (rand === 17) {
				caracs['nom'] = 'Vautour'
				caracs['element'] = 'vent'
				caracs['categorie'] = 'equilibre'
				caracs['img'] = '/images/navadra/monstres/vautour.png'
			}
			if (rand === 18) {
				caracs['nom'] = 'Aigle'
				caracs['element'] = 'vent'
				caracs['categorie'] = 'offensif'
				caracs['img'] = '/images/navadra/monstres/aigle.png'
			}
			if (rand === 19) {
				caracs['nom'] = 'Terreur ailée'
				caracs['element'] = 'vent'
				caracs['categorie'] = 'offensif'
				caracs['img'] = '/images/navadra/monstres/terreur_ailee.png'
			}
			if (rand === 20) {
				caracs['nom'] = 'Dard mortel'
				caracs['element'] = 'vent'
				caracs['categorie'] = 'offensif'
				caracs['img'] = '/images/navadra/monstres/dard_mortel.png'
			}
			break
		}
		case 2.5: {
			const rand = getRandomIntInclusive(1, 8)
			if (rand === 1) {
				caracs['nom'] = 'Tigre'
				caracs['element'] = 'feu'
				caracs['categorie'] = 'offensif'
				caracs['img'] = '/images/navadra/monstres/tigre.png'
			}

			if (rand === 2) {
				caracs['nom'] = 'Lynx'
				caracs['element'] = 'feu'
				caracs['categorie'] = 'equilibre'
				caracs['img'] = '/images/navadra/monstres/lynx.png'
			}
			if (rand === 3) {
				caracs['nom'] = 'Varan'
				caracs['element'] = 'eau'
				caracs['categorie'] = 'equilibre'
				caracs['img'] = '/images/navadra/monstres/varan.png'
			}
			if (rand === 4) {
				caracs['nom'] = 'Alligator'
				caracs['element'] = 'eau'
				caracs['categorie'] = 'defensif'
				caracs['img'] = '/images/navadra/monstres/alligator.png'
			}
			if (rand === 5) {
				caracs['nom'] = 'Jaguar'
				caracs['element'] = 'terre'
				caracs['categorie'] = 'offensif'
				caracs['img'] = '/images/navadra/monstres/jaguar.png'
			}
			if (rand === 6) {
				caracs['nom'] = 'Boa'
				caracs['element'] = 'terre'
				caracs['categorie'] = 'equilibre'
				caracs['img'] = '/images/navadra/monstres/boa.png'
			}
			if (rand === 7) {
				caracs['nom'] = 'Brute des plaines'
				caracs['element'] = 'vent'
				caracs['categorie'] = 'defensif'
				caracs['img'] = '/images/navadra/monstres/brute_des_plaines.png'
			}
			if (rand === 8) {
				caracs['nom'] = 'Coureur du vent'
				caracs['element'] = 'vent'
				caracs['categorie'] = 'equilibre'
				caracs['img'] = '/images/navadra/monstres/coureur_du_vent.png'
			}
			break
		}
		case 4.5: {
			const rand = getRandomIntInclusive(1, 8)
			if (rand === 1) {
				caracs['nom'] = 'Fureur des pics'
				caracs['element'] = 'feu'
				caracs['categorie'] = 'offensif'
				caracs['img'] = '/images/navadra/monstres/fureur_des_pics.png'
			}
			if (rand === 2) {
				caracs['nom'] = 'Grizzly'
				caracs['element'] = 'feu'
				caracs['categorie'] = 'defensif'
				caracs['img'] = '/images/navadra/monstres/grizzly.png'
			}
			if (rand === 3) {
				caracs['nom'] = 'Anaconda'
				caracs['element'] = 'eau'
				caracs['categorie'] = 'offensif'
				caracs['img'] = '/images/navadra/monstres/anaconda.png'
			}
			if (rand === 4) {
				caracs['nom'] = 'Hippopotame'
				caracs['element'] = 'eau'
				caracs['categorie'] = 'defensif'
				caracs['img'] = '/images/navadra/monstres/hippopotame.png'
			}
			if (rand === 5) {
				caracs['nom'] = 'Gorille'
				caracs['element'] = 'terre'
				caracs['categorie'] = 'defensif'
				caracs['img'] = '/images/navadra/monstres/gorille.png'
			}
			if (rand === 6) {
				caracs['nom'] = 'Ours brun'
				caracs['element'] = 'terre'
				caracs['categorie'] = 'defensif'
				caracs['img'] = '/images/navadra/monstres/ours_brun.png'
			}
			if (rand === 7) {
				caracs['nom'] = 'Harpie'
				caracs['element'] = 'vent'
				caracs['categorie'] = 'offensif'
				caracs['img'] = '/images/navadra/monstres/harpie.png'
			}
			if (rand === 8) {
				caracs['nom'] = 'Griffon'
				caracs['element'] = 'vent'
				caracs['categorie'] = 'defensif'
				caracs['img'] = '/images/navadra/monstres/griffon.png'
			}
			break
		}
		case 8: {
			const rand = getRandomIntInclusive(1, 4)
			if (rand === 1) {
				caracs['nom'] = 'Cyclope'
				caracs['element'] = 'feu'
				caracs['categorie'] = 'offensif'
				caracs['img'] = '/images/navadra/monstres/cyclope.png'
			}
			if (rand === 2) {
				caracs['nom'] = 'Hydre'
				caracs['element'] = 'eau'
				caracs['categorie'] = 'equilibre'
				caracs['img'] = '/images/navadra/monstres/hydre.png'
			}
			if (rand === 3) {
				caracs['nom'] = 'Minotaure'
				caracs['element'] = 'terre'
				caracs['categorie'] = 'defensif'
				caracs['img'] = '/images/navadra/monstres/minotaure.png'
			}
			if (rand === 4) {
				caracs['nom'] = 'Dragon'
				caracs['element'] = 'vent'
				caracs['categorie'] = 'equilibre'
				caracs['img'] = '/images/navadra/monstres/dragon.png'
			}
			break
		}
	}
	return caracs
}
