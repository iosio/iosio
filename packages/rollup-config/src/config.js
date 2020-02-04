// plugins
import aliasImports from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import copy from 'rollup-plugin-copy'
import indexHTML from "rollup-plugin-index-html";
import postcss from "rollup-plugin-postcss";
import {terser} from 'rollup-plugin-terser';
import url from "rollup-plugin-url";


import autoprefixer from "autoprefixer";
import cssnano from 'cssnano';
import {customBabel} from "./babel-custom";
import {
    isTruthy,
    getSizeInfo,
    EXTENSIONS,
} from "./util";
import {presets} from "./presets";
import path from "path";


const shebang = {};


export const rollupConfig =
    ({
         cwd,
         preset,
         entry,
         format,
         legacy,
         alias,
         compress,
         external,
         sourcemap,
         globals,
         browsers,
         cssBrowsers,
         writeMeta = true,
         target,
         html,
         htmljs,
         defines,
         copyConfig,
         jsx,
         jsxFragment,
         output,
         outputAliases,
         name,
         strict,
         multiBuildApp,
         file,
         polyfills,
     }) => {

        const modern = format === 'modern';

        const config = {
            inputOptions: {
                input: entry,

                external,
                treeshake: {propertyReadSideEffects: false},
                plugins: [].concat(
                    alias.length > 0 && aliasImports({
                        resolve: EXTENSIONS,
                        entries: alias
                    }),
                    postcss({
                        plugins: [
                            autoprefixer({
                                flexbox: true,
                                ...(cssBrowsers ? {overrideBrowserslist: cssBrowsers} : {})
                            }),
                            compress !== false && cssnano({preset: 'default'}),
                        ].filter(Boolean),
                        // only write out CSS for the first bundle (avoids pointless extra files):
                        // inject: false,
                        // extract: !!writeMeta,
                    }),
                    nodeResolve({
                        mainFields: ['module', 'jsnext', 'main'],
                        browser: target !== 'node',
                    }),
                    commonjs({
                        // use a regex to make sure to include eventual hoisted packages
                        include: /\/node_modules\//,
                    }),
                    json(),
                    {
                        // We have to remove shebang so it doesn't end up in the middle of the code somewhere
                        transform: code => ({
                            code: code.replace(/^#![^\n]*/, bang => {
                                shebang[name] = bang;
                            }),
                            map: null,
                        }),
                    },
                    (htmljs || html) && indexHTML({
                        indexHTML: (htmljs || html),
                        legacy,
                        multiBuild: multiBuildApp,
                        polyfills: {
                            dynamicImport: true,
                            coreJs: true,
                            regeneratorRuntime: true,
                            webcomponents: true,
                            systemJs: true,
                            fetch: true
                        },
                    }),
                    // if defines is not set, we shouldn't run babel through node_modules
                    isTruthy(defines) &&
                    babel({
                        babelrc: false,
                        configFile: false,
                        compact: false,
                        include: 'node_modules/**',
                        plugins: [
                            [
                                require.resolve('babel-plugin-transform-replace-expressions'),
                                {replace: defines},
                            ],
                        ],
                    }),
                    customBabel({
                        extensions: EXTENSIONS,
                        exclude: 'node_modules/**',
                        passPerPreset: true, // @see https://babeljs.io/docs/en/options#passperpreset
                        custom: {
                            minifyLiterals: true,
                            legacy,
                            defines,
                            modern,
                            jcss: {browsers: cssBrowsers},
                            compress: compress !== false,
                            targets: target === 'node' ? {node: '8'} : browsers,
                            pragma: jsx || 'h',
                            pragmaFrag: jsxFragment || 'Fragment',
                        },
                    }),
                    copyConfig && copy({
                        targets: copyConfig.map((filePath) => ({
                            src: filePath,
                            // dest: path.join(output, legacy ? '/legacy' : '')
                            dest: output
                        }))
                    }),
                    url({
                        limit: 0,
                        fileName: (legacy ? '../' : '') + "[dirname][name][extname]"
                    }),
                    compress !== false && [
                        terser({
                            sourcemap: true,
                            compress: Object.assign(
                                {
                                    keep_infinity: true,
                                    pure_getters: true,
                                    // Ideally we'd just get Terser to respect existing Arrow functions...
                                    // unsafe_arrows: true,
                                    passes: 10,
                                },
                                {}
                                // minifyOptions.compress || {},
                            ),
                            output: {
                                // By default, Terser wraps function arguments in extra parens to trigger eager parsing.
                                // Whether this is a good idea is way too specific to guess, so we optimize for size by default:
                                wrap_func_args: false,
                            },
                            warnings: true,
                            ecma: modern ? 9 : 5,
                            toplevel: modern || format === 'cjs' || format === 'es',
                            // mangle: Object.assign({}, minifyOptions.mangle || {}),
                            // nameCache,
                        }),
                        // nameCache && {
                        //     // before hook
                        //     options: loadNameCache,
                        //     // after hook
                        //     writeBundle() {
                        //         if (writeMeta && nameCache) {
                        //             fs.writeFile(
                        //                 getNameCachePath(),
                        //                 JSON.stringify(nameCache, null, 2),
                        //             );
                        //         }
                        //     },
                        // },
                    ],
                    {
                        writeBundle(bundle) {
                            config._sizeInfo = Promise.all(
                                Object.values(bundle).map(({code, fileName}) =>
                                    code ? getSizeInfo(code, fileName, /*raw*/) : false,
                                ),
                            ).then(results => results.filter(Boolean).join('\n'));
                        },
                    },
                ).filter(Boolean),
            },


            outputOptions: {

                ...(preset === presets.build_lib ?
                    {
                        paths: outputAliases,
                        globals: globals,
                        // dir: output,
                        strict: strict === true,
                        legacy: true,
                        freeze: false,
                        esModule: false,
                        sourcemap,
                        get banner() {
                            return shebang[name];
                        },
                        format: modern ? 'es' : format,
                        name,
                        file,
                        chunkFileNames: "[name].js"
                    }
                    : (
                        preset === presets.build_app ?
                            {
                                dir: path.join(output, legacy ? '/legacy' : ''),
                                format: legacy ? 'system' : 'esm',
                                dynamicImportFunction: !legacy && 'importShim',
                                chunkFileNames: "[name].js",
                                globals,
                                sourcemap,

                            }
                            :
                            {
                                dir: output,
                                format: modern ? 'es' : format,
                                sourcemap,
                                globals,
                                chunkFileNames: "chunk-[name].js"
                            }
                    ))

            }
        };


        return config;

    };