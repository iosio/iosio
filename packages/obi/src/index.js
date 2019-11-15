import {def, extend, isFunc, isObj, Subie, arrayIncludesItemFromArray} from "@iosio/util";

let non_enumerables = ['$obi', '$batching', '$onChange', '$getState', '$merge', '$path'];

export const obi = (suspect) => {

    let {sub: base_sub, notify: base_notify} = Subie();

    let notifyingPaths = [];

    const obiOuter = (_suspect, lastPath = '') => {

        const {sub, notify} = Subie();

        let makeObi = (obj, _lastPath = '') => {
            if (obj.$obi) return obj;
            def(obj, '$obi', {enumerable: false, value: true});
            def(obj, '$batching', {enumerable: false, value: {active: false}});
            def(obj, '$onChange', {
                enumerable: false,
                value: (callback) => sub(callback)
            });
            def(obj, '$onAnyChange', {
                enumerable: false,
                value: (callback) => base_sub(callback)
            });
            def(obj, '$getState', {
                enumerable: false,
                value: () => Object.keys(obj).reduce((acc, curr) =>
                    !isFunc(obj[curr]) ? (acc[curr] = (isObj(obj[curr]) && obj[curr].$obi)
                        ? obj[curr].$getState() : obj[curr], acc) : acc, {})
            });
            def(obj, '$merge', {
                enumerable: false,
                value: (update, ignoreUpdate) => {
                    suspect.$batching.active = true;
                    isFunc(update) ? update(_suspect) : extend(_suspect, update);
                    suspect.$batching.active = false;
                    if (!ignoreUpdate) {
                        notify(_suspect, notifyingPaths);
                        base_notify(suspect, notifyingPaths);
                    }
                    notifyingPaths = [];
                }
            });
            for (let key in obj) {
                let internal = obj[key];
                if (isFunc(internal) || non_enumerables.includes(key)) continue;
                let path = _lastPath + (_lastPath ? '.' : '') + key;
                if (isObj(internal)) obiOuter(obj[key], path);
                def(obj, key, {
                    enumerable: true,
                    get: () => internal,
                    set(value) {
                        if (value === internal) return;
                        internal = value;
                        notifyingPaths.push(path);
                        if (!suspect.$batching.active) {
                            notify(_suspect, [path]);
                            base_notify(suspect, [path]);
                            notifyingPaths = [];
                        }
                    },
                });
            }
            return obj
        };
        return makeObi(_suspect, lastPath);
    };
    return obiOuter(suspect)
};

export const select = (obi, selections = []) => ({
    $onChange: (callback) => {
        const {sub, notify} = Subie(),
            mainUnsub = obi.$onAnyChange((data, paths = []) =>
                arrayIncludesItemFromArray(selections, paths) && notify(data, paths)
            ), unsub = sub(callback);
        return () => {
            mainUnsub();
            unsub();
        }
    }
});