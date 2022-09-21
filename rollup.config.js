import { defineConfig } from 'rollup'
import nodeResolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import replace from '@rollup/plugin-replace'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import json from '@rollup/plugin-json';

const extensions = [ '.ts' ]

//TODO Check if required..
const external = [
	'@appsflow/core',
];

//TODO Check if required..
const globals = {
	'@appsflow/core': '$flow',
}

export default defineConfig( [
	// UMD Development
	{
		input: 'src/index.ts',
		external,
		output: {
			globals,
			file: 'dist/appflow-mvc.js',
			format: 'umd',
			name: 'mvc',
			indent: false,
			paths: { // TODO: Check if required.
				'core': '$flow',
				'@appsflow/core': '$flow',
			}
		},
		plugins: [
			json(),
			nodeResolve( {
				extensions
			} ),
			typescript(),
			babel( {
				extensions,
				exclude: 'node_modules/**',
				babelHelpers: 'bundled'
			} ),
			replace( {
				preventAssignment: true,
				'process.env.NODE_ENV': JSON.stringify( 'development' )
			} )
		]
	},

	// UMD Production
	{
		input: 'src/index.ts',
		external,
		output: {
			globals,
			file: 'dist/appflow-mvc.min.js',
			format: 'umd',
			name: 'mvc',
			indent: false,
			paths: { // TODO: Check if required.
				'core': '$flow',
				'@appsflow/core': '$flow',
			}
		},
		plugins: [
			json(),
			nodeResolve( {
				extensions
			} ),
			typescript(),
			babel( {
				extensions,
				exclude: 'node_modules/**',
				skipPreflightCheck: true,
				babelHelpers: 'bundled'
			} ),
			replace( {
				preventAssignment: true,
				'process.env.NODE_ENV': JSON.stringify( 'production' )
			} ),
			terser( {
				compress: {
					pure_getters: true,
					unsafe: true,
					unsafe_comps: true
				}
			} )
		]
	},
] )
