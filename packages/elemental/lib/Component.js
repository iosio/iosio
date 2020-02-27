import {obi as e} from "@iosio/obi";
import {isObj as t, eventListener as n} from "@iosio/util";

const l = {}, o = [], r = o.map, s = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|^--/i,
    i = Array.isArray, a = document, d = function (e) {
        return this.__ev[e.type](e)
    }, u = (e, t, n) => {
        "-" === t[0] ? e.setProperty(t, n) : e[t] = "number" == typeof n && !1 === s.test(t) ? n + "px" : null == n ? "" : n
    }, h = (e, t, n, l, o, r, s) => {
        if (o ? "className" === t && (t = "class") : "class" === t && (t = "className"), "key" === t || "children" === t) ; else if ("style" === t) if (r = e.style, "string" == typeof n) r.cssText = n; else {
            if ("string" == typeof l && (r.cssText = "", l = null), l) for (let e in l) n && e in n || u(r, e, "");
            if (n) for (let e in n) l && n[e] === l[e] || u(r, e, n[e])
        } else if ("o" === t[0] && "n" === t[1]) {
            let o = t !== (t = t.replace(/Capture$/, "")), r = t.toLowerCase();
            t = (r in e ? r : t).slice(2), n ? (l || e.addEventListener(t, d, o), (e.__ev || (e.__ev = {}))[t] = n) : e.removeEventListener(t, d, o)
        } else if ("dangerouslySetInnerHTML" === t) {
            if ((n || l) && (n && l && n.__html == l.__html || (e.innerHTML = n && n.__html || ""), n && console.log("setting dangerouslySetInnerHTML"), n)) return !0
        } else !["list", "tagName", "form", "type", "size"].includes(t) && !o && t in e ? e[t] = null == n ? "" : n : "function" != typeof n && (t !== (t = t.replace(/^xlink:?/, "")) ? null == n || !1 === n ? e.removeAttributeNS("http://www.w3.org/1999/xlink", t.toLowerCase()) : e.setAttributeNS("http://www.w3.org/1999/xlink", t.toLowerCase(), n) : null == n || !1 === n && !/^ar/.test(t) ? e.removeAttribute(t) : e.setAttribute(t, n))
    }, c = (e, t, n, l, o) => {
        let r;
        for (r in n) r in t || h(e, r, null, n[r], l) && (o = !0);
        for (r in t) "value" !== r && "checked" !== r && n[r] !== t[r] && h(e, r, t[r], n[r], l) && (o = !0);
        return o
    }, p = e => null == e ? null : e.key, f = (e, t, n, l, o) => {
        if (n === l) ; else if (null != n && 3 === n.type && 3 === l.type) n.name !== l.name && (t.nodeValue = l.name); else if (null == n || n.name !== l.name) t = e.insertBefore(m(l, o), t), null != n && e.removeChild(n.node); else {
            let e, a, d, u, h = n.children, g = l.children, y = 0, S = 0, v = h.length - 1, w = g.length - 1;
            if (c(t, l.props, n.props, o = o || "svg" === l.name)) return l.node = t;
            for (; S <= w && y <= v && null != (d = p(h[y])) && d === p(g[S]);) f(t, h[y].node, h[y++], g[S++], o);
            for (; S <= w && y <= v && null != (d = p(h[v])) && d === p(g[w]);) f(t, h[v].node, h[v--], g[w--], o);
            if (y > v) for (; S <= w;) t.insertBefore(m(g[S++], o), (a = h[y]) && a.node); else if (S > w) for (; y <= v;) t.removeChild(h[y++].node); else {
                for (var r = y, s = {}, i = {}; r <= v; r++) null != (d = h[r].key) && (s[d] = h[r]);
                for (; S <= w;) d = p(a = h[y]), u = p(g[S]), i[d] || null != u && u === p(h[y + 1]) ? (null == d && t.removeChild(a.node), y++) : null == u || 1 === n.type ? (null == d && (f(t, a && a.node, a, g[S], o), S++), y++) : (d === u ? (f(t, a.node, a, g[S], o), i[u] = !0, y++) : null != (e = s[u]) ? (f(t, t.insertBefore(e.node, a && a.node), e, g[S], o), i[u] = !0) : f(t, a && a.node, null, g[S], o), S++);
                for (; y <= v;) null == p(a = h[y++]) && t.removeChild(a.node);
                for (var r in s) null == i[r] && t.removeChild(s[r].node)
            }
        }
        return l.node = t
    }, m = (e, t) => {
        var n = 3 === e.type ? a.createTextNode(e.name) : (t = t || "svg" === e.name) ? a.createElementNS("http://www.w3.org/2000/svg", e.name) : a.createElement(e.name);
        c(n, e.props, {}, t);
        for (var l = 0, o = e.children.length; l < o; l++) n.appendChild(m(e.children[l], t));
        return e.node = n
    }, g = (e, t, n, l, o, r) => ({name: e, props: t, children: n, node: l, type: r, key: o}),
    y = (e, t) => g(e, l, o, t, null, 3),
    S = (e, t) => 3 === e.nodeType ? y(e.nodeValue, e) : g(e.nodeName.toLowerCase(), l, r.call(e.childNodes, S), e, null, 1),
    v = "adoptedStyleSheets" in document, w = new Map, b = new Map;

