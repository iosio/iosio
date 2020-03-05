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

export const template = string => self => {
    // let append = () => appendTemplate(self, string);
    // self.shadowRoot ? append() : self.initialized.then(append);
    appendTemplate(self, string);
};
