import {useCallback, useEffect, useState} from "preact/hooks";
import {getArgs, newObj} from "./util";

export const useForceUpdate = () => {
    const [, set] = useState(newObj());
    return useCallback(() => set(newObj()), [set]);
};


export const useObi = (obis)=> {
    let fu = useForceUpdate();
    useEffect(() => {
        let unsubs = [];
        [].concat(obis).forEach(o => unsubs.push(o.$onChange(fu)));
        return () => unsubs.forEach(f => f());
    }, []);
};
