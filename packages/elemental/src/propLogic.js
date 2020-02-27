export const propLogic = function (propLogic) {
    return (self) => [
        () => {
            const logic = propLogic(true);
            Object.keys(self.props).forEach(prop => {
                logic[prop] && logic[prop](self.props[prop], self.refs, self);
            });
        },
        () => {
            const logic = propLogic();
            self.changedProps.forEach(prop => logic[prop] && logic[prop](self.props[prop], self.refs, self))
        }
    ];
};
