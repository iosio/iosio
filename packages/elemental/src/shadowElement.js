export const shadowElement =  (base = HTMLElement) => class extends base {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadow = true;
    }
};