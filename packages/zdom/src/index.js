/**/
/*

https://gist.github.com/developit/2038b141b31287faa663f410b6649a87


export const h=(t,p,...c)=>({t,p,c,k:p&&p.key})

export const render=(e,d,t=d.t||(d.t={}),p,r,c)=>
  // arrays
  e.pop?e.map((e,p)=>render(e,d,t.o&&t.o[p])):
  // components
  e.t.call?(e.i=render((render.c=e).t({children:e.c,...e.p},e.s=t.s||{},t=>
    render(Object.assign(e.s,t)&&e,d,e)),t.i||d,t&&t.i||{}),e):(
  // create notes
  e.d=t.d||(e.t?document.createElement(e.t):new Text(e.p)),
  // diff props
  e.p!=t.p&&(e.t?Object.keys(e.p||{}).map(d=>
    (c=e.p[d])!=(t.p&&t.p[d])&&(d in e.d?e.d[d]=c:e.d.setAttribute(d,c))):e.d.data=e.p),
  // insert at position
  t.d&&p==r||d.insertBefore(e.d,d.childNodes[p+1]),
  // diff children (typed/keyed)
  e.o=e.c.concat.apply([],e.c).map((d,p)=>render(d=d.c?d:h('',d),e.d,
    t.o&&t.o.find((e,c)=>e&&e.t==d.t&&e.k==d.k&&(c==p&&(p=r),t.o[c]=0,e))||{},p)),
  // remove stragglers
  t.o&&t.o.map(e=>e&&e.d.remove()),Object.assign(t,e)
)

 */


let isFunc = f => typeof f === 'function',


    eventProxy = function (e) {

        return this.__ev[e.type](e);
    },


    setStyleProp = (style, key, value) =>

        key[0] === '-'

            ? style.setProperty(key, value)

            : (
                style[key] = typeof value === 'number'

                && /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|^--/i.test(key) === false

                    ? value + 'px'
                    : value == null ? '' : value
            ),


    setStyle = (dom, value, oldValue, _style = dom.style) => {

        if (typeof value === 'string') return _style.cssText = value;

        typeof oldValue === 'string' && (_style.cssText = '', oldValue = null);

        if (oldValue) for (let i in oldValue) if (!(value && i in value)) setStyleProp(_style, i, '');

        if (value) for (let i in value) if (!oldValue || value[i] !== oldValue[i]) setStyleProp(_style, i, value[i]);

    },


    //preact-ish set property. not supporting SVG
    setProperty = (dom, name, value, oldValue, _style, _useCapture, _nameLower, _newHTML, _skip) =>
        ((
                // if style
                name === 'style' ? setStyle(dom, value, oldValue)

                    // if event
                    : name[0] === 'o' && name[1] === 'n' ? (

                        _useCapture = name !== (name = name.replace(/Capture$/, '')),

                            _nameLower = name.toLowerCase(),

                            name = (_nameLower in dom ? _nameLower : name).slice(2),

                            value ? (

                                !oldValue && dom.addEventListener(name, eventProxy, _useCapture),

                                    (dom.__ev || (dom.__ev = {}))[name] = value

                            ) : dom.removeEventListener(name, eventProxy, _useCapture)
                    )
                    // if html
                    : name === 'dangerouslySetInnerHTML' && (value || oldValue) ? (

                            (!value || !oldValue || value.__html != oldValue.__html)

                            && (dom.innerHTML = (value && value.__html) || ''),

                                _skip = true /*skip diff children*/
                        )

                        // if dom has property
                        : (!(['list', 'tagName', 'form', 'type', 'size'].includes(name)) && name in dom)
                            ? dom[name] = value === null ? '' : value

                            // if ref
                            : name === 'ref' && isFunc(value) ? value(dom)

                                // if not function update attribute
                                : !isFunc(value) && (

                                value === null || (value === false && !/^ar/.test(name))

                                    ? dom.removeAttribute(name) : dom.setAttribute(name, value)
                            )
            ), _skip
        ),


    diffProps = (dom, newProps, oldProps = {}, _newHTML) => {

        for (let name in oldProps) if (!(name in newProps)) {

            setProperty(dom, name, null, oldProps[name]) && (_newHTML = true)
        }

        for (let name in newProps) if (oldProps[name] !== newProps[name]) {

            setProperty(dom, name, newProps[name], oldProps[name]) && (_newHTML = true)
        }

        return _newHTML
    },


    h = (t, p, ...c) => ({t, p, c: c.filter(_ => ![false, true, null, undefined].includes(_)), key: p && p.key}),


    assign = (obj, props) => {
        for (let i in props) obj[i] = props[i];
        return (obj);
    },

    remove = (v) => v.d ? v.d.remove() : v.patched && remove(v.patched),


    render = (vnode, dom, old = dom.v || (dom.v = {}), position, _undefined, _skip) =>

        dom.v = vnode.pop ? vnode.map((vChild, index) => render(vChild, dom, old.c && old.c[index]))


            : vnode.t.call ? (

                    vnode.patched = render(
                        vnode.t(
                            //props
                            {children: vnode.c, ...vnode.p},
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
                    ), vnode
                )

                : (
                    //assign old dom to new dom
                    vnode.d = old.d || ( // but if falsy then create the node
                        vnode.t ? document.createElement(vnode.t) : new Text(vnode.p)
                    ),

                        // if new props then update them them
                    vnode.p != old.p && (

                        vnode.t
                            // if it has a type then diff them
                            // diffProps will return true if we inserted innerHTML and want to skip diffing children
                            ? (_skip = diffProps(vnode.d, vnode.p, old.p))

                            : vnode.d.data = vnode.p
                    ),
                        // insert at position
                    old.d && position == _undefined || dom.insertBefore(vnode.d, dom.childNodes[position + 1]),


                        // diff children (typed/keyed) // _skip && console.log('skiping diff'),
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
                                    childPos == pos && (pos = _undefined),
                                        old.o[childPos] = 0,
                                        vnode
                                )) || {},
                                //position
                                pos
                            )
                        )
                    ),
                        // remove stragglers
                    old.o && old.o.map(e => e && remove(e)), assign(old, vnode)//return the vnode
                ),


    // for subscriptions handling
    Host = ({children, ...props}) => h('z-host', props, children),


    // Fragment = props => props.children, // - this doesnt fully work yet,
    // using custom element with display:contents to keep familiar api until fragments work
    Fragment = ({children, ...props}) => h('z-fragment', props, children),


    define = (tag, elem) => customElements.define(tag, elem);


class Frag extends HTMLElement {
    constructor() {
        super(), this.attachShadow({mode: 'open'}).innerHTML = `<style>:host{display:contents}</style><slot></slot>`
    }
}


define('z-fragment', Frag);


define('z-host', class extends Frag {
    disconnectedCallback() {
        let {isConnected: c, s} = this;
        !c && s && s.map(u => isFunc(u) && u())
    }

    connectedCallback(f) {
        this.m || (this.m = 1, isFunc((f = this.f)) && (this.s = [].concat(f())))
    }

    set lifeCycle(fn) {
        this.f = fn
    }
});


export {h, render, Fragment, Host}