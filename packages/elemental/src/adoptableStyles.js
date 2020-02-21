import {
    createStyleTag,
    getShadowParent
} from "./util";

export const CONSTRUCTABLE_STYLE_SHEETS_AVAILABLE = "adoptedStyleSheets" in document;
export const DEFAULT_SHADOWROOT_HOST_CSS_RESETS = `:host, *, *::before, *::after {box-sizing: border-box;} `;

const constructableStyleCache = new Map();
const constructableStyleTagFallbackCache = new Map();

export const adoptStyles = (element, cssString, options = {}) => {
    const {async, useStyleTag, noDefaultResets} = options;

    cssString = (element.shadowRoot && !noDefaultResets ? DEFAULT_SHADOWROOT_HOST_CSS_RESETS : '') + (cssString || options.cssString || '');

    const signature = element.constructor.tag || element.constructor;

    if (CONSTRUCTABLE_STYLE_SHEETS_AVAILABLE && !useStyleTag) {
        let adopter = element.shadowRoot || getShadowParent(element);
        let constructable = constructableStyleCache.get(signature);
        if (!constructable) {
            constructable = new CSSStyleSheet();
            constructable[async ? 'replace' : 'replaceSync'](cssString);
            constructableStyleCache.set(signature, constructable);
        }
        if (!([].concat(adopter.adoptedStyleSheets).includes(constructable))) {
            adopter.adoptedStyleSheets = [...adopter.adoptedStyleSheets, constructable];
        }
    } else {
        let style = constructableStyleTagFallbackCache.get(signature);
        if (!style) {
            style = createStyleTag(cssString).element;
            constructableStyleTagFallbackCache.set(signature, style);
        }
        (element.shadowRoot || element).appendChild(style.cloneNode(true));
    }
};


export const adoptableStyles = base => class extends base {
    constructor() {
        super();
        this._adoptify = () => adoptStyles(this, this.constructor.styles, this.constructor.adoptableStyles);
        this.shadowRoot && this._adoptify();
    }

    connectedCallback() {
        if (super.connectedCallback) super.connectedCallback();
        !this.shadowRoot && this._adoptify();
    }
};