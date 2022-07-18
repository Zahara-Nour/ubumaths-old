import { goto } from '$app/navigation'
import { supabaseClient } from '$lib/supabase'
import { getLogger } from '$lib/utils'

let { info, fail, warn } = getLogger('Auth', 'info')

export async function signOut() {

    // pour être sur de vider les cookies
    // await goto('/api/auth/logout')

	try {
		const { error } = await supabaseClient.auth.signOut()
		if (error) {
			throw error
		}
	} catch (err) {
		fail('Error', err.error_description || err.message)
	}
}

export async function signInWithGoogle() {
	try {
		const { error } = await supabaseClient.auth.signIn({
			provider: 'google',
		})
		if (error) {
			throw error
		}	
	} catch (err) {
		fail('Error', err.error_description || err.message)
	} finally {
		info('signed with Google')
	}
}
