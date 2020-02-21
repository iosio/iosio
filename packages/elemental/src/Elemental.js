import {compose} from "./util";
import {BaseElement} from "./BaseElement";
import {adoptableStyles} from "./adoptableStyles";
import {propLogic} from "./propLogic";
import {proxyRefs} from "./proxyRefs";
import {reactiveProps} from "./reactiveProps";
import {reactiveState} from "./reactiveState";
import {staticTemplate} from "./staticTemplate";
import {updatableStyles} from "./updatableStyles";
import {events} from "./events";

export const Elemental = compose(
    reactiveProps,
    reactiveState,
    adoptableStyles,
    staticTemplate,
    updatableStyles,
    proxyRefs,
    propLogic,
    events
)(class extends HTMLElement {
    constructor() {
        super();
        const {shadow} = this.constructor;
        shadow && this.attachShadow({mode: 'open'});
    }
});

Elemental.define = (...elements) => {
    elements.forEach((e) => {
        if (!e.tag) return console.error('The Elemental base class requires a tag name on the static "tag" property', e);
        customElements.define(e.tag, e);
    })
};