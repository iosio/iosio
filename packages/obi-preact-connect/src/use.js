import {useCallback, useEffect, useState} from "preact/hooks";
import {getArgs, newObj} from "./util";

const useForceUpdate = () => {
    const [, set] = useState(newObj());
    return useCallback(() => set(newObj()), [set]);
};


export const useObi = function () {
    let fu = useForceUpdate(),
        args = getArgs(arguments);
    useEffect(() => {
        let unsubs = [];
        args.forEach(o => unsubs.push(o.$onChange(fu)));
        return () => unsubs.forEach(f => f());
    }, []);
};
