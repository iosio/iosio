import {obi} from "@iosio/obi";
import {isObj, isFunc} from "@iosio/util";

export const reactiveState = base => class extends base {
    connectedCallback() {
        super.connectedCallback && super.connectedCallback();
        if (isObj(this.state)) {
            this.state = obi(this.state);
            const onChange = isFunc(this.onStateChange) ? this.onStateChange : () => {
                this.stateChanged = true;
                this.update && this.update().then(() => this.stateChanged = false);
            };
            (this.unsubs || (this.unsubs = [])).push(this.state.$onChange(onChange));
        }
    }
};