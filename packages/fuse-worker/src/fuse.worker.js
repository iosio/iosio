/*



------------------- START FUSE.JS SOURCE CODE  ---------------------------------

//@TODO: need to find rollup plugin that will correctly handle web worker files


 */
const t = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;
var e = (e, s, n = / +/g) => {
        let r = new RegExp(s.replace(t, "\\$&").replace(n, "|")), o = e.match(r), i = !!o, a = [];
        if (i) for (let t = 0, s = o.length; t < s; t += 1) {
            let s = o[t];
            a.push([e.indexOf(s), s.length - 1])
        }
        return {score: i ? .5 : 1, isMatch: i, matchedIndices: a}
    }, s = (t, {errors: e = 0, currentLocation: s = 0, expectedLocation: n = 0, distance: r = 100}) => {
        const o = e / t.length, i = Math.abs(n - s);
        return r ? o + i / r : i ? 1 : o
    }, n = (t = [], e = 1) => {
        let s = [], n = -1, r = -1, o = 0;
        for (let i = t.length; o < i; o += 1) {
            let i = t[o];
            i && -1 === n ? n = o : i || -1 === n || ((r = o - 1) - n + 1 >= e && s.push([n, r]), n = -1)
        }
        return t[o - 1] && o - n >= e && s.push([n, o - 1]), s
    },
    r = (t, e, r, {location: o = 0, distance: i = 100, threshold: a = .6, findAllMatches: h = !1, minMatchCharLength: l = 1}) => {
        const c = o, u = t.length;
        let p = a, d = t.indexOf(e, c);
        const g = e.length, f = [];
        for (let t = 0; t < u; t += 1) f[t] = 0;
        if (-1 !== d) {
            let n = s(e, {errors: 0, currentLocation: d, expectedLocation: c, distance: i});
            if (p = Math.min(n, p), -1 !== (d = t.lastIndexOf(e, c + g))) {
                let t = s(e, {errors: 0, currentLocation: d, expectedLocation: c, distance: i});
                p = Math.min(t, p)
            }
        }
        d = -1;
        let m = [], y = 1, S = g + u;
        const k = 1 << (g <= 31 ? g - 1 : 30);
        for (let n = 0; n < g; n += 1) {
            let o = 0, a = S;
            for (; o < a;) s(e, {
                errors: n,
                currentLocation: c + a,
                expectedLocation: c,
                distance: i
            }) <= p ? o = a : S = a, a = Math.floor((S - o) / 2 + o);
            S = a;
            let l = Math.max(1, c - a + 1), M = h ? u : Math.min(c + a, u) + g, x = Array(M + 2);
            x[M + 1] = (1 << n) - 1;
            for (let o = M; o >= l; o -= 1) {
                let a = o - 1, h = r[t.charAt(a)];
                if (h && (f[a] = 1), x[o] = (x[o + 1] << 1 | 1) & h, 0 !== n && (x[o] |= (m[o + 1] | m[o]) << 1 | 1 | m[o + 1]), x[o] & k && (y = s(e, {
                    errors: n,
                    currentLocation: a,
                    expectedLocation: c,
                    distance: i
                })) <= p) {
                    if (p = y, (d = a) <= c) break;
                    l = Math.max(1, 2 * c - d)
                }
            }
            if (s(e, {errors: n + 1, currentLocation: c, expectedLocation: c, distance: i}) > p) break;
            m = x
        }
        return {isMatch: d >= 0, score: 0 === y ? .001 : y, matchedIndices: n(f, l)}
    }, o = t => {
        let e = {}, s = t.length;
        for (let n = 0; n < s; n += 1) e[t.charAt(n)] = 0;
        for (let n = 0; n < s; n += 1) e[t.charAt(n)] |= 1 << s - n - 1;
        return e
    };

class i {
    constructor(t, {location: e = 0, distance: s = 100, threshold: n = .6, maxPatternLength: r = 32, isCaseSensitive: i = !1, tokenSeparator: a = / +/g, findAllMatches: h = !1, minMatchCharLength: l = 1}) {
        this.options = {
            location: e,
            distance: s,
            threshold: n,
            maxPatternLength: r,
            isCaseSensitive: i,
            tokenSeparator: a,
            findAllMatches: h,
            minMatchCharLength: l
        }, this.pattern = this.options.isCaseSensitive ? t : t.toLowerCase(), this.pattern.length <= r && (this.patternAlphabet = o(this.pattern))
    }

