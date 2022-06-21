<script>
	import BackCard from './BackCard.svelte'
	import FrontCard from './FrontCard.svelte'
	import { fontSize } from '$lib/stores'

	export let card
	export let flashcard = false
	export let showDescription = false
	export let onChoice = () => {}

	let flip = false
	const toggleFlip = () => (flip = !flip)

	let hfront = 0
	let hback = 0
	let height
	let init

	async function updateHeight() {
		// console.log('updateHeight')
		height = Math.max(hfront, hback)
		// console.log('height', height)
	}

	$: if (card) {
		// console.log('changing card')
		flip = false

		// Kludge to trigger an updateHeight
		// fontSize.update((size) => size + 1)
		// fontSize.update((size) => size - 1)
	}

	// $: console.log('hback', hback)
	// $: console.log('hfront', hfront)
	// $: console.log('height', height)
	// $: console.log('init', init)
	$: if (flashcard && hfront && hback) {
		updateHeight()
	}

	$: if (!flashcard && hfront) {
		updateHeight()
	}

	$: if ($fontSize) {
		// console.log('changing size')
		height = 0
	}
</script>

<div class="card" style="{height ? `height:${height}px` : ''}">
	<div class="flipper" class:flip style="{height ? 'height:100%' : ''}">
		<div class="front" style="{height ? 'height:100%' : ''}">
			<FrontCard
				card="{card}"
				toggleFlip="{toggleFlip}"
				flashcard="{flashcard}"
				showDescription="{showDescription}"
				height="{height}"
				onChoice="{onChoice}"
			/>
		</div>
		{#if flashcard}
			<div class="back" style="{height ? 'height:100%' : ''}">
				<BackCard
					card="{card}"
					toggleFlip="{toggleFlip}"
					flashcard="{flashcard}"
					height="{height}"
				/>
			</div>
		{/if}
	</div>
</div>

<div class="absolute" style="{'width:95vw;top:-100%;left:-100000%;'}">
	<!-- <div > -->
	<FrontCard
		card="{card}"
		flashcard="{flashcard}"
		showDescription="{showDescription}"
		bind:h="{hfront}"
	/>

	{#if flashcard}
		<BackCard card="{card}" bind:h="{hback}" />
	{/if}
</div>

<style>
	.card {
		width: 100%;
		height: 100%;
		perspective: 1000px;
	}

	.flip {
		transform: rotateY(180deg);
	}

	.flipper {
		transition: 0.6s;
		transform-style: preserve-3d;
		height: 100%;
		position: relative;
		width: 100%;
	}

	/* hide back of pane during swap */
	.front,
	.back {
		-webkit-backface-visibility: hidden;
		backface-visibility: hidden;
		height: 100%;
		width: 100%;
		position: absolute;
		top: 0;
		left: 0;
	}

	/* front pane, placed above back */
	.front {
		z-index: 2;
		/* for firefox 31 */
		transform: rotateY(0deg);
	}

	/* back, initially hidden pane */
	.back {
		transform: rotateY(180deg);
	}
</style>
