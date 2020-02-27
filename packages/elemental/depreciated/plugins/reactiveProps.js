//
/*

  reactiveProps

  ** requires asyncBatchUpdate plugin **

  reactiveProps plugin enables a dependable and consistent data flow similar to react.
  with asynchronous rendering (using the asyncBatchUpdate plugin), the component will update after a
  pending promise is resolved, thus, on initial mount, it lets the browser "breath" when rendering a bunch of components,
  and with subsequent updates, it throttles the amount of times a render should happen.

  propTypes
  define all your properties with types, optionally with a default value and optional reflect property
  to reflect your props as attrs.
  (when a prop is set, it will update the attribute to kabob-case version (if reflected) but will automatically
    set the property when an attribute is updated without setting the reflect option)

  @example

   ...

   static propTypes = {

        myStringProp: String,
        myBooleanProp: Boolean,
        myNumberProp: Number,
        myObjectProp: Object,
        myArrayProp: Array,
        anyValueGoesProp: 'any',

        toBeReflected: {
            type: String,
            reflect: true
        },

        toBeReflectedWithDefaultValue:{
            type: Boolean,
            reflect: true,
            value: true
        }
   }

   ...

  see test file for more detailed info

  class properties/methods
  (all asyncBatchUpdate properties)


  static propTypes
  - define your reactive prop schema

  this.props
  - object containing updated properties

  this.prevProps
  - object containing the previous props before they were updated

  this.changedProps
  - array containing a list of properties that were last changed.
  actively cleared after update



 */
export const reactiveProps = ({observedAttrs, construct, connected, attrChanged}) => {

    const IGNORE_ATTR = Symbol(), INIT_ATTRS = Symbol();

    observedAttrs((self, combine) => {
        let {prototype, propTypes} = self;
        self[INIT_ATTRS] = [];
        if (!propTypes) return [];
        combine(Object.keys(propTypes).map(prop => {
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
            schema.value && self[INIT_ATTRS].push(own => own[prop] = schema.value);
            return attr;
        }));
    });

    construct(self => {
        self.prevProps = {};
        self.props = {};
        self.changedProps = [];

        let hasMounted = false,

            initAttrs = self.constructor[INIT_ATTRS],

            getArgs = () => [self.props, self.prevProps, self.changedProps],

            _initialUpdate = () => {
                self.beforeInitialUpdate && self.beforeInitialUpdate(...getArgs());
                self.initialUpdate && self.initialUpdate(...getArgs());
            },

            _subsequentUpdate = () => {
                const shouldUpdate = self.shouldUpdate && self.shouldUpdate(...getArgs());
                (shouldUpdate === undefined || shouldUpdate) && self.subsequentUpdate && self.subsequentUpdate(...getArgs());
            };

        self.onUpdate = () => {
            !hasMounted ? _initialUpdate() : _subsequentUpdate();
            self.changedProps = [];
            hasMounted = true;
        };

        let length = initAttrs.length;
        while (length--) initAttrs[length](self);
        self.update();
    });

    connected(self => self.mount());

    attrChanged((self, attr, oldValue, newValue) => {
        if (self[IGNORE_ATTR] === attr || oldValue === newValue) return;
        self[attrToProp(attr)] = newValue;
    });

};

export const propToAttr = (prop) => prop.replace(/([A-Z])/g, "-$1").toLowerCase();
export const attrToProp = (attr) => attr.replace(/-(\w)/g, (all, letter) => letter.toUpperCase());

export const updateAttribute = (node, attr, value) => {
    (value === null || value === false || value === 'null' || value === 'false')
        ? node.removeAttribute(attr)
        : node.setAttribute(attr, value);
};

/**
 * for parsing the incoming attributes into consumable props
 * @param value
 * @param type
 * @returns {{error: boolean, value: *}}
 */
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
