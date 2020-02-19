import {isObj, isArray, def, isFunc, eventListener} from "@iosio/util";


export {eventListener}
/*------------------ STYLES -------------------------- */

export const CONSTRUCTABLE_STYLE_SHEETS_AVAILABLE = "adoptedStyleSheets" in document;

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


const constructableStyleCache = {};
const constructableStyleTagFallbackCache = {};

export const DEFAULT_SHADOWROOT_HOST_CSS_RESETS = `:host, *, *::before, *::after {box-sizing: border-box;} `;

export const createStyleTag = (css) => {
    let style = document.createElement('style');
    style.appendChild(document.createTextNode(css));
    return {
        element: style,
        update: (css) => style.textContent = css
    };
};

export const adoptStyles = (tag, element, cssString, async, useStyleTag) => {

    cssString = (element.shadowRoot ? DEFAULT_SHADOWROOT_HOST_CSS_RESETS : '') + cssString;

    if (CONSTRUCTABLE_STYLE_SHEETS_AVAILABLE && !useStyleTag) {
        let adopter = element.shadowRoot || getShadowParent(element);

        let constructable = constructableStyleCache[tag];
        if (!constructable) {
            constructable = new CSSStyleSheet();
            constructable[async ? 'replace' : 'replaceSync'](cssString);
            constructableStyleCache[tag] = constructable;
        }

        if (!([].concat(adopter.adoptedStyleSheets).includes(constructable))) {
            adopter.adoptedStyleSheets = [...adopter.adoptedStyleSheets, constructable];
        }
    } else {
        let style = constructableStyleTagFallbackCache[tag];
        if (!style) {
            style = createStyleTag(cssString).element;
            constructableStyleTagFallbackCache[tag] = style;
        }
        (element.shadowRoot || element).appendChild(style.cloneNode(true));
    }
};

/*------------------ TEMPLATES -------------------------- */

export const select = (host, selector) => (host.shadowRoot || host).querySelector(selector);

export const createRefs = (element, refs, selector) => {
    return refs.reduce((acc, curr) => (acc[curr] = select(element, (selector || '') + curr), acc), {})
};


export const createRefsFromIDs = (element, refs) => createRefs(element, refs, '#');

const tagTemplateCache = {};

export const appendTemplate = (tag, element, templateStr) => {
    if (!tag || !element || !templateStr) return;
    let el = element.shadowRoot || element;
    let temp = tagTemplateCache[tag];
    if (!temp) {
        temp = document.createElement('template');
        temp.innerHTML = templateStr;
        tagTemplateCache[tag] = temp;
    }
    el.appendChild(temp.content.cloneNode(true));
};


export const templateToHost = (host, html) => {
    let temp = document.createElement('template');
    temp.innerHTML = html;
    host.innerHTML = '';
    host.appendChild(temp.content.cloneNode(true));
};


export const TemplateMapFactory = () => {
    const cache = {};
    return (id, content) => {
        if (!cache[id]) {
            const temp = document.createElement('template');
            temp.innerHTML = content;
            cache[id] = temp
        }
        return cache[id].content.cloneNode(true);
    }
};


/*------------------ DOM -------------------------- */

/*------------------ WEB COMPONENT -------------------------- */

export const isCustomElement = (el, isAttr) => {
    if (!el.getAttribute || !el.localName) return false;
    isAttr = el.getAttribute('is');
    return el.localName.includes('-') || isAttr && isAttr.includes('-');
};


export const updateAttribute = (node, attr, value) => {
    (value === null || value === false || value === 'null' || value === 'false')
        ? node.removeAttribute(attr)
        : node.setAttribute(attr, isCustomElement(node) && (isObj(value) || isArray(value)) ? JSON.stringify(value) : value);
};

export const propToAttr = (prop) => prop.replace(/([A-Z])/g, "-$1").toLowerCase();
export const attrToProp = (attr) => attr.replace(/-(\w)/g, (all, letter) => letter.toUpperCase());


/*------------------ STATE -------------------------- */
/**
 * for parsing the incoming attributes into consumable props
 * @param value
 * @param type
 * @returns {{error: boolean, value: *}}
 */
export const formatType = (value, type) => {
    type = type || String;
    if (type == Boolean) value = [true, 1, "", "1", "true"].includes(value);
    else if (typeof value == "string") {
        value = type == Number
            ? Number(value) : type == Object || type == Array
                ? JSON.parse(value) : value;
    }
    if ({}.toString.call(value) == `[object ${type.name}]`) return {
        value,
        error: type == Number && Number.isNaN(value)
    };
    return {value, error: true};
};

export const compose = (...mixins) => base =>
    mixins.reduce((acc, curr) => {
        acc = curr(acc);
        return acc;
    }, base);