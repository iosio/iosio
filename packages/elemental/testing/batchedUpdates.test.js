import {webComponentTester} from "./testUtils/webComponentsTester";
import {asyncBatchUpdate} from "../src/plugins/asyncBatchUpdate";
import {composer} from "../src/composer/composer";
import {createElem} from "./testUtils/simpleCreateElement";

const props = ['foo', 'bar', 'baz', 'foobar'];

let updated = 0;

let numTimesValueSet = 0;
/*
    example using asyncBatchUpdate by itself with no other plugins
 */

class Element extends composer(asyncBatchUpdate)(HTMLElement) {
    constructor() {
        super();
        this.props = {};
        this.refs = {};
        // define setters and getter for your props
        props.forEach(prop => {
            Object.defineProperty(this, prop, {
                set(newVal) {
                    if (newVal === this.props[prop]) return;

                    numTimesValueSet++;
                    //set to an internal value;
                    this.props[prop] = newVal;
                    /*
                        call update when a value has changed
                     */
                    this.update();
                },
                get() {
                    // give access for those who want to get values via dom reference - ie: console.log(domRef.foo)
                    return this.props[prop];
                }
            })
        });
    }

    onUpdate() {
        updated++;
        console.log('updated!!!!!!!!');
        for (let p in this.props) this.refs[p].textContent = `${p}: ` + this.props[p]
    }

    connectedCallback() {
        this.appendChild(
            createElem('div', {},
                props.map((p) =>
                    createElem('h1', {
                        ref: r => this.refs[p] = r,
                        textContent: `${p}: `
                    }))
            )
        );
        this.mount();
    }
}

export const batchUpdateTest = () => {
    webComponentTester({
        tag: 'elemental-batched',
        Class: Element,
        tests: [
            async ({component: c, until}) => {
                /**
                 * wait for when the component has fully mounted.
                 * great for testing
                 */
                await c.mounted;

                const logUpdate = () => {
                    console.log(`update called: ${updated} time${(updated > 1 || updated === 0) ? 's' : ''};`);
                    console.log(`when values were changed ${numTimesValueSet} time${(numTimesValueSet > 1 || numTimesValueSet === 0) ? 's' : ''};`);
                    console.log('(clearing)');
                    updated = 0;
                    numTimesValueSet = 0;
                };

                let values = ['asdf', 'zxcv', 'qwerty'];

                await until(1000);
                c.foo = values[0];
                c.bar = values[0];
                c.baz = values[0];
                c.foobar = values[0];

                /*
                    ******
                    this is good for testing so you can wait till its done
                    collecting updates
                    ******
                 */
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

            }
        ]
    })
};
