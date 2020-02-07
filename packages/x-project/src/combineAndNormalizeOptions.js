import path from "path";
import {
    parseMappingArgumentAlias,
    parseMappingArgument, toReplacementExpression,
    get_input, getConfigFromPkgJson, getName
} from "./util";
import {isFile} from "@iosio/node-util";
import {presets} from "@iosio/rollup-config";
import {log} from "@iosio/node-util";

export const combineAndNormalizeOptions = async (inputOptions) => {
    // --- provided by cli: cwd, app_env, project, preset, configName


    let options = {...inputOptions};

    options.cwd = path.resolve(process.cwd(), options.cwd || '.');

    let joinPath = (pathname) => path.join(options.cwd, pathname);

    let {hasPackageJson, pkg} = await getConfigFromPkgJson(options.cwd);
    options.pkg = pkg;

    options.configName = options.configName || 'xProject';
    let possibleJsConfig = joinPath(options.configName + '.js');
    let jsConfigExists = await isFile(possibleJsConfig);
    let conf = jsConfigExists
        ? require(possibleJsConfig)
        : (options.pkg[options.configName]
            || (options.pkg[options.configName] = {}, options.pkg[options.configName]));

    let getOption = (key) => {
        if (options[key]) return options[key];
        if (options.project && conf.project && conf.project[options.project] && conf.project[options.project][key]) {
            return conf.project[options.project][key]
        }
        return conf[key];
    };

    const {finalName, pkgName} = getName({
        cwd: options.cwd,
        name: getOption('name'),
        pkgName: options.pkg.name,
        amdName: options.pkg.amdName,
        hasPackageJson,
    });

    options.name = finalName;
    options.pkg.name = pkgName;


    let input = getOption('input') || options.pkg.source || 'src/index.js';
    options.input = get_input(input, options);

    let output = getOption('output') || (options.preset === presets.build_lib ? 'lib' : 'build');
    options.output = joinPath(output);

    const compress = getOption('compress');

    options.compress = typeof compress !== 'boolean' ? compress !== 'false' && compress !== '0' : compress;

    options.envsToSet = (getOption('envs') || {})[getOption('app_env')];

    let html = joinPath(getOption('html') || '/src/index.html');

    const htmlExists = await isFile(html);
    options.html = htmlExists && html;

    let htmljs = joinPath(getOption('htmljs') || '/src/html.js');
    const htmljsExists = await isFile(htmljs);
    options.htmljs = htmljsExists && require(htmljs).default;

    const alias = getOption('alias');
    options.alias = alias ? parseMappingArgumentAlias(alias) : [];

    options.format = getOption('format') || "modern";

    options.jsx = getOption('jsx') || 'h';

    options.jsxFragment = getOption('jsxFragment') || 'Fragment';

    options.sourcemap = getOption('sourcemap') !== false;

    options.strict = getOption('strict') === true;

    options.multiBuildApp = getOption('multiBuildApp') || false;

    options.polyfills = getOption('polyfills');

    options.target = getOption('target') || 'web'; // node

    options.context = getOption('context') || (options.target === 'web' ? 'window' : undefined);

    options.browsers = getOption('browsers') || options.pkg.browserslist;

    options.cssBrowsers = getOption('cssBrowsers');

    options.copyConfig = getOption('copyConfig');

    let defs = getOption('define');
    options.defines = defs ? Object.assign({}, parseMappingArgument(defs, toReplacementExpression)) : {};

    let ext = getOption('external');
    if (typeof ext === 'string' && ext !== 'none') ext = ext.split(',').filter(Boolean);
    if (Array.isArray(ext)) ext = ext.length ? ext : undefined;
    options.external = !ext && (options.preset === presets.build_app || options.preset === presets.start) ? 'none' : ext;

    options.globals = getOption('globals');

    options.devServer = getOption('devServer') || {};

    return options;
};

// let entries = getOption('entries');
// entries = typeof entries === 'string' ? entries.split(',') : entries;
//
// options.input = await getInput({
//     cwd: options.cwd,
//     entries: entries && toArray(entries),
//     source: options.pkg.source,
//     module: options.pkg.module,
// });
//
// if (options.preset === presets.build_lib) {
//     options.output = await getOutput({
//         cwd: options.cwd,
//         output: getOption('output'),
//         pkgMain: options.pkg.main,
//         pkgName: options.pkg.name
//     });
// } else {
//     options.output = join(getOption('output') || 'build');
// }
//
// options.entries = await getEntries({
//     cwd: options.cwd,
//     input: options.input,
// });
//
// options.multipleEntries = options.entries.length > 1;
// let formats = getOption('formats') || 'modern,es,cjs,umd';
// formats = Array.isArray(formats)
//     ? formats : (typeof formats === 'string' ? formats.split(',') : ['modern']);
// formats.sort((a, b) => (a === 'cjs' ? -1 : a > b ? 1 : 0));// always compile cjs first if it's there:
// options.formats = formats;