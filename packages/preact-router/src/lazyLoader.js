import {h} from "preact";
import {Suspense, lazy} from "preact/compat";

export const lazyLoader = (importComponent, indicator) => {
    const Component = lazy(importComponent),
        Placeholder = () => h('div'),
        Loader = indicator || Placeholder;

    function LazyComponent(props) {
        return (
            h(Suspense, {fallback: h(Loader)},
                h(Component, {...props})
            )
        )
    }

    // Lazy
    return LazyComponent;
};
