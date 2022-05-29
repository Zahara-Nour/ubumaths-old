<script>
	import {
		mdiProjectorScreen,
		mdiRocketLaunchOutline,
		mdiHelp,
		mdiBasketPlus,
		mdiBasket,
		mdiCloudDownloadOutline,
		mdiCloudUploadOutline,
		mdiLink,
		mdiTrashCanOutline,
	} from '@mdi/js'
	import Fab from '@smui/fab'
	import Badge from '@smui-extra/badge'
	import Tooltip, { Wrapper } from '@smui/tooltip'
	import IconButton from '@smui/icon-button'
	import { Icon } from '@smui/common'
	import { Svg } from '@smui/common/elements'

	export let showBasket
	export let basket
	export let copyLink
	export let fillBasket
	export let launchTest
	export let classroom
	export let displayExemple
	export let flushBasket

	const toggleExemple = () => (displayExemple = !displayExemple)
	const toggleBasket = () => (showBasket = !showBasket)
	const toggleClassroom = () => (classroom = !classroom)

	// $: isLoggedIn = $user.id != 'guest'
	// $: isTeacher = isLoggedIn && $user.roles.includes('teacher')
	// $: isStudent = isLoggedIn && $user.roles.includes('student')
</script>

<div class="my-3 flex" style="{'position:sticky;top:10px;z-index:10'}">
	<div class="grow"></div>

	<Wrapper>
		<Fab class="mx-1" color="secondary" on:click="{copyLink}" mini>
			<Icon component="{Svg}" viewBox="2 2 20 20">
				<path fill="currentColor" d="{mdiLink}"></path>
			</Icon>
		</Fab>
		<Tooltip>Copier le lien</Tooltip>
	</Wrapper>

  <Wrapper >
		<Fab class="mx-1" color="{classroom ? 'primary' : 'secondary'}" on:click="{toggleClassroom}" mini>
			<Icon component="{Svg}" viewBox="2 2 20 20">
				<path fill="currentColor" d="{mdiProjectorScreen}"></path>
			</Icon>
		</Fab>
		<Tooltip>{classroom ? "Désactiver le mode projection" : "Activer le mode projection"}</Tooltip>
	</Wrapper>

  <Wrapper >
		<Fab class="mx-1" color="{displayExemple ? 'primary' : 'secondary'}" on:click="{toggleExemple}" mini>
			<Icon component="{Svg}" viewBox="2 2 20 20">
				<path fill="currentColor" d="{mdiHelp}"></path>
			</Icon>
		</Fab>
		<Tooltip>{displayExemple ? "Afficher un exemple" : "Cacher l'exemple"}</Tooltip>
	</Wrapper>

  <Wrapper>
		<Fab class="mx-1" color="secondary" on:click="{fillBasket}" mini>
			<Icon component="{Svg}" viewBox="2 2 20 20">
				<path fill="currentColor" d="{mdiBasketPlus}"></path>
			</Icon>
		</Fab>
		<Tooltip>Ajouter au panier</Tooltip>
	</Wrapper>

  <Wrapper>
		<Fab class="mx-1" color="secondary" on:click="{flushBasket}" mini>
			<Icon component="{Svg}" viewBox="2 2 20 20">
				<path fill="currentColor" d="{mdiTrashCanOutline}"></path>
			</Icon>
		</Fab>
		<Tooltip>Vider le panier</Tooltip>
	</Wrapper>

  <Wrapper>
		<Fab class="mx-1" color="{showBasket ? 'primary' : 'secondary'}" on:click="{toggleBasket}" mini>
			<Icon component="{Svg}" viewBox="2 2 20 20">
				<path fill="currentColor" d="{mdiBasket}"></path>
			</Icon>
      {#if basket.length}
				<Badge aria-label="items number in basket">
					{basket.reduce((acc, item) => acc + item.count, 0)}
				</Badge>
			{/if}
		</Fab>
		<Tooltip>{showBasket ? "Afficher le panier" : "Retourner à la liste de questions"}</Tooltip>
	</Wrapper>

  <Wrapper>
		<Fab class="mx-1" color="secondary" on:click="{launchTest}" mini>
			<Icon component="{Svg}" viewBox="2 2 20 20">
				<path fill="currentColor" d="{mdiRocketLaunchOutline}"></path>
			</Icon>
		</Fab>
		<Tooltip>Copier le lien</Tooltip>
	</Wrapper>

</div>
