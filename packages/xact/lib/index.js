import{isString as e,isFunc as l,isNum as n,isBool as t,isArray as r,d as i}from"@iosio/util";const u=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|^--/i,o=function(e){return this._listeners[e.type](e)},s=(e,l,t)=>{"-"===l[0]?e.setProperty(l,t):e[l]=n(t)&&!1===u.test(l)?t+"px":null==t?"":t},d=(n,t,r,i,u)=>{if("key"===(t=u?"className"===t?"class":t:"class"===t?"className":t)||"children"===t);else if("style"===t){const l=n.style;if(e(r))l.cssText=r;else{if(e(i)&&(l.cssText="",i=null),i)for(let e in i)r&&e in r||s(l,e,"");if(r)for(let e in r)i&&r[e]===i[e]||s(l,e,r[e])}}else if("o"===t[0]&&"n"===t[1]){let e=t!==(t=t.replace(/Capture$/,"")),l=t.toLowerCase();t=(l in n?l:t).slice(2),r?(i||n.addEventListener(t,o,e),(n._listeners||(n._listeners={}))[t]=r):n.removeEventListener(t,o,e)}else"list"!==t&&"tagName"!==t&&"form"!==t&&!u&&t in n?n[t]=null==r?"":r:l(r)||"dangerouslySetInnerHTML"===t||(t!==(t=t.replace(/^xlink:?/,""))?null==r||!1===r?n.removeAttributeNS("http://www.w3.org/1999/xlink",t.toLowerCase()):n.setAttributeNS("http://www.w3.org/1999/xlink",t.toLowerCase(),r):null==r||!1===r?n.removeAttribute(t):n.setAttribute(t,r))},c={},p=[],f=e=>e.children;function a(e,l){for(let n in l)e[n]=l[n];return e}const h=(e,l,n,t)=>({type:e,props:l,key:n,ref:t,_children:null,_parent:null,_depth:0,_dom:null,_lastDomChild:null,_component:null,constructor:void 0}),_=(e,n)=>l(e)?e(n):e.current=n,m=(l,i,u)=>{if(null==u&&(u=[]),null==l||t(l))i&&u.push(i(null));else if(r(l))for(let e=0;e<l.length;e++)m(l[e],i,u);else u.push(i?i((l=>{if(null==l||t(l))return null;if(e(l)||n(l))return h(null,l,null,null);if(null!=l._dom||null!=l._component){let e=h(l.type,l.props,l.key,null);return e._dom=l._dom,e}return l})(l)):l);return u},y=(e,n)=>{if(null==n)return e._parent?y(e._parent,e._parent._children.indexOf(e)+1):null;let t;for(;n<e._children.length;n++)if(null!=(t=e._children[n])&&null!=t._dom)return t._dom;return l(e.type)?y(e):null},v=(e,n,t)=>{let r,i;if((r=e.ref)&&_(r,null),t||l(e.type)||(t=null!=(i=e._dom)),e._dom=e._lastDomChild=null,null!=(r=e._component)&&(r.base=r._parentDom=null),r=e._children)for(let e=0;e<r.length;e++)r[e]&&v(r[e],n,t);null!=i&&i.remove()},g=(e,n,t,r,i,u,o)=>{let s,d,f,a,h,g,w,b=t&&t._children||p,x=b.length;if(o==c&&(o=null!=u?u[0]:x?y(t,0):null),s=0,n._children=m(n._children,t=>{if(null!=t){if(t._parent=n,t._depth=n._depth+1,null===(f=b[s])||f&&t.key==f.key&&t.type===f.type)b[s]=void 0;else for(d=0;d<x;d++){if((f=b[d])&&t.key==f.key&&t.type===f.type){b[d]=void 0;break}f=null}if(a=k(e,t,f=f||c,r,i,u,o),(d=t.ref)&&f.ref!=d&&(w||(w=[])).push(d,a,t),null!=a){if(null==g&&(g=a),null!=t._lastDomChild)a=t._lastDomChild,t._lastDomChild=null;else if(u==f||a!=o||null==a.parentNode){e:if(null==o||o.parentNode!==e)e.appendChild(a);else{for(h=o,d=0;(h=h.nextSibling)&&d<x;d+=2)if(h==a)break e;e.insertBefore(a,o)}"option"==n.type&&(e.value="")}o=a.nextSibling,l(n.type)&&(n._lastDomChild=a)}}return s++,t}),n._dom=g,null!=u&&!l(n.type))for(s=u.length;s--;)null!=u[s]&&u[s].remove();for(s=x;s--;)null!=b[s]&&v(b[s],b[s]);if(w)for(s=0;s<w.length;s++)_(w[s],w[++s],++s)},k=(e,n,t,r,u,o,s)=>{let a,h=n.type;if(void 0!==n.constructor)return null;if(l(h)){let l=n.props;n._component=h,a=h(l),n._children=m(null!=a&&a.type==f&&null==a.key?a.props.children:a),g(e,n,t,r,u,o,s)}else n._dom=((e,l,n,t,r,u)=>{let o,s=n.props,f=l.props,a=l.type;if(r="svg"===a||r,null==e&&null!=u)for(o=0;o<u.length;o++){const l=u[o];if(null!=l&&(null===a?3===l.nodeType:l.localName===a)){e=l,u[o]=null;break}}if(null==e){if(null===a)return i.createTextNode(f);e=r?i.createElementNS("http://www.w3.org/2000/svg",a):i.createElement(a),u=null}if(null===a)null!=u&&(u[u.indexOf(e)]=null),s!==f&&(e.data=f);else if(l!==n){null!=u&&(u=p.slice.call(e.childNodes));let i=(s=n.props||c).dangerouslySetInnerHTML,o=f.dangerouslySetInnerHTML;if(s===c){s={};for(let l=0;l<e.attributes.length;l++)s[e.attributes[l].name]=e.attributes[l].value}(o||i)&&(o&&i&&o.__html==i.__html||(e.innerHTML=o&&o.__html||"")),((e,l,n,t,r)=>{let i;for(i in n)i in l||d(e,i,null,n[i],t);for(i in l)"value"===i||"checked"===i||n[i]===l[i]||d(e,i,l[i],n[i],t)})(e,f,s,r),l._children=l.props.children,o||g(e,l,n,t,"foreignObject"!==l.type&&r,u,c),"value"in f&&void 0!==f.value&&f.value!==e.value&&(e.value=null==f.value?"":f.value),"checked"in f&&void 0!==f.checked&&f.checked!==e.checked&&(e.checked=f.checked)}return e})(t._dom,n,t,r,u,o);return n._dom},w=function(e,l,n){let t=arguments;if(l=a({},l),t.length>3){n=[n];for(let e=3;e<t.length;e++)n.push(t[e])}null!=n&&(l.children=n);let r=l.ref,i=l.key;return null!=r&&delete l.ref,null!=i&&delete l.key,h(e,l,i,r)},b=(e,l)=>{let n=l._children;e=w(f,null,[e]),k(l,l._children=e,n||c,c,void 0!==l.ownerSVGElement,n?null:p.slice.call(l.childNodes),c)};export{f as Fragment,w as h,b as render,d as setProperty,m as toChildArray};
