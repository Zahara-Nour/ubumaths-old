<script>
	import Fab, { Icon } from '@smui/fab'
	import Slider from '@smui/slider'
	import { Svg } from '@smui/common/elements'
	import Button, { Label } from '@smui/button'
	import Question from './Question.svelte'
	import generate from './generateQuestion'
	import CircularProgress from '$lib/components/CircularProgress.svelte'
	import { onDestroy, onMount } from 'svelte'
	import datas, { getQuestion } from './questions.js'
	import virtualKeyboard from './virtualKeyboard'
	import { getLogger, shuffle } from '$lib/utils'
	import { page } from '$app/stores'
	import { handleKeydown } from '$lib/stores'

	import math from 'tinycas'
	import Exemple from './Exemple.svelte'
	import { mdiRocketLaunchOutline, mdiRestart } from '@mdi/js'
	import { fetchImage } from '$lib/images'
	import { flip } from 'svelte/animate'
	import { fly } from 'svelte/transition'

	const ids = datas.ids
	let { info, fail, trace } = getLogger('Test', 'trace')
	let current = 0
	let answer
	let answer_latex
	let answer_choice
	let answers = []
	let answers_latex = []
	let answers_choice = []
	let times = []
	// let generated
	let generateds = []
	let delay
	let elapsed
	let start
	let percentage
	let timer
	let mf
	let finish = false
	let subdomain
	let domain
	let theme
	let level
	// let choices
	let correct = false
	let restart = false
	let classroom
	let pause = false
	let previous
	let showExemple = false
	let showCorrection = false
	let generatedExemple
	let alert
	let slider
	let min = 0,
		max = 60
	let cards, card

	const togglePause = () => {
		if (pause) {
			start = Date.now()
		} else {
			previous = elapsed
		}
		pause = !pause
	}

	function countDown() {
		if (!pause) {
			elapsed = Date.now() - start + previous
			if (delay >= elapsed) {
				percentage = ((delay - elapsed) * 100) / delay
				if (delay - elapsed < 5000) alert = true
			} else {
				change()
			}
		}
	}

	onDestroy(() => {
		if (timer) clearInterval(timer)
		// if (timeout) clearTimeout(timeout)
		handleKeydown.set(() => {})
	})

	function initMathField() {
		console.log('init mathfield', mf)
		// mf.setOptions({
		// 	// virtualKeyboardMode: 'onfocus',
		// 	decimalSeparator: ',',
		// 	virtualKeyboardMode: 'auto',
		// 	...virtualKeyboard,
		// 	// onKeystroke,
		// 	inlineShortcuts: {
		// 		xx: {},
		// 	},
		// })
		// mf.addEventListener('keystroke', onKeystroke)
		// if (!mf.hasFocus) mf.focus()
	}

	function initTest() {
		info('init test')
		current = 0
		restart = false
		finish = false
		generateds = []
		answers = []
		answers_latex = []
		answers_choice = []
		const basket = JSON.parse(
			decodeURI($page.url.searchParams.get('questions')),
		)
		console.log('basket', basket)
		classroom =
			JSON.parse(decodeURI($page.url.searchParams.get('classroom'))) === 'true'

		showCorrection = !classroom

		let offset = 0
		basket.forEach((q) => {
			const { theme, domain, subdomain, level } = ids[q.id]
			const question = getQuestion(theme, domain, subdomain, level)
			question.delay = q.delay || question.delay || question.defaultDelay

			for (let i = 0; i < q.count; i++) {
				const generated = generate(question, generateds, q.count, offset)

				generateds.push(generated)
			}
			offset += q.count
		})
		shuffle(generateds)

		generateds.forEach((q) => {
			if (q.image) {
				q.imageBase64P = fetchImage(q.image)
			}
			if (q.imageCorrection) {
				q.imageCorrectionBase64P = fetchImage(q.imageCorrection)
			}
			if (q.choices) {
				q.choices.forEach((choice) => {
					if (choice.image) {
						choice.imageBase64P = fetchImage(choice.image)
					}
				})
			}
		})

		cards = [...generateds]
		cards.unshift(null)
		if (classroom && theme) {
			showExemple = true
			generatedExemple = generate(getQuestion(theme, domain, subdomain, level))
		} else {
			change()
		}

		info('Begining test with questions :', generateds)
	}

	function onChoice(choice) {
		// answer = choice
		// answer_latex = choice
		answer_choice = choice
		change()
	}

	function recordAnswer() {
		// console.log('mf value', mf.value)
		answer_latex = mf
			.getValue()
			// on remplace plusieurs espaces par un seul, bizarrz normalement pas besoin
			.replace(/(\\,){2,}/g, '\\,')
			.trim()
		answer = mf.getValue('ascii-math')
		answer = answer
			// .replace(/xx/g, '*')
			.replace(/÷/g, ':')
			.replace(/\((\d+(,\d+)*)\)\//g, (_, p1) => p1 + '/')
			.replace(/\(([a-z])\)\//g, (_, p1) => p1 + '/')
			.replace(/\/\((\d+(,\d+)*)\)/g, (_, p1) => '/' + p1)
			.replace(/\/\(([a-z])\)/g, (_, p1) => '/' + p1)
			.trim()
		trace(`answer latex: ${answer_latex} asccii: ${answer}`)
	}

	function commit() {
		recordAnswer()
		change()
	}

	function beginTest() {
		if (classroom) {
			handleKeydown.set((event) => {
				event.preventDefault()
				if (event.code === 'Space') {
					togglePause()
				} else if (event.code === 'ArrowRight') {
					change()
				}
			})
		}
		showExemple = false
		change()
	}

	function onKeystroke(ev) {
		const allowed = 'azertyuiopsdfghjklmwxcvbn0123456789,=<>/*-+()^%€L'
		const keystroke = ev.detail.keystroke
		const key = ev.detail.event.key
		trace('keystroke', keystroke)
		trace('key', key)
		// if (keystroke === '[Enter]' || keystroke === '[NumpadEnter]') {
		//   trace('answer :' + answer + '!')
		//   if (answer !== '') {
		//     trace('going to commit')
		//     commit()
		//   }
		//   return false
		// } else
		if (
			keystroke === '[Space]' &&
			!(
				answer_latex &&
				answer_latex.length >= 2 &&
				answer_latex.slice(answer_latex.length - 2) === '\\,'
			)
		) {
			mf.insert('\\,')
			return false
		} else if (key === '%') {
			mf.insert('\\%')
			return false
		} else if (key === 'r') {
			mf.insert('\\sqrt')
			return false
		} else if (key === '*') {
			ev.stopPropagation()
			mf.insert('\\times ')
			return false
		} else if (key === ':') {
			mf.insert('\\div ')
			return false
		} else if (key === '<') {
			mf.insert('<')
			return false
		} else if (
			key === 'Backspace' ||
			key === 'ArrowLeft' ||
			key === 'ArrowRight' ||
			key === 'ArrowDown' ||
			key === 'ArrowUp'
		) {
			return true
		} else if (!allowed.includes(key)) {
			return false
		}

		return true
	}

	function onChangeMathField(e) {
		// utile dans le cas d'une expression mal formée
		recordAnswer()
	}

	// on passe à la question suivante
	async function change() {
		current++
		if (timer) clearInterval(timer)
		// if (timeout) clearTimeout(timeout)

		if (cards.length <= generateds.length) {
			answers.push(answer)
			answers_latex.push(answer_latex)
			answers_choice.push(answer_choice)
			let time = Math.min(Math.round(elapsed / 1000), delay)
			if (time === 0) time = 1
			times.push(time)
		}
		if (cards.length > 1) {
			if (mf) {
				mf.setValue('toto')
				// if (!mf.hasFocus()) mf.focus()
			}
			answer = ''
			answer_latex = ''
			answer_choice = null

			cards = [...cards.slice(1, cards.length)]
			card = cards[0]

			// generated = generate(question, generateds)
			// if (generateds) generateds.push(generated)
			if (slider && theme && domain && subdomain && level) {
				delay = slider * 1000
			} else {
				delay = card.delay ? card.delay * 1000 : card.defaultDelay * 1000
				slider = delay / 1000
			}
			percentage = 0
			alert = false
			start = Date.now()
			previous = 0
			timer = setInterval(countDown, 10)
		} else {
			finish = true
			// mathlive bug : virtual keyboard still displays otherwise
			if (mf) mf.blur()
		}
	}

	initTest()

	// le bouton restart a été appuyé après la correction
	$: if (restart) {
		initTest()
	}

	$: if (mf) {
		initMathField()
	}

	// $: if (card && mf && !mf.hasFocus()) {
	// 	mf.focus()
	// }

	// test pour vérifier que l'expression est bien formée à chaque frappe
	$: if (answer) {
		correct = math(answer).type !== '!! Error !!'
	}

	$: delay = slider * 1000
</script>

{#if showExemple}
	<Exemple question="{generatedExemple}" classroom="{true}" />
	<div class="mt-2 flex justify-end">
		<Fab
			class="m-2"
			color="primary"
			on:click="{() =>
				(generatedExemple = generate(
					getQuestion(theme, domain, subdomain, level),
				))}"
			mini
		>
			<Icon component="{Svg}" viewBox="2 2 20 20">
				<path fill="currentColor" d="{mdiRestart}"></path>
			</Icon>
		</Fab>
		<Fab class="m-2" color="primary" on:click="{beginTest}" mini>
			<Icon component="{Svg}" viewBox="2 2 20 20">
				<path fill="currentColor" d="{mdiRocketLaunchOutline}"></path>
			</Icon>
		</Fab>
	</div>
{:else if finish}
	{#if showCorrection}
		Correction
	{:else}
		<div style="height:90vh" class="flex justify-center items-center">
			<Button
				on:click="{() => {
					showCorrection = true
				}}"
				variant="raised"
			>
				<Label>Afficher la correction</Label>
			</Button>
		</div>
	{/if}
{:else if card}
	<div>
		<div class="{' my-1 flex justify-start'}">
			<CircularProgress
				number="{current}"
				fontSize="{20}"
				strokeWidth="{7}"
				percentage="{percentage}"
				pulse="{alert}"
			/>
			{#if slider && classroom}
				<Slider
					bind:value="{slider}"
					min="{min}"
					max="{max}"
					step="{1}"
					discrete
					input$aria-label="Discrete slider"
				/>
			{/if}
		</div>
		<div>
			{#if cards}
				<div id="cards-container">
					<div id="cards">
						{#each cards as card (card.id + card.num)}
							<div
								class="card"
								animate:flip="{{ duration: 700 }}"
								out:fly="{{ x: -500, duration: cards.length > 1 ? 700 : 0 }}"
							>
								<div class=" p-2 elevation-{4} rounded-lg">
									<Question question="{card}" />
									{#if card.choices}
										<div class="mt-3 flex flex-wrap justify-around w-full">
											{#each card.choices as choice, i}
												<!-- <Button size="x-large" class="ml-3 mr-3" on:click="{() => onChoice(i)}"> -->

												<button
													class="rounded-lg  ma-3 pa-3"
													style="border: 5px solid yellow;"
													on:click="{() => {
														if (!classroom) onChoice(i)
													}}"
												>
													{#if choice.image}
														{#await choice.imageBase64P}
															loading image
														{:then base64}
															<img
																class="white"
																src="{base64}"
																style="max-width:400px;max-height:40vh;"
																alt="{`choice ${i}`}"
															/>
														{:catch error}
															{error}
														{/await}
													{/if}
													{#if choice.markup}
														<div>
															{@html choice.markup}
														</div>
													{/if}
												</button>

												<!-- </Button> -->
											{/each}
										</div>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<div class="d-flex align-center justify-center" style="width:100%">
				{#if !card.choices && !classroom}
					<div class="d-flex align-center justify-center " style="width:80%">
						<span class="mr-4">Ta réponse:</span>
						<div class="flex-grow-1" style="width:70%">
							<math-field
								virtual-keyboard-mode="manual"
								on:keystroke="{onKeystroke}"
								keypress-vibration="off"
								remove-extraneous-parentheses="off"
								smart-fence="off"
								smart-superscript="off"
								style="width:100%;"
								class="{correct
									? 'pa-2 light-green lighten-5'
									: 'pa-2 deep-orange lighten-5'}"
								virtual-keyboard-theme="apple"
								on:input="{onChangeMathField}"
								on:change="{() => {
									if (answer !== '') commit()
								}}"
								bind:this="{mf}"
							>
							</math-field>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
{:else}
	Pas de questions
{/if}

<style>
	.error {
		border: 5px solid red;
	}

	.portrait {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.landscape {
		width: 100%;
		display: flex;
		align-items: center;
	}

	.column1 {
		flex-basis: 60%;
		flex-grow: 0;
		flex-shrink: 0;
	}
	.column2 {
		flex-basis: 40%;
		flex-grow: 0;
		flex-shrink: 0;
	}

	#cards-container {
		margin-top: 20px;
		margin-bottom: 20px;
		position: relative;
		/* display: flex; */
		/* flex-direction: column; */
		overflow-x: hidden;
		/* height: 500px; */
		/* max-height: 70vh; */
		width: 100%;
	}
	#cards {
		display: flex;
		flex-wrap: nowrap;
		/* height: 600px; */
		overflow-x: hidden;
		/* height: 100%; */
		width: 100%;
	}
	.card {
		min-width: calc(100% - 24px);
		/* min-width: 95%; */
		/* min-width: 400px; */
		margin: 12px;
		/* height: 100%; */
	}
</style>
