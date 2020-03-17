import {obi} from "@iosio/obi";

export const createMediaMatch = (options = {}) => {

    let {
        screenSizes = ['xs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
        customPropPrepend = '--x-mediaMatch_',
        sizeMap = {}
    } = options;

    let sizeCustomProperties = {
        'xs': '360px',
        'sm': '600px',
        'md': '800px',
        'lg': '960px',
        'xl': '1280px',
        'xxl': '1920px',
        ...sizeMap
    };

    let mm = window.matchMedia;

    const docStyle = window.getComputedStyle(document.documentElement);

    let defaultNumCols = 12, numCols = docStyle.getPropertyValue(customPropPrepend + 'numCols');
    numCols = numCols ? (parseInt(numCols) || defaultNumCols) : defaultNumCols;

    let queries;
    let updateQueries = () => {
        queries = screenSizes.map((size, i) => {
            const mq = docStyle.getPropertyValue(customPropPrepend + size) || sizeCustomProperties[size];
            return `screen and (${i === 0 ? 'max' : 'min'}-width:${mq})`
        });
    };

    let getMatches = () => [...screenSizes.filter((size, i) => !!mm(queries[i]).matches ? size : false)];

    let percents = {...[...Array(numCols + 1)].map((_, i) => ((i / numCols) * 100).toFixed(8) + '%')};


    let getStyles = (matching, propOptions) => {
        let styleSizing = {};
        for (let i = matching.length, propMatch, percentage; i--;) {
            propMatch = propOptions[matching[i]];
            percentage = percents[propMatch];
            if ((propMatch + '') && percentage) {
                styleSizing = {
                    flexBasis: percentage,
                    maxWidth: percentage,
                    ...(propMatch === 0 ? {display: 'none'} : {})
                };
                break;
            }
        }
        return styleSizing
    };

    updateQueries();


    let initialMatches = getMatches();

    let mediaMatch = obi({
        matching: initialMatches,
        match: initialMatches[initialMatches.length - 1]
    });

    let getSetMatches = () => {
        let matches = getMatches();
        mediaMatch.$merge({
            matching: matches,
            match: matches[matches.length - 1]
        });
    };
    let listeners = [];
    queries.forEach(q => listeners.push(mm(q)));
    listeners.forEach(l => l.addListener(getSetMatches));

    mediaMatch.update = () => {
        listeners.forEach(l => l.removeListener(getSetMatches));
        listeners = [];
        updateQueries();
        queries.forEach(q => listeners.push(mm(q)));
        listeners.forEach(l => l.addListener(getSetMatches));
    };

    return {mediaMatch, getStyles, screenSizes}
};


// let p = {
//     0: "0.00000000%",
//     1: "8.33333333%",
//     2: "16.66666667%",
//     3: "25.00000000%",
//     4: "33.33333333%",
//     5: "41.66666667%",
//     6: "50.00000000%",
//     7: "58.33333333%",
//     8: "66.66666667%",
//     9: "75.00000000%",
//     10: "83.33333333%",
//     11: "91.66666667%",
//     12: "100.00000000%"
// };
//
// let q = [
//     "screen and (max-width:360px)",
//     "screen and (min-width:360px)",
//     "screen and (min-width:600px)",
//     "screen and (min-width:800px)",
//     "screen and (min-width:960px)",
//     "screen and (min-width:1280px)",
//     "screen and (min-width:1920px)"
// ];
//
// let asdf = (size, num) => ({
//     [`.col-${size}-${num}`]: {
//         flexBasis: percentage,
//         maxWidth: percentage,
//     }
// });
//
// let sizeCustomProperties = {
//     'xs': '360px',
//     'sm': '600px',
//     'md': '800px',
//     'lg': '960px',
//     'xl': '1280px',
//     'xxl': '1920px',
//     ...sizeMap
// };


let numCols = 12,
    sizes = ['360px', '360px', '600px', '800px', '1280px', '1920px', '2560px'],
    percents = [...[...Array(numCols + 1)].map((_, i) => ((i / numCols) * 100).toFixed(8) + '%')],

    flex = ['xs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl']
        .map((m, mi) => `@media (screen and (${mi === 0 ? 'max' : 'min'}-width:${sizes[mi]})) {
${percents.map((p, pi) => `.${m}-${pi}, [${m}=${pi}]{flex-basis:${p};max-width:${p};}`).join('\n')}
}`).join('\n');
