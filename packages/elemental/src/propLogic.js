export const propLogic = base => class extends base {
    constructor(...args) {
        super(...args);
    }

    initialUpdate() {
        if (this.propLogic) {
            const logic = this.propLogic(true);
            Object.keys(this.props).forEach(prop => {
                logic[prop] && logic[prop](this.props[prop], this.refs);
            });
        }
    }

    subsequentUpdate() {
        if (this.propLogic) {
            const logic = this.propLogic();
            this.changedProps.forEach(prop => logic[prop] && logic[prop](this.props[prop], this.refs))
        }
    }
};