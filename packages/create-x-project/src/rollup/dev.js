
import postcss from "rollup-plugin-postcss";
import autoprefixer from "autoprefixer";

import resolve from "rollup-plugin-node-resolve";
import {watch} from 'rollup';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import {DEFAULT_EXTENSIONS} from "@babel/core";
import babel from "rollup-plugin-babel";
import indexHTML from "rollup-plugin-index-html";
import url from "rollup-plugin-url";
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
// import alias from 'rollup-plugin-alias';
import {babelPlugins} from "./babelPlugins";



//------------
import {createLazyPages} from "./lazyPages";

import {setup} from "./setup";

import rimraf from 'rimraf';


const dev = ({ devInput, html, devOutputDir, browsers, cssBrowsers, host, port, open}) => {


    process.env.NODE_ENV = 'development';

    const config = {
        watch: {
            exclude: 'node_modules/**',
        },
        treeshake: true,
        input: devInput,
        output: {
            dir: devOutputDir,
            format: 'esm',
            sourcemap: false,
            chunkFileNames: "[name][hash].js"
        },
        plugins: [
            // alias({
            //     resolve: DEFAULT_EXTENSIONS,
            //     entries:{
            //         './xact':'preact'
            //     }
            // }),
            postcss({
                plugins: [
                    autoprefixer(),
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
            indexHTML({indexHTML: html}),
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
            url({limit: 0, fileName: "[dirname][name][extname]"}),

            serve({
                contentBase: devOutputDir,
                historyApiFallback: true,
                verbose: false,
                host,
                port,
                open: !!open
            }),
            livereload({watch: devOutputDir, verbose: false})
        ]
    };


    return new Promise((resolve, reject) => {

        rimraf(devOutputDir, {}, () => {
            createLazyPages()
                .then(() => {
                    console.log(`Serving at: http://${host}:${port}`);
                    return watch(config).on('event', e => {

                        if (e.code === 'FATAL') {
                            return reject(e.error);
                        } else if (e.code === 'ERROR') {
                            console.log(e.error);
                        }
                    })
                }).catch(reject)

        });

    });


};

export default setup(dev);