import {getExternalsAndGlobals} from "./util";
import {rollupConfig, presets} from "@iosio/rollup-config";
import {log} from "@iosio/node-util";

export const createBuilds = (options) => {
    let builds = [];
    const {globals, externalTest, external: externals} = getExternalsAndGlobals(options);

    const external = id => {
        if (id === 'babel-plugin-transform-async-to-promises/helpers') return false;
        if (externalTest && externals.length > 0 || externalTest && !options.noExternals) {
            return externalTest(id);
        }
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
                external
            })
        ].filter(Boolean);
    } else if (options.preset === presets.start) {
        builds = [
            rollupConfig({
                ...options,
                globals,
                external,
                multiBuildApp: false
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

    if (typeof options.configOverride === 'function') {
        builds = builds.map(conf => {
            const overridden = options.configOverride({...conf}, options);
            return overridden || conf;
        })
    }
    return builds;
};