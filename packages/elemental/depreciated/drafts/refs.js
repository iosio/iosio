export const refs = (options = {}) => self => {

    let {selector = (ref) => `#${ref}`, selectMethod = 'querySelector'} = options,
        refsCache = {}, root = self.shadowRoot || self;

   return new Proxy({}, {
        get(target, key) {
            if (key === 'refreshRefsCache') return () => refsCache = {};
            if (!refsCache[key]){
                refsCache[key] = root[selectMethod](selector(key));
            }
            return refsCache[key];
        }
    });
};