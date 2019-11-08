import fse from 'fs-extra';

import chalk from 'chalk';

import fs from 'fs';

export const isDirectory = (name) => new Promise((resolve) => {
    fs.stat(name, (err, stats) => {

        // console.log('*********', err, stats);
        resolve(err ? false : stats.isDirectory())
    })
});


const DYNAMIC_IMPORTS = 'dynamicImports.js';

export const createLazyPages = ({dir, type}) => {

    const lazyDir = process.cwd() + (dir || '/src/lazyPages');


    return isDirectory(lazyDir).then((isDirectory) => {
        if (!isDirectory) return Promise.resolve();


        return fse.readdir(lazyDir).then((filenames) => {

            let string = type === 'preact' ? 'export const pathMapFn = (lazyLoader) => ({\n' : 'export const lazyMap = {\n';

            let pathMap = {};

            if (filenames.length < 1) return;

            console.log(chalk.green('generating dynamic imports in lazyPages directory'));

            filenames.forEach((fn, i) => {

                if (fn !== DYNAMIC_IMPORTS) {

                    let name = fn.replace('.js', '');

                    let path = name.replace('-page', '');


                    path = path === 'index' ? '' : path;

                    if (type === 'preact') {

                        string = string + `\t"/${path}" : lazyLoader(() => import("./${fn}")),` + (i === filenames.length - 1 ? '' : '\n');

                    } else {
                        pathMap[`/${path}`] = name;

                        string = string + `"${name}": () => import("./${fn}"),` + (i === filenames.length - 1 ? '' : '\n')
                    }
                }
            });

            if (type === 'preact') {
                string = string + '\n});'
            } else {
                string = string + '\n};' + '\n\n' +
                    'export const pathMap = ' + JSON.stringify(pathMap, null, '\t') + ';';
            }

            return fse.outputFile(lazyDir + `/${DYNAMIC_IMPORTS}`, string);
        })

    })
};