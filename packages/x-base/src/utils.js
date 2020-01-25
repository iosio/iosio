import {isObj, isArray, def, isFunc} from "@iosio/util";

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


/*------------------ WEB COMPONENT -------------------------- */
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
    (value === null || value === false || value === 'null' || value === 'false')
        ? node.removeAttribute(attr)
        : node.setAttribute(attr, isCustomElement(node) && (isObj(value) || isArray(value)) ? JSON.stringify(value) : value);
};

export const propToAttr = (prop) => prop.replace(/([A-Z])/g, "-$1").toLowerCase();
export const attrToProp = (attr) => attr.replace(/-(\w)/g, (all, letter) => letter.toUpperCase());


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


export const getShadowParent = elmnt => {
    while (elmnt.parentNode && (elmnt = elmnt.parentNode)) if (elmnt instanceof ShadowRoot) return elmnt;
    return document;
};


/*
* adopts style sheets to the shadowRoot, shadowParent or the document
* @param sheets {array|CSSStyleSheet}
* @returns {string}
*/
export const adoptSheets = ({styleSheets, getCombined, element}) => {
    let adopter = element.shadowRoot || getShadowParent(element);

    let combinedCSSTextIfNotAdoptable = '';

    const constructable = customArrayOrSheet => {
        let sheet = isArray(customArrayOrSheet) ? customArrayOrSheet[0] : customArrayOrSheet;
        if (sheet && !([].concat(adopter.adoptedStyleSheets).includes(sheet))) {
            adopter.adoptedStyleSheets = [...adopter.adoptedStyleSheets, sheet];
        }
    };

    const combinedText = customArrayOrSheet => {
        if (isArray(customArrayOrSheet) && customArrayOrSheet[1]) {
            combinedCSSTextIfNotAdoptable = combinedCSSTextIfNotAdoptable + customArrayOrSheet[1]
        }
    };

    let adopt = CONSTRUCTABLE_STYLE_SHEETS_AVAILABLE && !getCombined ? constructable : combinedText;

    [].concat(styleSheets).forEach(adopt);

    return combinedCSSTextIfNotAdoptable
};

const constructableStyleCache = {};
const constructableStyleTagFallbackCache = {};

export const DEFAULT_SHADOWROOT_HOST_CSS_RESETS = `:host, *, *::before, *::after {box-sizing: border-box;} `;

