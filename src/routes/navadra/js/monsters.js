import { getRandomIntInclusive } from '$lib/utils'
import { player } from '$lib/navadraStore'
import { get } from 'svelte/store'
import { insertDB, selectDB, updateDB } from '$lib/db'
import { playersManager } from './player'

export const monstersManager = {
	createMonster(params = {}) {
		const monster = Object.create(monsterPrototype)

		// les caractéristiques par défaut
		const nbHunters = params.nbHunters || 1
		const level = params.level || 1
		const characs = setMonsterCharacs(nbHunters)

		// params écrase les caractéristiques par défaut
		// et proviennent en général de la base de données.
		monster.profile = {
			nbHunters,
			level,
			userId: get(player).profile.userId,
			...characs,
			...params,
		}

		return monster
	},
	async loadDB(monsterId) {
		const data = await selectDB({
			table: 'navadra_monsters',
			eq: [['id', monsterId]],
			single: true,
		})
		console.log('loaded monster', data)
		const monster = this.createMonster(data)
		return monster
	},

	async saveDB(profile) {
		const data = await insertDB({
			table: 'navadra_monsters',
			rows: [profile],
			single: true,
		})
		console.log('saved monster', data)
		return data
	},

	async updateDB(profile) {
		const data = await updateDB({
			table: 'navadra_monsters',
			eq: [['id', profile.id]],
			columns: profile,
		})
		console.log('updated monster', data)
	},
}
// prototype des montres
const monsterPrototype = {
	get pm() {
		// on crée un joueur du même niveau que le monstre
		const p = playersManager.createPlayer({ level: get(player).profile.level })
		const coeffPlayer = 0.33
		const bonusType = 0.67
		let base = Math.ceil(p.stamina * coeffPlayer)
		switch (this.profile.category) {
			case 'offensif':
				base = (1 + bonusType) * base
				break

			case 'defensif':
				base = bonusType * base
				break
		}
		if (this.profile.nbHunters == 4.5) {
			//Si ce sont des monstres multijoueurs balèzes on leur donne un bonus
			base = base * 1.05
		} else if (this.profile.nbHunters == 8) {
			//Si ce sont des monstres multijoueurs balèzes on leur donne un bonus
			base = base * 1.1
		}
		return Math.round(base)
	},
	get stamina() {
		// on crée un joueur du même niveau que le monstre
		const p = playersManager.createPlayer({ level: get(player).profile.level })
		const coeffPlayer = 3.5
		const bonusType = 0.67
		let base = Math.floor(p.pm * coeffPlayer + 0.07 * p.pm * this.profile.level)
		switch (this.profile.category) {
			case 'offensif':
				base = bonusType * base
				break
			case 'defensif':
				base = (1 + bonusType) * base
				break
		}
		return Math.round(this.profile.nbHunters * base)
	},

	defineBorderColorHex() {
		switch (this.element) {
			case 'feu':
				return '#ad0101'
			case 'eau':
				return '#016dad'
			case 'vent':
				return '#f2b819'
			case 'terre':
				return '#0aae02'
		}
	},

	defineNameColorHex() {
		switch (this.element) {
			case 'feu':
				return '#eec2c3'
			case 'eau':
				return '#caecf6'
			case 'vent':
				return '#f1eec1'
			case 'terre':
				return '#ccf7ca'
		}
	},

	definePosition() {
		const playerProfile = get(player).profile
		console.log('playerProfile', playerProfile)
		const playerPosition = playerProfile.position
		console.log('playerPosition', playerPosition)
		let ok = 1
		const playerWidth = 10 //On prend la largeur du joueur et des monstres
		const playerHeight = 10
		const monsterWidth = 12
		const monsterHeight = 10
		let xmin, xmax, ymin, ymax
		let x, y
		while (ok > 0) {
			switch (
				this.profile.element //Détermination de l'intervalle de position possible en fonction de l'élément du monster
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
				Math.abs(x - playerPosition.x) <= playerWidth &&
				Math.abs(y - playerPosition.y) <= playerHeight
			) {
				// Si la position générée se chevauche avec celle du joueur
				ok++
			}
			//On récupère chaque monster pour tester le chevauchement de position
			get(player).monsters.forEach((monster) => {
				if (
					Math.abs(x - monster.position.x) <= monsterWidth &&
					Math.abs(y - monster.position.y) <= monsterHeight
				) {
					// Si la position générée se chevauche avec celle du monster
					ok++
				}
			})
		}
		this.profile.position = {
			x,
			y,
		}
	},
}

export function hydrateMonstre(params = {}) {
	const monster = Object.create(monsterPrototype)
	Object.assign(monster, {
		...params,
	})
	return monster
}

