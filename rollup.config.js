import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import scss from 'rollup-plugin-scss';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import copy from "rollup-plugin-copy";

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

export default {
    input: 'src/js/main.js',
    output: {
        file: 'dist/main.js',
        format: 'iife', // immediately-invoked function expression — suitable for <script> tags
        sourcemap: true
    },
    plugins: [
        scss({
            output: 'dist/style.css',
            watch: 'src/style/scss'
        }),
        resolve(), // tells Rollup how to find date-fns in node_modules
        commonjs(), // converts date-fns to ES modules
        copy({
            targets: [
                {src: 'src/assets/*', dest: 'dist/'},
                {src: 'src/index.html', dest: 'dist/'}
            ]
        }),
        production && terser(), // minify, but only in production
        !production &&
        (serve({
            contentBase: './dist',
            open: false,
            host: 'localhost',
            port: 3000,
        }), livereload({
            watch: 'src',
        }))
    ]
};