
import {createBase} from "@iosio/x-base";


import {Fragment, h, render, toChildArray, setProperty} from "@iosio/xact";


const {
    x,
    X,
    XShadow,
    Element,
    provide
} = createBase({h, render, setProperty});


export {
    x,
    X,
    XShadow,
    Element,
    provide,

    Fragment,
    h,
    render,
    toChildArray
};



export * from '@iosio/x-base';

console.log('using x');