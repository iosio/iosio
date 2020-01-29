export * from './fileSystem';
export * from './print'
export const isTruthy = obj => {
    if (!obj) return false;
    return obj.constructor !== Object || Object.keys(obj).length > 0;
};
