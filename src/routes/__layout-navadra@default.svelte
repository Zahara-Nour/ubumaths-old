<script>
	import { signInWithGoogle } from '$lib/auth'
	import { connected } from '$lib/sessionStore'

	if (!$connected) {
		signInWithGoogle()
	}
</script>

{#if $connected}
	<slot />
{/if}
