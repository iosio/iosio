export const obi = (suspect, _parent = suspect, _lastPath = '', [base_sub, base_notify] = Subie(), paths = []) => {
    if (suspect.$obi) return suspect;

    const [sub, notify] = Subie(),

        _obi = {
            $obi: true, $batch: {_: 0},
            $onChange: cb => sub(cb),
            $onAnyChange: cb => base_sub(cb),
            $getState: () => Object.keys(suspect).reduce((acc, curr) =>
                !isFunc(suspect[curr]) ? (acc[curr] = (isObj(suspect[curr]) && suspect[curr].$obi)
                    ? suspect[curr].$getState() : suspect[curr], acc) : acc, {}),
            $merge: (update, ignoreUpdate) => {
                _parent.$batch._ = true;
                isFunc(update) ? update(suspect) : Object.keys(update).map(k => suspect[k] = update[k]);
                _parent.$batch._ = false;
                if (!ignoreUpdate) notify(suspect, paths), base_notify(_parent, paths);
                paths = [];
            },
            $select: (selections = []) => ({
                ...suspect,
                $onChange: (callback, [sub, notify] = Subie(), mainUnsub, unsub) => (
                    mainUnsub = _parent.$onAnyChange((data, paths = []) =>
                        selections.some(val => paths.includes(val)) && notify(data, paths)
                    ), unsub = sub(callback), () => (mainUnsub(), unsub())
                )
            })
        };

    for (let key in suspect) {
        let internal = suspect[key], path = _lastPath + (_lastPath ? '.' : '') + key;
        if (isObj(internal)) obi(suspect[key], _parent, path, [base_sub, base_notify], paths);
        def(suspect, key, {
            enumerable: true, get: () => internal, set(value) {
                if (value !== internal) isObj(value) && isObj(internal)
                && suspect[key].$merge ? suspect[key].$merge(value) : (
                    (internal = value), paths.push(path),
                    !_parent.$batch._ && (
                        base_notify(_parent, [path]),
                            notify(suspect, [path]),
                            (paths = [])
                    )
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
export {obi as obi2};