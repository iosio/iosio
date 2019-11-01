import {obi} from "../../src";

const testObi = obi({
    hello: '123',
    object: {
        a: 1,
        b: 2,
        c: 3
    }
});

testObi.$onChange((data) => {
    console.log('root changed: ', data);
});

testObi.object.$onChange((data) => {
    console.log('object changed: ', data)
});


setTimeout(() => {
    testObi.hello = 'asdfasdf';


    setTimeout(() => {
        testObi.object.a = '!@#$@!#$!@#$';
    }, 2000);


}, 2000);

