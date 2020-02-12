import path, {basename, dirname, resolve} from 'path';
import fs from 'fs';
import gzipSize from "gzip-size";
import brotliSize from "brotli-size";
import prettyBytes from "pretty-bytes";
import {green, red, yellow, white, blue} from 'kleur';
import camelCase from "camelcase";
import {map} from "asyncro"
import glob from 'tiny-glob/sync'
import {stdout, stderr, isDir, isFile, readFile} from "@iosio/node-util";


export const toArray = val => (Array.isArray(val) ? val : val == null ? [] : [val]);


export const get_input = (inp, options) => {
    if (!inp) throw new Error('No input detected');
    if (typeof inp === 'string') inp = inp.split(',');
    let files = [];
    toArray(inp).forEach((file) => {
        const _files = glob(file, {cwd: options.cwd});
        files = [...files, ..._files];
    });
    files = files.map(f => path.join(options.cwd, f));
    if (files.length < 2) files = files[0];
    return files;
};

// Extensions to use when resolving modules
export const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.es6', '.es', '.mjs'];
// Parses values of the form "$=jQuery,React=react" into key-value object pairs.
export const parseMappingArgumentAlias = aliasStrings => {
    return aliasStrings.split(',').map(str => {
        let [key, value] = str.split('=');
        return {find: key, replacement: value};
    });
};

