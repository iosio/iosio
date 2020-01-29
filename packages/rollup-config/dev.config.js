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

import camelCase from 'camelcase';
import cssnano from 'cssnano';
// import brotliSize from 'brotli-size';
// import prettyBytes from 'pretty-bytes';
import glob from 'tiny-glob/sync';
// import gzipSize from 'gzip-size';

import {customBabel} from "./babel-custom";
import {
    isTruthy,
    getSizeInfo,
    EXTENSIONS,
    parseMappingArgument,
    toReplacementExpression,
    absolutePathPlugin,
    replaceName,
    normalizeMinifyOptions
} from "./util";

import fs from "fs";
import {basename, dirname, extname, resolve} from "path";


const shebang = {};


export const dev =
    ({
         cwd, name, enableExperimentalAbsolutePathPlugin, entry, alias, compress, html,
         output, browsers, cssBrowsers, commonjsConfig, copyConfig, baseUrl, sourcemap, target, writeMeta,
         define, format, jsx, jsxFragment, entries, pkg, external, globals, strict, raw
     }) => {

        cwd = cwd || process.cwd();

        let _external = ['dns', 'fs', 'path', 'url'].concat(
            entries.filter(e => e !== entry),
        );

        const multipleEntries = entries.length > 1;

        let outputAliases = {};
        // since we transform src/index.js, we need to rename imports for it:
        if (multipleEntries) {
            outputAliases['.'] = './' + basename(output);
        }

        const moduleAliases = alias
            ? parseMappingArgumentAlias(alias)
            : [];

        const peerDeps = Object.keys(pkg.peerDependencies || {});

        if (external === 'none') {
            // bundle everything (external=[])
        } else if (external) {
            _external = external.concat(peerDeps).concat(external.split(','));
        } else {
            _external = external
                .concat(peerDeps)
                .concat(Object.keys(pkg.dependencies || {}));
        }

        let _globals = _external.reduce((g, name) => {
            // valid JS identifiers are usually library globals:
            if (name.match(/^[a-z_$][a-z0-9_$]*$/)) {
                g[name] = name;
            }
            return g;
        }, {});

        if (globals && globals !== 'none') {
            _globals = Object.assign(_globals, parseMappingArgument(globals));
        }

        let defines = {};

        if (define) {
            defines = Object.assign(
                defines,
                parseMappingArgument(define, toReplacementExpression),
            );
        }




        let mainNoExtension = output;
        if (multipleEntries) {
            let name = entry.match(/([\\/])index(\.(umd|cjs|es|m))?\.m?js$/)
                ? mainNoExtension
                : entry;
            mainNoExtension = resolve(dirname(mainNoExtension), basename(name));
        }
        mainNoExtension = mainNoExtension.replace(/(\.(umd|cjs|es|m))?\.m?js$/, '');
        let moduleMain = replaceName(
            pkg.module && !pkg.module.match(/src\//)
                ? pkg.module
                : pkg['jsnext:main'] || 'x.esm.js',
            mainNoExtension,
        );
        let modernMain = replaceName(
            (pkg.syntax && pkg.syntax.esmodules) || pkg.esmodule || 'x.modern.js',
            mainNoExtension,
        );
        let cjsMain = replaceName(pkg['cjs:main'] || 'x.js', mainNoExtension);
        let umdMain = replaceName(pkg['umd:main'] || 'x.umd.js', mainNoExtension);
        const modern = format === 'modern';


        const useTypescript = extname(entry) === '.ts' || extname(entry) === '.tsx';



        let nameCache = {};
        const bareNameCache = nameCache;
        // Support "minify" field and legacy "mangle" field via package.json:
        const rawMinifyValue = pkg.minify || pkg.mangle || {};

        let minifyOptions = typeof rawMinifyValue === 'string' ? {} : rawMinifyValue;

        const getNameCachePath = typeof rawMinifyValue === 'string'
            ? () => resolve(cwd, rawMinifyValue)
            : () => resolve(cwd, 'mangle.json');

        const externalPredicate = new RegExp(`^(${_external.join('|')})($|/)`);

        const externalTest = _external.length === 0 ? () => false : id => externalPredicate.test(id);

        function loadNameCache() {
            try {
                nameCache = JSON.parse(fs.readFileSync(getNameCachePath(), 'utf8'));
                // mangle.json can contain a "minify" field, same format as the pkg.mangle:
                if (nameCache.minify) {
                    minifyOptions = Object.assign(
                        {},
                        minifyOptions || {},
                        nameCache.minify,
                    );
                }
            } catch (e) {
            }
        }

        loadNameCache();

        normalizeMinifyOptions(minifyOptions);

        if (nameCache === bareNameCache) nameCache = null;

        const config = {
            inputOptions: {
                input: entry,
                external: id => {
                    if (id === 'babel-plugin-transform-async-to-promises/helpers') {
                        return false;
                    }
                    if (multipleEntries && id === '.') {
                        return true;
                    }
                    return externalTest(id);
                },
                treeshake: {propertyReadSideEffects: false},
                plugins: [].concat(
                    enableExperimentalAbsolutePathPlugin && baseUrl && absolutePathPlugin({
                        input: entry,
                        baseUrl
                    }),
                    moduleAliases.length > 0 && aliasImports({
                        resolve: EXTENSIONS,
                        entries: moduleAliases
                    }),
                    postcss({
                        plugins: [
                            autoprefixer({
                                flexbox: true,
                                ...(cssBrowsers ? {overrideBrowserslist: cssBrowsers} : {})
                            }),
                            compress !== false && cssnano({
                                preset: 'default',
                            }),
                        ].filter(Boolean),
                        // only write out CSS for the first bundle (avoids pointless extra files):
                        inject: false,
                        extract: !!writeMeta,
                    }),
                    nodeResolve({
                        mainFields: ['module', 'jsnext', 'main'],
                        browser: target !== 'node',
                    }),
                    commonjs({
                        // use a regex to make sure to include eventual hoisted packages
                        include: /\/node_modules\//,
                        ...(commonjsConfig || {})
                    }),
                    json(),
                    {
                        // We have to remove shebang so it doesn't end up in the middle of the code somewhere
                        transform: code => ({
                            code: code.replace(/^#![^\n]*/, bang => {
                                shebang[options.name] = bang;
                            }),
                            map: null,
                        }),
                    },
                    html && indexHTML({indexHTML: html}),
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
                            defines,
                            modern,
                            compress: compress !== false,
                            targets: target === 'node' ? {node: '8'} : undefined,
                            pragma: jsx || 'h',
                            pragmaFrag: jsxFragment || 'Fragment',
                            typescript: !!useTypescript,
                        },
                    }),
                    copyConfig && copy({
                        targets: copyConfig.map((filePath) => ({
                            src: filePath,
                            dest: output
                        }))
                    }),
                    url({limit: 0, fileName: "[dirname][name][extname]"}),
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
                                minifyOptions.compress || {},
                            ),
                            output: {
                                // By default, Terser wraps function arguments in extra parens to trigger eager parsing.
                                // Whether this is a good idea is way too specific to guess, so we optimize for size by default:
                                wrap_func_args: false,
                            },
                            warnings: true,
                            ecma: modern ? 9 : 5,
                            toplevel: modern || format === 'cjs' || format === 'es',
                            mangle: Object.assign({}, minifyOptions.mangle || {}),
                            nameCache,
                        }),
                        nameCache && {
                            // before hook
                            options: loadNameCache,
                            // after hook
                            writeBundle() {
                                if (writeMeta && nameCache) {
                                    fs.writeFile(
                                        getNameCachePath(),
                                        JSON.stringify(nameCache, null, 2),
                                    );
                                }
                            },
                        },
                    ],
                    {
                        writeBundle(bundle) {
                            config._sizeInfo = Promise.all(
                                Object.values(bundle).map(({code, fileName}) =>
                                    code ? getSizeInfo(code, fileName, raw) : false,
                                ),
                            ).then(results => results.filter(Boolean).join('\n'));
                        },
                    },
                ).filter(Boolean),
            },
            outputOptions: {
                paths: outputAliases,
                globals: _globals,
                strict: strict === true,
                legacy: true,
                freeze: false,
                esModule: false,
                sourcemap: sourcemap,
                get banner() {
                    return shebang[name];
                },
                format: modern ? 'es' : format,
                name,
                file: resolve(
                   cwd,
                    {
                        modern: modernMain,
                        es: moduleMain,
                        umd: umdMain,
                    }[format] || cjsMain,
                ),
                chunkFileNames: "[name].js"
            }
        };

        config.config = {
            output: {...config.outputOptions},
            ...config.inputOptions,
        };

        return config;


    };