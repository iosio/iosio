import browserSync from 'browser-sync';
import _historyApiFallback from 'connect-history-api-fallback';
import path from 'path';

let id = 0;
export const DevServer = (options = {}) => {
    let opts = {...options};

    let {cwd, server, baseDir, historyApiFallback, ...browserSyncConfig} = opts;

    cwd = cwd || process.cwd();

    server = server || {};

    const bs = browserSync.create('iosio-dev-server-' + (id++));

    let bsInitialized = false;

    let _baseDir = path.relative(cwd, baseDir || server.baseDir || 'build');

    return (dir) => {

        if (!bsInitialized) {
            bs.init({
                notify: false,
                ui: false,
                ...browserSyncConfig,
                server: {
                    ...server,
                    baseDir: _baseDir,
                    middleware: [
                        (historyApiFallback !== false) && _historyApiFallback(
                            typeof historyApiFallback === 'object' ? historyApiFallback : undefined
                        ),
                        ...(server.middleware || [])
                    ].filter(Boolean),
                },
            });
            bsInitialized = true;
        } else {
            bs.reload(dir || baseDir);
        }
    }
};