import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';
import postcss from 'rollup-plugin-postcss';
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import json from 'rollup-plugin-json';
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


const excludeExternalDeps = (id) => !id.startsWith('.') && !id.startsWith('/');

const build_lib = ({ROOT, input, html, libOutputDir, browsers, cssBrowsers, multiBuild, includeExternalDeps}) => {


    process.env.NODE_ENV = 'production';
    console.log('Creating production build...');

    const config = {
        input,
        treeshake: true,
        external: includeExternalDeps ? undefined : excludeExternalDeps,
        output: {
            dir: libOutputDir,
            format: 'esm',
            chunkFileNames: "[hash].js",
        },
        plugins: [
            postcss({
                plugins: [
                    autoprefixer(),
                    cssnano({
                        preset: 'default',
                    }),
                ],
                // only write out CSS for the first bundle (avoids pointless extra files):
                inject: false,
                // extract: !!writeMeta,
            }),
            resolve({
                mainFields: ['module', 'jsnext', 'main'],
                extensions: DEFAULT_EXTENSIONS,
            }),
            commonjs({
                include: /\/node_modules\//,
            }),
            json(),
            babel({
                extensions: DEFAULT_EXTENSIONS,
                babelrc: false,
                configFile: false,
                presets: [
                    [
                        '@babel/preset-env',
                        {
                            targets: browsers,
                            useBuiltIns: false,
                            modules: false,
                        },
                    ]
                ],
                plugins: babelPlugins(cssBrowsers)
            }),
            url({
                limit: 0,
                fileName: "[dirname][name][extname]",
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
    };


    return new Promise((resolve, reject) => {
        rimraf(libOutputDir, {}, () => {
            resolve(config);
        })
    })
};

export default setup(build_lib);