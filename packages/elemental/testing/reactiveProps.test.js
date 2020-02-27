import {webComponentTester} from "./testUtils/webComponentsTester";
import {asyncBatchUpdate} from "../src/plugins/asyncBatchUpdate";
import {composer} from "../src/composer/composer";
import {createElem} from "./testUtils/simpleCreateElement";
import {reactiveProps} from "../src/plugins/reactiveProps";


let updated = 0;
let numTimesValueSet = 0;


const propTypes = {

    myStringProp: String,

    myBooleanProp: Boolean,

    myNumberProp: Number,

    myObjectProp: Object,

    myArrayProp: Array,

    anyValueGoesProp: 'any',

    toBeReflected: {
        type: String,
        reflect: true
    },

    toBeReflectedWithDefaultValue: {
        type: Boolean,
        reflect: true,
        value: true
    }
};

class Element extends composer(asyncBatchUpdate, reactiveProps)(HTMLElement) {

    static propTypes = propTypes;

    initialUpdate(props) {
        this.render(props)
    }

    subsequentUpdate(props) {
        this.patch(props);
    }

    patch(props) {
        updated++;
        for (let key in props) this.refs[key].textContent = `${key}:${props[key]} `;
    }

    render(props) {
        this.appendChild(
            createElem('div', {ref: r => this.tree = r},
                Object.keys(propTypes).map((key) =>
                    createElem('h1', {
                        ref: r => this.refs[key] = r,
                        textContent: `${key}:${props[key]} `
                    }))
            )
        );
    }

    connectedCallback() {
        this.refs = {};
        this.mount();
    }

}

export const reactivePropsTest = () => {
    webComponentTester({
        name: 'reactiveProps',
        tag: 'elemental-reactive-props',
        Class: Element,
        tests: [
            async ({component: c, until}) => {

                const reset = () => {
                    console.log('(clearing)');
                    updated = 0;
                    numTimesValueSet = 0;
                };
                const logUpdate = () => {
                    console.log(`patch was called: ${updated} time${(updated > 1 || updated === 0) ? 's' : ''};`);
                    console.log(`when values were changed ${numTimesValueSet} time${(numTimesValueSet > 1 || numTimesValueSet === 0) ? 's' : ''};`);
                    reset();
                };

                await c.mounted;

                console.log('it has the boolean attribute', c.hasAttribute('to-be-reflected-with-default-value'));

                await until(500);
                console.log('set property');
                c.toBeReflected = 'helloooo';

                await c.processing;

                await until(500);

                console.log('value was reflected', c.hasAttribute('to-be-reflected'), c.getAttribute('to-be-reflected'));

                await until(500);

                c.anyValueGoesProp = 'any value!';
                c.anyValueGoesProp = false;

                console.log('different types were set to "anyValueGoesProp"');


                await until(500);
                console.log('it should convert types');

                c.setAttribute('my-boolean-prop', 'true');
                await c.processing;
                console.log('should be boolean', typeof c.myBooleanProp === 'boolean')

                await until(500);

                c.setAttribute('my-number-prop', '111');
                await c.processing;
                console.log('should be number', typeof c.myNumberProp === 'number')

                await until(500);
                console.log('rapid sequential prop updates');
                reset();

                [...Array(100)].forEach((_, index)=>{
                    numTimesValueSet++;
                    c.myNumberProp = index;
                });

                await c.processing;
                logUpdate();


            }
        ]
    })
};
/*

const props = ['foo', 'bar', 'baz', 'foobar'];






await c.mounted;



let values = ['asdf', 'zxcv', 'qwerty'];

await until(1000);
c.foo = values[0];
c.bar = values[0];
c.baz = values[0];
c.foobar = values[0];


await c.processing;
logUpdate();

c.foo = c.bar = c.baz = c.foobar = values[1];

c.foo = c.bar = c.baz = c.foobar = values[2];

c.foo = c.bar = c.baz = c.foobar = values[0];

c.foo = c.bar = c.baz = c.foobar = values[1];

c.foo = c.bar = c.baz = c.foobar = values[2];

c.foo = c.bar = c.baz = c.foobar = values[0];

await c.processing;
logUpdate();


 */