export const createStyleTag = (css) => {
    let style = document.createElement('style');
    let textNode = document.createTextNode(css);
    style.appendChild(textNode);
    return {
        element: style,
        update: (css) => textNode.replaceWith(document.createTextNode(css))
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

export const UpdatableTemplate = (host) => {
    let temp; // try caching again
    return (html) => {
        temp = document.createElement('template');
        temp.innerHTML = html;
        host.innerHTML = '';
        host.appendChild(temp.content.cloneNode(true));
    }
};



export const getElementProps = (element) => {
    let hostNodeProps = {}, i, a = element.attributes;
    for (i = a.length; i--;) hostNodeProps[a[i].name] = a[i].value;
    return hostNodeProps;
};


export const makeProxyObj = (fallBackGetter) => {
    return new Proxy({}, {
        get(target, key) {
            let prop = target[key];
            if (target[key]) return target[key];
            else {
                prop = fallBackGetter(key);
                target[key] = prop;
                return prop;
            }
        }
    });
};



export const proxyAttrs = (element, updateAttr) => {
    return new Proxy({}, {
        set(target, key, value) {
            updateAttr && updateAttribute(element, key, value);
        },
        get(target, key) {
            return element.getAttribute(key);
        }
    });
};

const PromiseBatch = () => {
    let resolve, processing,
        promise = new Promise(mount => (resolve = mount));
    return {
        promise,
        resolve,
        processing,
        updater: (fn) => (...args) => {
            console.log('updating')
            if (!processing) processing = promise.then(_ => {
                fn && fn(...args);
                processing = false;
            });
        }
    }
};


export const ProxyProps = (element) => {
    let _props = {};
    // let elementMount;
    // let mounted = new Promise(mount => (elementMount = mount));
    // let processing;

    const {promise, resolve, updater} = PromiseBatch();

    return {
        mount: resolve,
        mounted: promise,
        def: (props, updateFn, reflect) => {

            const update = updater(updateFn);

            Object.keys(props).forEach((key) => {

                _props[key] = props[key];

                def(element, key, {
                    set(val) {
                        if (_props[key] !== val) {
                            _props[key] = val;
                            reflect && updateAttribute(element, key, val);
                            update(_props);
                        }
                    },
                    get() {
                        return _props[key];
                    }
                })
            });

        }
    }
};

export const reflectPropsToAttrs = (element, props) => {
    let _props = {};

    const {promise, resolve, updater} = PromiseBatch();

    Object.keys(props).forEach((key) => {

        const updateIt = (key, val) => {
            updateAttribute(element, key, val);
        };

        const update = updater(updateIt);

        def(element.prototype, key, {

            set(val) {

                console.log('setting property', key, 'with', val);

                let type = props[key],
                    _val = val;

                if (isFunc(type)){
                    _val = type(val);
                } else {
                    console.log('formatting type', val , type);
                    _val = formatType(_val, type).value;
                }

                if (_props[key] !== _val) {
                    _props[key] = _val;
                    console.log('updating attribute', key, _val);
                    promise.then(() =>{
                        updateAttribute(element, key, _val)
                    });
                }

            },
            get() {
                return _props[key];
            }
        })
    });
    return {
        mount: (self) => {
            element = self;
            resolve();
        },
    }
};


export const emit = (from, event, detail, opts = {}) => from.dispatchEvent(
    new CustomEvent(event, {detail: detail, bubbles: true, composed: true, ...opts})
);

const IGNORE_ATTR = Symbol();
const reactiveProps = {
    construct: (self) => {
        let {initAttrs} = self.constructor;
        self.prevProps = {};
        self.props = {};
        self.mounted = new Promise(mount => (self._mount = mount));
        self.update = () => {
            if (!self.processing) self.processing = self.mounted.then(_ => {
                !self.hasMounted
                    ? (self.didMount && self.didMount(self.props, self.prevProps), self.hasMounted = true )
                    : self.didUpdate && self.didUpdate(self.props, self.prevProps);
                self.processing = false;
            });
            return self.processing;
        };
        let length = initAttrs.length;
        while (length--) initAttrs[length](self);
        self.update();
    },
    observedAttrs: (self, existingAttrs = []) => {

        let {prototype, propTypes} = self;
        self.initAttrs = [];
        if (!propTypes) return [];

        return Object.keys(propTypes).map(prop => {
            let attr = propToAttr(prop);
            let schema = propTypes[prop].name ? {type: propTypes[prop]} : propTypes[prop];
            if (!(prop in prototype)) {
                def(prototype, prop, {
                    get() {
                        return this.props[prop]
                    },
                    set(nextValue) {
                        let {value, error} = formatType(nextValue, schema.type);
                        if (error && value != null) console.error(`[${prop}] must be type [${schema.type.name}]`);
                        if (value === this.props[prop]) return;
                        if (schema.reflect) {
                            this.mounted.then(() => {
                                this[IGNORE_ATTR] = attr;
                                updateAttribute(
                                    this,
                                    attr,
                                    schema.type === Boolean && !value
                                        ? null
                                        : value
                                );
                                this[IGNORE_ATTR] = false;
                            });
                        }
                        this.prevProps[prop] = this.props[prop];
                        this.props[prop] = value;
                        this.update();
                    }
                });
            }
            schema.value && self.initAttrs.push(self => (self[prop] = schema.value));
            return attr;
        });
    },
    connect:(self) => {
        if (!self.hasMounted) self._mount();
    },
    attrChange:(attr, oldValue, newValue, self) => {
        if (self[IGNORE_ATTR] === attr || oldValue === newValue) return;
        self[attrToProp(attr)] = newValue;
    }
};

export const createReactiveProps = () => {

    return reactiveProps
};

const {construct, observedAttrs, connect, attrChange} = reactiveProps;



export class ReactiveElement extends HTMLElement{
    static get observedAttributes(){
        return observedAttrs(this);
    }
    constructor() {
        super();
        construct(this)
    }
    connectedCallback(){
        connect(this);
    }
    attributeChangedCallback(attr, old, _new){
        attrChange(attr, old, _new, this);
    }
}




/*------------------ CONSTANTS -------------------------- */

export const TEST_ENV = process.env.NODE_ENV === 'test';

