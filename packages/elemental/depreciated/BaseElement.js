import {eventListener} from "@iosio/util";

export class BaseElement extends HTMLElement {
    constructor() {
        super();
        const {shadow} = this.constructor;
        shadow && this.attachShadow({mode: 'open'});
        this.unsubs = [];
        this.eventListener = (to, ev, cb, opts) => this.unsubs.push(eventListener(to, ev, cb, opts));
        this.emit = (event, detail, opts = {}, from = this) => from.dispatchEvent(new CustomEvent(event, {
            detail: detail,
            bubbles: true,
            composed: true, ...opts
        }));
        this.unsubSubs = () => {
            this.unsubs.forEach(f => f && f());
        }
    }

    disconnectedCallback() {
        if (this.isConnected) return;
        this.willUnmount && this.willUnmount();
        this.unsubs.length && this.unsubSubs();
    }
}