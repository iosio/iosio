import aliasImports from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy'
import indexHTML from "rollup-plugin-index-html";
import postcss from "rollup-plugin-postcss";
import {terser} from 'rollup-plugin-terser';
import url from "rollup-plugin-url";
import filesize from "rollup-plugin-filesize";

import autoprefixer from "autoprefixer";
import cssnano from 'cssnano';
import path from "path";
import xBabel from '@iosio/rollup-plugin-custom-x-babel';

export const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.es6', '.es', '.mjs'];

export const presets = {
    start: 'start',
    build_app: 'build_app',
    build_lib: 'build_lib'
};

export const rollupConfig =
    ({
         cwd,
         preset,
         input,
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

        return {
            inputOptions: {
                input,
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
                    (preset !== presets.build_lib && (htmljs || html)) && indexHTML({
                        indexHTML: (htmljs || html),
                        legacy,
                        multiBuild: multiBuildApp,
                        ...(polyfills !== false ? {
                            polyfills: {
                                dynamicImport: true,
                                coreJs: true,
                                regeneratorRuntime: true,
                                webcomponents: true,
                                systemJs: true,
                                fetch: true
                            }
                        } : {})
                    }),
                    ...xBabel({
                        extensions: EXTENSIONS,
                        minifyLiterals: true,
                        legacy,
                        defines,
                        modern,
                        jcss: {browsers: cssBrowsers},
                        compress: compress !== false,
                        targets: target === 'node' ? {node: '8'} : browsers,
                        pragma: jsx || 'h',
                        pragmaFrag: jsxFragment || 'Fragment',
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
                            compress: {
                                keep_infinity: true,
                                pure_getters: true,
                                passes: 10,
                            },
                            output: {
                                wrap_func_args: false,
                            },
                            warnings: true,
                            ecma: multiBuildApp ? (legacy ? 5 : 9) : modern ? 9 : 5,
                            toplevel: modern || format === 'cjs' || format === 'es',
                            safari10: true
                        }),
                    ],
                    filesize()
                ).filter(Boolean),
            },


            outputOptions: {

                ...(preset === presets.build_lib ?
                    {
                        globals: globals,
                        dir: output,
                        strict: strict === true,
                        legacy: true,
                        freeze: false,
                        esModule: false,
                        sourcemap,
                        format: modern ? 'es' : format,
                        name,
                        chunkFileNames: "[name].js"
                    }
                    : (
                        preset === presets.build_app ?
                            {
                                dir: path.join(output, legacy ? '/legacy' : ''),
                                format: legacy ? 'system' : 'es',
                                dynamicImportFunction: !legacy && 'importShim',
                                chunkFileNames: "[name].js",
                                globals,
                                sourcemap,

                            }
                            : // preset.start
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

    };