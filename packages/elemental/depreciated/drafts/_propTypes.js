export const propTypes = (propTypes) => (Class_or_self, define) => {
    if (!define) {
        initializeAttrs(Class_or_self);
        return;
    }
    Class_or_self.prototype.attributeChangedCallback = function(a,o,n){
        propTypesAttributeFn(a, o, n, this)
    };

    Object.defineProperty(Class_or_self, 'observedAttributes', {
        get() {
            return makePropTypes(this, propTypes);
        }
    });
};

export const initializeAttrs = self => {
    let initAttrs = self.constructor.initAttrs, length;
    if (initAttrs) {
        length = initAttrs.length;
        while (length--) initAttrs[length](self);
    }
};


export function propTypesAttributeFn(a, o, n, self) {
    if (self[IGNORE_ATTR] === a || o === n) return;
    self[attrToProp(a)] = n;
}
export const makePropTypes = (self, propTypes_) => {
    let {prototype, propTypes} = self;
    propTypes = propTypes || propTypes_;

    prototype.props = {};
    prototype.prevProps = {};
    prototype.changedProps = [];
    self.initAttrs = [];
    if (!propTypes) return [];
    return Object.keys(propTypes).map(prop => {
        let attr = propToAttr(prop),
            schema = (propTypes[prop] === 'any' || propTypes[prop].name) ? {type: propTypes[prop]} : propTypes[prop];
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
        schema.value && self.initAttrs.push(self =>{
            self[prop] =  schema.value
        });
        return attr;
    });
};

const IGNORE_ATTR = Symbol();
export const propToAttr = (prop) => prop.replace(/([A-Z])/g, "-$1").toLowerCase();
export const attrToProp = (attr) => attr.replace(/-(\w)/g, (all, letter) => letter.toUpperCase());
export const updateAttribute = (node, attr, value) => {
    (value === null || value === false || value === 'null' || value === 'false')
        ? node.removeAttribute(attr)
        : node.setAttribute(
        attr,
        typeof value == "object" ? JSON.stringify(value) : value
        );
};
export const formatType = (value, type) => {
    if (type === 'any') return {value, error: false};
    type = type || String;
    if (type == Boolean) value = [true, 1, "", "1", "true"].includes(value);
    else if (typeof value == "string") {
        value = type == Number ? Number(value) : type == Object || type == Array ? JSON.parse(value) : value;
    }
    if ({}.toString.call(value) == `[object ${type.name}]`) return {
        value,
        error: type == Number && Number.isNaN(value)
    };
    return {value, error: true};
};

