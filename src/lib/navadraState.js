import { createMachine, interpret } from 'xstate'
import { player } from '$lib/navadraStore'
import { playersManager } from '../routes/navadra/js/player'

import { get } from 'svelte/store'

const tutoMachine = createMachine({
	predictableActionArguments: true,
	id: 'tuto',
	initial: 'index_1',
	states: {
		index_1: {
			on: { NEXT: 'combattre_2' },
		},
		combattre_2: {
			on: { NEXT: 'index_3' },
		},
		index_3: {
			on: { NEXT: 'accueil_defi_4' },
		},
		accueil_defi_4: {
			on: { NEXT: 'fin_defi_5' },
		},
		fin_defi_5: {
			on: { NEXT: 'grimoire_6' },
		},
		grimoire_6: {
			on: { NEXT: 'grimoire_7' },
		},
		grimoire_7: {
			on: { NEXT: 'index_8' },
		},
		index_8: {
			on: { NEXT: 'prepa_combats_9' },
		},
		prepa_combats_9: {
			on: { NEXT: 'combats_decks_10' },
		},
		combats_decks_10: {
			on: { NEXT: 'combattre_11' },
		},
		combattre_11: {
			on: { NEXT: 'index_12' },
		},
		index_12: {
			on: { NEXT: 'fini' },
		},
		fini: {
			type: 'final',
		},
	},
})

export const tuto = interpret(tutoMachine).onTransition(async (state) => {
	const p = get(player)
	if (p) {
		p.profile.tuto = JSON.stringify(state)
		await playersManager.updateDB(p.profile)
	}
})



const createFightMachine = (playerStamina, monsterStamina) => createMachine({
	predictableActionArguments: true,
	id: 'fight',
	initial: 'spell_choice',
    context:{playerStamina, monsterStamina},
	states: {
		spell_choice: {
			on: { INVOCATION: 'question' },
		},
		question: {
            on: { CORRECT: 'player_attack', INCORRECT: 'monster_attack' },
        },
		player_attack: {
			on: { MONSTER_DEAD: 'victory', MONSTER_ALIVE:'monster_attack' },
		},
		monter_attack: {
			on: { PLAYER_DEAD: 'defeat', PLAYER_ALIVE:'spell_choice' },
		},
		
		victory: {
			type: 'final',
		},
		defeat: {
			type: 'final',
		},
	},
})


const fightMachine = createMachine({
	predictableActionArguments: true,
	id: 'fight',
	initial: 'spell_choice',
	states: {
		spell_choice: {
			on: { INVOCATION: 'question' },
		},
		question: {
            on: { CORRECT: 'player_attack', INCORRECT: 'monster_attack' },
        },
		player_attack: {
			on: { MONSTER_DEAD: 'victory', MONSTER_ALIVE:'monster_attack' },
		},
		monter_attack: {
			on: { PLAYER_DEAD: 'defeat', PLAYER_ALIVE:'spell_choice' },
		},
		
		victory: {
			type: 'final',
		},
		defeat: {
			type: 'final',
		},
	},
})

export const fight = interpret(fightMachine)
