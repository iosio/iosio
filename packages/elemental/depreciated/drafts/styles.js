export const createStyleTag = (css) => {
    let style = document.createElement('style');
    style.appendChild(document.createTextNode(css));
    return {
        element: style,
        update: (css) => style.textContent = css
    };
};

export const getShadowParent = elmnt => {
    while (elmnt.parentNode && (elmnt = elmnt.parentNode)) if (elmnt instanceof ShadowRoot) return elmnt;
    return document;
};

export const CONSTRUCTABLE_STYLE_SHEETS_AVAILABLE = "adoptedStyleSheets" in document;
export const DEFAULT_SHADOWROOT_HOST_CSS_RESETS = `:host, *, *::before, *::after {box-sizing: border-box;} `;

const constructableStyleCache = new Map();
const constructableStyleTagFallbackCache = new Map();

export const adoptStyles = (element, cssString, options = {}) => {
    const {async, getStringOnFallback, useStyleTag, noDefaultResets} = options;

    cssString = (element.shadowRoot && !noDefaultResets ? DEFAULT_SHADOWROOT_HOST_CSS_RESETS : '')
        + (cssString || options.cssString || '');

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
        if (getStringOnFallback) return cssString;
        let style = constructableStyleTagFallbackCache.get(signature);
        if (!style) {
            style = createStyleTag(cssString).element;
            constructableStyleTagFallbackCache.set(signature, style);
        }
        (element.shadowRoot || element).appendChild(style.cloneNode(true));
    }
};

export const styles = (cssString, options = {}) => (self) => {
    // let adopt = () => ();
    // self.shadowRoot ? adopt() : self.initialized.then(adopt);
    self.fallbackCssString = adoptStyles(self, cssString, {getStringOnFallback: self.hasRenderer, ...options})
};
