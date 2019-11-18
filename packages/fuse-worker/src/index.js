export const FuseWorker = (config) => {
    let {workerURL, list, options} = config;

    let _options = {
        shouldSort: true,
        minMatchCharLength: 1,
        findAllMatches: true,
        keys: ['name'],
        maxPatternLength: 50,
        threshold: 0.4,
        distance: 1000,
        location: 0,
        ...options
    };

    let originalList = list || [];

    let lastSearchValue = '';

    let cb;

    const worker = new Worker(workerURL || './fuse.worker.js'),

        set = ({list, options}) => {
            if (options) _options = {..._options, ...options};
            if (list) originalList = list;
            worker.postMessage({type: 'set', data: {list: originalList, options: _options}});
        },
        search = (value, callback) => {
            lastSearchValue = value;
            cb = callback;
            worker.postMessage({type: 'search', data: value});
        };

    set({list, options: _options});

    worker.onmessage = ({data}) => {
        const {searchValue, results} = data.data;
        (searchValue === lastSearchValue) && cb && cb(!searchValue ? originalList : results);
    };

    return {set, search};
};








