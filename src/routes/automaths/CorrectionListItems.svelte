<script>
	import { STATUS_CORRECT, STATUS_UNOPTIMAL_FORM } from './correction'
	import CorrectionItem from './CorrectionItem.svelte'
	import { correct_color, incorrect_color, unoptimal_color } from '$lib/colors'

	export let items
	export let displayDetails
	export let magnify = 1
</script>

{#each items as item}
	{@const color =
		item.status === STATUS_CORRECT
			? correct_color
			: item.status === STATUS_UNOPTIMAL_FORM ||
			  (item.answers &&
					item.statuss.filter((status) => status === STATUS_CORRECT).length >=
						item.answers.length / 2)
			? unoptimal_color
			: incorrect_color}
	<div
		class="flex justify-start items-start mb-3"
		style="{`font-size:${magnify}rem`}"
	>
		<div
			class="mt-1 mr-3 relative"
			style="{`font-size:1.1em;font-family:'pacifico';color:white;background:${color}; border-radius: 50%;width:3ch; height:3ch`}"
		>
			<span
				class="absolute"
				style="top: 50%;left: 50%;transform: translate(-50%, -56%);margin: 0;"
			>
				{item.number}
			</span>
		</div>
		<CorrectionItem item="{item}" displayDetails="{displayDetails}" />
	</div>
{/each}
