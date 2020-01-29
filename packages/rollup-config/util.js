import path, {basename, dirname, resolve} from 'path';
import gzipSize from "gzip-size";
import brotliSize from "brotli-size";
import prettyBytes from "pretty-bytes";
import {green, red, yellow, white, blue} from 'kleur';
// Extensions to use when resolving modules
export const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.es6', '.es', '.mjs'];
// Parses values of the form "$=jQuery,React=react" into key-value object pairs.
export const parseMappingArgumentAlias = aliasStrings => {
    return aliasStrings.split(',').map(str => {
        let [key, value] = str.split('=');
        return {find: key, replacement: value};
    });
};

// Convert booleans and int define= values to literals.
// This is more intuitive than `microbundle --define A=1` producing A="1".
export const toReplacementExpression = (value, name) => {
    // --define A="1",B='true' produces string:
    const matches = value.match(/^(['"])(.+)\1$/);
    if (matches) {
        return [JSON.stringify(matches[2]), name];
    }

    // --define A=1,B=true produces int/boolean literal:
    if (/^(true|false|\d+)$/i.test(value)) {
        return [value, name];
    }

    // default: string literal
    return [JSON.stringify(value), name];
};

// Normalize Terser options from microbundle's relaxed JSON format (mutates argument in-place)
export function normalizeMinifyOptions(minifyOptions) {
    const mangle = minifyOptions.mangle || (minifyOptions.mangle = {});
    let properties = mangle.properties;

    // allow top-level "properties" key to override mangle.properties (including {properties:false}):
    if (minifyOptions.properties != null) {
        properties = mangle.properties =
            minifyOptions.properties &&
            Object.assign(properties, minifyOptions.properties);
    }

    // allow previous format ({ mangle:{regex:'^_',reserved:[]} }):
    if (minifyOptions.regex || minifyOptions.reserved) {
        if (!properties) properties = mangle.properties = {};
        properties.regex = properties.regex || minifyOptions.regex;
        properties.reserved = properties.reserved || minifyOptions.reserved;
    }

    if (properties) {
        if (properties.regex) properties.regex = new RegExp(properties.regex);
        properties.reserved = [].concat(properties.reserved || []);
    }
}

// Parses values of the form "$=jQuery,React=react" into key-value object pairs.
export const parseMappingArgument = (globalStrings, processValue) => {
    const globals = {};
    globalStrings.split(',').forEach(globalString => {
        let [key, value] = globalString.split('=');
        if (processValue) {
            const r = processValue(value, key);
            if (r !== undefined) {
                if (Array.isArray(r)) {
                    [value, key] = r;
                } else {
                    value = r;
                }
            }
        }
        globals[key] = value;
    });
    return globals;
};

function ensureExt(fn) {
    return /\.js$/.test(fn) ? fn : fn + '.js';
}

export const absolutePathPlugin = ({input, baseUrl, cwd}) => ({
    resolveId: (importee, importer) => {
        if (importee[0] === '/') {
            if (importee !== input) {
                const srcRoot = path.resolve(cwd || process.cwd(), baseUrl);
                const combined = path.join(srcRoot, importee);
                return ensureExt(combined)
            }
        }
    }
});

export const isTruthy = obj => {
    if (!obj) return false;
    return obj.constructor !== Object || Object.keys(obj).length > 0;
};

// Hoist function because something (rollup?) incorrectly removes it
function formatSize(size, filename, type, raw) {
    const pretty = raw ? `${size} B` : prettyBytes(size);
    const color = size < 5000 ? green : size > 40000 ? red : yellow;
    const MAGIC_INDENTATION = type === 'br' ? 13 : 10;
    return `${' '.repeat(MAGIC_INDENTATION - pretty.length)}${color(
        pretty,
    )}: ${white(basename(filename))}.${type}`;
}

export async function getSizeInfo(code, filename, raw) {
    const gzip = formatSize(
        await gzipSize(code),
        filename,
        'gz',
        raw || code.length < 5000,
    );
    let brotli;
    //wrap brotliSize in try/catch in case brotli is unavailable due to
    //lower node version
    try {
        brotli = formatSize(
            await brotliSize(code),
            filename,
            'br',
            raw || code.length < 5000,
        );
    } catch (e) {
        return gzip;
    }
    return gzip + '\n' + brotli;
}

export function replaceName(filename, name) {
    return resolve(
        dirname(filename),
        name + basename(filename).replace(/^[^.]+/, ''),
    );
}