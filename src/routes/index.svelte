<script>
	import Button, { Label } from '@smui/button'
	import { toMarkup } from '$lib/stores'
	let markup = ''
	let ready

	$: markup = $toMarkup('\\frac{3}{4}')
</script>

<h1>Welcome to SvelteKit</h1>
<p>
	Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>

<Button on:click="{() => {}}" variant="raised">
	<Label>Raised</Label>
</Button>
<div class="m-3 bg-midnight text-red-600">totototot</div>
<div class="orange ma-4">
	{@html markup}
</div>

<h1 class="m-15 p-15 text-purple-600 text-3xl font-bold underline">
	Hello world!
</h1>

{#if ready}
	<math-field virtual-keyboard-mode="manual"></math-field>
{/if}