    search(t) {
        if (this.options.isCaseSensitive || (t = t.toLowerCase()), this.pattern === t) return {
            isMatch: !0,
            score: 0,
            matchedIndices: [[0, t.length - 1]]
        };
        const {maxPatternLength: s, tokenSeparator: n} = this.options;
        if (this.pattern.length > s) return e(t, this.pattern, n);
        const {location: o, distance: i, threshold: a, findAllMatches: h, minMatchCharLength: l} = this.options;
        return r(t, this.pattern, this.patternAlphabet, {
            location: o,
            distance: i,
            threshold: a,
            findAllMatches: h,
            minMatchCharLength: l
        })
    }
}

var a = t => Array.isArray ? Array.isArray(t) : "[object Array]" === Object.prototype.toString.call(t);
const h = (t, e, s) => {
    if (e) {
        const n = e.indexOf(".");
        let r = e, o = null;
        -1 !== n && (r = e.slice(0, n), o = e.slice(n + 1));
        const i = t[r];
        if (null != i) if (o || "string" != typeof i && "number" != typeof i) if (a(i)) for (let t = 0, e = i.length; t < e; t += 1) h(i[t], o, s); else o && h(i, o, s); else s.push(i.toString())
    } else s.push(t);
    return s
};
var l = (t, e) => h(t, e, []);

class c {
    constructor(t, {location: e = 0, distance: s = 100, threshold: n = .6, maxPatternLength: r = 32, caseSensitive: o = !1, tokenSeparator: i = / +/g, findAllMatches: a = !1, minMatchCharLength: h = 1, id: c = null, keys: u = [], shouldSort: p = !0, getFn: d = l, sortFn: g = ((t, e) => t.score - e.score), tokenize: f = !1, matchAllTokens: m = !1, includeMatches: y = !1, includeScore: S = !1, verbose: k = !1}) {
        this.options = {
            location: e,
            distance: s,
            threshold: n,
            maxPatternLength: r,
            isCaseSensitive: o,
            tokenSeparator: i,
            findAllMatches: a,
            minMatchCharLength: h,
            id: c,
            keys: u,
            includeMatches: y,
            includeScore: S,
            shouldSort: p,
            getFn: d,
            sortFn: g,
            verbose: k,
            tokenize: f,
            matchAllTokens: m
        }, this.setCollection(t)
    }

    setCollection(t) {
        return this.list = t, t
    }

    search(t, e = {limit: !1}) {
        this._log(`---------\nSearch pattern: "${t}"`);
        const {tokenSearchers: s, fullSearcher: n} = this._prepareSearchers(t);
        let {weights: r, results: o} = this._search(s, n);
        return this._computeScore(r, o), this.options.shouldSort && this._sort(o), e.limit && "number" == typeof e.limit && (o = o.slice(0, e.limit)), this._format(o)
    }

    _prepareSearchers(t = "") {
        const e = [];
        if (this.options.tokenize) {
            const s = t.split(this.options.tokenSeparator);
            for (let t = 0, n = s.length; t < n; t += 1) e.push(new i(s[t], this.options))
        }
        return {tokenSearchers: e, fullSearcher: new i(t, this.options)}
    }

    _search(t = [], e) {
        const s = this.list, n = {}, r = [];
        if ("string" == typeof s[0]) {
            for (let o = 0, i = s.length; o < i; o += 1) this._analyze({
                key: "",
                value: s[o],
                record: o,
                index: o
            }, {resultMap: n, results: r, tokenSearchers: t, fullSearcher: e});
            return {weights: null, results: r}
        }
        const o = {};
        for (let i = 0, a = s.length; i < a; i += 1) {
            let a = s[i];
            for (let s = 0, h = this.options.keys.length; s < h; s += 1) {
                let h = this.options.keys[s];
                if ("string" != typeof h) {
                    if (o[h.name] = {weight: 1 - h.weight || 1}, h.weight <= 0 || h.weight > 1) throw new Error("Key weight has to be > 0 and <= 1");
                    h = h.name
                } else o[h] = {weight: 1};
                this._analyze({key: h, value: this.options.getFn(a, h), record: a, index: i}, {
                    resultMap: n,
                    results: r,
                    tokenSearchers: t,
                    fullSearcher: e
                })
            }
        }
        return {weights: o, results: r}
    }

