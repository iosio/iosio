import path from 'path';
const cwd = process.cwd();
function ensureExt(fn) {
    return /\.js$/.test(fn) ? fn : fn + '.js';
}

export const absolutePathPlugin = ({ input, baseUrl}) => ({
    resolveId: (importee, importer) => {
        if (importee[0] === '/') {
            if (importee !== input) {
                const srcRoot = path.resolve(cwd, baseUrl);
                const combined = path.join(srcRoot, importee);
                return ensureExt(combined)
            }
        }
    }
});
