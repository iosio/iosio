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

/*------------------ TEMPLATES -------------------------- */

export const createTemplate = html => {
    let temp = document.createElement('template');
    temp.innerHTML = html;
    return temp;
};

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

export const isCustomElement = (el, isAttr) => {
    if (!el.getAttribute || !el.localName) return false;
    isAttr = el.getAttribute('is');
    return el.localName.includes('-') || isAttr && isAttr.includes('-');
};

/*------------------ MISC HELPERS -------------------------- */

export const booleanAttr = (ref, attr, bool) => ref[!!bool ? 'setAttribute' : 'removeAttribute'](attr, '');



export let NOOP = () => [];