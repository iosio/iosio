export function createElem(tag, props, children = []) {
    let elem = document.createElement(tag);
    for (let key in props) {
        if (key === 'ref' && typeof props[key] === 'function') {
            props[key](elem);
        } else if (key in elem) elem[key] = props[key];
        else elem.setAttribute(key, props[key]);
    }
    children.length && children.forEach(c => elem.appendChild(c));
    return elem;
};
