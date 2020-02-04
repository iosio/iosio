import path from "path";

import fs from 'fs';


export const setup = (rollup) => {

    const cwd = process.cwd();

    const pkg = require(path.join(cwd, 'package.json'));

    let xProjectConfig;

    let possibleJsConfig = path.join(cwd, 'xProjectConfig.js');
    let possibleJSONConfig = path.join(cwd, 'xProjectConfig.json');

    if (fs.existsSync(possibleJsConfig)) {
        xProjectConfig = require(possibleJsConfig);
    } else if (fs.existsSync(possibleJSONConfig)) {
        xProjectConfig = require(possibleJSONConfig)
    } else {
        xProjectConfig = pkg.xProjectConfig || {}
    }

    let c = xProjectConfig || {};

    let APP_ENV = process.env.APP_ENV;

    let ENVS = c.APP_ENV && APP_ENV && c.APP_ENV[APP_ENV];

    ENVS && Object.keys(ENVS).forEach((key) => {
        process.env[key] = ENVS[key];
    });

    const giveRoot = (arr) => arr.map((filePath) => path.join(cwd, filePath));

    const input = Array.isArray(c.input) ? giveRoot(c.input) : path.join(cwd, (c.input || '/src/index.js'));

    const lib_input = !c.lib_input ? input
        : Array.isArray(c.lib_input) ? giveRoot(c.lib_input)
            : path.join(cwd, (c.lib_input || '/src/index.js'));

    const devInput = Array.isArray(c.devInput) ? giveRoot(c.devInput) : (c.devInput ? path.join(cwd, c.devInput) : input);

    let conf = {
        cwd,
        input,
        lib_input,
        devInput,
        html: path.join(cwd, (c.html || '/src/index.html')),
        devOutputDir: path.join(cwd, c.devOutputDir || '/build'),
        buildOutputDir: path.join(cwd, c.buildOutputDir || '/build'),
        libOutputDir: path.join(cwd, c.libOutputDir || '/lib'),
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
        copyConfig: c.copyConfig
    };

    return rollup(conf)
};
