<script>
	import Fab, { Icon } from '@smui/fab'
	import Slider from '@smui/slider'
	import { Svg } from '@smui/common/elements'
	import Button, { Label } from '@smui/button'
	import generate from './generateQuestion'
	import CircularProgress from '$lib/components/CircularProgress.svelte'
	import { onDestroy, setContext } from 'svelte'
	import datas, { getQuestion } from './questions.js'
	import { getLogger, shuffle } from '$lib/utils'
	import { page } from '$app/stores'
	import { handleKeydown, mathliveReady } from '$lib/stores'

	import math from 'tinycas'
	import { mdiRocketLaunchOutline, mdiRestart } from '@mdi/js'
	import { fetchImage } from '$lib/images'
	import Correction from './Correction.svelte'
	import QuestionCard from '$lib/components/QuestionCard.svelte'

	const ids = datas.ids
	let { info, fail, trace } = getLogger('Test', 'trace')
	let current
	let answerss = []
	let answerss_latex = []
	let times = []
	let delay
	let elapsed
	let start
	let percentage
	let timer
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
	let alert
	let slider
	let min = 0,
		max = 60
	let cards, card

	setContext('question-params', { answerss, answerss_latex })

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

	function initTest() {
		info('init test')
		current = -1
		restart = false
		finish = false
		cards = []
		answerss.splice(0, answerss.length)
		answerss_latex.splice(0, answerss_latex.length)

		const basket = JSON.parse(
			decodeURI($page.url.searchParams.get('questions')),
		)
		classroom =
			JSON.parse(decodeURI($page.url.searchParams.get('classroom'))) === 'true'

		showCorrection = !classroom

		let offset = 0
		basket.forEach((q) => {
			const { theme, domain, subdomain, level } = ids[q.id]
			const question = getQuestion(theme, domain, subdomain, level)
			question.delay = q.delay || question.delay || question.defaultDelay

			for (let i = 0; i < q.count; i++) {
				const generated = generate(question, cards, q.count, offset)

				cards.push(generated)
			}
			offset += q.count
		})
		shuffle(cards)

		cards.forEach((q, i) => {
			answerss.push([])
			answerss_latex.push([])
			q.num = i + 1
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

		// cards.unshift(null)
		if (classroom && theme) {
			showExemple = true
			generatedExemple = generate(getQuestion(theme, domain, subdomain, level))
		} else {
			change()
		}

		info('Begining test with questions :', cards)
	}

	function onChoice(choice) {
		change()
	}

	function onChoices(choice) {

		change()
	}

	function commit() {
		console.log('commit')
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

	// on passe à la question suivante
	async function change() {
		current++
		console.log('change', current)
		if (timer) clearInterval(timer)
		// if (timeout) clearTimeout(timeout)

		if (current !==0) {
			let time = Math.min(Math.round(elapsed / 1000), delay)
			if (time === 0) time = 1
			times.push(time)
		}
		if (current < cards.length) {
			card = cards[current]

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
		}
	}

	function cardIn(node, { delay = 0, duration = 400 }) {
		return {
			delay,
			duration,
			css: (t, u) => `left: ${u * 100}%`,
		}
	}
	function cardOut(node, { delay = 0, duration = 400 }) {
		return {
			delay,
			duration,
			css: (t, u) => `left: ${t * 100}%`,
		}
	}

	initTest()

	// le bouton restart a été appuyé après la correction
	$: if (restart) {
		initTest()
	}

	$: delay = slider * 1000
</script>

{#if showExemple}
	<div class="mt-2 flex justify-end">
		<Fab
			class="m-2"
			color="primary"
			on:click="{() => {
				generatedExemple = generate(
					getQuestion(theme, domain, subdomain, level),
				)
			}}"
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
		<Correction
			questions="{cards}"
			answerss="{answerss}"
			answerss_latex="{answerss_latex}"
			times="{times}"
			query="{location.search}"
			classroom="{classroom}"
			bind:restart
			theme="{theme}"
			domain="{domain}"
			subdomain="{subdomain}"
			level="{level}"
		/>
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
				number="{current + 1}"
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

		{#if cards}
			<div id="cards-container">
				<!-- <div id="cards"> -->
					{#each [cards[current]] as card (current)}
				
						<div class="card">
							<div class=" p-2 elevation-{4} rounded-lg">
								<QuestionCard
									card="{card}"
									onChoice="{onChoice}"
									interactive="{!classroom}"
									commit="{commit}"
								/>
							</div>
						</div>
					{/each}
				<!-- </div> -->
			</div>
		{/if}

		<!-- {#if !card.choices && !classroom}
				<div class="flex items-center justify-center " style="width:80%">
					<span class="mr-4">Ta réponse:</span>
					<div class="flex-grow-1" style="width:70%">
						{#if $mathliveReady}
							<math-field
								virtual-keyboard-mode="manual"
								decimal-separator=","
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
						{/if}
					</div>
				</div>
			{/if} -->
	</div>
{:else}
	Pas de questions
{/if}

<style>
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
		/* left:300px; */
		min-width: calc(100% - 24px);
		/* min-width: 95%; */
		/* min-width: 400px; */
		margin: 12px;
		/* height: 100%; */
	}
</style>
