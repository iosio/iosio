import {h, Component} from "preact";
import {routing} from "@iosio/routing";
import {propsChanged} from "@iosio/util";

const {routerSwitch} = routing;
export {routing};

export class Router extends Component {
    constructor(props) {
        super(props);
        let lastPath = window.location.pathname;
        this.unsub = routing.$onChange(() => {
            const {pathname} = routing;
            if (lastPath !== pathname){
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