import {renderer} from "./renderer";
import {styles as adoptStyles} from "./styles";
import {state} from "./state";
import {events} from "./events";

export class Component extends Base{
    constructor() {
        super();
        const {styles} = this.constructor;
        this.renderer = this.render ? renderer(this.render)(this) : NOOP;
        styles && adoptStyles(styles)(this);
        state(this.state)(this);
        events()(this);
    }

    initialUpdate() {
        this.beforeInitialUpdate(...this.getArgs());
        this.renderer();
        this.unmount = this.didMount(...this.getArgs()) || NOOP();
        this.logic[0] && this.logic[0]();
    }

    subsequentUpdate() {
        this.renderer();
        this.didUpdate(...this.getArgs());
        this.logic[1] && this.logic[1]();
    }

    beforeInitialUpdate() {
    }

    didMount() {
    }

    onStateChange() {
    }

    didUpdate() {
    }

}