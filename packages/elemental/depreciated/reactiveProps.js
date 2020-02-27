import {isArray, isObj} from "@iosio/util";

export const propToAttr = (prop) => prop.replace(/([A-Z])/g, "-$1").toLowerCase();
export const attrToProp = (attr) => attr.replace(/-(\w)/g, (all, letter) => letter.toUpperCase());
export const isCustomElement = (el, isAttr) => {
    if (!el.getAttribute || !el.localName) return false;
    isAttr = el.getAttribute('is');
    return el.localName.includes('-') || isAttr && isAttr.includes('-');
};
export const updateAttribute = (node, attr, value) => {
    (value === null || value === false || value === 'null' || value === 'false')
        ? node.removeAttribute(attr)
        : node.setAttribute(attr, isCustomElement(node) && (isObj(value) || isArray(value)) ? JSON.stringify(value) : value);
};

/**
 * for parsing the incoming attributes into consumable props
 * @param value
 * @param type
 * @returns {{error: boolean, value: *}}
 */
export const formatType = (value, type) => {
    type = type || String;
    if (type == Boolean) value = [true, 1, "", "1", "true"].includes(value);
    else if (typeof value == "string") {
        value = type == Number
            ? Number(value) : type == Object || type == Array
                ? JSON.parse(value) : value;
    }
    if (type === 'any') return {value, error: false};
    if ({}.toString.call(value) == `[object ${type.name}]`) return {
        value,
        error: type == Number && Number.isNaN(value)
    };
    return {value, error: true};
};


const IGNORE_ATTR = Symbol();
export const reactiveProps = base => {

    class ReactiveProps extends base {

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
            if (!this.hasMounted){
                if (super.connectedCallback) this.mounted.then(_ =>{
                    console.log('reactive props connected')
                    super.connectedCallback()
                    this.hasMounted = true;
                });
                this._mount();
            }
        }


        update() {
            if (!this.processing) this.processing = this.mounted.then(_ => {
                !this.hasMounted ? this._initialUpdate() : this._subsequentUpdate();
                this.changedProps = [];
                this.processing = false;
            });
            return this.processing;
        }

        beforeInitialUpdate() {
        }

        _initialUpdate() {
            this.beforeInitialUpdate(this.props, this.prevProps, this.changedProps);
            this.initialUpdate();
            this.didMount && this.didMount(this.props, this.prevProps, this.changedProps);
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

        disconnectedCallback() {
            if (this.isConnected) return;
            this.willUnmount && this.willUnmount();
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
    }

    ReactiveProps.__reactivePropsMixin = true;
    return ReactiveProps;
};