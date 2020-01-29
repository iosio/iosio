import {def, isFunc} from "@iosio/util";
import {
    adoptStyles,
    appendTemplate,
    attrToProp,
    formatType,
    propToAttr,
    updateAttribute,
    createStyleTag,
    eventListener
} from "./util";

const IGNORE_ATTR = Symbol();

/*
    @TODO
    - cache refs
    -
 */

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
                    root.appendChild(updatableStyleTag.element)
                } else updatableStyleTag.update(css);
            }
        };

        let refsCache = {};
        this.refs = new Proxy({}, {
            get(target, key) {
                if (key === 'refreshRefsCache') return () => refsCache = {};
                if (!refsCache[key]) refsCache[key] = root.querySelector('#' + key);
                return refsCache[key];
            }
        });

        const render = () => {
            if (styles) adoptStyles(tag, this, styles);
            if (template) {
                appendTemplate(tag, this, template);
            }
        };

        //if there is a shadowRoot, then its safe to render
        shadow && render();
        const initialUpdate = () => {
            !shadow && render();
            this.didMount && this.didMount(this.props, this.prevProps, this.changedProps);
            this.hasMounted = true;
            if (this.propLogic) {
                const logic = this.propLogic(true);
                Object.keys(this.props).forEach(prop => {
                    logic[prop] && logic[prop](this.props[prop], this.refs);
                });
            }
        };

        const subsequentUpdate = () => {
            this.didUpdate && this.didUpdate(this.props, this.prevProps, this.changedProps);
            if (this.propLogic) {
                const logic = this.propLogic();
                this.changedProps.forEach(prop => logic[prop] && logic[prop](this.props[prop], this.refs))
            }
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
        };

        this.emit = (event, detail, opts = {}, from = this) => from.dispatchEvent(
            new CustomEvent(event, {detail: detail, bubbles: true, composed: true, ...opts})
        );

        this.unsubSubs = () => {
            this.unsubs.forEach(f => f && f());
        };
    }

    connectedCallback() {
        if (!this.hasMounted) this._mount();
    }


    attributeChangedCallback(attr, oldValue, newValue) {
        if (this[IGNORE_ATTR] === attr || oldValue === newValue) return;
        this[attrToProp(attr)] = newValue;
    }


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
        if (!e.tag) return console.error('The Elemental base class requires a tag name on the static "tag" property', e);
        customElements.define(e.tag, e);
    })
};

