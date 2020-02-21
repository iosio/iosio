const tagTemplateCache = new Map();
export const appendTemplate = (element, templateStr) => {
    if (!element || !templateStr) return;
    let el = element.shadowRoot || element,
        signature = element.constructor,
        temp = tagTemplateCache.get(signature);
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
        const temp = this.constructor.template;
        this._templify = () => temp && appendTemplate(this, temp);
        this.shadowRoot && this._templify();
    }

    connectedCallback() {
        if (super.connectedCallback) super.connectedCallback();
        !this.shadowRoot && this._templify();
    }
};