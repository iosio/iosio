const aliasImports = require('@rollup/plugin-alias');
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const nodeResolve = require('@rollup/plugin-node-resolve');
const copy = require('rollup-plugin-copy');
const indexHTML = require("rollup-plugin-index-html");
const postcss = require("rollup-plugin-postcss");
const {terser} = require('rollup-plugin-terser');
const url = require("rollup-plugin-url");
const filesize = require("rollup-plugin-filesize");

const autoprefixer = require("autoprefixer");
const cssnano = require('cssnano');
const path = require("path");
const xBabel = require('@iosio/rollup-plugin-custom-x-babel');
const babel = require('rollup-plugin-babel');
const {findSupportedBrowsers} = require("./findSupportedBrowsers");

const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.es6', '.es', '.mjs'];


exports.EXTENSIONS = EXTENSIONS;

const presets = {
    start: 'start',
    build_app: 'build_app',
    build_lib: 'build_lib'
};

exports.presets = presets;

const lastTwoTargets = [
    'last 2 Chrome major versions',
    'last 2 ChromeAndroid major versions',
    'last 2 Firefox major versions',
    'last 2 Edge major versions',
    'last 2 Safari major versions',
    'last 2 iOS major versions',
];

const rollupConfig =
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
         context,
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

        let targets;
        if (target !== 'node') {
            targets = multiBuildApp ? (legacy ? ['ie 11'] : (browsers || lastTwoTargets))
                : browsers;
            cssBrowsers = cssBrowsers || targets;
        }


        return {
            inputOptions: {
                input,
                external,
                context,
                onwarn(message, warn) {
                    if (message.code === 'CIRCULAR_DEPENDENCY') {
                        return;
                    }
                    warn(message)
                },
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
                        targets: target === 'node' ? {node: '8'} : targets,
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
                            ecma: multiBuildApp ? (legacy ? 5 : 9) : (modern ? 9 : 5),
                            toplevel: modern || format === 'cjs' || format === 'esm',
                            safari10: true
                        }),
                        terser()
                    ],
                    preset !== presets.start && filesize()
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
                        // preset === presets.build_app ?
                            {
                                dir: path.join(output, legacy ? '/legacy' : ''),
                                format: modern ? 'esm' : format,
                                ...(multiBuildApp ? {
                                    dynamicImportFunction: !legacy && 'importShim'
                                } : {}),
                                entryFileNames: '[name]-[hash].js',
                                chunkFileNames: "[name]-[hash].js",
                                globals,
                                sourcemap,

                            }
                            // : // preset.start
                            // {
                            //     dir: output,
                            //     format: modern ? 'esm' : format,
                            //     sourcemap,
                            //     globals,
                            //     chunkFileNames: "chunk-[name].js"
                            // }
                    ))

            }
        };

    };

exports.rollupConfig = rollupConfig;

/*

                babel({
                        extensions: EXTENSIONS,
                        babelrc: false,
                        configFile: false,
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    targets: targets,
                                    useBuiltIns: false,
                                    modules: false,
                                    exclude: [
                                        'transform-async-to-generator',
                                        'transform-regenerator',
                                        !legacy && '@babel/plugin-transform-template-literals'
                                    ].filter(Boolean)
                                },
                            ]
                        ],
                        plugins: [
                            ['@iosio/babel-plugin-jcss', {browsers: cssBrowsers}],
                            ['@iosio/babel-plugin-minify-literals'],
                            "transform-inline-environment-variables",
                            ['@babel/plugin-proposal-nullish-coalescing-operator', {loose: true}],
                            ['@babel/plugin-proposal-optional-chaining', {loose: true}],
                            '@babel/plugin-syntax-dynamic-import',
                            '@babel/plugin-syntax-import-meta',
                            ['bundled-import-meta', {importStyle: 'baseURI'}],
                            ["@babel/plugin-transform-react-jsx", {pragma: 'h', pragmaFrag: "Fragment"}],
                            ["@babel/plugin-proposal-class-properties", {"loose": true}],
                            '@babel/plugin-transform-flow-strip-types',
                            'macros'
                        ]
                    }),
 */