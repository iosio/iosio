import postcss from "rollup-plugin-postcss";
import autoprefixer from "autoprefixer";

import {watch} from 'rollup';
import aliasImports from '@rollup/plugin-alias';
import resolve from "rollup-plugin-node-resolve";
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import {DEFAULT_EXTENSIONS} from "@babel/core";
import babel from "rollup-plugin-babel";
import indexHTML from "rollup-plugin-index-html";
import url from "rollup-plugin-url";
import browserSync from 'browser-sync';
import {babelPlugins} from "./babelPlugins";
import historyApiFallback from 'connect-history-api-fallback';
import copy from 'rollup-plugin-copy'
//------------
import {createLazyPages} from "./lazyPages";
import {parseMappingArgumentAlias} from "./util";

import {setup} from "./setup";

import rimraf from 'rimraf';
import {isDirectory} from "./util";
import {absolutePathPlugin} from "./absolutePathPlugin";

import {rollupWatch} from "./rollupWatch";

import {DevServer} from "@iosio/build-tools/devServer";

export const dev = ({
                        ROOT, devInput, html, devOutputDir, browsers, cssBrowsers, host, port, open, alias, commonjsConfig,
                        browserSyncConfig, lazyPagesConfig, copyConfig, enableExperimentalAbsolutePathPlugin, baseUrl
                    }) => {

    const serveHost = `${host}:${port}`;

    process.env.NODE_ENV = 'development';

    // console.log('dev output dir', devOutputDir);
    const moduleAliases = alias
        ? parseMappingArgumentAlias(alias)
        : [];

    const config = {
        inputOptions: {
            input: devInput,
            treeshake: {
                propertyReadSideEffects: false,
            },
            plugins: [
                enableExperimentalAbsolutePathPlugin && baseUrl && absolutePathPlugin({
                    input: devInput,
                    baseUrl
                }),
                postcss({
                    plugins: [
                        autoprefixer(),
                    ],
                }),
                moduleAliases.length > 0 && aliasImports({
                    resolve: DEFAULT_EXTENSIONS,
                    entries: moduleAliases
                }),
                indexHTML({indexHTML: html}),
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
                                targets: browsers,
                                useBuiltIns: false,
                                modules: false,
                            },
                        ]
                    ],
                    plugins: babelPlugins(cssBrowsers)
                }),
                copyConfig && copy({
                    targets: copyConfig.map((filePath) => ({
                        src: filePath,
                        dest: devOutputDir
                    }))
                }),
                url({limit: 0, fileName: "[dirname][name][extname]"}),
            ].filter(Boolean)
        },
        outputOptions: {
            dir: devOutputDir,
            format: 'esm',
            sourcemap: false,
            chunkFileNames: "[name].js"
        }
    };

    return new Promise((resolve, reject) => {
        isDirectory(devOutputDir).then(isDir => {
            rimraf(devOutputDir + (isDir ? '/*' : ''), {}, () => {
                console.log(`Starting dev server...`);

                const reload = DevServer({
                    baseDir: devOutputDir,
                    ...(browserSyncConfig ? browserSyncConfig : {})
                });

                rollupWatch(config, {onBuild: reload}).then(resolve).catch(reject)
            });

        }).catch(reject);
    })
};
// export const
// export default setup(dev);