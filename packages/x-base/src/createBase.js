import {
    formatType,
    updateAttribute,
    propToAttr,
    attrToProp,
    TEST_ENV,

    globalStyleTagCache,
    CONSTRUCTABLE_STYLE_SHEETS_AVAILABLE, headStyleTag,

} from "./utils";

import {isArray, raf, CSSTextToObj, def, isFunc, objectIsEmpty, extend} from "@iosio/util";


export const createBase = ({h, render, setProperty}) => {
    console.log('creating x-base')

    let PROPS = 'props',
        IGNORE_ATTR = Symbol(),
        DEFAULT_SHADOWROOT_HOST_CSS_RESETS = `:host, *, *::before, *::after {box-sizing: border-box;} `,
        context = {};

    const getShadowParent = element => {
        while (element.parentNode && (element = element.parentNode)) {
            if (element instanceof ShadowRoot) return element;
        }
        return document;
    };


    const provide = (namespace, attach) => context[namespace] = attach;


    const globalStyles = headStyleTag();


    /* lots of inspiration from atomico, stencil, and preact*/
    class Element extends HTMLElement {
        context = context;
        unsubs = [];
        state = {};
        observe = null;

        constructor() {
            super();
            // the statically set fields from the class that extends this
            let {initAttrs, shadow, rootSheet, noRerender, tag} = this.constructor;

            let root = !shadow ? this : this.attachShadow({mode: shadow === true ? 'open' : shadow});

            this[PROPS] = {};

            this.render = this.render.bind(this);

            // store a pending promise to mounted.
            // Promise is resolved in connectedCallback when mount is called
            this.mounted = new Promise(mount => (this._mount = mount));

            /*
             * adopts style sheets to the shadowRoot or the document
             * @param sheets {array|CSSStyleSheet}
             * @returns {string}
             */
            const adoptSheets = (sheets, getCombined) => {
                let adopter = shadow ? root : getShadowParent(this);
                let combinedCSSTextIfNotAdoptable = '',
                    constructable = customArrayOrSheet => {
                        let sheet = isArray(customArrayOrSheet) ? customArrayOrSheet[0] : customArrayOrSheet;
                        if (sheet && !([].concat(adopter.adoptedStyleSheets).includes(sheet))) {
                            adopter.adoptedStyleSheets = [...adopter.adoptedStyleSheets, sheet];
                        }
                    },
                    combinedText = customArrayOrSheet => {
                        if (isArray(customArrayOrSheet) && customArrayOrSheet[1]) {
                            combinedCSSTextIfNotAdoptable = combinedCSSTextIfNotAdoptable + customArrayOrSheet[1]
                        }
                    };
                let adopt = CONSTRUCTABLE_STYLE_SHEETS_AVAILABLE && !getCombined ? constructable : combinedText;
                [].concat(sheets).forEach(adopt);
                return combinedCSSTextIfNotAdoptable
            };

            let combinedCSSText = '', cssOncePerRenderVerify = 0, renderStyle = false;
            /**
             * optionally use constructable style sheets with fall backs if not supported
             * @param css {string} - css text
             * @param noResets {boolean} - exclude the default box-sizing reset on the :host
             * @param globalFallback {boolean} - if no constructableStylesheets then optionally allow a style tag in the head of the document instead of a style tag
             * @param useStyleTag {boolean} - use a style tag even if constructableStylesheets
             * @param styleSheets {array} - an array of style sheets made with createStyleSheet
             * @param children - child vNodes
             * @returns {*}
             */
            const CSS = ({css, noResets, globalFallback, useStyleTag, styleSheets, children}) => {
                if (cssOncePerRenderVerify > 0) {
                    // console.error('<CSS/> should only be used once. Use a style tag to include additional styles.');
                    return null;
                }
                cssOncePerRenderVerify++;
                // dip out if we've got our static non changing styles already..
                if (renderStyle !== false) return renderStyle;
                let cssText = css || children || '';
                // if using shadow then include the resets by default if noResets is not explicitly set to true.
                if (!noResets && shadow) cssText = DEFAULT_SHADOWROOT_HOST_CSS_RESETS + cssText;

                if (CONSTRUCTABLE_STYLE_SHEETS_AVAILABLE && !useStyleTag) {
                    adoptSheets(rootSheet);
                    rootSheet.cssRules.length === 0 && rootSheet.replaceSync(cssText);
                    styleSheets && adoptSheets(styleSheets);
                    renderStyle = null;
                } else {
                    combinedCSSText = cssText + adoptSheets(rootSheet, true) + (styleSheets ? adoptSheets(styleSheets, true) : '');

                    if (globalFallback && !globalStyleTagCache[tag]) {
                        globalStyleTagCache[tag] = true;
                        globalStyles(combinedCSSText);
                        renderStyle = null;
                    } else renderStyle = h('style', {}, combinedCSSText);
                }
                return renderStyle;
            };


            let lastSelfHostPropsEmpty;
            const Host = ({children, ...selfProps}) => {
                //can skip patching the host props during the first render if no props are provided
                if (!this.hasMounted && objectIsEmpty(selfProps)) return (lastSelfHostPropsEmpty = true, children);
                if (lastSelfHostPropsEmpty && objectIsEmpty(selfProps)) return children;
                lastSelfHostPropsEmpty = false;
                // convert the attributes from this element into props format
                let hostNodeProps = {}, i, a = this.attributes;
                for (i = a.length; i--;) hostNodeProps[a[i].name] = a[i].value;
                //apply host vnode props on 'this', merge in and potentially override individual properties that exist
                for (let i in selfProps) setProperty(this, i, selfProps[i], hostNodeProps[i], false);
                return children;
            };

            this.setState = nextState => {
                this.state = {...this.state, ...(isFunc(nextState) ? nextState(this.state) : (nextState || {}))};
                return this.update();//can call .then(...)
            };

            this.observeObi = obis =>
                [].concat(obis).forEach(obi =>
                    obi.$onChange && this.unsubs.push(obi.$onChange(this.update)));

            const renderArgs = () => {
                // if watching the style property, convert the style string ('width:100%;') into an object ({width: '100%'})
                if (this._observesStyle) this[PROPS].style = CSSTextToObj(this.style.cssText);
                return [
                    extend({Host, CSS, host: this}, this[PROPS]),
                    this.state,
                    this.context
                ];
            };

            const initialRenderer = () => {
                let next = renderArgs();
                this.willMount(...next);
                this.willRender(...next);
                render(this.render(...next), root);
                cssOncePerRenderVerify = 0;
                let postInitial = () => {
                    this.unsubs.push(this.lifeCycle(...next)); // optionally return subscriptions to unsub on detach
                    this.didRender(...next);
                    this.didMount(...next);
                };
                this.hasMounted = true;
                // Removing this functionality during testing makes life easier.
                !TEST_ENV ? raf(postInitial) : postInitial();
            };

            const subsequentRenderer = () => {
                let next = renderArgs();
                let shouldRerender = this.willRender(...next); //
                this.willUpdate(...next);
                if (this.shouldUpdate) shouldRerender = this.shouldUpdate(...next);
                // returning a falsy value other than undefined will prevent rerender
                if (noRerender || (!shouldRerender && (shouldRerender !== undefined))) return;
                render(this.render(...next), root);
                cssOncePerRenderVerify = 0;
                this.didUpdate(...next);
                this.didRender(...next);
            };

            this.update = () => {
                if (!this.processing) this.processing = this.mounted.then(_ => {
                    !this.hasMounted ? initialRenderer() : subsequentRenderer();
                    this.processing = false;
                });
                return this.processing;
            };

            this.emit = (name, detail, from, options) => (from || this).dispatchEvent(
                new CustomEvent(name, {detail, bubbles: true, composed: true, ...options})
            );

            this.destroy = () => {
                this.willUnmount();
                render(null, root);
                this.unsubs.forEach(fn => isFunc(fn) && fn());
            };

            let length = initAttrs.length;
            while (length--) initAttrs[length](this);
            this.update();
        }

        connectedCallback() {
            // connected callback may be called inadvertently, so check this.
            if (this.hasMounted) return;
            this.observe && this.observeObi(this.observe);
            // resolve the pending promise that was set to this.mounted.
            this._mount();
        }

        disconnectedCallback() {
            // web components may inadvertently call this, so check if its connected before calling destroy.
            // can happen if the node is being moved ex:  parent.insertBefore(node, targetNode).
            if (this.isConnected) return;
            this.destroy();
        }

        attributeChangedCallback(attr, oldValue, newValue) {
            // if we are setting our own attribute that we are tracking, then ignore this update.
            if (this[IGNORE_ATTR] === attr || oldValue === newValue) return;
            // opt-in notify for styles
            if (attr === 'style' && this._observesStyle) this.update();
            // else convert kabob-case to camelCase
            else this[attrToProp(attr)] = newValue;
        }

        /*  -- a little recap on prototype --
            When a constructor (a.k.a. pseudo classical inheritance) function is built,
            the newly created objects inherit the prototype properties of the constructor function
            and that’s the critical feature of constructors. They (constructor functions)
            are built for the initialization of newly created objects.*/

        /*  let the prototype know what attributes to observe
            called while constructing the class / creating the prototype. */
        static get observedAttributes() {
            let {
                propTypes, // get the statically set propTypes.
                prototype // prototype - the soon to be - newly instantiated class.
            } = this; // 'this' will references the constructor when used inside static methods.

            this.initAttrs = [];

            if (!propTypes) return [];
            /* inspired by atomico  */
            let observedAttr = Object.keys(propTypes).map(prop => {
                let attr = propToAttr(prop);// convert the camelCase to kabob-case.
                let schema = propTypes[prop].name ? {type: propTypes[prop]} : propTypes[prop];
                //dynamically build the setters and getters for the prototype during the construction phase.
                if (!(prop in prototype)) { // ignores properties that exist, like style and className
                    // def = (obj, prop, handlers) => Object.defineProperty(obj, prop, handlers),
                    def(prototype, prop, {
                        // keep an internal reference to the observed properties on this.props.
                        // provide an access getter.
                        get() {// <--- since this is not a lexical scope function aka () => { };
                            // then 'this' (in this scope) will reference the prototype.
                            return this[PROPS][prop]
                        },
                        // react to updates when the value is set on the instance.
                        set(nextValue) {
                            // format the incoming value into the type that it is defined in on the propTypes object
                            // ex: if its an Object, then JSON.parse the value
                            let {value, error} = formatType(nextValue, schema.type);
                            if (error && value != null) console.error(`[${prop}] must be type [${schema.type.name}]`);
                            // if the value is the same, then dip out.
                            if (value === this[PROPS][prop]) return;
                            // if the value is meant to be reflected
                            // then set it as an attribute
                            if (schema.reflect) { // several sequential updates are deferred/debounced with the pending promise
                                this.mounted.then(() => { // and are only set after the component has finished constructing.
                                    // setting IGNORE_ATTR ignores attribute during attributeChangedCallback
                                    // because we handle our own update.
                                    this[IGNORE_ATTR] = attr;
                                    //either set or remove the attribute.
                                    updateAttribute(
                                        this,
                                        attr,
                                        schema.type === Boolean && !value
                                            ? null
                                            : value
                                    );
                                    this[IGNORE_ATTR] = false;
                                });
                            }
                            this[PROPS][prop] = value;
                            this.update();
                        }
                    });
                }
                // prime the default attributes if the propTypes schema has default value.
                // will initialize in the constructor of the prototype.
                schema.value && this.initAttrs.push(self => (self[prop] = schema.value));
                return attr;
            });
            // let the prototype know to listen for style changes here since ('style' in prototype) is true
            // and since we want more control over how the style is updated ex: {...userStyles, ...ourStyles}
            this.prototype._observesStyle = observedAttr.includes('style');
            return observedAttr;
        };

        willMount() { // called once before render
        }

        willRender() { // called before every render, optionally return false to prevent any further re-rendering
            // will still render one time
            // return false; // but no more rendering!
        }

        render() {
        }

        didRender() { // called after every render
        }

        willUpdate() { // called before every render besides the first
        }

        didUpdate() { // called after every render besides the first
        }

        didMount() { // called once after first render
        }

        lifeCycle() { // same as didMount but optionally return a callback to be called during willUnmount
            // return ()=> subscription.unsubscribe();
        }

        willUnmount() {
        }

    }


    const x = (tag, element, config = {}) => {

        let rootSheet,
            isElement = element.prototype instanceof Element;

        if (CONSTRUCTABLE_STYLE_SHEETS_AVAILABLE) rootSheet = new CSSStyleSheet();

        if (isElement) {
            element.rootSheet = rootSheet;
            element.tag = tag;
        }

        customElements.define(tag,
            isElement ? element : class extends Element {
                static rootSheet = rootSheet;
                static tag = tag;
                static propTypes = config.propTypes;
                static shadow = config.shadow;
                static noRerender = config.noRerender;
                render = element
            }
        );

        return (props) => h(tag, props);
    };

    let X, XShadow, fn = () => {
    };


    if (!TEST_ENV && !customElements.get('x-x') && !customElements.get('x-shadow')) {
        X = x('x-x', fn);
        XShadow = x('x-shadow', fn, {shadow: true});
    }

    return {
        x,
        X,
        XShadow,
        Element,
        provide
    }
};


