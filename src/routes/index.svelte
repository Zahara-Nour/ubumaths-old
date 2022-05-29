<script>
	import { toMarkup } from '$lib/stores'
	import QuestionCard from '$lib/components/QuestionCard.svelte'
	import data, { getQuestion } from './automaths/questions'
  import generate from './automaths/generateQuestion'
  import {page} from '$app/stores'
	let markup = ''
	let ready

	const qs = data.questions
	const ids = data.ids
	const { theme, domain, subdomain, level } = ids['0031']
	const q = getQuestion(theme, domain, subdomain, level)
	console.log('q', q)
	$: markup = $toMarkup('\\frac{3}{4}')

  console.log('page', $page.url)
</script>

<div class="orange ma-4">
	{@html markup}
</div>




	<math-field virtual-keyboard-mode="manual"></math-field>


<QuestionCard card={generate(q)} flashcard description/>
