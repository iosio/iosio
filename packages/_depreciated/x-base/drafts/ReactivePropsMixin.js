// import {adoptStyles, appendTemplate} from "../src";
//
// const ReactiveProps = (props, Base = HTMLElement) => {
//
//     class ReactivePropsBase extends Base {
//
//         static get observedAttributes() {
//
//             console.log('observed attributes in base', this.hello, this.prototype.hello)
//             // this.prototype.mount = reflectPropsToAttrs(this, {
//             //     navTop: Boolean,
//             //     open: Boolean,
//             //     pad: Boolean
//             // }).mount;
//             //
//             //
//             return ['navTop', 'open', 'pad']
//         }
//
//         connectedCallback() {
//             // super.connectedCallback();
//             console.log('mixin connected');
//             console.log('')
//         }
//         //
//         constructor() {
//             super();
//             this.attachShadow({mode: 'open'});
//             appendTemplate(tag, this, template);
//             adoptStyles(tag, this, styles);
//         }
//         //
//         //  asdf = '123';
//         //
//         //  connectedCallback(){
//         //      this.mount(this);
//         //      console.log('element')
//         //  }
//         //
//         attributeChangedCallback(attr, oldValue, newValue) {
//             console.log('attr changed in mixin', attr, oldValue, newValue);
//             if (oldValue === newValue) return;
//             // else this[attr] = newValue;
//
//         }
//     }
//
//
//     return ReactivePropsBase;
// };