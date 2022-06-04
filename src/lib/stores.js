import { writable } from 'svelte/store'

export const darkmode = writable(true)
export const touchDevice = writable(false)
export const toMarkup = writable((o) => o)
export const fontSize = writable(16)
export const magnify = writable(1)
export const formatLatex = writable((o) => o)
export const handleKeydown=writable(()=>{})
export const mathliveReady = writable(false)
export const mode = writable('')
