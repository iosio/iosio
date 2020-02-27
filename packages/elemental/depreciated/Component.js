import {reactiveState} from "./reactiveState";
import {reactiveProps} from "./reactiveProps";
import {compose} from "./util";
import {events} from "./events";
import {adoptableStyles} from "./adoptableStyles";
import {d, isArray} from "@iosio/util";
import {Fragment, h, render, mount} from "@iosio/vdom";

export {Fragment, h, render, mount}

const ComposedElement = compose(
    adoptableStyles,
    reactiveState,
    reactiveProps,
    events,
)(class extends HTMLElement {
    constructor() {
        super();
        this.constructor.shadow && this.attachShadow({mode: 'open'});
    }
});

const template = (t => ((t.innerHTML = `<style>:host{display: contents;}</style><slot></slot>`, t)))(d.createElement('template'));

class VRoot extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'}).appendChild(template.content.cloneNode(true));
    }
}

customElements.define('v-root', VRoot);

export class Component extends ComposedElement {
    connectedCallback() {
        this.vroot = document.createElement('v-root');
        (this.shadowRoot || this).appendChild(this.vroot)
        console.log('component connected')
        super.connectedCallback && super.connectedCallback();
    }

    renderer() {
        if (typeof this.render !== 'function') return;
        //(this.shadowRoot || this)
        this.vroot = render(this.vroot, this.render(this.props, this.state));
    }

    render() {
        return null;
    }

    initialUpdate() {
        console.log('initial update')
        this.renderer();
    }

    subsequentUpdate() {
        console.log('subsequent update')
        this.renderer();
    }
}


var propsChanged = function (a, b) {
    for (var k in a) if (a[k] !== b[k]) return true
    for (var k in b) if (a[k] !== b[k]) return true
}

class X extends HTMLElement {
    constructor() {
        super();
        this.mounted = new Promise(mount => (this._mount = mount));
        this.hasMounted = false;
        this._props = {};
        this.unsubs = [];
        this.update();
    }

    set props(newProps) {
        console.log('props set')
        if (propsChanged(newProps, this._props)) {
            console.log('props changed')
            this._props = newProps;
            this.update();
        }
    }

    get props() {
        return this._props;
    }

    set observe(observe) {
        if (observe && observe.$onChange) {
            console.log('is observing')
            this.unsubs.push(observe.$onChange(() => {
                this.update();
            }))
        }
    }

    connectedCallback() {
        if (!this.hasMounted) {
            this.vroot = d.createElement('v-root');
            (this.shadowRoot || this).appendChild(this.vroot);
            this._mount();
        }
    }

    disconnectedCallback() {
        if (!this.isConnected) {
            this.unsubs.forEach(f => f && f())
        }
    }

    update() {
        if (!this.processing) this.processing = this.mounted.then(_ => {
            this.renderer();
            this.processing = false;
        });
        return this.processing;
    }

    render() {
        return null
    };

    renderer() {
        if (typeof this.render !== 'function') return;

        render((this.shadowRoot || this), this.render(this._props));
    }

}

customElements.define('x-', X);





































