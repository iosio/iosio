export class ShadowElement extends HTMLElement{
    constructor() {
        super();
        this.attachShadow({mode:'open'});
    }
}