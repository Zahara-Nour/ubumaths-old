import { createClient } from '@supabase/supabase-js'
import supabaseaccess from '$lib/private/supabase.json'

const options = {}
console.log('initialize supabase')
const supabase = createClient(supabaseaccess.url, supabaseaccess.key, options)


export { supabase }
