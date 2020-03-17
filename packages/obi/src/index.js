// import {def, extend, isFunc, isObj, Subie, arrayIncludesItemFromArray} from "@iosio/util";
//
//
// export const select = (obi, selections = []) => ({
//     $onChange: (callback) => {
//
//         const {sub, notify} = Subie(),
//
//             mainUnsub = obi.$onAnyChange((data, paths = []) =>
//                 arrayIncludesItemFromArray(selections, paths) && notify(data, paths)
//             ),
//             unsub = sub(callback);
//
//         return () => (mainUnsub(), unsub());
//     }
// });
//
//
// let non_enumerables = ['$obi', '$batching', '$onChange', '$getState', '$merge', '$path', '$select'];
//
// export const obi = suspect => {
//     let {sub: base_sub, notify: base_notify} = Subie();
//     let notifyingPaths = [];
//     const obiOuter = (_suspect, lastPath = '') => {
//         const {sub, notify} = Subie();
//         let makeObi = (obj, _lastPath = '') => {
//             if (obj.$obi) return obj;
//             def(obj, '$obi', {enumerable: false, value: true});
//             def(obj, '$batching', {enumerable: false, value: {active: false}});
//             def(obj, '$onChange', {
//                 enumerable: false,
//                 value: (callback) => sub(callback)
//             });
//             def(obj, '$onAnyChange', {
//                 enumerable: false,
//                 value: (callback) => base_sub(callback)
//             });
//             def(obj, '$getState', {
//                 enumerable: false,
//                 value: () => Object.keys(obj).reduce((acc, curr) =>
//                     !isFunc(obj[curr]) ? (acc[curr] = (isObj(obj[curr]) && obj[curr].$obi)
//                         ? obj[curr].$getState() : obj[curr], acc) : acc, {})
//             });
//             def(obj, '$merge', {
//                 enumerable: false,
//                 value: (update, ignoreUpdate) => {
//                     suspect.$batching.active = true;
//                     isFunc(update) ? update(_suspect) : extend(_suspect, update);
//                     suspect.$batching.active = false;
//                     if (!ignoreUpdate) {
//                         notify(_suspect, notifyingPaths);
//                         base_notify(suspect, notifyingPaths);
//                     }
//                     notifyingPaths = [];
//                 }
//             });
//             def(obj, '$select', {
//                 enumerable: false,
//                 value: (selections = []) => extend({}, {
//                     ...obj,
//                     ...select(obj, selections)
//                 })
//             });
//             for (let key in obj) {
//                 let internal = obj[key];
//                 if (isFunc(internal) || non_enumerables.includes(key)) continue;
//                 let path = _lastPath + (_lastPath ? '.' : '') + key;
//                 if (isObj(internal)) obiOuter(obj[key], path);
//                 def(obj, key, {
//                     enumerable: true,
//                     get: () => internal,
//                     set(value) {
//                         if (value === internal) return;
//                         if (isObj(value) && isObj(internal) && obj[key].$merge) {
//                             obj[key].$merge(value);
//                         } else {
//                             internal = value;
//                             notifyingPaths.push(path);
//                             if (!suspect.$batching.active) {
//                                 notify(_suspect, [path]);
//                                 base_notify(suspect, [path]);
//                                 notifyingPaths = [];
//                             }
//                         }
//                     },
//                 });
//             }
//             return obj
//         };
//         return makeObi(_suspect, lastPath);
//     };
//     return obiOuter(suspect)
// };
export const obi =
    (suspect, _parent = suspect, _lastPath = '', [base_sub, base_notify] = Subie(), notifyingPaths = []) => {
        if (suspect.$obi) return suspect;
        const [sub, notify] = Subie(), _obi = {
            $obi: true,
            $batch: {_: 0},
            $onChange: cb => sub(cb),
            $onAnyChange: cb => base_sub(cb),
            $getState: () => Object.keys(suspect).reduce((acc, curr) =>
                !isFunc(suspect[curr]) ? (acc[curr] = (isObj(suspect[curr]) && suspect[curr].$obi)
                    ? suspect[curr].$getState() : suspect[curr], acc) : acc, {}),
            $merge: (update, ignoreUpdate) => {
                _parent.$batch._ = true;
                isFunc(update) ? update(suspect) : Object.keys(update).map(k => suspect[k] = update[k]);
                _parent.$batch._ = false;
                if (!ignoreUpdate) notify(suspect, notifyingPaths), base_notify(_parent, notifyingPaths);
                notifyingPaths = [];
            },
            $select: (selections = []) => ({
                ...suspect, $onChange: (callback, [sub, notify] = Subie(), mainUnsub, unsub) => (
                    mainUnsub = _parent.$onAnyChange((data, paths = []) =>
                        selections.some(val => paths.includes(val)) && notify(data, paths)
                    ), unsub = sub(callback), () => (mainUnsub(), unsub())
                )
            })
        };
        for (let key in suspect) {
            let internal = suspect[key], path = _lastPath + (_lastPath ? '.' : '') + key;
            if (isObj(internal)) obi(suspect[key], _parent, path, [base_sub, base_notify], notifyingPaths);
            def(suspect, key, {
                enumerable: true,
                get: () => internal,
                set(value) {
                    if (value === internal) return;
                    isObj(value) && isObj(internal) && suspect[key].$merge ?
                        suspect[key].$merge(value) : (
                            (internal = value), notifyingPaths.push(path),
                            !_parent.$batch._ && (base_notify(_parent, [path]),
                                notify(suspect, [path]), (notifyingPaths = []))
                        )
                }
            });
        }
        for (let k in _obi) def(suspect, k, {enumerable: false, value: _obi[k]});
        return suspect
    };
const isObj = thing => typeof thing === 'object' && !Array.isArray(thing),
    isFunc = thing => typeof thing === 'function',
    Subie = (subs = [], _unsub = it => subs.splice(subs.indexOf(it) >>> 0, 1)) => [
        it => ((subs.push(it), () => _unsub(it))), (...data) => subs.slice().map(f => f(...data)), _unsub
    ], def = (s, k, o) => Object.defineProperty(s, k, o);