import {h, render, Fragment} from "../src";


customElements.define('my-sweet-component', class extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({mode: 'open'});
    }

    static get observedAttributes() {
        return ['count']
    }


    update = (props) => {
        render(this.render(props), this.root);
    };

    render = ({count}) => {
        return (
            <Fragment>
                <h1>Hello </h1>
                <h1>I update when my count attribute changes</h1>
                <h1>{count}</h1>
            </Fragment>
        )
    };

    connectedCallback() {
        this.update({count: this.getAttribute('count')})
    }

    attributeChangedCallback(attr, oldValue, newValue) {
        if (oldValue === newValue) return;
        this.update({[attr]: newValue})
    }

    disconnectedCallback() {
        if (!this.isConnected) {
            render(null, this.root);
        }
    }

});

const component = document.createElement('my-sweet-component');

document.body.appendChild(component);


let count = 0;
setInterval(() => {
    component.setAttribute('count', count++);
}, 1000);