class C extends Base {
    constructor() {
        super();
        const {styles: o} = this.constructor;
        var r, s, a;
        this.renderer = this.render ? (a = this.render, e => () => {
            let t = a(e.props, e.state, e);
            if (t) {
                if (e.fallbackCssString) {
                    let n = function (e, t) {
                        for (var n, l = [], o = [], r = arguments.length; r-- > 2;) l.push(arguments[r]);
                        for (null != (t = null == t ? {} : t).children && (l.length <= 0 && l.push(t.children), delete t.children); l.length > 0;) if (i(n = l.pop())) for (r = n.length; r-- > 0;) l.push(n[r]); else !1 === n || !0 === n || null == n || o.push("object" == typeof n ? n : y(n));
                        return "function" == typeof e ? (t.children = t.children || o) && e(t) : g(e, t, o, null, t.key)
                    }("style", {dangerouslySetInnerHTML: {__html: e.fallbackCssString || ""}});
                    t = Array.isArray(t) ? (t.unshift(n), t) : [n, t]
                }
                ((e, t, n) => {
                    let o = e.vdom || S(e);
                    t = g(o.name, l, [].concat(t), o.node), (e = f(e.parentNode, e, o, t)).vdom = t
                })(e.shadowRoot || e, t)
            }
        })(this) : NOOP, o && ((e, t = {}) => n => {
            let l = () => n.fallbackCssString = ((e, t, n = {}) => {
                const {async: l, getStringOnFallback: o, useStyleTag: r, noDefaultResets: s} = n;
                t = (e.shadowRoot && !s ? ":host, *, *::before, *::after {box-sizing: border-box;} " : "") + (t || n.cssString || "");
                const i = e.constructor.tag || e.constructor;
                if (v && !r) {
                    let n = e.shadowRoot || (e => {
                        for (; e.parentNode && (e = e.parentNode);) if (e instanceof ShadowRoot) return e;
                        return document
                    })(e), o = w.get(i);
                    o || (o = new CSSStyleSheet, o[l ? "replace" : "replaceSync"](t), w.set(i, o)), [].concat(n.adoptedStyleSheets).includes(o) || (n.adoptedStyleSheets = [...n.adoptedStyleSheets, o])
                } else {
                    if (o) return t;
                    let n = b.get(i);
                    n || (n = (e => {
                        let t = document.createElement("style");
                        return t.appendChild(document.createTextNode(e)), {element: t, update: e => t.textContent = e}
                    })(t).element, b.set(i, n)), (e.shadowRoot || e).appendChild(n.cloneNode(!0))
                }
            })(n, e, {getStringOnFallback: n.hasRenderer, ...t});
            n.shadowRoot ? l() : n.mounted.then(l)
        })(o)(this), (r = this.state, n => t(r) && n.unsubs.push((n.state = e(r)).$onChange(n.onStateChange)))(this), (s = this).eventListener = (e, t, l, o) => s.unsubs.push(n(e, t, l, o)), s.emit = (e, t, n = {}, l = s) => l.dispatchEvent(new CustomEvent(e, {
            detail: t,
            bubbles: !0,
            composed: !0, ...n
        }))
    }

    initialUpdate() {
        this.beforeInitialUpdate(...this.getArgs()), this.renderer(), this.unmount = this.didMount(...this.getArgs()) || NOOP(), this.logic[0] && this.logic[0]()
    }

    subsequentUpdate() {
        this.renderer(), this.didUpdate(...this.getArgs()), this.logic[1] && this.logic[1]()
    }

    beforeInitialUpdate() {
    }

    didMount() {
    }

    onStateChange() {
    }

    didUpdate() {
    }
}

export {C as Component};
//# sourceMappingURL=Component.js.map
