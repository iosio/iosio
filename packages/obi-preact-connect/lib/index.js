import{Component as t,h as r}from"preact";import{useCallback as o,useEffect as n,useState as e}from"preact/hooks";const c=t=>Array.from(t),h=()=>Object.create(null),p=function(){let o=c(arguments);return n=>{function e(){let t=[];o.forEach(r=>t.push(r.$onChange(()=>this.setState(h())))),this.componentWillUnmount=()=>t.forEach(t=>t()),this.render=()=>r(n,this.props,this.props.children)}return(e.prototype=new t).constructor=e}},s=()=>{const[,t]=e(h());return o(()=>t(h()),[t])},i=function(){let t=s(),r=c(arguments);n(()=>{let o=[];return r.forEach(r=>o.push(r.$onChange(t))),()=>o.forEach(t=>t())},[])};export{p as obiConnect,i as obiUse};
