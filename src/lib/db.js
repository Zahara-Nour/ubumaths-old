import { createClient } from '@supabase/supabase-js'
import supabaseaccess from '$lib/private/supabase.json'

const options = {}
const supabase = createClient(supabaseaccess.url, supabaseaccess.key, options)


export { supabase }
