import {Component, h} from "preact";
import {newObj} from "./util";

export const connectObi = (obis) => {

    return Child => {
        function Connected() {
            let unsubs = [];
            [].concat(obis).forEach(d => unsubs.push(d.$onChange(() => this.setState(newObj()))));
            this.componentWillUnmount = () => unsubs.forEach(f => f());
            this.render = () => h(Child, this.props, this.props.children);
        }

        return (Connected.prototype = new Component()).constructor = Connected;
    };
};
