// // cli
// import arg from 'arg';
// //rollup
//
// import {rollup, watch} from 'rollup';
// import {DEFAULT_EXTENSIONS} from "@babel/core";
// // import alias from 'rollup-plugin-alias';
// import serve from 'rollup-plugin-serve';
// import livereload from 'rollup-plugin-livereload';
// import resolve from "rollup-plugin-node-resolve";
// import indexHTML from "rollup-plugin-index-html";
// import babel from "rollup-plugin-babel";
// import url from "rollup-plugin-url";
//
// //------------
//
// import path from "path";
// import {logError, stdout} from "./utils";
// import {exec} from "child_process";
//
//
// const ex = (cmd) => new Promise((resolve) => exec(cmd, resolve));
//
//
// export const babelPlugins = (cssBrowsers = ['last 2 versions']) => [
//     ['@iosio/babel-plugin-jcss', {browsers: cssBrowsers}],
//     "transform-inline-environment-variables",
//     '@babel/plugin-syntax-dynamic-import',
//     '@babel/plugin-syntax-import-meta',
//     ['bundled-import-meta', {importStyle: 'baseURI'}],
//     ["@babel/plugin-transform-react-jsx", {pragma: 'h', pragmaFrag: "Fragment"}],
//     ["@babel/plugin-proposal-class-properties", {"loose": true}],
// ];
//
//
//
//
// const WATCH_OPTS = {
//     exclude: 'node_modules/**',
// };
//
// let browsers = ['chrome 77'];
// let cssBrowsers = ['last 2 versions'];
//
// const createConfig = ({ root, outputDir}) => {
//
//     process.env.NODE_ENV = 'development';
//
// // outputDir = './node_modules/_iosio_temp_dev_build';
//
//
//
//     return {
//         watch: WATCH_OPTS,
//         treeshake: true,
//         input: root + '/src/index.js',
//         output: {
//             dir: outputDir,
//             format: 'esm',
//             sourcemap: false,
//             chunkFileNames: "[name][hash].js"
//         },
//         plugins: [
//             // alias({
//             //     resolve: DEFAULT_EXTENSIONS,
//             //     entries:{
//             //         './xact':'./preact'
//             //     }
//             // }),
//             resolve({
//                 // module: true,
//                 // jsnext: true,
//                 extensions: DEFAULT_EXTENSIONS,
//             }),
//
//             indexHTML({indexHTML: root + '/index.html'}),
//             babel({
//                 extensions: DEFAULT_EXTENSIONS,
//                 babelrc: false,
//                 configFile: false,
//                 presets: [
//                     [
//                         '@babel/preset-env',
//                         {
//                             targets: browsers,
//                             useBuiltIns: false,
//                             modules: false,
//                         },
//                     ]
//                 ],
//                 plugins: babelPlugins(browsers)
//             }),
//             url({limit: 0, fileName: "[dirname][name][extname]"}),
//             serve({contentBase: outputDir, historyApiFallback: true}),
//             livereload({watch: outputDir})
//         ]
//     };
// }
//
//
// function parseArgumentsIntoOptions(rawArgs) {
//     const args = arg({}, {argv: rawArgs.slice(2)});
//     return {action: args._[0], dir: args._[1]};
// }
//
//
// const startDev = ({action, dir}) => {
//
//     return new Promise((resolve, reject) => {
//
//         const ROOT = process.cwd();
//
//         let root = path.join(ROOT, dir );
//
//         let outputDir = path.join(ROOT, dir + '/build');
//
//
//         // console.log(src)
//         // console.log(outputDir)
//
//         const config = createConfig({root, outputDir});
//
//
//
//         const watchIt = () =>
//             watch(config).on('event', e => {
//
//                 if (e.code === 'FATAL') {
//                     return reject(e.error);
//                 } else if (e.code === 'ERROR') {
//                     logError(e.error);
//                 }
//                 if (e.code === 'END') {
//                     // options._sizeInfo.then(text => {
//                     //     stdout(`Wrote ${text.trim()}`);
//                     // });
//                 }
//
//             });
//
//         // watchIt();
//
//         return ex(`rimraf ${outputDir}`).then(watchIt).catch(reject);
//
//     });
// };
//
//
// export const dev = function (options = {}) {
//
//     return startDev(options).then(() => {
//         stdout('.then.....')
//     }).catch((e) => {
//         logError(e);
//     })
// };
//
//
