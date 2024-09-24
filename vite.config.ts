import svgr from 'vite-plugin-svgr';
import react from '@vitejs/plugin-react-swc';
import dotenv from 'dotenv';
import inject from '@rollup/plugin-inject';
import checker from 'vite-plugin-checker';
import process from 'node:process';

import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig, splitVendorChunkPlugin } from 'vite';

dotenv.config();

export default defineConfig({
	plugins: [
		react(),
		svgr(),
		splitVendorChunkPlugin(),
		checker({ typescript: false }),
		nodePolyfills({
			include: ['path'],
			exclude: ['http'],
			globals: {
				Buffer: true,
				global: true,
				process: true,
			},
			overrides: {
				fs: 'memfs',
			},
			protocolImports: true,
		}),
	],

	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},

	build: {
		outDir: 'build',

		rollupOptions: {
			plugins: [inject({ Buffer: [ 'buffer/', 'Buffer' ] })],
		},
	},

	define: {
		'process.env': process.env,
	},

	server: {
		port: 3000,
		watch: {
			usePolling: true,
		},
	},
});
