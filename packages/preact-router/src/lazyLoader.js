import { h} from "preact";
import {Suspense, lazy} from "preact/compat";

export const lazyLoader = (importComponent, indicator) => {
    const Component = lazy(importComponent),
        Placeholder = () => <div/>,
        Loader = indicator || Placeholder;
    function LazyComponent(props){
        return(
            <Suspense fallback={<Loader/>}>
                <Component {...props}/>
            </Suspense>
        )
    }
    return LazyComponent;
};
