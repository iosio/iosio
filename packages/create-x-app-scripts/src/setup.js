import path from "path";

export const setup = (rollup) => {


    const ROOT = process.cwd();

    let {cxa_config} = require(path.join(ROOT, 'package.json'));


    let c = cxa_config || {};

    let APP_ENV = process.env.APP_ENV;


    let ENVS = c.APP_ENV && APP_ENV && c.APP_ENV[APP_ENV];

    ENVS && Object.keys(ENVS).forEach((key) => {
        process.env[key] = ENVS[key];
    });


    let conf = {
        ROOT,
        input: ROOT + (c.input || '/src/index.js'),
        html: ROOT + (c.html || '/index.html'),
        outputDir: path.join(ROOT, c.outputDir || '/build'),
        browsers: c.browsers || ['chrome 78'],
        cssBrowsers: c.cssBrowsers || c.browsers || ['chrome 78'],
        multiBuild: c.multiBuild,
        port: c.port || 3000,
        host: c.host || 'localhost',
        open: c.open
    };


    return rollup(conf)
};
