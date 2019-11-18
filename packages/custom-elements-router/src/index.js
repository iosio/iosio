import {extend} from "@iosio/util";
export {routing} from "@iosio/routing";

export const CustomElementsRouter = ({transition, pathMap, noMatch, loadingIndicator, lazyMap}) => {

    transition = typeof transition === 'number'
        ? transition : transition === true ? 150 : 0;

    var initial = true, elem, getMountPoint, timeout,
        unsub, transitionStyle = `opacity ${transition}ms ease-in-out`,
        {routerSwitch} = routing, CE = customElements,

        clearMountingPoint = (e) => {
            let child = e.lastElementChild;
            while (child) (e.removeChild(child), child = e.lastElementChild)
        },

        m = (parentNode, elem) => (clearMountingPoint(parentNode), parentNode.appendChild(elem)),

        mount = (elementName, parentNode) => {
            clearTimeout(timeout);
            elem = document.createElement(elementName);
            if (initial || !transition) return m(parentNode, elem);
            extend(parentNode.style, {transition: transitionStyle, opacity: 0});
            timeout = setTimeout(() => {
                m(parentNode, elem);
                extend(parentNode.style, {transition: transitionStyle, opacity: 1})
            }, transition ? transition + 10 : 0);
        },

        mountLazy = (elementName, to) => {
            loadingIndicator && mount(loadingIndicator, to);
            lazyMap && lazyMap[elementName] && lazyMap[elementName]().then(() =>
                CE.whenDefined(elementName).then(() =>
                    // in case of slow network and the user decides to locate somewhere else before
                    // the request has finished, check that the pathMap matches the element name before exec the mount
                    // so that the previously requested element doesn't mount over the current
                    pathMap[location.pathname] === elementName && mount(elementName, to)
                ));
        },

        doRoute = () => {
            let {next, toLast, noChange, replacedLast} = routerSwitch({pathMap, noMatch}),

                parentNode = getMountPoint && getMountPoint();

            if (!(parentNode && parentNode.nodeName) || toLast || replacedLast || (noChange && !initial)) return;

            next && CE.get(next) ? mount(next, parentNode) : mountLazy(next, parentNode);
        };

    return {
        mountTo: getNodeToMountToFunction => {
            unsub && unsub(); // you didn't follow directions!!!
            getMountPoint = getNodeToMountToFunction;
            doRoute();
            initial = false;
            unsub = routing.$onChange(doRoute);
            return unsub;
        }
    }
};