/*
------using static template and css


  if (tagTemplateCache[tag]) {
                    root.appendChild(tagTemplateCache[tag].content.cloneNode(true))
                }else{

                    if ( !tagTemplateCache[tag]) {
                        template.innerHTML = root.innerHTML;
                        tagTemplateCache[tag] = template;
                    }
                }



        let base, noRenderResults, staticTemplate;
        const initialRenderer = () => {
            let next = renderArgs();
            this.willMount(...next);
            this.willRender(...next);

            if (isObj(this.render)) {
                staticTemplate = true;


                const {html, css} = this.render;
                // template
                if (!tagTemplateCache[tag]) {
                    if (html) template.innerHTML = html;
                    tagTemplateCache[tag] = template;
                }
                if (css) {
                    if (CONSTRUCTABLE_STYLE_SHEETS_AVAILABLE) {
                        // console.log('constructable style sheets av', css)
                        adoptSheets([rootSheet]);
                        if (rootSheet.cssRules.length === 0) {
                            rootSheet.replaceSync(DEFAULT_SHADOWROOT_HOST_CSS_RESETS + css);
                        }

                    }
                }


                root.appendChild(tagTemplateCache[tag].content.cloneNode(true));
            } else if (isFunc(this.render)) {
                let results = this.render(...next);
                if (results) {

                    let mountPoint = createElem(usingVHost ? 'template' : results.name);
                    appendChild(root, mountPoint);
                    base = patch(usingVHost && shadow ? root : mountPoint, results);

                } else noRenderResults = true;
            }

            let postInitial = () => {
                this.unsubs.push(this.lifeCycle()); // optionally return subscriptions to unsub on detach
                // adding visibility inherit next tick after render will prevent flash of un-styled content. (inspired by stencil.js)
                // Removing this functionality during testing makes life easier.
                // !TEST_ENV && updateAttribute(this, COMPONENT_MOUNTED_ATTRIBUTE, '');
                this.didRender(...next);
                this.didMount(...next);
            };
            this.hasMounted = true;
            // !TEST_ENV ? raf(postInitial) :
            postInitial();
        };
 */
