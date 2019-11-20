const e=/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;var t=(t,s,n=/ +/g)=>{let r=new RegExp(s.replace(e,"\\$&").replace(n,"|")),o=t.match(r),i=!!o,a=[];if(i)for(let e=0,s=o.length;e<s;e+=1){let s=o[e];a.push([t.indexOf(s),s.length-1])}return{score:i?.5:1,isMatch:i,matchedIndices:a}},s=(e,{errors:t=0,currentLocation:s=0,expectedLocation:n=0,distance:r=100})=>{const o=t/e.length,i=Math.abs(n-s);return r?o+i/r:i?1:o},n=(e=[],t=1)=>{let s=[],n=-1,r=-1,o=0;for(let i=e.length;o<i;o+=1){let i=e[o];i&&-1===n?n=o:i||-1===n||((r=o-1)-n+1>=t&&s.push([n,r]),n=-1)}return e[o-1]&&o-n>=t&&s.push([n,o-1]),s},r=(e,t,r,{location:o=0,distance:i=100,threshold:a=.6,findAllMatches:h=!1,minMatchCharLength:l=1})=>{const c=o,u=e.length;let p=a,d=e.indexOf(t,c);const g=t.length,f=[];for(let e=0;e<u;e+=1)f[e]=0;if(-1!==d){let n=s(t,{errors:0,currentLocation:d,expectedLocation:c,distance:i});if(p=Math.min(n,p),-1!==(d=e.lastIndexOf(t,c+g))){let e=s(t,{errors:0,currentLocation:d,expectedLocation:c,distance:i});p=Math.min(e,p)}}d=-1;let m=[],y=1,S=g+u;const k=1<<(g<=31?g-1:30);for(let n=0;n<g;n+=1){let o=0,a=S;for(;o<a;)s(t,{errors:n,currentLocation:c+a,expectedLocation:c,distance:i})<=p?o=a:S=a,a=Math.floor((S-o)/2+o);S=a;let l=Math.max(1,c-a+1),M=h?u:Math.min(c+a,u)+g,x=Array(M+2);x[M+1]=(1<<n)-1;for(let o=M;o>=l;o-=1){let a=o-1,h=r[e.charAt(a)];if(h&&(f[a]=1),x[o]=(x[o+1]<<1|1)&h,0!==n&&(x[o]|=(m[o+1]|m[o])<<1|1|m[o+1]),x[o]&k&&(y=s(t,{errors:n,currentLocation:a,expectedLocation:c,distance:i}))<=p){if(p=y,(d=a)<=c)break;l=Math.max(1,2*c-d)}}if(s(t,{errors:n+1,currentLocation:c,expectedLocation:c,distance:i})>p)break;m=x}return{isMatch:d>=0,score:0===y?.001:y,matchedIndices:n(f,l)}},o=e=>{let t={},s=e.length;for(let n=0;n<s;n+=1)t[e.charAt(n)]=0;for(let n=0;n<s;n+=1)t[e.charAt(n)]|=1<<s-n-1;return t};class i{constructor(e,{location:t=0,distance:s=100,threshold:n=.6,maxPatternLength:r=32,isCaseSensitive:i=!1,tokenSeparator:a=/ +/g,findAllMatches:h=!1,minMatchCharLength:l=1}){this.options={location:t,distance:s,threshold:n,maxPatternLength:r,isCaseSensitive:i,tokenSeparator:a,findAllMatches:h,minMatchCharLength:l},this.pattern=this.options.isCaseSensitive?e:e.toLowerCase(),this.pattern.length<=r&&(this.patternAlphabet=o(this.pattern))}search(e){if(this.options.isCaseSensitive||(e=e.toLowerCase()),this.pattern===e)return{isMatch:!0,score:0,matchedIndices:[[0,e.length-1]]};const{maxPatternLength:s,tokenSeparator:n}=this.options;if(this.pattern.length>s)return t(e,this.pattern,n);const{location:o,distance:i,threshold:a,findAllMatches:h,minMatchCharLength:l}=this.options;return r(e,this.pattern,this.patternAlphabet,{location:o,distance:i,threshold:a,findAllMatches:h,minMatchCharLength:l})}}var a=e=>Array.isArray?Array.isArray(e):"[object Array]"===Object.prototype.toString.call(e);const h=(e,t,s)=>{if(t){const n=t.indexOf(".");let r=t,o=null;-1!==n&&(r=t.slice(0,n),o=t.slice(n+1));const i=e[r];if(null!=i)if(o||"string"!=typeof i&&"number"!=typeof i)if(a(i))for(let e=0,t=i.length;e<t;e+=1)h(i[e],o,s);else o&&h(i,o,s);else s.push(i.toString())}else s.push(e);return s};var l=(e,t)=>h(e,t,[]);let c={},u=[],p=null;onmessage=e=>{const{type:t,data:s}=e.data;"set"===t?(({list:e,options:t})=>{t&&(c={...c,...t}),e&&(u=e),p=new class{constructor(e,{location:t=0,distance:s=100,threshold:n=.6,maxPatternLength:r=32,caseSensitive:o=!1,tokenSeparator:i=/ +/g,findAllMatches:a=!1,minMatchCharLength:h=1,id:c=null,keys:u=[],shouldSort:p=!0,getFn:d=l,sortFn:g=((e,t)=>e.score-t.score),tokenize:f=!1,matchAllTokens:m=!1,includeMatches:y=!1,includeScore:S=!1,verbose:k=!1}){this.options={location:t,distance:s,threshold:n,maxPatternLength:r,isCaseSensitive:o,tokenSeparator:i,findAllMatches:a,minMatchCharLength:h,id:c,keys:u,includeMatches:y,includeScore:S,shouldSort:p,getFn:d,sortFn:g,verbose:k,tokenize:f,matchAllTokens:m},this.setCollection(e)}setCollection(e){return this.list=e,e}search(e,t={limit:!1}){this._log(`---------\nSearch pattern: "${e}"`);const{tokenSearchers:s,fullSearcher:n}=this._prepareSearchers(e);let{weights:r,results:o}=this._search(s,n);return this._computeScore(r,o),this.options.shouldSort&&this._sort(o),t.limit&&"number"==typeof t.limit&&(o=o.slice(0,t.limit)),this._format(o)}_prepareSearchers(e=""){const t=[];if(this.options.tokenize){const s=e.split(this.options.tokenSeparator);for(let e=0,n=s.length;e<n;e+=1)t.push(new i(s[e],this.options))}return{tokenSearchers:t,fullSearcher:new i(e,this.options)}}_search(e=[],t){const s=this.list,n={},r=[];if("string"==typeof s[0]){for(let o=0,i=s.length;o<i;o+=1)this._analyze({key:"",value:s[o],record:o,index:o},{resultMap:n,results:r,tokenSearchers:e,fullSearcher:t});return{weights:null,results:r}}const o={};for(let i=0,a=s.length;i<a;i+=1){let a=s[i];for(let s=0,h=this.options.keys.length;s<h;s+=1){let h=this.options.keys[s];if("string"!=typeof h){if(o[h.name]={weight:1-h.weight||1},h.weight<=0||h.weight>1)throw new Error("Key weight has to be > 0 and <= 1");h=h.name}else o[h]={weight:1};this._analyze({key:h,value:this.options.getFn(a,h),record:a,index:i},{resultMap:n,results:r,tokenSearchers:e,fullSearcher:t})}}return{weights:o,results:r}}_analyze({key:e,arrayIndex:t=-1,value:s,record:n,index:r},{tokenSearchers:o=[],fullSearcher:i=[],resultMap:h={},results:l=[]}){if(null==s)return;let c=!1,u=-1,p=0;if("string"==typeof s){this._log(`\nKey: ${""===e?"-":e}`);let a=i.search(s);if(this._log(`Full text: "${s}", score: ${a.score}`),this.options.tokenize){let e=s.split(this.options.tokenSeparator),t=[];for(let s=0;s<o.length;s+=1){let n=o[s];this._log(`\nPattern: "${n.pattern}"`);let r=!1;for(let s=0;s<e.length;s+=1){let o=e[s],i=n.search(o),a={};i.isMatch?(a[o]=i.score,c=!0,r=!0,t.push(i.score)):(a[o]=1,this.options.matchAllTokens||t.push(1)),this._log(`Token: "${o}", score: ${a[o]}`)}r&&(p+=1)}u=t[0];let n=t.length;for(let e=1;e<n;e+=1)u+=t[e];u/=n,this._log("Token score average:",u)}let d=a.score;u>-1&&(d=(d+u)/2),this._log("Score average:",d);let g=!this.options.tokenize||!this.options.matchAllTokens||p>=o.length;if(this._log(`\nCheck Matches: ${g}`),(c||a.isMatch)&&g){let o=h[r];o?o.output.push({key:e,arrayIndex:t,value:s,score:d,matchedIndices:a.matchedIndices}):(h[r]={item:n,output:[{key:e,arrayIndex:t,value:s,score:d,matchedIndices:a.matchedIndices}]},l.push(h[r]))}}else if(a(s))for(let t=0,a=s.length;t<a;t+=1)this._analyze({key:e,arrayIndex:t,value:s[t],record:n,index:r},{resultMap:h,results:l,tokenSearchers:o,fullSearcher:i})}_computeScore(e,t){this._log("\n\nComputing score:\n");for(let s=0,n=t.length;s<n;s+=1){const n=t[s].output,r=n.length;let o=1,i=1;for(let t=0;t<r;t+=1){let s=e?e[n[t].key].weight:1,r=(1===s?n[t].score:n[t].score||.001)*s;1!==s?i=Math.min(i,r):(n[t].nScore=r,o*=r)}t[s].score=1===i?o:i,this._log(t[s])}}_sort(e){this._log("\n\nSorting...."),e.sort(this.options.sortFn)}_format(e){const t=[];if(this.options.verbose){let t=[];this._log("\n\nOutput:\n\n",JSON.stringify(e,(function(e,s){if("object"==typeof s&&null!==s){if(-1!==t.indexOf(s))return;t.push(s)}return s}))),t=null}let s=[];this.options.includeMatches&&s.push((e,t)=>{const s=e.output;t.matches=[];for(let e=0,n=s.length;e<n;e+=1){let n=s[e];if(0===n.matchedIndices.length)continue;let r={indices:n.matchedIndices,value:n.value};n.key&&(r.key=n.key),n.hasOwnProperty("arrayIndex")&&n.arrayIndex>-1&&(r.arrayIndex=n.arrayIndex),t.matches.push(r)}}),this.options.includeScore&&s.push((e,t)=>{t.score=e.score});for(let n=0,r=e.length;n<r;n+=1){const r=e[n];if(this.options.id&&(r.item=this.options.getFn(r.item,this.options.id)[0]),!s.length){t.push(r.item);continue}const o={item:r.item};for(let e=0,t=s.length;e<t;e+=1)s[e](r,o);t.push(o)}return t}_log(){this.options.verbose&&console.log(...arguments)}}(u,c)})(s):"search"===t&&p?postMessage({type:"search",data:{searchValue:s,results:p.search(s)}}):p||console.error("fuse needs to be set")};
