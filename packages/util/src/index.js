//
export const utilTest = () => console.log('test in util');

/*------------------ TYPE CHECKING -------------------------- */


export const isArray = Array.isArray;
export const isObj = (thing) => Object.prototype.toString.call(thing) === '[object Object]';
export const isFunc = (thing) => typeof thing === 'function';
export const isString = (thing) => typeof thing === 'string';
export const isNum = (thing) => !isNaN(parseFloat(thing)) && !isNaN(thing - 0);
export const isBool = (thing) => typeof thing === 'boolean';


/*------------------ DOM STUFF -------------------------- */
const w = window;
export const d = document;
// export const createElem = (elem) => d.createElement(elem);
export const appendChild = (node, child) => node.appendChild(child);
export const createTextNode = (text) => d.createTextNode(text);
export const toLowerCase = (toLower) => toLower.toLowerCase();
export const toUpperCase = (toUpper) => toUpper.toUpperCase();
export const addListener = (to, ev, cb) => to.addEventListener(ev, cb);
export const removeListener = (from, ev, cb) => from.removeEventListener(ev, cb);
export const eventListener = (to, ev, cb, opts) => {
    if (!isArray(to)) return addListener(to, ev, cb, opts), () => removeListener(to, ev, cb);
    let unListenAll = [];
    to.forEach(l => {
        addListener(l[0], l[1], l[2], l[3]);
        unListenAll.push(() => removeListener(l[0], l[1], l[2]));
    });
    return () => unListenAll.forEach(f => f());
};

export const ScrollLocker = (_stopScroll, _xscroll, _yscroll, _w = w) => ({
    unlisten: eventListener(_w, 'scroll', () => _stopScroll && _w.scrollTo(_xscroll, _yscroll)),
    lock: () => {
        _stopScroll = true;
        _xscroll = _w.pageXOffset;// || window.document.documentElement.scrollLeft
        _yscroll = _w.pageYOffset;// || window.document.documentElement.scrollTop;
    },
    letGo: () => (_stopScroll = false)
});


/*------------------ STYLES -------------------------- */

/**
 * creates a single style sheet. returns a function to update the same sheet
 * @param {node|| null} mount - pass the node to mount the style element to defaults to document head
 * @returns {function} for adding styles to the same stylesheet
 */
export const headStyleTag = (mount) => {
    let style = d.createElement('style');
    appendChild(style, createTextNode(""));
    appendChild(mount || d.head, style);
    return (css) => (appendChild(style, createTextNode(css)), style);
};

export const toCssVarsFromJsThemeObj = (themeObj) =>
    Object.keys(themeObj).reduce((acc, curr) => ((acc[curr] = `var(--${curr},${themeObj[curr]})`), acc), {});

export const convertThemeToCssVars = (vars, selector) =>
    `${selector || ':root'}{${Object.keys(vars).map((key) => `--${key}:${vars[key]};`).join('')}}`;

export const raf = (fn) => requestAnimationFrame(fn);

export const CSSTextToObj = cssText => {
    var style = {},
        cssToJs = s => s.startsWith('-') ? s : s.replace(/\W+\w/g, match => toUpperCase(match.slice(-1))),
        properties = cssText.split(";").map(o => o.split(":").map(x => x && x.trim()));
    for (var [property, value] of properties) {
        let prop = cssToJs(property);
        if (prop) style[prop] = value;
    }
    return style
};


/*------------------ MISC -------------------------- */


export const extend = (obj, props) => {
    for (let i in props) obj[i] = props[i];
    return obj
};

export const propsChanged = (a, b) => {
    a = a || {};
    b = b || {};
    for (let i in a) if (!(i in b)) return true;
    for (let i in b) if (a[i] !== b[i]) return true;
    return false
};

export const objectIsEmpty = obj => Object.keys(obj || {}).length === 0;

export const arrayIncludesItemFromArray = (arr1, arr2) => {
    let len1 = arr1.length, len2 = arr2.length;
    if (!len1 && !len2 || len1 && !len2 || !len1 && len2) return false;
    for (let i = len1; i--;) if (arr2.includes(arr1[i])) return true;
    return false;
};


