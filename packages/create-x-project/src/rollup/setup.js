import path from "path";

import fs from 'fs';


export const setup = (rollup) => {


    const ROOT = process.cwd();

    let xProjectConfig;

    let possibleJsConfig = path.join(ROOT, 'xProjectConfig.js');
    let possibleJSONConfig = path.join(ROOT, 'xProjectConfig.json');

    if (fs.existsSync(possibleJsConfig)) {

        xProjectConfig = require(possibleJsConfig);

    } else if (fs.existsSync(possibleJSONConfig)) {

        xProjectConfig = require(possibleJSONConfig)

    } else {

        xProjectConfig = require(path.join(ROOT, 'package.json')).xProjectConfig;

    }


    let c = xProjectConfig || {};

    let APP_ENV = process.env.APP_ENV;

    let ENVS = c.APP_ENV && APP_ENV && c.APP_ENV[APP_ENV];

    ENVS && Object.keys(ENVS).forEach((key) => {
        process.env[key] = ENVS[key];
    });


    const giveRoot = (arr) => arr.map((filePath) => path.join(ROOT, filePath));


    const input = Array.isArray(c.input) ? giveRoot(c.input) : path.join(ROOT, (c.input || '/src/index.js'));

    const lib_input = !c.lib_input
        ? input
        : Array.isArray(c.lib_input) ? giveRoot(c.lib_input) : path.join(ROOT, (c.lib_input || '/src/index.js'));


    const devInput = Array.isArray(c.devInput) ? giveRoot(c.devInput) : (c.devInput ? path.join(ROOT, c.devInput) : input);

    let conf = {
        ROOT,
        input,
        lib_input,
        devInput,
        html: path.join(ROOT, (c.html || '/src/index.html')),
        devOutputDir: path.join(ROOT, c.devOutputDir || '/build'),
        buildOutputDir: path.join(ROOT, c.buildOutputDir || '/build'),
        libOutputDir: path.join(ROOT, c.libOutputDir || '/lib'),
        browsers: c.browsers || ['chrome 78'],
        cssBrowsers: c.cssBrowsers || c.browsers || ['chrome 78'],
        multiBuild: c.multiBuild,
        port: c.port,
        host: c.host || 'localhost',
        open: c.open,
        includeExternalDeps: c.includeExternalDeps,
        alias: c.alias,
        commonjsConfig: c.commonjsConfig,
        browserSyncConfig: c.browserSyncConfig,
        lazyPagesConfig: c.lazyPagesConfig || {},
        copyConfig: c.copyConfig
    };

    return rollup(conf)
};
