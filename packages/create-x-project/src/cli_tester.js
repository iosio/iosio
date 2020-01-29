import sade from 'sade';
import {stdout} from "./rollup/util";

let {version} = require('../package');

const toArray = val => (Array.isArray(val) ? val : val == null ? [] : [val]);

export const program = handler => {
    const ENABLE_MODERN = process.env.MICROBUNDLE_MODERN !== 'false';

    const DEFAULT_FORMATS = ENABLE_MODERN ? 'modern,es,cjs,umd' : 'es,cjs,umd';

    const cmd = type => (str, opts) => {
        console.log(str, opts)
        // opts.watch = opts.watch || type === 'watch';
        //
        // opts.compress = opts.compress != null ? opts.compress : opts.target !== 'node'
        //
        // opts.entries = toArray(str || opts.entry).concat(opts._);

        handler(opts);
    };

    let prog = sade('x');

    prog
        .version(version)
        .option('--entry, -i', 'Entry module(s)')
        .option('--compress', 'Compress output using Terser', null);

    prog
        .command('build [...entries]', '', {default: true})
        .describe('Build once and exit')
        .action(cmd('build'));

    // prog
    //     .command('watch [...entries]')
    //     .describe('Rebuilds on any change')
    //     .action(cmd('watch'));

    // Parse argv; add extra aliases
    return argv =>
        prog.parse(argv, {
            alias: {
                o: ['output', 'd'],
                i: ['entry', 'entries', 'e'],
                w: ['watch'],
            },
        });
};


export const cli = function (args) {

    const run = opts => {
        // stdout('opts', opts);
    };

    program(run)(args);

};