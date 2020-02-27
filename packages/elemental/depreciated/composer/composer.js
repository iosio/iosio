import {Subie} from "@iosio/util";


/**
 * COMPOSER - easily create composable web component plugins
 *
 * @param {...Function} callbacks - each arg as a descriptor function
 *
 * @example:
 *      const myDescriptorPlugin = ({observedAttrs, construct, connected, attrChanged, disconnected})=>{
 *          observedAttrs((this,combine,set, attrsList)=>{
 *              combine(['checked'])
 *          })
 *      }
 *
 *      const compose = composer(myDescriptorPlugin, someOtherPlugin)
 *
 * @returns {Function} compose - use as a class mixin or create a class with it
 * @example
 *      const compose = composer(myDescriptorPlugin, someOtherPlugin)
 *      const ComposedElement = compose(HTMLElement);
 *      class Derp extends ComposedElement{}
 */
export const composer = (...callbacks) => {

    let attrsList = [],
        unsubs = [],
        elementCallbacks = [],
        setters = ['observedAttrs', 'construct', 'connected', 'attrChanged', 'disconnected']
            .reduce((acc, curr) => {
                let subie = Subie();
                elementCallbacks.push(subie);
                acc[curr] = cb => unsubs.push(subie.sub(cb));
                return acc;
            }, {});

    callbacks = [].concat(...callbacks);

    for (let i = 0; i < callbacks.length; i++) callbacks[i](setters);

    const [observedAttrs, construct, connected, attrChanged, disconnected] = elementCallbacks;


    return () => {

        const MOUNTED = Symbol(),
            GET_ARGS = Symbol();


        return class extends HTMLElement {

            static get observedAttributes() {
                let set = (list) => attrsList = list, combine = (list) => attrsList = [...attrsList, ...list];
                observedAttrs.subs.length && observedAttrs.notify(this, combine, set, attrsList);
                return attrsList;
            }

            constructor() {
                super();
                const {shadow} = this.constructor;
                this.prevProps = {};
                this.props = {};
                this.changedProps = [];
                shadow && this.attachShadow({mode: 'open'});
                this.mounted = new Promise(mount => (this.mount = mount));


                this.update = () => !this.processing && (this.processing = this.mounted.then(_ => {
                    this.onUpdate && this.onUpdate();
                    this.processing = false;
                }), this.processing);

                let getArgs = () => [this.props, this.prevProps, this.changedProps],

                    _initialUpdate = () => {
                        this.beforeInitialUpdate && this.beforeInitialUpdate(...getArgs());
                        this.initialUpdate && this.initialUpdate(...getArgs());
                    },
                    _subsequentUpdate = () => {
                        const shouldUpdate = this.shouldUpdate && this.shouldUpdate(...getArgs());
                        (shouldUpdate === undefined || shouldUpdate) && this.subsequentUpdate && this.subsequentUpdate(...getArgs());
                    };

                construct.subs.length && construct.notify(this);
            }

            connectedCallback() {
                if (this[MOUNTED]) return;
                this[MOUNTED] = true;
                connected.subs.length && connected.notify(this);
            }

            attributeChangedCallback(attr, oldvalue, newValue) {
                attrChanged.subs.length && attrChanged.notify(this, attr, oldvalue, newValue);
            }

            disconnectedCallback() {
                if (this.isConnected) return; // prevent notifying when an element is just being moved and not removed
                disconnected.subs.length && disconnected.notify(this);
                for (let i = unsubs.length; i--;) unsubs[i] && unsubs[i]();
            }
        }
    };
};
