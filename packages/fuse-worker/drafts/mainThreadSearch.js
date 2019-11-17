// function debounce(func, wait, immediate) {
//     var timeout;
//
//     function debounced() {
//         var context = this, args = arguments;
//         var later = function () {
//             timeout = null;
//             if (!immediate) func.apply(context, args);
//         };
//         var callNow = immediate && !timeout;
//         clearTimeout(timeout);
//         timeout = setTimeout(later, wait);
//         if (callNow) func.apply(context, args);
//     }
//
//     debounced.cancel = () => clearTimeout(timeout);
//     return debounced;
// }
//
// const debounceOpts = {time: 0, immediate: null};
//
// const FuseWorker = ({options = {}, debounceOpts = debounceOpts, list = []}) => {
//
//     let _options = {
//         shouldSort: true,
//         minMatchCharLength: 1,
//         findAllMatches: true,
//         keys: ['name'],
//         maxPatternLength: 50,
//         threshold: 0.4,
//         distance: 1000,
//         location: 0,
//         ...options,
//     };
//
//     let originalList = list;
//
//     let fuse = null;
//
//     let canceled = false;
//
//     const setFuse = ({list, options}) => {
//         if (list) originalList = list;
//         if (options) _options = {..._options, ...options};
//         fuse = new Fuse(originalList, _options);
//     };
//
//     // const fuseSearch = value => new Promise(resolve => resolve());
//     const searchDebounced = debounce(
//         (value, callback) => callback(fuse.search(value)),
//         debounceOpts.time || 0,
//         debounceOpts.immediate || null
//     );
//
//     const search = (value, callback) => {
//         value = value.trim();
//         if (value && fuse) {
//             canceled = false;
//             searchDebounced(value, (results) => {
//                 !canceled && callback(results);
//             })
//         } else {
//             canceled = true;
//             searchDebounced.cancel();
//             callback(originalList);
//         }
//     };
//
//     return {setFuse, searh};
// };