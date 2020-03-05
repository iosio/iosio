import {initializeAttrs, makePropTypes, propTypesAttributeFn} from "./propTypes";
import {obi} from "@iosio/obi";
import {defer} from "./util";

export class Base extends HTMLElement {
    constructor(props) {
        super(props);
        const {shadow} = this.constructor;
        shadow && this.attachShadow({mode: 'open'});
        let initial = true,
            initialUpdate = () => {
                this.beforeInitialUpdate();
                this.initialUpdate()
            },
            subsequentUpdate = () => {
                const shouldUpdate = this.shouldUpdate(...this.getArgs());
                if (shouldUpdate || shouldUpdate === undefined) this.subsequentUpdate()
            };
        this.unsubs = [];
        this.mounted = new Promise(mount => (this.mount = mount));
        this.initalized = new Promise(mount => (this.init = mount));

        this.update = () => {
            if (!this.processing) {
                this.processing = this.mounted.then(_ => {
                    initial ? initialUpdate() : subsequentUpdate();
                    this.changedProps = [];
                    initial = false;
                    this.processing = false;
                })
            }
            return this.processing;
        };

        this.initalized.then(this.mount);

        this.getArgs = () => [this.props, this.prevProps, this.changedProps];
        initializeAttrs(this);
        this.update();
    }


    connectedCallback() {
        if (this.isMounted) return;
        this.isMounted = true;
        if (this.state) {
            this.state = obi(this.state);
            this.unsubs.push(
                this.state.$onChange(() => defer(this.onStateChange))
            );
        }
        this.init();
    }

    attributeChangedCallback(a, o, n) {
        propTypesAttributeFn(a, o, n, this)
    }

    static get observedAttributes() {
        return makePropTypes(this);
    }

    disconnectedCallback(un) {
        if (this.isConnected) return;
        typeof this.unmount === 'function' && this.unmount();
        this.willUnmount();
        un = this.unsubs;
        for (let i = un.length; i--;) un[i] && un[i]();
    }

    onStateChange = () => {
        return this.update();
    };


    beforeInitialUpdate() {
    }

    initialUpdate() {
    }

    shouldUpdate() {
    }

    subsequentUpdate() {
    }

    willUnmount() {
    }
}
