import {h as r} from "preact";
import {lazy as t, Suspense as o} from "preact/compat";

const n = (n, c) => {
    const l = t(n), p = c || (() => r("div", null));
    return function (t) {
        return r(o, {fallback: r(p, null)}, r(l, t))
    }
};
export {n as lazyLoader};
