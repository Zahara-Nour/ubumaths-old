<script>
  import {createCorrection, createDetailedCorrection} from './correctionItem'
	export let item
	export let displayDetails

	let number,
		correctionDetails,
		coms,
		image,
		imageBase64P,
		imageCorrection,
		imageCorrectionBase64P

	let correction = createCorrection(item)
	let detailedCorrection = correctionDetails
		? createDetailedCorrection(item)
		: null
	// const validateFractions = checkFractions()

	// if (seemsCorrect && !validateAnswer) {
	//   coms.push(FORM)
	// }
	function updateItem() {
		;({	
			number,
			correctionDetails,
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
	<div
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
				<p class="mb-1 z-0 relative" >
					{@html line}
				</p>
			{/each}
		{:else}
			{#each correction as line}
				<div class=" mb-1 z-0 relative">
					{@html line}
				</div>
			{/each}

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
		{/if}
	</div>
{/if}
