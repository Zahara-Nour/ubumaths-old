<script>
	import Paper, { Title, Subtitle, Content } from '@smui/paper'
	import { mdiMinus, mdiPlus } from '@mdi/js'
	import Fab, { Icon } from '@smui/fab'
	import { Svg } from '@smui/common/elements'
	import Question from './Question.svelte'
	import generate from './generateQuestion'
	import datas, { getQuestion } from './questions.js'

	const ids = datas.ids

	export let basket
	export let courseAuxNombres

	const addItem = (i) => {
		basket[i].count++
		basket = basket
	}

	function removeItem(i) {
		if (basket[i].count > 1) {
			basket[i].count--
		} else {
			basket.splice(i, 1)
		}
		basket = basket
	}

	const lessTime = (i) => {
		if (basket[i].delay < 5) {
			basket[i].delay = 0
		} else {
			basket[i].delay = basket[i].delay - 5
		}
		basket = basket
	}

	const moreTime = (i) => {
		basket[i].delay = basket[i].delay + 5
		basket = basket
	}
</script>

<!-- <TextField filled bind:value="{evalTitle}" rules="{titleRules}">Titre</TextField
> -->

{#if basket.length}
	{#each basket as item, i}
		{@const { theme, domain, subdomain, level } = ids[item.id]}
		{@const question = getQuestion(theme, domain, subdomain, level)}
		<div class="my-4 flex flex-row">
			<Paper elevation="6" style="width:80%;max-width:500px">
				<Title>{question.description}</Title>

				{#if question.subdescription}
					<Subtitle>{@html question.subdescription}</Subtitle>
				{/if}

				<Content>
					<Question question="{generate(question)}" />
				</Content>
			</Paper>

			<div class="ma-2 flex flex-col">
				{#if !courseAuxNombres}
					<div class="flex flex-row justify-center">
						<div class="mt-2">
							répétition: {basket[i].count}
						</div>
					</div>
				{/if}
				<div class="ml-2 flex flex-row justify-center">
					<Fab
						class="m-2"
						color="secondary"
						on:click="{() => removeItem(i)}"
						mini
					>
						<Icon component="{Svg}" viewBox="2 2 20 20">
							<path fill="currentColor" d="{mdiMinus}"></path>
						</Icon>
					</Fab>
					{#if !courseAuxNombres}
						<Fab
							class="m-2"
							color="secondary"
							on:click="{() => addItem(i)}"
							mini
						>
							<Icon component="{Svg}" viewBox="2 2 20 20">
								<path fill="currentColor" d="{mdiPlus}"></path>
							</Icon>
						</Fab>
					{/if}
				</div>

				{#if !courseAuxNombres}
					<div class="flex flex-row justify-center">
						<div class="mt-2">
							temps: {basket[i].delay} s
						</div>
					</div>
					<div class="ml-2 flex flex-row justify-center">
						<Fab
							class="m-2"
							color="secondary"
							on:click="{() => lessTime(i)}"
							mini
						>
							<Icon component="{Svg}" viewBox="2 2 20 20">
								<path fill="currentColor" d="{mdiMinus}"></path>
							</Icon>
						</Fab>
						<Fab
							class="m-2"
							color="secondary"
							on:click="{() => moreTime(i)}"
							mini
						>
							<Icon component="{Svg}" viewBox="2 2 20 20">
								<path fill="currentColor" d="{mdiPlus}"></path>
							</Icon>
						</Fab>
					</div>
				{/if}
			</div>
		</div>
	{/each}
{:else}
	<div>Le panier est vide.</div>
{/if}