/*



    abstraction for sharing events on the window

    const Events = ()=>{
        window.addEventListener('dataChange', notifySubs)
        ...
        return{
            emit,
            on,
            off,
        }
    }


    events.emit('dataChange', 'namespace', {loggedIn: true })

    events.on('dataChange', 'namespace', ({loggedIn})=>{
        //do something
    });

 */


/*
    constructor() {
        super()


        // this._observer = new MutationObserver(this._onMutation);
    }


    _onMutation = mutationsList => {
        const newProps = mutationsList.reduce((props, mutation) => {
            if (mutation.type === "attributes") {
                const propKey = mutation.attributeName;
                props[propKey] = this.getAttribute(propKey);
            }
            return props;
        }, {});
        // console.log('childlist mutated', mutationsList)
        // console.log(newProps)
        // this.update();
        // this.setProps(newProps);
    };

    _startObserver = () => {


        // this._observer.observe(this, {attributes: true});
    };

       const handler = {
            set(target, key, value) {
                console.log(`Setting value ${key} as ${value}`)
                target[key] = value;
            },
        };

        this.styles = new Proxy(this.style, handler);
 */

// if ( usingVHost && shadow) {
//
//     // let mountPoint = createElem(usingVHost ? 'template');
//     // usingVHost &&
//
//     appendChild(template.content, createElem('template'));
//
//     console.log('using vhost', !!usingVHost);
//     console.log('using shadow', !!shadow);
//     console.log('tmp', template);
//     console.log('tmp content', template.content);
//     // if using vHost and shadowDom then patch the root, else patch the mount point
//
//     // console.log(template.content.firstChild)
//     //usingVHost && shadow ? template.content :
//
//     base = patch(template.content, results);
//
//     // base = patch(usingVHost && shadow ? template.content : template.content.firstChild, results);
//
//     root.appendChild(template.content.cloneNode(true));
//
//     console.log(root.innerHTML);
//     console.log('------------');
//
//
// }
// else if ( usingVHost) {
//
//     // let mountPoint = createElem(usingVHost ? 'template');
//     // usingVHost &&
//
//     appendChild(template.content, createElem('template'));
//
//     console.log('using vhost', !!usingVHost);
//     console.log('using shadow', !!shadow);
//     console.log('tmp', template);
//     console.log('tmp content', template.content);
//     // if using vHost and shadowDom then patch the root, else patch the mount point
//
//     // console.log(template.content.firstChild)
//     //usingVHost && shadow ? template.content :
//
//     base = patch(template.content.firstChild, results);
//
//
//     // base = patch(usingVHost && shadow ? template.content : template.content.firstChild, results);
//
//     root.appendChild(template.content.cloneNode(true));
//
//     console.log(root.innerHTML);
//     console.log('------------');
//
//
// }else{
//     // let mountPoint = createElem(usingVHost ? 'template');
//     // usingVHost &&
//
//     appendChild(template.content, createElem(results.name));
//
//     console.log('using vhost', !!usingVHost);
//     console.log('using shadow', !!shadow);
//     console.log('tmp', template);
//     console.log('tmp content', template.content);
//     // if using vHost and shadowDom then patch the root, else patch the mount point
//
//     // console.log(template.content.firstChild)
//     //usingVHost && shadow ? template.content :
//
//     base = patch(template.content.firstChild, results);
//
//
//     // base = patch(usingVHost && shadow ? template.content : template.content.firstChild, results);
//
//     root.appendChild(template.content.cloneNode(true));
//
//     console.log(root.innerHTML);
//     console.log('------------');
//
// }


