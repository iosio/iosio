// import {def, extend, isFunc, isObj, Subie, isArray} from "../../util/src";
//
// export const createObi = (integrations) =>{
//
//     const obi = (suspect, rootNotify) => {
//         const {sub, notify} = Subie();
//         let makeObi = obj => {
//             if (obj.$obi) return obj;
//             def(obj, '$obi', {enumerable: false, value: true});
//             def(obj, '$batching', {enumerable: false, value: {active: false}});
//             def(obj, '$onChange', {enumerable: false, value: update => sub(update)});
//             !rootNotify && def(obj, '$uniqueNotifiers', {enumerable: false, value: true});
//             def(obj, '$getState', {
//                 enumerable: false,
//                 value: () => Object.keys(obj).reduce((acc, curr) =>
//                     !isFunc(obj[curr]) ? (acc[curr] = (isObj(obj[curr]) && obj[curr].$obi)
//                         ? obj[curr].$getState() : obj[curr], acc) : acc, {})
//             });
//             def(obj, '$merge', {
//                 enumerable: false,
//                 value: (update, ignoreUpdate) => {
//                     obj.$batching.active = true;
//                     isFunc(update) ? update(suspect) : extend(suspect, update);
//                     obj.$batching.active = false;
//                     !ignoreUpdate && notify(suspect);
//                 }
//             });
//
//             isArray(integrations) && integrations.forEach(i => i(obj));
//
//             for (let key in obj) {
//                 let internal = obj[key];
//                 if (isFunc(internal) || key.startsWith('$')) continue;
//                 if (isObj(internal)) rootNotify ? makeObi(obj[key]) : obi(obj[key]);
//                 def(obj, key, {
//                     enumerable: true,
//                     get: () => internal,
//                     set(value) {
//                         if (value === internal) return;
//                         internal = value;
//                         if (!suspect.$batching.active) notify(suspect);
//                     },
//                 });
//             }
//             return obj
//         };
//         return makeObi(suspect);
//     };
//
//     return obi;
// };