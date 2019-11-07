import {h, Component} from "preact";
import {routing} from "@iosio/routing";
import {propsChanged} from "@iosio/util";

const {routerSwitch} = routing;
export {routing};

export class Router extends Component {
    constructor() {
        super();
        this.unsub = routing.$onChange(() =>
            this.setState(Object.create(null))
        );
        this.initial = true;
    }

    shouldComponentUpdate(nextProps) {
        const {next, toLast, noChange, replacedLast} = routerSwitch({
            pathMap: nextProps.pathMap,
            noMatch: nextProps.noMatch,
            root: nextProps.root
        });
        this.c = props => h(next, props);
        let {pathMap, noMatch, root} = this.props;
        return nextProps.root !== root || nextProps.noMatch !== noMatch
            || propsChanged(pathMap || {}, nextProps.pathMap || {})
            || !(toLast || replacedLast || (noChange && !this.initial))
    }

    componentDidMount() {
        this.initial = false;
    }

    render({pathMap, noMatch, root, ...rest}) {
        return h(
            this.initial
                ? routerSwitch({pathMap, noMatch, root}).next
                : this.c,
            rest
        );
    }
}
