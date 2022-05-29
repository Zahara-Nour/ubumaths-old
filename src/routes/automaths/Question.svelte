<script>
  import {toMarkup} from '$lib/stores'

  export let question

  let enounce
  let enounce2
  const regex = /\$\$(.*?)\$\$/g
  const replacement = (_, p1) => $toMarkup(p1)
  const formatLatex = (s) => s.replace(regex, replacement)

console.log('question', question)
  $: showExp =
    question.expression_latex &&
    !(question.options && question.options.includes('no-exp'))

  $: enounce = question.enounce
    ? formatLatex(question.enounce)
    : null
  
  $: enounce2 = question.enounce2
    ? formatLatex(question.enounce2)
    : null

  $: expression = question.expression_latex
    ? $toMarkup(question.expression_latex)
    : null

  $: expression2 = question.expression2_latex
    ? toMarkup(question.expression2_latex)
    : null


</script>

<div class="flex flex-col items-center">
  {#each question.order_elements as element}
    {#if element === 'enounce' && enounce}
      
        <div
          id="enounce"
          class="mt-3 mb-3 text-center max-w-4xl leading-normal"
        >
          {@html enounce}
        </div>

    {:else if element === 'enounce2' && enounce2}
      
        <div
          id="enounce2"
          class="mt-3 mb-3  text-center max-w-4xl"
        >
          {@html enounce2}
        </div>
       
    {:else if element === 'enounce-image' && question.image }
     
        {#await question.imageBase64P}
         loading image
        {:then base64}
          <img
            src="{base64}"
            class="my-3 w-full max-w-lg"
            style="max-height:40vh;"
            alt="Alright Buddy!"
          />
        {:catch error}
          {error}
        {/await}
      
    {:else if element==='expression' && expression}
      {#if showExp}
        <div
          id="expressions"
          class="my-3 flex flex-col items-center justify-items-center"
        >
   
          <div id="expression" class="my-3">
            {@html expression}
          </div>
          {#if expression2}
            <div id="expression2" class="mt-4">
              {@html expression2}
            </div>
          {/if}
        </div>
      {/if}
    {/if}
  {/each}
  
</div>
