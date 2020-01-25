import {def} from "@iosio/util";
import {attrToProp, formatType, propToAttr, updateAttribute} from "../src/util";

const IGNORE_ATTR = Symbol();

export const reactiveProps = {
    construct: (self) => {
        let {initAttrs} = self.constructor;
        self.prevProps = {};
        self.props = {};
        self.mounted = new Promise(mount => (self._mount = mount));
        self.update = () => {
            if (!self.processing) self.processing = self.mounted.then(_ => {
                !self.hasMounted
                    ? (self.didMount && self.didMount(self.props, self.prevProps), self.hasMounted = true)
                    : self.didUpdate && self.didUpdate(self.props, self.prevProps);
                self.processing = false;
            });
            return self.processing;
        };
        let length = initAttrs.length;
        while (length--) initAttrs[length](self);
        self.update();
    },
    observedAttrs: (self, existingAttrs = []) => {

        let {prototype, propTypes} = self;
        self.initAttrs = [];
        if (!propTypes) return [];

        return Object.keys(propTypes).map(prop => {
            let attr = propToAttr(prop);
            let schema = propTypes[prop].name ? {type: propTypes[prop]} : propTypes[prop];
            if (!(prop in prototype)) {
                def(prototype, prop, {
                    get() {
                        return this.props[prop]
                    },
                    set(nextValue) {
                        let {value, error} = formatType(nextValue, schema.type);
                        if (error && value != null) console.error(`[${prop}] must be type [${schema.type.name}]`);
                        if (value === this.props[prop]) return;
                        if (schema.reflect) {
                            this.mounted.then(() => {
                                this[IGNORE_ATTR] = attr;
                                updateAttribute(
                                    this,
                                    attr,
                                    schema.type === Boolean && !value
                                        ? null
                                        : value
                                );
                                this[IGNORE_ATTR] = false;
                            });
                        }
                        this.prevProps[prop] = this.props[prop];
                        this.props[prop] = value;
                        this.update();
                    }
                });
            }
            schema.value && self.initAttrs.push(self => (self[prop] = schema.value));
            return attr;
        });
    },
    connect: (self) => {
        if (!self.hasMounted) self._mount();
    },
    attrChange: (attr, oldValue, newValue, self) => {
        if (self[IGNORE_ATTR] === attr || oldValue === newValue) return;
        self[attrToProp(attr)] = newValue;
    }
};

const {construct, observedAttrs, connect, attrChange} = reactiveProps;


export class ReactiveElement extends HTMLElement {
    static get observedAttributes() {
        return observedAttrs(this);
    }

    constructor() {
        super();
        construct(this)
    }

    connectedCallback() {
        connect(this);
    }

    attributeChangedCallback(attr, old, _new) {
        attrChange(attr, old, _new, this);
    }

    didMount() {
    }

    didUpdate() {
    }
}



