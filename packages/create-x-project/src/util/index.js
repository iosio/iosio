import camelCase from 'camelcase';

export const toArray = val => (Array.isArray(val) ? val : val == null ? [] : [val]);

export const removeScope = name => name.replace(/^@.*\//, '');

export const safeVariableName = name =>
    camelCase(
        removeScope(name)
            .toLowerCase()
            .replace(/((^[^a-zA-Z]+)|[^\w.-])|([^a-zA-Z0-9]+$)/g, ''),
    );

export const isTruthy = obj => {
    if (!obj) {
        return false;
    }
    return obj.constructor !== Object || Object.keys(obj).length > 0;
};

export const parseMappingArgumentAlias = aliasStrings => {
    return aliasStrings.split(',').map(str => {
        let [key, value] = str.split('=');
        return { find: key, replacement: value };
    });
};