function setMonsterCharacs(nbHunters) {
	//Permet d'attribuer des caractéristiques aléatoire à un nouveau monster en fonction du nb de chasseurs recommandé
	const caracs = []
	switch (nbHunters) {
		case 1: {
			const rand = getRandomIntInclusive(1, 20)
			if (rand === 1) {
				caracs['name'] = 'Iguane'
				caracs['element'] = 'feu'
				caracs['category'] = 'equilibre'
				caracs['img'] = '/images/navadra/monstres/iguane.png'
			}
			if (rand === 2) {
				caracs['name'] = 'Scorpion'
				caracs['element'] = 'feu'
				caracs['category'] = 'defensif'
				caracs['img'] = '/images/navadra/monstres/scorpion.png'
			}
			if (rand === 3) {
				caracs['name'] = 'Vipère'
				caracs['element'] = 'feu'
				caracs['category'] = 'offensif'
				caracs['img'] = '/images/navadra/monstres/vipere.png'
			}
			if (rand === 4) {
				caracs['name'] = 'Lion'
				caracs['element'] = 'feu'
				caracs['category'] = 'offensif'
				caracs['img'] = '/images/navadra/monstres/lion.png'
			}
			if (rand === 5) {
				caracs['name'] = 'Puma'
				caracs['element'] = 'feu'
				caracs['category'] = 'equilibre'
				caracs['img'] = '/images/navadra/monstres/puma.png'
			}
			if (rand === 6) {
				caracs['name'] = 'Dendrobate'
				caracs['element'] = 'eau'
				caracs['category'] = 'equilibre'
				caracs['img'] = '/images/navadra/monstres/dendrobate.png'
			}
			if (rand === 7) {
				caracs['name'] = 'Couleuvre'
				caracs['element'] = 'eau'
				caracs['category'] = 'offensif'
				caracs['img'] = '/images/navadra/monstres/couleuvre.png'
			}
			if (rand === 8) {
				caracs['name'] = 'Sangsue'
				caracs['element'] = 'eau'
				caracs['category'] = 'defensif'
				caracs['img'] = '/images/navadra/monstres/sangsue.png'
			}
			if (rand === 9) {
				caracs['name'] = 'Gavial'
				caracs['element'] = 'eau'
				caracs['category'] = 'defensif'
				caracs['img'] = '/images/navadra/monstres/gavial.png'
			}
			if (rand === 10) {
				caracs['name'] = 'Rage des marais'
				caracs['element'] = 'eau'
				caracs['category'] = 'offensif'
				caracs['img'] = '/images/navadra/monstres/rage_des_marais.png'
			}
			if (rand === 11) {
				caracs['name'] = 'Veuve noire'
				caracs['element'] = 'terre'
				caracs['category'] = 'defensif'
				caracs['img'] = '/images/navadra/monstres/veuve_noire.png'
			}
			if (rand === 12) {
				caracs['name'] = 'Cobra'
				caracs['element'] = 'terre'
				caracs['category'] = 'offensif'
				caracs['img'] = '/images/navadra/monstres/cobra.png'
			}
			if (rand === 13) {
				caracs['name'] = 'Loup'
				caracs['element'] = 'terre'
				caracs['category'] = 'equilibre'
				caracs['img'] = '/images/navadra/monstres/loup.png'
			}
			if (rand === 14) {
				caracs['name'] = 'Sanglier'
				caracs['element'] = 'terre'
				caracs['category'] = 'defensif'
				caracs['img'] = '/images/navadra/monstres/sanglier.png'
			}
			if (rand === 15) {
				caracs['name'] = 'Dévoreur'
				caracs['element'] = 'terre'
				caracs['category'] = 'equilibre'
				caracs['img'] = '/images/navadra/monstres/devoreur.png'
			}
			if (rand === 16) {
				caracs['name'] = 'Chauve-souris'
				caracs['element'] = 'vent'
				caracs['category'] = 'defensif'
				caracs['img'] = '/images/navadra/monstres/chauve_souris.png'
			}
			if (rand === 17) {
				caracs['name'] = 'Vautour'
				caracs['element'] = 'vent'
				caracs['category'] = 'equilibre'
				caracs['img'] = '/images/navadra/monstres/vautour.png'
			}
			if (rand === 18) {
				caracs['name'] = 'Aigle'
				caracs['element'] = 'vent'
				caracs['category'] = 'offensif'
				caracs['img'] = '/images/navadra/monstres/aigle.png'
			}
			if (rand === 19) {
				caracs['name'] = 'Terreur ailée'
				caracs['element'] = 'vent'
				caracs['category'] = 'offensif'
				caracs['img'] = '/images/navadra/monstres/terreur_ailee.png'
			}
			if (rand === 20) {
				caracs['name'] = 'Dard mortel'
				caracs['element'] = 'vent'
				caracs['category'] = 'offensif'
				caracs['img'] = '/images/navadra/monstres/dard_mortel.png'
			}
			break
		}
		case 2.5: {
			const rand = getRandomIntInclusive(1, 8)
			if (rand === 1) {
				caracs['name'] = 'Tigre'
				caracs['element'] = 'feu'
				caracs['category'] = 'offensif'
				caracs['img'] = '/images/navadra/monstres/tigre.png'
			}

			if (rand === 2) {
				caracs['name'] = 'Lynx'
				caracs['element'] = 'feu'
				caracs['category'] = 'equilibre'
				caracs['img'] = '/images/navadra/monstres/lynx.png'
			}
			if (rand === 3) {
				caracs['name'] = 'Varan'
				caracs['element'] = 'eau'
				caracs['category'] = 'equilibre'
				caracs['img'] = '/images/navadra/monstres/varan.png'
			}
			if (rand === 4) {
				caracs['name'] = 'Alligator'
				caracs['element'] = 'eau'
				caracs['category'] = 'defensif'
				caracs['img'] = '/images/navadra/monstres/alligator.png'
			}
			if (rand === 5) {
				caracs['name'] = 'Jaguar'
				caracs['element'] = 'terre'
				caracs['category'] = 'offensif'
				caracs['img'] = '/images/navadra/monstres/jaguar.png'
			}
			if (rand === 6) {
				caracs['name'] = 'Boa'
				caracs['element'] = 'terre'
				caracs['category'] = 'equilibre'
				caracs['img'] = '/images/navadra/monstres/boa.png'
			}
			if (rand === 7) {
				caracs['name'] = 'Brute des plaines'
				caracs['element'] = 'vent'
				caracs['category'] = 'defensif'
				caracs['img'] = '/images/navadra/monstres/brute_des_plaines.png'
			}
			if (rand === 8) {
				caracs['name'] = 'Coureur du vent'
				caracs['element'] = 'vent'
				caracs['category'] = 'equilibre'
				caracs['img'] = '/images/navadra/monstres/coureur_du_vent.png'
			}
			break
		}
		case 4.5: {
			const rand = getRandomIntInclusive(1, 8)
			if (rand === 1) {
				caracs['name'] = 'Fureur des pics'
				caracs['element'] = 'feu'
				caracs['category'] = 'offensif'
				caracs['img'] = '/images/navadra/monstres/fureur_des_pics.png'
			}
			if (rand === 2) {
				caracs['name'] = 'Grizzly'
				caracs['element'] = 'feu'
				caracs['category'] = 'defensif'
				caracs['img'] = '/images/navadra/monstres/grizzly.png'
			}
			if (rand === 3) {
				caracs['name'] = 'Anaconda'
				caracs['element'] = 'eau'
				caracs['category'] = 'offensif'
				caracs['img'] = '/images/navadra/monstres/anaconda.png'
			}
			if (rand === 4) {
				caracs['name'] = 'Hippopotame'
				caracs['element'] = 'eau'
				caracs['category'] = 'defensif'
				caracs['img'] = '/images/navadra/monstres/hippopotame.png'
			}
			if (rand === 5) {
				caracs['name'] = 'Gorille'
				caracs['element'] = 'terre'
				caracs['category'] = 'defensif'
				caracs['img'] = '/images/navadra/monstres/gorille.png'
			}
			if (rand === 6) {
				caracs['name'] = 'Ours brun'
				caracs['element'] = 'terre'
				caracs['category'] = 'defensif'
				caracs['img'] = '/images/navadra/monstres/ours_brun.png'
			}
			if (rand === 7) {
				caracs['name'] = 'Harpie'
				caracs['element'] = 'vent'
				caracs['category'] = 'offensif'
				caracs['img'] = '/images/navadra/monstres/harpie.png'
			}
			if (rand === 8) {
				caracs['name'] = 'Griffon'
				caracs['element'] = 'vent'
				caracs['category'] = 'defensif'
				caracs['img'] = '/images/navadra/monstres/griffon.png'
			}
			break
		}
		case 8: {
			const rand = getRandomIntInclusive(1, 4)
			if (rand === 1) {
				caracs['name'] = 'Cyclope'
				caracs['element'] = 'feu'
				caracs['category'] = 'offensif'
				caracs['img'] = '/images/navadra/monstres/cyclope.png'
			}
			if (rand === 2) {
				caracs['name'] = 'Hydre'
				caracs['element'] = 'eau'
				caracs['category'] = 'equilibre'
				caracs['img'] = '/images/navadra/monstres/hydre.png'
			}
			if (rand === 3) {
				caracs['name'] = 'Minotaure'
				caracs['element'] = 'terre'
				caracs['category'] = 'defensif'
				caracs['img'] = '/images/navadra/monstres/minotaure.png'
			}
			if (rand === 4) {
				caracs['name'] = 'Dragon'
				caracs['element'] = 'vent'
				caracs['category'] = 'equilibre'
				caracs['img'] = '/images/navadra/monstres/dragon.png'
			}
			break
		}
	}
	return caracs
}
