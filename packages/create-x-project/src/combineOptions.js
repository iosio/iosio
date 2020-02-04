import path from "path";
import fs from "fs";
import {isTruthy} from "./util";
import {safeVariableName} from "./util";
import {toArray} from "./util";
import glob from 'tiny-glob/sync'
import {isFile} from "./util/fileSystem";
import {log} from "./util/logging";
import {parseMappingArgumentAlias} from "./util";

export const combineOptions = (inputOptions) => {

    let options = {
        ...inputOptions,
        /*
            cwd,
            app_env,
            project,
            command,
         */
    };

    options.cwd = path.resolve(process.cwd(), options.cwd);

    const join = (pathname) => path.join(options.cwd, pathname);

    options.pkg = require(join('package.json'));

    let possibleJsConfig = join('xProjectConfig.js');

    let conf = fs.existsSync(possibleJsConfig) ? require(possibleJsConfig) : (options.pkg.xProjectConfig || {});

    const prioritizeOverride = (key) =>
        (options.project && conf.project && conf.project[options.project] && conf.project[options.project][key])
            ? conf.project[options.project][key] : conf[key];

    options.envs = (prioritizeOverride('envs'));

    options.input = prioritizeOverride('input');

    options.output = join(prioritizeOverride('output') || '/build');
    options.name = safeVariableName(prioritizeOverride('name') || options.pkg.name);

    options.formats = prioritizeOverride('formats') || ['modern', 'es', 'cjs', 'umd'];
    options.jsx = prioritizeOverride('jsx') || 'h';
    options.jsxFragment = prioritizeOverride('jsxFragment');

    options.sourcemap = prioritizeOverride('sourcemap') !== false;
    options.strict = prioritizeOverride('strict');
    options.html = join(prioritizeOverride('html') || '/src/index.html');
    options.htmljs = join(prioritizeOverride('htmljs') || '/src/html.js');

    options.multiBuild = prioritizeOverride('multiBuild') || false;
    let alias = prioritizeOverride('alias');
    options.alias = alias && parseMappingArgumentAlias(alias);

    options.browsers = prioritizeOverride('browsers') || ['chrome 78'];
    options.cssBrowsers = prioritizeOverride('cssBrowsers') || options.browsers;

    options.copyConfig = prioritizeOverride('copyConfig');

    options.browserSyncConfig = prioritizeOverride('browserSyncConfig');

    options.port = prioritizeOverride('port') || 3000;
    options.host = prioritizeOverride('host') || 'localhost';

    options.includeExternalDeps = prioritizeOverride('includeExternalDeps');

    return options;
};
