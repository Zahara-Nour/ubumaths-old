<script>
	import Badge from '@smui-extra/badge'
    import {mdc_colors, correct_color} from '$lib/colors'
	export let line
</script>

{#if line.html}
	{@html line.html}
{:else if line.choices}
	{#each line.choices as choice, i}
		{#if choice.solution}
			<span
				class="rounded-lg m-2 p-1"
				style={`display:inline-block;text-align: center;min-width:3rem;position:relative; border: 4px solid ${correct_color}`}
			>
				{#if choice.html}
					{@html choice.html}
				{:else if choice.image}
					image
				{/if}
				{#if choice.badge}
					<Badge
						pos="middle"
						color="{choice.badge === 'correct'
							? 'custom-correct'
							: 'custom-incorrect'}"
						aria-label="{`choice ${i}`}"
						style="min-height: 1.5rem; min-width: 1.5rem; padding: 0;"
					/>
				{/if}
			</span>
		{:else}
			<span
				class="rounded-lg m-2 p-1"
				style="display:inline-block;text-align: center;min-width:3rem;position:relative; border: 4px solid grey"
			>
				{#if choice.html}
					{@html choice.html}
				{:else if choice.image}
					image
				{/if}
				{#if choice.badge}
					<Badge
						color="custom-incorrect"
						aria-label="{`choice ${i}`}"
						style="min-height: 1.5rem; min-width: 1.5rem; padding: 0;"/>
				{/if}
			</span>
		{/if}
	{/each}
{/if}
