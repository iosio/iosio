import {h, Component} from "preact";
import {routing} from "@iosio/routing";
import {propsChanged, isObj, isFunc} from "@iosio/util";

const {routerSwitch} = routing;
export {routing};

export class Router extends Component {
    constructor(props) {
        super(props);
        let lastPath = window.location.pathname;
        this.unsub = routing.$onChange(() => {
            const {pathname} = routing;
            if (lastPath !== pathname) {
                this.setState(Object.create(null));
                lastPath = pathname;
            }
        });
        this.initial = true;
    }

    shouldComponentUpdate(nextProps) {
        const {next, toLast, noChange, replacedLast} = routerSwitch({
            pathMap: nextProps.pathMap,
            noMatch: nextProps.noMatch,
            root: nextProps.root
        });

        this.next = props => h(next, props);
        let {pathMap, noMatch, root} = this.props;
        return nextProps.root !== root || nextProps.noMatch !== noMatch
            || propsChanged(pathMap || {}, nextProps.pathMap || {})
            || !(toLast || replacedLast || noChange)
    }

    componentDidMount() {
        this.initial = false;
    }

    componentWillUnmount() {
        this.unsub();
    }

    render({pathMap, noMatch, root, ...rest}) {
        return h(
            this.initial
                ? routerSwitch({pathMap, noMatch, root}).next
                : this.next,
            rest
        );
    }
}

export const anchorTagResetStylesFn = (className = '') => /*language=css*/
    `${className} a:hover,${className} a:focus,${className} a:active,${className} a:link,${className} a:visited {color: inherit;text-decoration: none;background-color: transparent;outline: 0;-webkit-tap-highlight-color: transparent;}`;

export const anchorTagResetStyles = anchorTagResetStylesFn('');

const getSearch = (toParams) => isObj(toParams) ? routing.stringifyParams(toParams) : (toParams || '');

export class Linkage extends Component {

    componentDidMount() {
        const {listenTo, toPath, toParams} = this.props;
        if (listenTo) {
            let lastPath, lastSearch, lastURL, isActive = false;

            let update = () => {
                const {pathname, search} = location;
                lastPath = pathname;
                lastSearch = search;
                lastURL = pathname + search;
                this.setState({isActive});
            };

            const check = () => {
                const {pathname, search} = location;
                isActive = false;
                if (listenTo === 'pathname' && (lastPath !== pathname)) {
                    if (toPath === pathname) isActive = true;
                    update();
                } else if (listenTo === 'search' && (lastSearch !== search)) {
                    if (getSearch(toParams) === search) isActive = true;
                    update();
                } else if (listenTo === 'url') {
                    if ((toPath + getSearch(toParams)) === (pathname + search)) isActive = true;
                    update();
                }
            };

            this.unsub = routing.$onChange(check);
            check();
            lastPath = location.pathname;
            lastSearch = location.pathname;
            lastURL = lastPath + lastSearch;
        }
    }

    componentWillUnmount() {
        this.unsub && this.unsub();
    }

    render({element, listenTo, children, href, toPath = location.pathname, toParams, onClick, ...rest}, {isActive}) {

        const _href = element ? {}
            : {href: href || toPath + getSearch(toParams)};

        const linkProps = {
            ..._href,
            onClick: (e) => {
                if (toPath) {
                    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                    if (e.stopPropagation) e.stopPropagation();
                    e.preventDefault();
                    routing.route(toPath, toParams);

                }
                onClick && onClick();
            },
            ...rest
        };

        return h(element || 'a', linkProps, isFunc(children) ? children({...routing, isActive}) : children)
    }
}



