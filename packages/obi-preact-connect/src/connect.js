import {Component, h} from "preact";
import {getArgs, newObj} from "./util";

export const connectObi = function () {
    let args = getArgs(arguments);
    return Child => {
        function Connected() {
            let unsubs = [];
            args.forEach(d => unsubs.push(d.$onChange(() => this.setState(newObj()))));
            this.componentWillUnmount = () => unsubs.forEach(f => f());
            this.render = () => h(Child, this.props, this.props.children);
        }
        return (Connected.prototype = new Component()).constructor = Connected;
    };
};
