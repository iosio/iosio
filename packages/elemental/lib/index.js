import {isObj as e, isArray as t, eventListener as s, def as o} from "@iosio/util";

export {eventListener} from "@iosio/util";
const i = "adoptedStyleSheets" in document, r = (e, t) => {
        let s = document.createElement("style");
        return e && (s.id = e), s.appendChild(document.createTextNode("")), (t || document.head).appendChild(s), e => (s.appendChild(document.createTextNode(e)), s)
    }, n = e => {
        for (; e.parentNode && (e = e.parentNode);) if (e instanceof ShadowRoot) return e;
        return document
    }, h = {}, a = {}, p = ":host, *, *::before, *::after {box-sizing: border-box;} ", d = e => {
        let t = document.createElement("style");
        return t.appendChild(document.createTextNode(e)), {element: t, update: e => t.textContent = e}
    }, l = (e, t, s, o, r) => {
        if (s = (t.shadowRoot ? ":host, *, *::before, *::after {box-sizing: border-box;} " : "") + s, i && !r) {
            let i = t.shadowRoot || n(t), r = h[e];
            r || (r = new CSSStyleSheet, r[o ? "replace" : "replaceSync"](s), h[e] = r), [].concat(i.adoptedStyleSheets).includes(r) || (i.adoptedStyleSheets = [...i.adoptedStyleSheets, r])
        } else {
            let o = a[e];
            o || (o = d(s).element, a[e] = o), (t.shadowRoot || t).appendChild(o.cloneNode(!0))
        }
    }, c = (e, t) => (e.shadowRoot || e).querySelector(t),
    u = (e, t, s) => t.reduce((t, o) => (t[o] = c(e, (s || "") + o), t), {}), m = (e, t) => u(e, t, "#"), b = {},
    f = (e, t, s) => {
        if (!e || !t || !s) return;
        let o = t.shadowRoot || t, i = b[e];
        i || (i = document.createElement("template"), i.innerHTML = s, b[e] = i), o.appendChild(i.content.cloneNode(!0))
    }, g = (e, t) => {
        let s = document.createElement("template");
        s.innerHTML = t, e.innerHTML = "", e.appendChild(s.content.cloneNode(!0))
    }, y = () => {
        const e = {};
        return (t, s) => {
            if (!e[t]) {
                const o = document.createElement("template");
                o.innerHTML = s, e[t] = o
            }
            return e[t].content.cloneNode(!0)
        }
    },
    S = (e, t) => !(!e.getAttribute || !e.localName) && (t = e.getAttribute("is"), e.localName.includes("-") || t && t.includes("-")),
    C = (s, o, i) => {
        null === i || !1 === i || "null" === i || "false" === i ? s.removeAttribute(o) : s.setAttribute(o, S(s) && (e(i) || t(i)) ? JSON.stringify(i) : i)
    }, N = e => e.replace(/([A-Z])/g, "-$1").toLowerCase(), w = e => e.replace(/-(\w)/g, (e, t) => t.toUpperCase()),
    v = (e, t) => ((t = t || String) == Boolean ? e = [!0, 1, "", "1", "true"].includes(e) : "string" == typeof e && (e = t == Number ? Number(e) : t == Object || t == Array ? JSON.parse(e) : e), {}.toString.call(e) == `[object ${t.name}]` ? {
        value: e,
        error: t == Number && Number.isNaN(e)
    } : {value: e, error: !0}), E = Symbol();

