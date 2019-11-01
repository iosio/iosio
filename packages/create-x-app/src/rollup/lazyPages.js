import fse from 'fs-extra';

import chalk from 'chalk';

import fs from 'fs';
export const isDirectory = (name) => new Promise((resolve) => {
    fs.stat(name, (err, stats)=>{

        // console.log('*********', err, stats);
        resolve(err ? false : stats.isDirectory())
    })
});



const IGNORE_DYNAMIC_IMPORTS = 'dynamicImports.js';

export const createLazyPages = (ROOT) => {

    const lazyDir = (ROOT || process.cwd()) + '/src/lazyPages';


    return isDirectory(lazyDir).then((isDirectory) => {
        if (!isDirectory) return Promise.resolve();


        return fse.readdir(lazyDir).then((filenames) => {

            let string = 'export const lazyMap = {\n';

            let pathMap = {};

            if (filenames.length < 1) return;

            console.log(chalk.green('generating dynamic imports in lazyPages directory'));

            filenames.forEach((fn, i) => {

                if (fn !== IGNORE_DYNAMIC_IMPORTS) {

                    let name = fn.replace('.js', '');

                    let path = name.replace('-page', '');
                    path = path === 'index' ? '' : path;

                    pathMap[`/${path}`] = name;

                    string = string + `"${name}": () => import("./${fn}"),` + (i === filenames.length -1 ? '' : '\n')
                }
            });

            string = string + '\n};' + '\n\n' +
                'export const pathMap = ' + JSON.stringify(pathMap, null, '\t') + ';';

            return fse.outputFile(lazyDir + `/${IGNORE_DYNAMIC_IMPORTS}`, string);
        })

    })
};