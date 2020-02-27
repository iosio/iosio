import {eventListener} from "@iosio/util";
export const events = () => self => {
    self.eventListener = (to, ev, cb, opts) =>
        self.unsubs.push(eventListener(to, ev, cb, opts));
    self.emit = (event, detail, opts = {}, from = self) =>
        from.dispatchEvent(new CustomEvent(event, {
            detail: detail,
            bubbles: true,
            composed: true, ...opts
        }));
};
export {eventListener}