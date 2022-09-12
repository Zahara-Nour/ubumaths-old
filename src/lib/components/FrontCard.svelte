<script>
	// import Spinner from './Spinner.svelte'
	import { mdiOrbitVariant } from '@mdi/js'
	import Fab, { Icon } from '@smui/fab'
	import { Svg } from '@smui/common/elements'
	import Paper, { Title, Subtitle, Content } from '@smui/paper'
	import Question from '/src/routes/automaths/Question.svelte'
	import { formatLatex } from '$lib/stores'
	import { mdc_colors } from '$lib/colors'
	import Button, { Label } from '@smui/button'

	export let toggleFlip = () => {}
	export let card
	export let showDescription
	export let flashcard
	export let height = 0
	export let h = 0
	export let masked = false
	export let interactive
	export let commit
	export let magnify
	export let correction

	let choices

	$: description = $formatLatex(card.description)
	$: subdescription = $formatLatex(card.subdescription)
</script>

<div bind:clientHeight="{h}">
	<Paper elevation="{12}">
		<div
			class="flex flex-col  justify-between"
			style="{height ? `height:${height - 48}px;` : ''}"
		>
			{#if showDescription}
				<div>
					<div class="flex items-center justify-between">
						<div class="flex justify-left items-center">
							<div style="margin-left:3rem">
								<Title>
									<span
										class="z-0 relative"
										style="{'color:var(--mdc-theme-primary'}"
									>
										{@html $formatLatex(description)}
									</span>
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
							<Button
								color="{correction ? 'primary' : 'secondary'}"
								class="ml-3"
								on:click="{() => (correction = !correction)}"
								variant="raised"
							>
								<Label>Mode correction</Label>
							</Button>
						</div>
						<span>{card.id}</span>
					</div>
					<hr class="my-3 mx-0" />
				</div>
			{/if}
			{#if correction}
				<div
					class="correction-title"
					style="{` color:${mdc_colors['lime-500']}; font-size:1rem; position:absolute;top:1.5em;left:-6px`}"
				>
					Correction
				</div>
			{/if}
			<Content>
				<Question
					question="{card}"
					masked="{masked}"
					magnify="{magnify}"
					correction="{correction}"
					interactive="{interactive}"
					commit={commit}
				/>
			</Content>
			{#if flashcard && !(correction && (!card.correctionDetails || !card.correctionDetails.length))}
				<div class=" flex justify-end">
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
	.correction-title {
		transform: rotate(-45deg);
	}

	.buttons {
		margin-top: 2em;
	}
</style>
