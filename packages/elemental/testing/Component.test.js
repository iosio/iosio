import {webComponentTester} from "./testUtils/webComponentsTester";

import {Elemental, h, Fragment} from "../src";

const propTypes = {

    myStringProp: String,

    myBooleanProp: Boolean,

    myNumberProp: {
        type: Number,
        reflect: true
    },

    myObjectProp: Object,

    myArrayProp: Array,

    anyValueGoesProp: 'any',

    toBeReflected: {
        type: String,
        reflect: true
    },
    anotherReflectedString: {
        type: String,
        reflect: true,
    },

    toBeReflectedWithDefaultValue: {
        type: Boolean,
        reflect: true,
        value: true
    },

    hello: {
        type: String,
        value: 'name',
        reflect: true
    }
};

let updated = 0;

let numTimesValueSet = 0;

let shouldUpdate;


let calledInitialUpdate = 0,
    calledWillUnmount = 0

let _props, _prevProps, _changedProps;


class ComponentElement extends Elemental {
    static propTypes = propTypes;
    static shadow = true;
    static styles = ':host{--color:red;}h1{color:var(--color)}';
    constructor() {
        super();
    }

    didMount() {
        calledInitialUpdate++;
        return () => {
            calledWillUnmount++
        }
    }

    didUpdate() {
        _props = {...this.props};
        _prevProps = {...this.prevProps};
        _changedProps = [...this.changedProps];
        updated++
    }

    shouldUpdate() {
        return shouldUpdate;
    }

    render({myNumberProp, hello}, state) {
        return (
            <Fragment>
                <h1>hello <span>{hello}{' '}{myNumberProp}</span></h1>
            </Fragment>
        )
    }
}

const expect = (target) => ({
    toBe: (expectedValue) => {
        if (target !== expectedValue) {
            throw new Error(`expected: ${String(expectedValue)} but received ${target}`)
        }
    }
});


const it = (string, cb) => {
    let msg;
    try {
        cb();
        msg = string;
    } catch (e) {
        console.error(string, e, `💩`);
    }
    msg && console.log("√ " + msg)
};


export const ComponentTest = () => {
    webComponentTester({
        tag: 'component-element',
        Class: ComponentElement,
        tests: [
            async ({component: c, until}) => {

                // await until(50000000)
                const reset = () => {
                    // console.log('(clearing)');
                    updated = 0;
                    numTimesValueSet = 0;
                };

                const logUpdate = () => {
                    console[updated !== 1 ? 'error' : 'log'](
                        `subsequentUpdate was called: ${updated} time${(updated > 1 || updated === 0) ? 's' : ''}
when values were changed ${numTimesValueSet} time${(numTimesValueSet > 1 || numTimesValueSet === 0) ? 's' : ''};`
                    );
                    reset();
                };


                it('should be resolving a promise on the mounted property', () => {
                    expect(c.mounted + '').toBe('[object Promise]')
                });

                await c.mounted;

                let emittedEvent = 0;
                let listener = () => {
                    emittedEvent++;
                    c.removeEventListener('customEvent', listener);
                };

                c.addEventListener('customEvent', listener)

                c.emit('customEvent', 'heyyo');

                it('emits custom events', () => {
                    expect(emittedEvent).toBe(1);
                })


                it('should have a shadowRoot', () => {
                    expect(c.shadowRoot instanceof ShadowRoot).toBe(true);
                });


                it('reflects default attribute value', () => {
                    expect(c.hasAttribute('to-be-reflected-with-default-value')).toBe(true);
                });

                let adoptableStyles = "adoptedStyleSheets" in document;
                //****
                it('renders elements', () => {
                    expect(c.shadowRoot.firstChild.localName).toBe(adoptableStyles ? 'h1' : 'style');
                });


                if (adoptableStyles) {
                    it('adopts a constructable stylesheet', () => {
                        expect(c.shadowRoot.adoptedStyleSheets + '').toBe('[object CSSStyleSheet]');
                        expect(getComputedStyle(c).getPropertyValue('--color')).toBe('red');
                    });
                }


                c.toBeReflected = 'hello';

                await c.processing;
                it('a reflected propType should set on attribute when property is set', () => {
                    expect(c.getAttribute('to-be-reflected')).toBe('hello');
                });


                await until(500);
                c.setAttribute('my-string-prop', 'asdf');
                await c.processing;

                it('setting an attribute updates the property', () => {
                    expect(c.myStringProp).toBe('asdf');
                });


                await until(500);

                it('can accept different type on "any" type prop without complaining', () => {
                    c.anyValueGoesProp = 'any value!';
                    c.anyValueGoesProp = false;
                    c.anyValueGoesProp = 1000;
                });

                await until(500);
                c.setAttribute('my-boolean-prop', 'true');
                await c.processing;
                it('converts boolean type attribute to type boolean on prop', () => {
                    expect(typeof c.myBooleanProp).toBe('boolean')
                });


                await until(500);
                c.setAttribute('my-number-prop', '111');
                await c.processing;
                it('converts number type attribute to type number on prop', () => {
                    expect(typeof c.myNumberProp).toBe('number')
                });

                await until(500);
                reset();

                [...Array(100)].forEach((_, index) => {
                    numTimesValueSet++;
                    c.myNumberProp = index + 1;
                });

                await c.processing;
                it('debounces rapid prop updates', () => {

                    expect(c.myNumberProp).toBe(100);
                    expect(numTimesValueSet).toBe(100);
                    expect(updated).toBe(1);

                    logUpdate()
                });


                c.myBooleanProp = false;
                c.myStringProp = '';
                await until(500);

                c.myBooleanProp = true;
                c.myStringProp = 'lalalalala';
                await c.processing;
                it('should clear the changedProps array after update', () => {
                    expect(c.changedProps.length).toBe(0)
                });

                it('should have updated this.props', () => {
                    expect(_props.myBooleanProp).toBe(true);
                    expect(_props.myStringProp).toBe('lalalalala');
                });

                it('should have updated this.prevProps', () => {
                    expect(_prevProps.myBooleanProp).toBe(false);
                    expect(_prevProps.myStringProp).toBe('');
                });

                it('should have updated this.props', () => {
                    expect(_changedProps.join(',')).toBe('myBooleanProp,myStringProp');
                });


                await until(500);
                reset();
                shouldUpdate = false;

                c.myBooleanProp = true;
                await c.processing;

                it('should not call update when should update returns false (property is still set)', () => {
                    expect(updated).toBe(0);
                });

                await until(500);
                c.myBooleanProp = false;
                await c.processing;
                reset();
                shouldUpdate = true;

                c.myBooleanProp = true;
                await c.processing;

                it('should call update when shouldUpdate returns true', () => {
                    expect(updated).toBe(1);
                });


                await until(500);
                //
                // c.remove();
                //
                // it('should call willUnmount when disconnected', () => {
                //     expect(calledWillUnmount).toBe(1);
                // });


                await until(500);
                it('should have called initial update once', () => {
                    expect(calledInitialUpdate).toBe(1);
                });


            }
        ]
    })
};
