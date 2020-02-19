import {render, Fragment, h, toChildArray} from "@iosio/xact";

export {Fragment, h, toChildArray, render};

export const vdom = (base) => {
    return class extends base {
        renderer() {
            this.render && render(this.render(this.props, this.state), this.shadowRoot || this);
        }

        initialUpdate() {
            this.renderer();
        }

        subsequentUpdate() {
            this.renderer();
        }

        disconnectedCallback() {
            super.disconnectedCallback();
            if (!this.isConnected) {
                this.render && render(null, this.shadowRoot || this);
            }
        }
    }
};