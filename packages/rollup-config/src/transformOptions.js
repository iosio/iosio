import fs from 'fs';
import path, {basename, resolve} from "path";
import {reduce} from 'asyncro'
import {getConfigFromPkgJson, getName, getInput, getOutput, getEntries, getFile, safeVariableName} from "./util";
import glob from 'tiny-glob/sync';


const CONFIG_NAME = 'xProjectConfig';

const cli = async (inputOptions) => {
    let options = {...inputOptions};
    let cwd = options.cwd = resolve(process.cwd(), inputOptions.cwd);
    const pkg = getFile('package.json', cwd);
    if (!pkg) throw new Error('No package.json!');
    let conf = getFile(CONFIG_NAME + '.js', cwd) || pkg[CONFIG_NAME] || {};


    const optionTransforms = [
        (acc) => {
            // remove commandline option for this
            acc.name =  safeVariableName(
                options.name || pkg.name || pkg.amdName || conf.name || conf.amdName || basename(cwd)
            );
            return acc;
        },
        (acc) => {
            acc.sourcemap = (options.sourcemap || conf.sourcemap) !== false;
            return acc;
        },
        (acc) => {
            acc.entries = []
            return acc;
        },

        (acc, pkg, conf, cli) => {

            acc['fuck'] = 'face';

            return acc;
        },
    ];

    const transformOptions = async (opts) => {
        const converted = await reduce(opts, async (acc, curr) => await curr(acc), {});
        return converted;
    };

    const opts = await transformOptions(optionTransforms);


    return 'await rollupConfig(opts)'


};

console.log(glob('/src'));

// getConfigFromPkgJson(process.cwd())
//     .then(({hasPackageJson, pkg}) => {
//
//     })