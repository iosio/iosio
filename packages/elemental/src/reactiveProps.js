import {attrToProp, formatType, propToAttr, updateAttribute} from "./util";

const IGNORE_ATTR = Symbol();

export const reactiveProps = base => class extends base {
    constructor() {
        super();
        const {initAttrs} = this.constructor;
        this.prevProps = {};
        this.props = {};
        this.changedProps = [];
        this.hasMounted = false;
        this.mounted = new Promise(mount => (this._mount = mount));
        let length = initAttrs.length;
        while (length--) initAttrs[length](this);
        this.update();
    }

    connectedCallback() {
        if (super.connectedCallback) super.connectedCallback();
        if (!this.hasMounted) this._mount();
    }


    update() {
        if (!this.processing) this.processing = this.mounted.then(_ => {
            !this.hasMounted ? this._initialUpdate() : this._subsequentUpdate();
            this.changedProps = [];
            this.processing = false;
        });
        return this.processing;
    }


    _initialUpdate() {
        this.initialUpdate();
        this.didMount && this.didMount(this.props, this.prevProps, this.changedProps);
        this.hasMounted = true;
    }

    initialUpdate() {
    }

    shouldUpdate(props, prevProps, changedProps) {

    }

    _subsequentUpdate() {
        const shouldUpdate = this.shouldUpdate(this.props, this.prevProps, this.changedProps);
        if (shouldUpdate || shouldUpdate === undefined) {
            this.subsequentUpdate();
            this.didUpdate && this.didUpdate(this.props, this.prevProps, this.changedProps);
        }
    }

    subsequentUpdate() {
    }

    attributeChangedCallback(attr, oldValue, newValue) {
        if (super.attributeChangedCallback) super.attributeChangedCallback(attr, oldValue, newValue);
        if (this[IGNORE_ATTR] === attr || oldValue === newValue) return;
        this[attrToProp(attr)] = newValue;
    }

    static get observedAttributes() {
        let {prototype, propTypes} = this;
        this.initAttrs = [];
        if (!propTypes) return [];
        return Object.keys(propTypes).map(prop => {
            let attr = propToAttr(prop);
            let schema = propTypes[prop].name ? {type: propTypes[prop]} : propTypes[prop];
            if (!(prop in prototype)) {
                Object.defineProperty(prototype, prop, {
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
};