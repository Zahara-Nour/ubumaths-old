import { getLogger, getRandomIntInclusive } from '$lib/utils'
import { get } from 'svelte/store'
import { player } from '$lib/navadraStore'
import { insertDB, selectDB, updateDB } from '$lib/db'
import { monstersManager } from './monsters'

let { trace, info, fail, warn } = getLogger('player', 'trace')

const playerPrototype = {
	getElementsStats() {
		const profile = {}
		let totalSpentPyrs =
			this.profile.spentFirePyrs +
			this.profile.spentWaterPyrs +
			this.profile.spentWindPyrs +
			this.profile.spentEarthPyrs
		if (totalSpentPyrs == 4) {
			//Si le joueur n'a encore dépensé aucune Pyrs
			profile['feu'] = Math.round(
				(this.profile.spentFirePyrs / totalSpentPyrs) * 100,
			)
			profile['eau'] = Math.round(
				(this.profile.spentWaterPyrs / totalSpentPyrs) * 100,
			)
			profile['vent'] = Math.round(
				(this.profile.spentWindPyrs / totalSpentPyrs) * 100,
			)
			profile['terre'] = Math.round(
				(this.profile.spentEarthPyrs / totalSpentPyrs) * 100,
			)
			const diff =
				100 -
				profile['feu'] -
				profile['eau'] -
				profile['vent'] -
				profile['terre'] //Permet de s'assurer que la somme fait 100
			const max = max(...Object.values(profile))
			const elmt = Object.keys(profile).find((key) => profile[key] === max)
			profile[elmt] = profile[elmt] + diff
		} else {
			const feu = this.profile.spentFirePyrs - 1
			const eau = this.profile.spentWaterPyrs - 1
			const vent = this.profile.spentWindPyrs - 1
			const terre = this.profile.spentEarthPyrs - 1
			totalSpentPyrs -= 4
			profile['feu'] = Math.round((feu / totalSpentPyrs) * 100)
			profile['eau'] = Math.round((eau / totalSpentPyrs) * 100)
			profile['vent'] = Math.round((vent / totalSpentPyrs) * 100)
			profile['terre'] = Math.round((terre / totalSpentPyrs) * 100)
			const diff =
				100 -
				profile['feu'] -
				profile['eau'] -
				profile['vent'] -
				profile['terre'] //Permet de s'assurer que la somme fait 100
			const max = Math.max(...Object.values(profile))
			const elmt = Object.keys(profile).find((key) => profile[key] === max)
			profile[elmt] = profile[elmt] + diff
		}
		return profile
	},

	defineElement() {
		const profile = this.getElementsStats()
		console.log('profile elements', profile)
		const max = Math.max(...Object.values(profile))
		const maxs = Object.keys(profile).filter((key) => profile[key] === max)
		let element

		if (maxs.length > 1) {
			//S'il y a plusieurs maximums à égalité dont l'élément de l'ancien tutor du joueur
			if (this.profile.tutor == 'Namuka' && max == profile['feu']) {
				element = 'feu'
			} else if (this.profile.tutor == 'Katillys' && max == profile['eau']) {
				element = 'eau'
			} else if (this.profile.tutor == 'Sivem' && max == profile['vent']) {
				element = 'vent'
			} else if (this.profile.tutor == 'Leorn' && max == profile['terre']) {
				element = 'terre'
			}
		} else {
			//Sinon on prend le premier élément qui est égal au max
			if (max === profile['feu']) {
				element = 'feu'
			} else if (max === profile['eau']) {
				element = 'eau'
			} else if (max === profile['vent']) {
				element = 'vent'
			} else if (max === profile['terre']) {
				element = 'terre'
			} else {
				fail('defineElement')
			}
		}

		return element
	},

	get element() {
		return this.defineElement()
	},
	get stamina() {
		let level = 1
		let st = 10
		while (level < this.level) {
			level++
			st = Math.ceil(st + level * 3.75)
		}
		return st
	},

	get pm() {
		let level = 1
		let magicPower = 7
		while (level < this.level) {
			level++
			magicPower = Math.ceil(magicPower + level * 1.12)
		}
		return magicPower
	},

	definePosition() {
		let xmin, ymin, xmax, ymax, x, y
		console.log('element', this.element)
		switch (this.element) {
			case 'feu':
				xmin = 530
				xmax = 680
				ymin = 500
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
				ymin = 550
				ymax = 720
				break
			case 'terre':
				xmin = 500
				xmax = 680
				ymin = 170
				ymax = 380
				break
		}
		x = getRandomIntInclusive(xmin, xmax) / 10
		y = getRandomIntInclusive(ymin, ymax) / 10
		const position = { x, y }
		this.profile.position = position
	},
}

export const playersManager = {
	createPlayer(profile) {
		const player = Object.create(playerPrototype)
		const defaults = {
			level: 1,
			xp: 0,
			firePyrs: 0,
			windPyrs: 0,
			waterPyrs: 0,
			earthPyrs: 0,
			spentFirePyrs: 0,
			spentWindPyrs: 0,
			spentWaterPyrs: 0,
			spentEarthPyrs: 0,
			prestige: 0,
		}
		player.profile = { ...defaults, ...profile }
		player.monsters = []
		return player
	},

	async loadDB() {
		const profile = await selectDB({
			table: 'navadra_players',
			single: true,
		})

		if (profile) {
			trace('player loaded', profile)
			const p = this.createPlayer(profile)
			p.monsters = []
			profile.monsters.forEach(async (id) => {
				const monster = await monstersManager.loadDB(id)
				p.monsters.push(monster)
			})
			return p
		} else {
			return null
		}
	},

	async saveDB(profile) {
		const returnedProfile = await insertDB({
			table: 'navadra_players',
			rows: [profile],
			single: true,
		})
		trace('player saved', returnedProfile)
	},

	async updateDB(profile) {
		const returnedProfile = await updateDB({
			table: 'navadra_players',
			columns: profile,
		})
		trace('player updated', returnedProfile)
	},
}
