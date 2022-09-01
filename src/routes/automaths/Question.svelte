<script>
	import { toMarkup } from '$lib/stores'
	import { formatLatex } from '$lib/stores'
	import { MathfieldElement } from '$lib/stores'
	import { afterUpdate, onMount, onDestroy, getContext } from 'svelte'
	import { getLogger } from '$lib/utils'
	import virtualKeyboard from './virtualKeyboard'
	import Button, { Label } from '@smui/button'

	export let question
	export let interactive = false
	export let masked = false
	export let commit
	export let magnify = 1

	let { fail, trace, info } = getLogger('correction', 'trace')
	let enounce
	let enounce2
	let expression
	let expression2
	let mfs
	let nmfs = 0
	let answers
	let answers_latex
	let choices
	let selecteds
	let onChoice = (i) => {
		if (interactive) {
			if (question.type === 'choices') {
				selecteds[i] = !selecteds[i]
				answers.splice(0, answers.length)
				selecteds.forEach((selected, i) => {
					if (selected) {
						answers.push(i)
					}
				})
				console.log('answers', answers)
			} else {
				answers.push(i)
				console.log('onChoice')
				commit.f()
			}
		}
	}
	let showExp

	let keyListeners = []
	let inputListeners = []
	let changeListeners = []

	if (commit) {
		commit.hook = () => {
			removeListeners()
		}
	}

	const params = getContext('question-params')
	// console.log('context', params)

	function createMarkup(s) {
		return s ? $toMarkup(s) : null
	}

	function createLatex(s) {
		return s ? $formatLatex(s) : null
	}

	function recordAnswer(i) {
		answers_latex[i] = mfs[i]
			.getValue()
			// on remplace plusieurs espaces par un seul, bizarrz normalement pas besoin
			.replace(/(\\,){2,}/g, '\\,')
			.trim()
		answers[i] = mfs[i].getValue('ascii-math')
		answers[i] = answers[i]
			// .replace(/xx/g, '*')
			.replace(/÷/g, ':')
			.replace(/\((\d+(,\d+)*)\)\//g, (_, p1) => p1 + '/')
			.replace(/\(([a-z])\)\//g, (_, p1) => p1 + '/')
			.replace(/\/\((\d+(,\d+)*)\)/g, (_, p1) => '/' + p1)
			.replace(/\/\(([a-z])\)/g, (_, p1) => '/' + p1)
			.trim()
		trace(`answer latex: ${answers_latex[i]} asccii: ${answers[i]}`, answers)
	}

	function removeListeners() {
		if (mfs) {
			mfs.forEach((mfe, i) => {
				mfe.removeEventListener('keystroke', keyListeners[i])
				mfe.removeEventListener('input', inputListeners[i])
				mfe.removeEventListener('change', changeListeners[i])
			})
		}
	}

	function onChange(ev, i) {
		console.log('onChange', ev, i, masked, question.num)
		// removeListeners()
		commit.f()
	}

	function onInput(ev, i) {
		recordAnswer(i)
	}

	// keystroke on physical keyboard
	function onKeystroke(ev, i) {
		const key_allowed = 'azertyuiopsdfghjklmwxcvbn0123456789,=<>/*-+()^%€L'
		const key_allowed2 = [
			'Backspace',
			'ArrowLeft',
			'ArrowRight',
			'ArrowDown',
			'ArrowUp',
		]
		const keystroke_allowed = ['[Enter]', '[NumpadEnter]']

		const keystroke = ev.detail.keystroke
		const key = ev.detail.event.key
		// trace('keystroke', keystroke)
		// trace('key', key)
		// console.log(i)
		// console.log(answers_latex[i])
		// console.log(answers_latex[i].length)
		// console.log('+' + answers_latex[i].slice(answers_latex[i].length - 2) + '+')
		// if (keystroke === '[Enter]' || keystroke === '[NumpadEnter]') {
		// ev.preventDefault()
		// commit()
		// } else
		if (
			keystroke === '[Space]' &&
			!(
				answers_latex[i] &&
				answers_latex[i].length >= 2 &&
				answers_latex[i].slice(answers_latex[i].length - 2) === '\\,'
			)
		) {
			ev.preventDefault()
			console.log('mfs', mfs)
			console.log('i', i)
			mfs[i].insert('\\,')
		} else if (key === '%') {
			ev.preventDefault()
			mf.insert('\\%')
		} else if (key === 'r') {
			ev.preventDefault()
			mf.insert('\\sqrt')
		} else if (key === '*') {
			ev.preventDefault()
			mf.insert('\\times ')
		} else if (key === ':') {
			ev.preventDefault()
			mf.insert('\\div ')
		} else if (key === '<') {
			ev.preventDefault()
			mf.insert('<')
		} else if (
			!key_allowed.includes(key) &&
			!key_allowed2.includes(key) &&
			!keystroke_allowed.includes(keystroke)
		) {
			ev.preventDefault()
		}
	}

	function addMathfield() {
		nmfs += 1
		return `<span id='mf${nmfs}'/>`
	}

	onDestroy(() => {
		removeListeners()
	})

	afterUpdate(() => {
		if (interactive) {
			if (showExp && expression) {
				const elements = []
				for (let i of document
					.querySelector('#expression')
					.querySelectorAll('*')) {
					if (/^mf/g.test(i.id)) {
						elements.push(i)
					}
				}
				if (expression2) {
					for (let i of document
						.querySelector('#expression2')
						.querySelectorAll('*')) {
						if (/^mf/g.test(i.id)) {
							elements.push(i)
						}
					}
				}
				elements.forEach((elt) => {
					if (!elt.hasChildNodes()) {
						const mfe = new $MathfieldElement()
						mfe.setOptions({
							soundsDirectory: '/sounds',
							virtualKeyboardMode: 'onfocus',
							// virtualKeyboardMode: 'manual',
							decimalSeparator: ',',
							...virtualKeyboard,
							inlineShortcuts: {
								xx: {},
							},
							keypressVibration: false,
							removeExtraneousParentheses: false,
							smartFence: false,
							superscript: false,
						})
						mfs.push(mfe)
						// answers.push('')
						// answers_latex.push('')
						elt.appendChild(mfe)
						elt.style.display = 'inline-block'
						elt.style.minWidth = '2em'
						elt.style.border = '2px dashed grey'
						elt.style.borderRadius = '5px'
						const i = mfs.length - 1
						if (!masked) {
							const keyListener = (ev) => onKeystroke(ev, i)
							const inputListener = (ev) => onInput(ev, i)
							const changeListener = (ev) => onChange(ev, i)
							keyListeners.push(keyListener)
							inputListeners.push(inputListener)
							changeListeners.push(changeListener)
							mfe.addEventListener('keystroke', keyListener)
							mfe.addEventListener('input', inputListener)
							mfe.addEventListener('change', changeListener)
						}
					}
				})
				if (!masked && mfs && mfs.length) {
					mfs[0].focus()
				}
			}
		}
	})

	// $: if (question.choices) {
	// 	choices = question.choices.map((c) => {
	// 		if (c.text) {
	// 			c.text = $formatLatex(c.text)
	// 		}
	// 		return c
	// 	})
	// } else {
	// 	choices = null
	// }
	// test pour vérifier que l'expression est bien formée à chaque frappe
	// $: if (answer) {
	// 	correct = !math(answer).isIncorrect()
	// }

	$: if (question && !masked && interactive) {
		console.log(question)

		keyListeners.forEach((listener, i) =>
			mfs[i].removeEventListener('key', listener),
		)
		inputListeners.forEach((listener, i) =>
			mfs[i].removeEventListener('input', listener),
		)
		changeListeners.forEach((listener, i) =>
			mfs[i].removeEventListener('change', listener),
		)
		keyListeners = []
		inputListeners = []
		changeListeners = []
		selecteds = []
		mfs = []
		nmfs = 0
		if (params) {
			answers = params.answerss[question.num - 1]
			answers_latex = params.answerss_latex[question.num - 1]
		}
	}

	// console.log('question', question)
	$: {
		showExp =
			(expression &&
				!(question.options && question.options.includes('no-exp'))) ||
			(interactive &&
				question.type === 'result' &&
				(!question.expression_latex ||
					(question.options && question.options.includes('no-exp'))))
		console.log('showExp', showExp)
	}

	$: enounce = question.enounce ? $formatLatex(question.enounce) : null

	$: enounce2 = question.enounce2 ? $formatLatex(question.enounce2) : null

	$: {
		if (interactive) {
			if (
				question.type !== 'choice' &&
				question.type !== 'choices' &&
				(!question.expression_latex ||
					(question.options && question.options.includes('no-exp')))
			) {
				expression = '\\ldots'
			} else {
				expression = question.expression_latex
				if (question.type === 'result') {
					expression += '=\\ldots'
				}
			}
		}

		if (interactive && question.prefix) {
			expression = question.prefix+expression
		}
		console.log('expression', expression, interactive, question.type)

		

		if (expression) {
			expression = $toMarkup(expression)
			if (interactive) {
				expression = expression.replace(/…/g, addMathfield)
			}
		}
	}

	$: {
		expression2 = question.expression2_latex

		if (interactive && question.type === 'equation') expression2 += '=\\ldots'
		expression2 = $toMarkup(expression2 || '')
		if (interactive) {
			expression2 = expression2.replace(/…/g, addMathfield)
		}
	}
</script>

<div class="flex flex-col items-center justify-around">
	{#each question.order_elements as element}
		{#if element === 'enounce' && enounce}
			<div
				id="enounce"
				class="mt-3 mb-3 text-center max-w-4xl leading-normal"
				style="{`font-size:${magnify}rem`}"
			>
				{@html enounce}
			</div>
		{:else if element === 'enounce2' && enounce2}
			<div
				id="enounce2"
				class="mt-3 mb-3  text-center max-w-4xl"
				style="{`font-size:${magnify}rem`}"
			>
				{@html enounce2}
			</div>
		{:else if element === 'enounce-image' && question.image}
			{#await question.imageBase64P}
				loading image
			{:then base64}
				<img
					src="{base64}"
					class="my-3 w-full max-w-lg"
					style="max-height:40vh;"
					alt="Alright Buddy!"
				/>
			{:catch error}
				{error}
			{/await}
		{:else if element === 'expression' && expression}
			{#if showExp}
				<div
					id="expressions"
					class="my-3 flex flex-col items-center justify-center"
				>
					<div id="expression" class="my-3" style="{`font-size:${magnify}rem`}">
						{@html expression}
					</div>
					{#if expression2 && !(!interactive && question.type === 'equation')}
						<div
							id="expression2"
							class="mt-4"
							style="{`font-size:${magnify}rem`}"
						>
							{@html expression2}
						</div>
					{/if}
				</div>
			{/if}
		{:else if element === 'choices' && question.choices}
			<div class="mt-3 flex flex-wrap justify-around">
				{#each question.choices as choice, i}
					<button
						class="rounded-lg  m-2 p-1"
						style="{`border: 4px solid ${
							selecteds && i < selecteds.length && selecteds[i]
								? 'var(--mdc-theme-primary)'
								: 'var(--mdc-theme-secondary)'
						};`}"
						on:click="{() => onChoice(i)}"
					>
						{#if choice.image}
							{#await choice.imageBase64P}
								loading image
							{:then base64}
								<img
									class="white"
									src="{base64}"
									style="max-width:min(400px,80%);max-height:40vh;"
									alt="{`choice ${i}`}"
								/>
							{:catch error}
								{error}
							{/await}
						{/if}
						{#if choice.text}
							<div class="text-base " style="{`font-size:${magnify}rem`}">
								{@html $formatLatex(choice.text)}
							</div>
						{/if}
					</button>
				{/each}
			</div>
			{#if question.type === 'choices'}
				<Button on:click="{commit.f}" variant="raised">
					<Label>Valider</Label>
				</Button>
			{/if}
		{/if}
	{/each}
</div>
