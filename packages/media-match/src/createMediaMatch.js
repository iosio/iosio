import {obi} from "@iosio/obi";

export const createMediaMatch = (options = {}) => {

    let {
        screenSizes = ['xs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
        customPropPrepend = '--x-mediaMatch_',
        sizeMap = {}
    } = options;

    let  sizeCustomProperties = {
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