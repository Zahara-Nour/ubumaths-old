<script>
	// import Spinner from './Spinner.svelte'
	import math from 'tinycas'
	import { mdiOrbitVariant } from '@mdi/js'
	import Fab, { Icon } from '@smui/fab'
	import { Svg } from '@smui/common/elements'
	import Paper, { Title, Subtitle, Content } from '@smui/paper'
	import { onMount, afterUpdate } from 'svelte'
	import { formatLatex } from '$lib/stores'
	import { mdc_colors } from '$lib/colors'

	export let card
	export let toggleFlip = () => {}
	export let flashcard = true
	export let h
	export let height

	$: answer = $formatLatex('$$' + math(card.solutions[0]).toLatex() + '$$')
	$: details = $formatLatex(card.correctionDetails)
</script>

<div bind:clientHeight="{h}">
	<Paper elevation="{12}" style="{height ? `height:${height-48}px;` : ''}">
		<div class="h-full flex flex-col justify-between">
			<Content class="h-full">
				<div class="h-full flex flex-col items-center justify-around">
					<div style="{` color:${mdc_colors['lime-500']}`}">
						Réponse :
					</div>
					<div class="my-5 z-O relative" style="font-size:2em;">{@html answer}</div>
					{#if details}
						<div class="my-2 z-0 relative">
							{#each details as detail}
								{@html detail.text ? detail.text : detail}
							{/each}
						</div>
					{/if}
				</div>
			</Content>
			{#if flashcard}
				<div class="buttons flex justify-center">
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
	.buttons {
		margin-top: 2em;
	}
</style>
