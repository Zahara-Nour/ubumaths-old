<script context="module">
</script>

<script>
	import '../app.scss'
	import links from './navlinks.js'
	import TopAppBar, { Row, Section, Title as TitleBar } from '@smui/top-app-bar'
	import IconButton from '@smui/icon-button'
	import { Icon } from '@smui/common'
	import List, { Item, Text, Graphic, Separator, Subheader } from '@smui/list'
	import Drawer, {
		AppContent,
		Content,
		Header,
		Title,
		Subtitle,
		Scrim,
	} from '@smui/drawer'
	import { mdiFormatFontSizeDecrease, mdiFormatFontSizeIncrease } from '@mdi/js'
	import Tooltip, { Wrapper } from '@smui/tooltip'
	import { A, Svg } from '@smui/common/elements'
	import { darkmode, touchDevice, toMarkup, fontSize } from '$lib/stores'
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import { get } from 'svelte/store'

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

	onMount(() => {
		setMiniWindow()
		// detects a touche screen device at the first touch
		//  https://codeburst.io/the-only-way-to-detect-touch-with-javascript-7791a3346685
		window.addEventListener(
			'touchstart',
			function onFirstTouch() {
				touchDevice.set(true)
				window.removeEventListener('touchstart', onFirstTouch, false)
			},
			false,
		)

		import('https://unpkg.com/mathlive/dist/mathlive.min.mjs')
			.then((m) => {
				toMarkup.set(m.convertLatexToMarkup)
			})
			.catch((e) => {
				console.log('erreur', e)
			})
	})

	function increase() {
		const newSize = get(fontSize) + 1
		fontSize.set(newSize)
		document.getElementsByTagName('html')[0].style.fontSize = `${newSize}px`
	}

	function decrease() {
		const newSize = get(fontSize) - 1
		fontSize.set(newSize)
		document.getElementsByTagName('html')[0].style.fontSize = `${newSize}px`
	}
</script>

<svelte:window on:resize="{setMiniWindow}" />
<svelte:head>
	{#if $darkmode}
		<!-- SMUI Styles -->
		<link rel="stylesheet" href="/smui-dark.css" />
		<link rel="stylesheet" href="/site-dark.css" />
	{:else}
		<!-- SMUI Styles -->
		<link rel="stylesheet" href="/smui.css" />
		<!-- Site Styles -->
		<link rel="stylesheet" href="/site.css" />
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
				<TitleBar component="{A}" href="/" on:click="{() => {}}">
					{miniWindow
						? 'UbuMaths'
						: 'UbuMaths - Les maths de la chandelle verte'}
				</TitleBar>
			</Section>
			<Section>
				{#if !miniWindow}
					<div>
						{#each links as link}
							<a class="mx-2" href="{link.url}">{link.text}</a>
						{/each}
					</div>
				{/if}
			</Section>
			<Section align="end" toolbar>
				<Wrapper>
					<IconButton on:click="{decrease}">
						<Icon component="{Svg}" viewBox="0 0 24 24">
							<path fill="currentColor" d="{mdiFormatFontSizeDecrease}"></path>
						</Icon>
					</IconButton>
					<Tooltip>Diminuer la taille de la police</Tooltip>
				</Wrapper>
				<Wrapper>
					<IconButton on:click="{increase}">
						<Icon component="{Svg}" viewBox="0 0 24 24">
							<path fill="currentColor" d="{mdiFormatFontSizeIncrease}"></path>
						</Icon>
					</IconButton>
					<Tooltip>Diminuer la taille de la police</Tooltip>
				</Wrapper>

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
						>menu
					</IconButton>
				{/if}
			</Section>
		</Row>
	</TopAppBar>
	<div>
		<slot />
	</div>
</AppContent>

<style>
</style>
