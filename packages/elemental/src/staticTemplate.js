const tagTemplateCache = new Map();

export const appendTemplate = (element, templateStr) => {
    if (!element || !templateStr) return;
    let el = element.shadowRoot || element;
    let signature = element.constructor.tag || element.constructor;
    let temp = tagTemplateCache.get(signature);
    if (!temp) {
        temp = document.createElement('template');
        temp.innerHTML = templateStr;
        tagTemplateCache.set(signature, temp);
    }
    el.appendChild(temp.content.cloneNode(true));
};


export const staticTemplate = base => class extends base {
    constructor() {
        super();
        this._templify = () => appendTemplate(this, this.constructor.template);
        this.shadowRoot && this._templify();
    }

    connectedCallback() {
        !this.shadowRoot && this._templify();
        if (super.connectedCallback) super.connectedCallback();
    }
};