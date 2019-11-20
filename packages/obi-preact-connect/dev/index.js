import {h, render} from "preact"
import {obi} from "@iosio/obi";
import {connectObi, useObi} from "../src";

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



