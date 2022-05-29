<script>
	// import Spinner from './Spinner.svelte'
	import { mdiOrbitVariant } from '@mdi/js'
	import Fab, { Icon } from '@smui/fab'
	import { Svg } from '@smui/common/elements'
	import Paper, { Title, Subtitle, Content } from '@smui/paper'
	import Question from '/src/routes/automaths/Question.svelte'
	import { onMount, afterUpdate } from 'svelte'
	import { formatLatex } from '$lib/stores'

	export let toggleFlip = () => {}
	export let card
	export let description
	export let flashcard

	export let height

	export let h
	let choices
  

	$: description = $formatLatex(card.description)
	$: subdescription = $formatLatex(card.subdescription)

	$: if (card.choices) {
		choices = card.choices.map((c) => {
			if (c.text) {
				c.text = $formatLatex(c.text)
			}
			return c
		})
	} else {
		choices = null
	}
</script>

<div bind:clientHeight="{h}">
	<Paper elevation="{10}" style="{height ? `height:${height}px;` : ''}">
		<div class="h-full flex flex-col justify-between">
			{#if description}
				<div>
					<Title>
						{@html description}
					</Title>
					{#if subdescription}
						<Subtitle>
							{@html subdescription}
						</Subtitle>
					{/if}
				</div>
			{/if}
			<Content>
				<Question question="{card}" />
				{#if choices}
					<div class="mt-3 flex flex-wrap justify-around w-full">
						{#each choices as choice, i}

							<button
								class="rounded-lg  m-2 p-1"
								style="border: 4px solid yellow;"
								on:click="{() => {}}"
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
									<div class="text-base mdc-typography--body1">
										{@html choice.text}
									</div>
								{/if}
							</button>
						{/each}
					</div>
				{/if}
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
