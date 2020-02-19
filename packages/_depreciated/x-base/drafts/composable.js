// // const derp = x('x-derp',
//
//
// import {def, Subie} from "@iosio/util";
//
// import {appendTemplate, attrToProp, createRefsFromIDs, formatType, propToAttr, updateAttribute} from "../src";
//
// const composite = (tag, composer) => {
//
//
//     const observedAttrs = Subie();
//     const construct = Subie();
//     const connect = Subie();
//     const attrChange = Subie();
//     const disconnect = Subie();
//
//     let unsubs = [];
//
//     const observed = [];
//
//     class Base extends HTMLElement {
//         static get observedAttributes() {
//             observedAttrs.notify(this, observed);
//             return observed;
//         }
//
//         constructor() {
//             super();
//             construct.notify(this);
//         }
//
//         connectedCallback() {
//             connect.notify(this);
//             this.hasMounted = true;
//         }
//
//         attributeChangedCallback(attr, old, _new) {
//             attrChange.notify(attr, old, _new, this);
//         }
//
//         disconnectedCallback() {
//             if (this.isConnected) return;
//             disconnect.notify(this);
//             unsubs.forEach(sub => sub.unsub());
//         }
//
//     }
//
//     const component = {
//         tag,
//         Base,
//         observedAttrs: (fn) => unsubs.push(observedAttrs.sub((self, oa) => {
//             observed.concat(fn(self, oa));
//         })),
//         construct: (fn) => unsubs.push(construct.sub(fn)),
//         connect: (fn) => unsubs.push(connect.sub(fn)),
//         attrChange: (fn) => unsubs.push(attrChange.sub(fn)),
//         disconnect: (fn) => unsubs.push(disconnect.sub(fn)),
//     };
//
//     const compose = (...args) => args.reduce((acc, cur) => cur(acc), component);
//
//     composer(component, compose);
//
//     customElements.define(tag, Base);
//
//     return Base;
// };
//
//
// const shadowTemplate = (template) => {
//     return (comp) => {
//         const {construct, tag} = comp;
//         comp.shadow = true;
//         construct((self) => {
//             !self.shadowRoot && self.attachShadow({mode: 'open'});
//             appendTemplate(tag, self, template);
//         });
//         return comp;
//     }
// };
// export const createReactiveProps = () => {
//     const IGNORE_ATTR = Symbol();
//     return {
//         construct: (self) => {
//             let {initAttrs} = self.constructor;
//             self.prevProps = {};
//             self.props = {};
//             self.mounted = new Promise(mount => (self._mount = mount));
//             self.update = () => {
//                 if (!self.processing) self.processing = self.mounted.then(_ => {
//                     !self.hasMounted
//                         ? (self.didMount(self.props, self.prevProps), self.hasMounted = true )
//                         : self.didUpdate(self.props, self.prevProps);
//                     self.processing = false;
//                 });
//                 return self.processing;
//             };
//             let length = initAttrs.length;
//             while (length--) initAttrs[length](self);
//             self.update();
//         },
//         observedAttrs: (self, existingAttrs = []) => {
//
//             let {prototype} = self;
//
//             self.initAttrs = [];
//
//             if (!propTypes) return [];
//
//             return Object.keys(propTypes).map(prop => {
//
//                 let attr = propToAttr(prop);
//
//                 let schema = propTypes[prop].name ? {type: propTypes[prop]} : propTypes[prop];
//
//                 if (!(prop in prototype)) {
//                     def(prototype, prop, {
//                         get() {
//                             return this.props[prop]
//                         },
//                         set(nextValue) {
//                             let {value, error} = formatType(nextValue, schema.type);
//                             if (error && value != null) console.error(`[${prop}] must be type [${schema.type.name}]`);
//                             if (value === this.props[prop]) return;
//                             if (schema.reflect) {
//                                 this.mounted.then(() => {
//                                     this[IGNORE_ATTR] = attr;
//                                     updateAttribute(
//                                         this,
//                                         attr,
//                                         schema.type === Boolean && !value
//                                             ? null
//                                             : value
//                                     );
//                                     this[IGNORE_ATTR] = false;
//                                 });
//                             }
//                             this.prevProps[prop] = this.props[prop];
//                             this.props[prop] = value;
//                             this.update();
//                         }
//                     });
//                 }
//                 schema.value && self.initAttrs.push(self => (self[prop] = schema.value));
//                 return attr;
//             });
//         },
//         connect:(self) => {
//             if (!self.hasMounted) self._mount();
//         },
//         attrChange:(attr, oldValue, newValue, self) => {
//             if (self[IGNORE_ATTR] === attr || oldValue === newValue) return;
//             self[attrToProp(attr)] = newValue;
//         }
//     }
// };
//
//
// const reactiveProps = (propTypes, onUpdate) => {
//
//     return (comp) => {
//         const {observedAttrs, construct, connect, attrChange} = comp;
//
//
//         construct();
//
//         attrChange();
//
//         observedAttrs();
//
//         connect();
//
//         return comp;
//     }
// };
//
// const idRefs = (ids) => {
//
//     return (comp) => {
//         const {shadow, construct, connect} = comp;
//         const makeRefs = (self) => {
//             self.refs = createRefsFromIDs(self, ids);
//         };
//         shadow ? construct(makeRefs) : connect(makeRefs);
//         return comp;
//     }
// };
//
//
// export const DerpElement = composite('x-derp', (component, compose) => {
//
//     const propTypes = {
//         hello: String,
//         topNav: {
//             type: Boolean,
//             reflect: true,
//         }
//     };
//
//     let refs = ['btn', 'wrapper'];
//
//     const onUpdate = (self) => {
//         console.log('updated!!!!', self.refs)
//     };
//
//
//     let temp = html`
//         <div id="wrapper">
//             hello Derp
//             <x-btn id="btn">
//                 click me!!!
//             </x-btn>
//         </div>
//     `;
//
//     compose(
//         shadowTemplate(temp),
//         reactiveProps(propTypes, onUpdate),
//         idRefs(refs)
//     );
//
//
// });
//
