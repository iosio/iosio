import {rollupWatch} from "@iosio/build-tools/rollup";
import {DevServer} from "@iosio/build-tools/devServer";
import {rollupConfig} from "packages/x-project";

import path from "path";

export const dev =
    ({
         cwd,
         devInput,
         html,
         devOutputDir,
         browsers,
         cssBrowsers,
         host,
         port,
         open,
         alias,
         browserSyncConfig,
         copyConfig,

     }) => {

        const config = rollupConfig({
            buildType: 'dev',
            cwd,
            entry: devInput,
            alias,
            html,
            output: devOutputDir,
            browsers,
            cssBrowsers,
            copyConfig,
            target: browsers,
            writeMeta: true,
            format: 'modern',
            minifyLiterals: true,
        });

        return rollupWatch(config, {
            onBuild: DevServer({
                baseDir: devOutputDir,
                ...(browserSyncConfig ? browserSyncConfig : {})
            })
        })
    };