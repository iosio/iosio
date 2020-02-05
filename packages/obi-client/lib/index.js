import{obi as e}from"@iosio/obi";const t=({routes:t,...c})=>{const s=e({fetchingStates:Object.keys(t).reduce((e,t)=>(e[t]=!1,e),{}),...Object.keys(t).reduce((e,c)=>(e[c]=(...e)=>(s.fetchingStates[c]=!0,t[c](...e).then(e=>(s.fetchingStates[c]=!1,e)).catch(e=>(s.fetchingStates[c]=!1,Promise.reject(e)))),e),{}),...c});return s};export{t as obiClient};
//# sourceMappingURL=index.js.map
