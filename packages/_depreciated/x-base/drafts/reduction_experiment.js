// import {eventListener} from "@iosio/util";
// import {appendTemplate, CONSTRUCTABLE_STYLE_SHEETS_AVAILABLE} from "../src";
//
//
// const makeProxyObj = (fallBackGetter) => {
//     return new Proxy({}, {
//         get(target, key) {
//             let prop = target[key];
//             if (target[key]) return target[key];
//             else {
//                 prop = fallBackGetter(key);
//                 target[key] = prop;
//                 return prop;
//             }
//         }
//     });
// };
//
// const IGNORE_ATTR = Symbol();
// let refCount = 0;
// let elementCount = 0;
//
// export class Elemental extends HTMLElement {
//
//     constructor() {
//         super();
//         let {shadow, rootSheet, tag, observedAttributes: oA} = this.constructor;
//         shadow && this.attachShadow({mode: 'open'});
//
//         let root = (this.shadowRoot || this);
//
//         this.mounted = new Promise(mount => (this.mount = mount));
//
//         this.template = this.template.bind(this);
//
//         this.unsubs = [];
//
//         this.refs = makeProxyObj((selector) =>
//             root.querySelectorAll(`[data-ref=${selector}]`)[0]
//         );
//
//         this.onEvent = (event, fn) => {
//             let ref = event + refCount++;
//             this.mounted.then(() => this._unsubs.push(eventListener(this.refs[ref], event, fn)));
//             return `data-ref="${ref}"`;
//         };
//
//         this.props = makeProxyObj((selector) => this.getAttribute(selector));
//
//         // if (oA && oA.length) {
//         //     oA.forEach(attribute => {
//         //         def(this, attribute, {
//         //             get() {
//         //                 return this.getAttribute(attribute);
//         //             },
//         //             set(val) {
//         //                 val ? this.setAttribute(attribute, val) : this.removeAttribute(attribute);
//         //             }
//         //         });
//         //     });
//         // }
//
//         this.updateStyles = () => {
//             let update = document.createTextNode(this.updatableStyles());
//             this._updatingStyleText.replaceWith(update);
//             this._updatingStyleText = update;
//         };
//
//         const initialRender = () => {
//             if (this.updatableStyles) {
//                 let updatingStyleTag = document.createElement('style');
//                 this._updatingStyleText = document.createTextNode(this.updatableStyles());
//                 updatingStyleTag.appendChild(this._updatingStyleText);
//                 root.appendChild(updatingStyleTag);
//             }
//             appendTemplate(tag, this, this.template());
//             this.hasMounted = true;
//             this.didMount();
//         };
//
//         this._update = () => {
//             if (!this.processing) this.processing = this.mounted.then(_ => {
//                 !this.hasMounted ? initialRender() : this.didUpdate();
//                 this.processing = false;
//             });
//             return this.processing;
//         };
//
//         this._update();
//     }
//
//
//     attributeChangedCallback(attr, oldValue, newValue) {
//         // if we are setting our own attribute that we are tracking, then ignore this update.
//         if (oldValue === newValue) return;
//
//         this[attr] = newValue;
//         this.props[attr] = newValue;
//         this._update();
//     }
//
//     static get observedAttributes() {
//         let {props, reflectedProps, prototype} = this;
//
//         if (oA && oA.length) {
//             oA.forEach(attribute => {
//                 Object.defineProperty(this, attribute, {
//                     get() {
//                         return this.getAttribute(attribute);
//                     },
//                     set(val) {
//                         // val ? this.setAttribute(attribute, val) : this.removeAttribute(attribute)
//                         this._update()
//                     }
//                 });
//             });
//         }
//         let observedAttr = [];
//
//         return observedAttr;
//     }
//
//     connectedCallback() {
//         this.mount();
//     }
//
//
//     didMount() {
//     }
//
//     didUpdate() {
//     }
//
//     template() {
//     };
//
// }
//
// const element = (tag, templateFnOrElement, config) => {
//
//     const isElement = templateFnOrElement.prototype instanceof Elemental;
//     let rootSheet;
//
//     if (CONSTRUCTABLE_STYLE_SHEETS_AVAILABLE) rootSheet = new CSSStyleSheet();
//
//     if (isElement) {
//         templateFnOrElement.rootSheet = rootSheet;
//         templateFnOrElement.tag = tag;
//     }
//
//     customElements.define(tag,
//         isElement ? templateFnOrElement : class extends Elemental {
//             static tag = tag;
//             static rootSheet = rootSheet;
//             template = templateFnOrElement
//         }
//     );
// };
//
// const Aspect = element('x-aspect-test',
//     class extends Elemental {
//
//         static shadow = true;
//
//         static props = ['height', 'width'];
//
//
//         updatableStyles() {
//             const {height, width} = this.props;
//             // language=CSS format=true
//             return jcss`
//                 :host {
//                     padding: ${(Number(height) / Number(width)) * 100}% 0 0 0;
//                 }
//             `;
//         }
//
//         didUpdate() {
//             this.updateStyles();
//         }
//
//         didMount() {
//         }
//
//         fixedStyles() {// language=CSS format=true
//             return jcss`
//                 :host {
//                     flex-shrink: 0;
//                     height: 0;
//                     overflow: hidden;
//                     display: block;
//                     position: relative;
//                 }
//
//                 .innerAspect {
//                     position: absolute;
//                     top: 0;
//                     left: 0;
//                     width: 100%;
//                     height: 100%;
//                     max-width: inherit;
//                 }
//             `;
//         }
//
//         template() {
//             return html`
//             <div class="innerAspect">
//                 <slot>
//                 </slot>
//             </div>
//         `;
//         }
//     });
//
//
// const Test = element('x-test', class extends Elemental {
//
//     didMount() {
//     }
//
//     doSomething() {
//         console.log('do something')
//     }
//
//     template() {
//         return html`
//             <div class="hello" data-ref="container"></div>
//             <button ${this.onEvent('click', this.doSomething)}>
//                 click me
//             </button>
//         `;
//     }
// });
//
//
