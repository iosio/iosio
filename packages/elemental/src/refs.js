export const refs = (options = {}) => self => {
    let {selector = (ref) => `#${ref}`, selectMethod = 'querySelector'} = options,
        refsCache = {}, root = self.shadowRoot || self;
    self.refs = new Proxy({}, {
        get(target, key) {
            if (key === 'refreshRefsCache') return () => refsCache = {};
            if (!refsCache[key]) refsCache[key] = root[selectMethod](selector(key));
            return refsCache[key];
        }
    });
};