<script>
	import QuestionCard from '../../lib/components/QuestionCard.svelte'
	import { createCorrection, createDetailedCorrection } from './correctionItem'
	export let item
	export let displayDetails

	let number, coms, image, imageBase64P, imageCorrection, imageCorrectionBase64P

	let correction = createCorrection(item)
	let detailedCorrection =
		item.correctionDetails && item.correctionDetails.length
			? createDetailedCorrection(item)
			: correction
	// const validateFractions = checkFractions()

	// if (seemsCorrect && !validateAnswer) {
	//   coms.push(FORM)
	// }
	function updateItem() {
		;({
			number,
			coms,
			image,
			imageBase64P,
			imageCorrection,
			imageCorrectionBase64P,
		} = item)
	}

	$: if (item) updateItem()
</script>

{#if correction}
	<div class="ml-3 flex flex-wrap " >
		<div  class="mr-3 mb-3" style="width:400px;">
			<QuestionCard
				card="{item}"
				correction="{true}"
				flashcard="{!!item.correctionDetails}"
			/>
		</div>
		<div>
			{#if coms.length}
				{#each coms as com}
					<div
						class=" mb-1 z-0 relative"
						style="font-family: 'Handlee', cursive;"
					>
						{@html com}
					</div>
				{/each}
			{/if}
		</div>
	</div>
	<!-- <div
		id="{`correction${number}`}"
		style="word-break: break-word ;min-width: 0;white-space: normal;"
	>
		{#if image}
			{#if imageCorrection}
				{#await imageCorrectionBase64P}
					loading image
				{:then base64}
					<img
						src="{base64}"
						class="my-3"
						style="max-width:500px;max-height:40vh;"
						alt="Alright Buddy!"
					/>
				{:catch error}
					{error}
				{/await}
			{:else}
				{#await imageBase64P}
					loading image
				{:then base64}
					<img
						src="{base64}"
						class="my-3"
						style="max-width:500px;max-height:40vh;"
						alt="Alright Buddy!"
					/>
				{:catch error}
					{error}
				{/await}
			{/if}
		{/if}
		{#if displayDetails && item.correctionDetails}
			{#each detailedCorrection as line}
				<div class="mb-1 z-0 relative">
					{@html line}
				</div>
			{/each}
		{:else}
			{#each correction as line}
				<div class=" mb-1 z-0 relative">
					{@html line}
				</div>
			{/each}

			
		{/if}
	</div> -->
{/if}
