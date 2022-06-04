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
		imageCorrectionBase64

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
			imageCorrectionBase64,
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
				{#await imageCorrectionBase64}
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
				<div class="mx-2 my-2" >
					{@html line}
				</div>
			{/each}
		{:else}
			{#each correction as line}
				<p class="mx-2  my-2 z-0 relative">
					{@html line}
				</p>
			{/each}

			{#if coms.length}
				{#each coms as com}
					<p
						class="mx-2 my-2 z-0 relative"
						style="font-family: 'Handlee', cursive;"
					>
						{@html com}
					</p>
				{/each}
			{/if}
		{/if}
	</div>
{/if}
