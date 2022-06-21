// /// <reference types="vitest" />
// import { defineConfig } from 'vite';
// import { svelte } from '@sveltejs/vite-plugin-svelte';

// export default defineConfig({
// 	plugins: [svelte({ hot: !process.env.VITEST })],
// 	test: {
// 		globals: true,
// 		// environment: 'happy-dom'
// 		environment: 'jsdom'
// 	}
// });



import { extractFromSvelteConfig } from "vitest-svelte-kit"

const config = extractFromSvelteConfig()
config.then(c => console.log('config', c))
export default config