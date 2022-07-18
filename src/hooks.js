import { handleAuth } from '@supabase/auth-helpers-sveltekit'
import { sequence } from '@sveltejs/kit/hooks'

const spy = async ({ event, resolve }) => {
	const result = await resolve(event)
	// console.log('request :', result, event)
	return result
}
export const handle = sequence(...[ ...handleAuth(), spy ])

export const getSession = async (event) => {
	const { user, accessToken, error } = event.locals
	return {
		user,
		accessToken,
		error,
	}
}
