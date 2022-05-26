<script context="module">
</script>

<script>
	import '../app.css'
	import links from './navlinks.js'
	import TopAppBar, { Row, Section, Title as TitleBar } from '@smui/top-app-bar'
	import IconButton from '@smui/icon-button'
	import List, { Item, Text, Graphic, Separator, Subheader } from '@smui/list'
	import Drawer, {
		AppContent,
		Content,
		Header,
		Title,
		Subtitle,
		Scrim,
	} from '@smui/drawer'
	import { darkmode } from '../lib/stores'
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'

	let active = links[0].text

	let prominent = false
	let dense = false
	let secondaryColor = false
	let miniWindow = false
	let showDrawer = false
	const setMiniWindow = () => (miniWindow = window.innerWidth < 720)
	const toggleDrawer = () => {
		showDrawer = !showDrawer
	}
	const switchTheme = () => darkmode.update((mode) => !mode)
	const setActive = (value) => {
		active = value
		showDrawer = false
	}

	onMount(() => setMiniWindow())
</script>

<svelte:window on:resize="{setMiniWindow}" />
<svelte:head>
	{#if $darkmode}
		<link rel="stylesheet" href="/smui-dark.css" />
	{:else}
		<link rel="stylesheet" href="/smui.css" />
	{/if}
</svelte:head>

<Drawer variant="modal" bind:open="{showDrawer}">
	<Header>
		<TitleBar>Ubumaths</TitleBar>
		<Subtitle>Les maths de la chandelle verte</Subtitle>
	</Header>
	<Content>
		<List>
			{#each links as link}
				<Item
					href="javascript:void(0)"
					on:click="{() => {
						setActive(link.text)
						goto(`${link.url}`)
					}}"
					activated="{active === link.text}"
				>
					<Text>{link.text}</Text>
				</Item>
			{/each}
		</List>
	</Content>
</Drawer>

<Scrim />
<AppContent class="app-content">
	<TopAppBar
		variant="static"
		prominent="{prominent}"
		dense="{dense}"
		color="{secondaryColor ? 'secondary' : 'primary'}"
	>
		<Row>
			<Section>
				<Title>Ubumaths</Title>
			</Section>
			<Section>
				{#if !miniWindow}
					{#each links as link}
						<a href="{link.url}">{link.text}</a>
					{/each}
				{/if}
			</Section>
			<Section align="end" toolbar>
				<IconButton class="material-icons" aria-label="Download"
					>file_download</IconButton
				>
				<IconButton class="material-icons" aria-label="Print this page"
					>print</IconButton
				>
				{#if $darkmode}
					<IconButton
						class="material-icons"
						aria-label="Bookmark this page"
						on:click="{switchTheme}">light_mode</IconButton
					>
				{:else}
					<IconButton
						class="material-icons"
						aria-label="Bookmark this page"
						on:click="{switchTheme}">dark_mode</IconButton
					>
				{/if}
				{#if miniWindow}
					<IconButton on:click="{toggleDrawer}" class="material-icons"
						>menu</IconButton
					>
				{/if}
			</Section>
		</Row>
	</TopAppBar>
	<slot />
</AppContent>

<style>
</style>
