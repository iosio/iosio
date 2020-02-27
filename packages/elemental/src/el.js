export const el = (config = {}) => {
    const {
        tag, shadow,
        beforeInitialUpdate, didMount, onStateChange, didUpdate, willUnmount,
        propTypes, styles, state, refs, events, template, propLogic, render: renderer,
        ...rest
    } = config;

    let inits = [propTypes, styles, template, state, refs, events].filter(Boolean),
        NOOP = () => [];

    class X extends HTMLElement {
        constructor() {
            super();
            shadow && this.attachShadow({mode: 'open'});

            let initial = 1, getArgs = () => [this.props, this.prevProps, this.changedProps],
                [init = NOOP, subsequent = NOOP] = (propLogic || NOOP)(this),
                render = renderer ? renderer(this) : NOOP,
                initialUpdate = () => {
                    this.beforeInitialUpdate(...getArgs()), render();
                    this.unmount = this.didMount(...getArgs()) || NOOP, init();
                }, subSequentUpdate = () => (render(), this.didUpdate(...getArgs()), subsequent());

            Object.assign(this, {
                ...rest,
                unsubs: [],
                hasRenderer: !!render,
                beforeInitialUpdate: beforeInitialUpdate || NOOP,
                didMount: didMount || NOOP,
                onStateChange: onStateChange || this.update,
                didUpdate: didUpdate || NOOP,
                willUnmount: willUnmount || NOOP,
                mounted: new Promise(mount => (this.mount = mount)),
                update: () => !this.processing && (this.processing = this.mounted.then(_ => {
                    initial-- ? initialUpdate() : subSequentUpdate();
                    this.changedProps = [];
                    this.processing = false;
                }), this.processing),
            });

            for (let i = 0; i < inits.length; i++) inits[i] && inits[i](this);
            this.update();
        }

        connectedCallback() {
            if (this.isMounted) return;
            this.isMounted = true;
            this.mount();
        }

        disconnectedCallback(un) {
            if (this.isConnected) return;
            this.unmount(), this.willUnmount(), un = this.unsubs;
            for (let i = un.length; i--;) un[i] && un[i]();
        }
    }

    propTypes && propTypes(X, true);
    X.define = () => (customElements.define(tag, X), X);
    return X;
};
/*
let Box = element({
    tag: 'x-box',
    shadow: true,
    styles: Styles(jcss`
        :host {
            display: block;
            background: cadetblue;
        }
    `),
    propTypes: PropTypes({
        hello: {
            type: String,
            reflect: true,
            value: 'yoyo'
        }
    }),
    render: Render((props, state, host) => (
        <Fragment>
            well hello {props.hello}
        </Fragment>
    ))
}).define();
*/
