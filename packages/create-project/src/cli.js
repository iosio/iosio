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


export const isDirectory = (name) => new Promise((resolve) => {
    fs.stat(name, (err, stats)=>{
        resolve(err ? false : stats.isDirectory())
    })
});


const templateDirectory = __dirname + '/templates/app';
const targetDirectory = process.cwd();

async function copyTemplateFiles(options) {
    console.log(chalk.cyan('Copy project files'));
    return fse.copy(templateDirectory, targetDirectory);
}


function generateFilesFromParts(options) {
    console.log(chalk.cyan('Generate files'));
    return Promise.all([
        fse.writeFile(targetDirectory + '/package.json', packagejson(options)),
        fse.writeFile(targetDirectory + '/index.html', indexHTML(options)),
        fse.writeFile(targetDirectory + '/.gitignore', gitignore(options))
    ])
}

export async function createProject(options) {
    await copyTemplateFiles(options).then(()=>generateFilesFromParts(options));
    console.log('%s Project ready', chalk.green.bold('DONE'));
    return true;
}


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




// const rootScriptsLocation = './node_modules/@iosio/create-x-app-scripts/src';
const rootScriptsLocation = __dirname + '/rollup';
const devLocation = rootScriptsLocation + '/dev.js';
// const devLocation = '../src/dev_.js';
const buildLocation = rootScriptsLocation + '/build.js';

const buildLibLocation = rootScriptsLocation + '/build_lib.js';
// const buildLocation = '../src/build_.js';

export async function cli(args) {
    let options = parseArgumentsIntoOptions(args);

    const {action, api} = options;

    if(['start', 'build'].includes(action)){

        // let pathToRollup = path.join()

        const subprocess = execa.shell(
            `rollup -c ${action === 'build'? buildLocation : devLocation}${api ? (' --environment ENV:' + api) : ''}`
        );

        subprocess.stdout.pipe(process.stdout);

        return subprocess;

        // await isDirectory(rootScriptsLocation).then((exists)=>{
        //     if(!exists){
        //         console.error(chalk.red('The required package "@iosio/create-x-app-scripts" is not installed'));
        //         return process.exit();
        //     }
        // });

    } else if(!action) {

        console.log(chalk.cyan('version: ' + PKG.version));
        options = await promptForMissingOptions(options);
        await createProject(options);
        console.log(chalk.green('run npm install then npm start to begin developing!!!'));
    }

}


