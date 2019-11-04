import path from "path";

import fs from 'fs';


export const setup = (rollup) => {


    const ROOT = process.cwd();

    let xProjectConfig;

    let possibleJsConfig = path.join(ROOT, 'xProject.config.js');
    let possibleJSONConfig = path.join(ROOT, 'xProject.config.json');

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

    const input = path.join(ROOT, (c.input || '/src/index.js'));

    let conf = {
        ROOT,
        input,
        devInput: c.devInput ? path.join(ROOT, c.devInput) : input,
        html: path.join(ROOT, (c.html || '/index.html')),
        devOutputDir: path.join(ROOT, c.devOutputDir || '/build'),
        buildOutputDir: path.join(ROOT, c.buildOutputDir || '/build'),
        libOutputDir: path.join(ROOT, c.libOutputDir || '/lib'),
        browsers: c.browsers || ['chrome 78'],
        cssBrowsers: c.cssBrowsers || c.browsers || ['chrome 78'],
        multiBuild: c.multiBuild,
        port: c.port || 3000,
        host: c.host || 'localhost',
        open: c.open,
        includeExternalDeps: c.includeExternalDeps
    };


    return rollup(conf)
};