    _analyze({key: t, arrayIndex: e = -1, value: s, record: n, index: r}, {tokenSearchers: o = [], fullSearcher: i = [], resultMap: h = {}, results: l = []}) {
        if (null == s) return;
        let c = !1, u = -1, p = 0;
        if ("string" == typeof s) {
            this._log(`\nKey: ${"" === t ? "-" : t}`);
            let a = i.search(s);
            if (this._log(`Full text: "${s}", score: ${a.score}`), this.options.tokenize) {
                let t = s.split(this.options.tokenSeparator), e = [];
                for (let s = 0; s < o.length; s += 1) {
                    let n = o[s];
                    this._log(`\nPattern: "${n.pattern}"`);
                    let r = !1;
                    for (let s = 0; s < t.length; s += 1) {
                        let o = t[s], i = n.search(o), a = {};
                        i.isMatch ? (a[o] = i.score, c = !0, r = !0, e.push(i.score)) : (a[o] = 1, this.options.matchAllTokens || e.push(1)), this._log(`Token: "${o}", score: ${a[o]}`)
                    }
                    r && (p += 1)
                }
                u = e[0];
                let n = e.length;
                for (let t = 1; t < n; t += 1) u += e[t];
                u /= n, this._log("Token score average:", u)
            }
            let d = a.score;
            u > -1 && (d = (d + u) / 2), this._log("Score average:", d);
            let g = !this.options.tokenize || !this.options.matchAllTokens || p >= o.length;
            if (this._log(`\nCheck Matches: ${g}`), (c || a.isMatch) && g) {
                let o = h[r];
                o ? o.output.push({
                    key: t,
                    arrayIndex: e,
                    value: s,
                    score: d,
                    matchedIndices: a.matchedIndices
                }) : (h[r] = {
                    item: n,
                    output: [{key: t, arrayIndex: e, value: s, score: d, matchedIndices: a.matchedIndices}]
                }, l.push(h[r]))
            }
        } else if (a(s)) for (let e = 0, a = s.length; e < a; e += 1) this._analyze({
            key: t,
            arrayIndex: e,
            value: s[e],
            record: n,
            index: r
        }, {resultMap: h, results: l, tokenSearchers: o, fullSearcher: i})
    }

    _computeScore(t, e) {
        this._log("\n\nComputing score:\n");
        for (let s = 0, n = e.length; s < n; s += 1) {
            const n = e[s].output, r = n.length;
            let o = 1, i = 1;
            for (let e = 0; e < r; e += 1) {
                let s = t ? t[n[e].key].weight : 1, r = (1 === s ? n[e].score : n[e].score || .001) * s;
                1 !== s ? i = Math.min(i, r) : (n[e].nScore = r, o *= r)
            }
            e[s].score = 1 === i ? o : i, this._log(e[s])
        }
    }

    _sort(t) {
        this._log("\n\nSorting...."), t.sort(this.options.sortFn)
    }

    _format(t) {
        const e = [];
        if (this.options.verbose) {
            let e = [];
            this._log("\n\nOutput:\n\n", JSON.stringify(t, (function (t, s) {
                if ("object" == typeof s && null !== s) {
                    if (-1 !== e.indexOf(s)) return;
                    e.push(s)
                }
                return s
            }))), e = null
        }
        let s = [];
        this.options.includeMatches && s.push((t, e) => {
            const s = t.output;
            e.matches = [];
            for (let t = 0, n = s.length; t < n; t += 1) {
                let n = s[t];
                if (0 === n.matchedIndices.length) continue;
                let r = {indices: n.matchedIndices, value: n.value};
                n.key && (r.key = n.key), n.hasOwnProperty("arrayIndex") && n.arrayIndex > -1 && (r.arrayIndex = n.arrayIndex), e.matches.push(r)
            }
        }), this.options.includeScore && s.push((t, e) => {
            e.score = t.score
        });
        for (let n = 0, r = t.length; n < r; n += 1) {
            const r = t[n];
            if (this.options.id && (r.item = this.options.getFn(r.item, this.options.id)[0]), !s.length) {
                e.push(r.item);
                continue
            }
            const o = {item: r.item};
            for (let t = 0, e = s.length; t < e; t += 1) s[t](r, o);
            e.push(o)
        }
        return e
    }

    _log() {
        this.options.verbose && console.log(...arguments)
    }
}
/*

------------------- END FUSE.JS SOURCE CODE  ---------------------------------

*/

const Fuse = c;

let _options = {};

let originalList = [];

let fuse = null;

const setFuse = ({list, options}) => {
    if (options) _options = {..._options, ...options};
    if (list) originalList = list;
    fuse = new Fuse(originalList, _options);
};

onmessage = (e) => {
    const {type, data} = e.data;
    if (type === 'set') {
        setFuse(data);
    } else if (type === 'search' && fuse) {
        postMessage({
            type: 'search',
            data: {
                searchValue: data,
                results: fuse.search(data)
            }
        })
    } else if (!fuse) {
        console.error('fuse needs to be set');
    }
};


