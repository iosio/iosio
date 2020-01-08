import {isObj, isArray} from "@iosio/util";

export const d = document;

/*------------------ STYLES -------------------------- */

export const CONSTRUCTABLE_STYLE_SHEETS_AVAILABLE = "adoptedStyleSheets" in document;

/**
 * creates a single style sheet. returns a function to update the same sheet
 * @param {node|| null} mount - pass the node to mount the style element to defaults to document head
 * @returns {function} for adding styles to the same stylesheet
 */
export const headStyleTag = (mount) => {
    let style = d.createElement('style');
    style.appendChild(d.createTextNode(""));
    (mount || d.head).appendChild(style);
    return (css) => (style.appendChild(d.createTextNode(css)), style);
};

export const globalStyleTagCache = {}; // cache the instance css to the tagName


/*------------------ WEB COMPONENT -------------------------- */
/**
 * for parsing the incoming attributes into consumable props
 * @param value
 * @param type
 * @returns {{error: boolean, value: *}}
 */
export const formatType = (value, type) => {
    type = type || String;
    try {
        if (type == Boolean) value = [true, 1, "", "1", "true"].includes(value);
        else if (typeof value == "string") {
            value = type == Number
                ? Number(value)
                : type == Object || type == Array
                    ? JSON.parse(value) : value;
        }
        if ({}.toString.call(value) == `[object ${type.name}]`)
            return {value, error: type == Number && Number.isNaN(value)};
    } catch (e) {
    }
    return {value, error: true};
};

export const isCustomElement = (el, isAttr) => {
    if (!el.getAttribute || !el.localName) return false;
    isAttr = el.getAttribute('is');
    return el.localName.includes('-') || isAttr && isAttr.includes('-');
};
/**
 * will set or remove the attribute based on the truthyness of the value.
 * if the type of value is object or array and the node is a custom element, it will json stringify the value
 * @param node
 * @param attr
 * @param value
 */
export const updateAttribute = (node, attr, value) => {
    (value === null || value === false)
        ? node.removeAttribute(attr)
        : node.setAttribute(attr, isCustomElement(node) && (isObj(value) || isArray(value)) ? JSON.stringify(value) : value);
};


export const propToAttr = (prop) => prop.replace(/([A-Z])/g, "-$1").toLowerCase();
export const attrToProp = (attr) => attr.replace(/-(\w)/g, (all, letter) => letter.toUpperCase());


export const getShadowParent = elmnt => {
    while (elmnt.parentNode && (elmnt = elmnt.parentNode)) if (elmnt instanceof ShadowRoot) return elmnt;
    return document;
};

/**
 * @param cssText
 * @param async
 * @returns {*[]} - [0] constructable style sheet, [1] css text
 */
export const createStyleSheet = (cssText, async) => {
    let sheet = false;
    if (CONSTRUCTABLE_STYLE_SHEETS_AVAILABLE) {
        sheet = new CSSStyleSheet();
        sheet[async ? 'replace' : 'replaceSync'](cssText);
    }
    return [sheet, cssText];
};


/*
* adopts style sheets to the shadowRoot or the document
* @param sheets {array|CSSStyleSheet}
* @returns {string}
*/
export const adoptSheets = ({styleSheets, getCombined, shadowRoot}) => {
    let adopter = shadowRoot || getShadowParent(this);
    let combinedCSSTextIfNotAdoptable = '',

        constructable = customArrayOrSheet => {
            let sheet = isArray(customArrayOrSheet) ? customArrayOrSheet[0] : customArrayOrSheet;
            if (sheet && !([].concat(adopter.adoptedStyleSheets).includes(sheet))) {
                adopter.adoptedStyleSheets = [...adopter.adoptedStyleSheets, sheet];
            }
        },
        combinedText = customArrayOrSheet => {
            if (isArray(customArrayOrSheet) && customArrayOrSheet[1]) {
                combinedCSSTextIfNotAdoptable = combinedCSSTextIfNotAdoptable + customArrayOrSheet[1]
            }
        };
    let adopt = CONSTRUCTABLE_STYLE_SHEETS_AVAILABLE && !getCombined ? constructable : combinedText;
    [].concat(styleSheets).forEach(adopt);
    return combinedCSSTextIfNotAdoptable
};






/*------------------ CONSTANTS -------------------------- */

export const TEST_ENV = process.env.NODE_ENV === 'test';

