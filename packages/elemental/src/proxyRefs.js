export const proxyRefs = base => class extends base {
    static __proxyRefsMixin = true;
    constructor() {
        super();
        const proxyRefs = this.constructor.proxyRefs || {};
        const selectMethod = proxyRefs.selectMethod || 'querySelector';
        const selectorPrepend = proxyRefs.selectorPrepend || '#';
        const selectorAppend = proxyRefs.selectorAppend || '';
        let refsCache = {};
        const root = this.shadowRoot || this;
        this.refs = new Proxy({}, {
            get(target, key) {
                if (key === 'refreshRefsCache') return () => refsCache = {};
                if (!refsCache[key]) refsCache[key] = root[selectMethod](selectorPrepend + key + selectorAppend);
                return refsCache[key];
            }
        });
    }
};