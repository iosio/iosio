export const propLogic = base => {
    if(!base.__reactivePropsMixin || !base.__proxyRefsMixin){
        console.error('propLogic requires both reactiveProps and proxyRefs mixins');
        return base;
    }

    return class extends base {

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
    }
};

