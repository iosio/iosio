import {setup} from "./setup";
import browserSync from 'browser-sync';
import historyApiFallback from 'connect-history-api-fallback'

const serve = ({buildOutputDir, port, browserSyncConfig}) => {
    const bs = browserSync.create('buildServer');

    bs.init({
        ...(port ? {port} : {}),
        server: {
            baseDir: buildOutputDir,
            middleware: [historyApiFallback()]
        },
        ui: false,
        ...(browserSyncConfig ? browserSyncConfig : {})
    });

};

export const serve_build = () => setup(serve);