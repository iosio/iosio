// import {obi} from "../src";
import {obi2 as obi} from "../drafts/obi";

const testObi = obi({
    hello: '123',
    object: {
        a: 1,
        b: 2,
        c: 3,
        nested: {
            nested_a: 1,
            nested_b: 2,
            nested_c: 3
        }
    }
});

testObi.$onChange((data, paths) => {
    console.log('root changed: ', data, paths);
});

testObi.$onAnyChange((data, paths) => {
    console.log('anything changed: ', data, paths);
});

testObi.object.$onChange((data, paths) => {
    console.log('object changed: ', data.$getState().nested, paths)
});

testObi.$select(['object.a']).$onChange((data, paths) => {
    console.log('object.a changed: ', data, paths)
});

testObi.$select(['object.b']).$onChange((data, paths) => {
    console.log('object.b changed: ', data, paths)
});

testObi.$select(['object.nested.nested_c']).$onChange((data, paths) => {
    console.log('object.nested.nested_c changed: ', data.$getState().object.nested, paths)
});

const til = time => new Promise(r => setTimeout(() => {
    console.log('************')
    r();
}, time || 1000));

const run = async () => {

    // testObi.hello = 'asdfasdf';
    //
    // await til();
    //
    // testObi.object.a = '!@#$@!#$!@#$';
    //
    // testObi.object.b = '!@#$@!#$!@#$';

    // await til();
    //
    // // testObi.object.nested.$merge({
    // testObi.object.nested.$merge({
    //     // a: 1,
    //     // b: 2,
    //     nested_c: 'asdf',
    //     nested_b: 1
    // });
    //
    // await til();
    //
    // // testObi.object.nested.$merge({
    // testObi.object.$merge({
    //     // a: 1,
    //     // b: 2,
    //     nested: {
    //         nested_c: 'derp',
    //         // nested_b: 2
    //     }
    // });
    //
    await til();
    // testObi.object.nested.$merge({
    testObi.object.nested.$merge({
        // a: 1,
        // b: 2,
            nested_c: 'qwerty',
            // nested_b:
    });
    //
    await til();

    testObi.object.nested.nested_c = 'zxcvy';

    await til();

    // testObi.object.nested.$merge({
    testObi.$merge(() => {
        const {object} = testObi;
        const {nested} = object;
        nested.nested_c = `1234`;
        nested.nested_a = `1234`;
        nested.nested_b = `1234`;

        object.c = `1234`;
        object.a = `1234`;
        object.b = `1234`;
    });

};

run();

/*
    assign = (suspect, update) => (Object.keys(update).forEach(key =>
        isObj(suspect[key]) && suspect[key].$merge
            ? suspect[key].$merge(update[key]) : suspect[key] = update[key]
    ), suspect);
 */