import {styles as adoptStyles} from "./styles";
import {template as appendTemplate} from "./template";

export class Element extends HTMLElement {
    constructor() {
        super();
        const {styles, shadow, template} = this.constructor;
        shadow && this.attachShadow({mode: 'open'});
        this.initialized = new Promise(mount => (this.init = mount));
        this.mounted = new Promise(mount => (this.mount = mount));
        this.mounted.then(this.didMount);
        this.initialized.then(this.mount);
        styles && adoptStyles(styles)(this);
        template && appendTemplate(template)(this);
    }

    connectedCallback() {
        if (this.isMounted) return;
        this.isMounted = true;
        this.init();
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