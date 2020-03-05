let define = (name, Class) => customElements.define(name, Class);
define('x-fragment', class extends HTMLElement {
});

define('x-host', class extends HTMLElement {
    disconnectedCallback() {
        if (this.isConnected) return;
        typeof this._dc === 'function' && this._dc();
    }
    connectedCallback() {
        if (!this.mounted) {
            this.mounted = true;
            this._dc = typeof this._c === 'function' && this._c();
        }
    }
    set lifeCycle(fn) {
        this._c = fn;
    }
});

let eventProxy = function (e) {
        return this.__ev[e.type](e);
    },

    IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|^--/i,

    setStyleProp = (style, key, value) => key[0] === '-' ? style.setProperty(key, value)
        : (style[key] = typeof value === 'number'
        && IS_NON_DIMENSIONAL.test(key) === false ? value + 'px' : value == null ? '' : value),

    setStyle = (dom, value, oldValue, _style = dom.style) => {
        if (typeof value === 'string') return _style.cssText = value;
        typeof oldValue === 'string' && (_style.cssText = '', oldValue = null);
        if (oldValue) for (let i in oldValue) if (!(value && i in value)) setStyleProp(_style, i, '');
        if (value) for (let i in value) if (!oldValue || value[i] !== oldValue[i]) setStyleProp(_style, i, value[i]);
    },
    //preact-ish set property. not supporting SVG
    setProperty = (dom, name, value, oldValue, _style, _useCapture, _nameLower, _newHTML, _skip) =>
        ((name === 'style' ? setStyle(dom, value, oldValue)
            : name[0] === 'o' && name[1] === 'n'
                ? (_useCapture = name !== (name = name.replace(/Capture$/, '')),
                    _nameLower = name.toLowerCase(),
                    name = (_nameLower in dom ? _nameLower : name).slice(2),
                    value ? (!oldValue && dom.addEventListener(name, eventProxy, _useCapture),
                            (dom.__ev || (dom.__ev = {}))[name] = value
                    ) : dom.removeEventListener(name, eventProxy, _useCapture))
                : (name === 'dangerouslySetInnerHTML' && (value || oldValue))
                    ? ((!value || !oldValue || value.__html != oldValue.__html)
                    && (dom.innerHTML = (value && value.__html) || ''), _skip = true) //skip diff children
                    : (!(['list', 'tagName', 'form', 'type', 'size'].includes(name)) && name in dom)
                        ? dom[name] = value === null ? '' : value
                        : name === 'ref' && typeof value === 'function'
                            ? value(dom) : typeof value !== 'function' && (
                            (value === null || (value === false && !/^ar/.test(name)))
                                ? dom.removeAttribute(name)
                                : dom.setAttribute(name, value)
                        )), _skip),

    diffProps = (dom, newProps, oldProps = {}, _newHTML, i) => {
        for (i in oldProps) if (!(i in newProps)) (_newHTML = setProperty(dom, i, null, oldProps[i]))
        for (i in newProps) if (i !== 'value' && i !== 'checked' && oldProps[i] !== newProps[i]) {
            (_newHTML = setProperty(dom, i, newProps[i], oldProps[i]))
        }
        return _newHTML
    },
    customComponent = (name) => ({style, children, ...props}) =>
        h(name, {style: {display: 'contents', ...style}, ...props}, children),

    Host = customComponent('x-host'), // for subscriptions

    Fragment = customComponent('x-fragment'), // Fragment = props => props.children, // - this doesnt work yet, using custom element with display:contents

    h = (t, p, ...c) => ({t, p, c: c.filter(_ => ![false, true, null, undefined].includes(_)), key: p && p.key}),

    assign = (obj, props) => {
        for (let i in props) obj[i] = props[i];
        return (obj);
    },

    walkRemove = (v) => v.d ? v.d.remove() : v.patched && walkRemove(v.patched),

    render = (vnode, dom, old = dom.v || (dom.v = {}), position, nope, _skip, c) =>

        dom.v = vnode.pop ? vnode.map((vChild, index) => render(vChild, dom, old.c && old.c[index]))

            : vnode.t.call ? (
                    vnode.patched = render(
                        vnode.t(
                            //props
                            {
                                children: vnode.c,
                                ...vnode.p
                            },
                            // state
                            vnode.s = old.s || {},
                            // update
                            newState => {
                                assign(vnode.s, newState);
                                render(vnode, dom, vnode)
                            },
                        ),

                        old.patched || dom,
                        old && old.patched || {}
                    ), vnode)

                : (vnode.d = old.d || (vnode.t ? document.createElement(vnode.t) : new Text(vnode.p)),

                    vnode.p != old.p && (
                        vnode.t
                            //skip diffing children if inserting html (maybe skipping isn't necessary?)
                            ? (_skip = diffProps(vnode.d, vnode.p, old.p))
                            : vnode.d.data = vnode.p
                    ),
                        // insert at position
                    old.d && position == nope || dom.insertBefore(vnode.d, dom.childNodes[position + 1]),
                        // _skip && console.log('skiping diff'),
                        // diff children (typed/keyed)
                    !_skip && (vnode.o = [].concat(...vnode.c).map((vChild, pos) =>
                            render(
                                //vdom
                                vChild = vChild.c ? vChild : h('', vChild),
                                //dom
                                vnode.d,
                                //old dom
                                old.o && old.o.find((vnode, childPos) =>

                                vnode && vnode.t == vChild.t && vnode.key == vChild.key
                                && (
                                    childPos == pos && (pos = nope),
                                        old.o[childPos] = 0,
                                        vnode
                                )) || {},
                                //position
                                pos
                            )
                        )
                    ),
                        // remove stragglers
                    old.o && old.o.map(e => e && walkRemove(e)),
                        assign(old, vnode)//return the vnode
                );

export {h, render, Fragment, Host}