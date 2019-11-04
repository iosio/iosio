
import {createBase} from "@iosio/x-base";

import {setProperty} from "@iosio/xact";

import {h, render} from "preact";


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
};

export * from 'preact';
export * from '@iosio/x-base';
console.log('using x-preact')