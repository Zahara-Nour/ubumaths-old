<script>
	// import Spinner from './Spinner.svelte'
	import math from 'tinycas'
	import { mdiOrbitVariant } from '@mdi/js'
	import Fab, { Icon } from '@smui/fab'
	import { Svg } from '@smui/common/elements'
	import Paper, { Title, Subtitle, Content } from '@smui/paper'
	import Button, { Label } from '@smui/button'
	import { formatLatex } from '$lib/stores'
	import { mdc_colors } from '$lib/colors'
	import {
		createDetailedCorrection,
		createCorrection,
	} from '../../routes/automaths/correctionItem'
	import { correct_color } from '../colors'
import CorrectionLine from '../../routes/automaths/CorrectionLine.svelte';

	export let card
	export let toggleFlip = () => {}
	export let h = 0
	export let height = 0
	export let magnify
	export let correction
	export let showDescription

	function getSolution(card) {
		let nSol = -1
		let s

		function replaceSol() {
			nSol += 1
			return math(card.solutions[nSol]).latex
		}

		if (card.choices) {
			if (card.type === 'choices') {
				s = '<div class="flex flex-wrap justify-start">'
				card.choices.forEach((choice, i) => {
					let color = 'grey'
					if (card.solutions.includes(i)) {
						color = correct_color
					}

					s += `<span
					class="rounded-lg  m-2 p-1"
					style="border: 4px solid ${color}"
				>`

					if (choice.image) {
						s += `<img src="${choice.base64}" style="max-width:min(400px,80%);max-height:40vh;" alt="choice ${i}"/>`
					} else {
						s += `<div class="text-base " style="{font-size:1rem}">`
						s += choice.text
						s += '</div>'
					}
					s += '</span>'
				})

				s += '</div>'
			} else {
				s = card.solutions[0]
				s = card.choices[s]
				if (s.text) {
					s = s.text
				} else if (s.image) {
					s = `<img src=${s.image}>`
				}
			}
		} else {
			if (card.answerFields) {
				s = card.answerFields.replace(/\\ldots/g, replaceSol)
				console.log('s', s)
			} else {
				s = card.solutions[0]
				s = '$$' + math(s).latex + '$$'
			}
		}
		return s
	}

	$: description = $formatLatex(card.description)
	$: subdescription = $formatLatex(card.subdescription)
	$: solution = $formatLatex(getSolution(card))
	$: details =
		card.correctionDetails && card.correctionDetails.length
			? createDetailedCorrection(card)
			: createCorrection(card).correction
	$: console.log('details', details)
</script>

<div bind:clientHeight="{h}">
	<Paper elevation="{12}" style="{height ? `height:${height}px;` : ''}">
		<div class="h-full flex flex-col items-center justify-between">
			<!-- correction des réponses de l'utilisateur -->

			{#if correction}
				<div
					class="correction-title"
					style="{` color:${mdc_colors['lime-500']};  position:absolute;top:1em; left:0px`}"
				>
					Détails
				</div>
				<div class="z-0 relative" style="{`font-size:${magnify}rem`}">
					<!-- {#each details as detail}
						<div class="correction-line">
							{@html detail.text ? detail.text : detail}
						</div>
					{/each} -->
					{#each details as line}
							<div class="correction-line z-0">
								<CorrectionLine line="{line}" />
							</div>
						{/each}
				</div>

				<div class=" w-full flex justify-end">
					<Fab color="secondary" on:click="{toggleFlip}" mini>
						<Icon component="{Svg}" viewBox="2 2 20 20">
							<path fill="currentColor" d="{mdiOrbitVariant}"></path>
						</Icon>
					</Fab>
				</div>
			{:else}
				<!-- solution générique -->
				<div
					style="{` color:${mdc_colors['lime-500']}; font-size:${magnify}rem`}"
				>
					Réponse :
				</div>
				<div class="my-5 z-O relative" style="{`font-size:${2 * magnify}rem`}">
					{@html solution}
				</div>
				{#if details}
					<div class="my-2 z-0 relative" style="{`font-size:${magnify}rem`}">
						<!-- {#each details as detail}
							<p>
								{@html detail.text ? detail.text : detail}
							</p>
						{/each} -->
						{#each details as line}
							<div class=" correction-line z-0">
								<CorrectionLine line="{line}" />
							</div>
						{/each}
					</div>
				{/if}
				<div class="mt-3 w-full flex justify-end">
					<Fab color="secondary" on:click="{toggleFlip}" mini>
						<Icon component="{Svg}" viewBox="2 2 20 20">
							<path fill="currentColor" d="{mdiOrbitVariant}"></path>
						</Icon>
					</Fab>
				</div>
			{/if}
		</div>
	</Paper>
</div>

<!-- <div class="card">
  <div class="content">
    Back
  </div>
	<div class="buttons">
		<Fab color="secondary" on:click="{toggleFlip}" mini>
			<Icon component="{Svg}" viewBox="2 2 20 20">
				<path fill="currentColor" d="{mdiOrbitVariant}"></path>
			</Icon>
		</Fab>
	</div>
</div> -->
<style>

	.correction-line {
		margin-top: 9px;
		margin-bottom: 9px;
	}

	.correction-line:first-child {
		margin-top: 0px;
		margin-bottom: 9px;
	}

	.correction-line:last-child {
		margin-top: 9px;
		margin-bottom: 0px;
	}

	.correction-title {
		transform: rotate(-45deg);
	}
</style>
