<script>
	import Fab, { Icon } from '@smui/fab'
	import Slider from '@smui/slider'
	import { Svg } from '@smui/common/elements'
	import Button, { Label } from '@smui/button'
	import generate from './generateQuestion'
	import CircularProgress from '$lib/components/CircularProgress.svelte'
	import { afterUpdate, onDestroy, onMount, setContext } from 'svelte'
	import datas, { getQuestion } from './questions.js'
	import { getLogger, shuffle } from '$lib/utils'
	import { createTimer } from '$lib/timer'
	import { page } from '$app/stores'
	import { virtualKeyboardMode, touchDevice } from '$lib/stores'

	import math from 'tinycas'
	import {
		mdiRocketLaunchOutline,
		mdiRestart,
		mdiKeyboard,
		mdiLaunch,
	} from '@mdi/js'
	import { fetchImage } from '$lib/images'
	import Correction from './Correction.svelte'
	import QuestionCard from '$lib/components/QuestionCard.svelte'

	const ids = datas.ids
	let { info, fail, trace } = getLogger('Test', 'trace')
	let current
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
	let courseAuxNombres
	let pause = false
	let previous
	let showExemple = false
	let showCorrection = false
	let alert
	let slider = 0
	let min = 0,
		max = 60
	let cards, card
	let generatedExemple
	let basket
	let go = false
	const testParams = {}
	let commit
	let ref
	let fontSize
	let remaining
	let commits = []

	setContext('test-params', testParams)

	onMount(() => {
		if (ref) {
			const style = window.getComputedStyle(ref)
			fontSize = parseInt(
				style.getPropertyValue('font-size').replace('px', ''),
				10,
			)
		}
	})

	afterUpdate(() => {
		if (ref) {
			const style = window.getComputedStyle(ref)
			fontSize = parseInt(
				style.getPropertyValue('font-size').replace('px', ''),
				10,
			)
		}
	})

	function countDown() {
		if (!pause) {
			elapsed = Date.now() - start + previous
			if (delay >= elapsed) {
				percentage = ((delay - elapsed) * 100) / delay
				alert = delay - elapsed < 5000
			} else {
				commit.exec()
			}
		}
	}

	onDestroy(() => {
		if (timer) {
			if (timer.stop) {
				timer.stop()
			} else {
				clearInterval(timer)
			}
		}
		// if (timeout) clearTimeout(timeout)
	})

	function initTest() {
		info('init test')
		current = -1
		restart = false
		finish = false
		go = false
		cards = []
		classroom = JSON.parse(decodeURI($page.url.searchParams.get('classroom')))
		courseAuxNombres = JSON.parse(
			decodeURI($page.url.searchParams.get('courseAuxNombres')),
		)
		testParams.courseAuxNombres = courseAuxNombres
		testParams.classroom = classroom

		basket = JSON.parse(decodeURI($page.url.searchParams.get('questions')))

		showCorrection = !classroom

		let offset = 0
		basket.forEach((q) => {
			const { theme, domain, subdomain, level } = ids[q.id]
			const question = getQuestion(theme, domain, subdomain, level)
			question.delay = q.delay || question.delay || question.defaultDelay
			//  check that delay is a multiple of five
			const rest = question.delay % 5
			question.delay = question.delay + 5 - rest

			for (let i = 0; i < q.count; i++) {
				const generated = generate(question, cards, q.count, offset)

				cards.push(generated)
			}
			offset += q.count
		})
		shuffle(cards)

		cards.forEach((q, i) => {
			q.results = {}
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
						choice.imageBase64P.then((base64) => {
							choice.base64 = base64
						})
					}
				})
			}
		})

		if (classroom && basket.length === 1) {
			showExemple = true
			generateExemple()
		}

		info('Begining test with questions :', cards)
	}

	function generateExemple() {
		const { theme, domain, subdomain, level } = ids[basket[0].id]
		const question = getQuestion(theme, domain, subdomain, level)
		generatedExemple = generate(question)
	}

	function onChoice(choice) {
		change()
	}

	function onChoices(choice) {
		change()
	}

	function beginTest() {
		showExemple = false
		go = true
		if (courseAuxNombres) {
			const tick = () => {
				remaining = timer.getTime()
			}
			if (timer && timer.stop) {
				timer.stop()
			}
			timer = createTimer(7 * 60, tick, commit)
			remaining = timer.getTime()
			timer.start()
		} else {
			// on passe à la première question
			change()
		}
	}

	// on passe à la question suivante
	async function change() {
		current++
		if (timer) clearInterval(timer)
		// if (timeout) clearTimeout(timeout)

		if (current !== 0) {
			let time = Math.min(Math.round(elapsed / 1000), delay)
			if (time === 0) time = 1
			card.time = time
		}
		if (current < cards.length) {
			card = cards[current]

			if (slider && basket.length === 1) {
				delay = slider * 1000
			} else {
				delay = card.delay
					? card.delay * 1000
					: card.defaultDelay
					? card.defaultDelay * 1000
					: 20000
				slider = delay / 1000
			}
			slider = Math.min(slider, 60)
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

	function togglePause() {
		if (pause) {
			start = Date.now()
		} else {
			previous = elapsed
		}
		pause = !pause
	}

	function handleKeydown(ev) {
		if (classroom) {
			ev.preventDefault()
			if (ev.code === 'Space') {
				togglePause()
			} else if (ev.code === 'ArrowRight') {
				change()
			}
		}
	}

	initTest()

	// le bouton restart a été appuyé après la correction
	$: if (restart) {
		initTest()
	}

	$: delay = slider * 1000
	$: virtualKeyboardMode.set($touchDevice)
	$: console.log('slider', slider)

	commit = {
		exec: function () {
			if (this.hook) {
				this.hook()
			}
			if (!courseAuxNombres) {
				change()
			}
		},
	}
</script>

<svelte:window on:keydown="{handleKeydown}" />

{#if showExemple}
	<QuestionCard card="{generatedExemple}" flashcard="{true}" magnify="{2.5}" />
	<div class="mt-2 flex justify-end">
		<Fab class="m-2" color="primary" on:click="{generateExemple}" mini>
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
			items="{cards}"
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
{:else if !go}
	<div style="height:90vh" class="flex justify-center items-center">
		<Button
			on:click="{() => {
				beginTest()
			}}"
			variant="raised"
		>
			<Label>Let's go !</Label>
		</Button>
	</div>
{:else if courseAuxNombres}
	Course aux nombres
	{#if remaining}
		{`${remaining.minutes}:${remaining.seconds < 10 ? '0' : ''}${
			remaining.seconds
		}`}
	{/if}
	{#each cards as card}
		<div class="card">
			<div class=" p-2 elevation-{4} rounded-lg">
				<QuestionCard
					card="{card}"
					onChoice="{onChoice}"
					interactive="{true}"
					commit="{(() => {
						const c = {...commit}
						commits.push(c)
						return c
					})()}"
				/>
			</div>
		</div>
	{/each}
	<div class="flex justify-center items-center">
		<Button
			on:click="{() => {
				timer.stop()
				commits.forEach((commit) => commit.exec())
				finish = true
			}}"
			variant="raised"
		>
			<Label>Valider</Label>
		</Button>
	</div>
{:else if card}
	<div bind:this="{ref}">
		<div class="{' my-1 flex justify-start items-center'}">
			<CircularProgress
				number="{current + 1}"
				fontSize="{classroom ? 2.5 * fontSize : fontSize + 5}"
				percentage="{percentage}"
				pulse="{alert}"
			/>
			{#if slider && classroom}
				<Slider
					bind:value="{slider}"
					min="{min}"
					max="{max}"
					step="{5}"
					discrete
					tickMarks
					input$aria-label="Discrete slider"
					style="width:150px;"
				/>
			{/if}
			<Fab
				class="mx-1"
				color="{$virtualKeyboardMode ? 'primary' : 'secondary'}"
				on:click="{() => {
					virtualKeyboardMode.update((state) => {
						return !state
					})
				}}"
				mini
			>
				<Icon component="{Svg}" viewBox="2 2 20 20">
					<path fill="currentColor" d="{mdiKeyboard}"></path>
				</Icon>
			</Fab>
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
								magnify="{classroom ? 2.5 : 1}"
								immediateCommit="{true}"
							/>
						</div>
					</div>
				{/each}
				<!-- </div> -->
			</div>
		{/if}
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

	.card {
		/* left:300px; */
		min-width: calc(100% - 24px);
		/* min-width: 95%; */
		/* min-width: 400px; */
		margin: 12px;
		/* height: 100%; */
	}
</style>
