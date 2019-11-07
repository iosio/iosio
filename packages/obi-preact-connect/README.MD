# @iosio/obi-preact-connect

> @iosio/obi hook and connect functions for preact

## Installation
```sh
npm install @iosio/obi @iosio/obi-preact-connect
```

Quick example for now
```js
import {h, render} from "preact"
import {obi} from "@iosio/obi";
import {connectObi, useObi} from "@iosio/obi-preact-connect";

const state = obi({
    count: 0,
    test: {
        value: 'heyyo'
    }
});


const Counter = connectObi(state)(({test}) => (
    <h1>
        {test} Count: {state.count}
    </h1>
));

const {test} = state;

const Input = () => {
    useObi(state.test);

    return (
        <input value={test.value} onInput={({target}) => test.value = target.value}/>
    )
};

const App = () => {

    useObi(state.test);

    return (

        <div>

            <Input/>

            <button onClick={() => state.count++}>
                inc
            </button>
            Heyyoo

            <Counter test={state.test.value}/>

        </div>
    )
};


render(<App/>, document.body);


```