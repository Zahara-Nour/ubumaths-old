<script>
	import { STATUS_CORRECT, STATUS_UNOPTIMAL_FORM } from './correction'
	import CorrectionItem from './CorrectionItem.svelte'
	import { correct_color, incorrect_color, unoptimal_color } from '$lib/colors'

	export let items
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
		class="w-full flex justify-start items-start mb-5"
		
	>
		<div
			class="relative mr-0"
			style="{`font-size:${magnify}rem;font-family:'pacifico';color:white;background:${color}; border-radius: 50%;width:3rem; height:3rem`}"
		>
			<span
				class="absolute"
				style="display:inline-block; top: 50%;left: 50%;transform: translate(-50%, -70%);margin: 0;"
			>
				{item.number}
			</span>
		</div>
		<CorrectionItem item="{item}" magnify={magnify}/>
	</div>
{/each}
