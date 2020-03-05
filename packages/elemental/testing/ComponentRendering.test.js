import {webComponentTester} from "./testUtils/webComponentsTester";
import {obi} from "@iosio/obi";
import {Elemental, h, Fragment, render, Host} from "../src";
import {Subie} from "@iosio/util";


const connect = (source) => component => {

    let updater = () => up(), up = () => 0;

    source.$onChange(() => {
        updater();
        console.log('changed state', source.$getState())
    });

    return (props, state, update) => {
        up = update;
        return h(component, {...source, ...props})
    }
};



const testState = obi({count: 0});


// let subb = Unsubber();
const ConnectedCounter = (props, state, update) => {
    return (
        <Host lifeCycle={() => testState.$onChange(update)}>
            <div>
                <h1>I am connected!!!{testState.count}</h1>
            </div>
        </Host>
    )
};


const RedCounter = (props, state, update) => {

    return (
        <Host lifeCycle={() => testState.$onChange(update)}>
            <div style={{background: 'red'}}>
                <h1>Red Counter!{testState.count}</h1>
            </div>
        </Host>
    )
};

setInterval(() => {
    testState.count++
}, 1000);


const Counter = (props, {count = 0}, update) => {
    return (
        <div>
            <button onClick={() => update({count: count + 1})}>
                inc me !
            </button>
            <h3>{count}</h3>
        </div>
    )
};

const Derp = ({hello, state}, {count = 0, a = 1, b = 2, bool = true}, update) => {
    return (
        <div>
            <h1 className={'asdf'}>hello:{' '} {hello}</h1>
            <h3>count:{count}</h3>
            <h3>count:{a}</h3>
            <h3>count:{b}</h3>
            <button onClick={() => {
                update({count: count + 1, a: a + 1, b: b + 1})
            }}>click Me
            </button>


            <button onClick={() => {
                update({bool: !bool})
            }}> yoyo
            </button>

            <Counter/>
            <Counter/>
            <Counter/>
            <ConnectedCounter/>

            {
                bool && <div>
                    <ConnectedCounter/>
                </div>
            }
            {
                !bool && <RedCounter/>
            }
        </div>
    )
};


class ComponentElement extends Elemental {
    static propTypes = {
        hello: {type: String, value: 'asdf'}
    };
    static styles = {
        css: '.asdf{color:red;}'
    };

    state = {
        count: 0,
        yoyo: true,
    };

    didMount() {

    }

    didUpdate() {
        // console.log('did update')
    }

    onStateChange = (state, paths) => {
        console.log(state, paths)
        this.update()
    };

    render = (props, state) => {
        console.log('rendered')
        return (
            <Derp hello={props.hello} state={this.state}/>
        )
    }
}

class X extends Elemental {
    static styles = {
        global: '.zxcv{color:blue;}'
    };
    static propTypes = {
        foo: String
    };

    render({foo}) {
        console.log('fooo', foo)
        return (
            <h1> yo yo {foo}</h1>
        )
    }
}


export const ComponentRenderingTest = () => {
    customElements.define('component-x', ComponentElement)
    customElements.define('x-', X);

    // document.body.appendChild(document.createElement('component-x'))


    // render(<Derp/>, document.body)

    document.body.appendChild(document.createElement('component-x'))
    // document.body.appendChild(document.createElement('component-x'))
    //
    //
    // document.body.appendChild(document.createElement('x-'))
    // document.body.appendChild(document.createElement('x-'))
    // document.body.appendChild(document.createElement('x-'))


    // webComponentTester({
    //     tag: 'component-x',
    //
    //     tests: [
    //         async ({component: c, until}) => {
    //             await c.mounted;
    //
    //             c.hello= 'fuck'
    //         }
    //     ]
    // })
};


