<script>
	import Button, { Label } from '@smui/button';
	import { onMount } from 'svelte';

	let markup = '';
	let toMarkup;
	let ready;

	onMount(async () => {
		import('https://unpkg.com/mathlive/dist/mathlive.min.mjs')
			.then((m) => {
				toMarkup = m.convertLatexToMarkup;
				ready = true;
			})
			.catch((e) => {
				console.log('erreur', e);
			});
	});

	$: if (toMarkup) {
		markup = toMarkup('\\frac{3}{4}');
	}
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<Button on:click={() => {}} variant="raised">
	<Label>Raised</Label>
</Button>
<div class='orange ma-4'>
  totototot
</div>
<div class='orange ma-4'>
   {@html markup}
</div>

<h1 class="text-3xl font-bold underline">
  Hello world!
</h1>

{#if ready}
	<math-field virtual-keyboard-mode="manual" />
{/if}
