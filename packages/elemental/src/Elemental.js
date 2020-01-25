import {def, isFunc} from "@iosio/util";
import {
    adoptStyles,
    appendTemplate,
    makeProxyObj,
    attrToProp,
    formatType,
    propToAttr,
    updateAttribute,
    createStyleTag,
    eventListener
} from "./util";

const IGNORE_ATTR = Symbol();

export class Elemental extends HTMLElement {
    constructor() {
        super();
        const {initAttrs} = this.constructor;
        const {shadow, tag, styles, template, ids} = this.constructor;
        this.prevProps = {};
        this.props = {};
        this.changedProps = [];
        this.unsubs = [];
        this.refs = {};
        shadow && this.attachShadow({mode: 'open'});

        const root = (this.shadowRoot || this);

        this.mounted = new Promise(mount => (this._mount = mount));

        let updatableStyleTag;

        this.updateStyles = () => {
            if (this.updatableStyles) {
                let css = this.updatableStyles(this.props, this.prevProps);
                if (!css) return;
                if (!updatableStyleTag) {
                    updatableStyleTag = createStyleTag(css);
                    (this.shadowRoot || this).appendChild(updatableStyleTag.element)
                } else updatableStyleTag.update(css);
            }
        };

        this.refs = new Proxy({}, {
            get(target, key) {
                return root.querySelector('#' + key)
            }
        });

        const render = () => {
            if (styles) adoptStyles(tag, this, styles);
            if (template) {
                appendTemplate(tag, this, template);
            }
        };

        shadow && render();

        const initialUpdate = () => {
            if (this.render) this.render(this.props);
            else !shadow && render();
            this.didMount && this.didMount(this.props, this.prevProps, this.changedProps);
            this.hasMounted = true;
        };

        const subsequentUpdate = () => {
            this.didUpdate && this.didUpdate(this.props, this.prevProps, this.changedProps);
        };

        this.update = () => {
            if (!this.processing) this.processing = this.mounted.then(_ => {
                !this.hasMounted ? initialUpdate() : subsequentUpdate();
                this.changedProps = [];
                this.processing = false;
            });
            return this.processing;
        };

        let length = initAttrs.length;
        while (length--) initAttrs[length](this);

        this.update();

        this.eventListener = (to, ev, cb, opts) => {
            this.unsubs.push(eventListener(to, ev, cb, opts));
        }
    }

    connectedCallback() {
        if (!this.hasMounted) this._mount();
    }

    emit = (event, detail, opts = {}, from = this) => from.dispatchEvent(
        new CustomEvent(event, {detail: detail, bubbles: true, composed: true, ...opts})
    );

    attributeChangedCallback(attr, oldValue, newValue) {
        if (this[IGNORE_ATTR] === attr || oldValue === newValue) return;
        this[attrToProp(attr)] = newValue;
    }

    unsubSubs = () => {
        this.unsubs.forEach(f => f && f());
    };

    disconnectedCallback() {
        if (this.isConnected) return;
        this.willUnmount();
        this.unsubSubs();
    }

    static get observedAttributes() {
        let {prototype, propTypes, tag} = this;
        this.initAttrs = [];
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
                        this.changedProps.push(prop);
                        if (schema.reflect) {
                            this.mounted.then(() => {
                                this[IGNORE_ATTR] = attr;
                                updateAttribute(this, attr, schema.type === Boolean && !value ? null : value);
                                this[IGNORE_ATTR] = false;
                            });
                        }
                        this.prevProps[prop] = this.props[prop];
                        this.props[prop] = value;
                        this.update();
                    }
                });
            }
            schema.value && this.initAttrs.push(self => (self[prop] = schema.value));
            return attr;
        });
    }

    didMount() {
    }

    didUpdate() {
    }

    willUnmount() {

    }
}


Elemental.define = (...elements) => {
    elements.forEach((e) => {
        if (!e.tag) return console.error('The static "tag" property is required on Elemental element', e);
        customElements.define(e.tag, e);
    })
};

