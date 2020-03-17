const {createConfigItem} = require('@babel/core');
const babelPlugin = require('rollup-plugin-babel');
const merge = require('lodash.merge');


const isTruthy = obj => {
    if (!obj) return false;
    return obj.constructor !== Object || Object.keys(obj).length > 0;
};

const ESMODULES_TARGET = {
    esmodules: true,
};

const mergeConfigItems = (type, ...configItemsToMerge) => {
    const mergedItems = [];

    configItemsToMerge.forEach(configItemToMerge => {
        configItemToMerge.forEach(item => {
            const itemToMergeWithIndex = mergedItems.findIndex(
                mergedItem => mergedItem.file.resolved === item.file.resolved,
            );

            if (itemToMergeWithIndex === -1) {
                mergedItems.push(item);
                return;
            }

            mergedItems[itemToMergeWithIndex] = createConfigItem(
                [
                    mergedItems[itemToMergeWithIndex].file.resolved,
                    merge(mergedItems[itemToMergeWithIndex].options, item.options),
                ],
                {
                    type,
                },
            );
        });
    });

    return mergedItems;
};

const createConfigItems = (type, items) => {
    return items.map(({name, ...options}) => {
        return createConfigItem([require.resolve(name), options], {type});
    });
};
const presetEnvRegex = RegExp(/@babel\/(preset-)?env/);

const customBabel = babelPlugin.custom(babelCore => {
    return {
        // Passed the plugin options.
        options({custom: customOptions, ...pluginOptions}) {
            return {
                // Pull out any custom options that the plugin might have.
                customOptions,

                // Pass the options back with the two custom options removed.
                pluginOptions,
            };
        },
        /*
            "@babel/core": "^7.7.7",
    "@babel/plugin-proposal-class-properties": "7.7.4",
    "@babel/plugin-proposal-nullish-coalescing-operator": "^7.8.3",
    "@babel/plugin-proposal-optional-chaining": "^7.8.3",
    "@babel/plugin-syntax-dynamic-import": "^7.8.3",
    "@babel/plugin-syntax-import-meta": "^7.8.3",
    "@babel/plugin-syntax-jsx": "^7.7.4",
    "@babel/plugin-transform-flow-strip-types": "^7.7.4",
    "@babel/plugin-transform-react-jsx": "^7.7.7",
    "@babel/preset-env": "^7.7.7",
    "@babel/preset-flow": "^7.7.4",
    "@babel/preset-modules": "^0.1.2",
    "@iosio/babel-plugin-jcss": "^0.7.12",
    "@iosio/babel-plugin-minify-html-literals": "^0.7.12",
    "@iosio/babel-plugin-minify-literals": "^0.7.12",
    "babel-plugin-bundled-import-meta": "^0.3.2",
    "babel-plugin-macros": "^2.8.0",
    "babel-plugin-transform-async-to-promises": "^0.8.15",
    "babel-plugin-transform-inline-environment-variables": "^0.4.3",
    "babel-plugin-transform-replace-expressions": "^0.2.0",
    "lodash.merge": "^4.6.2",
    "rollup-plugin-babel": "^4.3.3"
         */

        config(config, {customOptions}) {
            const defaultPlugins = createConfigItems(
                'plugin',
                [

                    {
                        name: '@iosio/babel-plugin-jcss',
                        ...(customOptions.jcss || {})
                    },

                    customOptions.minifyLiterals && {
                        name: '@iosio/babel-plugin-minify-literals'
                    },
                    customOptions.minifyHtmlLiterals && {
                        name: '@iosio/babel-plugin-minify-html-literals'
                    },
                    {
                        name: '@babel/plugin-syntax-dynamic-import',
                    },
                    {
                        name: '@babel/plugin-syntax-import-meta',
                    },
                    {
                        name: 'babel-plugin-bundled-import-meta',
                        importStyle: 'baseURI'
                    },

                    {
                        name: '@babel/plugin-proposal-nullish-coalescing-operator',
                        loose: true
                    },
                    {
                        name: '@babel/plugin-proposal-optional-chaining',
                        loose: true
                    },
                    {
                        name: 'babel-plugin-transform-inline-environment-variables'
                    },
                    {
                        name: '@babel/plugin-transform-react-jsx',
                        pragma: customOptions.pragma || 'h',
                        pragmaFrag: customOptions.pragmaFrag || 'Fragment',
                    },
                    !customOptions.typescript && {
                        name: '@babel/plugin-transform-flow-strip-types',
                    },
                    isTruthy(customOptions.defines) && {
                        name: 'babel-plugin-transform-replace-expressions',
                        replace: customOptions.defines,
                    },
                    !customOptions.modern && {
                        name: 'babel-plugin-transform-async-to-promises',
                        inlineHelpers: true,
                        externalHelpers: true,
                    },
                    {
                        name: '@babel/plugin-proposal-class-properties',
                        loose: true,
                    },
                    !customOptions.modern && {
                        name: '@babel/plugin-transform-regenerator',
                        async: false,
                    },
                    {
                        name: 'babel-plugin-macros',
                    },
                ].filter(Boolean),
            );

            const babelOptions = config.options || {};

            const envIdx = (babelOptions.presets || []).findIndex(preset =>
                presetEnvRegex.test(preset.file.request),
            );

            const excludeInPresets = [
                'transform-async-to-generator',
                'transform-regenerator',
                customOptions.legacy && '@babel/plugin-transform-template-literals'
            ].filter(Boolean);

            const environmentPreset = customOptions.modern
                ? '@babel/preset-modules'
                : '@babel/preset-env';

            if (envIdx !== -1) {
                const preset = babelOptions.presets[envIdx];
                babelOptions.presets[envIdx] = createConfigItem(
                    [
                        environmentPreset,
                        Object.assign(
                            merge(
                                {
                                    loose: true,
                                    useBuiltIns: false,
                                    targets: customOptions.targets,
                                },
                                preset.options,
                                {
                                    modules: false,
                                    exclude: merge(
                                        excludeInPresets,
                                        (preset.options && preset.options.exclude) || [],
                                    ),
                                },
                            ),
                            customOptions.modern ? {targets: ESMODULES_TARGET} : {},
                        ),
                    ],
                    {
                        type: `preset`,
                    },
                );
            } else {
                babelOptions.presets = createConfigItems('preset', [
                    {
                        name: environmentPreset,
                        targets: customOptions.modern
                            ? ESMODULES_TARGET
                            : customOptions.targets,
                        modules: false,
                        loose: true,
                        useBuiltIns: false,
                        exclude: excludeInPresets,
                    },
                ]);
            }

            // Merge babelrc & our plugins together
            babelOptions.plugins = mergeConfigItems(
                'plugin',
                defaultPlugins,
                babelOptions.plugins || [],
            );

            babelOptions.generatorOpts = {
                minified: customOptions.compress,
                compact: customOptions.compress,
                shouldPrintComment: comment => /[@#]__PURE__/.test(comment),
            };

            return babelOptions;
        },
    };
});


module.exports = ({
                      defines,
                      extensions,
                      minifyLiterals,
                      legacy,
                      modern,
                      jcss,
                      compress,
                      targets,
                      pragma,
                      pragmaFrag
                  }) => [
    isTruthy(defines) && babelPlugin({
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
        extensions,
        exclude: 'node_modules/**',
        passPerPreset: true, // @see https://babeljs.io/docs/en/options#passperpreset
        custom: {
            minifyLiterals,
            legacy,
            modern,
            jcss,
            compress,
            targets,
            pragma,
            pragmaFrag
        }
    })

].filter(Boolean);