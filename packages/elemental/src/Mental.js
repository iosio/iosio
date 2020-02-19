import {compose} from "./util";
import {BaseElement} from "./BaseElement";
import {adoptableStyles} from "./adoptableStyles";
import {propLogic} from "./propLogic";
import {proxyRefs} from "./proxyRefs";
import {reactiveProps} from "./reactiveProps";
import {reactiveState} from "./reactiveState";
import {staticTemplate} from "./staticTemplate";
import {updatableStyles} from "./updatableStyles";

export class Mental extends compose(
    reactiveProps,
    adoptableStyles,
    staticTemplate,
    updatableStyles,
    reactiveState,
    propLogic,
    proxyRefs
)(BaseElement) {
}