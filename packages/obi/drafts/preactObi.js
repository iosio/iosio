// import {h, Component} from "preact";
// import {isObj, isFunc, def, extend} from "../../util/src";
// import {useCallback, useEffect, useState} from "preact/hooks";
//
// const getArgs = (a)=>Array.from(a);
//
// const Subie = () => {
//     let subs = [],
//         unsub = (sub, i) => {
//             let out = [];
//             for (i = subs.length; i--;) subs[i] === sub ? (sub = null) : (out.push(subs[i]));
//             subs = out;
//         };
//     return {
//         unsub,
//         sub: sub => (subs.push(sub), () => unsub(sub)),
//         notify: data => subs.forEach(s => s && s(data))
//     }
// };
//
// let newObj = () => Object.create(null);
//
// const useForceUpdate = () => {
//     const [, set] = useState(newObj());
//     return useCallback(() => set(newObj()), [set]);
// };
//
// const useObi = function(){
//     let fu = useForceUpdate(),
//         args = getArgs(arguments);
//     useEffect(() => {
//         let unsubs = [];
//         args.forEach(o => unsubs.push(o.$onChange(fu)));
//         return () => unsubs.forEach(f => f());
//     }, []);
//     return obi;
// };
//
// const connectObi = function () {
//     let args = getArgs(arguments);
//     return Child => {
//         function Connected() {
//             let unsubs = [];
//             args.forEach(d => unsubs.push(d.$onChange(() => this.setState(newObj()))));
//             this.componentWillUnmount = () => unsubs.forEach(f => f());
//             this.render = () => h(Child, this.props, this.props.children);
//         }
//
//         return (Connected.prototype = new Component()).constructor = Connected;
//     };
// };
//
//
// export const obi = (suspect, branchNotify) => {
//     const {sub, notify} = Subie();
//     let makeObi = obj => {
//         if (obj.$obi) return obj;
//         def(obj, '$obi', {enumerable: false, value: true});
//         def(obj, '$batching', {enumerable: false, value: {active: false}});
//         def(obj, '$onChange', {enumerable: false, value: update => sub(update)});
//         !branchNotify && def(obj, '$uniqueNotifiers', {enumerable: false, value: true});
//
//         def(obj, '$getState', {
//             enumerable: false,
//             value: () => Object.keys(obj).reduce((acc, curr) =>
//                 !isFunc(obj[curr]) ? (acc[curr] = (isObj(obj[curr]) && obj[curr].$obi)
//                     ? obj[curr].$getState() : obj[curr], acc) : acc, {})
//         });
//         def(obj, '$merge', {
//             enumerable: false,
//             value: (update, ignoreUpdate) => {
//                 obj.$batching.active = true;
//                 isFunc(update) ? update(suspect) : extend(suspect, update);
//                 obj.$batching.active = false;
//                 !ignoreUpdate && notify(suspect);
//             }
//         });
//
//
//         def(obj, '$use', {
//             enumerable: false, value: function () {
//                 return useObi(obj, ...getArgs(arguments))
//             }
//         });
//         def(obj, '$connect', {
//             enumerable: false, value: function () {
//                 return connectObi(obj, ...getArgs(arguments))
//             }
//         });
//
//         for (let key in obj) {
//             let internal = obj[key];
//             if (isFunc(internal) || key.startsWith('$')) continue;
//             if (isObj(internal)) branchNotify ? makeObi(obj[key]) : obi(obj[key]);
//             def(obj, key, {
//                 enumerable: true,
//                 get: () => internal,
//                 set(value) {
//                     if (value === internal) return;
//                     internal = value;
//                     if (!suspect.$batching.active) notify(suspect);
//                 },
//             });
//         }
//         return obj
//     };
//     return makeObi(suspect);
// };
//
//
//
// export {obi, connectObi, useObi}
//
