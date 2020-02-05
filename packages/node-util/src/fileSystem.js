import {promisify} from "es6-promisify";
import fs from "fs";
import rimraf from 'rimraf';

export const stat = promisify(fs.stat);

export const isDir = name =>
    stat(name)
        .then(stats => stats.isDirectory())
        .catch(() => false);

export const isFile = name =>
    stat(name)
        .then(stats => stats.isFile())
        .catch(() => false);

export const readFile = promisify(fs.readFile);

export const clearDir = (dir) => new Promise(resolve => {
    isDir(dir).then((dirThere) => rimraf(dir + (dirThere ? '/*' : ''), {}, resolve));
});

export const isDirEmpty = (dir = '.') => new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => err ? reject(err) : resolve(!files.length));
});