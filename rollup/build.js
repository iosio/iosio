import resolve from "rollup-plugin-node-resolve";
import {DEFAULT_EXTENSIONS} from "@babel/core";
import babel from "rollup-plugin-babel";
import url from "rollup-plugin-url";
import {terser} from "rollup-plugin-terser";
import filesize from "rollup-plugin-filesize";

import {babelPlugins} from "./babelPlugins";
import {exec} from "child_process";
import path from "path";

const external = (id) => !id.startsWith('.') && !id.startsWith('/');
const ex = (cmd) => new Promise((resolve) => exec(cmd, resolve));

const PACKAGE_ROOT_PATH = process.cwd();
const PKG_JSON = require(path.join(PACKAGE_ROOT_PATH, 'package.json'));



let src = path.join(PACKAGE_ROOT_PATH, 'src/index.js');

let outputDir = path.join(PACKAGE_ROOT_PATH, 'lib');

let rollupBuild;

let browsers = ['chrome 77'];
let cssBrowsers = ['last 2 versions'];


process.env.NODE_ENV = 'production';


const config = {
    input: src,
    treeshake: true,
    external,
    output: {
        dir: outputDir,
        format: 'esm',
        // sourcemap: true,
        chunkFileNames: "common.js"
    },
    plugins: [
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
                        targets: browsers,
                        useBuiltIns: false,
                        modules: false,
                    },
                ]
            ],
            plugins: babelPlugins(cssBrowsers)
        }),
        url({limit: 0, fileName: "[dirname][hash][extname]"}),
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

if (['.', '/', './', ''].includes(outputDir) || outputDir.startsWith('.') || outputDir.startsWith('./')) {
    rollupBuild = () => config;
} else {
    // console.error('no way josé')
    rollupBuild = () => ex(`rimraf ${outputDir}`).then(() => config)
}

export default rollupBuild();