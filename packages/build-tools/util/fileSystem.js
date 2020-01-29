import {promisify} from "es6-promisify";
import fs from "fs";

export const readFile = promisify(fs.readFile);

export const isDirectory = (name) => new Promise((resolve) => {
    fs.stat(name, (err, stats) => {
        // console.log('*********', err, stats);
        resolve(err ? false : stats.isDirectory())
    })
});

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