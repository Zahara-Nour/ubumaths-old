import { getRandomIntInclusive } from '../../../lib/utils'

export function determiner_position_joueur(user) {
	let xmin, ymin, xmax, ymax, x, y
	switch (user.navadra.element) {
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
