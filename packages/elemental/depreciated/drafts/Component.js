import {renderer, render, h, Fragment, createNode, mount} from "./renderer";
import {styles as adoptStyles} from "./styles";
import {state} from "./state";
import {events} from "./events";
import {Base} from "./Base";
import {NOOP} from "./util";

export class Component extends Base {
    constructor() {
        super();
        const {styles} = this.constructor;
        // styles && adoptStyles(styles)(this);
        // events()(this);
        // this.renderer = this.render ? renderer(this.render)(this) : NOOP;
    }

    renderer = () => {
        let results = this.render && this.render(this.props, this.state);
        if (!results) return;
        if (this.fallbackCssString) {
            let style = h('style', {dangerouslySetInnerHTML: {__html: this.fallbackCssString || ''}});
            results = Array.isArray(results) ? (results.unshift(style), results) : [style, results];
        }
        render(this.shadowRoot || this, results);
    };

    initialUpdate = () => {
        console.log('initial update', {...this.state})
        this.renderer();
        this.unmount = this.didMount(...this.getArgs());
    };

    subsequentUpdate() {
        this.renderer();
        this.didUpdate(...this.getArgs());
    }

    didMount() {
    }

    didUpdate() {
    }

}


