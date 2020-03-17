const e = (a, $ = a, c = "", [b, i] = r(), s = []) => {
        if (a.$obi) return a;
        const [g, h] = r(), l = {
            $obi: !0,
            $batch: {_: 0},
            $onChange: e => g(e),
            $onAnyChange: e => b(e),
            $getState: () => Object.keys(a).reduce((e, r) => n(a[r]) ? e : (e[r] = t(a[r]) && a[r].$obi ? a[r].$getState() : a[r], e), {}),
            $merge: (e, t) => {
                $.$batch._ = !0, n(e) ? e(a) : Object.keys(e).map(t => a[t] = e[t]), $.$batch._ = !1, t || (h(a, s), i($, s)), s = []
            },
            $select: (e = []) => ({
                ...a,
                $onChange: (t, [n, o] = r(), a, c) => (a = $.$onAnyChange((t, n = []) => e.some(e => n.includes(e)) && o(t, n)), c = n(t), () => (a(), c()))
            })
        };
        for (let n in a) {
            let r = a[n], g = c + (c ? "." : "") + n;
            t(r) && e(a[n], $, g, [b, i], s), o(a, n, {
                enumerable: !0, get: () => r, set(e) {
                    e !== r && (t(e) && t(r) && a[n].$merge ? a[n].$merge(e) : (r = e, s.push(g), !$.$batch._ && (i($, [g]), h(a, [g]), s = [])))
                }
            })
        }
        for (let e in l) o(a, e, {enumerable: !1, value: l[e]});
        return a
    }, t = e => "object" == typeof e && !Array.isArray(e), n = e => "function" == typeof e,
    r = (e = [], t = (t => e.splice(e.indexOf(t) >>> 0, 1))) => [n => (e.push(n), () => t(n)), (...t) => e.slice().map(e => e(...t)), t],
    o = (e, t, n) => Object.defineProperty(e, t, n);
export {e as obi};
//# sourceMappingURL=index.js.map
