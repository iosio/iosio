import{isString as t,isObj as e,isArray as a}from"@iosio/util";import{obi as r}from"@iosio/obi";const o=()=>{let o=window,l=t=>{if(!t)return"";var e=decodeURIComponent(t);return"false"!==e&&("true"===e||(0*+e==0?+e:e))},n=t=>{let e,a,r,n={};if((r=(t=t||o.location.search).indexOf("?"))<0)return;let s=(t=t.substr(r+1)).split("&");for(;e=s.shift();)void 0!==n[a=(e=e.split("=")).shift()]?n[a]=[].concat(n[a],l(e.shift())):n[a]=l(e.shift());return n},s=t=>{var e,r,o,l=encodeURIComponent,n="";for(e in t)if(void 0!==(o=t[e]))if(a(o))for(r=0;r<o.length;r++)n&&(n+="&"),n+=l(e)+"="+l(o[r]);else n&&(n+="&"),n+=l(e)+"="+l(o);return"?"+n},i=()=>{let{pathname:t,search:e}=o.location;return{url:t+e,pathname:t,search:e,params:n()}},p=i(),{url:h,pathname:c}=p,u=r({$lastUrl:h,$lastPathname:c,$lastType:"initial",...p,getParams:n,stringifyParams:s,getLocation:i,route(a,r,l){let n=t(a)?a:location.pathname;r=e(a)?a:r||"",l=l||"push";const{pathname:p,url:u}=i();"replace"!==l&&(h=u,c=p),((t,a,r)=>{a=e(a)?s(a):a,o.history[r+"State"](null,null,t+a)})(n,r,l),"replace"===l?setTimeout(()=>m({type:l})):m({type:l})}});u.routerSwitch=({root:t,pathMap:e,noMatch:a})=>{let r=null,o=!1,{pathname:l,$lastPathname:n,$lastUrl:s,$lastType:i,url:p}=u,h=p===s;return a=a||"/",t?r=e["/"+l.split("/")[1]]||e[a]:e[l]?r=e[l]:n!==l&&e[n]?(u.route(s,location.search,"replace"),r=e[n],o=!0):a&&e[a]&&(u.route(a,location.search,"replace"),r=e[a]),{next:r,toLast:o,noChange:h,replacedLast:"replace"===i}};var m=t=>{u.$merge({...i(),$lastUrl:"popstate"===t.type?u.url:h,$lastPathname:"popstate"===t.type?u.pathname:c,$lastType:t.type})};return o.addEventListener("popstate",m),u},l=o();export{o as createRouting,l as routing};
