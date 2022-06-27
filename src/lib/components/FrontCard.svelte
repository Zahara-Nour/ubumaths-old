<script>
	// import Spinner from './Spinner.svelte'
	import { mdiOrbitVariant } from '@mdi/js'
	import Fab, { Icon } from '@smui/fab'
	import { Svg } from '@smui/common/elements'
	import Paper, { Title, Subtitle, Content } from '@smui/paper'
	import Question from '/src/routes/automaths/Question.svelte'
	import { formatLatex } from '$lib/stores'

	export let toggleFlip = () => {}
	export let card
	export let showDescription
	export let flashcard
	export let height = 0
	export let h = 0
	export let onChoice = () => {}
	export let masked = false
	export let interactive
	export let commit

	let choices

	$: description = $formatLatex(card.description)
	$: subdescription = $formatLatex(card.subdescription)

	
</script>

<div bind:clientHeight="{h}">
	<Paper elevation="{12}">
		<div
			class="flex flex-col justify-between"
			style="{height ? `height:${height - 48}px;` : ''}"
		>
			{#if showDescription}
				<div>
					<Title>
						<div class="flex justify-between">
							<span
								class="z-0 relative"
								style="{'color:var(--mdc-theme-primary'}"
								>{@html $formatLatex(description)}</span
							> <span>{card.id} </span>
						</div>
					</Title>
					{#if subdescription}
						<Subtitle>
							<span
								class="z-0 relative"
								style="{'color:var(--mdc-theme-on-surface'}"
								>{@html $formatLatex(subdescription)}</span
							>
						</Subtitle>
					{/if}
				</div>
			{/if}
			<Content>
				<Question
					question="{card}"
					masked="{masked}"
					interactive="{interactive}"
					commit="{commit}"
				/>
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

<style>
	.buttons {
		margin-top: 2em;
	}
</style>
