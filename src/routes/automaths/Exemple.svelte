<script>
	import Paper, { Title, Subtitle, Content } from '@smui/paper'
	import { toMarkup } from '$lib/stores'

	// import { menuFontSize, classroomFontSize } from '../../app/stores'
	let menuFontSize = 12
	let classroomFontSize = 32

	import Question from './Question.svelte'

	export let question
	export let classroom = false
	let choices

	const regex = /\$\$(.*?)\$\$/g
	const replacement = (_, p1) => $toMarkup(p1)
	const formatLatex = (s) => s.replace(regex, replacement)

	$: description = question.description ? formatLatex(question.description) : ''

	$: subdescription = question.subdescription
		? formatLatex(question.subdescription)
		: ''

	$: if (question.choices) {
		choices = question.choices.map((c) => {
			if (c.text) {
				c.text = formatLatex(c.text)
			}
			return c
		})
	} else {
		choices = null
	}
</script>

<Paper elevation="12" class="mt-2" style="{classroom ? 'height:60vh;' : ''}">
	{#if !classroom}
		<div class="flex items-center justify-start">
			<Title>{question.id} {@html description}</Title>
			<span class="p-1 m-1">{question.grade}</span>
		</div>
		{#if subdescription}
			<Subtitle>{@html subdescription}</Subtitle>
		{/if}
	{/if}
	<Content style="{classroom ? 'height:90%;' : ''}">
		<div
			class="flex flex-col items-center justify-around"
			style="{classroom ? 'height:100%;' : ''}"
		>
			<Question
				size="{classroom ? classroomFontSize : menuFontSize}"
				question="{question}"
			/>

			{#if choices}
				<div class="mt-3 flex flex-wrap justify-around w-full">
					{#each choices as choice, i}
						<!-- <Button size="x-large" class="ml-3 mr-3" on:click="{() => onChoice(i)}"> -->

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
								<div
									style="font-size:{classroom
										? classroomFontSize
										: menuFontSize}px;"
								>
									{@html choice.text}
								</div>
							{/if}
						</button>
					{/each}
				</div>
			{/if}
		</div>
	</Content>
</Paper>
