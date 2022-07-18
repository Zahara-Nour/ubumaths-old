import { supabaseClient } from '$lib/supabase'
import { getLogger } from '$lib/utils'
let { info, fail, warn } = getLogger('images', 'info')
export async function fetchImage(name) {
    
    const img = sessionStorage.getItem(name)
    if (!img) {
        info('fetching image', name)
        const { data: blob, error } = await supabaseClient.storage
            .from('public/mental')
            .download(name)

        if (error) {
            fail('error', error)
            return Promise.reject('error', error)
        } else {

            return new Promise(function (resolve, reject) {
                let reader = new FileReader()
                
                reader.onload = () => {
                    try {
                    sessionStorage.setItem(name, reader.result)
                    }
                    catch(error) {
                        warn('error',error)
                    }
                    info('image loaded', name)
                    return resolve(reader.result)
                }
                reader.onerror = (error) => reject('Error: ', error)
                reader.readAsDataURL(blob)
            })
        }
    } else {
        return Promise.resolve(img)
    }
}