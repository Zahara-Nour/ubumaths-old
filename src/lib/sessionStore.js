import { writable } from 'svelte/store'

export const user = writable(false)
export const session = writable(false)
export const connected = writable(false)