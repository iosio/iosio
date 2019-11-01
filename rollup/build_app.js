import resolve from "rollup-plugin-node-resolve";
import {DEFAULT_EXTENSIONS} from "@babel/core";
import babel from "rollup-plugin-babel";
import url from "rollup-plugin-url";
import {terser} from "rollup-plugin-terser";
import filesize from "rollup-plugin-filesize";

import {babelPlugins} from "./babelPlugins";
import {exec} from "child_process";
import path from "path";
import indexHTML from "rollup-plugin-index-html";

const external = (id) => !id.startsWith('.') && !id.startsWith('/');
const ex = (cmd) => new Promise((resolve) => exec(cmd, resolve));

const PACKAGE_ROOT_PATH = process.cwd();
const PKG_JSON = require(path.join(PACKAGE_ROOT_PATH, 'package.json'));

let src = path.join(PACKAGE_ROOT_PATH, 'dev');

let outputDir = path.join(PACKAGE_ROOT_PATH, 'build');

let rollupBuild;

let browsers = ['chrome 77'];

let cssBrowsers = ['last 2 versions'];

process.env.NODE_ENV = 'production';

const multiBuild = true;

const config = (legacy) => ({
    input: src + '/src/index.js',
    treeshake: true,
    external,
    output: {
        dir: path.join(outputDir, legacy ? '/legacy' : ''),
        format: legacy ? 'system' : 'esm',
        dynamicImportFunction: !legacy && 'importShim',
        chunkFileNames: "[hash].js",
        sourcemap: false,
    },
    plugins: [
        indexHTML({
            indexHTML: src + '/index.html',
            legacy,
            multiBuild,
            polyfills: {
                dynamicImport: true,
                coreJs: true,
                regeneratorRuntime: true,
                webcomponents: true,
                systemJs: true,
                fetch: true,
                intersectionObserver: true,
            },
        }),
        resolve({
            extensions: DEFAULT_EXTENSIONS,
        }),
        babel({
            extensions: DEFAULT_EXTENSIONS,
            babelrc: false,
            configFile: false,
            presets: [
                [
                    '@babel/preset-env',
                    {
                        targets: legacy ? ['ie 11'] : browsers,
                        useBuiltIns: false,
                        modules: false,
                    },
                ]
            ],
            plugins: babelPlugins(cssBrowsers)
        }),
        url({
            limit: 0,
            fileName: (legacy ? '../' : '') + "[dirname][name][extname]",
        }),
        terser({
            output: {comments: false},
            compress: {
                passes: 10,
                pure_getters: true,
                toplevel: true,
                // properties: false
            }
        }),
        filesize()
    ]
});


const buildConfig = [multiBuild && config(true), config()].filter(Boolean);

rollupBuild = () => ex(`rimraf ${outputDir}`).then(() => buildConfig);

export default rollupBuild();