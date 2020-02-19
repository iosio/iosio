export const proxyRefs = base => class extends base {
    constructor() {
        super();
        const proxyRefs = this.constructor.proxyRefs || {};
        const selectMethod = proxyRefs.selectMethod || 'querySelector';
        const selectorPrepend = proxyRefs.selectorPrepend || '#';
        let refsCache = {};
        const root = this.shadowRoot || this;
        this.refs = new Proxy({}, {
            get(target, key) {
                if (key === 'refreshRefsCache') return () => refsCache = {};
                if (!refsCache[key]) refsCache[key] = root[selectMethod](selectorPrepend + key);
                return refsCache[key];
            }
        });
    }
};