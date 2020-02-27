const RECYCLED_NODE = 1,
    TEXT_NODE = 3,
    EMPTY_OBJ = {},
    EMPTY_ARR = [],
    map = EMPTY_ARR.map,
    IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|^--/i,
    isArray = Array.isArray,
    d = document,

    eventProxy = function (e) {
        return this.__ev[e.type](e);
    },

    setStyle = (style, key, value) => {
        if (key[0] === '-') style.setProperty(key, value);
        else style[key] = typeof value === 'number'
        && IS_NON_DIMENSIONAL.test(key) === false ? value + 'px' : value == null ? '' : value;
    },
    // preact based setProperty
    setProperty = (dom, name, value, oldValue, isSvg, _style, _newHTML) => {
        if (isSvg) {
            if (name === 'className') name = 'class';
        } else if (name === 'class') name = 'className';
        if (name === 'key' || name === 'children') {
        } else if (name === 'style') {
            _style = dom.style;
            if (typeof value === 'string') _style.cssText = value;
            else {
                if (typeof oldValue === 'string') (_style.cssText = '', oldValue = null);
                if (oldValue) for (let i in oldValue) if (!(value && i in value)) setStyle(_style, i, '');
                if (value) for (let i in value) if (!oldValue || value[i] !== oldValue[i]) setStyle(_style, i, value[i]);
            }
        } else if (name[0] === 'o' && name[1] === 'n') {
            let useCapture = name !== (name = name.replace(/Capture$/, '')),
                nameLower = name.toLowerCase();
            name = (nameLower in dom ? nameLower : name).slice(2);
            if (value) {
                if (!oldValue) dom.addEventListener(name, eventProxy, useCapture);
                (dom.__ev || (dom.__ev = {}))[name] = value;
            } else dom.removeEventListener(name, eventProxy, useCapture);
        } else if (name === 'dangerouslySetInnerHTML') {
            if (value || oldValue) {
                if (!value || !oldValue || value.__html != oldValue.__html) {
                    dom.innerHTML = (value && value.__html) || '';
                }
                value && console.log('setting dangerouslySetInnerHTML');
                if (value) return true
            }
        } else if (!(['list', 'tagName', 'form', 'type', 'size'].includes(name)) && !isSvg && name in dom) {
            dom[name] = value == null ? '' : value;
        } else if (typeof value !== 'function') {
            if (name !== (name = name.replace(/^xlink:?/, ''))) {
                if (value == null || value === false) {
                    dom.removeAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase());
                } else dom.setAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase(), value);
            } else if (value == null || (value === false && !/^ar/.test(name))) dom.removeAttribute(name);
            else dom.setAttribute(name, value);
        }
    },

    diffProps = (dom, newProps, oldProps, isSvg, _newHTML) => {
        let i;
        for (i in oldProps) if (!(i in newProps)) {
            if (setProperty(dom, i, null, oldProps[i], isSvg)) _newHTML = true;
        }
        for (i in newProps) if (i !== 'value' && i !== 'checked' && oldProps[i] !== newProps[i]) {
            if (setProperty(dom, i, newProps[i], oldProps[i], isSvg)) _newHTML = true;
        }
        return _newHTML
    },

    getKey = (vnode) => vnode == null ? null : vnode.key,

    patchNode = (parent, node, oldVNode, newVNode, isSvg) => {
        if (oldVNode === newVNode) {
        } else if (
            oldVNode != null &&
            oldVNode.type === TEXT_NODE &&
            newVNode.type === TEXT_NODE
        ) {
            if (oldVNode.name !== newVNode.name) node.nodeValue = newVNode.name
        } else if (oldVNode == null || oldVNode.name !== newVNode.name) {
            node = parent.insertBefore(createNode(newVNode, isSvg), node)
            if (oldVNode != null) {
                parent.removeChild(oldVNode.node)
            }
        } else {
            let tmpVKid, oldVKid,
                oldKey, newKey,
                oldVProps = oldVNode.props,
                newVProps = newVNode.props,
                oldVKids = oldVNode.children,
                newVKids = newVNode.children,
                oldHead = 0,
                newHead = 0,
                oldTail = oldVKids.length - 1,
                newTail = newVKids.length - 1;

            isSvg = isSvg || newVNode.name === "svg"

            if (diffProps(node, newVProps, oldVProps, isSvg)) {
                return (newVNode.node = node);
            }

            while (newHead <= newTail && oldHead <= oldTail) {
                if (
                    (oldKey = getKey(oldVKids[oldHead])) == null ||
                    oldKey !== getKey(newVKids[newHead])
                ) {
                    break
                }
                patchNode(
                    node,
                    oldVKids[oldHead].node,
                    oldVKids[oldHead++],
                    newVKids[newHead++],
                    isSvg
                )
            }

            while (newHead <= newTail && oldHead <= oldTail) {
                if (
                    (oldKey = getKey(oldVKids[oldTail])) == null ||
                    oldKey !== getKey(newVKids[newTail])
                ) {
                    break
                }

                patchNode(
                    node,
                    oldVKids[oldTail].node,
                    oldVKids[oldTail--],
                    newVKids[newTail--],
                    isSvg
                )
            }

            if (oldHead > oldTail) {
                while (newHead <= newTail) {
                    node.insertBefore(
                        createNode(newVKids[newHead++], isSvg),
                        (oldVKid = oldVKids[oldHead]) && oldVKid.node
                    )
                }
            } else if (newHead > newTail) {
                while (oldHead <= oldTail) {
                    node.removeChild(oldVKids[oldHead++].node)
                }
            } else {
                for (var i = oldHead, keyed = {}, newKeyed = {}; i <= oldTail; i++) {
                    if ((oldKey = oldVKids[i].key) != null) {
                        keyed[oldKey] = oldVKids[i]
                    }
                }

                while (newHead <= newTail) {
                    oldKey = getKey((oldVKid = oldVKids[oldHead]))
                    newKey = getKey(newVKids[newHead])

                    if (
                        newKeyed[oldKey] ||
                        (newKey != null && newKey === getKey(oldVKids[oldHead + 1]))
                    ) {
                        if (oldKey == null) {
                            node.removeChild(oldVKid.node)
                        }
                        oldHead++
                        continue
                    }

                    if (newKey == null || oldVNode.type === RECYCLED_NODE) {
                        if (oldKey == null) {
                            patchNode(
                                node,
                                oldVKid && oldVKid.node,
                                oldVKid,
                                newVKids[newHead],
                                isSvg
                            )
                            newHead++
                        }
                        oldHead++
                    } else {
                        if (oldKey === newKey) {
                            patchNode(node, oldVKid.node, oldVKid, newVKids[newHead], isSvg)
                            newKeyed[newKey] = true
                            oldHead++
                        } else {
                            if ((tmpVKid = keyed[newKey]) != null) {
                                patchNode(
                                    node,
                                    node.insertBefore(tmpVKid.node, oldVKid && oldVKid.node),
                                    tmpVKid,
                                    newVKids[newHead],
                                    isSvg
                                )
                                newKeyed[newKey] = true
                            } else {
                                patchNode(
                                    node,
                                    oldVKid && oldVKid.node,
                                    null,
                                    newVKids[newHead],
                                    isSvg
                                )
                            }
                        }
                        newHead++
                    }
                }

                while (oldHead <= oldTail) {
                    if (getKey((oldVKid = oldVKids[oldHead++])) == null) {
                        node.removeChild(oldVKid.node)
                    }
                }

                for (var i in keyed) {
                    if (newKeyed[i] == null) {
                        node.removeChild(keyed[i].node)
                    }
                }
            }
        }

        return (newVNode.node = node)
    },

    createNode = (vnode, isSvg) => {
        var node = vnode.type === TEXT_NODE
            ? d.createTextNode(vnode.name)
            : (isSvg = isSvg || vnode.name === "svg")
                ? d.createElementNS("http://www.w3.org/2000/svg", vnode.name)
                : d.createElement(vnode.name);
        diffProps(node, vnode.props, {}, isSvg);
        for (var i = 0, len = vnode.children.length; i < len; i++) {
            node.appendChild(createNode(vnode.children[i], isSvg))
        }
        return (vnode.node = node)
    },

    createVNode = (name, props, children, node, key, type) => ({
        name: name,
        props: props,
        children: children,
        node: node,
        type: type,
        key: key,
    }),

    createTextVNode = (value, node) => createVNode(value, EMPTY_OBJ, EMPTY_ARR, node, null, TEXT_NODE),

    recycleNode = (node, parent) => {
        return node.nodeType === TEXT_NODE
            ? createTextVNode(node.nodeValue, node)
            : createVNode(
                node.nodeName.toLowerCase(),
                EMPTY_OBJ,
                map.call(node.childNodes, recycleNode),
                node,
                null,
                RECYCLED_NODE
            )
    },
    Fragment = (props) => props.children,

    render = (node, vdom, options) => {
        let oldVDom = node.vdom || recycleNode(node);
        vdom = createVNode(
            oldVDom.name,
            EMPTY_OBJ,
            [].concat(vdom),
            oldVDom.node
        );
        return ((node = patchNode(
            node.parentNode,
            node,
            oldVDom,
            vdom
        )).vdom = vdom), node
    },

    mount = (node, vdom) => {
        if (!isArray(vdom)) vdom = [vdom];
        for (var i = vdom.length; i--;) node.insertBefore(createNode(vdom[i]), node.firstChild)
    },

    h = function (name, props) {
        for (var vnode, rest = [], children = [], i = arguments.length; i-- > 2;) rest.push(arguments[i]);
        if ((props = props == null ? {} : props).children != null) {
            if (rest.length <= 0) rest.push(props.children);
            delete props.children;
        }
        while (rest.length > 0) {
            if (isArray((vnode = rest.pop()))) {
                for (var i = vnode.length; i-- > 0;) rest.push(vnode[i])
            } else if (vnode === false || vnode === true || vnode == null) {
            } else children.push(typeof vnode === 'object' ? vnode : createTextVNode(vnode));
        }
        return typeof name === 'function'
            ? (props.children = props.children || children) && name(props)
            : createVNode(name, props, children, null, props.key)
    };
export {h, render, Fragment, createNode, mount};