// --------------- OG ---
// import {
//     formatType,
//     updateAttribute,
//     propToAttr,
//     attrToProp,
//     createElem,
//     appendChild,
//     TEST_ENV,
//     def, extend, isFunc, isObj, objectIsEmpty,
//     globalStyles,
//     raf,
//     isArray,
//     CSSTextToObj,
//     globalStyleTagCache,
//     CONSTRUCTABLE_STYLE_SHEETS_AVAILABLE
// } from "./utils";
//
//
// import {
//     h,
//     patch,
//     removeHandlers,
//     HOST_TYPE,
//     patchProperty,
// } from "./vdom";
//
//
// // PROPS = Symbol(),
// let PROPS = 'props',
//     IGNORE_ATTR = Symbol(),
//     DEFAULT_SHADOWROOT_HOST_CSS_RESETS = `:host, *, *::before, *::after {box-sizing: border-box;} `,
//     context = {};
//
// export const provide = (namespace, attach) => context[namespace] = attach;
//
//
//
// const getShadowParent = element => {
//     while (element.parentNode && (element = element.parentNode)) {
//         if (element instanceof ShadowRoot) {
//             return element;
//         }
//     }
//     return document;
// };
//
// /* lots of inspiration from superfine, atomico, stencil, and preact*/
// export class Element extends HTMLElement {
//
//     context = context;
//
//     unsubs = [];
//
//     state = {};
//
//     constructor() {
//         super();
//         // the statically set fields from the class that extends this
//         let {initAttrs, shadow, rootSheet, noRerender, tag} = this.constructor;
//
//         let root = !shadow ? this : this.attachShadow({mode: ['open', 'closed'].includes(shadow) ? shadow : 'open'});
//
//         this[PROPS] = {};
//
//         this.render = this.render.bind(this);
//
//         // store a pending promise to mounted.
//         // Promise is resolved in connectedCallback when mount is called
//         this.mounted = new Promise(mount => (this._mount = mount));
//
//         /*
//          * adopts style sheets to the shadowRoot or the document
//          * @param sheets {array|CSSStyleSheet}
//          * @returns {string}
//          */
//         const adoptSheets = sheets => {
//             let adopter = shadow ? root : getShadowParent(this);
//
//             let combinedCSSTextIfNotAdoptable = '';
//
//             sheets.forEach(customArrayOrSheet => {
//                 if (CONSTRUCTABLE_STYLE_SHEETS_AVAILABLE) {
//                     // check if the style sheet was created with createStyleSheet()
//                     let sheet = isArray(customArrayOrSheet) ? customArrayOrSheet[0] : customArrayOrSheet;
//                     if (sheet && !([].concat(adopter.adoptedStyleSheets).includes(sheet))) {
//                         adopter.adoptedStyleSheets = [...adopter.adoptedStyleSheets, sheet];
//                     }
//                 } else if (isArray(customArrayOrSheet) && customArrayOrSheet[1]) {
//                     combinedCSSTextIfNotAdoptable = combinedCSSTextIfNotAdoptable + customArrayOrSheet[1]
//                 }
//             });
//             return combinedCSSTextIfNotAdoptable
//         };
//
//         let hasAdoptedExternalSheets = false, combinedCSSTextIfNotAdoptable = '';
//         /**
//          * optionally use constructable style sheets with fall backs if not supported
//          * @param css {string} - css text
//          * @param noResets {boolean} - exclude the default box-sizing reset on the :host
//          * @param globalFallback {boolean} - if no constructableStylesheets then optionally allow a style tag in the head of the document instead of a style tag
//          * @param useStyleTag {boolean} - use a style tag even if constructableStylesheets
//          * @param styleSheets {array} - an array of style sheets made with createStyleSheet
//          * @param children - child vNodes
//          * @returns {*}
//          */
//         const CSS = ({css, noResets, globalFallback, useStyleTag, styleSheets}, children) => {
//             if (CONSTRUCTABLE_STYLE_SHEETS_AVAILABLE) adoptSheets([rootSheet]);
//             // get the cssText from the props or the first child vNode.
//             let cssText = css || isObj(children[0]) && children[0].name || '';
//             // if using shadow then include the resets by default if noResets is not explicitly set to true.
//             if (!noResets && shadow) cssText = DEFAULT_SHADOWROOT_HOST_CSS_RESETS + cssText;
//
//             // adopt the external styleSheets only once.
//             if (!hasAdoptedExternalSheets && isArray(styleSheets)) {
//                 combinedCSSTextIfNotAdoptable = adoptSheets(styleSheets);
//                 hasAdoptedExternalSheets = true;
//             }
//             // if no constructableStylesheets and opting-in to a style tag in the head of the document
//             // and the styles have not already been placed (checking globalStyleTagCache),
//             // then set them only once
//             if (!CONSTRUCTABLE_STYLE_SHEETS_AVAILABLE && globalFallback && !globalStyleTagCache[tag]) {
//                 globalStyleTagCache[tag] = true;
//                 globalStyles(cssText + combinedCSSTextIfNotAdoptable);
//                 return null;
//             } else if (!CONSTRUCTABLE_STYLE_SHEETS_AVAILABLE || useStyleTag) { // fallback to a style tag or opt-in
//                 return <style>{cssText + combinedCSSTextIfNotAdoptable}</style>;
//             } else if (rootSheet.cssRules.length === 0) { // apply the cssText
//                 rootSheet.replaceSync(cssText);
//                 return null
//             }
//             return null;
//         };
//
//         let usingVHost, lastSelfHostPropsEmpty;
//
//         const Host = (selfProps, children) => {
//             usingVHost = true; // let the renderers know that we are using a vHost node
//             let kids = h(HOST_TYPE, {}, children);
//             //can skip patching the host props during the first render if no props are provided
//             if (!this.hasMounted && objectIsEmpty(selfProps)) return (lastSelfHostPropsEmpty = true, kids);
//             if (lastSelfHostPropsEmpty && objectIsEmpty(selfProps)) return kids;
//             lastSelfHostPropsEmpty = false;
//             // convert the attributes from this element into props format
//             let hostNodeProps = {}, i = 0, a = this.attributes;
//             for (i = a.length; i--;) {
//                 let attr = a[i].name;
//                 hostNodeProps[attr === 'class' ? 'className' : attr] = a[i].value;
//             }
//             //apply host vnode props on 'this', merge in and potentially override individual properties that exist
//             for (let key in selfProps) patchProperty(this, key, hostNodeProps[key], selfProps[key]);
//             return kids;
//         };
//
//         this.setState = nextState => {
//             extend(this.state, isFunc(nextState) ? nextState(this.state) : nextState || {});
//             return this.update();
//         };
//
//         this.observeObi = obis =>
//             [].concat(obis).forEach(obi =>
//                 obi.$onChange && this.unsubs.push(obi.$onChange(this.update)));
//
//         const renderArgs = () => {
//             // if watching the style property, convert the style string ('width:100%;') into an object ({width: '100%'})
//             if (this._observesStyle) this[PROPS].style = CSSTextToObj(this.style.cssText);
//             return [
//                 extend({Host, CSS, host: this}, this[PROPS]),
//                 this.state,
//                 this.context
//             ];
//         };
//
//         let base, noRenderResults;
//         const initialRenderer = () => {
//             let next = renderArgs();
//             this.willMount(...next);
//             this.willRender(...next);
//             let results = this.render(...next);
//             if (results) {
//                 let mountPoint = createElem(usingVHost ? 'template' : results.name);
//                 appendChild(root, mountPoint);
//                 base = patch(usingVHost && shadow ? root : mountPoint, results);
//             } else noRenderResults = true;
//
//             let postInitial = () => {
//                 this.unsubs.push(this.lifeCycle(...next)); // optionally return subscriptions to unsub on detach
//                 // Removing this functionality during testing makes life easier.
//                 this.didRender(...next);
//                 this.didMount(...next);
//                 this.hasMounted = true;
//             };
//             !TEST_ENV ? raf(postInitial) : postInitial();
//         };
//
//         const subsequentRenderer = () => {
//             let next = renderArgs();
//             let shouldRerender = this.willRender(...next); //
//             this.willUpdate(...next);
//             if (this.shouldUpdate) shouldRerender = this.shouldUpdate(...next);
//             // returning a falsy value other than undefined will prevent rerender
//             if (noRerender || noRenderResults || (!shouldRerender && (shouldRerender !== undefined))) return;
//             patch(usingVHost && shadow ? root : base, this.render(...next));
//             this.didUpdate(...next);
//             this.didRender(...next);
//         };
//
//         this.update = () => {
//             if (!this.processing) this.processing = this.mounted.then(_ => {
//                 !this.hasMounted ? initialRenderer() : subsequentRenderer();
//                 this.processing = false;
//             });
//             return this.processing;
//         };
//
//         this.emit = (name, detail, from, options) => (from || this).dispatchEvent(
//             new CustomEvent(name, extend({detail, bubbles: true, composed: true}, options || {}))
//         );
//
//         let destroyed;
//
//         this.destroy = (dom) => {
//             if (!destroyed) {
//                 dom && removeHandlers(dom);
//                 this.unsubs.forEach(fn => isFunc(fn) && fn());
//                 destroyed = true;
//             }
//         };
//
//         let length = initAttrs.length;
//         while (length--) initAttrs[length](this);
//
//         this.update();
//     }
//
//     connectedCallback() {
//         // connected callback may be called inadvertently, so check this.
//         if (this.hasMounted) return;
//         // if state is using an obi (mini observable object) then push the sub into unsubs
//         this.state.$onChange && this.unsubs.push(this.state.$onChange(this.update));
//         this.observe && this.observeObi(this.observe);
//         // resolve the pending promise that was set to this.mounted.
//         this._mount();
//     }
//
//     disconnectedCallback() {
//         // the component may inadvertently call this, so check if its connected before calling destroy.
//         // can happen if the node is being moved ex:  parent.insertBefore(node, targetNode).
//         if (!this.isConnected) {
//             this.willUnmount();
//             this.destroy();
//         }
//     }
//
//     attributeChangedCallback(attr, oldValue, newValue) {
//         // if we are setting our own attribute that we are tracking, then ignore this update.
//         if (this[IGNORE_ATTR] === attr || oldValue === newValue) return;
//         // opt-in notify for styles
//         if (attr === 'style' && this._observesStyle) this.update();
//         // else convert kabob-case to CamelCase
//         else this[attrToProp(attr)] = newValue;
//     }
//
//     /*  -- a little recap on prototype --
//         When a constructor (a.k.a. pseudo classical inheritance) function is built,
//         the newly created objects inherit the prototype properties of the constructor function
//         and that’s the critical feature of constructors. They (constructor functions)
//         are built for the initialization of newly created objects.*/
//
//     /*  let the prototype know what attributes to observe
//         called while constructing the class / creating the prototype. */
//     static get observedAttributes() {
//         let {
//             propTypes, // get the statically set propTypes.
//             prototype // prototype - the soon to be - newly instantiated class.
//         } = this; // 'this' will references the constructor when used inside static methods.
//         this.initAttrs = [];
//         if (!propTypes) return [];
//         /* inspired by atomico  */
//         let observedAttr = Object.keys(propTypes).map(prop => {
//             let attr = propToAttr(prop);// convert the camelCase to kabob-case.
//             let schema = propTypes[prop].name ? {type: propTypes[prop]} : propTypes[prop];
//             //dynamically build the setters and getters for the prototype during the construction phase.
//             if (!(prop in prototype)) { // ignores properties that exist, like style and className
//                 // def = (obj, prop, handlers) => Object.defineProperty(obj, prop, handlers),
//                 def(prototype, prop, {
//                     // keep an internal reference to the observed properties on this.props.
//                     // provide an access getter.
//                     get() {// <--- since this is not a lexical scope function aka () => { };
//                         // then 'this' (in this scope) will reference the prototype.
//                         return this[PROPS][prop]
//                     },
//                     // react to updates when the value is set on the instance.
//                     set(nextValue) {
//                         // format the incoming value into the type that it is defined in on the propTypes object
//                         // ex: if its an Object, then JSON.parse the value
//                         let {value, error} = formatType(nextValue, schema.type);
//                         if (error && value != null) console.error(`[${prop}] must be type [${schema.type.name}]`);
//                         // if the value is the same, then dip out.
//                         if (value === this[PROPS][prop]) return;
//                         // if the value is meant to be reflected
//                         // then set it as an attribute
//                         if (schema.reflect) { // several sequential updates are deferred/debounced with the pending promise
//                             this.mounted.then(() => { // and are only set after the component has finished constructing.
//                                 // setting IGNORE_ATTR ignores attribute during attributeChangedCallback
//                                 // because we handle our own update.
//                                 this[IGNORE_ATTR] = attr;
//                                 //either set or remove the attribute.
//                                 updateAttribute(
//                                     this,
//                                     attr,
//                                     schema.type === Boolean && !value
//                                         ? null
//                                         : value
//                                     // (!schema.reflect && schema.type === Boolean && value === true) ? '' : value
//                                 );
//                                 this[IGNORE_ATTR] = false;
//                             });
//                         }
//                         this[PROPS][prop] = value;
//                         this.update();
//                     }
//                 });
//             }
//             // prime the default attributes if the propTypes schema has default value.
//             // will initialize in the constructor of the prototype.
//             schema.value && this.initAttrs.push(self => (self[prop] = schema.value));
//             return attr;
//         });
//         // let the prototype know to listen for style changes here since ('style' in prototype) is true
//         // and since we want more control over how the style is updated ex: {...userStyles, ...ourStyles}
//         this.prototype._observesStyle = observedAttr.includes('style');
//         return observedAttr;
//     };
//
//     willMount() { // called once before render
//     }
//
//     willRender() { // called before every render, optionally return false to prevent any further re-rendering
//         // will still render one time
//         // return false; // but no more rendering!
//     }
//
//     render() {
//     }
//
//     didRender() { // called after every render
//     }
//
//     willUpdate() { // called before every render besides the first
//     }
//
//     didUpdate() { // called after every render besides the first
//     }
//
//     didMount() { // called once after first render
//     }
//
//     lifeCycle() { // same as didMount but optionally return a callback to be called during willUnmount
//         // return ()=> subscription.unsubscribe();
//     }
//
//     willUnmount() {
//     }
//
// }
//
//
// export const x = (tag, component, config) => {
//
//     config = config || {};
//
//     let rootSheet,
//         isComponent = component.prototype instanceof Element;
//
//     if (CONSTRUCTABLE_STYLE_SHEETS_AVAILABLE) rootSheet = new CSSStyleSheet();
//
//     if (isComponent) {
//         component.rootSheet = rootSheet;
//         component.tag = tag;
//     }
//
//     customElements.define(tag,
//         isComponent ? component : class extends Element {
//             static rootSheet = rootSheet;
//             static tag = tag;
//             static propTypes = config.propTypes;
//             static shadow = config.shadow;
//             static noRerender = config.noRerender;
//             render = component
//         }
//     );
//
//     return (props, children) => h(tag, props, children);
// };
//
//
