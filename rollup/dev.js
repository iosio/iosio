import {DEFAULT_EXTENSIONS} from "@babel/core";
// import alias from 'rollup-plugin-alias';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import resolve from "rollup-plugin-node-resolve";
import indexHTML from "rollup-plugin-index-html";
import babel from "rollup-plugin-babel";
import url from "rollup-plugin-url";
import path from "path";

//-------------
import {babelPlugins} from "./babelPlugins";
import {exec} from "child_process";


const ex = (cmd) => new Promise((resolve) => exec(cmd, resolve));

const PACKAGE_ROOT_PATH = process.cwd();



let src = path.join(PACKAGE_ROOT_PATH, 'dev');

let outputDir = path.join(PACKAGE_ROOT_PATH, 'build');

let rollupBuild;

let browsers = ['chrome 77'];
let cssBrowsers = ['last 2 versions'];


process.env.NODE_ENV = 'development';

// outputDir = './node_modules/_iosio_temp_dev_build';

const serveConfig = {
    treeshake: true,
    input: src + '/src/index.js',
    output: {
        dir: outputDir,
        format: 'esm',
        sourcemap: false,
        chunkFileNames: "[name][hash].js"
    },
    plugins: [
        // alias({
        //     resolve: DEFAULT_EXTENSIONS,
        //     entries:{
        //         './xact':'./preact'
        //     }
        // }),
        resolve({
            // module: true,
            // jsnext: true,
            extensions: DEFAULT_EXTENSIONS,
        }),

        indexHTML({indexHTML: src + '/index.html'}),
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
            plugins: babelPlugins(browsers)
        }),
        url({limit: 0, fileName: "[dirname][name][extname]"}),
        serve({contentBase: outputDir, historyApiFallback: true}),
        livereload({watch: outputDir})
    ]
};

rollupBuild = () => ex(`rimraf ${outputDir}`).then(() => serveConfig)

export default rollupBuild();