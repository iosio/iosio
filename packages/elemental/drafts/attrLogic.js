import {formatType, propToAttr, updateAttribute} from "./reactiveProps";

export const attrLogic = base => {
    return class extends base {
        constructor() {
            super();
            this._attrs = this.constructor.attrs;
            this.attrs = {};
            this.mounted = new Promise(mount => (this._connect = mount));
            this.changedAttrs = [];
        }

        processAttrs() {
            this._attrs.forEach((a) => {
                if(this.hasAttribute(a)){
                    this.attrs[a] = this.getAttribute(a);
                } else{
                    this.attrs[a] = undefined;
                }
            });

        }

        initialUpdate() {
            if (this.propLogic) {
                const logic = this.propLogic(true);
                Object.keys(this.props).forEach(prop => {
                    logic[prop] && logic[prop](this.props[prop], this.refs);
                });
            }
        }

        subsequentUpdate() {
            if (this.propLogic) {
                const logic = this.propLogic();
                this.changedProps.forEach(prop => logic[prop] && logic[prop](this.props[prop], this.refs))
            }
        }

        update() {
            if (!this.processing) this.processing = this.mounted.then(_ => {
                this.processAttrs();
                this.changedAttrs = [];
                this.processing = false;
            });
            return this.processing;
        }

        connectedCallback() {
            super.connectedCallback && super.connectedCallback();
            this._connect();
        }

        attributeChangedCallback(attr, oldvalue, newvalue) {
            if (oldvalue === newvalue) return;
            this.changedAttrs.push(attr);
            this.update();

        }

        static get observedAttributes() {
            let {attrs} = this;
            if (!attrs) return [];
            return attrs;
        }
    }
};