// const handler = {
//     set(target, key, value) {
//         console.log(`Setting value ${key} as ${value}`)
//         target[key] = value;
//     },
// };

// const proxyObj = new Proxy({hello: '123'}, handler);

export const Subie = () => {
    let subs = [],
        unsub = (sub, i) => {
            let out = [];
            for (i = subs.length; i--;) subs[i] === sub ? (sub = null) : (out.push(subs[i]));
            subs = out;
        };
    return {
        unsub,
        sub: sub => (subs.push(sub), () => unsub(sub)),
        notify: data => subs.forEach(s => s && s(data))
    }
};

//synthetic events
export const Eventer = (all) => {
    all = all || Object.create(null);
    const on = (event, handler) => (all[event] || (all[event] = [])).push(handler);
    const off = (event, handler) => all[event] && all[event].splice(all[event].indexOf(handler) >>> 0, 1);
    let counter = 0;
    const once = (event, handler) => {
        const func = {};
        const ename = event + '_' + (counter++) + '_';
        const oneTimeCall = ename + 'only_called_once';
        const unregister = () => off(event, func[oneTimeCall]);
        func[oneTimeCall] = () => {
            handler && handler();
            unregister();
        };
        on(event, func[oneTimeCall]);
        return unregister;
    };
    return {
        on,
        off,
        once,
        destroy: (event) => delete all[event],
        emit: function emit(event, data) {
            (all[event] || []).slice().map((fn) => fn(data));
            (all['*'] || []).slice().map((fn) => fn(event, data));
        }

    };
};

//real dom events
export const Events = () => {
    let w = window,
        handlers = {},
        Handler = () => {
            let s = Subie();
            return {
                listener: ({detail}) => s.notify(detail),
                sub: s.sub,
                unsub: s.unsub
            }
        },
        on = (event, handler) => {
            if (!handlers[event]) {
                handlers[event] = Handler();
                addListener(w, event, handlers[event].listener);
            }
            return handlers[event].sub(handler);
        };

    return {
        on,
        once: (event, handler) => {
            let unsub = on(event, (data) => {
                handler(data);
                unsub();
            });
            return unsub
        },
        emit: (event, data) =>
            w.dispatchEvent(
                new CustomEvent(event, {detail: data, bubbles: true, composed: true})
            ),
    }
};

/*
   destroyEvent: (event) => {
        removeListener(w, event, handlers[event].listener);
        delete handlers[event];
    }
*/


export function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

export const is_ie_or_old_edge = () =>
    navigator.userAgent.indexOf("MSIE") !== -1 || !!w.StyleMedia || !!d.documentMode === true;


export const isChrome = () => {
    let isChromium = window.chrome,
        winNav = window.navigator,
        vendorName = winNav.vendor,
        isOpera = typeof window.opr !== "undefined",
        isIEedge = winNav.userAgent.indexOf("Edge") > -1,
        isIOSChrome = winNav.userAgent.match("CriOS");

    return isIOSChrome || isChromium !== null &&
        typeof isChromium !== "undefined" &&
        vendorName === "Google Inc." &&
        isOpera === false &&
        isIEedge === false;
}


export const def = (obj, prop, handlers) => Object.defineProperty(obj, prop, handlers);


export const hexToRgbA = (hex) => {
    let c = [...hex.substring(1)];
    if (c.length === 3) c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    c = `0x${c.join('')}`;
    return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',')}, 0.1)`;
};


export const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

export const getRandomOneOf = (arr) => arr[getRandomInt(0, arr.length - 1)];

export const sortOrderOfObjArr = (arr, objProp, descend) => {
    let nameA, nameB;
    return arr.sort((a, b) => {
        if (typeOf(a[objProp]) === 'string') {
            nameA = a[objProp].toLowerCase();
        } else {
            nameA = a[objProp];
        }

        if (typeOf(a[objProp]) === 'string') {
            nameB = b[objProp].toLowerCase();
        } else {
            nameB = b[objProp];
        }

        if (nameA < nameB) {
            return descend ? 1 : -1;
        }
        if (nameA > nameB) {
            return descend ? -1 : 1;
        }
        return 0;
    });
};
