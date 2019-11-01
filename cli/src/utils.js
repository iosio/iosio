import fs from 'fs';
import {promisify} from 'es6-promisify';

import {red, dim} from 'kleur';


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




export const logError = function (err) {
    const error = err.error || err;
    const description = `${error.name ? error.name + ': ' : ''}${error.message ||
    error}`;
    const message = error.plugin
        ? `(${error.plugin} plugin) ${description}`
        : description;

    stderr(red().bold(message));

    if (error.loc) {
        stderr();
        stderr(`at ${error.loc.file}:${error.loc.line}:${error.loc.column}`);
    }

    if (error.frame) {
        stderr();
        stderr(dim(error.frame));
    } else if (err.stack) {
        const headlessStack = error.stack.replace(message, '');
        stderr(dim(headlessStack));
    }

    stderr();
};