/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				// Override default white and black
				white: '#FFFDD0',
				black: '#212121',
			},
			fontFamily: {
				sans: ['Libre Caslon Display', 'serif'],
			},
		},
	},
	plugins: [],
}
