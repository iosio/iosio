import resolve from "rollup-plugin-node-resolve";
import {DEFAULT_EXTENSIONS} from "@babel/core";
import babel from "rollup-plugin-babel";
import url from "rollup-plugin-url";
import {terser} from "rollup-plugin-terser";
import filesize from "rollup-plugin-filesize";

import {babelPlugins} from "./babelPlugins";
import path from "path";
import indexHTML from "rollup-plugin-index-html";

import {createLazyPages} from "./lazyPages";
import {setup} from "./setup";
import rimraf from "rimraf";
import commonjs from "rollup-plugin-commonjs";




const build = ({ROOT, input, html, outputDir, browsers, cssBrowsers, multiBuild}) => {


    process.env.NODE_ENV = 'production';
    console.log('Creating production build...');

    const config = (legacy) =>({
        input,
        treeshake: true,
        // external,
        output: {
            dir: path.join(outputDir, legacy ? '/legacy' : ''),
            format: legacy ? 'system' : 'esm',
            dynamicImportFunction: !legacy && 'importShim',
            chunkFileNames: "[hash].js",
            sourcemap: false,
        },
        plugins: [
            indexHTML({
                indexHTML: html,
                legacy,
                multiBuild,
                polyfills: {
                    dynamicImport: true,
                    coreJs: true,
                    regeneratorRuntime: true,
                    webcomponents: true,
                    systemJs: true,
                    fetch: true
                },
            }),
            resolve({
                mainFields: ['module', 'jsnext', 'main'],
                extensions: DEFAULT_EXTENSIONS,
            }),
            commonjs({
                include: /\/node_modules\//,
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


    return new Promise((resolve, reject) => {
        rimraf(outputDir, {}, () => {
            createLazyPages()
                .then(() => {
                    multiBuild && console.log('creating multiBuild');
                    const builds = [multiBuild && config(true), config()].filter(Boolean);
                    resolve(builds);
                }).catch(reject)

        })
    })
};

export default setup(build);