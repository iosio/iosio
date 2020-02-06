import {h} from "preact";
import {Suspense, lazy} from "preact/compat";

export const lazyLoader = (importComponent, indicator) => {
    const SomeComponent = lazy(importComponent);
    const Placeholder = () => h('div');
    const Loader = indicator || Placeholder;

    function LazyComponent(props) {
        return (
            h(Suspense, {fallback: h(Loader)},
                h(SomeComponent, {...props})
            )
        )
    }

    // Lazy
    return LazyComponent;
};
