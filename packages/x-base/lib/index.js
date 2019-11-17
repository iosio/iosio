import {
    isObj as t,
    isArray as e,
    isFunc as s,
    def as i,
    extend as r,
    raf as n,
    objectIsEmpty as o,
    CSSTextToObj as h
} from "@iosio/util";

const l = document, a = "adoptedStyleSheets" in document, d = t => {
        let e = l.createElement("style");
        return e.appendChild(l.createTextNode("")), (t || l.head).appendChild(e), t => (e.appendChild(l.createTextNode(t)), e)
    }, u = {}, c = (t, e) => {
        let s = !1;
        return a && (s = new CSSStyleSheet)[e ? "replace" : "replaceSync"](t), [s, t]
    }, p = (t, e) => {
        e = e || String;
        try {
            if (e == Boolean ? t = [!0, 1, "", "1", "true"].includes(t) : "string" == typeof t && (t = e == Number ? Number(t) : e == Object || e == Array ? JSON.parse(t) : t), {}.toString.call(t) == `[object ${e.name}]`) return {
                value: t,
                error: e == Number && Number.isNaN(t)
            }
        } catch (t) {
        }
        return {value: t, error: !0}
    },
    b = (t, e) => !(!t.getAttribute || !t.localName) && (e = t.getAttribute("is"), t.localName.includes("-") || e && e.includes("-")),
    y = (s, i, r) => {
        null === r || !1 === r ? s.removeAttribute(i) : s.setAttribute(i, b(s) && (t(r) || e(r)) ? JSON.stringify(r) : r)
    }, m = t => t.replace(/([A-Z])/g, "-$1").toLowerCase(), S = t => t.replace(/-(\w)/g, (t, e) => e.toUpperCase()),
    g = !1, f = ({h: t, render: l, setProperty: c}) => {
        console.log("creating x-base");
        let b = "props", g = Symbol(), f = ":host, *, *::before, *::after {box-sizing: border-box;} ", w = {};
        const v = t => {
            for (; t.parentNode && (t = t.parentNode);) if (t instanceof ShadowRoot) return t;
            return document
        }, x = d();

        class C extends HTMLElement {
            constructor() {
                super(), this.context = w, this.unsubs = [], this.state = {}, this.observe = null;
                let {initAttrs: i, shadow: d, rootSheet: p, noRerender: y, tag: m} = this.constructor,
                    S = d ? this.attachShadow({mode: !0 === d ? "open" : d}) : this;
                this[b] = {}, this.render = this.render.bind(this), this.mounted = new Promise(t => this._mount = t);
                const g = (t, s) => {
                    let i = d ? S : v(this), r = "", n = a && !s ? t => {
                        let s = e(t) ? t[0] : t;
                        s && ![].concat(i.adoptedStyleSheets).includes(s) && (i.adoptedStyleSheets = [...i.adoptedStyleSheets, s])
                    } : t => {
                        e(t) && t[1] && (r += t[1])
                    };
                    return [].concat(t).forEach(n), r
                };
                let C = "", N = 0, R = !1;
                const E = ({css: e, noResets: s, globalFallback: i, useStyleTag: r, styleSheets: n, children: o}) => {
                    if (N > 0) return null;
                    if (N++, !1 !== R) return R;
                    let h = e || o || "";
                    return !s && d && (h = f + h), a && !r ? (g(p), 0 === p.cssRules.length && p.replaceSync(h), n && g(n), R = null) : (C = h + g(p, !0) + (n ? g(n, !0) : ""), i && !u[m] ? (u[m] = !0, x(C), R = null) : R = t("style", {}, C)), R
                };
                let A;
                const M = ({children: t, ...e}) => {
                    if (!this.hasMounted && o(e)) return A = !0, t;
                    if (A && o(e)) return t;
                    A = !1;
                    let s, i = {}, r = this.attributes;
                    for (s = r.length; s--;) i[r[s].name] = r[s].value;
                    for (let t in e) c(this, t, e[t], i[t], !1);
                    return t
                };
                this.setState = t => (this.state = {...this.state, ...s(t) ? t(this.state) : t || {}}, this.update()), this.observeObi = t => [].concat(t).forEach(t => t.$onChange && this.unsubs.push(t.$onChange(this.update)));
                const U = () => (this._observesStyle && (this[b].style = h(this.style.cssText)), [r({
                    Host: M,
                    CSS: E,
                    host: this
                }, this[b]), this.state, this.context]), T = () => {
                    let t = U();
                    this.willMount(...t), this.willRender(...t), l(this.render(...t), S), N = 0, n(() => {
                        this.unsubs.push(this.lifeCycle(...t)), this.didRender(...t), this.didMount(...t), this.hasMounted = !0
                    })
                }, O = () => {
                    let t = U(), e = this.willRender(...t);
                    this.willUpdate(...t), this.shouldUpdate && (e = this.shouldUpdate(...t)), y || !e && void 0 !== e || (l(this.render(...t), S), N = 0, this.didUpdate(...t), this.didRender(...t))
                };
                this.update = () => (this.processing || (this.processing = this.mounted.then(t => {
                    this.hasMounted ? O() : T(), this.processing = !1
                })), this.processing), this.emit = (t, e, s, i) => (s || this).dispatchEvent(new CustomEvent(t, {
                    detail: e,
                    bubbles: !0,
                    composed: !0, ...i
                })), this.destroy = () => {
                    this.willUnmount(), l(null, S), this.unsubs.forEach(t => s(t) && t())
                };
                let $ = i.length;
                for (; $--;) i[$](this);
                this.update()
            }

            connectedCallback() {
                this.hasMounted || (this.observe && this.observeObi(this.observe), this._mount())
            }

            disconnectedCallback() {
                this.isConnected || this.destroy()
            }

            attributeChangedCallback(t, e, s) {
                this[g] !== t && e !== s && ("style" === t && this._observesStyle ? this.update() : this[S(t)] = s)
            }

            static get observedAttributes() {
                let {propTypes: t, prototype: e} = this;
                if (this.initAttrs = [], !t) return [];
                let s = Object.keys(t).map(s => {
                    let r = m(s), n = t[s].name ? {type: t[s]} : t[s];
                    return s in e || i(e, s, {
                        get() {
                            return this[b][s]
                        }, set(t) {
                            let {value: e, error: i} = p(t, n.type);
                            i && null != e && console.error(`[${s}] must be type [${n.type.name}]`), e !== this[b][s] && (n.reflect && this.mounted.then(() => {
                                this[g] = r, y(this, r, n.type !== Boolean || e ? e : null), this[g] = !1
                            }), this[b][s] = e, this.update())
                        }
                    }), n.value && this.initAttrs.push(t => t[s] = n.value), r
                });
                return this.prototype._observesStyle = s.includes("style"), s
            }

            willMount() {
            }

            willRender() {
            }

            render() {
            }

            didRender() {
            }

            willUpdate() {
            }

            didUpdate() {
            }

            didMount() {
            }

            lifeCycle() {
            }

            willUnmount() {
            }
        }

        const N = (e, s, i = {}) => {
            var r, n;
            let o, h = s.prototype instanceof C;
            return a && (o = new CSSStyleSheet), h && (s.rootSheet = o, s.tag = e), customElements.define(e, h ? s : (n = r = class extends C {
                constructor(...t) {
                    super(...t), this.render = s
                }
            }, r.rootSheet = o, r.tag = e, r.propTypes = i.propTypes, r.shadow = i.shadow, r.noRerender = i.noRerender, n)), s => t(e, s)
        };
        let R, E, A = () => {
        };
        return customElements.get("x-x") || customElements.get("x-shadow") || (R = N("x-x", A), E = N("x-shadow", A, {shadow: !0})), {
            x: N,
            X: R,
            XShadow: E,
            Element: C,
            provide: (t, e) => w[t] = e
        }
    };
export {
    a as CONSTRUCTABLE_STYLE_SHEETS_AVAILABLE,
    g as TEST_ENV,
    S as attrToProp,
    f as createBase,
    c as createStyleSheet,
    l as d,
    p as formatType,
    u as globalStyleTagCache,
    d as headStyleTag,
    b as isCustomElement,
    m as propToAttr,
    y as updateAttribute
};
