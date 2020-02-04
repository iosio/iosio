import {basename, dirname, extname, resolve} from "path";
import fs from "fs";
import {
    parseMappingArgumentAlias,
    parseMappingArgument,
    toReplacementExpression,
    normalizeMinifyOptions
} from "./util";

export const prepBuildLibOptions = (options, entry, format, writeMeta) => {

    let { pkg } = options;



    // let outputAliases = {};
    // // since we transform src/index.js, we need to rename imports for it:
    // if (options.multipleEntries) {
    //     outputAliases['.'] = './' + basename(options.output);
    // }

    const peerDeps = Object.keys(pkg.peerDependencies || {});

    if (options.external === 'none') {
        // bundle everything (external=[])
    } else if (options.external) {
        external = external.concat(peerDeps).concat(options.external.split(','));
    } else {
        external = external
            .concat(peerDeps)
            .concat(Object.keys(pkg.dependencies || {}));
    }

    const externalPredicate = new RegExp(`^(${external.join('|')})($|/)`);
    const externalTest = external.length === 0 ? () => false : id => externalPredicate.test(id)


    let globals = external.reduce((globals, name) => {
        // valid JS identifiers are usually library globals:
        if (name.match(/^[a-z_$][a-z0-9_$]*$/)) {
            globals[name] = name;
        }
        return globals;
    }, {});

    if (options.globals && options.globals !== 'none') {
        globals = Object.assign(globals, parseMappingArgument(options.globals));
    }




    // let defines = {};
    // if (options.define) {
    //     defines = Object.assign(
    //         defines,
    //         parseMappingArgument(options.define, toReplacementExpression),
    //     );
    // }


    // function replaceName(filename, name) {
    //     return resolve(
    //         dirname(filename),
    //         name + basename(filename).replace(/^[^.]+/, ''),
    //     );
    // }

    // let mainNoExtension = options.output;
    // if (options.multipleEntries) {
    //     let name = entry.match(/([\\/])index(\.(umd|cjs|es|m))?\.m?js$/)
    //         ? mainNoExtension
    //         : entry;
    //     mainNoExtension = resolve(dirname(mainNoExtension), basename(name));
    // }
    // mainNoExtension = mainNoExtension.replace(/(\.(umd|cjs|es|m))?\.m?js$/, '');

    // let moduleMain = replaceName(
    //     pkg.module && !pkg.module.match(/src\//)
    //         ? pkg.module
    //         : pkg['jsnext:main'] || 'x.esm.js',
    //     mainNoExtension,
    // );
    //
    // let modernMain = replaceName(
    //     (pkg.syntax && pkg.syntax.esmodules) || pkg.esmodule || 'x.modern.js',
    //     mainNoExtension,
    // );
    //
    //
    // let cjsMain = replaceName(pkg['cjs:main'] || 'x.js', mainNoExtension);
    // let umdMain = replaceName(pkg['umd:main'] || 'x.umd.js', mainNoExtension);

    const modern = format === 'modern';

    // let rollupName = safeVariableName(basename(entry).replace(/\.js$/, ''));

    // let nameCache = {};
    //
    // const bareNameCache = nameCache;
    // // Support "minify" field and legacy "mangle" field via package.json:
    // const rawMinifyValue = options.pkg.minify || options.pkg.mangle || {};
    //
    // let minifyOptions = typeof rawMinifyValue === 'string' ? {} : rawMinifyValue;

    // const getNameCachePath =
    //     typeof rawMinifyValue === 'string'
    //         ? () => resolve(options.cwd, rawMinifyValue)
    //         : () => resolve(options.cwd, 'mangle.json');
    //
    // const useTypescript = extname(entry) === '.ts' || extname(entry) === '.tsx';



    // function loadNameCache() {
    //     try {
    //         nameCache = JSON.parse(fs.readFileSync(getNameCachePath(), 'utf8'));
    //         // mangle.json can contain a "minify" field, same format as the pkg.mangle:
    //         if (nameCache.minify) {
    //             minifyOptions = Object.assign(
    //                 {},
    //                 minifyOptions || {},
    //                 nameCache.minify,
    //             );
    //         }
    //     } catch (e) {}
    // }
    // loadNameCache();

    // normalizeMinifyOptions(minifyOptions);

    // if (nameCache === bareNameCache) nameCache = null;

};