import arg from 'arg';
import inquirer from 'inquirer';
import chalk from 'chalk';

import execa from 'execa';

import PKG from '../package';

import fse from 'fs-extra';

import path from 'path';

import packagejson from './template_parts/app/packagejson'
import indexHTML from './template_parts/app/indexHTML'
import gitignore from './template_parts/app/gitignore'


import fs from "fs";

import {serve_build} from "./rollup/serve_build";

import {dev} from './rollup/dev';
import {setup} from "./rollup/setup";
import {stdout} from "./rollup/util";
import {logError} from "./rollup/logError";


function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
        {
            '--git': Boolean,
            '--yes': Boolean,
            '--install': Boolean,
            '-g': '--git',
            '-y': '--yes',
            '-i': '--install',
        },
        {
            argv: rawArgs.slice(2),
        }
    );
    return {
        skipPrompts: args['--yes'] || false,
        git: args['--git'] || false,
        action: args._[0],
        api: args._[1],
        runInstall: args['--install'] || false,
    };
}


async function promptForMissingOptions(options) {
    const defaultTemplate = 'app';

    if (options.skipPrompts) {
        return {
            ...options,
            template: defaultTemplate,
        };
    }
    const questions = [];

    questions.push({
        type: 'input',
        name: 'npm_library_name',
        message: 'Enter project name...',
        default: 'my_project',
    });

    const answers = await inquirer.prompt(questions);

    return {
        ...options,
        ...answers,
        npm_library_description: "",
        template: defaultTemplate,
        git: options.git || answers.git,
        npm_namespace: ''
    };
}


const rootScriptsLocation = __dirname + '/rollup';
const devLocation = rootScriptsLocation + '/dev.js';
// const devLocation = '../src/dev_.js';
const buildLocation = rootScriptsLocation + '/build.js';

const buildLibLocation = rootScriptsLocation + '/build_lib.js';

const rollupLocations = {
    'start': devLocation,
    'build': buildLocation,
    'build_lib': buildLibLocation
};

// const buildLocation = '../src/build_.js';
// console.log('asdf')
export async function cli(args) {
    let options = parseArgumentsIntoOptions(args);

    const {action, api} = options;

    if (!action) {

        console.log(chalk.cyan('version: ' + PKG.version));
        options = await promptForMissingOptions(options);
        await scaffold(options);
        console.log(chalk.green('run npm install then npm start to begin developing!!!'));
    } else {

        // let pathToRollup = path.join()
        let rollupLocation = rollupLocations[action];

        if (action === 'serve_build') {
            serve_build();
        } else if (!rollupLocation) {

            console.error('invalid cli command. must be: start, build, build_lib or serve_build.');
            return process.exit();
        } else {

            // const subprocess = execa.shell(
            //     `rollup -c ${rollupLocation}${api ? (' --environment APP_ENV:' + api) : ''}`
            // );
            // subprocess.stdout.pipe(process.stdout);
            // return subprocess;
            return setup(dev).then(output => {
                if (output != null) stdout(output);
            }).catch((err) => {
                process.exitCode = (typeof err.code === 'number' && err.code) || 1;
                logError(err);
                process.exit();
            });
        }

    }

}


