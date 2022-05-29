<script>
	import math from 'tinycas'

	import BackCard from './BackCard.svelte'
	import FrontCard from './FrontCard.svelte'
	import { fontSize } from '$lib/stores'

	export let card
	export let flashcard = false
	export let description = false

	let flip = false
	const toggleFlip = () => (flip = !flip)
	$: if (card) flip = false

	let hfront
	let hback
	let height
	let init = false

	async function updateHeight() {
		height = Math.max(hfront, hback) - 48
		init=true
	}


	$: if (hfront && hback && !init) {
		updateHeight()
	}

	$: if ($fontSize) {
		init = false
		hfront=0
		hback=0
		height=0
	}

</script>

<div class="card" style="{height ? `height:${height+48}px` : ''}">
	<div class="flipper" class:flip style="{height ? `height:${height+48}px` : ''}" >
		<div class="front" style="{height ? `height:${height+48}px` : ''}">
			<FrontCard
				card="{card}"
				toggleFlip="{toggleFlip}"
				flashcard="{flashcard}"
				description="{description}"
				bind:h={hfront}
				height="{height}"
			/>
		</div>
		<div class="back">
			<BackCard
				card="{card}"
				toggleFlip="{toggleFlip}"
				flashcard="{flashcard}"
				bind:h={hback}
				height="{height}"
			/>
		</div>
	</div>
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
