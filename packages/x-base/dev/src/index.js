import {h, render, Component} from "preact";
// import {h, render} from "@iosio/xact";

import {setProperty} from "@iosio/xact";

import {createBase} from "../../src";


const {x} = createBase({h, render, setProperty});

const App = x('test-element', ({Host, CSS, host, derp }, {count = 0}) => (
    <Host>
        <CSS/>

        <h1>test element: {derp}</h1>

        <button onClick={() => host.setState({
            count: count + 1
        })}>
            inc {count}
        </button>
    </Host>
), {propTypes: {derp: String}});


render(<App/>, document.body);