import {getExternalsAndGlobals} from "./util";
import {presets} from "./presets";
import {rollupConfig} from "./config";

export const createBuilds = (options) => {
    let builds = [];
    const {globals, externalTest} = getExternalsAndGlobals(options);
    const external = id => {
        if (id === 'babel-plugin-transform-async-to-promises/helpers') return false;
        return externalTest(id);
    };
    if (options.preset === presets.build_app) {
        builds = [
            options.multiBuildApp && rollupConfig({
                ...options,
                legacy: true,
                globals,
                format: 'system',
                external
            }),
            rollupConfig({
                ...options,
                globals,
                format: 'modern',
                external
            })
        ].filter(Boolean);
    } else if (options.preset === presets.start) {
        builds = [
            rollupConfig({
                ...options,
                globals,
                format: 'modern',
                external
            })
        ]
    } else if (options.preset === presets.build_lib) {
        builds.push(
            rollupConfig({
                ...options,
                html: false,
                htmljs: false,
                globals,
                external
            })
        );
    }
    return builds;
};