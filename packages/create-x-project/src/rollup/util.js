
import fs from 'fs';

// Parses values of the form "$=jQuery,React=react" into key-value object pairs.
export const parseMappingArgumentAlias = aliasStrings => {
    return aliasStrings.split(',').map(str => {
        let [key, value] = str.split('=');
        return { find: key, replacement: require.resolve(value) };
    });
};



export const isDirectory = (name) => new Promise((resolve) => {
    fs.stat(name, (err, stats) => {
        // console.log('*********', err, stats);
        resolve(err ? false : stats.isDirectory())
    })
});