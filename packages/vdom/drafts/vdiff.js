export const vdiff_h = (t, p, ...c) => ({t, p, c, k: p && p.key})

export const vdiff = (e, d, t = d.t || (d.t = {}), p, rrrr, c) =>
    // arrays
    e.pop ? e.map((e, p) => vdiff(e, d, t.o && t.o[p])) :
        // components
        e.t.call ? (
                e.i = vdiff(
                    (vdiff.c = e).t(
                        {children: e.c, ...e.p},
                        e.s = t.s || {},
                        t =>
                            vdiff(
                                Object.assign(e.s, t) && e,
                                d,
                                e
                            )
                    ),

                    t.i || d,

                    t && t.i || {}

                ),
                    e

            )

            : (
                // create notes
                e.d = t.d || (e.t ? document.createElement(e.t) : new Text(e.p)),
                    // diff props
                e.p != t.p && (e.t ? Object.keys(e.p || {}).map(d =>
                    (c = e.p[d]) != (t.p && t.p[d]) && (d in e.d ? e.d[d] = c : e.d.setAttribute(d, c))) : e.d.data = e.p),
                    // insert at position
                t.d && p == rrrr || d.insertBefore(e.d, d.childNodes[p + 1]),
                    // diff children (typed/keyed)
                    e.o = e.c.concat.apply([], e.c).map((d, p) => vdiff(d = d.c ? d : vdiff_h('', d), e.d,
                        t.o && t.o.find((e, c) =>
                        e && e.t == d.t && e.k == d.k && (c == p && (p = rrrr),
                            t.o[c] = 0, e)) || {}, p)),
                    // remove stragglers
                t.o && t.o.map(e => e && e.d.remove()), Object.assign(t, e)
            )


export const Fragment = (props) => props.children;

export const h = (type, props, ...children) => ({type, props, children, key: props && props.key});
// //
// //
export const patch = (vnode, dom, old = dom.t || (dom.t = {}), position, rrrr, c) =>
    // arrays
    vnode.pop ? vnode.map((vChild, index) =>
            patch(
                //vdom
                vChild,
                //dom
                dom,
                //old
                old.o && old.o[index]
            )
        )

        :
        // components
        vnode.type.call ? (

                vnode.patched = patch(
                    //render vdom
                    (patch.c = vnode).type(
                        //props
                        {children: vnode.children, ...vnode.props},
                        // state
                        vnode.state = old.state || {},
                        // update
                        newState => patch(
                            Object.assign(vnode.state, newState) && vnode,
                            dom,
                            vnode
                        )
                    ),
                    //render dom
                    old.patched || dom,
                    // old dom?
                    old && old.patched || {}
                ),
                    vnode
            )

            : (
                // create nodes
                vnode.dom = old.dom || (vnode.type ? document.createElement(vnode.type) : new Text(vnode.props)),
                    // diff props
                vnode.props != old.props && (
                    vnode.type
                        ? Object.keys(vnode.props || {})
                            .map(prop =>
                                (c = vnode.props[prop]) != (old.props && old.props[prop])
                                && (prop in vnode.dom ? vnode.dom[prop] = c : vnode.dom.setAttribute(prop, c)))

                        : vnode.dom.data = vnode.props
                ),
                    // insert at position
                old.dom && position == rrrr || dom.insertBefore(vnode.dom, dom.childNodes[position + 1]),

                    // diff children (typed/keyed)
                    vnode.o = vnode.children.concat.call([], ...vnode.children).map((vChild, pos) =>

                        patch(
                            //vdom
                            vChild = vChild.children ? vChild : h('', vChild),
                            //dom
                            vnode.dom,
                            //old dom
                            old.o && old.o.find((vnode, childPos) =>

                            vnode && vnode.type == vChild.type && vnode.key == vChild.key

                            && (
                                childPos == pos && (pos = rrrr),

                                    old.o[childPos] = 0,

                                    vnode
                            )
                            ) || {},

                            pos
                        )
                    ),
                    // remove stragglers
                old.o && old.o.map(e => (e && e.dom.remove())),

                    Object.assign(old, vnode)
            );



