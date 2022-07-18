<script>
	
</script>

<svelte:head>
	<!-- Feuilles de styles en fonction largeur écran -->
	<link
		rel="stylesheet"
		href="/css/navadra/basic_styles.css?nvd_r=xxx"
	/>
	<link
		rel="stylesheet"
		href="/css/navadra/styles_grands_ordis.css?nvd_r=xxx"
		media="only screen and (min-width: 1751px)"
	/>
	<link
		rel="stylesheet"
		href="/css/navadra/styles_ordis.css?nvd_r=xxx"
		media="only screen and (min-width: 992px) and (max-width: 1750px)"
	/>
	<link
		rel="stylesheet"
		href="/css/navadra/styles_tablettes.css?nvd_r=xxx"
		media="only screen and (min-width: 769px) and (max-width: 991px)"
	/>
	<link
		rel="stylesheet"
		href="/css/navadra/styles_mobiles.css?nvd_r=xxx"
		media="only screen and (max-width: 768px)"
	/>
</svelte:head>

<slot />
