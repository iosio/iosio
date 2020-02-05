import {presets} from "@iosio/rollup-config";
import {green} from "kleur";
import {relative} from "path";
import {clearDir, DevServer, nodeRollup, rollupWatch} from "@iosio/node-util";
import {combineAndNormalizeOptions} from "./combineAndNormalizeOptions";
import {createBuilds} from "./createBuilds";

export const xProject = async (inputOptions) => {

    const options = await combineAndNormalizeOptions(inputOptions);

    options.envs && Object.keys(options.envs)
        .forEach((key) => process.env[key] = options.envs[key]);

    const builds = createBuilds(options);

    if (options.preset === presets.start) {
        return await rollupWatch(builds, options, DevServer({baseDir: options.output}))
    } else {
        await clearDir(options.output);
        const logout = await nodeRollup({builds});
        return (
            green().bold(`Built "${options.name}" to ${relative(options.cwd, options.output) || '.'}`) +
            ( logout ? '\n   ' + logout.join('\n   ') : '')
        );
    }
};

export default xProject;