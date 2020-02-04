import {rollup, watch} from 'rollup';
import {stdout} from "../util"
import {blue, red} from "kleur";
import {dirname, relative} from "path";
import {logError} from "../util/logError";
import {isDirectory} from "../util";
import rimraf from 'rimraf';

const wrongConfigFormat = `\
inputOptions or outputOptions were not provided.
config object must include both properties.
ex:
{
   outputOptions:{ //output property goes here
        dir: 'path/to/output...',
        format: 'es'
        ...
   }
   inputOptions:{ // everything else goes here
        input: 'src/to/code.js,
        treeshake: 'xyz..'
        plugins: []
        ...
   },
}`;

const noOutputDetected = `\
rollupWatch: No output directory provided by the second argument or the config object`;

export const rollupWatch = (builds, options = {}, onBuild) =>
    new Promise((resolve, reject) => {

        if(!options.output)throw new Error(noOutputDetected);

        console.log('watching')

        isDirectory(options.output).then(isDir => {
            rimraf(options.output + (isDir ? '/*' : ''), {}, () => {
                let op = options.output.split('/');
                stdout(blue(`Watching source, building to: ${op[op.length-1]}`));
                builds.map((config) => {
                    const {inputOptions, outputOptions} = config;
                    if (!inputOptions || !outputOptions) throw new Error(wrongConfigFormat);
                    watch({
                        output: outputOptions,
                        watch: {exclude: 'node_modules/**'},
                        ...inputOptions
                    }).on('event', e => {
                        if (e.code === 'FATAL') return reject(e.error);
                        else if (e.code === 'ERROR') logError(e.error);
                        if (e.code === 'END') {
                            onBuild && onBuild(e, options);
                        }
                    });
                });
            })
        });
    });