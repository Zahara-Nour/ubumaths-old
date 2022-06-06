<script>
	import CorrectionListItems from './CorrectionListItems.svelte'
	import { mdiHome, mdiReload, mdiScanHelper } from '@mdi/js'
	import Fab from '@smui/fab'
	import { Icon } from '@smui/common'
	import { Svg } from '@smui/common/elements'
	import { onMount } from 'svelte'
	import { mode, toMarkup } from '$lib/stores'
	import { assessItems } from './correction'
	import { correct_color, incorrect_color, unoptimal_color } from '$lib/colors'

	import { getLogger } from '$lib/utils'
	import { goto } from '$app/navigation'
	import math from 'tinycas'

	export let questions
	export let answers
	export let answers_latex
	export let answers_choice
	export let times
	export let restart
	export let query
	export let classroom

	const { info, fail } = getLogger('Correction', 'info')
	let percent
	let displayDetails = false
	const toggleDetails = () => (displayDetails = !displayDetails)
	let colorResult
	let messageResult

	// inititalisation
	let { items, score, total } = assessItems(
		questions,
		answers,
		answers_latex,
		answers_choice,
		times,
		classroom,
	)

	// Quand le composant de correction a fini de s'afficher,
	// le score a déjà été calculé, on l'enregistre
	onMount(async () => {
		percent = score / total

		if (percent === 1) {
			colorResult = correct_color
			messageResult = 'Perfect !'
		} else if (percent >= 0.8) {
			colorResult = correct_color
			messageResult = 'Good Job !'
		} else if (percent >= 0.5) {
			colorResult = unoptimal_color
			messageResult = 'Keep on !'
		} else {
			colorResult = incorrect_color
			messageResult = 'Try again !'
		}

		// évaluation à sauvegarder
	})

	let displayHelp = false
	let congrats = false

	function toggleDisplayHelp() {
		displayHelp = !displayHelp
	}
</script>

<div>
	<div class="my-3 flex justify-end">
		<Fab class="mx-1" color="secondary" on:click="{toggleDetails}" mini>
			<Icon component="{Svg}" viewBox="2 2 20 20">
				<path fill="currentColor" d="{mdiScanHelper}"></path>
			</Icon>
		</Fab>
	</div>

	{#if classroom}
		<div class="flex  justify-around w-full" style="overflow-x:auto;">
			<div>
				<CorrectionListItems
					items="{items.filter((_, i) => i + 1 <= items.length / 2)}"
					displayDetails="{displayDetails}"
				/>
			</div>
			<div>
				<CorrectionListItems
					items="{items.filter((_, i) => i + 1 > items.length / 2)}"
					displayDetails="{displayDetails}"
				/>
			</div>
		</div>
	{:else}
		<div class="flex flex-col w-full">
			<CorrectionListItems items="{items}" displayDetails="{displayDetails}" />
		</div>
	{/if}

	{#if $mode !== 'classroom'}
		<div
			class="{'p-2 flex items-center  justify-around'}"
			style="{`background:${colorResult}`}"
		>
			<div class="flex flex-col items-center justify-around h-full">
				<Fab
					class="mx-1 my-3"
					color="{classroom ? 'primary' : 'secondary'}"
					on:click="{() => (restart = true)}"
					mini
				>
					<Icon component="{Svg}" viewBox="2 2 20 20">
						<path fill="currentColor" d="{mdiReload}"></path>
					</Icon>
				</Fab>
				<Fab
					class="mx-1 my-3"
					color="{classroom ? 'primary' : 'secondary'}"
					on:click="{() => goto('/automaths' + query)}"
					mini
				>
					<Icon component="{Svg}" viewBox="2 2 20 20">
						<path fill="currentColor" d="{mdiHome}"></path>
					</Icon>
				</Fab>
			</div>
			<div class="flex flex-col items-center">
				<div
					class="my-2"
					style="font-size:2em;color:white; font-family:'pacifico'"
				>
					{messageResult}
				</div>
				<div class="my-2">
					Score : <span style="font-size:1.5em;font-family:'pacifico'"
						>{math(score).toString({ comma: true })}</span
					> <span style="font-size:1.5em;"> / </span><span
						style="font-size:1.5em; font-family:'pacifico'">{total}</span
					>
				</div>
			</div>
			{#if percent === 1}
				<img alt="Great!" src="/images/great-150.png" />
			{:else if percent >= 0.8}
				<img alt="Good job!" src="/images/good-job-150.png" />
			{:else if percent >= 0.5}
				<img alt="Keep on!" src="/images/keep-on-150.png" />
			{:else}
				<img alt="Try again!" src="/images/try-again-150.png" />
			{/if}
		</div>
	{/if}
</div>

<style>
	/* pacifico-regular - latin */

	.container {
		padding-top: 15px;
		padding-bottom: 15px;
		width: 100%;
		height: 350px;
		border: 8px solid rgb(255, 215, 165);
		border-radius: 15px;
		box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.2);
	}
	#deck {
		width: 100%;
		height: 100%;
	}
</style>
