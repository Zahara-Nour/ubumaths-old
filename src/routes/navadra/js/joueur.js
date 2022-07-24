import { getRandomIntInclusive } from '../../../lib/utils'

function profil_elem(user_profile) {
	const profil = {}
	let total_pyrs_depensees =
		user_profile.pyrs_feu_dep +
		user_profile.pyrs_eau_dep +
		user_profile.pyrs_vent_dep +
		user_profile.pyrs_terre_dep
	if (total_pyrs_depensees == 4) {
		//Si le joueur n'a encore dépensé aucune Pyrs
		profil['feu'] = Math.round(
			(user_profile.pyrs_feu_dep / total_pyrs_depensees) * 100,
		)
		profil['eau'] = Math.round(
			(user_profile.pyrs_eau_dep / total_pyrs_depensees) * 100,
		)
		profil['vent'] = Math.round(
			(user_profile.pyrs_vent_dep / total_pyrs_depensees) * 100,
		)
		profil['terre'] = Math.round(
			(user_profile.pyrs_terre_dep / total_pyrs_depensees) * 100,
		)
		const diff =
			100 - profil['feu'] - profil['eau'] - profil['vent'] - profil['terre'] //Permet de s'assurer que la somme fait 100
		const max = max(...Object.values(profil))
		const elmt = Object.keys(profil).find((key) => profil[key] === max)
		profil[elmt] = profil[elmt] + diff
	} else {
		const feu = user_profile.pyrs_feu_dep - 1
		const eau = user_profile.pyrs_eau_dep - 1
		const vent = user_profile.pyrs_vent_dep - 1
		const terre = user_profile.pyrs_terre_dep - 1
		total_pyrs_depensees -= 4
		profil['feu'] = Math.round((feu / total_pyrs_depensees) * 100)
		profil['eau'] = Math.round((eau / total_pyrs_depensees) * 100)
		profil['vent'] = Math.round((vent / total_pyrs_depensees) * 100)
		profil['terre'] = Math.round((terre / total_pyrs_depensees) * 100)
		const diff =
			100 - profil['feu'] - profil['eau'] - profil['vent'] - profil['terre'] //Permet de s'assurer que la somme fait 100
		const max = Math.max(...Object.values(profil))
		const elmt = Object.keys(profil).find((key) => profil[key] === max)
		profil[elmt] = profil[elmt] + diff
	}
	return profil
}

export function determine_element(user_profile) {
	const profil = profil_elem(user_profile)
	const max = Math.max(...Object.values(profil))
	const maxs = Object.keys(profil).filter((key) => profil[key] === max)

	if (maxs.length > 1) {
		//S'il y a plusieurs maximums à égalité dont l'élément de l'ancien tuteur du joueur
		if (user_profile.tuteur == 'Namuka' && max == profil['feu']) {
			return 'feu'
		} else if (user_profile.tuteur == 'Katillys' && max == profil['eau']) {
			return 'eau'
		} else if (user_profile.tuteur == 'Sivem' && max == profil['vent']) {
			return 'vent'
		} else if (user_profile.tuteur == 'Leorn' && max == profil['terre']) {
			return 'terre'
		}
	}
	//Sinon on prend le premier élément qui est égal au max
	if (max === profil['feu']) {
		return 'feu'
	} else if (max === profil['eau']) {
		return 'eau'
	} else if (max === profil['vent']) {
		return 'vent'
	} else if (max === profil['terre']) {
		return 'terre'
	}
}

export function determiner_position_joueur(user_profile) {
	let xmin, ymin, xmax, ymax, x, y
	switch (user_profile.element) {
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

	return { x, y }
}
