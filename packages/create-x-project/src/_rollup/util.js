
import fs from 'fs';
import { promisify } from 'es6-promisify';

// Parses values of the form "$=jQuery,React=react" into key-value object pairs.
export const parseMappingArgumentAlias = aliasStrings => {
    return aliasStrings.split(',').map(str => {
        let [key, value] = str.split('=');
        return { find: key, replacement: value };
    });
};

export const isDirectory = (name) => new Promise((resolve) => {
    fs.stat(name, (err, stats) => {
        // console.log('*********', err, stats);
        resolve(err ? false : stats.isDirectory())
    })
});


export const readFile = promisify(fs.readFile);

// export const writeFile = promisify(fs.writeFile);
export const stat = promisify(fs.stat);

export const isDir = name =>
    stat(name)
        .then(stats => stats.isDirectory())
        .catch(() => false);

export const isFile = name =>
    stat(name)
        .then(stats => stats.isFile())
        .catch(() => false);

export const stdout = console.log.bind(console); // eslint-disable-line no-console
export const stderr = console.error.bind(console);

export const isTruthy = obj => {
    if (!obj) {
        return false;
    }
    return obj.constructor !== Object || Object.keys(obj).length > 0;
};