import {initializeAttrs, makePropTypes, propTypesAttributeFn} from "./propTypes";

export class Base extends HTMLElement {
    constructor(props) {
        super(props);
        const {shadow} = this.constructor;
        shadow && this.attachShadow({mode: 'open'});
        let initial = 1;
        Object.assign(this, {
            unsubs: [],
            props: {},
            prevProps: {},
            changedProps: {},
            state: {},
            mounted: new Promise(mount => (this.mount = mount)),
            update: () => !this.processing && (this.processing = this.mounted.then(_ => {
                initial-- ? this.initialUpdate() : this.subsequentUpdate();
                this.changedProps = [];
                this.processing = false;
            }), this.processing),
        });
        this.getArgs = ()=>[this.props, this.prevProps, this.changedProps];
        initializeAttrs(this);
        this.update();
    }

    connectedCallback() {
        if (this.isMounted) return;
        this.isMounted = true;
        this.mount();
    }

    attributeChangedCallback(a, o, n) {
        propTypesAttributeFn(a, o, n)
    }

    static get observedAttributes() {
        return makePropTypes(this);
    }

    disconnectedCallback(un) {
        if (this.isConnected) return;
        this.unmount(), this.willUnmount(), un = this.unsubs;
        for (let i = un.length; i--;) un[i] && un[i]();
    }

    initialUpdate() {
    }

    subsequentUpdate() {
    }

    willUnmount() {
    }

    unmount() {
    }
}
