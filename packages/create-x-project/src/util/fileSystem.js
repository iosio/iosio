import {promisify} from "es6-promisify";
import fs from "fs";
import {resolve} from "path";

export const readFile = promisify(fs.readFile);

export const isDirectory = (name) => new Promise((resolve) => {
    fs.stat(name, (err, stats) => {
        // console.log('*********', err, stats);
        resolve(err ? false : stats.isDirectory())
    })
});


export const isDirEmpty = (dir = '.') => new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => err ? reject(err) : resolve(!files.length));
});

export async function jsOrTs(cwd, filename) {
    const extension = (await isFile(resolve(cwd, filename + '.ts')))
        ? '.ts'
        : (await isFile(resolve(cwd, filename + '.tsx')))
            ? '.tsx'
            : '.js';

    return resolve(cwd, `${filename}${extension}`);
}

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

