import {series} from "asyncro";
import {blue} from "kleur";
import {dirname, relative} from "path";
import {rollup} from 'rollup';


let cache;

export const nodeRollup = async function ({configsArray}) {
    let out = await series(
        configsArray.map(config => async () => {
            const {output, ...inputOptions} = config;
            inputOptions.cache = cache;
            let bundle = await rollup(inputOptions);
            cache = bundle;
            await bundle.write(output);
            if(config._sizeInfo){
                return await config._sizeInfo;
            }
        }),
    );

    return (
        blue(
            `Build "${options.name}" to ${relative(cwd, dirname(options.output)) ||
            '.'}:`,
        ) +
        '\n   ' +
        out.join('\n   ')
    );
};
