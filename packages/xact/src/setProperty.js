import {isFunc, isNum, isString} from "@iosio/util";
const IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|^--/i;

const eventProxy = function (e) {
    return this._listeners[e.type](e);
};

const setStyle = (style, key, value) => {
    if (key[0] === '-') style.setProperty(key, value);
    else style[key] = isNum(value)
    && IS_NON_DIMENSIONAL.test(key) === false ? value + 'px' : value == null ? '' : value;
};

export const setProperty = (dom, name, value, oldValue, isSvg) => {
    name = isSvg ? name === 'className' ? 'class' : name : name === 'class' ? 'className' : name;
    if (name === 'key' || name === 'children') {
    } else if (name === 'style') {
        const s = dom.style;
        if (isString(value)) s.cssText = value;
        else {
            if (isString(oldValue)) (s.cssText = '', oldValue = null);
            if (oldValue) for (let i in oldValue) if (!(value && i in value)) setStyle(s, i, '');
            if (value) for (let i in value) if (!oldValue || value[i] !== oldValue[i]) setStyle(s, i, value[i]);
        }
    } else if (name[0] === 'o' && name[1] === 'n') {
        let useCapture = name !== (name = name.replace(/Capture$/, ''));
        let nameLower = name.toLowerCase();
        name = (nameLower in dom ? nameLower : name).slice(2);
        if (value) {
            if (!oldValue) dom.addEventListener(name, eventProxy, useCapture);
            (dom._listeners || (dom._listeners = {}))[name] = value;
        } else dom.removeEventListener(name, eventProxy, useCapture);
    } else if (name !== 'list' && name !== 'tagName'
        && name !== 'form' && !isSvg && name in dom) {
        dom[name] = value == null ? '' : value;
    } else if (!isFunc(value) && name !== 'dangerouslySetInnerHTML') {
        if (name !== (name = name.replace(/^xlink:?/, ''))) {
            if (value == null || value === false) dom.removeAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase());
            else dom.setAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase(), value);
        } else if (value == null || value === false) dom.removeAttribute(name);
        else dom.setAttribute(name, value);
    }
};