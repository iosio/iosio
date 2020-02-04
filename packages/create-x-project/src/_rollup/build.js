import postcss from "rollup-plugin-postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import aliasImports from '@rollup/plugin-alias';
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
import {parseMappingArgumentAlias} from "./util";
import {isDirectory} from "./util";
import copy from "rollup-plugin-copy";

import {absolutePathPlugin} from "./absolutePathPlugin";

const build = ({
                   ROOT, input, html, buildOutputDir, browsers, cssBrowsers, multiBuild, alias, commonjsConfig,
                   lazyPagesConfig, copyConfig, enableExperimentalAbsolutePathPlugin, baseUrl
               }) => {


    process.env.NODE_ENV = 'production';
    console.log('Creating production build...');

    const moduleAliases = alias
        ? parseMappingArgumentAlias(alias)
        : [];


    const config = (legacy) => ({
        input,
        treeshake: true,
        // external,
        output: {
            dir: path.join(buildOutputDir, legacy ? '/legacy' : ''),
            format: legacy ? 'system' : 'esm',
            dynamicImportFunction: !legacy && 'importShim',
            chunkFileNames: "[hash].js",
            sourcemap: false,
        },
        plugins: [

            postcss({
                plugins: [
                    autoprefixer(),
                    cssnano({
                        preset: 'default',
                    }),
                ],
            }),
            moduleAliases.length > 0 && aliasImports({
                resolve: DEFAULT_EXTENSIONS,
                entries: moduleAliases
            }),
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
            commonjs(commonjsConfig || {"include": /node_modules/}),
            json(),
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
            copyConfig && copy({
                targets: copyConfig.map((filePath) => ({
                    src: filePath,
                    dest: buildOutputDir
                }))
            }),


            filesize()
        ].filter(Boolean)
    });


    return new Promise((resolve, reject) => {
        isDirectory(buildOutputDir).then(isDir => {
            rimraf(buildOutputDir + (isDir ? '/*' : ''), {}, () => {
                createLazyPages(lazyPagesConfig)
                    .then(() => {
                        multiBuild && console.log('creating multiBuild');
                        const builds = [multiBuild && config(true), config()].filter(Boolean);
                        resolve(builds);
                    }).catch(reject)

            })
        })
    })
};

export default setup(build);