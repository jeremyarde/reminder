var app=function(){"use strict";function e(){}function t(e){return e()}function n(){return Object.create(null)}function r(e){e.forEach(t)}function o(e){return"function"==typeof e}function i(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}function a(e){return null==e?"":e}function u(e,t){e.appendChild(t)}function c(e,t,n){e.insertBefore(t,n||null)}function f(e){e.parentNode.removeChild(e)}function s(e){return document.createElement(e)}function l(e){return document.createTextNode(e)}function d(){return l(" ")}function h(e,t,n,r){return e.addEventListener(t,n,r),()=>e.removeEventListener(t,n,r)}function v(e,t,n){null==n?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function p(e,t){e.value=null==t?"":t}let b;function y(e){b=e}function g(e){(function(){if(!b)throw new Error("Function called outside component initialization");return b})().$$.on_mount.push(e)}const m=[],_=[],w=[],I=[],S=Promise.resolve();let x=!1;function E(e){w.push(e)}let N=!1;const j=new Set;function k(){if(!N){N=!0;do{for(let e=0;e<m.length;e+=1){const t=m[e];y(t),D(t.$$)}for(y(null),m.length=0;_.length;)_.pop()();for(let e=0;e<w.length;e+=1){const t=w[e];j.has(t)||(j.add(t),t())}w.length=0}while(m.length);for(;I.length;)I.pop()();x=!1,N=!1,j.clear()}}function D(e){if(null!==e.fragment){e.update(),r(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(E)}}const A=new Set;let O;function R(e,t){e&&e.i&&(A.delete(e),e.i(t))}function C(e,t,n,r){if(e&&e.o){if(A.has(e))return;A.add(e),O.c.push(()=>{A.delete(e),r&&(n&&e.d(1),r())}),e.o(t)}}function B(e,n,i){const{fragment:a,on_mount:u,on_destroy:c,after_update:f}=e.$$;a&&a.m(n,i),E(()=>{const n=u.map(t).filter(o);c?c.push(...n):r(n),e.$$.on_mount=[]}),f.forEach(E)}function T(e,t){const n=e.$$;null!==n.fragment&&(r(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function $(e,t){-1===e.$$.dirty[0]&&(m.push(e),x||(x=!0,S.then(k)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function M(t,o,i,a,u,c,s=[-1]){const l=b;y(t);const d=o.props||{},h=t.$$={fragment:null,ctx:null,props:c,update:e,not_equal:u,bound:n(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(l?l.$$.context:[]),callbacks:n(),dirty:s,skip_bound:!1};let v=!1;if(h.ctx=i?i(t,d,(e,n,...r)=>{const o=r.length?r[0]:n;return h.ctx&&u(h.ctx[e],h.ctx[e]=o)&&(!h.skip_bound&&h.bound[e]&&h.bound[e](o),v&&$(t,e)),n}):[],h.update(),v=!0,r(h.before_update),h.fragment=!!a&&a(h.ctx),o.target){if(o.hydrate){const e=function(e){return Array.from(e.childNodes)}(o.target);h.fragment&&h.fragment.l(e),e.forEach(f)}else h.fragment&&h.fragment.c();o.intro&&R(t.$$.fragment),B(t,o.target,o.anchor),k()}y(l)}class F{$destroy(){T(this,1),this.$destroy=e}$on(e,t){const n=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return n.push(t),()=>{const e=n.indexOf(t);-1!==e&&n.splice(e,1)}}$set(e){var t;this.$$set&&(t=e,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}function L(t){let n,i,b,y,g,m,_,w,I,S,x,E,N,j,k,D,A,O,R,C,B,T,$=0==t[2]?"Start":"Pause";return{c(){n=s("div"),i=s("input"),b=d(),y=s("span"),y.textContent="duration (secs):",g=d(),m=s("input"),_=d(),w=s("button"),I=l($),E=d(),N=s("button"),j=l("Reset"),D=d(),A=s("button"),O=l("Delete"),v(i,"class","center svelte-192wv7o"),v(y,"class","center svelte-192wv7o"),v(m,"class","center svelte-192wv7o"),v(m,"size","2"),v(m,"type","text"),v(m,"min","1"),v(m,"max","86400"),v(m,"pattern","[0-9]*"),v(m,"title","Please use a number between 1 and 86,400"),v(w,"class",S=a(P)+" svelte-192wv7o"),v(w,"onkeypress",x=t[8]),v(N,"class",k=a(P)+" svelte-192wv7o"),v(A,"class",R=a(P)+" svelte-192wv7o"),v(n,"class",C=a(t[3].get(t[0].habitState))+" svelte-192wv7o")},m(e,r){c(e,n,r),u(n,i),p(i,t[0].name),u(n,b),u(n,y),u(n,g),u(n,m),p(m,t[0].duration),u(n,_),u(n,w),u(w,I),u(n,E),u(n,N),u(N,j),u(n,D),u(n,A),u(A,O),B||(T=[h(i,"input",t[6]),h(m,"input",t[7]),h(w,"click",t[4]),h(N,"click",t[5]),h(A,"click",(function(){o(t[1](t[0].id))&&t[1](t[0].id).apply(this,arguments)}))],B=!0)},p(e,[r]){t=e,1&r&&i.value!==t[0].name&&p(i,t[0].name),1&r&&m.value!==t[0].duration&&p(m,t[0].duration),4&r&&$!==($=0==t[2]?"Start":"Pause")&&function(e,t){t=""+t,e.wholeText!==t&&(e.data=t)}(I,$),1&r&&C!==(C=a(t[3].get(t[0].habitState))+" svelte-192wv7o")&&v(n,"class",C)},i:e,o:e,d(e){e&&f(n),B=!1,r(T)}}}let P="bg-transparent hover:bg-yellow-100 text-grey font-semibold py-2 px-3 border-grey rounded m-2";function z(e,t,n){let r,o=!1;document.onkeydown=function(e){console.log(e),"Enter"==e.key?d():"Backspace"==e.key&&a(i.id)};let{habit:i}=t,{handleDelete:a}=t;const u="complete",c="almostComplete",f="incomplete";let s=new Map;function l(){console.log("handleClick"),n(0,i.duration-=1,i),i.duration<=0?(clearInterval(r),n(0,i.habitState=u,i),function(){let e;"Notification"in window?"denied"!==Notification.permission&&(e=Notification.requestPermission()):alert("This browser does not support desktop notification"),console.log(Notification.permission),console.log(e),("granted"===e||"granted"===Notification.permission)&&new Notification(`Finished ${i.name}!`)}()):i.duration<=i.prevDuration/3&&i.duration>0?n(0,i.habitState=c,i):n(0,i.habitState=f,i),console.log(i)}function d(){console.log("startPauseHabit"),1==o?(clearInterval(r),n(2,o=!1)):(n(0,i.prevDuration=i.duration,i),r=setInterval(l,1e3),n(2,o=!0))}s.set(u,"flex justify-center flex-wrap m-2 bg-red-100 border border-red-400 text-red-700 px-2 rounded relative"),s.set(f,"flex justify-center flex-wrap m-2 bg-green-200 rounded relative border"),s.set(c,"flex justify-center flex-wrap m-2 bg-yellow-200 rounded relative border");return e.$$set=e=>{"habit"in e&&n(0,i=e.habit),"handleDelete"in e&&n(1,a=e.handleDelete)},[i,a,o,s,d,function(){console.log("resetHabit function"),clearInterval(r),n(2,o=!1),n(0,i.duration=i.prevDuration,i),n(0,i.habitState=f,i)},function(){i.name=this.value,n(0,i)},function(){i.duration=this.value,n(0,i)},e=>{console.log(e)}]}class U extends F{constructor(e){super(),M(this,e,z,L,i,{habit:0,handleDelete:1})}}var q="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function W(){throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs")}var H,J,K=(function(e,t){
/*!
        localForage -- Offline Storage, Improved
        Version 1.9.0
        https://localforage.github.io/localForage
        (c) 2013-2017 Mozilla, Apache License 2.0
    */
e.exports=function e(t,n,r){function o(a,u){if(!n[a]){if(!t[a]){if(!u&&W)return W();if(i)return i(a,!0);var c=new Error("Cannot find module '"+a+"'");throw c.code="MODULE_NOT_FOUND",c}var f=n[a]={exports:{}};t[a][0].call(f.exports,(function(e){var n=t[a][1][e];return o(n||e)}),f,f.exports,e,t,n,r)}return n[a].exports}for(var i=W,a=0;a<r.length;a++)o(r[a]);return o}({1:[function(e,t,n){(function(e){var n,r,o=e.MutationObserver||e.WebKitMutationObserver;if(o){var i=0,a=new o(s),u=e.document.createTextNode("");a.observe(u,{characterData:!0}),n=function(){u.data=i=++i%2}}else if(e.setImmediate||void 0===e.MessageChannel)n="document"in e&&"onreadystatechange"in e.document.createElement("script")?function(){var t=e.document.createElement("script");t.onreadystatechange=function(){s(),t.onreadystatechange=null,t.parentNode.removeChild(t),t=null},e.document.documentElement.appendChild(t)}:function(){setTimeout(s,0)};else{var c=new e.MessageChannel;c.port1.onmessage=s,n=function(){c.port2.postMessage(0)}}var f=[];function s(){var e,t;r=!0;for(var n=f.length;n;){for(t=f,f=[],e=-1;++e<n;)t[e]();n=f.length}r=!1}function l(e){1!==f.push(e)||r||n()}t.exports=l}).call(this,void 0!==q?q:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],2:[function(e,t,n){var r=e(1);function o(){}var i={},a=["REJECTED"],u=["FULFILLED"],c=["PENDING"];function f(e){if("function"!=typeof e)throw new TypeError("resolver must be a function");this.state=c,this.queue=[],this.outcome=void 0,e!==o&&h(this,e)}function s(e,t,n){this.promise=e,"function"==typeof t&&(this.onFulfilled=t,this.callFulfilled=this.otherCallFulfilled),"function"==typeof n&&(this.onRejected=n,this.callRejected=this.otherCallRejected)}function l(e,t,n){r((function(){var r;try{r=t(n)}catch(t){return i.reject(e,t)}r===e?i.reject(e,new TypeError("Cannot resolve promise with itself")):i.resolve(e,r)}))}function d(e){var t=e&&e.then;if(e&&("object"==typeof e||"function"==typeof e)&&"function"==typeof t)return function(){t.apply(e,arguments)}}function h(e,t){var n=!1;function r(t){n||(n=!0,i.reject(e,t))}function o(t){n||(n=!0,i.resolve(e,t))}function a(){t(o,r)}var u=v(a);"error"===u.status&&r(u.value)}function v(e,t){var n={};try{n.value=e(t),n.status="success"}catch(e){n.status="error",n.value=e}return n}function p(e){return e instanceof this?e:i.resolve(new this(o),e)}function b(e){var t=new this(o);return i.reject(t,e)}function y(e){var t=this;if("[object Array]"!==Object.prototype.toString.call(e))return this.reject(new TypeError("must be an array"));var n=e.length,r=!1;if(!n)return this.resolve([]);for(var a=new Array(n),u=0,c=-1,f=new this(o);++c<n;)s(e[c],c);return f;function s(e,o){function c(e){a[o]=e,++u!==n||r||(r=!0,i.resolve(f,a))}t.resolve(e).then(c,(function(e){r||(r=!0,i.reject(f,e))}))}}function g(e){var t=this;if("[object Array]"!==Object.prototype.toString.call(e))return this.reject(new TypeError("must be an array"));var n=e.length,r=!1;if(!n)return this.resolve([]);for(var a=-1,u=new this(o);++a<n;)c(e[a]);return u;function c(e){t.resolve(e).then((function(e){r||(r=!0,i.resolve(u,e))}),(function(e){r||(r=!0,i.reject(u,e))}))}}t.exports=f,f.prototype.catch=function(e){return this.then(null,e)},f.prototype.then=function(e,t){if("function"!=typeof e&&this.state===u||"function"!=typeof t&&this.state===a)return this;var n=new this.constructor(o);return this.state!==c?l(n,this.state===u?e:t,this.outcome):this.queue.push(new s(n,e,t)),n},s.prototype.callFulfilled=function(e){i.resolve(this.promise,e)},s.prototype.otherCallFulfilled=function(e){l(this.promise,this.onFulfilled,e)},s.prototype.callRejected=function(e){i.reject(this.promise,e)},s.prototype.otherCallRejected=function(e){l(this.promise,this.onRejected,e)},i.resolve=function(e,t){var n=v(d,t);if("error"===n.status)return i.reject(e,n.value);var r=n.value;if(r)h(e,r);else{e.state=u,e.outcome=t;for(var o=-1,a=e.queue.length;++o<a;)e.queue[o].callFulfilled(t)}return e},i.reject=function(e,t){e.state=a,e.outcome=t;for(var n=-1,r=e.queue.length;++n<r;)e.queue[n].callRejected(t);return e},f.resolve=p,f.reject=b,f.all=y,f.race=g},{1:1}],3:[function(e,t,n){(function(t){"function"!=typeof t.Promise&&(t.Promise=e(2))}).call(this,void 0!==q?q:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{2:2}],4:[function(e,t,n){var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(){try{if("undefined"!=typeof indexedDB)return indexedDB;if("undefined"!=typeof webkitIndexedDB)return webkitIndexedDB;if("undefined"!=typeof mozIndexedDB)return mozIndexedDB;if("undefined"!=typeof OIndexedDB)return OIndexedDB;if("undefined"!=typeof msIndexedDB)return msIndexedDB}catch(e){return}}var a=i();function u(){try{if(!a||!a.open)return!1;var e="undefined"!=typeof openDatabase&&/(Safari|iPhone|iPad|iPod)/.test(navigator.userAgent)&&!/Chrome/.test(navigator.userAgent)&&!/BlackBerry/.test(navigator.platform),t="function"==typeof fetch&&-1!==fetch.toString().indexOf("[native code");return(!e||t)&&"undefined"!=typeof indexedDB&&"undefined"!=typeof IDBKeyRange}catch(e){return!1}}function c(e,t){e=e||[],t=t||{};try{return new Blob(e,t)}catch(o){if("TypeError"!==o.name)throw o;for(var n=new("undefined"!=typeof BlobBuilder?BlobBuilder:"undefined"!=typeof MSBlobBuilder?MSBlobBuilder:"undefined"!=typeof MozBlobBuilder?MozBlobBuilder:WebKitBlobBuilder),r=0;r<e.length;r+=1)n.append(e[r]);return n.getBlob(t.type)}}"undefined"==typeof Promise&&e(3);var f=Promise;function s(e,t){t&&e.then((function(e){t(null,e)}),(function(e){t(e)}))}function l(e,t,n){"function"==typeof t&&e.then(t),"function"==typeof n&&e.catch(n)}function d(e){return"string"!=typeof e&&(console.warn(e+" used as a key, but it is not a string."),e=String(e)),e}function h(){if(arguments.length&&"function"==typeof arguments[arguments.length-1])return arguments[arguments.length-1]}var v="local-forage-detect-blob-support",p=void 0,b={},y=Object.prototype.toString,g="readonly",m="readwrite";function _(e){for(var t=e.length,n=new ArrayBuffer(t),r=new Uint8Array(n),o=0;o<t;o++)r[o]=e.charCodeAt(o);return n}function w(e){return new f((function(t){var n=e.transaction(v,m),r=c([""]);n.objectStore(v).put(r,"key"),n.onabort=function(e){e.preventDefault(),e.stopPropagation(),t(!1)},n.oncomplete=function(){var e=navigator.userAgent.match(/Chrome\/(\d+)/),n=navigator.userAgent.match(/Edge\//);t(n||!e||parseInt(e[1],10)>=43)}})).catch((function(){return!1}))}function I(e){return"boolean"==typeof p?f.resolve(p):w(e).then((function(e){return p=e}))}function S(e){var t=b[e.name],n={};n.promise=new f((function(e,t){n.resolve=e,n.reject=t})),t.deferredOperations.push(n),t.dbReady?t.dbReady=t.dbReady.then((function(){return n.promise})):t.dbReady=n.promise}function x(e){var t=b[e.name].deferredOperations.pop();if(t)return t.resolve(),t.promise}function E(e,t){var n=b[e.name].deferredOperations.pop();if(n)return n.reject(t),n.promise}function N(e,t){return new f((function(n,r){if(b[e.name]=b[e.name]||$(),e.db){if(!t)return n(e.db);S(e),e.db.close()}var o=[e.name];t&&o.push(e.version);var i=a.open.apply(a,o);t&&(i.onupgradeneeded=function(t){var n=i.result;try{n.createObjectStore(e.storeName),t.oldVersion<=1&&n.createObjectStore(v)}catch(n){if("ConstraintError"!==n.name)throw n;console.warn('The database "'+e.name+'" has been upgraded from version '+t.oldVersion+" to version "+t.newVersion+', but the storage "'+e.storeName+'" already exists.')}}),i.onerror=function(e){e.preventDefault(),r(i.error)},i.onsuccess=function(){n(i.result),x(e)}}))}function j(e){return N(e,!1)}function k(e){return N(e,!0)}function D(e,t){if(!e.db)return!0;var n=!e.db.objectStoreNames.contains(e.storeName),r=e.version<e.db.version,o=e.version>e.db.version;if(r&&(e.version!==t&&console.warn('The database "'+e.name+"\" can't be downgraded from version "+e.db.version+" to version "+e.version+"."),e.version=e.db.version),o||n){if(n){var i=e.db.version+1;i>e.version&&(e.version=i)}return!0}return!1}function A(e){return new f((function(t,n){var r=new FileReader;r.onerror=n,r.onloadend=function(n){var r=btoa(n.target.result||"");t({__local_forage_encoded_blob:!0,data:r,type:e.type})},r.readAsBinaryString(e)}))}function O(e){return c([_(atob(e.data))],{type:e.type})}function R(e){return e&&e.__local_forage_encoded_blob}function C(e){var t=this,n=t._initReady().then((function(){var e=b[t._dbInfo.name];if(e&&e.dbReady)return e.dbReady}));return l(n,e,e),n}function B(e){S(e);for(var t=b[e.name],n=t.forages,r=0;r<n.length;r++){var o=n[r];o._dbInfo.db&&(o._dbInfo.db.close(),o._dbInfo.db=null)}return e.db=null,j(e).then((function(t){return e.db=t,D(e)?k(e):t})).then((function(r){e.db=t.db=r;for(var o=0;o<n.length;o++)n[o]._dbInfo.db=r})).catch((function(t){throw E(e,t),t}))}function T(e,t,n,r){void 0===r&&(r=1);try{var o=e.db.transaction(e.storeName,t);n(null,o)}catch(o){if(r>0&&(!e.db||"InvalidStateError"===o.name||"NotFoundError"===o.name))return f.resolve().then((function(){if(!e.db||"NotFoundError"===o.name&&!e.db.objectStoreNames.contains(e.storeName)&&e.version<=e.db.version)return e.db&&(e.version=e.db.version+1),k(e)})).then((function(){return B(e).then((function(){T(e,t,n,r-1)}))})).catch(n);n(o)}}function $(){return{forages:[],db:null,dbReady:null,deferredOperations:[]}}function M(e){var t=this,n={db:null};if(e)for(var r in e)n[r]=e[r];var o=b[n.name];o||(o=$(),b[n.name]=o),o.forages.push(t),t._initReady||(t._initReady=t.ready,t.ready=C);var i=[];function a(){return f.resolve()}for(var u=0;u<o.forages.length;u++){var c=o.forages[u];c!==t&&i.push(c._initReady().catch(a))}var s=o.forages.slice(0);return f.all(i).then((function(){return n.db=o.db,j(n)})).then((function(e){return n.db=e,D(n,t._defaultConfig.version)?k(n):e})).then((function(e){n.db=o.db=e,t._dbInfo=n;for(var r=0;r<s.length;r++){var i=s[r];i!==t&&(i._dbInfo.db=n.db,i._dbInfo.version=n.version)}}))}function F(e,t){var n=this;e=d(e);var r=new f((function(t,r){n.ready().then((function(){T(n._dbInfo,g,(function(o,i){if(o)return r(o);try{var a=i.objectStore(n._dbInfo.storeName).get(e);a.onsuccess=function(){var e=a.result;void 0===e&&(e=null),R(e)&&(e=O(e)),t(e)},a.onerror=function(){r(a.error)}}catch(e){r(e)}}))})).catch(r)}));return s(r,t),r}function L(e,t){var n=this,r=new f((function(t,r){n.ready().then((function(){T(n._dbInfo,g,(function(o,i){if(o)return r(o);try{var a=i.objectStore(n._dbInfo.storeName).openCursor(),u=1;a.onsuccess=function(){var n=a.result;if(n){var r=n.value;R(r)&&(r=O(r));var o=e(r,n.key,u++);void 0!==o?t(o):n.continue()}else t()},a.onerror=function(){r(a.error)}}catch(e){r(e)}}))})).catch(r)}));return s(r,t),r}function P(e,t,n){var r=this;e=d(e);var o=new f((function(n,o){var i;r.ready().then((function(){return i=r._dbInfo,"[object Blob]"===y.call(t)?I(i.db).then((function(e){return e?t:A(t)})):t})).then((function(t){T(r._dbInfo,m,(function(i,a){if(i)return o(i);try{var u=a.objectStore(r._dbInfo.storeName);null===t&&(t=void 0);var c=u.put(t,e);a.oncomplete=function(){void 0===t&&(t=null),n(t)},a.onabort=a.onerror=function(){var e=c.error?c.error:c.transaction.error;o(e)}}catch(e){o(e)}}))})).catch(o)}));return s(o,n),o}function z(e,t){var n=this;e=d(e);var r=new f((function(t,r){n.ready().then((function(){T(n._dbInfo,m,(function(o,i){if(o)return r(o);try{var a=i.objectStore(n._dbInfo.storeName).delete(e);i.oncomplete=function(){t()},i.onerror=function(){r(a.error)},i.onabort=function(){var e=a.error?a.error:a.transaction.error;r(e)}}catch(e){r(e)}}))})).catch(r)}));return s(r,t),r}function U(e){var t=this,n=new f((function(e,n){t.ready().then((function(){T(t._dbInfo,m,(function(r,o){if(r)return n(r);try{var i=o.objectStore(t._dbInfo.storeName).clear();o.oncomplete=function(){e()},o.onabort=o.onerror=function(){var e=i.error?i.error:i.transaction.error;n(e)}}catch(e){n(e)}}))})).catch(n)}));return s(n,e),n}function q(e){var t=this,n=new f((function(e,n){t.ready().then((function(){T(t._dbInfo,g,(function(r,o){if(r)return n(r);try{var i=o.objectStore(t._dbInfo.storeName).count();i.onsuccess=function(){e(i.result)},i.onerror=function(){n(i.error)}}catch(e){n(e)}}))})).catch(n)}));return s(n,e),n}function W(e,t){var n=this,r=new f((function(t,r){e<0?t(null):n.ready().then((function(){T(n._dbInfo,g,(function(o,i){if(o)return r(o);try{var a=i.objectStore(n._dbInfo.storeName),u=!1,c=a.openKeyCursor();c.onsuccess=function(){var n=c.result;n?0===e||u?t(n.key):(u=!0,n.advance(e)):t(null)},c.onerror=function(){r(c.error)}}catch(e){r(e)}}))})).catch(r)}));return s(r,t),r}function H(e){var t=this,n=new f((function(e,n){t.ready().then((function(){T(t._dbInfo,g,(function(r,o){if(r)return n(r);try{var i=o.objectStore(t._dbInfo.storeName).openKeyCursor(),a=[];i.onsuccess=function(){var t=i.result;t?(a.push(t.key),t.continue()):e(a)},i.onerror=function(){n(i.error)}}catch(e){n(e)}}))})).catch(n)}));return s(n,e),n}function J(e,t){t=h.apply(this,arguments);var n=this.config();(e="function"!=typeof e&&e||{}).name||(e.name=e.name||n.name,e.storeName=e.storeName||n.storeName);var r,o=this;if(e.name){var i=e.name===n.name&&o._dbInfo.db?f.resolve(o._dbInfo.db):j(e).then((function(t){var n=b[e.name],r=n.forages;n.db=t;for(var o=0;o<r.length;o++)r[o]._dbInfo.db=t;return t}));r=e.storeName?i.then((function(t){if(t.objectStoreNames.contains(e.storeName)){var n=t.version+1;S(e);var r=b[e.name],o=r.forages;t.close();for(var i=0;i<o.length;i++){var u=o[i];u._dbInfo.db=null,u._dbInfo.version=n}return new f((function(t,r){var o=a.open(e.name,n);o.onerror=function(e){o.result.close(),r(e)},o.onupgradeneeded=function(){o.result.deleteObjectStore(e.storeName)},o.onsuccess=function(){var e=o.result;e.close(),t(e)}})).then((function(e){r.db=e;for(var t=0;t<o.length;t++){var n=o[t];n._dbInfo.db=e,x(n._dbInfo)}})).catch((function(t){throw(E(e,t)||f.resolve()).catch((function(){})),t}))}})):i.then((function(t){S(e);var n=b[e.name],r=n.forages;t.close();for(var o=0;o<r.length;o++)r[o]._dbInfo.db=null;return new f((function(t,n){var r=a.deleteDatabase(e.name);r.onerror=r.onblocked=function(e){var t=r.result;t&&t.close(),n(e)},r.onsuccess=function(){var e=r.result;e&&e.close(),t(e)}})).then((function(e){n.db=e;for(var t=0;t<r.length;t++)x(r[t]._dbInfo)})).catch((function(t){throw(E(e,t)||f.resolve()).catch((function(){})),t}))}))}else r=f.reject("Invalid arguments");return s(r,t),r}var K={_driver:"asyncStorage",_initStorage:M,_support:u(),iterate:L,getItem:F,setItem:P,removeItem:z,clear:U,length:q,key:W,keys:H,dropInstance:J};function Q(){return"function"==typeof openDatabase}var X="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",G="~~local_forage_type~",V=/^~~local_forage_type~([^~]+)~/,Y="__lfsc__:",Z=Y.length,ee="arbf",te="blob",ne="si08",re="ui08",oe="uic8",ie="si16",ae="si32",ue="ur16",ce="ui32",fe="fl32",se="fl64",le=Z+ee.length,de=Object.prototype.toString;function he(e){var t,n,r,o,i,a=.75*e.length,u=e.length,c=0;"="===e[e.length-1]&&(a--,"="===e[e.length-2]&&a--);var f=new ArrayBuffer(a),s=new Uint8Array(f);for(t=0;t<u;t+=4)n=X.indexOf(e[t]),r=X.indexOf(e[t+1]),o=X.indexOf(e[t+2]),i=X.indexOf(e[t+3]),s[c++]=n<<2|r>>4,s[c++]=(15&r)<<4|o>>2,s[c++]=(3&o)<<6|63&i;return f}function ve(e){var t,n=new Uint8Array(e),r="";for(t=0;t<n.length;t+=3)r+=X[n[t]>>2],r+=X[(3&n[t])<<4|n[t+1]>>4],r+=X[(15&n[t+1])<<2|n[t+2]>>6],r+=X[63&n[t+2]];return n.length%3==2?r=r.substring(0,r.length-1)+"=":n.length%3==1&&(r=r.substring(0,r.length-2)+"=="),r}function pe(e,t){var n="";if(e&&(n=de.call(e)),e&&("[object ArrayBuffer]"===n||e.buffer&&"[object ArrayBuffer]"===de.call(e.buffer))){var r,o=Y;e instanceof ArrayBuffer?(r=e,o+=ee):(r=e.buffer,"[object Int8Array]"===n?o+=ne:"[object Uint8Array]"===n?o+=re:"[object Uint8ClampedArray]"===n?o+=oe:"[object Int16Array]"===n?o+=ie:"[object Uint16Array]"===n?o+=ue:"[object Int32Array]"===n?o+=ae:"[object Uint32Array]"===n?o+=ce:"[object Float32Array]"===n?o+=fe:"[object Float64Array]"===n?o+=se:t(new Error("Failed to get type for BinaryArray"))),t(o+ve(r))}else if("[object Blob]"===n){var i=new FileReader;i.onload=function(){var n=G+e.type+"~"+ve(this.result);t(Y+te+n)},i.readAsArrayBuffer(e)}else try{t(JSON.stringify(e))}catch(n){console.error("Couldn't convert value into a JSON string: ",e),t(null,n)}}function be(e){if(e.substring(0,Z)!==Y)return JSON.parse(e);var t,n=e.substring(le),r=e.substring(Z,le);if(r===te&&V.test(n)){var o=n.match(V);t=o[1],n=n.substring(o[0].length)}var i=he(n);switch(r){case ee:return i;case te:return c([i],{type:t});case ne:return new Int8Array(i);case re:return new Uint8Array(i);case oe:return new Uint8ClampedArray(i);case ie:return new Int16Array(i);case ue:return new Uint16Array(i);case ae:return new Int32Array(i);case ce:return new Uint32Array(i);case fe:return new Float32Array(i);case se:return new Float64Array(i);default:throw new Error("Unkown type: "+r)}}var ye={serialize:pe,deserialize:be,stringToBuffer:he,bufferToString:ve};function ge(e,t,n,r){e.executeSql("CREATE TABLE IF NOT EXISTS "+t.storeName+" (id INTEGER PRIMARY KEY, key unique, value)",[],n,r)}function me(e){var t=this,n={db:null};if(e)for(var r in e)n[r]="string"!=typeof e[r]?e[r].toString():e[r];var o=new f((function(e,r){try{n.db=openDatabase(n.name,String(n.version),n.description,n.size)}catch(e){return r(e)}n.db.transaction((function(o){ge(o,n,(function(){t._dbInfo=n,e()}),(function(e,t){r(t)}))}),r)}));return n.serializer=ye,o}function _e(e,t,n,r,o,i){e.executeSql(n,r,o,(function(e,a){a.code===a.SYNTAX_ERR?e.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name = ?",[t.storeName],(function(e,u){u.rows.length?i(e,a):ge(e,t,(function(){e.executeSql(n,r,o,i)}),i)}),i):i(e,a)}),i)}function we(e,t){var n=this;e=d(e);var r=new f((function(t,r){n.ready().then((function(){var o=n._dbInfo;o.db.transaction((function(n){_e(n,o,"SELECT * FROM "+o.storeName+" WHERE key = ? LIMIT 1",[e],(function(e,n){var r=n.rows.length?n.rows.item(0).value:null;r&&(r=o.serializer.deserialize(r)),t(r)}),(function(e,t){r(t)}))}))})).catch(r)}));return s(r,t),r}function Ie(e,t){var n=this,r=new f((function(t,r){n.ready().then((function(){var o=n._dbInfo;o.db.transaction((function(n){_e(n,o,"SELECT * FROM "+o.storeName,[],(function(n,r){for(var i=r.rows,a=i.length,u=0;u<a;u++){var c=i.item(u),f=c.value;if(f&&(f=o.serializer.deserialize(f)),void 0!==(f=e(f,c.key,u+1)))return void t(f)}t()}),(function(e,t){r(t)}))}))})).catch(r)}));return s(r,t),r}function Se(e,t,n,r){var o=this;e=d(e);var i=new f((function(i,a){o.ready().then((function(){void 0===t&&(t=null);var u=t,c=o._dbInfo;c.serializer.serialize(t,(function(t,f){f?a(f):c.db.transaction((function(n){_e(n,c,"INSERT OR REPLACE INTO "+c.storeName+" (key, value) VALUES (?, ?)",[e,t],(function(){i(u)}),(function(e,t){a(t)}))}),(function(t){if(t.code===t.QUOTA_ERR){if(r>0)return void i(Se.apply(o,[e,u,n,r-1]));a(t)}}))}))})).catch(a)}));return s(i,n),i}function xe(e,t,n){return Se.apply(this,[e,t,n,1])}function Ee(e,t){var n=this;e=d(e);var r=new f((function(t,r){n.ready().then((function(){var o=n._dbInfo;o.db.transaction((function(n){_e(n,o,"DELETE FROM "+o.storeName+" WHERE key = ?",[e],(function(){t()}),(function(e,t){r(t)}))}))})).catch(r)}));return s(r,t),r}function Ne(e){var t=this,n=new f((function(e,n){t.ready().then((function(){var r=t._dbInfo;r.db.transaction((function(t){_e(t,r,"DELETE FROM "+r.storeName,[],(function(){e()}),(function(e,t){n(t)}))}))})).catch(n)}));return s(n,e),n}function je(e){var t=this,n=new f((function(e,n){t.ready().then((function(){var r=t._dbInfo;r.db.transaction((function(t){_e(t,r,"SELECT COUNT(key) as c FROM "+r.storeName,[],(function(t,n){var r=n.rows.item(0).c;e(r)}),(function(e,t){n(t)}))}))})).catch(n)}));return s(n,e),n}function ke(e,t){var n=this,r=new f((function(t,r){n.ready().then((function(){var o=n._dbInfo;o.db.transaction((function(n){_e(n,o,"SELECT key FROM "+o.storeName+" WHERE id = ? LIMIT 1",[e+1],(function(e,n){var r=n.rows.length?n.rows.item(0).key:null;t(r)}),(function(e,t){r(t)}))}))})).catch(r)}));return s(r,t),r}function De(e){var t=this,n=new f((function(e,n){t.ready().then((function(){var r=t._dbInfo;r.db.transaction((function(t){_e(t,r,"SELECT key FROM "+r.storeName,[],(function(t,n){for(var r=[],o=0;o<n.rows.length;o++)r.push(n.rows.item(o).key);e(r)}),(function(e,t){n(t)}))}))})).catch(n)}));return s(n,e),n}function Ae(e){return new f((function(t,n){e.transaction((function(r){r.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name <> '__WebKitDatabaseInfoTable__'",[],(function(n,r){for(var o=[],i=0;i<r.rows.length;i++)o.push(r.rows.item(i).name);t({db:e,storeNames:o})}),(function(e,t){n(t)}))}),(function(e){n(e)}))}))}function Oe(e,t){t=h.apply(this,arguments);var n=this.config();(e="function"!=typeof e&&e||{}).name||(e.name=e.name||n.name,e.storeName=e.storeName||n.storeName);var r,o=this;return s(r=e.name?new f((function(t){var r;r=e.name===n.name?o._dbInfo.db:openDatabase(e.name,"","",0),e.storeName?t({db:r,storeNames:[e.storeName]}):t(Ae(r))})).then((function(e){return new f((function(t,n){e.db.transaction((function(r){function o(e){return new f((function(t,n){r.executeSql("DROP TABLE IF EXISTS "+e,[],(function(){t()}),(function(e,t){n(t)}))}))}for(var i=[],a=0,u=e.storeNames.length;a<u;a++)i.push(o(e.storeNames[a]));f.all(i).then((function(){t()})).catch((function(e){n(e)}))}),(function(e){n(e)}))}))})):f.reject("Invalid arguments"),t),r}var Re={_driver:"webSQLStorage",_initStorage:me,_support:Q(),iterate:Ie,getItem:we,setItem:xe,removeItem:Ee,clear:Ne,length:je,key:ke,keys:De,dropInstance:Oe};function Ce(){try{return"undefined"!=typeof localStorage&&"setItem"in localStorage&&!!localStorage.setItem}catch(e){return!1}}function Be(e,t){var n=e.name+"/";return e.storeName!==t.storeName&&(n+=e.storeName+"/"),n}function Te(){var e="_localforage_support_test";try{return localStorage.setItem(e,!0),localStorage.removeItem(e),!1}catch(e){return!0}}function $e(){return!Te()||localStorage.length>0}function Me(e){var t=this,n={};if(e)for(var r in e)n[r]=e[r];return n.keyPrefix=Be(e,t._defaultConfig),$e()?(t._dbInfo=n,n.serializer=ye,f.resolve()):f.reject()}function Fe(e){var t=this,n=t.ready().then((function(){for(var e=t._dbInfo.keyPrefix,n=localStorage.length-1;n>=0;n--){var r=localStorage.key(n);0===r.indexOf(e)&&localStorage.removeItem(r)}}));return s(n,e),n}function Le(e,t){var n=this;e=d(e);var r=n.ready().then((function(){var t=n._dbInfo,r=localStorage.getItem(t.keyPrefix+e);return r&&(r=t.serializer.deserialize(r)),r}));return s(r,t),r}function Pe(e,t){var n=this,r=n.ready().then((function(){for(var t=n._dbInfo,r=t.keyPrefix,o=r.length,i=localStorage.length,a=1,u=0;u<i;u++){var c=localStorage.key(u);if(0===c.indexOf(r)){var f=localStorage.getItem(c);if(f&&(f=t.serializer.deserialize(f)),void 0!==(f=e(f,c.substring(o),a++)))return f}}}));return s(r,t),r}function ze(e,t){var n=this,r=n.ready().then((function(){var t,r=n._dbInfo;try{t=localStorage.key(e)}catch(e){t=null}return t&&(t=t.substring(r.keyPrefix.length)),t}));return s(r,t),r}function Ue(e){var t=this,n=t.ready().then((function(){for(var e=t._dbInfo,n=localStorage.length,r=[],o=0;o<n;o++){var i=localStorage.key(o);0===i.indexOf(e.keyPrefix)&&r.push(i.substring(e.keyPrefix.length))}return r}));return s(n,e),n}function qe(e){var t=this.keys().then((function(e){return e.length}));return s(t,e),t}function We(e,t){var n=this;e=d(e);var r=n.ready().then((function(){var t=n._dbInfo;localStorage.removeItem(t.keyPrefix+e)}));return s(r,t),r}function He(e,t,n){var r=this;e=d(e);var o=r.ready().then((function(){void 0===t&&(t=null);var n=t;return new f((function(o,i){var a=r._dbInfo;a.serializer.serialize(t,(function(t,r){if(r)i(r);else try{localStorage.setItem(a.keyPrefix+e,t),o(n)}catch(e){"QuotaExceededError"!==e.name&&"NS_ERROR_DOM_QUOTA_REACHED"!==e.name||i(e),i(e)}}))}))}));return s(o,n),o}function Je(e,t){if(t=h.apply(this,arguments),!(e="function"!=typeof e&&e||{}).name){var n=this.config();e.name=e.name||n.name,e.storeName=e.storeName||n.storeName}var r,o=this;return s(r=e.name?new f((function(t){e.storeName?t(Be(e,o._defaultConfig)):t(e.name+"/")})).then((function(e){for(var t=localStorage.length-1;t>=0;t--){var n=localStorage.key(t);0===n.indexOf(e)&&localStorage.removeItem(n)}})):f.reject("Invalid arguments"),t),r}var Ke={_driver:"localStorageWrapper",_initStorage:Me,_support:Ce(),iterate:Pe,getItem:Le,setItem:He,removeItem:We,clear:Fe,length:qe,key:ze,keys:Ue,dropInstance:Je},Qe=function(e,t){return e===t||"number"==typeof e&&"number"==typeof t&&isNaN(e)&&isNaN(t)},Xe=function(e,t){for(var n=e.length,r=0;r<n;){if(Qe(e[r],t))return!0;r++}return!1},Ge=Array.isArray||function(e){return"[object Array]"===Object.prototype.toString.call(e)},Ve={},Ye={},Ze={INDEXEDDB:K,WEBSQL:Re,LOCALSTORAGE:Ke},et=[Ze.INDEXEDDB._driver,Ze.WEBSQL._driver,Ze.LOCALSTORAGE._driver],tt=["dropInstance"],nt=["clear","getItem","iterate","key","keys","length","removeItem","setItem"].concat(tt),rt={description:"",driver:et.slice(),name:"localforage",size:4980736,storeName:"keyvaluepairs",version:1};function ot(e,t){e[t]=function(){var n=arguments;return e.ready().then((function(){return e[t].apply(e,n)}))}}function it(){for(var e=1;e<arguments.length;e++){var t=arguments[e];if(t)for(var n in t)t.hasOwnProperty(n)&&(Ge(t[n])?arguments[0][n]=t[n].slice():arguments[0][n]=t[n])}return arguments[0]}var at=new(function(){function e(t){for(var n in o(this,e),Ze)if(Ze.hasOwnProperty(n)){var r=Ze[n],i=r._driver;this[n]=i,Ve[i]||this.defineDriver(r)}this._defaultConfig=it({},rt),this._config=it({},this._defaultConfig,t),this._driverSet=null,this._initDriver=null,this._ready=!1,this._dbInfo=null,this._wrapLibraryMethodsWithReady(),this.setDriver(this._config.driver).catch((function(){}))}return e.prototype.config=function(e){if("object"===(void 0===e?"undefined":r(e))){if(this._ready)return new Error("Can't call config() after localforage has been used.");for(var t in e){if("storeName"===t&&(e[t]=e[t].replace(/\W/g,"_")),"version"===t&&"number"!=typeof e[t])return new Error("Database version must be a number.");this._config[t]=e[t]}return!("driver"in e)||!e.driver||this.setDriver(this._config.driver)}return"string"==typeof e?this._config[e]:this._config},e.prototype.defineDriver=function(e,t,n){var r=new f((function(t,n){try{var r=e._driver,o=new Error("Custom driver not compliant; see https://mozilla.github.io/localForage/#definedriver");if(!e._driver)return void n(o);for(var i=nt.concat("_initStorage"),a=0,u=i.length;a<u;a++){var c=i[a];if((!Xe(tt,c)||e[c])&&"function"!=typeof e[c])return void n(o)}!function(){for(var t=function(e){return function(){var t=new Error("Method "+e+" is not implemented by the current driver"),n=f.reject(t);return s(n,arguments[arguments.length-1]),n}},n=0,r=tt.length;n<r;n++){var o=tt[n];e[o]||(e[o]=t(o))}}();var l=function(n){Ve[r]&&console.info("Redefining LocalForage driver: "+r),Ve[r]=e,Ye[r]=n,t()};"_support"in e?e._support&&"function"==typeof e._support?e._support().then(l,n):l(!!e._support):l(!0)}catch(e){n(e)}}));return l(r,t,n),r},e.prototype.driver=function(){return this._driver||null},e.prototype.getDriver=function(e,t,n){var r=Ve[e]?f.resolve(Ve[e]):f.reject(new Error("Driver not found."));return l(r,t,n),r},e.prototype.getSerializer=function(e){var t=f.resolve(ye);return l(t,e),t},e.prototype.ready=function(e){var t=this,n=t._driverSet.then((function(){return null===t._ready&&(t._ready=t._initDriver()),t._ready}));return l(n,e,e),n},e.prototype.setDriver=function(e,t,n){var r=this;Ge(e)||(e=[e]);var o=this._getSupportedDrivers(e);function i(){r._config.driver=r.driver()}function a(e){return r._extend(e),i(),r._ready=r._initStorage(r._config),r._ready}function u(e){return function(){var t=0;function n(){for(;t<e.length;){var o=e[t];return t++,r._dbInfo=null,r._ready=null,r.getDriver(o).then(a).catch(n)}i();var u=new Error("No available storage method found.");return r._driverSet=f.reject(u),r._driverSet}return n()}}var c=null!==this._driverSet?this._driverSet.catch((function(){return f.resolve()})):f.resolve();return this._driverSet=c.then((function(){var e=o[0];return r._dbInfo=null,r._ready=null,r.getDriver(e).then((function(e){r._driver=e._driver,i(),r._wrapLibraryMethodsWithReady(),r._initDriver=u(o)}))})).catch((function(){i();var e=new Error("No available storage method found.");return r._driverSet=f.reject(e),r._driverSet})),l(this._driverSet,t,n),this._driverSet},e.prototype.supports=function(e){return!!Ye[e]},e.prototype._extend=function(e){it(this,e)},e.prototype._getSupportedDrivers=function(e){for(var t=[],n=0,r=e.length;n<r;n++){var o=e[n];this.supports(o)&&t.push(o)}return t},e.prototype._wrapLibraryMethodsWithReady=function(){for(var e=0,t=nt.length;e<t;e++)ot(this,nt[e])},e.prototype.createInstance=function(t){return new e(t)},e}());t.exports=at},{3:3}]},{},[4])(4)}(J={path:H,exports:{},require:function(e,t){return W(null==t&&J.path)}},J.exports),J.exports);function Q(e,t,n){const r=e.slice();return r[10]=t[n],r}function X(e){let t,n;return t=new U({props:{habit:e[10],handleDelete:e[4]}}),{c(){var e;(e=t.$$.fragment)&&e.c()},m(e,r){B(t,e,r),n=!0},p(e,n){const r={};1&n&&(r.habit=e[10]),t.$set(r)},i(e){n||(R(t.$$.fragment,e),n=!0)},o(e){C(t.$$.fragment,e),n=!1},d(e){T(t,e)}}}function G(e){let t,n,o,i,a,l,p,b,y,g,m,_=e[0],w=[];for(let t=0;t<_.length;t+=1)w[t]=X(Q(e,_,t));const I=e=>C(w[e],1,1,()=>{w[e]=null});return{c(){t=s("main");for(let e=0;e<w.length;e+=1)w[e].c();n=d(),o=s("div"),i=s("button"),i.textContent="Create new habit",a=d(),l=s("button"),l.textContent="Reset habits",p=d(),b=s("button"),b.textContent="Save habits",v(i,"class","bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded m-2"),v(l,"class","bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded m-2"),v(b,"class","bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded m-2"),v(o,"class","flex justify-center"),v(t,"charset","UTF-8")},m(r,f){c(r,t,f);for(let e=0;e<w.length;e+=1)w[e].m(t,null);u(t,n),u(t,o),u(o,i),u(o,a),u(o,l),u(o,p),u(o,b),y=!0,g||(m=[h(i,"click",e[2]),h(l,"click",e[3]),h(b,"click",e[1])],g=!0)},p(e,[o]){if(17&o){let i;for(_=e[0],i=0;i<_.length;i+=1){const r=Q(e,_,i);w[i]?(w[i].p(r,o),R(w[i],1)):(w[i]=X(r),w[i].c(),R(w[i],1),w[i].m(t,n))}for(O={r:0,c:[],p:O},i=_.length;i<w.length;i+=1)I(i);O.r||r(O.c),O=O.p}},i(e){if(!y){for(let e=0;e<_.length;e+=1)R(w[e]);y=!0}},o(e){w=w.filter(Boolean);for(let e=0;e<w.length;e+=1)C(w[e]);y=!1},d(e){e&&f(t),function(e,t){for(let n=0;n<e.length;n+=1)e[n]&&e[n].d(t)}(w,e),g=!1,r(m)}}}function V(e,t,n){const r="incomplete";class o{constructor(){var e;this.id=(e=(new Date).getTime(),"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,(function(t){var n=(e+16*Math.random())%16|0;return e=Math.floor(e/16),("x"==t?n:3&n|8).toString(16)}))),this.name="",this.duration=300,this.hitCount=0,this.habitState=r}}let i,a=[];async function u(){console.log("Saving habits"),await K.setItem("habits",JSON.stringify([...i.values()]))}function c(){n(0,a=Array.from(i.values())),u()}return g(async()=>{console.log("onMount triggered"),i=await async function(){let e,t=new Map;return console.log("Loading habits"),await K.getItem("habits").then(n=>{if(e=JSON.parse(n),0!=e.length)for(let n of e)t.set(n.id,n);else t=new Map}).catch(n=>{console.log(n),e=new Array,t=new Map}),console.log("Loaded objects:"),console.log("loadedHabits:"),console.log(e),console.log("HabitMap:"),console.log(t),t}(),await c()}),[a,u,function(){let e=new o;console.log("addHabit"),console.log(i),i.set(e.id,e),c()},async function(){await K.removeItem("habits"),i=new Map,c()},function(e){console.log(JSON.stringify(i.get(e))),i.delete(e),c()}]}return new class extends F{constructor(e){super(),M(this,e,V,G,i,{})}}({target:document.body,props:{name:"world"}})}();
//# sourceMappingURL=bundle.js.map