// Convert booleans and int define= values to literals.
// This is more intuitive than `microbundle --define A=1` producing A="1".
export const toReplacementExpression = (value, name) => {
    // --define A="1",B='true' produces string:
    const matches = value.match(/^(['"])(.+)\1$/);
    if (matches) {
        return [JSON.stringify(matches[2]), name];
    }

    // --define A=1,B=true produces int/boolean literal:
    if (/^(true|false|\d+)$/i.test(value)) {
        return [value, name];
    }

    // default: string literal
    return [JSON.stringify(value), name];
};

// Normalize Terser options from microbundle's relaxed JSON format (mutates argument in-place)
export function normalizeMinifyOptions(minifyOptions) {
    const mangle = minifyOptions.mangle || (minifyOptions.mangle = {});
    let properties = mangle.properties;

    // allow top-level "properties" key to override mangle.properties (including {properties:false}):
    if (minifyOptions.properties != null) {
        properties = mangle.properties =
            minifyOptions.properties &&
            Object.assign(properties, minifyOptions.properties);
    }

    // allow previous format ({ mangle:{regex:'^_',reserved:[]} }):
    if (minifyOptions.regex || minifyOptions.reserved) {
        if (!properties) properties = mangle.properties = {};
        properties.regex = properties.regex || minifyOptions.regex;
        properties.reserved = properties.reserved || minifyOptions.reserved;
    }

    if (properties) {
        if (properties.regex) properties.regex = new RegExp(properties.regex);
        properties.reserved = [].concat(properties.reserved || []);
    }
}

// Parses values of the form "$=jQuery,React=react" into key-value object pairs.
export const parseMappingArgument = (globalStrings, processValue) => {
    const globals = {};
    globalStrings.split(',').forEach(globalString => {
        let [key, value] = globalString.split('=');
        if (processValue) {
            const r = processValue(value, key);
            if (r !== undefined) {
                if (Array.isArray(r)) {
                    [value, key] = r;
                } else {
                    value = r;
                }
            }
        }
        globals[key] = value;
    });
    return globals;
};

function ensureExt(fn) {
    return /\.js$/.test(fn) ? fn : fn + '.js';
}

export const absolutePathPlugin = ({input, baseUrl, cwd}) => ({
    resolveId: (importee, importer) => {
        if (importee[0] === '/') {
            if (importee !== input) {
                const srcRoot = path.resolve(cwd || process.cwd(), baseUrl);
                const combined = path.join(srcRoot, importee);
                return ensureExt(combined)
            }
        }
    }
});

export const isTruthy = obj => {
    if (!obj) return false;
    return obj.constructor !== Object || Object.keys(obj).length > 0;
};

// Hoist function because something (rollup?) incorrectly removes it
function formatSize(size, filename, type, raw) {
    const pretty = raw ? `${size} B` : prettyBytes(size);
    const color = size < 5000 ? green : size > 40000 ? red : yellow;
    const MAGIC_INDENTATION = type === 'br' ? 13 : 10;
    return `${' '.repeat(MAGIC_INDENTATION - pretty.length)}${color(
        pretty,
    )}: ${white(basename(filename))}.${type}`;
}

export async function getSizeInfo(code, filename, raw) {
    const gzip = formatSize(
        await gzipSize(code),
        filename,
        'gz',
        raw || code.length < 5000,
    );
    let brotli;
    //wrap brotliSize in try/catch in case brotli is unavailable due to
    //lower node version
    try {
        brotli = formatSize(
            await brotliSize(code),
            filename,
            'br',
            raw || code.length < 5000,
        );
    } catch (e) {
        return gzip;
    }
    return gzip + '\n' + brotli;
}

export function replaceName(filename, name) {
    return resolve(
        dirname(filename),
        name + basename(filename).replace(/^[^.]+/, ''),
    );
}

export function getWorkboxConfig(outputDir) {
    const workboxConfigPath = path.join(process.cwd(), 'workbox-config.js');
    const defaultWorboxConfig = {
        navigateFallback: '/index.html',
        // where to output the generated sw
        swDest: path.join(process.cwd(), outputDir, 'sw.js'),
        // directory to match patterns against to be precached
        globDirectory: path.join(process.cwd(), outputDir),
        // cache any html js and css by default
        globPatterns: ['**/*.{html,js,css}'],
    };

    try {
        // eslint-disable-next-line import/no-dynamic-require, global-require
        return require(workboxConfigPath);
    } catch (error) {
        return defaultWorboxConfig;
    }
}


export async function getConfigFromPkgJson(cwd) {
    try {

        const pkgJSON = await readFile(resolve(cwd, 'package.json'), 'utf8');

        const pkg = JSON.parse(pkgJSON);

        return {
            hasPackageJson: true,
            pkg,
        };
    } catch (err) {
        const pkgName = basename(cwd);

        stderr(
            // `Warn ${yellow(`no package.json found. Assuming a pkg.name of "${pkgName}".`)}`
            yellow(
                `${yellow().inverse(
                    'WARN',
                )} no package.json found. Assuming a pkg.name of "${pkgName}".`,
            ),
        );

        let msg = String(err.message || err);
        if (!msg.match(/ENOENT/)) stderr(`  ${red().dim(msg)}`);

        return {hasPackageJson: false, pkg: {name: pkgName}};
    }
}

export const removeScope = name => name.replace(/^@.*\//, '');

export const safeVariableName = name =>
    camelCase(
        removeScope(name)
            .toLowerCase()
            .replace(/((^[^a-zA-Z]+)|[^\w.-])|([^a-zA-Z0-9]+$)/g, ''),
    );

export function getName({name, pkgName, amdName, cwd, hasPackageJson}) {
    if (!pkgName) {
        pkgName = basename(cwd);
        if (hasPackageJson) {
            stderr(
                yellow(
                    `${yellow().inverse(
                        'WARN',
                    )} missing package.json "name" field. Assuming "${pkgName}".`,
                ),
            );
        }
    }

    return {finalName: name || amdName || safeVariableName(pkgName), pkgName};
}

export async function jsOrTs(cwd, filename) {
    const extension = (await isFile(resolve(cwd, filename + '.ts')))
        ? '.ts'
        : (await isFile(resolve(cwd, filename + '.tsx')))
            ? '.tsx'
            : '.js';

    return resolve(cwd, `${filename}${extension}`);
}

export async function getInput({entries, cwd, source, module}) {
    const input = [];
    [].concat(
        entries && entries.length ? entries

            : (source &&

            (Array.isArray(source) ? source : [source]).map(file =>
                resolve(cwd, file),
            ))

            ||

            ((await isDir(resolve(cwd, 'src'))) &&
                (await jsOrTs(cwd, 'src/index'))) ||
            (await jsOrTs(cwd, 'index')) ||
            module,
    ).map(file => glob(file, {cwd})).forEach(file => input.push(...file));

    return input;
}

export async function getOutput({cwd, output, pkgMain, pkgName}) {
    let main = resolve(cwd, output || pkgMain || 'lib');
    if (!main.match(/\.[a-z]+$/) || (await isDir(main))) {
        main = resolve(main, `${removeScope(pkgName)}.js`);
    }
    return main;
}

export async function getEntries({input, cwd}) {
    let entries = (
        await map([].concat(input),
            async file => {
                file = resolve(cwd, file);
                if (await isDir(file)) {
                    file = resolve(file, 'index.js');
                }
                return file;
            })
    ).filter((item, i, arr) => arr.indexOf(item) === i);
    return entries;
}

// export const getFile = (file, cwd) => {
//     if (fs.existSync(file)) return require(path.join(cwd, file));
// };

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


export const getExternalsAndGlobals = (options, entry) => {
    // ------------ external ---------------
    let external = [];



    if (options.target !== 'web') {
        external.concat(['dns', 'fs', 'path', 'url']);
    }
    // if (entry) external.concat(options.entries.filter(e => e !== entry));

    const peerDeps = Object.keys(options.pkg.peerDependencies || {});


    if (options.external === 'none') {
        // bundle everything
    } else if (options.external) external = external.concat(peerDeps).concat(options.external);
    else external = external.concat(peerDeps).concat(Object.keys(options.pkg.dependencies || {}));

    const externalPredicate = new RegExp(`^(${external.join('|')})($|/)`);

    const externalTest = external.length === 0 ? () => false : id => externalPredicate.test(id);

    // ------------ globals ----------------
    let globals = external.reduce((g, name) => {
        // valid JS identifiers are usually library globals:
        if (name.match(/^[a-z_$][a-z0-9_$]*$/)) g[name] = name;
        return g;
    }, {});

    if (options.globals && options.globals !== 'none') {
        globals = Object.assign(globals, parseMappingArgument(options.globals));
    }


    return {external, externalTest, globals};
};


/*
        let outputAliases = {};
        // since we transform src/index.js, we need to rename imports for it:
        // if (options.multipleEntries) {
        //     outputAliases['.'] = './' + basename(options.output);
        // }


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
        }*/