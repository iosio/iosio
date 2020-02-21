import {eventListener} from "@iosio/util";

export const events = base => class extends base {
    constructor() {
        super();
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
        super.disconnectedCallback && super.disconnectedCallback();
        if (this.isConnected) return;
        this.unsubs.length && this.unsubSubs();
    }
};