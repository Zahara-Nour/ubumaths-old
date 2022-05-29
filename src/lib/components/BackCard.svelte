<script>
	// import Spinner from './Spinner.svelte'
	import { mdiOrbitVariant } from '@mdi/js'
	import Fab, { Icon } from '@smui/fab'
	import { Svg } from '@smui/common/elements'
	import Paper, { Title, Subtitle, Content } from '@smui/paper'
	import { onMount, afterUpdate } from 'svelte'

	export let card
	export let toggleFlip = () => {}
  export let flashcard
	export let h
	export let height

</script>

<div bind:clientHeight="{h}">
	<Paper elevation="{10}" style="{height ? `height:${height}px;` : ''}">
		<div class="h-full flex flex-col justify-between">
			<Content>
				<div>Back Ici la réponse à la question</div>
				<div>dcscds</div>
				<div>dcscds</div>
				<div>dcscds</div>

				<div>dcscds</div>
				<div>dcscds</div>
				<div>dcscds</div>
			</Content>
			{#if flashcard}
				<div class="buttons flex justify-center">
					<Fab color="secondary" on:click="{toggleFlip}" mini>
						<Icon component="{Svg}" viewBox="2 2 20 20">
							<path fill="currentColor" d="{mdiOrbitVariant}"></path>
						</Icon>
					</Fab>
				</div>
			{/if}
		</div>
	</Paper>
</div>

<!-- <div class="card">
  <div class="content">
    Back
  </div>
	<div class="buttons">
		<Fab color="secondary" on:click="{toggleFlip}" mini>
			<Icon component="{Svg}" viewBox="2 2 20 20">
				<path fill="currentColor" d="{mdiOrbitVariant}"></path>
			</Icon>
		</Fab>
	</div>
</div> -->
<style>

	.buttons {
		margin-top: 2em;
	}
</style>
