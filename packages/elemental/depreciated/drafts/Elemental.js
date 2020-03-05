import {template as appendTemplate} from "./template";
import {styles as adoptStyles} from "./styles";
import {events} from "./events";
import {refs} from "./refs";
import {Base} from "./Base";
import {NOOP} from "./util";

export class Elemental extends Base {
    constructor() {
        super();
        const {refsOptions} = this.constructor;
        events()(this);
        this.refs = refs(refsOptions)(this);
    }

    beforeInitialUpdate(){
        const {styles, template} = this.constructor;
        styles && adoptStyles(styles)(this);
        template && appendTemplate(template)(this);
    }

    initialUpdate() {
        this.unmount = this.didMount(...this.getArgs()) || NOOP;
        const logic = this.propLogic && this.propLogic(true);
        logic && Object.keys(this.props).forEach(prop => {
            logic[prop] && logic[prop](this.props[prop], this.refs);
        });
    }

    subsequentUpdate() {
        this.didUpdate(...this.getArgs());
        const logic = this.propLogic && this.propLogic();
        logic && this.changedProps.forEach(prop =>
            logic[prop] && logic[prop](this.props[prop], this.refs)
        )
    }

    didMount() {
    }

    onStateChange() {
    }

    didUpdate() {
    }
}

