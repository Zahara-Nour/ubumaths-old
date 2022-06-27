/**
 * @vitest-environment jsdom
 */

import '@testing-library/jest-dom'
import { beforeEach, describe, expect, it, vi, test } from 'vitest'
import { render, fireEvent } from '@testing-library/svelte'
import QuestionCard from '$lib/components/QuestionCard.svelte'
import questions from '../src/routes/automaths/questions'
import generate from '../src/routes/automaths/generateQuestion'

describe('testing QuestionCard', () => {
	// console.log(questions.questions)
	const t = []
	const qs = questions.questions
	// jest.spyOn(window.localStorage.__proto__, 'setItem');

	Object.getOwnPropertyNames(qs).forEach((theme) => {
		Object.getOwnPropertyNames(qs[theme]).forEach((domain) => {
			Object.getOwnPropertyNames(qs[theme][domain]).forEach((subdomain) => {
				qs[theme][domain][subdomain].forEach((q, level) => {
					// console.log(`${theme}-${domain}-${subdomain}-${level}`)
					t.push([theme, domain, subdomain, level])
				})
			})
		})
	})

	test.each(t)('%s - %s - %s - %s', async (theme, domain, subdomain, level) => {
		const q = qs[theme][domain][subdomain][level]
		const generated = generate(q)
		const { getByText } = render(QuestionCard, { card: generated })
		expect(getByText('Réponse')).toBeInTheDocument()
	})
})
