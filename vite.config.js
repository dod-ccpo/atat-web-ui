import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import {VuetifyResolver} from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import {checker} from 'vite-plugin-checker'
import pkg from './package.json'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
// import VueDevTools from 'vite-plugin-dev-tools'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import dotenv from 'dotenv'
dotenv.config()

const servicenowConfig = require('./servicenow.config')
require('dotenv').config()

const DEFAULTS = {
	ASSET_SIZE_LIMIT: 10000
}
const CONFIG = {
	...DEFAULTS,
	...servicenowConfig
}

// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => {
	const env = loadEnv(mode, process.cwd(), '')
	const BASE_API_URL = env.BASE_API_URL.endsWith('/')
			? env.BASE_API_URL + 'api'
			: env.BASE_API_URL + '/api',
		SNOWUSER = mode === 'development' ? env.SNOWUSER : '',
		SNOWPASS = mode === 'development' ? env.SNOWPASS : '',
		SNOW_USER_SYSID =
			mode === 'development' ? env.userId : 'e0c4c728875ed510ec3b777acebb356f' // pragma: allowlist secret

	//  if(command === 'serve') {
	return {
		define: {
			'process.env.VUE_APP_BASE_API_URL': JSON.stringify(BASE_API_URL),
			'process.env.VUE_APP_SNOWUSER': JSON.stringify(SNOWUSER),
			'process.env.VUE_APP_SNOWPASS': JSON.stringify(SNOWPASS),
			'process.env.SNOW_USER_SYSID': JSON.stringify(SNOW_USER_SYSID),
			'process.env.VUE_APP_allowDeveloperNavigation': JSON.stringify('true')
			//'test': console.log(env)
		},
		resolve: {
			alias: {
				'@': '/src',
				vue: 'vue/dist/vue.esm-bundler.js', // Alias 'vue' to Vue 3
				'vue/compat': 'vue/dist/vue.runtime.esm-bundler.js'
			},
			extensions: ['.ts', '.vue', '.js']
		},
		plugins: [
			/*VueDevTools(),*/ vue(),

			Components({
				dts: true,
				directives: false,
				resolvers: [VuetifyResolver()],
				types: [
					{
						from: 'vue-router',
						names: ['RouterLink', 'RouterView']
					}
				],
				version: 2.7
			}),
			//TODO Both typescript & vueTsc are throwing errors
			checker({
				// typescript: true,
				vueTsc: true
				// eslint: {lintCommand:'eslint '},
			}),
			// vue-property-decorator
			cssInjectedByJsPlugin(),
			resolve() //commonjs(),
			//splitVendorChunkPlugin(),
		],
		server: {
			port: 8080
		},
		// build: {

		// }
		// optimizeDeps: {
		//   include: ['assets/*','node_modules/*']
		// },
		build: {
			target: 'esnext',
			assetsDir: './',
			cssCodeSplit: false,
			rollupOptions: {
				output: {
					dir: './dist/',
					format: 'iife', //iife || umd
					entryFileNames: 'js/app-js',
					chunkFileNames: 'js/vendor-js',
					assetFileNames: assetInfo => {
						if (/\.(gif)$/.test(assetInfo.name)) {
							console.log('gif', assetInfo.name)
						}
						if (/\.(png|jpe?g|gif|webp|svg)$/.test(assetInfo.name)) {
							console.log(assetInfo.name)
							return `img/[name]-[hash:6]-[ext]`
						} else if (/\.(woff2?|eot|ttf|otf|ttc)$/i.test(assetInfo.name)) {
							return `other_assets/[name]-[hash:6]-[ext]`
						}
						return assetInfo.name
					}
					//doesn't work with iife/umd
					// manualChunks: (id) => {
					//   if(id.includes("node_modules")){
					//     const depName = id.split('/node_modules/')[1].split('/')[0]
					//     if((pkg.dependencies && pkg.dependencies[depName]) /*|| (pkg.devDependencies && pkg.devDependencies[depName])*/){
					//       return `js/vendor-js`
					//     }
					//   }
					//   else if(id.includes('/src/assets/')){
					//     return `js/vendor-js`
					//   }
					// }
				}
			}
		},
		minify: 'esbuild',
		//},
		commonjsOptions: {
			// 5. Output in commonjs format
			esmExternals: false
		},

		css: {
			extract: {
				// false // puts it into app-js
				filename: 'js/vendor-js'
			}
			// inline: true,
			// postcss: {
			//   plugins: [{
			//     postcssPlugin: 'internal:charset-removal',
			//     AtRule: {
			//       charset: atRule => {
			//         if(atRule.name === 'charset'){
			//           atRule.remove()
			//         }
			//       }
			//     }
			//   }]
			// }
		},
		preprocessorOptions: {
			sass: {
				additionalData: ['@import "@/sass/atat.scss', ''].join('\n')
			}
		}
	}

	// }
})
