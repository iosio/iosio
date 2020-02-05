import {series} from "asyncro";
import {rollup, watch} from "rollup";
import {log} from "./logging";
import {clearDir} from "./fileSystem";

let cache;
export const nodeRollup = async function ({builds = [], afterBuildAsync}) {
    return await series(
        builds.map(config => async () => {
            const {inputOptions, outputOptions} = config;
            inputOptions.cache = cache;
            let bundle = await rollup(inputOptions);
            cache = bundle;
            await bundle.write(outputOptions);
            if (afterBuildAsync) {
                return await afterBuildAsync(config);
            }
        }),
    );
};


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
        if (!options.output) throw new Error(noOutputDetected);
        clearDir(options.output)
            .then(() => {
                let op = options.output.split('/');
                log.out(c => c.blue(`Watching source, building to: ${op[op.length - 1]}`));
                builds.map((config) => {
                    const {inputOptions, outputOptions} = config;
                    if (!inputOptions || !outputOptions) throw new Error(wrongConfigFormat);
                    watch({
                        output: outputOptions,
                        watch: {exclude: 'node_modules/**'},
                        ...inputOptions
                    }).on('event', e => {
                        if (e.code === 'FATAL') return reject(e.error);
                        else if (e.code === 'ERROR') log.Error(e.error);
                        if (e.code === 'END') onBuild && onBuild(e, options);
                    });
                });
            });
    });
