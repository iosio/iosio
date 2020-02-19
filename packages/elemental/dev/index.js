import {Elemental} from "../src";

import {reactiveState} from "../src/reactiveState";
import {vdom, h, render, Fragment} from "../src/vdom";
import {reactiveProps} from "../src/reactiveProps";
import {staticTemplate} from "../src/staticTemplate";
import {shadowElement} from "../src/shadowElement";
import {adoptableStyles} from "../src/adoptableStyles";
import {proxyRefs} from "../src/proxyRefs";
import {propLogic} from "../src/propLogic";
import {BaseElement} from "../src/BaseElement";
import {compose} from "../src";

// const Element = vdom(reactiveState(reactiveProps(HTMLElement)));
//
// class Hello extends Element {
//
//     static propTypes = {hello: String};
//
//     state = {name: 'foobar'};
//
//     didUpdate() {
//         console.log('did update', this.stateChanged)
//     }
//
//     // static styles = '.my-adopted-classsName{ background: aliceblue;}';
//
//     render(props, state) {
//         return (
//             <div className={'my-adopted-classsName'}>
//                 <input value={state.name} onInput={({target}) => state.name = target.value}/>
//
//                 <h1>{state.name}</h1>
//                 <h1>{props.hello}</h1>
//             </div>
//         )
//     }
// }
//
// customElements.define('hello-elemental', Hello);
//
// class ReactiveElement extends reactiveProps(HTMLElement){
//
// }
//
//
// class ReactiveElement extends reactiveProps()(HTMLElement) {
// }

customElements.define('static-template',
    class extends compose(
        reactiveProps,
        reactiveState,
        staticTemplate,
        adoptableStyles,
        proxyRefs,
        propLogic
    )(BaseElement) {
        static shadow = true;

        static propTypes = {yoyo: String};

        static template = '<h1 id="derp"> yo yo my brutha </h1> <button id="btn">click me</button>';

        static styles = 'h1{background: red}';

        state = {fuck: 'asdf'};

        onStateChange = () => {
            this.refs.derp.textContent = this.state.fuck;
        };

        didMount() {
            this.refs.derp.style.border = '3px solid blue';
            console.log(this.props);
            let count = 0;

            this.refs.btn.onclick = () => {
                this.state.fuck = count++
            }
        }

        propLogic(init) {
            return {
                yoyo: (value, refs) => {
                    refs.derp.textContent = value;
                }
            }
        }
    });

// customElements.define('static-template2', class extends staticTemplate(HTMLElement) {
//     static template = '<h1> 22222yo yo my brutha </h1>'
// });


const App = () => (
    <Fragment>
        {/*<hello-elemental/>*/}
        {/*<hello-elemental hello={'shit balls'}/>*/}
        {/*<hello-elemental/>*/}

        <static-template yoyo={'hello'}/>
        {/*<static-template/>*/}
        {/*<static-template/>*/}

        {/*<static-template2/>*/}
        {/*<static-template2/>*/}
        {/*<static-template2/>*/}
    </Fragment>
);

render(<App/>, document.body)