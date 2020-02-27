import {obi} from "@iosio/obi";
import {isObj, isFunc} from "@iosio/util";

export const reactiveState = base => {
    return class extends base {
        connectedCallback() {
            if (isObj(this.state)) {
                this.state = obi(this.state);
                this.__unsubStateChange = this.state.$onChange(
                    isFunc(this.onStateChange) ? this.onStateChange : () => {
                        this.stateChanged = true;
                        this.update && this.update()
                    });
            }
            super.connectedCallback && super.connectedCallback();
        }

        disconnectedCallback() {
            if (this.isConnected) return;
            if (super.disconnectedCallback) super.disconnectedCallback();
            if (this.__unsubStateChange) this.__unsubStateChange();
        }
    }
};