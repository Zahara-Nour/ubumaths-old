import { createClient } from '@supabase/supabase-js'
import { createSupabaseClient } from '@supabase/auth-helpers-sveltekit';
import supabaseAccess from '$lib/private/supabase-ubumaths.json'
import navadraAccess from '$lib/private/supabase-navadra.json'

const options = {}
const { supabaseClient } = createSupabaseClient(supabaseAccess.url, supabaseAccess.key, options)
const navadraClient = createClient(navadraAccess.url, navadraAccess.key, options)

export { supabaseClient, navadraClient }
