import path from "path";
import {
    parseMappingArgumentAlias,
    parseMappingArgument, toReplacementExpression,
    get_input, getConfigFromPkgJson, getName
} from "./util";
import {isFile} from "@iosio/node-util";
import {presets} from "@iosio/rollup-config";

export const combineAndNormalizeOptions = async (inputOptions) => {
    // --- provided by cli: cwd, app_env, project, preset, configName
    let options = {...inputOptions};

    options.cwd = path.resolve(process.cwd(), options.cwd || '.');
    const joinPath = (pathname) => path.join(options.cwd, pathname);

    const {hasPackageJson, pkg} = await getConfigFromPkgJson(options.cwd);
    options.pkg = pkg;

    options.configName = options.configName || 'xProject';
    let possibleJsConfig = joinPath(options.configName + '.js');
    const jsConfigExists = await isFile(possibleJsConfig);
    let conf = jsConfigExists
        ? require(possibleJsConfig)
        : (options.pkg[options.configName]
            || (options.pkg[options.configName] = {}, options.pkg[options.configName]));

    const getOption = (key) =>
        // prioritize input options
        options[key] ||
        // if a project namespace is provided and exists on the config, then pull from it
        (options.project && conf.project && conf.project[options.project] && conf.project[options.project][key])
            ? conf.project[options.project][key]
            // otherwise pull from the config
            : conf[key];

    const {finalName, pkgName} = getName({
        cwd: options.cwd,
        name: getOption('name'),
        pkgName: options.pkg.name,
        amdName: options.pkg.amdName,
        hasPackageJson,
    });

    options.name = finalName;
    options.pkg.name = pkgName;


    let input = getOption('input') || options.pkg.source;



    options.input = get_input(input);

    let output = getOption('output') || (options.preset === presets.build_lib ? 'lib' : 'build');
    options.output = joinPath(output);

    const compress = getOption('compress');

    options.compress = typeof compress !== 'boolean' ? compress !== 'false' && compress !== '0' : compress;

    options.envs = (getOption('envs') || {})[getOption('app_env')];

    let html = joinPath(getOption('html') || '/src/index.html');

    const htmlExists = await isFile(html);
    options.html = htmlExists && html;

    let htmljs = joinPath(getOption('htmljs') || '/src/html.js');
    const htmljsExists = await isFile(htmljs);
    options.htmljs = htmljsExists && htmljs;

    const alias = getOption('alias');
    options.alias = alias ? parseMappingArgumentAlias(alias) : [];

    options.format = getOption('format') || "modern";

    options.jsx = getOption('jsx') || 'h';

    options.jsxFragment = getOption('jsxFragment') || 'Fragment';

    options.sourcemap = getOption('sourcemap') !== false;

    options.strict = getOption('strict') === true;

    options.multiBuildApp = getOption('multiBuildApp') || false;

    options.polyfills = getOption('webPolyfills');

    options.target = getOption('target') || 'web'; // node

    options.context = getOption('context') || (options.target === 'web' && 'window');

    options.browsers = getOption('browsers') || options.pkg.browserlist;

    options.cssBrowsers = getOption('cssBrowsers') || options.browsers;

    options.copyConfig = getOption('copyConfig');

    let defs = getOption('define');
    options.defines = defs ? Object.assign({}, parseMappingArgument(defs, toReplacementExpression)) : {};

    let ext = getOption('external');
    options.external = typeof ext === 'string' && ext !== 'none' ? ext.split(',') : Array.isArray(ext) ? ext : [];

    options.globals = getOption('globals') || 'none';

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