<script>
	import { toMarkup } from '$lib/stores'
	import QuestionCard from '$lib/components/QuestionCard.svelte'
	import data, { getQuestion } from './automaths/questions'
	import generate from './automaths/generateQuestion'
	import { page } from '$app/stores'
	import { onMount } from 'svelte'
	import { mathliveReady } from '$lib/stores'
	let markup = ''
	let ready

	const qs = data.questions
	const ids = data.ids
	const { theme, domain, subdomain, level } = ids['0031']
	const q = getQuestion(theme, domain, subdomain, level)
	console.log('q', q)
	$: markup = $toMarkup('\\enclose{roundedbox}[3px solid red]{5}')

	console.log('page', $page.url)
	let mf

	$: if (mf) {
		console.log('mf', mf, mf.setOptions)
	}
</script>

<h1>Headline 1</h1>
<h2>Headline 2</h2>
<h3>Headline 3</h3>
<h4>Headline 4</h4>
<h5>Headline 5</h5>
<h6>Headline 6</h6>
<p>paragraph</p>
<p><small>small text</small></p>
<p>normal text</p>
<p><big>big text</big></p>
<p><strong>bold text</strong></p>

<code>
	du code informatique
</code>
<div class="ma-4" style="z-index:0; position:relative">
	{@html markup}
</div>

{#if $mathliveReady}
	<math-field virtual-keyboard-mode="manual" bind:this="{mf}"></math-field>
{/if}

<QuestionCard card="{generate(q)}" flashcard description />
