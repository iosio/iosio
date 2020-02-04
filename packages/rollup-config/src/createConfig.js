import {combineAndNormalizeOptions} from "./combineAndNormalizeOptions";
import {parseMappingArgument, parseMappingArgumentAlias} from "./util";
import {presets} from "./presets";

import {rollupConfig} from "./config";

import {series} from "asyncro";
import {blue} from "kleur";
import {dirname, relative, basename, resolve} from "path";
import {rollup} from 'rollup';
import {rollupWatch} from "@iosio/build-tools/rollup";
import {DevServer} from "@iosio/build-tools/devServer";
import {isDir} from "./util";

import rimraf from 'rimraf';


const getFile = (options, entry, format) => {

    function replaceName(filename, name) {
        return resolve(
            dirname(filename),
            name + basename(filename).replace(/^[^.]+/, ''),
        );
    }

    let mainNoExtension = options.output;
    if (options.multipleEntries) {
        let name = entry.match(/([\\/])index(\.(umd|cjs|es|m))?\.m?js$/)
            ? mainNoExtension
            : entry;
        mainNoExtension = resolve(dirname(mainNoExtension), basename(name));
    }

    mainNoExtension = mainNoExtension.replace(/(\.(umd|cjs|es|m))?\.m?js$/, '');

    let moduleMain = replaceName(
        options.pkg.module && !options.pkg.module.match(/src\//)
            ? options.pkg.module
            : options.pkg['jsnext:main'] || 'x.esm.js',
        mainNoExtension,
    );
    let modernMain = replaceName(
        (options.pkg.syntax && options.pkg.syntax.esmodules) || options.pkg.esmodule || 'x.modern.js',
        mainNoExtension,
    );

    let cjsMain = replaceName(options.pkg['cjs:main'] || 'x.js', mainNoExtension);
    let umdMain = replaceName(options.pkg['umd:main'] || 'x.umd.js', mainNoExtension);

    const formats = {
        modern: modernMain,
        es: moduleMain,
        umd: umdMain
    };

    return formats[format] || cjsMain

};


const getExternalsAndGlobals = (options, entry) => {

    // ------------ external ---------------
    let external = [];

    if (options.target !== 'web') {
        external.concat(['dns', 'fs', 'path', 'url']);
    }

    if (entry) {
        external.concat(options.entries.filter(e => e !== entry));
    }

    const peerDeps = Object.keys(options.pkg.peerDependencies || {});

    if (options.external === 'none') {
        // bundle everything
    } else if (options.external.length > 0) external = external.concat(peerDeps);
    else external = external.concat(peerDeps).concat(Object.keys(options.pkg.dependencies || {}));

    // ------------ globals ----------------
    let globals = external.reduce((g, name) => {
        // valid JS identifiers are usually library globals:
        if (name.match(/^[a-z_$][a-z0-9_$]*$/)) {
            g[name] = name;
        }
        return g;
    }, {});

    if (options.globals && options.globals !== 'none') {
        globals = Object.assign(globals, parseMappingArgument(options.globals));
    }

    const externalPredicate = new RegExp(`^(${external.join('|')})($|/)`);

    const externalTest = options.external.length === 0
        ? () => false
        : id => externalPredicate.test(id);

    return {external, externalTest, globals};
};


export const createConfig = (options) => {

    console.log('create config', options);
    let builds = [];

    if (options.preset === presets.build_app) {

        const {globals, externalTest} = getExternalsAndGlobals(options);

        const external = id => {
            if (id === 'babel-plugin-transform-async-to-promises/helpers') {
                return false;
            }
            return externalTest(id);
        };

        builds = [
            options.multiBuildApp && rollupConfig({
                ...options,
                legacy: true,
                globals,
                format: 'system',
                external
            }),
            rollupConfig({
                ...options,
                globals,
                format: 'modern',
                external
            })
        ].filter(Boolean);

    } else if (options.preset === presets.start) {
        const {globals, externalTest} = getExternalsAndGlobals(options);

        const external = id => {
            if (id === 'babel-plugin-transform-async-to-promises/helpers') {
                return false;
            }
            return externalTest(id);
        };

        builds = [
            rollupConfig({
                ...options,
                entry: options.entries[0],
                globals,
                format: 'modern',
                external
            })
        ]

    } else if (options.preset === presets.build_lib) {

        let outputAliases = {};
        // since we transform src/index.js, we need to rename imports for it:
        if (options.multipleEntries) {
            outputAliases['.'] = './' + basename(options.output);
        }

        for (let i = 0; i < options.entries.length; i++) {
            for (let j = 0; j < options.formats.length; j++) {

                const entry = options.entries[i];

                const {globals, externalTest} = getExternalsAndGlobals(options, entry);

                const format = options.formats[j];
                const file = getFile(options, entry, format);

                builds.push(
                    rollupConfig({
                        ...options,
                        html: false,
                        htmljs: false,
                        file,
                        entry,
                        format,
                        writeMeta: i === 0 && j === 0,
                        outputAliases,
                        globals,
                        external: id => {
                            if (id === 'babel-plugin-transform-async-to-promises/helpers') {
                                return false;
                            }
                            if (options.multipleEntries && id === '.') {
                                return true;
                            }
                            return externalTest(id);
                        }
                    })
                );


            }
        }
    }

    return builds;

};


let cache;

export const nodeRollup = async function ({builds, options}) {


    let out = await series(
        builds.map(config => async () => {
            const {inputOptions, outputOptions} = config;
            inputOptions.cache = cache;
            let bundle = await rollup(inputOptions);
            cache = bundle;
            await bundle.write(outputOptions);
            return await config._sizeInfo;
        }),
    );

    return (
        blue(
            `Build "${options.name}" to ${relative(options.cwd, dirname(options.output)) ||
            '.'}:`,
        ) +

        '\n   ' + out.join('\n   ')
    );
};

const clearDir = (dir)=> new Promise(resolve=>{
    dir = dirname(dir);
    isDir(dir).then((dirThere)=>{
        rimraf(dir + (dirThere ? '/*' : ''), {}, resolve);
    });
});


export const xBundle = async (inputOptions) => {



    const options = await combineAndNormalizeOptions(inputOptions);

    options.envs && Object.keys(options.envs).forEach((key) => {
        process.env[key] = options.envs[key];
    });

    const builds = createConfig(options);

    // console.log(builds);

    if (options.preset === presets.start) {
        return await rollupWatch(builds, options, DevServer({baseDir: options.output}))
    } else {
        await clearDir(options.output);
        return await nodeRollup({builds, options})
    }
};