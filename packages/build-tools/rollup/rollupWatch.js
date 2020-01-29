import {rollup, watch} from 'rollup';
import {stdout} from "../util"
import {blue} from "kleur";
import {dirname, relative} from "path";
import {logError} from "../util/logError";


const WATCH_OPTS = {
    exclude: 'node_modules/**',
};

export const rollupWatch = (config, { cwd, output, onBuild}) => new Promise((resolve, reject) => {
    const _onBuild = onBuild;
    let _path = '';// relative(cwd, dirname(output),);
    stdout(blue(`Watching source, compiling to ${_path}:`));

    [].concat(config).map((options) => {
        const {inputOptions, outputOptions, onBuild} = options;
        watch(
            Object.assign(
                {
                    output: outputOptions,
                    watch: WATCH_OPTS,
                },
                inputOptions,
            ),
        ).on('event', e => {
            if (e.code === 'FATAL') {
                return reject(e.error);
            } else if (e.code === 'ERROR') {
                logError(e.error);
            }
            if (e.code === 'END') {
                if (onBuild) {
                    onBuild(e, options);
                } else if (_onBuild) {
                    _onBuild(e, options);
                }
            }
        });
    });
});