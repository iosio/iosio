import fse from "fs-extra";
import {log} from "../util/logging";
import path from "path";
import glob from 'tiny-glob/sync'
import {series} from "asyncro";
import inquirer from "inquirer";
import {isDirEmpty} from "../util/fileSystem";
import {safeVariableName} from "../util";


const createProject = async (options) => {

    const {projectTemplate, packageName, name} = options;

    log.out(c => c.cyan('Scaffolding project...'));

    const cwd = process.cwd();

    const fromHere = path.resolve(cwd, __dirname);

    await fse.copy(path.join(fromHere, `templates/${projectTemplate}/`), cwd);

    const parts = glob(`template_parts/${projectTemplate}/*`, {cwd: fromHere});

    await series(parts.map((part) => async () => {
        const filePart = require(path.join(fromHere, part)).default;
        const {file, content} = await filePart(options);
        return await fse.writeFile(path.join(cwd, file), content);
    }));

    log.out(c => 'Project Ready ' + c.green().bold('DONE'));

};


export const scaffold = async () => {

    const questions = [];

    const isEmpty = await isDirEmpty(process.cwd());

    if (isEmpty) {

        questions.push({
            type: 'input',
            name: 'name',
            message: 'Enter package name...',
            default: '@scope/my_project',
        });

        const {name} = await inquirer.prompt(questions);
        // if(name !== options.name) log.out(c=>c.blue(`Using "${options.name}" as a safe variable name`));
        await createProject({
            packageName: name,
            name: safeVariableName(name),
            projectTemplate: 'app'
        });

    }
    // else if (options.cli.command === 'add') {/* todo */}

};