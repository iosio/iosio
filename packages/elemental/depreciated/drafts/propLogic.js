export const propLogic = (propLogic) =>{
    return (self) => [
        () => {
            const logic = propLogic(true);
            logic && Object.keys(self.props).forEach(prop => {
                logic[prop] && logic[prop](self.props[prop], self.refs, self);
            });
        },
        () => {
            const logic = propLogic();
            logic && self.changedProps.forEach(prop => logic[prop] && logic[prop](self.props[prop], self.refs, self))
        }
    ];
};


