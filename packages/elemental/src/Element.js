import {styles as adoptStyles} from "./styles";
import {template as appendTemplate} from "./template";

export class Element extends HTMLElement {
    constructor() {
        super();
        const {styles, shadow, template} = this.constructor;
        shadow && this.attachShadow({mode: 'open'});
        this.mounted = new Promise(mount => (this.mount = mount));
        this.mounted.then(this.didMount);
        styles && adoptStyles(styles)(this);
        template && appendTemplate(template)(this);
    }

    connectedCallback() {
        if (this.isMounted) return;
        this.isMounted = true;
        this.mount();
    }

    disconnectedCallback() {
        if (this.isConnected) return;
        this.willUnmount()
    }

    didMount() {
    }

    willUnmount() {
    }
}