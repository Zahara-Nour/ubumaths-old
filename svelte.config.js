import adapter from '@sveltejs/adapter-auto';
import vercel from '@sveltejs/adapter-vercel';
import preprocess from "svelte-preprocess";
/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: vercel(),
		vite:{
			test:{
				globals:true,
				setupFiles:'./src/setupTest.js'
			}
		}
	},
	preprocess: [
		preprocess({
			postcss: true,
		}),
	],
	
};

export default config;
