import {eventListener} from "@iosio/util";
import {isString} from "@iosio/util";

export {eventListener}

export const createDom = ({type, tag, value, attrs = {}, props = {}, children = []}) => {
    let dom = type === 'fragment'
        ? document.createDocumentFragment()
        : (type === 'text' ? document.createTextNode(value) : document.createElement(tag));
    for (let a in attrs) dom.setAttribute(a, attrs[a]);
    for (let p in props) {
        if (p === 'ref') props[p](dom);
        else if (p === 'style' && isString(p)) dom.style.cssText = props[p];
        else dom[p] = props[p];
    }
    children.forEach(child => dom.appendChild(createDom(child)));
    return dom;
};

/*------------------ STYLES -------------------------- */

/**
 * creates a single style sheet. returns a function to update the same sheet
 * @param id
 * @param {node|| null} mount - pass the node to mount the style element to defaults to document head
 * @returns {function} for adding styles to the same stylesheet
 */
export const headStyleTag = (id, mount) => {
    let style = document.createElement('style');
    if (id) style.id = id;
    style.appendChild(document.createTextNode(""));
    (mount || document.head).appendChild(style);
    return (css) => (style.appendChild(document.createTextNode(css)), style);
};


export const getShadowParent = elmnt => {
    while (elmnt.parentNode && (elmnt = elmnt.parentNode)) if (elmnt instanceof ShadowRoot) return elmnt;
    return document;
};


export const createStyleTag = (css) => {
    let style = document.createElement('style');
    style.appendChild(document.createTextNode(css));
    return {
        element: style,
        update: (css) => style.textContent = css
    };
};

/*------------------ TEMPLATES -------------------------- */

const createTemplate = html => {
    let temp = document.createElement('template');
    temp.innerHTML = html;
    return temp;
}

export const templateToHost = (host, html) => {
    let temp = createTemplate(html);
    host.innerHTML = '';
    host.appendChild(temp.content.cloneNode(true));
};

export const TemplateMapFactory = () => {
    const cache = {};
    return (id, content) => {
        if (!cache[id]) {
            cache[id] = createTemplate(content);
        }
        return cache[id].content.cloneNode(true);
    }
};


/*------------------ WEB COMPONENT -------------------------- */

export const compose = (...mixins) => base => mixins.reduce((acc, curr) => (acc = curr(acc), acc), base);

/*------------------ MISC HELPERS -------------------------- */

export const booleanAttr = (ref, attr, bool) => ref[!!bool ? 'setAttribute' : 'removeAttribute'](attr, '');



