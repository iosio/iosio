import {Subie} from "@iosio/util";

const createSubs = (...names) => {
    let unsubs = [],
        elementCallbacks = {},
        descriptorCallbacks = names.reduce((acc, curr) => {
            let subie = Subie();
            elementCallbacks[curr] = subie;
            acc[curr] = cb => unsubs.push(subie.sub(cb));
            return acc;
        }, {});
    return [descriptorCallbacks, elementCallbacks, unsubs];
};

/**
 * COMPOSER - easily create composable web component plugins
 *
 * @param {...Function} descriptors - each arg as a descriptor function
 *
 * @example:
 *      const myDescriptorPlugin = ({observedAttrs, construct, connected, attrChanged, disconnected})=>{
 *          observedAttrs((self,combine,set, attrsList)=>{
 *              combine(['checked'])
 *          })
 *      }
 *
 *      const compose = composer(myDescriptorPlugin, someOtherPlugin)
 *
 * @returns {Function} compose - use as a class mixin or create a class
 *
 * @example
 *      const compose = composer(myDescriptorPlugin, someOtherPlugin)
 *      const ComposedElement = compose(HTMLElement);
 *      class Derp extends ComposedElement{}
 */
export const composer = (...descriptors) => {

    let attrsList = [];
    const [sets, callbacks, unsubs] = createSubs(
        'observedAttrs', 'construct', 'connected', 'attrChanged', 'disconnected'
    );

    descriptors.forEach(dis => dis(sets));

    const {observedAttrs, construct, connected, attrChanged, disconnected} = callbacks;

    return (element = HTMLElement) => class extends element {

        static get observedAttributes() {
            let set = (list) => attrsList = list, combine = (list) => attrsList = [...attrsList, ...list];
            observedAttrs.subs.length && observedAttrs.notify(this, combine, set, attrsList);
            return attrsList;
        }

        constructor() {
            super();
            construct.subs.length && construct.notify(this);
        }

        connectedCallback() {
            if (!this.___mounted && connected.subs.length) {
                this.___mounted = true;
                connected.notify(this);
            }
        }

        attributeChangedCallback(attr, oldvalue, newValue) {
            attrChanged.subs.length && attrChanged.notify(this, attr, oldvalue, newValue);
        }

        disconnectedCallback() {
            if (this.isConnected) return; // prevent notifying when an element is just being moved
            disconnected.subs.length && disconnected.notify(this);
            unsubs.forEach(s => s && s());
        }
    };
};


