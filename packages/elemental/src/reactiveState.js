import {obi} from "@iosio/obi";
import {isObj, isFunc} from "@iosio/util";

export const reactiveState = base =>{
    return class extends base {
        connectedCallback() {
            super.connectedCallback && super.connectedCallback();
            if (isObj(this.state)) {
                this.state = obi(this.state);
                const onChange = isFunc(this.onStateChange) ? this.onStateChange : () => {
                    this.stateChanged = true;
                    this.update && this.update().then(() => this.stateChanged = false);
                };
                this.__unsubStateChange = this.state.$onChange(onChange);
            }
        }

        disconnectedCallback() {
            if (super.disconnectedCallback) super.disconnectedCallback();
            if (this.isConnected) return;
            if (this.__unsubStateChange) this.__unsubStateChange();
        }
    }
};