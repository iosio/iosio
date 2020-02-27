import {template as appendTemplate} from "./template";
import {styles as adoptStyles} from "./styles";
import {events} from "./events";
import {propLogic} from "./propLogic";
import {refs} from "./refs";
import {state} from "./state"

export class Elemental extends Base {
    constructor() {
        super();
        const {styles, template, refOptions} = this.constructor;
        styles && adoptStyles(styles)(this);
        template && appendTemplate(template)(this);
        state(this.state)(this);
        events()(this);
        refs(refOptions)(this);
        this.logic = (this.propLogic ? propLogic(this.propLogic) : NOOP)(this);
    }

    initialUpdate() {
        this.beforeInitialUpdate(...this.getArgs());
        this.unmount = this.didMount(...this.getArgs()) || NOOP();
        this.logic[0] && this.logic[0]();
    }

    subsequentUpdate() {
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