class P extends HTMLElement {
    constructor() {
        super();
        const {initAttrs: e} = this.constructor, {shadow: t, tag: o, styles: i, template: r} = this.constructor;
        this.prevProps = {}, this.props = {}, this.changedProps = [], this.unsubs = [], this.refs = {}, t && this.attachShadow({mode: "open"});
        const n = this.shadowRoot || this;
        let h;
        this.mounted = new Promise(e => this._mount = e), this.updateStyles = () => {
            if (this.updatableStyles) {
                let e = this.updatableStyles(this.props, this.prevProps);
                if (!e) return;
                h ? h.update(e) : (h = d(e), n.appendChild(h.element))
            }
        };
        let a = {};
        this.refs = new Proxy({}, {get: (e, t) => "refreshRefsCache" === t ? () => a = {} : (a[t] || (a[t] = n.querySelector("#" + t)), a[t])});
        const p = () => {
            i && l(o, this, i), r && f(o, this, r)
        };
        t && p();
        const c = () => {
            if (!t && p(), this.didMount && this.didMount(this.props, this.prevProps, this.changedProps), this.hasMounted = !0, this.propLogic) {
                const e = this.propLogic(!0);
                Object.keys(this.props).forEach(t => {
                    e[t] && e[t](this.props[t], this.refs)
                })
            }
        }, u = () => {
            if (this.didUpdate && this.didUpdate(this.props, this.prevProps, this.changedProps), this.propLogic) {
                const e = this.propLogic();
                this.changedProps.forEach(t => e[t] && e[t](this.props[t], this.refs))
            }
        };
        this.update = () => (this.processing || (this.processing = this.mounted.then(e => {
            this.hasMounted ? u() : c(), this.changedProps = [], this.processing = !1
        })), this.processing);
        let m = e.length;
        for (; m--;) e[m](this);
        this.update(), this.eventListener = (e, t, o, i) => {
            this.unsubs.push(s(e, t, o, i))
        }, this.emit = (e, t, s = {}, o = this) => o.dispatchEvent(new CustomEvent(e, {
            detail: t,
            bubbles: !0,
            composed: !0, ...s
        })), this.unsubSubs = () => {
            this.unsubs.forEach(e => e && e())
        }
    }

    connectedCallback() {
        this.hasMounted || this._mount()
    }

    attributeChangedCallback(e, t, s) {
        this[E] !== e && t !== s && (this[w(e)] = s)
    }

    disconnectedCallback() {
        this.isConnected || (this.willUnmount(), this.unsubSubs())
    }

    static get observedAttributes() {
        let {prototype: e, propTypes: t} = this;
        return this.initAttrs = [], t ? Object.keys(t).map(s => {
            let i = N(s), r = t[s].name ? {type: t[s]} : t[s];
            return s in e || o(e, s, {
                get() {
                    return this.props[s]
                }, set(e) {
                    let {value: t, error: o} = v(e, r.type);
                    o && null != t && console.error(`[${s}] must be type [${r.type.name}]`), t !== this.props[s] && (this.changedProps.push(s), r.reflect && this.mounted.then(() => {
                        this[E] = i, C(this, i, r.type !== Boolean || t ? t : null), this[E] = !1
                    }), this.prevProps[s] = this.props[s], this.props[s] = t, this.update())
                }
            }), r.value && this.initAttrs.push(e => e[s] = r.value), i
        }) : []
    }

    didMount() {
    }

    didUpdate() {
    }

    willUnmount() {
    }
}

P.define = (...e) => {
    e.forEach(e => {
        if (!e.tag) return console.error('The Elemental base class requires a tag name on the static "tag" property', e);
        customElements.define(e.tag, e)
    })
};
export {
    i as CONSTRUCTABLE_STYLE_SHEETS_AVAILABLE,
    p as DEFAULT_SHADOWROOT_HOST_CSS_RESETS,
    P as Elemental,
    y as TemplateMapFactory,
    l as adoptStyles,
    f as appendTemplate,
    w as attrToProp,
    u as createRefs,
    m as createRefsFromIDs,
    d as createStyleTag,
    v as formatType,
    n as getShadowParent,
    r as headStyleTag,
    S as isCustomElement,
    N as propToAttr,
    c as select,
    g as templateToHost,
    C as updateAttribute
};
//# sourceMappingURL=index.js.map
