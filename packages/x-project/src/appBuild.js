import  {combineAndNormalizeOptions} from "./combineAndNormalizeOptions";
import {createBuilds} from "./createBuilds";
import {clearDir} from "@iosio/node-util";

export const appBuild = async (inputOptions = {}) => {

    const options = await combineAndNormalizeOptions({
        ...inputOptions,
        configName: inputOptions.configName || 'xProjectConfig',
        preset: inputOptions.preset || 'build_app',
        app_env: process.env.app_env
    });

    options.envs && Object.keys(options.envs)
        .forEach((key) => process.env[key] = options.envs[key]);

    await clearDir(options.output);
    return createBuilds(options);
};