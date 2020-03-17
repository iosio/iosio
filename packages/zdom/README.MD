# zdom

> tiny vdom inspired by https://twitter.com/_developit/status/1232891191110389760 

Fixed a few things, using display:contents as a fragment, works in modern browsers.

I find that this is all that I need, the ability to independently update instances as well as the ability 
to subscribe and unsubscribe from stores when the node is removed.



```js
import {h, render, Fragment, Host} from 'zdom';
import {someSubscription, anotherSub} from './store';


const CounterAndSubscriber = (props, {count = 0}, update) => {

    return( // in order to achieve hook-like functionality 
            // you can tie into 
            <Host lifeCycle={() => { //

                // call update to rerender this component
                let unsub = someSubscription(update); 

                return () => unsub();   //unsubscribes when unmounted*/
            }}>
    
                <h1>
                    {someSubscription.latestValue}
                </h1>

                <button onClick={() => update({count: count + 1})}>
                    inc me!! : {count}
                </button>

            </Host>
        )   
}

const Subscriber = (props, state, update) => (
    <Host lifeCycle={() => [someSubcription(update), anotherSub(update)]}>
        <h1>
            {someSubscription.latestValue}
        </h1>
    </Host>
)

const Counter = (props, {count = 0}, update) => (
    <button onClick={() => update({count: count + 1})}>
        Counter count: {count}
    </button>
)
 


const App = (props, {show = false}, update) => {
    
    return (
        <Fragment>
            
            <Subscriber/>

            <button onClick={() => update({show: !show})}>
                toggle counter
            </button>

            {
                show && <Counter/>
            }   

            {/* another counter*/}
            <CounterAndSubscriber/>

        </Fragment>
    )

}

render(<App/>, document.body);

```





