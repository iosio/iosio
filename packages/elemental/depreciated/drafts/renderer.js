import {render, h, Fragment, createNode, mount} from "@iosio/vdom";
const renderer = render_ => self => () => {
    let results = render_(self.props, self.state, self);
    if (!results) return;
    if (self.fallbackCssString) {
        let style = h('style', {dangerouslySetInnerHTML: {__html: self.fallbackCssString || ''}});
        results = Array.isArray(results) ? (results.unshift(style), results) : [style, results];
    }
    render(self.shadowRoot || self, results);
};

export {renderer, render, h, Fragment, createNode, mount};
