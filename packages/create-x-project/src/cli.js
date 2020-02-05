import sade from 'sade';
import {scaffold} from "./scaffold/scaffold";
import {isDirEmpty, log} from "@iosio/node-util";
import {xProject} from "@iosio/x-project";

let {version} = require('../package');

const start = 'start';
const build_app = 'build_app';
const build_lib = 'build_lib';

const presets = {
    start,
    build_app,
    build_lib
};

export const program = handler => {

    const cmd = command => (opts, str) => {

        handler({command, opts, str});
    };

    let prog = sade('x');

    prog.version(version)
        .option('--app_env', 'Specify which envs to use in your config')
        .example('x start --app_env prod')
        .option('--cwd', 'Use an alternative working directory', '.')
        .example('x start --cwd someOtherProject/')
        .option('--project', 'Specify an overrides object on the config "project" property')
        .example('x start --project demo');

    prog.command(start)
        .describe('Starts a dev server and rebuilds on any changes')
        .example(`x ${start}`)
        .action(cmd(start));

    prog.command(build_app)
        .describe('Builds a production web app')
        .example(`x ${build_app}`)
        .action(cmd(build_app));

    prog.command(build_lib)
        .describe('Produces tiny, optimized code for your node module')
        .example(`x ${build_lib}`)
        .action(cmd(build_lib));

    prog.command('serve_build')
        .describe('Serves the production build')
        .example('x serve_build')
        .action(cmd('serve_build'));

    // prog.command('add')
    //     .describe('Add a template file to your existing project (coming soon!)')
    //     .example('x add --rollup_build_app')
    //     .action(cmd('add'));

    return argv => prog.parse(argv);
};


export const cli = async function (rawArgs) {

    let hasArgs = rawArgs.slice(2).length > 0;

    const emptyProject = await isDirEmpty(process.cwd());

    if (hasArgs && !emptyProject) {

        program(({command, opts, str}) => {

            if (presets[command] || command === 'serve_build') {

                let options = {
                    // cwd
                    // app_env,
                    // project,
                    ...opts,
                    preset: command,
                    configName: 'xProjectConfig',
                };

                xProject(options)
                    .then(output => {
                        if (output != null) log.out(output);
                        if (command !== 'start' && command !== 'serve_build') process.exit(0);
                    })
                    .catch(err => {
                        process.exitCode = (typeof err.code === 'number' && err.code) || 1;
                        log.Error(err);
                        process.exit();
                    });
            }

        })(rawArgs);

    } else {

        return await scaffold();
    }

};

/*

   if (options.cli.command === 'add') {
                scaffold(options).catch(log.Error);
            } else {
            }
 */