(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const c of a.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function t(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(s){if(s.ep)return;s.ep=!0;const a=t(s);fetch(s.href,a)}})();function y_(o){return o&&o.__esModule&&Object.prototype.hasOwnProperty.call(o,"default")?o.default:o}var cd={exports:{}},ua={},ud={exports:{}},yt={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Bm;function j0(){if(Bm)return yt;Bm=1;var o=Symbol.for("react.element"),e=Symbol.for("react.portal"),t=Symbol.for("react.fragment"),i=Symbol.for("react.strict_mode"),s=Symbol.for("react.profiler"),a=Symbol.for("react.provider"),c=Symbol.for("react.context"),u=Symbol.for("react.forward_ref"),h=Symbol.for("react.suspense"),f=Symbol.for("react.memo"),m=Symbol.for("react.lazy"),g=Symbol.iterator;function _(U){return U===null||typeof U!="object"?null:(U=g&&U[g]||U["@@iterator"],typeof U=="function"?U:null)}var y={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},M=Object.assign,E={};function S(U,ne,Le){this.props=U,this.context=ne,this.refs=E,this.updater=Le||y}S.prototype.isReactComponent={},S.prototype.setState=function(U,ne){if(typeof U!="object"&&typeof U!="function"&&U!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,U,ne,"setState")},S.prototype.forceUpdate=function(U){this.updater.enqueueForceUpdate(this,U,"forceUpdate")};function x(){}x.prototype=S.prototype;function D(U,ne,Le){this.props=U,this.context=ne,this.refs=E,this.updater=Le||y}var L=D.prototype=new x;L.constructor=D,M(L,S.prototype),L.isPureReactComponent=!0;var b=Array.isArray,V=Object.prototype.hasOwnProperty,k={current:null},F={key:!0,ref:!0,__self:!0,__source:!0};function X(U,ne,Le){var Q,he={},ge=null,pe=null;if(ne!=null)for(Q in ne.ref!==void 0&&(pe=ne.ref),ne.key!==void 0&&(ge=""+ne.key),ne)V.call(ne,Q)&&!F.hasOwnProperty(Q)&&(he[Q]=ne[Q]);var Re=arguments.length-2;if(Re===1)he.children=Le;else if(1<Re){for(var Pe=Array(Re),Oe=0;Oe<Re;Oe++)Pe[Oe]=arguments[Oe+2];he.children=Pe}if(U&&U.defaultProps)for(Q in Re=U.defaultProps,Re)he[Q]===void 0&&(he[Q]=Re[Q]);return{$$typeof:o,type:U,key:ge,ref:pe,props:he,_owner:k.current}}function C(U,ne){return{$$typeof:o,type:U.type,key:ne,ref:U.ref,props:U.props,_owner:U._owner}}function R(U){return typeof U=="object"&&U!==null&&U.$$typeof===o}function H(U){var ne={"=":"=0",":":"=2"};return"$"+U.replace(/[=:]/g,function(Le){return ne[Le]})}var J=/\/+/g;function K(U,ne){return typeof U=="object"&&U!==null&&U.key!=null?H(""+U.key):ne.toString(36)}function fe(U,ne,Le,Q,he){var ge=typeof U;(ge==="undefined"||ge==="boolean")&&(U=null);var pe=!1;if(U===null)pe=!0;else switch(ge){case"string":case"number":pe=!0;break;case"object":switch(U.$$typeof){case o:case e:pe=!0}}if(pe)return pe=U,he=he(pe),U=Q===""?"."+K(pe,0):Q,b(he)?(Le="",U!=null&&(Le=U.replace(J,"$&/")+"/"),fe(he,ne,Le,"",function(Oe){return Oe})):he!=null&&(R(he)&&(he=C(he,Le+(!he.key||pe&&pe.key===he.key?"":(""+he.key).replace(J,"$&/")+"/")+U)),ne.push(he)),1;if(pe=0,Q=Q===""?".":Q+":",b(U))for(var Re=0;Re<U.length;Re++){ge=U[Re];var Pe=Q+K(ge,Re);pe+=fe(ge,ne,Le,Pe,he)}else if(Pe=_(U),typeof Pe=="function")for(U=Pe.call(U),Re=0;!(ge=U.next()).done;)ge=ge.value,Pe=Q+K(ge,Re++),pe+=fe(ge,ne,Le,Pe,he);else if(ge==="object")throw ne=String(U),Error("Objects are not valid as a React child (found: "+(ne==="[object Object]"?"object with keys {"+Object.keys(U).join(", ")+"}":ne)+"). If you meant to render a collection of children, use an array instead.");return pe}function ue(U,ne,Le){if(U==null)return U;var Q=[],he=0;return fe(U,Q,"","",function(ge){return ne.call(Le,ge,he++)}),Q}function ce(U){if(U._status===-1){var ne=U._result;ne=ne(),ne.then(function(Le){(U._status===0||U._status===-1)&&(U._status=1,U._result=Le)},function(Le){(U._status===0||U._status===-1)&&(U._status=2,U._result=Le)}),U._status===-1&&(U._status=0,U._result=ne)}if(U._status===1)return U._result.default;throw U._result}var de={current:null},O={transition:null},le={ReactCurrentDispatcher:de,ReactCurrentBatchConfig:O,ReactCurrentOwner:k};function oe(){throw Error("act(...) is not supported in production builds of React.")}return yt.Children={map:ue,forEach:function(U,ne,Le){ue(U,function(){ne.apply(this,arguments)},Le)},count:function(U){var ne=0;return ue(U,function(){ne++}),ne},toArray:function(U){return ue(U,function(ne){return ne})||[]},only:function(U){if(!R(U))throw Error("React.Children.only expected to receive a single React element child.");return U}},yt.Component=S,yt.Fragment=t,yt.Profiler=s,yt.PureComponent=D,yt.StrictMode=i,yt.Suspense=h,yt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=le,yt.act=oe,yt.cloneElement=function(U,ne,Le){if(U==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+U+".");var Q=M({},U.props),he=U.key,ge=U.ref,pe=U._owner;if(ne!=null){if(ne.ref!==void 0&&(ge=ne.ref,pe=k.current),ne.key!==void 0&&(he=""+ne.key),U.type&&U.type.defaultProps)var Re=U.type.defaultProps;for(Pe in ne)V.call(ne,Pe)&&!F.hasOwnProperty(Pe)&&(Q[Pe]=ne[Pe]===void 0&&Re!==void 0?Re[Pe]:ne[Pe])}var Pe=arguments.length-2;if(Pe===1)Q.children=Le;else if(1<Pe){Re=Array(Pe);for(var Oe=0;Oe<Pe;Oe++)Re[Oe]=arguments[Oe+2];Q.children=Re}return{$$typeof:o,type:U.type,key:he,ref:ge,props:Q,_owner:pe}},yt.createContext=function(U){return U={$$typeof:c,_currentValue:U,_currentValue2:U,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},U.Provider={$$typeof:a,_context:U},U.Consumer=U},yt.createElement=X,yt.createFactory=function(U){var ne=X.bind(null,U);return ne.type=U,ne},yt.createRef=function(){return{current:null}},yt.forwardRef=function(U){return{$$typeof:u,render:U}},yt.isValidElement=R,yt.lazy=function(U){return{$$typeof:m,_payload:{_status:-1,_result:U},_init:ce}},yt.memo=function(U,ne){return{$$typeof:f,type:U,compare:ne===void 0?null:ne}},yt.startTransition=function(U){var ne=O.transition;O.transition={};try{U()}finally{O.transition=ne}},yt.unstable_act=oe,yt.useCallback=function(U,ne){return de.current.useCallback(U,ne)},yt.useContext=function(U){return de.current.useContext(U)},yt.useDebugValue=function(){},yt.useDeferredValue=function(U){return de.current.useDeferredValue(U)},yt.useEffect=function(U,ne){return de.current.useEffect(U,ne)},yt.useId=function(){return de.current.useId()},yt.useImperativeHandle=function(U,ne,Le){return de.current.useImperativeHandle(U,ne,Le)},yt.useInsertionEffect=function(U,ne){return de.current.useInsertionEffect(U,ne)},yt.useLayoutEffect=function(U,ne){return de.current.useLayoutEffect(U,ne)},yt.useMemo=function(U,ne){return de.current.useMemo(U,ne)},yt.useReducer=function(U,ne,Le){return de.current.useReducer(U,ne,Le)},yt.useRef=function(U){return de.current.useRef(U)},yt.useState=function(U){return de.current.useState(U)},yt.useSyncExternalStore=function(U,ne,Le){return de.current.useSyncExternalStore(U,ne,Le)},yt.useTransition=function(){return de.current.useTransition()},yt.version="18.3.1",yt}var zm;function Wh(){return zm||(zm=1,ud.exports=j0()),ud.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Hm;function X0(){if(Hm)return ua;Hm=1;var o=Wh(),e=Symbol.for("react.element"),t=Symbol.for("react.fragment"),i=Object.prototype.hasOwnProperty,s=o.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,a={key:!0,ref:!0,__self:!0,__source:!0};function c(u,h,f){var m,g={},_=null,y=null;f!==void 0&&(_=""+f),h.key!==void 0&&(_=""+h.key),h.ref!==void 0&&(y=h.ref);for(m in h)i.call(h,m)&&!a.hasOwnProperty(m)&&(g[m]=h[m]);if(u&&u.defaultProps)for(m in h=u.defaultProps,h)g[m]===void 0&&(g[m]=h[m]);return{$$typeof:e,type:u,key:_,ref:y,props:g,_owner:s.current}}return ua.Fragment=t,ua.jsx=c,ua.jsxs=c,ua}var Vm;function Y0(){return Vm||(Vm=1,cd.exports=X0()),cd.exports}var N=Y0(),Ze=Wh();const q0=y_(Ze);var Bl={},dd={exports:{}},jn={},hd={exports:{}},fd={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Gm;function K0(){return Gm||(Gm=1,(function(o){function e(O,le){var oe=O.length;O.push(le);e:for(;0<oe;){var U=oe-1>>>1,ne=O[U];if(0<s(ne,le))O[U]=le,O[oe]=ne,oe=U;else break e}}function t(O){return O.length===0?null:O[0]}function i(O){if(O.length===0)return null;var le=O[0],oe=O.pop();if(oe!==le){O[0]=oe;e:for(var U=0,ne=O.length,Le=ne>>>1;U<Le;){var Q=2*(U+1)-1,he=O[Q],ge=Q+1,pe=O[ge];if(0>s(he,oe))ge<ne&&0>s(pe,he)?(O[U]=pe,O[ge]=oe,U=ge):(O[U]=he,O[Q]=oe,U=Q);else if(ge<ne&&0>s(pe,oe))O[U]=pe,O[ge]=oe,U=ge;else break e}}return le}function s(O,le){var oe=O.sortIndex-le.sortIndex;return oe!==0?oe:O.id-le.id}if(typeof performance=="object"&&typeof performance.now=="function"){var a=performance;o.unstable_now=function(){return a.now()}}else{var c=Date,u=c.now();o.unstable_now=function(){return c.now()-u}}var h=[],f=[],m=1,g=null,_=3,y=!1,M=!1,E=!1,S=typeof setTimeout=="function"?setTimeout:null,x=typeof clearTimeout=="function"?clearTimeout:null,D=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function L(O){for(var le=t(f);le!==null;){if(le.callback===null)i(f);else if(le.startTime<=O)i(f),le.sortIndex=le.expirationTime,e(h,le);else break;le=t(f)}}function b(O){if(E=!1,L(O),!M)if(t(h)!==null)M=!0,ce(V);else{var le=t(f);le!==null&&de(b,le.startTime-O)}}function V(O,le){M=!1,E&&(E=!1,x(X),X=-1),y=!0;var oe=_;try{for(L(le),g=t(h);g!==null&&(!(g.expirationTime>le)||O&&!H());){var U=g.callback;if(typeof U=="function"){g.callback=null,_=g.priorityLevel;var ne=U(g.expirationTime<=le);le=o.unstable_now(),typeof ne=="function"?g.callback=ne:g===t(h)&&i(h),L(le)}else i(h);g=t(h)}if(g!==null)var Le=!0;else{var Q=t(f);Q!==null&&de(b,Q.startTime-le),Le=!1}return Le}finally{g=null,_=oe,y=!1}}var k=!1,F=null,X=-1,C=5,R=-1;function H(){return!(o.unstable_now()-R<C)}function J(){if(F!==null){var O=o.unstable_now();R=O;var le=!0;try{le=F(!0,O)}finally{le?K():(k=!1,F=null)}}else k=!1}var K;if(typeof D=="function")K=function(){D(J)};else if(typeof MessageChannel<"u"){var fe=new MessageChannel,ue=fe.port2;fe.port1.onmessage=J,K=function(){ue.postMessage(null)}}else K=function(){S(J,0)};function ce(O){F=O,k||(k=!0,K())}function de(O,le){X=S(function(){O(o.unstable_now())},le)}o.unstable_IdlePriority=5,o.unstable_ImmediatePriority=1,o.unstable_LowPriority=4,o.unstable_NormalPriority=3,o.unstable_Profiling=null,o.unstable_UserBlockingPriority=2,o.unstable_cancelCallback=function(O){O.callback=null},o.unstable_continueExecution=function(){M||y||(M=!0,ce(V))},o.unstable_forceFrameRate=function(O){0>O||125<O?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):C=0<O?Math.floor(1e3/O):5},o.unstable_getCurrentPriorityLevel=function(){return _},o.unstable_getFirstCallbackNode=function(){return t(h)},o.unstable_next=function(O){switch(_){case 1:case 2:case 3:var le=3;break;default:le=_}var oe=_;_=le;try{return O()}finally{_=oe}},o.unstable_pauseExecution=function(){},o.unstable_requestPaint=function(){},o.unstable_runWithPriority=function(O,le){switch(O){case 1:case 2:case 3:case 4:case 5:break;default:O=3}var oe=_;_=O;try{return le()}finally{_=oe}},o.unstable_scheduleCallback=function(O,le,oe){var U=o.unstable_now();switch(typeof oe=="object"&&oe!==null?(oe=oe.delay,oe=typeof oe=="number"&&0<oe?U+oe:U):oe=U,O){case 1:var ne=-1;break;case 2:ne=250;break;case 5:ne=1073741823;break;case 4:ne=1e4;break;default:ne=5e3}return ne=oe+ne,O={id:m++,callback:le,priorityLevel:O,startTime:oe,expirationTime:ne,sortIndex:-1},oe>U?(O.sortIndex=oe,e(f,O),t(h)===null&&O===t(f)&&(E?(x(X),X=-1):E=!0,de(b,oe-U))):(O.sortIndex=ne,e(h,O),M||y||(M=!0,ce(V))),O},o.unstable_shouldYield=H,o.unstable_wrapCallback=function(O){var le=_;return function(){var oe=_;_=le;try{return O.apply(this,arguments)}finally{_=oe}}}})(fd)),fd}var Wm;function $0(){return Wm||(Wm=1,hd.exports=K0()),hd.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var jm;function Z0(){if(jm)return jn;jm=1;var o=Wh(),e=$0();function t(n){for(var r="https://reactjs.org/docs/error-decoder.html?invariant="+n,l=1;l<arguments.length;l++)r+="&args[]="+encodeURIComponent(arguments[l]);return"Minified React error #"+n+"; visit "+r+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var i=new Set,s={};function a(n,r){c(n,r),c(n+"Capture",r)}function c(n,r){for(s[n]=r,n=0;n<r.length;n++)i.add(r[n])}var u=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),h=Object.prototype.hasOwnProperty,f=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,m={},g={};function _(n){return h.call(g,n)?!0:h.call(m,n)?!1:f.test(n)?g[n]=!0:(m[n]=!0,!1)}function y(n,r,l,d){if(l!==null&&l.type===0)return!1;switch(typeof r){case"function":case"symbol":return!0;case"boolean":return d?!1:l!==null?!l.acceptsBooleans:(n=n.toLowerCase().slice(0,5),n!=="data-"&&n!=="aria-");default:return!1}}function M(n,r,l,d){if(r===null||typeof r>"u"||y(n,r,l,d))return!0;if(d)return!1;if(l!==null)switch(l.type){case 3:return!r;case 4:return r===!1;case 5:return isNaN(r);case 6:return isNaN(r)||1>r}return!1}function E(n,r,l,d,p,v,T){this.acceptsBooleans=r===2||r===3||r===4,this.attributeName=d,this.attributeNamespace=p,this.mustUseProperty=l,this.propertyName=n,this.type=r,this.sanitizeURL=v,this.removeEmptyString=T}var S={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n){S[n]=new E(n,0,!1,n,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(n){var r=n[0];S[r]=new E(r,1,!1,n[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(n){S[n]=new E(n,2,!1,n.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(n){S[n]=new E(n,2,!1,n,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n){S[n]=new E(n,3,!1,n.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(n){S[n]=new E(n,3,!0,n,null,!1,!1)}),["capture","download"].forEach(function(n){S[n]=new E(n,4,!1,n,null,!1,!1)}),["cols","rows","size","span"].forEach(function(n){S[n]=new E(n,6,!1,n,null,!1,!1)}),["rowSpan","start"].forEach(function(n){S[n]=new E(n,5,!1,n.toLowerCase(),null,!1,!1)});var x=/[\-:]([a-z])/g;function D(n){return n[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n){var r=n.replace(x,D);S[r]=new E(r,1,!1,n,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n){var r=n.replace(x,D);S[r]=new E(r,1,!1,n,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(n){var r=n.replace(x,D);S[r]=new E(r,1,!1,n,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(n){S[n]=new E(n,1,!1,n.toLowerCase(),null,!1,!1)}),S.xlinkHref=new E("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(n){S[n]=new E(n,1,!1,n.toLowerCase(),null,!0,!0)});function L(n,r,l,d){var p=S.hasOwnProperty(r)?S[r]:null;(p!==null?p.type!==0:d||!(2<r.length)||r[0]!=="o"&&r[0]!=="O"||r[1]!=="n"&&r[1]!=="N")&&(M(r,l,p,d)&&(l=null),d||p===null?_(r)&&(l===null?n.removeAttribute(r):n.setAttribute(r,""+l)):p.mustUseProperty?n[p.propertyName]=l===null?p.type===3?!1:"":l:(r=p.attributeName,d=p.attributeNamespace,l===null?n.removeAttribute(r):(p=p.type,l=p===3||p===4&&l===!0?"":""+l,d?n.setAttributeNS(d,r,l):n.setAttribute(r,l))))}var b=o.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,V=Symbol.for("react.element"),k=Symbol.for("react.portal"),F=Symbol.for("react.fragment"),X=Symbol.for("react.strict_mode"),C=Symbol.for("react.profiler"),R=Symbol.for("react.provider"),H=Symbol.for("react.context"),J=Symbol.for("react.forward_ref"),K=Symbol.for("react.suspense"),fe=Symbol.for("react.suspense_list"),ue=Symbol.for("react.memo"),ce=Symbol.for("react.lazy"),de=Symbol.for("react.offscreen"),O=Symbol.iterator;function le(n){return n===null||typeof n!="object"?null:(n=O&&n[O]||n["@@iterator"],typeof n=="function"?n:null)}var oe=Object.assign,U;function ne(n){if(U===void 0)try{throw Error()}catch(l){var r=l.stack.trim().match(/\n( *(at )?)/);U=r&&r[1]||""}return`
`+U+n}var Le=!1;function Q(n,r){if(!n||Le)return"";Le=!0;var l=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(r)if(r=function(){throw Error()},Object.defineProperty(r.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(r,[])}catch(ie){var d=ie}Reflect.construct(n,[],r)}else{try{r.call()}catch(ie){d=ie}n.call(r.prototype)}else{try{throw Error()}catch(ie){d=ie}n()}}catch(ie){if(ie&&d&&typeof ie.stack=="string"){for(var p=ie.stack.split(`
`),v=d.stack.split(`
`),T=p.length-1,I=v.length-1;1<=T&&0<=I&&p[T]!==v[I];)I--;for(;1<=T&&0<=I;T--,I--)if(p[T]!==v[I]){if(T!==1||I!==1)do if(T--,I--,0>I||p[T]!==v[I]){var z=`
`+p[T].replace(" at new "," at ");return n.displayName&&z.includes("<anonymous>")&&(z=z.replace("<anonymous>",n.displayName)),z}while(1<=T&&0<=I);break}}}finally{Le=!1,Error.prepareStackTrace=l}return(n=n?n.displayName||n.name:"")?ne(n):""}function he(n){switch(n.tag){case 5:return ne(n.type);case 16:return ne("Lazy");case 13:return ne("Suspense");case 19:return ne("SuspenseList");case 0:case 2:case 15:return n=Q(n.type,!1),n;case 11:return n=Q(n.type.render,!1),n;case 1:return n=Q(n.type,!0),n;default:return""}}function ge(n){if(n==null)return null;if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n;switch(n){case F:return"Fragment";case k:return"Portal";case C:return"Profiler";case X:return"StrictMode";case K:return"Suspense";case fe:return"SuspenseList"}if(typeof n=="object")switch(n.$$typeof){case H:return(n.displayName||"Context")+".Consumer";case R:return(n._context.displayName||"Context")+".Provider";case J:var r=n.render;return n=n.displayName,n||(n=r.displayName||r.name||"",n=n!==""?"ForwardRef("+n+")":"ForwardRef"),n;case ue:return r=n.displayName||null,r!==null?r:ge(n.type)||"Memo";case ce:r=n._payload,n=n._init;try{return ge(n(r))}catch{}}return null}function pe(n){var r=n.type;switch(n.tag){case 24:return"Cache";case 9:return(r.displayName||"Context")+".Consumer";case 10:return(r._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return n=r.render,n=n.displayName||n.name||"",r.displayName||(n!==""?"ForwardRef("+n+")":"ForwardRef");case 7:return"Fragment";case 5:return r;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return ge(r);case 8:return r===X?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof r=="function")return r.displayName||r.name||null;if(typeof r=="string")return r}return null}function Re(n){switch(typeof n){case"boolean":case"number":case"string":case"undefined":return n;case"object":return n;default:return""}}function Pe(n){var r=n.type;return(n=n.nodeName)&&n.toLowerCase()==="input"&&(r==="checkbox"||r==="radio")}function Oe(n){var r=Pe(n)?"checked":"value",l=Object.getOwnPropertyDescriptor(n.constructor.prototype,r),d=""+n[r];if(!n.hasOwnProperty(r)&&typeof l<"u"&&typeof l.get=="function"&&typeof l.set=="function"){var p=l.get,v=l.set;return Object.defineProperty(n,r,{configurable:!0,get:function(){return p.call(this)},set:function(T){d=""+T,v.call(this,T)}}),Object.defineProperty(n,r,{enumerable:l.enumerable}),{getValue:function(){return d},setValue:function(T){d=""+T},stopTracking:function(){n._valueTracker=null,delete n[r]}}}}function Et(n){n._valueTracker||(n._valueTracker=Oe(n))}function st(n){if(!n)return!1;var r=n._valueTracker;if(!r)return!0;var l=r.getValue(),d="";return n&&(d=Pe(n)?n.checked?"true":"false":n.value),n=d,n!==l?(r.setValue(n),!0):!1}function Rt(n){if(n=n||(typeof document<"u"?document:void 0),typeof n>"u")return null;try{return n.activeElement||n.body}catch{return n.body}}function B(n,r){var l=r.checked;return oe({},r,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:l??n._wrapperState.initialChecked})}function Yt(n,r){var l=r.defaultValue==null?"":r.defaultValue,d=r.checked!=null?r.checked:r.defaultChecked;l=Re(r.value!=null?r.value:l),n._wrapperState={initialChecked:d,initialValue:l,controlled:r.type==="checkbox"||r.type==="radio"?r.checked!=null:r.value!=null}}function it(n,r){r=r.checked,r!=null&&L(n,"checked",r,!1)}function gt(n,r){it(n,r);var l=Re(r.value),d=r.type;if(l!=null)d==="number"?(l===0&&n.value===""||n.value!=l)&&(n.value=""+l):n.value!==""+l&&(n.value=""+l);else if(d==="submit"||d==="reset"){n.removeAttribute("value");return}r.hasOwnProperty("value")?Dt(n,r.type,l):r.hasOwnProperty("defaultValue")&&Dt(n,r.type,Re(r.defaultValue)),r.checked==null&&r.defaultChecked!=null&&(n.defaultChecked=!!r.defaultChecked)}function Ke(n,r,l){if(r.hasOwnProperty("value")||r.hasOwnProperty("defaultValue")){var d=r.type;if(!(d!=="submit"&&d!=="reset"||r.value!==void 0&&r.value!==null))return;r=""+n._wrapperState.initialValue,l||r===n.value||(n.value=r),n.defaultValue=r}l=n.name,l!==""&&(n.name=""),n.defaultChecked=!!n._wrapperState.initialChecked,l!==""&&(n.name=l)}function Dt(n,r,l){(r!=="number"||Rt(n.ownerDocument)!==n)&&(l==null?n.defaultValue=""+n._wrapperState.initialValue:n.defaultValue!==""+l&&(n.defaultValue=""+l))}var We=Array.isArray;function P(n,r,l,d){if(n=n.options,r){r={};for(var p=0;p<l.length;p++)r["$"+l[p]]=!0;for(l=0;l<n.length;l++)p=r.hasOwnProperty("$"+n[l].value),n[l].selected!==p&&(n[l].selected=p),p&&d&&(n[l].defaultSelected=!0)}else{for(l=""+Re(l),r=null,p=0;p<n.length;p++){if(n[p].value===l){n[p].selected=!0,d&&(n[p].defaultSelected=!0);return}r!==null||n[p].disabled||(r=n[p])}r!==null&&(r.selected=!0)}}function w(n,r){if(r.dangerouslySetInnerHTML!=null)throw Error(t(91));return oe({},r,{value:void 0,defaultValue:void 0,children:""+n._wrapperState.initialValue})}function te(n,r){var l=r.value;if(l==null){if(l=r.children,r=r.defaultValue,l!=null){if(r!=null)throw Error(t(92));if(We(l)){if(1<l.length)throw Error(t(93));l=l[0]}r=l}r==null&&(r=""),l=r}n._wrapperState={initialValue:Re(l)}}function ve(n,r){var l=Re(r.value),d=Re(r.defaultValue);l!=null&&(l=""+l,l!==n.value&&(n.value=l),r.defaultValue==null&&n.defaultValue!==l&&(n.defaultValue=l)),d!=null&&(n.defaultValue=""+d)}function ye(n){var r=n.textContent;r===n._wrapperState.initialValue&&r!==""&&r!==null&&(n.value=r)}function me(n){switch(n){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Xe(n,r){return n==null||n==="http://www.w3.org/1999/xhtml"?me(r):n==="http://www.w3.org/2000/svg"&&r==="foreignObject"?"http://www.w3.org/1999/xhtml":n}var be,ke=(function(n){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(r,l,d,p){MSApp.execUnsafeLocalFunction(function(){return n(r,l,d,p)})}:n})(function(n,r){if(n.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in n)n.innerHTML=r;else{for(be=be||document.createElement("div"),be.innerHTML="<svg>"+r.valueOf().toString()+"</svg>",r=be.firstChild;n.firstChild;)n.removeChild(n.firstChild);for(;r.firstChild;)n.appendChild(r.firstChild)}});function ht(n,r){if(r){var l=n.firstChild;if(l&&l===n.lastChild&&l.nodeType===3){l.nodeValue=r;return}}n.textContent=r}var Ee={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Be=["Webkit","ms","Moz","O"];Object.keys(Ee).forEach(function(n){Be.forEach(function(r){r=r+n.charAt(0).toUpperCase()+n.substring(1),Ee[r]=Ee[n]})});function Ye(n,r,l){return r==null||typeof r=="boolean"||r===""?"":l||typeof r!="number"||r===0||Ee.hasOwnProperty(n)&&Ee[n]?(""+r).trim():r+"px"}function nt(n,r){n=n.style;for(var l in r)if(r.hasOwnProperty(l)){var d=l.indexOf("--")===0,p=Ye(l,r[l],d);l==="float"&&(l="cssFloat"),d?n.setProperty(l,p):n[l]=p}}var ze=oe({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function _t(n,r){if(r){if(ze[n]&&(r.children!=null||r.dangerouslySetInnerHTML!=null))throw Error(t(137,n));if(r.dangerouslySetInnerHTML!=null){if(r.children!=null)throw Error(t(60));if(typeof r.dangerouslySetInnerHTML!="object"||!("__html"in r.dangerouslySetInnerHTML))throw Error(t(61))}if(r.style!=null&&typeof r.style!="object")throw Error(t(62))}}function dt(n,r){if(n.indexOf("-")===-1)return typeof r.is=="string";switch(n){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Ct=null;function j(n){return n=n.target||n.srcElement||window,n.correspondingUseElement&&(n=n.correspondingUseElement),n.nodeType===3?n.parentNode:n}var Ce=null,ae=null,_e=null;function Ie(n){if(n=Ko(n)){if(typeof Ce!="function")throw Error(t(280));var r=n.stateNode;r&&(r=el(r),Ce(n.stateNode,n.type,r))}}function Ne(n){ae?_e?_e.push(n):_e=[n]:ae=n}function at(){if(ae){var n=ae,r=_e;if(_e=ae=null,Ie(n),r)for(n=0;n<r.length;n++)Ie(r[n])}}function kt(n,r){return n(r)}function $(){}var xe=!1;function Ut(n,r,l){if(xe)return n(r,l);xe=!0;try{return kt(n,r,l)}finally{xe=!1,(ae!==null||_e!==null)&&($(),at())}}function Wt(n,r){var l=n.stateNode;if(l===null)return null;var d=el(l);if(d===null)return null;l=d[r];e:switch(r){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(d=!d.disabled)||(n=n.type,d=!(n==="button"||n==="input"||n==="select"||n==="textarea")),n=!d;break e;default:n=!1}if(n)return null;if(l&&typeof l!="function")throw Error(t(231,r,typeof l));return l}var Ai=!1;if(u)try{var Ri={};Object.defineProperty(Ri,"passive",{get:function(){Ai=!0}}),window.addEventListener("test",Ri,Ri),window.removeEventListener("test",Ri,Ri)}catch{Ai=!1}function Hi(n,r,l,d,p,v,T,I,z){var ie=Array.prototype.slice.call(arguments,3);try{r.apply(l,ie)}catch(Me){this.onError(Me)}}var Vi=!1,Xr=null,Yr=!1,ur=null,Da={onError:function(n){Vi=!0,Xr=n}};function Es(n,r,l,d,p,v,T,I,z){Vi=!1,Xr=null,Hi.apply(Da,arguments)}function Ia(n,r,l,d,p,v,T,I,z){if(Es.apply(this,arguments),Vi){if(Vi){var ie=Xr;Vi=!1,Xr=null}else throw Error(t(198));Yr||(Yr=!0,ur=ie)}}function bi(n){var r=n,l=n;if(n.alternate)for(;r.return;)r=r.return;else{n=r;do r=n,(r.flags&4098)!==0&&(l=r.return),n=r.return;while(n)}return r.tag===3?l:null}function Ua(n){if(n.tag===13){var r=n.memoizedState;if(r===null&&(n=n.alternate,n!==null&&(r=n.memoizedState)),r!==null)return r.dehydrated}return null}function Fa(n){if(bi(n)!==n)throw Error(t(188))}function Nc(n){var r=n.alternate;if(!r){if(r=bi(n),r===null)throw Error(t(188));return r!==n?null:n}for(var l=n,d=r;;){var p=l.return;if(p===null)break;var v=p.alternate;if(v===null){if(d=p.return,d!==null){l=d;continue}break}if(p.child===v.child){for(v=p.child;v;){if(v===l)return Fa(p),n;if(v===d)return Fa(p),r;v=v.sibling}throw Error(t(188))}if(l.return!==d.return)l=p,d=v;else{for(var T=!1,I=p.child;I;){if(I===l){T=!0,l=p,d=v;break}if(I===d){T=!0,d=p,l=v;break}I=I.sibling}if(!T){for(I=v.child;I;){if(I===l){T=!0,l=v,d=p;break}if(I===d){T=!0,d=v,l=p;break}I=I.sibling}if(!T)throw Error(t(189))}}if(l.alternate!==d)throw Error(t(190))}if(l.tag!==3)throw Error(t(188));return l.stateNode.current===l?n:r}function Oa(n){return n=Nc(n),n!==null?ka(n):null}function ka(n){if(n.tag===5||n.tag===6)return n;for(n=n.child;n!==null;){var r=ka(n);if(r!==null)return r;n=n.sibling}return null}var A=e.unstable_scheduleCallback,q=e.unstable_cancelCallback,re=e.unstable_shouldYield,se=e.unstable_requestPaint,G=e.unstable_now,we=e.unstable_getCurrentPriorityLevel,De=e.unstable_ImmediatePriority,He=e.unstable_UserBlockingPriority,Ve=e.unstable_NormalPriority,lt=e.unstable_LowPriority,ct=e.unstable_IdlePriority,Qe=null,ft=null;function Pt(n){if(ft&&typeof ft.onCommitFiberRoot=="function")try{ft.onCommitFiberRoot(Qe,n,void 0,(n.current.flags&128)===128)}catch{}}var Lt=Math.clz32?Math.clz32:Je,qt=Math.log,wt=Math.LN2;function Je(n){return n>>>=0,n===0?32:31-(qt(n)/wt|0)|0}var Jt=64,Tt=4194304;function vn(n){switch(n&-n){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return n&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return n}}function ui(n,r){var l=n.pendingLanes;if(l===0)return 0;var d=0,p=n.suspendedLanes,v=n.pingedLanes,T=l&268435455;if(T!==0){var I=T&~p;I!==0?d=vn(I):(v&=T,v!==0&&(d=vn(v)))}else T=l&~p,T!==0?d=vn(T):v!==0&&(d=vn(v));if(d===0)return 0;if(r!==0&&r!==d&&(r&p)===0&&(p=d&-d,v=r&-r,p>=v||p===16&&(v&4194240)!==0))return r;if((d&4)!==0&&(d|=l&16),r=n.entangledLanes,r!==0)for(n=n.entanglements,r&=d;0<r;)l=31-Lt(r),p=1<<l,d|=n[l],r&=~p;return d}function Cn(n,r){switch(n){case 1:case 2:case 4:return r+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return r+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function qr(n,r){for(var l=n.suspendedLanes,d=n.pingedLanes,p=n.expirationTimes,v=n.pendingLanes;0<v;){var T=31-Lt(v),I=1<<T,z=p[T];z===-1?((I&l)===0||(I&d)!==0)&&(p[T]=Cn(I,r)):z<=r&&(n.expiredLanes|=I),v&=~I}}function Bt(n){return n=n.pendingLanes&-1073741825,n!==0?n:n&1073741824?1073741824:0}function Pn(){var n=Jt;return Jt<<=1,(Jt&4194240)===0&&(Jt=64),n}function Sn(n){for(var r=[],l=0;31>l;l++)r.push(n);return r}function tn(n,r,l){n.pendingLanes|=r,r!==536870912&&(n.suspendedLanes=0,n.pingedLanes=0),n=n.eventTimes,r=31-Lt(r),n[r]=l}function Mn(n,r){var l=n.pendingLanes&~r;n.pendingLanes=r,n.suspendedLanes=0,n.pingedLanes=0,n.expiredLanes&=r,n.mutableReadLanes&=r,n.entangledLanes&=r,r=n.entanglements;var d=n.eventTimes;for(n=n.expirationTimes;0<l;){var p=31-Lt(l),v=1<<p;r[p]=0,d[p]=-1,n[p]=-1,l&=~v}}function Kr(n,r){var l=n.entangledLanes|=r;for(n=n.entanglements;l;){var d=31-Lt(l),p=1<<d;p&r|n[d]&r&&(n[d]|=r),l&=~p}}var St=0;function _f(n){return n&=-n,1<n?4<n?(n&268435455)!==0?16:536870912:4:1}var vf,Dc,xf,yf,Sf,Ic=!1,Ba=[],dr=null,hr=null,fr=null,Do=new Map,Io=new Map,pr=[],fv="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Mf(n,r){switch(n){case"focusin":case"focusout":dr=null;break;case"dragenter":case"dragleave":hr=null;break;case"mouseover":case"mouseout":fr=null;break;case"pointerover":case"pointerout":Do.delete(r.pointerId);break;case"gotpointercapture":case"lostpointercapture":Io.delete(r.pointerId)}}function Uo(n,r,l,d,p,v){return n===null||n.nativeEvent!==v?(n={blockedOn:r,domEventName:l,eventSystemFlags:d,nativeEvent:v,targetContainers:[p]},r!==null&&(r=Ko(r),r!==null&&Dc(r)),n):(n.eventSystemFlags|=d,r=n.targetContainers,p!==null&&r.indexOf(p)===-1&&r.push(p),n)}function pv(n,r,l,d,p){switch(r){case"focusin":return dr=Uo(dr,n,r,l,d,p),!0;case"dragenter":return hr=Uo(hr,n,r,l,d,p),!0;case"mouseover":return fr=Uo(fr,n,r,l,d,p),!0;case"pointerover":var v=p.pointerId;return Do.set(v,Uo(Do.get(v)||null,n,r,l,d,p)),!0;case"gotpointercapture":return v=p.pointerId,Io.set(v,Uo(Io.get(v)||null,n,r,l,d,p)),!0}return!1}function Ef(n){var r=$r(n.target);if(r!==null){var l=bi(r);if(l!==null){if(r=l.tag,r===13){if(r=Ua(l),r!==null){n.blockedOn=r,Sf(n.priority,function(){xf(l)});return}}else if(r===3&&l.stateNode.current.memoizedState.isDehydrated){n.blockedOn=l.tag===3?l.stateNode.containerInfo:null;return}}}n.blockedOn=null}function za(n){if(n.blockedOn!==null)return!1;for(var r=n.targetContainers;0<r.length;){var l=Fc(n.domEventName,n.eventSystemFlags,r[0],n.nativeEvent);if(l===null){l=n.nativeEvent;var d=new l.constructor(l.type,l);Ct=d,l.target.dispatchEvent(d),Ct=null}else return r=Ko(l),r!==null&&Dc(r),n.blockedOn=l,!1;r.shift()}return!0}function Tf(n,r,l){za(n)&&l.delete(r)}function mv(){Ic=!1,dr!==null&&za(dr)&&(dr=null),hr!==null&&za(hr)&&(hr=null),fr!==null&&za(fr)&&(fr=null),Do.forEach(Tf),Io.forEach(Tf)}function Fo(n,r){n.blockedOn===r&&(n.blockedOn=null,Ic||(Ic=!0,e.unstable_scheduleCallback(e.unstable_NormalPriority,mv)))}function Oo(n){function r(p){return Fo(p,n)}if(0<Ba.length){Fo(Ba[0],n);for(var l=1;l<Ba.length;l++){var d=Ba[l];d.blockedOn===n&&(d.blockedOn=null)}}for(dr!==null&&Fo(dr,n),hr!==null&&Fo(hr,n),fr!==null&&Fo(fr,n),Do.forEach(r),Io.forEach(r),l=0;l<pr.length;l++)d=pr[l],d.blockedOn===n&&(d.blockedOn=null);for(;0<pr.length&&(l=pr[0],l.blockedOn===null);)Ef(l),l.blockedOn===null&&pr.shift()}var Ts=b.ReactCurrentBatchConfig,Ha=!0;function gv(n,r,l,d){var p=St,v=Ts.transition;Ts.transition=null;try{St=1,Uc(n,r,l,d)}finally{St=p,Ts.transition=v}}function _v(n,r,l,d){var p=St,v=Ts.transition;Ts.transition=null;try{St=4,Uc(n,r,l,d)}finally{St=p,Ts.transition=v}}function Uc(n,r,l,d){if(Ha){var p=Fc(n,r,l,d);if(p===null)Jc(n,r,d,Va,l),Mf(n,d);else if(pv(p,n,r,l,d))d.stopPropagation();else if(Mf(n,d),r&4&&-1<fv.indexOf(n)){for(;p!==null;){var v=Ko(p);if(v!==null&&vf(v),v=Fc(n,r,l,d),v===null&&Jc(n,r,d,Va,l),v===p)break;p=v}p!==null&&d.stopPropagation()}else Jc(n,r,d,null,l)}}var Va=null;function Fc(n,r,l,d){if(Va=null,n=j(d),n=$r(n),n!==null)if(r=bi(n),r===null)n=null;else if(l=r.tag,l===13){if(n=Ua(r),n!==null)return n;n=null}else if(l===3){if(r.stateNode.current.memoizedState.isDehydrated)return r.tag===3?r.stateNode.containerInfo:null;n=null}else r!==n&&(n=null);return Va=n,null}function wf(n){switch(n){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(we()){case De:return 1;case He:return 4;case Ve:case lt:return 16;case ct:return 536870912;default:return 16}default:return 16}}var mr=null,Oc=null,Ga=null;function Af(){if(Ga)return Ga;var n,r=Oc,l=r.length,d,p="value"in mr?mr.value:mr.textContent,v=p.length;for(n=0;n<l&&r[n]===p[n];n++);var T=l-n;for(d=1;d<=T&&r[l-d]===p[v-d];d++);return Ga=p.slice(n,1<d?1-d:void 0)}function Wa(n){var r=n.keyCode;return"charCode"in n?(n=n.charCode,n===0&&r===13&&(n=13)):n=r,n===10&&(n=13),32<=n||n===13?n:0}function ja(){return!0}function Rf(){return!1}function qn(n){function r(l,d,p,v,T){this._reactName=l,this._targetInst=p,this.type=d,this.nativeEvent=v,this.target=T,this.currentTarget=null;for(var I in n)n.hasOwnProperty(I)&&(l=n[I],this[I]=l?l(v):v[I]);return this.isDefaultPrevented=(v.defaultPrevented!=null?v.defaultPrevented:v.returnValue===!1)?ja:Rf,this.isPropagationStopped=Rf,this}return oe(r.prototype,{preventDefault:function(){this.defaultPrevented=!0;var l=this.nativeEvent;l&&(l.preventDefault?l.preventDefault():typeof l.returnValue!="unknown"&&(l.returnValue=!1),this.isDefaultPrevented=ja)},stopPropagation:function(){var l=this.nativeEvent;l&&(l.stopPropagation?l.stopPropagation():typeof l.cancelBubble!="unknown"&&(l.cancelBubble=!0),this.isPropagationStopped=ja)},persist:function(){},isPersistent:ja}),r}var ws={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(n){return n.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},kc=qn(ws),ko=oe({},ws,{view:0,detail:0}),vv=qn(ko),Bc,zc,Bo,Xa=oe({},ko,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Vc,button:0,buttons:0,relatedTarget:function(n){return n.relatedTarget===void 0?n.fromElement===n.srcElement?n.toElement:n.fromElement:n.relatedTarget},movementX:function(n){return"movementX"in n?n.movementX:(n!==Bo&&(Bo&&n.type==="mousemove"?(Bc=n.screenX-Bo.screenX,zc=n.screenY-Bo.screenY):zc=Bc=0,Bo=n),Bc)},movementY:function(n){return"movementY"in n?n.movementY:zc}}),bf=qn(Xa),xv=oe({},Xa,{dataTransfer:0}),yv=qn(xv),Sv=oe({},ko,{relatedTarget:0}),Hc=qn(Sv),Mv=oe({},ws,{animationName:0,elapsedTime:0,pseudoElement:0}),Ev=qn(Mv),Tv=oe({},ws,{clipboardData:function(n){return"clipboardData"in n?n.clipboardData:window.clipboardData}}),wv=qn(Tv),Av=oe({},ws,{data:0}),Cf=qn(Av),Rv={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},bv={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Cv={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Pv(n){var r=this.nativeEvent;return r.getModifierState?r.getModifierState(n):(n=Cv[n])?!!r[n]:!1}function Vc(){return Pv}var Lv=oe({},ko,{key:function(n){if(n.key){var r=Rv[n.key]||n.key;if(r!=="Unidentified")return r}return n.type==="keypress"?(n=Wa(n),n===13?"Enter":String.fromCharCode(n)):n.type==="keydown"||n.type==="keyup"?bv[n.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Vc,charCode:function(n){return n.type==="keypress"?Wa(n):0},keyCode:function(n){return n.type==="keydown"||n.type==="keyup"?n.keyCode:0},which:function(n){return n.type==="keypress"?Wa(n):n.type==="keydown"||n.type==="keyup"?n.keyCode:0}}),Nv=qn(Lv),Dv=oe({},Xa,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Pf=qn(Dv),Iv=oe({},ko,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Vc}),Uv=qn(Iv),Fv=oe({},ws,{propertyName:0,elapsedTime:0,pseudoElement:0}),Ov=qn(Fv),kv=oe({},Xa,{deltaX:function(n){return"deltaX"in n?n.deltaX:"wheelDeltaX"in n?-n.wheelDeltaX:0},deltaY:function(n){return"deltaY"in n?n.deltaY:"wheelDeltaY"in n?-n.wheelDeltaY:"wheelDelta"in n?-n.wheelDelta:0},deltaZ:0,deltaMode:0}),Bv=qn(kv),zv=[9,13,27,32],Gc=u&&"CompositionEvent"in window,zo=null;u&&"documentMode"in document&&(zo=document.documentMode);var Hv=u&&"TextEvent"in window&&!zo,Lf=u&&(!Gc||zo&&8<zo&&11>=zo),Nf=" ",Df=!1;function If(n,r){switch(n){case"keyup":return zv.indexOf(r.keyCode)!==-1;case"keydown":return r.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Uf(n){return n=n.detail,typeof n=="object"&&"data"in n?n.data:null}var As=!1;function Vv(n,r){switch(n){case"compositionend":return Uf(r);case"keypress":return r.which!==32?null:(Df=!0,Nf);case"textInput":return n=r.data,n===Nf&&Df?null:n;default:return null}}function Gv(n,r){if(As)return n==="compositionend"||!Gc&&If(n,r)?(n=Af(),Ga=Oc=mr=null,As=!1,n):null;switch(n){case"paste":return null;case"keypress":if(!(r.ctrlKey||r.altKey||r.metaKey)||r.ctrlKey&&r.altKey){if(r.char&&1<r.char.length)return r.char;if(r.which)return String.fromCharCode(r.which)}return null;case"compositionend":return Lf&&r.locale!=="ko"?null:r.data;default:return null}}var Wv={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Ff(n){var r=n&&n.nodeName&&n.nodeName.toLowerCase();return r==="input"?!!Wv[n.type]:r==="textarea"}function Of(n,r,l,d){Ne(d),r=Za(r,"onChange"),0<r.length&&(l=new kc("onChange","change",null,l,d),n.push({event:l,listeners:r}))}var Ho=null,Vo=null;function jv(n){tp(n,0)}function Ya(n){var r=Ls(n);if(st(r))return n}function Xv(n,r){if(n==="change")return r}var kf=!1;if(u){var Wc;if(u){var jc="oninput"in document;if(!jc){var Bf=document.createElement("div");Bf.setAttribute("oninput","return;"),jc=typeof Bf.oninput=="function"}Wc=jc}else Wc=!1;kf=Wc&&(!document.documentMode||9<document.documentMode)}function zf(){Ho&&(Ho.detachEvent("onpropertychange",Hf),Vo=Ho=null)}function Hf(n){if(n.propertyName==="value"&&Ya(Vo)){var r=[];Of(r,Vo,n,j(n)),Ut(jv,r)}}function Yv(n,r,l){n==="focusin"?(zf(),Ho=r,Vo=l,Ho.attachEvent("onpropertychange",Hf)):n==="focusout"&&zf()}function qv(n){if(n==="selectionchange"||n==="keyup"||n==="keydown")return Ya(Vo)}function Kv(n,r){if(n==="click")return Ya(r)}function $v(n,r){if(n==="input"||n==="change")return Ya(r)}function Zv(n,r){return n===r&&(n!==0||1/n===1/r)||n!==n&&r!==r}var di=typeof Object.is=="function"?Object.is:Zv;function Go(n,r){if(di(n,r))return!0;if(typeof n!="object"||n===null||typeof r!="object"||r===null)return!1;var l=Object.keys(n),d=Object.keys(r);if(l.length!==d.length)return!1;for(d=0;d<l.length;d++){var p=l[d];if(!h.call(r,p)||!di(n[p],r[p]))return!1}return!0}function Vf(n){for(;n&&n.firstChild;)n=n.firstChild;return n}function Gf(n,r){var l=Vf(n);n=0;for(var d;l;){if(l.nodeType===3){if(d=n+l.textContent.length,n<=r&&d>=r)return{node:l,offset:r-n};n=d}e:{for(;l;){if(l.nextSibling){l=l.nextSibling;break e}l=l.parentNode}l=void 0}l=Vf(l)}}function Wf(n,r){return n&&r?n===r?!0:n&&n.nodeType===3?!1:r&&r.nodeType===3?Wf(n,r.parentNode):"contains"in n?n.contains(r):n.compareDocumentPosition?!!(n.compareDocumentPosition(r)&16):!1:!1}function jf(){for(var n=window,r=Rt();r instanceof n.HTMLIFrameElement;){try{var l=typeof r.contentWindow.location.href=="string"}catch{l=!1}if(l)n=r.contentWindow;else break;r=Rt(n.document)}return r}function Xc(n){var r=n&&n.nodeName&&n.nodeName.toLowerCase();return r&&(r==="input"&&(n.type==="text"||n.type==="search"||n.type==="tel"||n.type==="url"||n.type==="password")||r==="textarea"||n.contentEditable==="true")}function Qv(n){var r=jf(),l=n.focusedElem,d=n.selectionRange;if(r!==l&&l&&l.ownerDocument&&Wf(l.ownerDocument.documentElement,l)){if(d!==null&&Xc(l)){if(r=d.start,n=d.end,n===void 0&&(n=r),"selectionStart"in l)l.selectionStart=r,l.selectionEnd=Math.min(n,l.value.length);else if(n=(r=l.ownerDocument||document)&&r.defaultView||window,n.getSelection){n=n.getSelection();var p=l.textContent.length,v=Math.min(d.start,p);d=d.end===void 0?v:Math.min(d.end,p),!n.extend&&v>d&&(p=d,d=v,v=p),p=Gf(l,v);var T=Gf(l,d);p&&T&&(n.rangeCount!==1||n.anchorNode!==p.node||n.anchorOffset!==p.offset||n.focusNode!==T.node||n.focusOffset!==T.offset)&&(r=r.createRange(),r.setStart(p.node,p.offset),n.removeAllRanges(),v>d?(n.addRange(r),n.extend(T.node,T.offset)):(r.setEnd(T.node,T.offset),n.addRange(r)))}}for(r=[],n=l;n=n.parentNode;)n.nodeType===1&&r.push({element:n,left:n.scrollLeft,top:n.scrollTop});for(typeof l.focus=="function"&&l.focus(),l=0;l<r.length;l++)n=r[l],n.element.scrollLeft=n.left,n.element.scrollTop=n.top}}var Jv=u&&"documentMode"in document&&11>=document.documentMode,Rs=null,Yc=null,Wo=null,qc=!1;function Xf(n,r,l){var d=l.window===l?l.document:l.nodeType===9?l:l.ownerDocument;qc||Rs==null||Rs!==Rt(d)||(d=Rs,"selectionStart"in d&&Xc(d)?d={start:d.selectionStart,end:d.selectionEnd}:(d=(d.ownerDocument&&d.ownerDocument.defaultView||window).getSelection(),d={anchorNode:d.anchorNode,anchorOffset:d.anchorOffset,focusNode:d.focusNode,focusOffset:d.focusOffset}),Wo&&Go(Wo,d)||(Wo=d,d=Za(Yc,"onSelect"),0<d.length&&(r=new kc("onSelect","select",null,r,l),n.push({event:r,listeners:d}),r.target=Rs)))}function qa(n,r){var l={};return l[n.toLowerCase()]=r.toLowerCase(),l["Webkit"+n]="webkit"+r,l["Moz"+n]="moz"+r,l}var bs={animationend:qa("Animation","AnimationEnd"),animationiteration:qa("Animation","AnimationIteration"),animationstart:qa("Animation","AnimationStart"),transitionend:qa("Transition","TransitionEnd")},Kc={},Yf={};u&&(Yf=document.createElement("div").style,"AnimationEvent"in window||(delete bs.animationend.animation,delete bs.animationiteration.animation,delete bs.animationstart.animation),"TransitionEvent"in window||delete bs.transitionend.transition);function Ka(n){if(Kc[n])return Kc[n];if(!bs[n])return n;var r=bs[n],l;for(l in r)if(r.hasOwnProperty(l)&&l in Yf)return Kc[n]=r[l];return n}var qf=Ka("animationend"),Kf=Ka("animationiteration"),$f=Ka("animationstart"),Zf=Ka("transitionend"),Qf=new Map,Jf="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function gr(n,r){Qf.set(n,r),a(r,[n])}for(var $c=0;$c<Jf.length;$c++){var Zc=Jf[$c],e0=Zc.toLowerCase(),t0=Zc[0].toUpperCase()+Zc.slice(1);gr(e0,"on"+t0)}gr(qf,"onAnimationEnd"),gr(Kf,"onAnimationIteration"),gr($f,"onAnimationStart"),gr("dblclick","onDoubleClick"),gr("focusin","onFocus"),gr("focusout","onBlur"),gr(Zf,"onTransitionEnd"),c("onMouseEnter",["mouseout","mouseover"]),c("onMouseLeave",["mouseout","mouseover"]),c("onPointerEnter",["pointerout","pointerover"]),c("onPointerLeave",["pointerout","pointerover"]),a("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),a("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),a("onBeforeInput",["compositionend","keypress","textInput","paste"]),a("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),a("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),a("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var jo="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),n0=new Set("cancel close invalid load scroll toggle".split(" ").concat(jo));function ep(n,r,l){var d=n.type||"unknown-event";n.currentTarget=l,Ia(d,r,void 0,n),n.currentTarget=null}function tp(n,r){r=(r&4)!==0;for(var l=0;l<n.length;l++){var d=n[l],p=d.event;d=d.listeners;e:{var v=void 0;if(r)for(var T=d.length-1;0<=T;T--){var I=d[T],z=I.instance,ie=I.currentTarget;if(I=I.listener,z!==v&&p.isPropagationStopped())break e;ep(p,I,ie),v=z}else for(T=0;T<d.length;T++){if(I=d[T],z=I.instance,ie=I.currentTarget,I=I.listener,z!==v&&p.isPropagationStopped())break e;ep(p,I,ie),v=z}}}if(Yr)throw n=ur,Yr=!1,ur=null,n}function jt(n,r){var l=r[su];l===void 0&&(l=r[su]=new Set);var d=n+"__bubble";l.has(d)||(np(r,n,2,!1),l.add(d))}function Qc(n,r,l){var d=0;r&&(d|=4),np(l,n,d,r)}var $a="_reactListening"+Math.random().toString(36).slice(2);function Xo(n){if(!n[$a]){n[$a]=!0,i.forEach(function(l){l!=="selectionchange"&&(n0.has(l)||Qc(l,!1,n),Qc(l,!0,n))});var r=n.nodeType===9?n:n.ownerDocument;r===null||r[$a]||(r[$a]=!0,Qc("selectionchange",!1,r))}}function np(n,r,l,d){switch(wf(r)){case 1:var p=gv;break;case 4:p=_v;break;default:p=Uc}l=p.bind(null,r,l,n),p=void 0,!Ai||r!=="touchstart"&&r!=="touchmove"&&r!=="wheel"||(p=!0),d?p!==void 0?n.addEventListener(r,l,{capture:!0,passive:p}):n.addEventListener(r,l,!0):p!==void 0?n.addEventListener(r,l,{passive:p}):n.addEventListener(r,l,!1)}function Jc(n,r,l,d,p){var v=d;if((r&1)===0&&(r&2)===0&&d!==null)e:for(;;){if(d===null)return;var T=d.tag;if(T===3||T===4){var I=d.stateNode.containerInfo;if(I===p||I.nodeType===8&&I.parentNode===p)break;if(T===4)for(T=d.return;T!==null;){var z=T.tag;if((z===3||z===4)&&(z=T.stateNode.containerInfo,z===p||z.nodeType===8&&z.parentNode===p))return;T=T.return}for(;I!==null;){if(T=$r(I),T===null)return;if(z=T.tag,z===5||z===6){d=v=T;continue e}I=I.parentNode}}d=d.return}Ut(function(){var ie=v,Me=j(l),Te=[];e:{var Se=Qf.get(n);if(Se!==void 0){var Fe=kc,je=n;switch(n){case"keypress":if(Wa(l)===0)break e;case"keydown":case"keyup":Fe=Nv;break;case"focusin":je="focus",Fe=Hc;break;case"focusout":je="blur",Fe=Hc;break;case"beforeblur":case"afterblur":Fe=Hc;break;case"click":if(l.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":Fe=bf;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":Fe=yv;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":Fe=Uv;break;case qf:case Kf:case $f:Fe=Ev;break;case Zf:Fe=Ov;break;case"scroll":Fe=vv;break;case"wheel":Fe=Bv;break;case"copy":case"cut":case"paste":Fe=wv;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":Fe=Pf}var qe=(r&4)!==0,nn=!qe&&n==="scroll",Z=qe?Se!==null?Se+"Capture":null:Se;qe=[];for(var W=ie,ee;W!==null;){ee=W;var Ae=ee.stateNode;if(ee.tag===5&&Ae!==null&&(ee=Ae,Z!==null&&(Ae=Wt(W,Z),Ae!=null&&qe.push(Yo(W,Ae,ee)))),nn)break;W=W.return}0<qe.length&&(Se=new Fe(Se,je,null,l,Me),Te.push({event:Se,listeners:qe}))}}if((r&7)===0){e:{if(Se=n==="mouseover"||n==="pointerover",Fe=n==="mouseout"||n==="pointerout",Se&&l!==Ct&&(je=l.relatedTarget||l.fromElement)&&($r(je)||je[Gi]))break e;if((Fe||Se)&&(Se=Me.window===Me?Me:(Se=Me.ownerDocument)?Se.defaultView||Se.parentWindow:window,Fe?(je=l.relatedTarget||l.toElement,Fe=ie,je=je?$r(je):null,je!==null&&(nn=bi(je),je!==nn||je.tag!==5&&je.tag!==6)&&(je=null)):(Fe=null,je=ie),Fe!==je)){if(qe=bf,Ae="onMouseLeave",Z="onMouseEnter",W="mouse",(n==="pointerout"||n==="pointerover")&&(qe=Pf,Ae="onPointerLeave",Z="onPointerEnter",W="pointer"),nn=Fe==null?Se:Ls(Fe),ee=je==null?Se:Ls(je),Se=new qe(Ae,W+"leave",Fe,l,Me),Se.target=nn,Se.relatedTarget=ee,Ae=null,$r(Me)===ie&&(qe=new qe(Z,W+"enter",je,l,Me),qe.target=ee,qe.relatedTarget=nn,Ae=qe),nn=Ae,Fe&&je)t:{for(qe=Fe,Z=je,W=0,ee=qe;ee;ee=Cs(ee))W++;for(ee=0,Ae=Z;Ae;Ae=Cs(Ae))ee++;for(;0<W-ee;)qe=Cs(qe),W--;for(;0<ee-W;)Z=Cs(Z),ee--;for(;W--;){if(qe===Z||Z!==null&&qe===Z.alternate)break t;qe=Cs(qe),Z=Cs(Z)}qe=null}else qe=null;Fe!==null&&ip(Te,Se,Fe,qe,!1),je!==null&&nn!==null&&ip(Te,nn,je,qe,!0)}}e:{if(Se=ie?Ls(ie):window,Fe=Se.nodeName&&Se.nodeName.toLowerCase(),Fe==="select"||Fe==="input"&&Se.type==="file")var $e=Xv;else if(Ff(Se))if(kf)$e=$v;else{$e=qv;var et=Yv}else(Fe=Se.nodeName)&&Fe.toLowerCase()==="input"&&(Se.type==="checkbox"||Se.type==="radio")&&($e=Kv);if($e&&($e=$e(n,ie))){Of(Te,$e,l,Me);break e}et&&et(n,Se,ie),n==="focusout"&&(et=Se._wrapperState)&&et.controlled&&Se.type==="number"&&Dt(Se,"number",Se.value)}switch(et=ie?Ls(ie):window,n){case"focusin":(Ff(et)||et.contentEditable==="true")&&(Rs=et,Yc=ie,Wo=null);break;case"focusout":Wo=Yc=Rs=null;break;case"mousedown":qc=!0;break;case"contextmenu":case"mouseup":case"dragend":qc=!1,Xf(Te,l,Me);break;case"selectionchange":if(Jv)break;case"keydown":case"keyup":Xf(Te,l,Me)}var tt;if(Gc)e:{switch(n){case"compositionstart":var ut="onCompositionStart";break e;case"compositionend":ut="onCompositionEnd";break e;case"compositionupdate":ut="onCompositionUpdate";break e}ut=void 0}else As?If(n,l)&&(ut="onCompositionEnd"):n==="keydown"&&l.keyCode===229&&(ut="onCompositionStart");ut&&(Lf&&l.locale!=="ko"&&(As||ut!=="onCompositionStart"?ut==="onCompositionEnd"&&As&&(tt=Af()):(mr=Me,Oc="value"in mr?mr.value:mr.textContent,As=!0)),et=Za(ie,ut),0<et.length&&(ut=new Cf(ut,n,null,l,Me),Te.push({event:ut,listeners:et}),tt?ut.data=tt:(tt=Uf(l),tt!==null&&(ut.data=tt)))),(tt=Hv?Vv(n,l):Gv(n,l))&&(ie=Za(ie,"onBeforeInput"),0<ie.length&&(Me=new Cf("onBeforeInput","beforeinput",null,l,Me),Te.push({event:Me,listeners:ie}),Me.data=tt))}tp(Te,r)})}function Yo(n,r,l){return{instance:n,listener:r,currentTarget:l}}function Za(n,r){for(var l=r+"Capture",d=[];n!==null;){var p=n,v=p.stateNode;p.tag===5&&v!==null&&(p=v,v=Wt(n,l),v!=null&&d.unshift(Yo(n,v,p)),v=Wt(n,r),v!=null&&d.push(Yo(n,v,p))),n=n.return}return d}function Cs(n){if(n===null)return null;do n=n.return;while(n&&n.tag!==5);return n||null}function ip(n,r,l,d,p){for(var v=r._reactName,T=[];l!==null&&l!==d;){var I=l,z=I.alternate,ie=I.stateNode;if(z!==null&&z===d)break;I.tag===5&&ie!==null&&(I=ie,p?(z=Wt(l,v),z!=null&&T.unshift(Yo(l,z,I))):p||(z=Wt(l,v),z!=null&&T.push(Yo(l,z,I)))),l=l.return}T.length!==0&&n.push({event:r,listeners:T})}var i0=/\r\n?/g,r0=/\u0000|\uFFFD/g;function rp(n){return(typeof n=="string"?n:""+n).replace(i0,`
`).replace(r0,"")}function Qa(n,r,l){if(r=rp(r),rp(n)!==r&&l)throw Error(t(425))}function Ja(){}var eu=null,tu=null;function nu(n,r){return n==="textarea"||n==="noscript"||typeof r.children=="string"||typeof r.children=="number"||typeof r.dangerouslySetInnerHTML=="object"&&r.dangerouslySetInnerHTML!==null&&r.dangerouslySetInnerHTML.__html!=null}var iu=typeof setTimeout=="function"?setTimeout:void 0,s0=typeof clearTimeout=="function"?clearTimeout:void 0,sp=typeof Promise=="function"?Promise:void 0,o0=typeof queueMicrotask=="function"?queueMicrotask:typeof sp<"u"?function(n){return sp.resolve(null).then(n).catch(a0)}:iu;function a0(n){setTimeout(function(){throw n})}function ru(n,r){var l=r,d=0;do{var p=l.nextSibling;if(n.removeChild(l),p&&p.nodeType===8)if(l=p.data,l==="/$"){if(d===0){n.removeChild(p),Oo(r);return}d--}else l!=="$"&&l!=="$?"&&l!=="$!"||d++;l=p}while(l);Oo(r)}function _r(n){for(;n!=null;n=n.nextSibling){var r=n.nodeType;if(r===1||r===3)break;if(r===8){if(r=n.data,r==="$"||r==="$!"||r==="$?")break;if(r==="/$")return null}}return n}function op(n){n=n.previousSibling;for(var r=0;n;){if(n.nodeType===8){var l=n.data;if(l==="$"||l==="$!"||l==="$?"){if(r===0)return n;r--}else l==="/$"&&r++}n=n.previousSibling}return null}var Ps=Math.random().toString(36).slice(2),Ci="__reactFiber$"+Ps,qo="__reactProps$"+Ps,Gi="__reactContainer$"+Ps,su="__reactEvents$"+Ps,l0="__reactListeners$"+Ps,c0="__reactHandles$"+Ps;function $r(n){var r=n[Ci];if(r)return r;for(var l=n.parentNode;l;){if(r=l[Gi]||l[Ci]){if(l=r.alternate,r.child!==null||l!==null&&l.child!==null)for(n=op(n);n!==null;){if(l=n[Ci])return l;n=op(n)}return r}n=l,l=n.parentNode}return null}function Ko(n){return n=n[Ci]||n[Gi],!n||n.tag!==5&&n.tag!==6&&n.tag!==13&&n.tag!==3?null:n}function Ls(n){if(n.tag===5||n.tag===6)return n.stateNode;throw Error(t(33))}function el(n){return n[qo]||null}var ou=[],Ns=-1;function vr(n){return{current:n}}function Xt(n){0>Ns||(n.current=ou[Ns],ou[Ns]=null,Ns--)}function Gt(n,r){Ns++,ou[Ns]=n.current,n.current=r}var xr={},En=vr(xr),zn=vr(!1),Zr=xr;function Ds(n,r){var l=n.type.contextTypes;if(!l)return xr;var d=n.stateNode;if(d&&d.__reactInternalMemoizedUnmaskedChildContext===r)return d.__reactInternalMemoizedMaskedChildContext;var p={},v;for(v in l)p[v]=r[v];return d&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=r,n.__reactInternalMemoizedMaskedChildContext=p),p}function Hn(n){return n=n.childContextTypes,n!=null}function tl(){Xt(zn),Xt(En)}function ap(n,r,l){if(En.current!==xr)throw Error(t(168));Gt(En,r),Gt(zn,l)}function lp(n,r,l){var d=n.stateNode;if(r=r.childContextTypes,typeof d.getChildContext!="function")return l;d=d.getChildContext();for(var p in d)if(!(p in r))throw Error(t(108,pe(n)||"Unknown",p));return oe({},l,d)}function nl(n){return n=(n=n.stateNode)&&n.__reactInternalMemoizedMergedChildContext||xr,Zr=En.current,Gt(En,n),Gt(zn,zn.current),!0}function cp(n,r,l){var d=n.stateNode;if(!d)throw Error(t(169));l?(n=lp(n,r,Zr),d.__reactInternalMemoizedMergedChildContext=n,Xt(zn),Xt(En),Gt(En,n)):Xt(zn),Gt(zn,l)}var Wi=null,il=!1,au=!1;function up(n){Wi===null?Wi=[n]:Wi.push(n)}function u0(n){il=!0,up(n)}function yr(){if(!au&&Wi!==null){au=!0;var n=0,r=St;try{var l=Wi;for(St=1;n<l.length;n++){var d=l[n];do d=d(!0);while(d!==null)}Wi=null,il=!1}catch(p){throw Wi!==null&&(Wi=Wi.slice(n+1)),A(De,yr),p}finally{St=r,au=!1}}return null}var Is=[],Us=0,rl=null,sl=0,ti=[],ni=0,Qr=null,ji=1,Xi="";function Jr(n,r){Is[Us++]=sl,Is[Us++]=rl,rl=n,sl=r}function dp(n,r,l){ti[ni++]=ji,ti[ni++]=Xi,ti[ni++]=Qr,Qr=n;var d=ji;n=Xi;var p=32-Lt(d)-1;d&=~(1<<p),l+=1;var v=32-Lt(r)+p;if(30<v){var T=p-p%5;v=(d&(1<<T)-1).toString(32),d>>=T,p-=T,ji=1<<32-Lt(r)+p|l<<p|d,Xi=v+n}else ji=1<<v|l<<p|d,Xi=n}function lu(n){n.return!==null&&(Jr(n,1),dp(n,1,0))}function cu(n){for(;n===rl;)rl=Is[--Us],Is[Us]=null,sl=Is[--Us],Is[Us]=null;for(;n===Qr;)Qr=ti[--ni],ti[ni]=null,Xi=ti[--ni],ti[ni]=null,ji=ti[--ni],ti[ni]=null}var Kn=null,$n=null,Kt=!1,hi=null;function hp(n,r){var l=oi(5,null,null,0);l.elementType="DELETED",l.stateNode=r,l.return=n,r=n.deletions,r===null?(n.deletions=[l],n.flags|=16):r.push(l)}function fp(n,r){switch(n.tag){case 5:var l=n.type;return r=r.nodeType!==1||l.toLowerCase()!==r.nodeName.toLowerCase()?null:r,r!==null?(n.stateNode=r,Kn=n,$n=_r(r.firstChild),!0):!1;case 6:return r=n.pendingProps===""||r.nodeType!==3?null:r,r!==null?(n.stateNode=r,Kn=n,$n=null,!0):!1;case 13:return r=r.nodeType!==8?null:r,r!==null?(l=Qr!==null?{id:ji,overflow:Xi}:null,n.memoizedState={dehydrated:r,treeContext:l,retryLane:1073741824},l=oi(18,null,null,0),l.stateNode=r,l.return=n,n.child=l,Kn=n,$n=null,!0):!1;default:return!1}}function uu(n){return(n.mode&1)!==0&&(n.flags&128)===0}function du(n){if(Kt){var r=$n;if(r){var l=r;if(!fp(n,r)){if(uu(n))throw Error(t(418));r=_r(l.nextSibling);var d=Kn;r&&fp(n,r)?hp(d,l):(n.flags=n.flags&-4097|2,Kt=!1,Kn=n)}}else{if(uu(n))throw Error(t(418));n.flags=n.flags&-4097|2,Kt=!1,Kn=n}}}function pp(n){for(n=n.return;n!==null&&n.tag!==5&&n.tag!==3&&n.tag!==13;)n=n.return;Kn=n}function ol(n){if(n!==Kn)return!1;if(!Kt)return pp(n),Kt=!0,!1;var r;if((r=n.tag!==3)&&!(r=n.tag!==5)&&(r=n.type,r=r!=="head"&&r!=="body"&&!nu(n.type,n.memoizedProps)),r&&(r=$n)){if(uu(n))throw mp(),Error(t(418));for(;r;)hp(n,r),r=_r(r.nextSibling)}if(pp(n),n.tag===13){if(n=n.memoizedState,n=n!==null?n.dehydrated:null,!n)throw Error(t(317));e:{for(n=n.nextSibling,r=0;n;){if(n.nodeType===8){var l=n.data;if(l==="/$"){if(r===0){$n=_r(n.nextSibling);break e}r--}else l!=="$"&&l!=="$!"&&l!=="$?"||r++}n=n.nextSibling}$n=null}}else $n=Kn?_r(n.stateNode.nextSibling):null;return!0}function mp(){for(var n=$n;n;)n=_r(n.nextSibling)}function Fs(){$n=Kn=null,Kt=!1}function hu(n){hi===null?hi=[n]:hi.push(n)}var d0=b.ReactCurrentBatchConfig;function $o(n,r,l){if(n=l.ref,n!==null&&typeof n!="function"&&typeof n!="object"){if(l._owner){if(l=l._owner,l){if(l.tag!==1)throw Error(t(309));var d=l.stateNode}if(!d)throw Error(t(147,n));var p=d,v=""+n;return r!==null&&r.ref!==null&&typeof r.ref=="function"&&r.ref._stringRef===v?r.ref:(r=function(T){var I=p.refs;T===null?delete I[v]:I[v]=T},r._stringRef=v,r)}if(typeof n!="string")throw Error(t(284));if(!l._owner)throw Error(t(290,n))}return n}function al(n,r){throw n=Object.prototype.toString.call(r),Error(t(31,n==="[object Object]"?"object with keys {"+Object.keys(r).join(", ")+"}":n))}function gp(n){var r=n._init;return r(n._payload)}function _p(n){function r(Z,W){if(n){var ee=Z.deletions;ee===null?(Z.deletions=[W],Z.flags|=16):ee.push(W)}}function l(Z,W){if(!n)return null;for(;W!==null;)r(Z,W),W=W.sibling;return null}function d(Z,W){for(Z=new Map;W!==null;)W.key!==null?Z.set(W.key,W):Z.set(W.index,W),W=W.sibling;return Z}function p(Z,W){return Z=br(Z,W),Z.index=0,Z.sibling=null,Z}function v(Z,W,ee){return Z.index=ee,n?(ee=Z.alternate,ee!==null?(ee=ee.index,ee<W?(Z.flags|=2,W):ee):(Z.flags|=2,W)):(Z.flags|=1048576,W)}function T(Z){return n&&Z.alternate===null&&(Z.flags|=2),Z}function I(Z,W,ee,Ae){return W===null||W.tag!==6?(W=id(ee,Z.mode,Ae),W.return=Z,W):(W=p(W,ee),W.return=Z,W)}function z(Z,W,ee,Ae){var $e=ee.type;return $e===F?Me(Z,W,ee.props.children,Ae,ee.key):W!==null&&(W.elementType===$e||typeof $e=="object"&&$e!==null&&$e.$$typeof===ce&&gp($e)===W.type)?(Ae=p(W,ee.props),Ae.ref=$o(Z,W,ee),Ae.return=Z,Ae):(Ae=Ll(ee.type,ee.key,ee.props,null,Z.mode,Ae),Ae.ref=$o(Z,W,ee),Ae.return=Z,Ae)}function ie(Z,W,ee,Ae){return W===null||W.tag!==4||W.stateNode.containerInfo!==ee.containerInfo||W.stateNode.implementation!==ee.implementation?(W=rd(ee,Z.mode,Ae),W.return=Z,W):(W=p(W,ee.children||[]),W.return=Z,W)}function Me(Z,W,ee,Ae,$e){return W===null||W.tag!==7?(W=as(ee,Z.mode,Ae,$e),W.return=Z,W):(W=p(W,ee),W.return=Z,W)}function Te(Z,W,ee){if(typeof W=="string"&&W!==""||typeof W=="number")return W=id(""+W,Z.mode,ee),W.return=Z,W;if(typeof W=="object"&&W!==null){switch(W.$$typeof){case V:return ee=Ll(W.type,W.key,W.props,null,Z.mode,ee),ee.ref=$o(Z,null,W),ee.return=Z,ee;case k:return W=rd(W,Z.mode,ee),W.return=Z,W;case ce:var Ae=W._init;return Te(Z,Ae(W._payload),ee)}if(We(W)||le(W))return W=as(W,Z.mode,ee,null),W.return=Z,W;al(Z,W)}return null}function Se(Z,W,ee,Ae){var $e=W!==null?W.key:null;if(typeof ee=="string"&&ee!==""||typeof ee=="number")return $e!==null?null:I(Z,W,""+ee,Ae);if(typeof ee=="object"&&ee!==null){switch(ee.$$typeof){case V:return ee.key===$e?z(Z,W,ee,Ae):null;case k:return ee.key===$e?ie(Z,W,ee,Ae):null;case ce:return $e=ee._init,Se(Z,W,$e(ee._payload),Ae)}if(We(ee)||le(ee))return $e!==null?null:Me(Z,W,ee,Ae,null);al(Z,ee)}return null}function Fe(Z,W,ee,Ae,$e){if(typeof Ae=="string"&&Ae!==""||typeof Ae=="number")return Z=Z.get(ee)||null,I(W,Z,""+Ae,$e);if(typeof Ae=="object"&&Ae!==null){switch(Ae.$$typeof){case V:return Z=Z.get(Ae.key===null?ee:Ae.key)||null,z(W,Z,Ae,$e);case k:return Z=Z.get(Ae.key===null?ee:Ae.key)||null,ie(W,Z,Ae,$e);case ce:var et=Ae._init;return Fe(Z,W,ee,et(Ae._payload),$e)}if(We(Ae)||le(Ae))return Z=Z.get(ee)||null,Me(W,Z,Ae,$e,null);al(W,Ae)}return null}function je(Z,W,ee,Ae){for(var $e=null,et=null,tt=W,ut=W=0,pn=null;tt!==null&&ut<ee.length;ut++){tt.index>ut?(pn=tt,tt=null):pn=tt.sibling;var Nt=Se(Z,tt,ee[ut],Ae);if(Nt===null){tt===null&&(tt=pn);break}n&&tt&&Nt.alternate===null&&r(Z,tt),W=v(Nt,W,ut),et===null?$e=Nt:et.sibling=Nt,et=Nt,tt=pn}if(ut===ee.length)return l(Z,tt),Kt&&Jr(Z,ut),$e;if(tt===null){for(;ut<ee.length;ut++)tt=Te(Z,ee[ut],Ae),tt!==null&&(W=v(tt,W,ut),et===null?$e=tt:et.sibling=tt,et=tt);return Kt&&Jr(Z,ut),$e}for(tt=d(Z,tt);ut<ee.length;ut++)pn=Fe(tt,Z,ut,ee[ut],Ae),pn!==null&&(n&&pn.alternate!==null&&tt.delete(pn.key===null?ut:pn.key),W=v(pn,W,ut),et===null?$e=pn:et.sibling=pn,et=pn);return n&&tt.forEach(function(Cr){return r(Z,Cr)}),Kt&&Jr(Z,ut),$e}function qe(Z,W,ee,Ae){var $e=le(ee);if(typeof $e!="function")throw Error(t(150));if(ee=$e.call(ee),ee==null)throw Error(t(151));for(var et=$e=null,tt=W,ut=W=0,pn=null,Nt=ee.next();tt!==null&&!Nt.done;ut++,Nt=ee.next()){tt.index>ut?(pn=tt,tt=null):pn=tt.sibling;var Cr=Se(Z,tt,Nt.value,Ae);if(Cr===null){tt===null&&(tt=pn);break}n&&tt&&Cr.alternate===null&&r(Z,tt),W=v(Cr,W,ut),et===null?$e=Cr:et.sibling=Cr,et=Cr,tt=pn}if(Nt.done)return l(Z,tt),Kt&&Jr(Z,ut),$e;if(tt===null){for(;!Nt.done;ut++,Nt=ee.next())Nt=Te(Z,Nt.value,Ae),Nt!==null&&(W=v(Nt,W,ut),et===null?$e=Nt:et.sibling=Nt,et=Nt);return Kt&&Jr(Z,ut),$e}for(tt=d(Z,tt);!Nt.done;ut++,Nt=ee.next())Nt=Fe(tt,Z,ut,Nt.value,Ae),Nt!==null&&(n&&Nt.alternate!==null&&tt.delete(Nt.key===null?ut:Nt.key),W=v(Nt,W,ut),et===null?$e=Nt:et.sibling=Nt,et=Nt);return n&&tt.forEach(function(W0){return r(Z,W0)}),Kt&&Jr(Z,ut),$e}function nn(Z,W,ee,Ae){if(typeof ee=="object"&&ee!==null&&ee.type===F&&ee.key===null&&(ee=ee.props.children),typeof ee=="object"&&ee!==null){switch(ee.$$typeof){case V:e:{for(var $e=ee.key,et=W;et!==null;){if(et.key===$e){if($e=ee.type,$e===F){if(et.tag===7){l(Z,et.sibling),W=p(et,ee.props.children),W.return=Z,Z=W;break e}}else if(et.elementType===$e||typeof $e=="object"&&$e!==null&&$e.$$typeof===ce&&gp($e)===et.type){l(Z,et.sibling),W=p(et,ee.props),W.ref=$o(Z,et,ee),W.return=Z,Z=W;break e}l(Z,et);break}else r(Z,et);et=et.sibling}ee.type===F?(W=as(ee.props.children,Z.mode,Ae,ee.key),W.return=Z,Z=W):(Ae=Ll(ee.type,ee.key,ee.props,null,Z.mode,Ae),Ae.ref=$o(Z,W,ee),Ae.return=Z,Z=Ae)}return T(Z);case k:e:{for(et=ee.key;W!==null;){if(W.key===et)if(W.tag===4&&W.stateNode.containerInfo===ee.containerInfo&&W.stateNode.implementation===ee.implementation){l(Z,W.sibling),W=p(W,ee.children||[]),W.return=Z,Z=W;break e}else{l(Z,W);break}else r(Z,W);W=W.sibling}W=rd(ee,Z.mode,Ae),W.return=Z,Z=W}return T(Z);case ce:return et=ee._init,nn(Z,W,et(ee._payload),Ae)}if(We(ee))return je(Z,W,ee,Ae);if(le(ee))return qe(Z,W,ee,Ae);al(Z,ee)}return typeof ee=="string"&&ee!==""||typeof ee=="number"?(ee=""+ee,W!==null&&W.tag===6?(l(Z,W.sibling),W=p(W,ee),W.return=Z,Z=W):(l(Z,W),W=id(ee,Z.mode,Ae),W.return=Z,Z=W),T(Z)):l(Z,W)}return nn}var Os=_p(!0),vp=_p(!1),ll=vr(null),cl=null,ks=null,fu=null;function pu(){fu=ks=cl=null}function mu(n){var r=ll.current;Xt(ll),n._currentValue=r}function gu(n,r,l){for(;n!==null;){var d=n.alternate;if((n.childLanes&r)!==r?(n.childLanes|=r,d!==null&&(d.childLanes|=r)):d!==null&&(d.childLanes&r)!==r&&(d.childLanes|=r),n===l)break;n=n.return}}function Bs(n,r){cl=n,fu=ks=null,n=n.dependencies,n!==null&&n.firstContext!==null&&((n.lanes&r)!==0&&(Vn=!0),n.firstContext=null)}function ii(n){var r=n._currentValue;if(fu!==n)if(n={context:n,memoizedValue:r,next:null},ks===null){if(cl===null)throw Error(t(308));ks=n,cl.dependencies={lanes:0,firstContext:n}}else ks=ks.next=n;return r}var es=null;function _u(n){es===null?es=[n]:es.push(n)}function xp(n,r,l,d){var p=r.interleaved;return p===null?(l.next=l,_u(r)):(l.next=p.next,p.next=l),r.interleaved=l,Yi(n,d)}function Yi(n,r){n.lanes|=r;var l=n.alternate;for(l!==null&&(l.lanes|=r),l=n,n=n.return;n!==null;)n.childLanes|=r,l=n.alternate,l!==null&&(l.childLanes|=r),l=n,n=n.return;return l.tag===3?l.stateNode:null}var Sr=!1;function vu(n){n.updateQueue={baseState:n.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function yp(n,r){n=n.updateQueue,r.updateQueue===n&&(r.updateQueue={baseState:n.baseState,firstBaseUpdate:n.firstBaseUpdate,lastBaseUpdate:n.lastBaseUpdate,shared:n.shared,effects:n.effects})}function qi(n,r){return{eventTime:n,lane:r,tag:0,payload:null,callback:null,next:null}}function Mr(n,r,l){var d=n.updateQueue;if(d===null)return null;if(d=d.shared,(bt&2)!==0){var p=d.pending;return p===null?r.next=r:(r.next=p.next,p.next=r),d.pending=r,Yi(n,l)}return p=d.interleaved,p===null?(r.next=r,_u(d)):(r.next=p.next,p.next=r),d.interleaved=r,Yi(n,l)}function ul(n,r,l){if(r=r.updateQueue,r!==null&&(r=r.shared,(l&4194240)!==0)){var d=r.lanes;d&=n.pendingLanes,l|=d,r.lanes=l,Kr(n,l)}}function Sp(n,r){var l=n.updateQueue,d=n.alternate;if(d!==null&&(d=d.updateQueue,l===d)){var p=null,v=null;if(l=l.firstBaseUpdate,l!==null){do{var T={eventTime:l.eventTime,lane:l.lane,tag:l.tag,payload:l.payload,callback:l.callback,next:null};v===null?p=v=T:v=v.next=T,l=l.next}while(l!==null);v===null?p=v=r:v=v.next=r}else p=v=r;l={baseState:d.baseState,firstBaseUpdate:p,lastBaseUpdate:v,shared:d.shared,effects:d.effects},n.updateQueue=l;return}n=l.lastBaseUpdate,n===null?l.firstBaseUpdate=r:n.next=r,l.lastBaseUpdate=r}function dl(n,r,l,d){var p=n.updateQueue;Sr=!1;var v=p.firstBaseUpdate,T=p.lastBaseUpdate,I=p.shared.pending;if(I!==null){p.shared.pending=null;var z=I,ie=z.next;z.next=null,T===null?v=ie:T.next=ie,T=z;var Me=n.alternate;Me!==null&&(Me=Me.updateQueue,I=Me.lastBaseUpdate,I!==T&&(I===null?Me.firstBaseUpdate=ie:I.next=ie,Me.lastBaseUpdate=z))}if(v!==null){var Te=p.baseState;T=0,Me=ie=z=null,I=v;do{var Se=I.lane,Fe=I.eventTime;if((d&Se)===Se){Me!==null&&(Me=Me.next={eventTime:Fe,lane:0,tag:I.tag,payload:I.payload,callback:I.callback,next:null});e:{var je=n,qe=I;switch(Se=r,Fe=l,qe.tag){case 1:if(je=qe.payload,typeof je=="function"){Te=je.call(Fe,Te,Se);break e}Te=je;break e;case 3:je.flags=je.flags&-65537|128;case 0:if(je=qe.payload,Se=typeof je=="function"?je.call(Fe,Te,Se):je,Se==null)break e;Te=oe({},Te,Se);break e;case 2:Sr=!0}}I.callback!==null&&I.lane!==0&&(n.flags|=64,Se=p.effects,Se===null?p.effects=[I]:Se.push(I))}else Fe={eventTime:Fe,lane:Se,tag:I.tag,payload:I.payload,callback:I.callback,next:null},Me===null?(ie=Me=Fe,z=Te):Me=Me.next=Fe,T|=Se;if(I=I.next,I===null){if(I=p.shared.pending,I===null)break;Se=I,I=Se.next,Se.next=null,p.lastBaseUpdate=Se,p.shared.pending=null}}while(!0);if(Me===null&&(z=Te),p.baseState=z,p.firstBaseUpdate=ie,p.lastBaseUpdate=Me,r=p.shared.interleaved,r!==null){p=r;do T|=p.lane,p=p.next;while(p!==r)}else v===null&&(p.shared.lanes=0);is|=T,n.lanes=T,n.memoizedState=Te}}function Mp(n,r,l){if(n=r.effects,r.effects=null,n!==null)for(r=0;r<n.length;r++){var d=n[r],p=d.callback;if(p!==null){if(d.callback=null,d=l,typeof p!="function")throw Error(t(191,p));p.call(d)}}}var Zo={},Pi=vr(Zo),Qo=vr(Zo),Jo=vr(Zo);function ts(n){if(n===Zo)throw Error(t(174));return n}function xu(n,r){switch(Gt(Jo,r),Gt(Qo,n),Gt(Pi,Zo),n=r.nodeType,n){case 9:case 11:r=(r=r.documentElement)?r.namespaceURI:Xe(null,"");break;default:n=n===8?r.parentNode:r,r=n.namespaceURI||null,n=n.tagName,r=Xe(r,n)}Xt(Pi),Gt(Pi,r)}function zs(){Xt(Pi),Xt(Qo),Xt(Jo)}function Ep(n){ts(Jo.current);var r=ts(Pi.current),l=Xe(r,n.type);r!==l&&(Gt(Qo,n),Gt(Pi,l))}function yu(n){Qo.current===n&&(Xt(Pi),Xt(Qo))}var $t=vr(0);function hl(n){for(var r=n;r!==null;){if(r.tag===13){var l=r.memoizedState;if(l!==null&&(l=l.dehydrated,l===null||l.data==="$?"||l.data==="$!"))return r}else if(r.tag===19&&r.memoizedProps.revealOrder!==void 0){if((r.flags&128)!==0)return r}else if(r.child!==null){r.child.return=r,r=r.child;continue}if(r===n)break;for(;r.sibling===null;){if(r.return===null||r.return===n)return null;r=r.return}r.sibling.return=r.return,r=r.sibling}return null}var Su=[];function Mu(){for(var n=0;n<Su.length;n++)Su[n]._workInProgressVersionPrimary=null;Su.length=0}var fl=b.ReactCurrentDispatcher,Eu=b.ReactCurrentBatchConfig,ns=0,Zt=null,on=null,hn=null,pl=!1,ea=!1,ta=0,h0=0;function Tn(){throw Error(t(321))}function Tu(n,r){if(r===null)return!1;for(var l=0;l<r.length&&l<n.length;l++)if(!di(n[l],r[l]))return!1;return!0}function wu(n,r,l,d,p,v){if(ns=v,Zt=r,r.memoizedState=null,r.updateQueue=null,r.lanes=0,fl.current=n===null||n.memoizedState===null?g0:_0,n=l(d,p),ea){v=0;do{if(ea=!1,ta=0,25<=v)throw Error(t(301));v+=1,hn=on=null,r.updateQueue=null,fl.current=v0,n=l(d,p)}while(ea)}if(fl.current=_l,r=on!==null&&on.next!==null,ns=0,hn=on=Zt=null,pl=!1,r)throw Error(t(300));return n}function Au(){var n=ta!==0;return ta=0,n}function Li(){var n={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return hn===null?Zt.memoizedState=hn=n:hn=hn.next=n,hn}function ri(){if(on===null){var n=Zt.alternate;n=n!==null?n.memoizedState:null}else n=on.next;var r=hn===null?Zt.memoizedState:hn.next;if(r!==null)hn=r,on=n;else{if(n===null)throw Error(t(310));on=n,n={memoizedState:on.memoizedState,baseState:on.baseState,baseQueue:on.baseQueue,queue:on.queue,next:null},hn===null?Zt.memoizedState=hn=n:hn=hn.next=n}return hn}function na(n,r){return typeof r=="function"?r(n):r}function Ru(n){var r=ri(),l=r.queue;if(l===null)throw Error(t(311));l.lastRenderedReducer=n;var d=on,p=d.baseQueue,v=l.pending;if(v!==null){if(p!==null){var T=p.next;p.next=v.next,v.next=T}d.baseQueue=p=v,l.pending=null}if(p!==null){v=p.next,d=d.baseState;var I=T=null,z=null,ie=v;do{var Me=ie.lane;if((ns&Me)===Me)z!==null&&(z=z.next={lane:0,action:ie.action,hasEagerState:ie.hasEagerState,eagerState:ie.eagerState,next:null}),d=ie.hasEagerState?ie.eagerState:n(d,ie.action);else{var Te={lane:Me,action:ie.action,hasEagerState:ie.hasEagerState,eagerState:ie.eagerState,next:null};z===null?(I=z=Te,T=d):z=z.next=Te,Zt.lanes|=Me,is|=Me}ie=ie.next}while(ie!==null&&ie!==v);z===null?T=d:z.next=I,di(d,r.memoizedState)||(Vn=!0),r.memoizedState=d,r.baseState=T,r.baseQueue=z,l.lastRenderedState=d}if(n=l.interleaved,n!==null){p=n;do v=p.lane,Zt.lanes|=v,is|=v,p=p.next;while(p!==n)}else p===null&&(l.lanes=0);return[r.memoizedState,l.dispatch]}function bu(n){var r=ri(),l=r.queue;if(l===null)throw Error(t(311));l.lastRenderedReducer=n;var d=l.dispatch,p=l.pending,v=r.memoizedState;if(p!==null){l.pending=null;var T=p=p.next;do v=n(v,T.action),T=T.next;while(T!==p);di(v,r.memoizedState)||(Vn=!0),r.memoizedState=v,r.baseQueue===null&&(r.baseState=v),l.lastRenderedState=v}return[v,d]}function Tp(){}function wp(n,r){var l=Zt,d=ri(),p=r(),v=!di(d.memoizedState,p);if(v&&(d.memoizedState=p,Vn=!0),d=d.queue,Cu(bp.bind(null,l,d,n),[n]),d.getSnapshot!==r||v||hn!==null&&hn.memoizedState.tag&1){if(l.flags|=2048,ia(9,Rp.bind(null,l,d,p,r),void 0,null),fn===null)throw Error(t(349));(ns&30)!==0||Ap(l,r,p)}return p}function Ap(n,r,l){n.flags|=16384,n={getSnapshot:r,value:l},r=Zt.updateQueue,r===null?(r={lastEffect:null,stores:null},Zt.updateQueue=r,r.stores=[n]):(l=r.stores,l===null?r.stores=[n]:l.push(n))}function Rp(n,r,l,d){r.value=l,r.getSnapshot=d,Cp(r)&&Pp(n)}function bp(n,r,l){return l(function(){Cp(r)&&Pp(n)})}function Cp(n){var r=n.getSnapshot;n=n.value;try{var l=r();return!di(n,l)}catch{return!0}}function Pp(n){var r=Yi(n,1);r!==null&&gi(r,n,1,-1)}function Lp(n){var r=Li();return typeof n=="function"&&(n=n()),r.memoizedState=r.baseState=n,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:na,lastRenderedState:n},r.queue=n,n=n.dispatch=m0.bind(null,Zt,n),[r.memoizedState,n]}function ia(n,r,l,d){return n={tag:n,create:r,destroy:l,deps:d,next:null},r=Zt.updateQueue,r===null?(r={lastEffect:null,stores:null},Zt.updateQueue=r,r.lastEffect=n.next=n):(l=r.lastEffect,l===null?r.lastEffect=n.next=n:(d=l.next,l.next=n,n.next=d,r.lastEffect=n)),n}function Np(){return ri().memoizedState}function ml(n,r,l,d){var p=Li();Zt.flags|=n,p.memoizedState=ia(1|r,l,void 0,d===void 0?null:d)}function gl(n,r,l,d){var p=ri();d=d===void 0?null:d;var v=void 0;if(on!==null){var T=on.memoizedState;if(v=T.destroy,d!==null&&Tu(d,T.deps)){p.memoizedState=ia(r,l,v,d);return}}Zt.flags|=n,p.memoizedState=ia(1|r,l,v,d)}function Dp(n,r){return ml(8390656,8,n,r)}function Cu(n,r){return gl(2048,8,n,r)}function Ip(n,r){return gl(4,2,n,r)}function Up(n,r){return gl(4,4,n,r)}function Fp(n,r){if(typeof r=="function")return n=n(),r(n),function(){r(null)};if(r!=null)return n=n(),r.current=n,function(){r.current=null}}function Op(n,r,l){return l=l!=null?l.concat([n]):null,gl(4,4,Fp.bind(null,r,n),l)}function Pu(){}function kp(n,r){var l=ri();r=r===void 0?null:r;var d=l.memoizedState;return d!==null&&r!==null&&Tu(r,d[1])?d[0]:(l.memoizedState=[n,r],n)}function Bp(n,r){var l=ri();r=r===void 0?null:r;var d=l.memoizedState;return d!==null&&r!==null&&Tu(r,d[1])?d[0]:(n=n(),l.memoizedState=[n,r],n)}function zp(n,r,l){return(ns&21)===0?(n.baseState&&(n.baseState=!1,Vn=!0),n.memoizedState=l):(di(l,r)||(l=Pn(),Zt.lanes|=l,is|=l,n.baseState=!0),r)}function f0(n,r){var l=St;St=l!==0&&4>l?l:4,n(!0);var d=Eu.transition;Eu.transition={};try{n(!1),r()}finally{St=l,Eu.transition=d}}function Hp(){return ri().memoizedState}function p0(n,r,l){var d=Ar(n);if(l={lane:d,action:l,hasEagerState:!1,eagerState:null,next:null},Vp(n))Gp(r,l);else if(l=xp(n,r,l,d),l!==null){var p=Nn();gi(l,n,d,p),Wp(l,r,d)}}function m0(n,r,l){var d=Ar(n),p={lane:d,action:l,hasEagerState:!1,eagerState:null,next:null};if(Vp(n))Gp(r,p);else{var v=n.alternate;if(n.lanes===0&&(v===null||v.lanes===0)&&(v=r.lastRenderedReducer,v!==null))try{var T=r.lastRenderedState,I=v(T,l);if(p.hasEagerState=!0,p.eagerState=I,di(I,T)){var z=r.interleaved;z===null?(p.next=p,_u(r)):(p.next=z.next,z.next=p),r.interleaved=p;return}}catch{}finally{}l=xp(n,r,p,d),l!==null&&(p=Nn(),gi(l,n,d,p),Wp(l,r,d))}}function Vp(n){var r=n.alternate;return n===Zt||r!==null&&r===Zt}function Gp(n,r){ea=pl=!0;var l=n.pending;l===null?r.next=r:(r.next=l.next,l.next=r),n.pending=r}function Wp(n,r,l){if((l&4194240)!==0){var d=r.lanes;d&=n.pendingLanes,l|=d,r.lanes=l,Kr(n,l)}}var _l={readContext:ii,useCallback:Tn,useContext:Tn,useEffect:Tn,useImperativeHandle:Tn,useInsertionEffect:Tn,useLayoutEffect:Tn,useMemo:Tn,useReducer:Tn,useRef:Tn,useState:Tn,useDebugValue:Tn,useDeferredValue:Tn,useTransition:Tn,useMutableSource:Tn,useSyncExternalStore:Tn,useId:Tn,unstable_isNewReconciler:!1},g0={readContext:ii,useCallback:function(n,r){return Li().memoizedState=[n,r===void 0?null:r],n},useContext:ii,useEffect:Dp,useImperativeHandle:function(n,r,l){return l=l!=null?l.concat([n]):null,ml(4194308,4,Fp.bind(null,r,n),l)},useLayoutEffect:function(n,r){return ml(4194308,4,n,r)},useInsertionEffect:function(n,r){return ml(4,2,n,r)},useMemo:function(n,r){var l=Li();return r=r===void 0?null:r,n=n(),l.memoizedState=[n,r],n},useReducer:function(n,r,l){var d=Li();return r=l!==void 0?l(r):r,d.memoizedState=d.baseState=r,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:n,lastRenderedState:r},d.queue=n,n=n.dispatch=p0.bind(null,Zt,n),[d.memoizedState,n]},useRef:function(n){var r=Li();return n={current:n},r.memoizedState=n},useState:Lp,useDebugValue:Pu,useDeferredValue:function(n){return Li().memoizedState=n},useTransition:function(){var n=Lp(!1),r=n[0];return n=f0.bind(null,n[1]),Li().memoizedState=n,[r,n]},useMutableSource:function(){},useSyncExternalStore:function(n,r,l){var d=Zt,p=Li();if(Kt){if(l===void 0)throw Error(t(407));l=l()}else{if(l=r(),fn===null)throw Error(t(349));(ns&30)!==0||Ap(d,r,l)}p.memoizedState=l;var v={value:l,getSnapshot:r};return p.queue=v,Dp(bp.bind(null,d,v,n),[n]),d.flags|=2048,ia(9,Rp.bind(null,d,v,l,r),void 0,null),l},useId:function(){var n=Li(),r=fn.identifierPrefix;if(Kt){var l=Xi,d=ji;l=(d&~(1<<32-Lt(d)-1)).toString(32)+l,r=":"+r+"R"+l,l=ta++,0<l&&(r+="H"+l.toString(32)),r+=":"}else l=h0++,r=":"+r+"r"+l.toString(32)+":";return n.memoizedState=r},unstable_isNewReconciler:!1},_0={readContext:ii,useCallback:kp,useContext:ii,useEffect:Cu,useImperativeHandle:Op,useInsertionEffect:Ip,useLayoutEffect:Up,useMemo:Bp,useReducer:Ru,useRef:Np,useState:function(){return Ru(na)},useDebugValue:Pu,useDeferredValue:function(n){var r=ri();return zp(r,on.memoizedState,n)},useTransition:function(){var n=Ru(na)[0],r=ri().memoizedState;return[n,r]},useMutableSource:Tp,useSyncExternalStore:wp,useId:Hp,unstable_isNewReconciler:!1},v0={readContext:ii,useCallback:kp,useContext:ii,useEffect:Cu,useImperativeHandle:Op,useInsertionEffect:Ip,useLayoutEffect:Up,useMemo:Bp,useReducer:bu,useRef:Np,useState:function(){return bu(na)},useDebugValue:Pu,useDeferredValue:function(n){var r=ri();return on===null?r.memoizedState=n:zp(r,on.memoizedState,n)},useTransition:function(){var n=bu(na)[0],r=ri().memoizedState;return[n,r]},useMutableSource:Tp,useSyncExternalStore:wp,useId:Hp,unstable_isNewReconciler:!1};function fi(n,r){if(n&&n.defaultProps){r=oe({},r),n=n.defaultProps;for(var l in n)r[l]===void 0&&(r[l]=n[l]);return r}return r}function Lu(n,r,l,d){r=n.memoizedState,l=l(d,r),l=l==null?r:oe({},r,l),n.memoizedState=l,n.lanes===0&&(n.updateQueue.baseState=l)}var vl={isMounted:function(n){return(n=n._reactInternals)?bi(n)===n:!1},enqueueSetState:function(n,r,l){n=n._reactInternals;var d=Nn(),p=Ar(n),v=qi(d,p);v.payload=r,l!=null&&(v.callback=l),r=Mr(n,v,p),r!==null&&(gi(r,n,p,d),ul(r,n,p))},enqueueReplaceState:function(n,r,l){n=n._reactInternals;var d=Nn(),p=Ar(n),v=qi(d,p);v.tag=1,v.payload=r,l!=null&&(v.callback=l),r=Mr(n,v,p),r!==null&&(gi(r,n,p,d),ul(r,n,p))},enqueueForceUpdate:function(n,r){n=n._reactInternals;var l=Nn(),d=Ar(n),p=qi(l,d);p.tag=2,r!=null&&(p.callback=r),r=Mr(n,p,d),r!==null&&(gi(r,n,d,l),ul(r,n,d))}};function jp(n,r,l,d,p,v,T){return n=n.stateNode,typeof n.shouldComponentUpdate=="function"?n.shouldComponentUpdate(d,v,T):r.prototype&&r.prototype.isPureReactComponent?!Go(l,d)||!Go(p,v):!0}function Xp(n,r,l){var d=!1,p=xr,v=r.contextType;return typeof v=="object"&&v!==null?v=ii(v):(p=Hn(r)?Zr:En.current,d=r.contextTypes,v=(d=d!=null)?Ds(n,p):xr),r=new r(l,v),n.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,r.updater=vl,n.stateNode=r,r._reactInternals=n,d&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=p,n.__reactInternalMemoizedMaskedChildContext=v),r}function Yp(n,r,l,d){n=r.state,typeof r.componentWillReceiveProps=="function"&&r.componentWillReceiveProps(l,d),typeof r.UNSAFE_componentWillReceiveProps=="function"&&r.UNSAFE_componentWillReceiveProps(l,d),r.state!==n&&vl.enqueueReplaceState(r,r.state,null)}function Nu(n,r,l,d){var p=n.stateNode;p.props=l,p.state=n.memoizedState,p.refs={},vu(n);var v=r.contextType;typeof v=="object"&&v!==null?p.context=ii(v):(v=Hn(r)?Zr:En.current,p.context=Ds(n,v)),p.state=n.memoizedState,v=r.getDerivedStateFromProps,typeof v=="function"&&(Lu(n,r,v,l),p.state=n.memoizedState),typeof r.getDerivedStateFromProps=="function"||typeof p.getSnapshotBeforeUpdate=="function"||typeof p.UNSAFE_componentWillMount!="function"&&typeof p.componentWillMount!="function"||(r=p.state,typeof p.componentWillMount=="function"&&p.componentWillMount(),typeof p.UNSAFE_componentWillMount=="function"&&p.UNSAFE_componentWillMount(),r!==p.state&&vl.enqueueReplaceState(p,p.state,null),dl(n,l,p,d),p.state=n.memoizedState),typeof p.componentDidMount=="function"&&(n.flags|=4194308)}function Hs(n,r){try{var l="",d=r;do l+=he(d),d=d.return;while(d);var p=l}catch(v){p=`
Error generating stack: `+v.message+`
`+v.stack}return{value:n,source:r,stack:p,digest:null}}function Du(n,r,l){return{value:n,source:null,stack:l??null,digest:r??null}}function Iu(n,r){try{console.error(r.value)}catch(l){setTimeout(function(){throw l})}}var x0=typeof WeakMap=="function"?WeakMap:Map;function qp(n,r,l){l=qi(-1,l),l.tag=3,l.payload={element:null};var d=r.value;return l.callback=function(){wl||(wl=!0,Ku=d),Iu(n,r)},l}function Kp(n,r,l){l=qi(-1,l),l.tag=3;var d=n.type.getDerivedStateFromError;if(typeof d=="function"){var p=r.value;l.payload=function(){return d(p)},l.callback=function(){Iu(n,r)}}var v=n.stateNode;return v!==null&&typeof v.componentDidCatch=="function"&&(l.callback=function(){Iu(n,r),typeof d!="function"&&(Tr===null?Tr=new Set([this]):Tr.add(this));var T=r.stack;this.componentDidCatch(r.value,{componentStack:T!==null?T:""})}),l}function $p(n,r,l){var d=n.pingCache;if(d===null){d=n.pingCache=new x0;var p=new Set;d.set(r,p)}else p=d.get(r),p===void 0&&(p=new Set,d.set(r,p));p.has(l)||(p.add(l),n=D0.bind(null,n,r,l),r.then(n,n))}function Zp(n){do{var r;if((r=n.tag===13)&&(r=n.memoizedState,r=r!==null?r.dehydrated!==null:!0),r)return n;n=n.return}while(n!==null);return null}function Qp(n,r,l,d,p){return(n.mode&1)===0?(n===r?n.flags|=65536:(n.flags|=128,l.flags|=131072,l.flags&=-52805,l.tag===1&&(l.alternate===null?l.tag=17:(r=qi(-1,1),r.tag=2,Mr(l,r,1))),l.lanes|=1),n):(n.flags|=65536,n.lanes=p,n)}var y0=b.ReactCurrentOwner,Vn=!1;function Ln(n,r,l,d){r.child=n===null?vp(r,null,l,d):Os(r,n.child,l,d)}function Jp(n,r,l,d,p){l=l.render;var v=r.ref;return Bs(r,p),d=wu(n,r,l,d,v,p),l=Au(),n!==null&&!Vn?(r.updateQueue=n.updateQueue,r.flags&=-2053,n.lanes&=~p,Ki(n,r,p)):(Kt&&l&&lu(r),r.flags|=1,Ln(n,r,d,p),r.child)}function em(n,r,l,d,p){if(n===null){var v=l.type;return typeof v=="function"&&!nd(v)&&v.defaultProps===void 0&&l.compare===null&&l.defaultProps===void 0?(r.tag=15,r.type=v,tm(n,r,v,d,p)):(n=Ll(l.type,null,d,r,r.mode,p),n.ref=r.ref,n.return=r,r.child=n)}if(v=n.child,(n.lanes&p)===0){var T=v.memoizedProps;if(l=l.compare,l=l!==null?l:Go,l(T,d)&&n.ref===r.ref)return Ki(n,r,p)}return r.flags|=1,n=br(v,d),n.ref=r.ref,n.return=r,r.child=n}function tm(n,r,l,d,p){if(n!==null){var v=n.memoizedProps;if(Go(v,d)&&n.ref===r.ref)if(Vn=!1,r.pendingProps=d=v,(n.lanes&p)!==0)(n.flags&131072)!==0&&(Vn=!0);else return r.lanes=n.lanes,Ki(n,r,p)}return Uu(n,r,l,d,p)}function nm(n,r,l){var d=r.pendingProps,p=d.children,v=n!==null?n.memoizedState:null;if(d.mode==="hidden")if((r.mode&1)===0)r.memoizedState={baseLanes:0,cachePool:null,transitions:null},Gt(Gs,Zn),Zn|=l;else{if((l&1073741824)===0)return n=v!==null?v.baseLanes|l:l,r.lanes=r.childLanes=1073741824,r.memoizedState={baseLanes:n,cachePool:null,transitions:null},r.updateQueue=null,Gt(Gs,Zn),Zn|=n,null;r.memoizedState={baseLanes:0,cachePool:null,transitions:null},d=v!==null?v.baseLanes:l,Gt(Gs,Zn),Zn|=d}else v!==null?(d=v.baseLanes|l,r.memoizedState=null):d=l,Gt(Gs,Zn),Zn|=d;return Ln(n,r,p,l),r.child}function im(n,r){var l=r.ref;(n===null&&l!==null||n!==null&&n.ref!==l)&&(r.flags|=512,r.flags|=2097152)}function Uu(n,r,l,d,p){var v=Hn(l)?Zr:En.current;return v=Ds(r,v),Bs(r,p),l=wu(n,r,l,d,v,p),d=Au(),n!==null&&!Vn?(r.updateQueue=n.updateQueue,r.flags&=-2053,n.lanes&=~p,Ki(n,r,p)):(Kt&&d&&lu(r),r.flags|=1,Ln(n,r,l,p),r.child)}function rm(n,r,l,d,p){if(Hn(l)){var v=!0;nl(r)}else v=!1;if(Bs(r,p),r.stateNode===null)yl(n,r),Xp(r,l,d),Nu(r,l,d,p),d=!0;else if(n===null){var T=r.stateNode,I=r.memoizedProps;T.props=I;var z=T.context,ie=l.contextType;typeof ie=="object"&&ie!==null?ie=ii(ie):(ie=Hn(l)?Zr:En.current,ie=Ds(r,ie));var Me=l.getDerivedStateFromProps,Te=typeof Me=="function"||typeof T.getSnapshotBeforeUpdate=="function";Te||typeof T.UNSAFE_componentWillReceiveProps!="function"&&typeof T.componentWillReceiveProps!="function"||(I!==d||z!==ie)&&Yp(r,T,d,ie),Sr=!1;var Se=r.memoizedState;T.state=Se,dl(r,d,T,p),z=r.memoizedState,I!==d||Se!==z||zn.current||Sr?(typeof Me=="function"&&(Lu(r,l,Me,d),z=r.memoizedState),(I=Sr||jp(r,l,I,d,Se,z,ie))?(Te||typeof T.UNSAFE_componentWillMount!="function"&&typeof T.componentWillMount!="function"||(typeof T.componentWillMount=="function"&&T.componentWillMount(),typeof T.UNSAFE_componentWillMount=="function"&&T.UNSAFE_componentWillMount()),typeof T.componentDidMount=="function"&&(r.flags|=4194308)):(typeof T.componentDidMount=="function"&&(r.flags|=4194308),r.memoizedProps=d,r.memoizedState=z),T.props=d,T.state=z,T.context=ie,d=I):(typeof T.componentDidMount=="function"&&(r.flags|=4194308),d=!1)}else{T=r.stateNode,yp(n,r),I=r.memoizedProps,ie=r.type===r.elementType?I:fi(r.type,I),T.props=ie,Te=r.pendingProps,Se=T.context,z=l.contextType,typeof z=="object"&&z!==null?z=ii(z):(z=Hn(l)?Zr:En.current,z=Ds(r,z));var Fe=l.getDerivedStateFromProps;(Me=typeof Fe=="function"||typeof T.getSnapshotBeforeUpdate=="function")||typeof T.UNSAFE_componentWillReceiveProps!="function"&&typeof T.componentWillReceiveProps!="function"||(I!==Te||Se!==z)&&Yp(r,T,d,z),Sr=!1,Se=r.memoizedState,T.state=Se,dl(r,d,T,p);var je=r.memoizedState;I!==Te||Se!==je||zn.current||Sr?(typeof Fe=="function"&&(Lu(r,l,Fe,d),je=r.memoizedState),(ie=Sr||jp(r,l,ie,d,Se,je,z)||!1)?(Me||typeof T.UNSAFE_componentWillUpdate!="function"&&typeof T.componentWillUpdate!="function"||(typeof T.componentWillUpdate=="function"&&T.componentWillUpdate(d,je,z),typeof T.UNSAFE_componentWillUpdate=="function"&&T.UNSAFE_componentWillUpdate(d,je,z)),typeof T.componentDidUpdate=="function"&&(r.flags|=4),typeof T.getSnapshotBeforeUpdate=="function"&&(r.flags|=1024)):(typeof T.componentDidUpdate!="function"||I===n.memoizedProps&&Se===n.memoizedState||(r.flags|=4),typeof T.getSnapshotBeforeUpdate!="function"||I===n.memoizedProps&&Se===n.memoizedState||(r.flags|=1024),r.memoizedProps=d,r.memoizedState=je),T.props=d,T.state=je,T.context=z,d=ie):(typeof T.componentDidUpdate!="function"||I===n.memoizedProps&&Se===n.memoizedState||(r.flags|=4),typeof T.getSnapshotBeforeUpdate!="function"||I===n.memoizedProps&&Se===n.memoizedState||(r.flags|=1024),d=!1)}return Fu(n,r,l,d,v,p)}function Fu(n,r,l,d,p,v){im(n,r);var T=(r.flags&128)!==0;if(!d&&!T)return p&&cp(r,l,!1),Ki(n,r,v);d=r.stateNode,y0.current=r;var I=T&&typeof l.getDerivedStateFromError!="function"?null:d.render();return r.flags|=1,n!==null&&T?(r.child=Os(r,n.child,null,v),r.child=Os(r,null,I,v)):Ln(n,r,I,v),r.memoizedState=d.state,p&&cp(r,l,!0),r.child}function sm(n){var r=n.stateNode;r.pendingContext?ap(n,r.pendingContext,r.pendingContext!==r.context):r.context&&ap(n,r.context,!1),xu(n,r.containerInfo)}function om(n,r,l,d,p){return Fs(),hu(p),r.flags|=256,Ln(n,r,l,d),r.child}var Ou={dehydrated:null,treeContext:null,retryLane:0};function ku(n){return{baseLanes:n,cachePool:null,transitions:null}}function am(n,r,l){var d=r.pendingProps,p=$t.current,v=!1,T=(r.flags&128)!==0,I;if((I=T)||(I=n!==null&&n.memoizedState===null?!1:(p&2)!==0),I?(v=!0,r.flags&=-129):(n===null||n.memoizedState!==null)&&(p|=1),Gt($t,p&1),n===null)return du(r),n=r.memoizedState,n!==null&&(n=n.dehydrated,n!==null)?((r.mode&1)===0?r.lanes=1:n.data==="$!"?r.lanes=8:r.lanes=1073741824,null):(T=d.children,n=d.fallback,v?(d=r.mode,v=r.child,T={mode:"hidden",children:T},(d&1)===0&&v!==null?(v.childLanes=0,v.pendingProps=T):v=Nl(T,d,0,null),n=as(n,d,l,null),v.return=r,n.return=r,v.sibling=n,r.child=v,r.child.memoizedState=ku(l),r.memoizedState=Ou,n):Bu(r,T));if(p=n.memoizedState,p!==null&&(I=p.dehydrated,I!==null))return S0(n,r,T,d,I,p,l);if(v){v=d.fallback,T=r.mode,p=n.child,I=p.sibling;var z={mode:"hidden",children:d.children};return(T&1)===0&&r.child!==p?(d=r.child,d.childLanes=0,d.pendingProps=z,r.deletions=null):(d=br(p,z),d.subtreeFlags=p.subtreeFlags&14680064),I!==null?v=br(I,v):(v=as(v,T,l,null),v.flags|=2),v.return=r,d.return=r,d.sibling=v,r.child=d,d=v,v=r.child,T=n.child.memoizedState,T=T===null?ku(l):{baseLanes:T.baseLanes|l,cachePool:null,transitions:T.transitions},v.memoizedState=T,v.childLanes=n.childLanes&~l,r.memoizedState=Ou,d}return v=n.child,n=v.sibling,d=br(v,{mode:"visible",children:d.children}),(r.mode&1)===0&&(d.lanes=l),d.return=r,d.sibling=null,n!==null&&(l=r.deletions,l===null?(r.deletions=[n],r.flags|=16):l.push(n)),r.child=d,r.memoizedState=null,d}function Bu(n,r){return r=Nl({mode:"visible",children:r},n.mode,0,null),r.return=n,n.child=r}function xl(n,r,l,d){return d!==null&&hu(d),Os(r,n.child,null,l),n=Bu(r,r.pendingProps.children),n.flags|=2,r.memoizedState=null,n}function S0(n,r,l,d,p,v,T){if(l)return r.flags&256?(r.flags&=-257,d=Du(Error(t(422))),xl(n,r,T,d)):r.memoizedState!==null?(r.child=n.child,r.flags|=128,null):(v=d.fallback,p=r.mode,d=Nl({mode:"visible",children:d.children},p,0,null),v=as(v,p,T,null),v.flags|=2,d.return=r,v.return=r,d.sibling=v,r.child=d,(r.mode&1)!==0&&Os(r,n.child,null,T),r.child.memoizedState=ku(T),r.memoizedState=Ou,v);if((r.mode&1)===0)return xl(n,r,T,null);if(p.data==="$!"){if(d=p.nextSibling&&p.nextSibling.dataset,d)var I=d.dgst;return d=I,v=Error(t(419)),d=Du(v,d,void 0),xl(n,r,T,d)}if(I=(T&n.childLanes)!==0,Vn||I){if(d=fn,d!==null){switch(T&-T){case 4:p=2;break;case 16:p=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:p=32;break;case 536870912:p=268435456;break;default:p=0}p=(p&(d.suspendedLanes|T))!==0?0:p,p!==0&&p!==v.retryLane&&(v.retryLane=p,Yi(n,p),gi(d,n,p,-1))}return td(),d=Du(Error(t(421))),xl(n,r,T,d)}return p.data==="$?"?(r.flags|=128,r.child=n.child,r=I0.bind(null,n),p._reactRetry=r,null):(n=v.treeContext,$n=_r(p.nextSibling),Kn=r,Kt=!0,hi=null,n!==null&&(ti[ni++]=ji,ti[ni++]=Xi,ti[ni++]=Qr,ji=n.id,Xi=n.overflow,Qr=r),r=Bu(r,d.children),r.flags|=4096,r)}function lm(n,r,l){n.lanes|=r;var d=n.alternate;d!==null&&(d.lanes|=r),gu(n.return,r,l)}function zu(n,r,l,d,p){var v=n.memoizedState;v===null?n.memoizedState={isBackwards:r,rendering:null,renderingStartTime:0,last:d,tail:l,tailMode:p}:(v.isBackwards=r,v.rendering=null,v.renderingStartTime=0,v.last=d,v.tail=l,v.tailMode=p)}function cm(n,r,l){var d=r.pendingProps,p=d.revealOrder,v=d.tail;if(Ln(n,r,d.children,l),d=$t.current,(d&2)!==0)d=d&1|2,r.flags|=128;else{if(n!==null&&(n.flags&128)!==0)e:for(n=r.child;n!==null;){if(n.tag===13)n.memoizedState!==null&&lm(n,l,r);else if(n.tag===19)lm(n,l,r);else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===r)break e;for(;n.sibling===null;){if(n.return===null||n.return===r)break e;n=n.return}n.sibling.return=n.return,n=n.sibling}d&=1}if(Gt($t,d),(r.mode&1)===0)r.memoizedState=null;else switch(p){case"forwards":for(l=r.child,p=null;l!==null;)n=l.alternate,n!==null&&hl(n)===null&&(p=l),l=l.sibling;l=p,l===null?(p=r.child,r.child=null):(p=l.sibling,l.sibling=null),zu(r,!1,p,l,v);break;case"backwards":for(l=null,p=r.child,r.child=null;p!==null;){if(n=p.alternate,n!==null&&hl(n)===null){r.child=p;break}n=p.sibling,p.sibling=l,l=p,p=n}zu(r,!0,l,null,v);break;case"together":zu(r,!1,null,null,void 0);break;default:r.memoizedState=null}return r.child}function yl(n,r){(r.mode&1)===0&&n!==null&&(n.alternate=null,r.alternate=null,r.flags|=2)}function Ki(n,r,l){if(n!==null&&(r.dependencies=n.dependencies),is|=r.lanes,(l&r.childLanes)===0)return null;if(n!==null&&r.child!==n.child)throw Error(t(153));if(r.child!==null){for(n=r.child,l=br(n,n.pendingProps),r.child=l,l.return=r;n.sibling!==null;)n=n.sibling,l=l.sibling=br(n,n.pendingProps),l.return=r;l.sibling=null}return r.child}function M0(n,r,l){switch(r.tag){case 3:sm(r),Fs();break;case 5:Ep(r);break;case 1:Hn(r.type)&&nl(r);break;case 4:xu(r,r.stateNode.containerInfo);break;case 10:var d=r.type._context,p=r.memoizedProps.value;Gt(ll,d._currentValue),d._currentValue=p;break;case 13:if(d=r.memoizedState,d!==null)return d.dehydrated!==null?(Gt($t,$t.current&1),r.flags|=128,null):(l&r.child.childLanes)!==0?am(n,r,l):(Gt($t,$t.current&1),n=Ki(n,r,l),n!==null?n.sibling:null);Gt($t,$t.current&1);break;case 19:if(d=(l&r.childLanes)!==0,(n.flags&128)!==0){if(d)return cm(n,r,l);r.flags|=128}if(p=r.memoizedState,p!==null&&(p.rendering=null,p.tail=null,p.lastEffect=null),Gt($t,$t.current),d)break;return null;case 22:case 23:return r.lanes=0,nm(n,r,l)}return Ki(n,r,l)}var um,Hu,dm,hm;um=function(n,r){for(var l=r.child;l!==null;){if(l.tag===5||l.tag===6)n.appendChild(l.stateNode);else if(l.tag!==4&&l.child!==null){l.child.return=l,l=l.child;continue}if(l===r)break;for(;l.sibling===null;){if(l.return===null||l.return===r)return;l=l.return}l.sibling.return=l.return,l=l.sibling}},Hu=function(){},dm=function(n,r,l,d){var p=n.memoizedProps;if(p!==d){n=r.stateNode,ts(Pi.current);var v=null;switch(l){case"input":p=B(n,p),d=B(n,d),v=[];break;case"select":p=oe({},p,{value:void 0}),d=oe({},d,{value:void 0}),v=[];break;case"textarea":p=w(n,p),d=w(n,d),v=[];break;default:typeof p.onClick!="function"&&typeof d.onClick=="function"&&(n.onclick=Ja)}_t(l,d);var T;l=null;for(ie in p)if(!d.hasOwnProperty(ie)&&p.hasOwnProperty(ie)&&p[ie]!=null)if(ie==="style"){var I=p[ie];for(T in I)I.hasOwnProperty(T)&&(l||(l={}),l[T]="")}else ie!=="dangerouslySetInnerHTML"&&ie!=="children"&&ie!=="suppressContentEditableWarning"&&ie!=="suppressHydrationWarning"&&ie!=="autoFocus"&&(s.hasOwnProperty(ie)?v||(v=[]):(v=v||[]).push(ie,null));for(ie in d){var z=d[ie];if(I=p!=null?p[ie]:void 0,d.hasOwnProperty(ie)&&z!==I&&(z!=null||I!=null))if(ie==="style")if(I){for(T in I)!I.hasOwnProperty(T)||z&&z.hasOwnProperty(T)||(l||(l={}),l[T]="");for(T in z)z.hasOwnProperty(T)&&I[T]!==z[T]&&(l||(l={}),l[T]=z[T])}else l||(v||(v=[]),v.push(ie,l)),l=z;else ie==="dangerouslySetInnerHTML"?(z=z?z.__html:void 0,I=I?I.__html:void 0,z!=null&&I!==z&&(v=v||[]).push(ie,z)):ie==="children"?typeof z!="string"&&typeof z!="number"||(v=v||[]).push(ie,""+z):ie!=="suppressContentEditableWarning"&&ie!=="suppressHydrationWarning"&&(s.hasOwnProperty(ie)?(z!=null&&ie==="onScroll"&&jt("scroll",n),v||I===z||(v=[])):(v=v||[]).push(ie,z))}l&&(v=v||[]).push("style",l);var ie=v;(r.updateQueue=ie)&&(r.flags|=4)}},hm=function(n,r,l,d){l!==d&&(r.flags|=4)};function ra(n,r){if(!Kt)switch(n.tailMode){case"hidden":r=n.tail;for(var l=null;r!==null;)r.alternate!==null&&(l=r),r=r.sibling;l===null?n.tail=null:l.sibling=null;break;case"collapsed":l=n.tail;for(var d=null;l!==null;)l.alternate!==null&&(d=l),l=l.sibling;d===null?r||n.tail===null?n.tail=null:n.tail.sibling=null:d.sibling=null}}function wn(n){var r=n.alternate!==null&&n.alternate.child===n.child,l=0,d=0;if(r)for(var p=n.child;p!==null;)l|=p.lanes|p.childLanes,d|=p.subtreeFlags&14680064,d|=p.flags&14680064,p.return=n,p=p.sibling;else for(p=n.child;p!==null;)l|=p.lanes|p.childLanes,d|=p.subtreeFlags,d|=p.flags,p.return=n,p=p.sibling;return n.subtreeFlags|=d,n.childLanes=l,r}function E0(n,r,l){var d=r.pendingProps;switch(cu(r),r.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return wn(r),null;case 1:return Hn(r.type)&&tl(),wn(r),null;case 3:return d=r.stateNode,zs(),Xt(zn),Xt(En),Mu(),d.pendingContext&&(d.context=d.pendingContext,d.pendingContext=null),(n===null||n.child===null)&&(ol(r)?r.flags|=4:n===null||n.memoizedState.isDehydrated&&(r.flags&256)===0||(r.flags|=1024,hi!==null&&(Qu(hi),hi=null))),Hu(n,r),wn(r),null;case 5:yu(r);var p=ts(Jo.current);if(l=r.type,n!==null&&r.stateNode!=null)dm(n,r,l,d,p),n.ref!==r.ref&&(r.flags|=512,r.flags|=2097152);else{if(!d){if(r.stateNode===null)throw Error(t(166));return wn(r),null}if(n=ts(Pi.current),ol(r)){d=r.stateNode,l=r.type;var v=r.memoizedProps;switch(d[Ci]=r,d[qo]=v,n=(r.mode&1)!==0,l){case"dialog":jt("cancel",d),jt("close",d);break;case"iframe":case"object":case"embed":jt("load",d);break;case"video":case"audio":for(p=0;p<jo.length;p++)jt(jo[p],d);break;case"source":jt("error",d);break;case"img":case"image":case"link":jt("error",d),jt("load",d);break;case"details":jt("toggle",d);break;case"input":Yt(d,v),jt("invalid",d);break;case"select":d._wrapperState={wasMultiple:!!v.multiple},jt("invalid",d);break;case"textarea":te(d,v),jt("invalid",d)}_t(l,v),p=null;for(var T in v)if(v.hasOwnProperty(T)){var I=v[T];T==="children"?typeof I=="string"?d.textContent!==I&&(v.suppressHydrationWarning!==!0&&Qa(d.textContent,I,n),p=["children",I]):typeof I=="number"&&d.textContent!==""+I&&(v.suppressHydrationWarning!==!0&&Qa(d.textContent,I,n),p=["children",""+I]):s.hasOwnProperty(T)&&I!=null&&T==="onScroll"&&jt("scroll",d)}switch(l){case"input":Et(d),Ke(d,v,!0);break;case"textarea":Et(d),ye(d);break;case"select":case"option":break;default:typeof v.onClick=="function"&&(d.onclick=Ja)}d=p,r.updateQueue=d,d!==null&&(r.flags|=4)}else{T=p.nodeType===9?p:p.ownerDocument,n==="http://www.w3.org/1999/xhtml"&&(n=me(l)),n==="http://www.w3.org/1999/xhtml"?l==="script"?(n=T.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild)):typeof d.is=="string"?n=T.createElement(l,{is:d.is}):(n=T.createElement(l),l==="select"&&(T=n,d.multiple?T.multiple=!0:d.size&&(T.size=d.size))):n=T.createElementNS(n,l),n[Ci]=r,n[qo]=d,um(n,r,!1,!1),r.stateNode=n;e:{switch(T=dt(l,d),l){case"dialog":jt("cancel",n),jt("close",n),p=d;break;case"iframe":case"object":case"embed":jt("load",n),p=d;break;case"video":case"audio":for(p=0;p<jo.length;p++)jt(jo[p],n);p=d;break;case"source":jt("error",n),p=d;break;case"img":case"image":case"link":jt("error",n),jt("load",n),p=d;break;case"details":jt("toggle",n),p=d;break;case"input":Yt(n,d),p=B(n,d),jt("invalid",n);break;case"option":p=d;break;case"select":n._wrapperState={wasMultiple:!!d.multiple},p=oe({},d,{value:void 0}),jt("invalid",n);break;case"textarea":te(n,d),p=w(n,d),jt("invalid",n);break;default:p=d}_t(l,p),I=p;for(v in I)if(I.hasOwnProperty(v)){var z=I[v];v==="style"?nt(n,z):v==="dangerouslySetInnerHTML"?(z=z?z.__html:void 0,z!=null&&ke(n,z)):v==="children"?typeof z=="string"?(l!=="textarea"||z!=="")&&ht(n,z):typeof z=="number"&&ht(n,""+z):v!=="suppressContentEditableWarning"&&v!=="suppressHydrationWarning"&&v!=="autoFocus"&&(s.hasOwnProperty(v)?z!=null&&v==="onScroll"&&jt("scroll",n):z!=null&&L(n,v,z,T))}switch(l){case"input":Et(n),Ke(n,d,!1);break;case"textarea":Et(n),ye(n);break;case"option":d.value!=null&&n.setAttribute("value",""+Re(d.value));break;case"select":n.multiple=!!d.multiple,v=d.value,v!=null?P(n,!!d.multiple,v,!1):d.defaultValue!=null&&P(n,!!d.multiple,d.defaultValue,!0);break;default:typeof p.onClick=="function"&&(n.onclick=Ja)}switch(l){case"button":case"input":case"select":case"textarea":d=!!d.autoFocus;break e;case"img":d=!0;break e;default:d=!1}}d&&(r.flags|=4)}r.ref!==null&&(r.flags|=512,r.flags|=2097152)}return wn(r),null;case 6:if(n&&r.stateNode!=null)hm(n,r,n.memoizedProps,d);else{if(typeof d!="string"&&r.stateNode===null)throw Error(t(166));if(l=ts(Jo.current),ts(Pi.current),ol(r)){if(d=r.stateNode,l=r.memoizedProps,d[Ci]=r,(v=d.nodeValue!==l)&&(n=Kn,n!==null))switch(n.tag){case 3:Qa(d.nodeValue,l,(n.mode&1)!==0);break;case 5:n.memoizedProps.suppressHydrationWarning!==!0&&Qa(d.nodeValue,l,(n.mode&1)!==0)}v&&(r.flags|=4)}else d=(l.nodeType===9?l:l.ownerDocument).createTextNode(d),d[Ci]=r,r.stateNode=d}return wn(r),null;case 13:if(Xt($t),d=r.memoizedState,n===null||n.memoizedState!==null&&n.memoizedState.dehydrated!==null){if(Kt&&$n!==null&&(r.mode&1)!==0&&(r.flags&128)===0)mp(),Fs(),r.flags|=98560,v=!1;else if(v=ol(r),d!==null&&d.dehydrated!==null){if(n===null){if(!v)throw Error(t(318));if(v=r.memoizedState,v=v!==null?v.dehydrated:null,!v)throw Error(t(317));v[Ci]=r}else Fs(),(r.flags&128)===0&&(r.memoizedState=null),r.flags|=4;wn(r),v=!1}else hi!==null&&(Qu(hi),hi=null),v=!0;if(!v)return r.flags&65536?r:null}return(r.flags&128)!==0?(r.lanes=l,r):(d=d!==null,d!==(n!==null&&n.memoizedState!==null)&&d&&(r.child.flags|=8192,(r.mode&1)!==0&&(n===null||($t.current&1)!==0?an===0&&(an=3):td())),r.updateQueue!==null&&(r.flags|=4),wn(r),null);case 4:return zs(),Hu(n,r),n===null&&Xo(r.stateNode.containerInfo),wn(r),null;case 10:return mu(r.type._context),wn(r),null;case 17:return Hn(r.type)&&tl(),wn(r),null;case 19:if(Xt($t),v=r.memoizedState,v===null)return wn(r),null;if(d=(r.flags&128)!==0,T=v.rendering,T===null)if(d)ra(v,!1);else{if(an!==0||n!==null&&(n.flags&128)!==0)for(n=r.child;n!==null;){if(T=hl(n),T!==null){for(r.flags|=128,ra(v,!1),d=T.updateQueue,d!==null&&(r.updateQueue=d,r.flags|=4),r.subtreeFlags=0,d=l,l=r.child;l!==null;)v=l,n=d,v.flags&=14680066,T=v.alternate,T===null?(v.childLanes=0,v.lanes=n,v.child=null,v.subtreeFlags=0,v.memoizedProps=null,v.memoizedState=null,v.updateQueue=null,v.dependencies=null,v.stateNode=null):(v.childLanes=T.childLanes,v.lanes=T.lanes,v.child=T.child,v.subtreeFlags=0,v.deletions=null,v.memoizedProps=T.memoizedProps,v.memoizedState=T.memoizedState,v.updateQueue=T.updateQueue,v.type=T.type,n=T.dependencies,v.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),l=l.sibling;return Gt($t,$t.current&1|2),r.child}n=n.sibling}v.tail!==null&&G()>Ws&&(r.flags|=128,d=!0,ra(v,!1),r.lanes=4194304)}else{if(!d)if(n=hl(T),n!==null){if(r.flags|=128,d=!0,l=n.updateQueue,l!==null&&(r.updateQueue=l,r.flags|=4),ra(v,!0),v.tail===null&&v.tailMode==="hidden"&&!T.alternate&&!Kt)return wn(r),null}else 2*G()-v.renderingStartTime>Ws&&l!==1073741824&&(r.flags|=128,d=!0,ra(v,!1),r.lanes=4194304);v.isBackwards?(T.sibling=r.child,r.child=T):(l=v.last,l!==null?l.sibling=T:r.child=T,v.last=T)}return v.tail!==null?(r=v.tail,v.rendering=r,v.tail=r.sibling,v.renderingStartTime=G(),r.sibling=null,l=$t.current,Gt($t,d?l&1|2:l&1),r):(wn(r),null);case 22:case 23:return ed(),d=r.memoizedState!==null,n!==null&&n.memoizedState!==null!==d&&(r.flags|=8192),d&&(r.mode&1)!==0?(Zn&1073741824)!==0&&(wn(r),r.subtreeFlags&6&&(r.flags|=8192)):wn(r),null;case 24:return null;case 25:return null}throw Error(t(156,r.tag))}function T0(n,r){switch(cu(r),r.tag){case 1:return Hn(r.type)&&tl(),n=r.flags,n&65536?(r.flags=n&-65537|128,r):null;case 3:return zs(),Xt(zn),Xt(En),Mu(),n=r.flags,(n&65536)!==0&&(n&128)===0?(r.flags=n&-65537|128,r):null;case 5:return yu(r),null;case 13:if(Xt($t),n=r.memoizedState,n!==null&&n.dehydrated!==null){if(r.alternate===null)throw Error(t(340));Fs()}return n=r.flags,n&65536?(r.flags=n&-65537|128,r):null;case 19:return Xt($t),null;case 4:return zs(),null;case 10:return mu(r.type._context),null;case 22:case 23:return ed(),null;case 24:return null;default:return null}}var Sl=!1,An=!1,w0=typeof WeakSet=="function"?WeakSet:Set,Ge=null;function Vs(n,r){var l=n.ref;if(l!==null)if(typeof l=="function")try{l(null)}catch(d){en(n,r,d)}else l.current=null}function Vu(n,r,l){try{l()}catch(d){en(n,r,d)}}var fm=!1;function A0(n,r){if(eu=Ha,n=jf(),Xc(n)){if("selectionStart"in n)var l={start:n.selectionStart,end:n.selectionEnd};else e:{l=(l=n.ownerDocument)&&l.defaultView||window;var d=l.getSelection&&l.getSelection();if(d&&d.rangeCount!==0){l=d.anchorNode;var p=d.anchorOffset,v=d.focusNode;d=d.focusOffset;try{l.nodeType,v.nodeType}catch{l=null;break e}var T=0,I=-1,z=-1,ie=0,Me=0,Te=n,Se=null;t:for(;;){for(var Fe;Te!==l||p!==0&&Te.nodeType!==3||(I=T+p),Te!==v||d!==0&&Te.nodeType!==3||(z=T+d),Te.nodeType===3&&(T+=Te.nodeValue.length),(Fe=Te.firstChild)!==null;)Se=Te,Te=Fe;for(;;){if(Te===n)break t;if(Se===l&&++ie===p&&(I=T),Se===v&&++Me===d&&(z=T),(Fe=Te.nextSibling)!==null)break;Te=Se,Se=Te.parentNode}Te=Fe}l=I===-1||z===-1?null:{start:I,end:z}}else l=null}l=l||{start:0,end:0}}else l=null;for(tu={focusedElem:n,selectionRange:l},Ha=!1,Ge=r;Ge!==null;)if(r=Ge,n=r.child,(r.subtreeFlags&1028)!==0&&n!==null)n.return=r,Ge=n;else for(;Ge!==null;){r=Ge;try{var je=r.alternate;if((r.flags&1024)!==0)switch(r.tag){case 0:case 11:case 15:break;case 1:if(je!==null){var qe=je.memoizedProps,nn=je.memoizedState,Z=r.stateNode,W=Z.getSnapshotBeforeUpdate(r.elementType===r.type?qe:fi(r.type,qe),nn);Z.__reactInternalSnapshotBeforeUpdate=W}break;case 3:var ee=r.stateNode.containerInfo;ee.nodeType===1?ee.textContent="":ee.nodeType===9&&ee.documentElement&&ee.removeChild(ee.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(t(163))}}catch(Ae){en(r,r.return,Ae)}if(n=r.sibling,n!==null){n.return=r.return,Ge=n;break}Ge=r.return}return je=fm,fm=!1,je}function sa(n,r,l){var d=r.updateQueue;if(d=d!==null?d.lastEffect:null,d!==null){var p=d=d.next;do{if((p.tag&n)===n){var v=p.destroy;p.destroy=void 0,v!==void 0&&Vu(r,l,v)}p=p.next}while(p!==d)}}function Ml(n,r){if(r=r.updateQueue,r=r!==null?r.lastEffect:null,r!==null){var l=r=r.next;do{if((l.tag&n)===n){var d=l.create;l.destroy=d()}l=l.next}while(l!==r)}}function Gu(n){var r=n.ref;if(r!==null){var l=n.stateNode;switch(n.tag){case 5:n=l;break;default:n=l}typeof r=="function"?r(n):r.current=n}}function pm(n){var r=n.alternate;r!==null&&(n.alternate=null,pm(r)),n.child=null,n.deletions=null,n.sibling=null,n.tag===5&&(r=n.stateNode,r!==null&&(delete r[Ci],delete r[qo],delete r[su],delete r[l0],delete r[c0])),n.stateNode=null,n.return=null,n.dependencies=null,n.memoizedProps=null,n.memoizedState=null,n.pendingProps=null,n.stateNode=null,n.updateQueue=null}function mm(n){return n.tag===5||n.tag===3||n.tag===4}function gm(n){e:for(;;){for(;n.sibling===null;){if(n.return===null||mm(n.return))return null;n=n.return}for(n.sibling.return=n.return,n=n.sibling;n.tag!==5&&n.tag!==6&&n.tag!==18;){if(n.flags&2||n.child===null||n.tag===4)continue e;n.child.return=n,n=n.child}if(!(n.flags&2))return n.stateNode}}function Wu(n,r,l){var d=n.tag;if(d===5||d===6)n=n.stateNode,r?l.nodeType===8?l.parentNode.insertBefore(n,r):l.insertBefore(n,r):(l.nodeType===8?(r=l.parentNode,r.insertBefore(n,l)):(r=l,r.appendChild(n)),l=l._reactRootContainer,l!=null||r.onclick!==null||(r.onclick=Ja));else if(d!==4&&(n=n.child,n!==null))for(Wu(n,r,l),n=n.sibling;n!==null;)Wu(n,r,l),n=n.sibling}function ju(n,r,l){var d=n.tag;if(d===5||d===6)n=n.stateNode,r?l.insertBefore(n,r):l.appendChild(n);else if(d!==4&&(n=n.child,n!==null))for(ju(n,r,l),n=n.sibling;n!==null;)ju(n,r,l),n=n.sibling}var xn=null,pi=!1;function Er(n,r,l){for(l=l.child;l!==null;)_m(n,r,l),l=l.sibling}function _m(n,r,l){if(ft&&typeof ft.onCommitFiberUnmount=="function")try{ft.onCommitFiberUnmount(Qe,l)}catch{}switch(l.tag){case 5:An||Vs(l,r);case 6:var d=xn,p=pi;xn=null,Er(n,r,l),xn=d,pi=p,xn!==null&&(pi?(n=xn,l=l.stateNode,n.nodeType===8?n.parentNode.removeChild(l):n.removeChild(l)):xn.removeChild(l.stateNode));break;case 18:xn!==null&&(pi?(n=xn,l=l.stateNode,n.nodeType===8?ru(n.parentNode,l):n.nodeType===1&&ru(n,l),Oo(n)):ru(xn,l.stateNode));break;case 4:d=xn,p=pi,xn=l.stateNode.containerInfo,pi=!0,Er(n,r,l),xn=d,pi=p;break;case 0:case 11:case 14:case 15:if(!An&&(d=l.updateQueue,d!==null&&(d=d.lastEffect,d!==null))){p=d=d.next;do{var v=p,T=v.destroy;v=v.tag,T!==void 0&&((v&2)!==0||(v&4)!==0)&&Vu(l,r,T),p=p.next}while(p!==d)}Er(n,r,l);break;case 1:if(!An&&(Vs(l,r),d=l.stateNode,typeof d.componentWillUnmount=="function"))try{d.props=l.memoizedProps,d.state=l.memoizedState,d.componentWillUnmount()}catch(I){en(l,r,I)}Er(n,r,l);break;case 21:Er(n,r,l);break;case 22:l.mode&1?(An=(d=An)||l.memoizedState!==null,Er(n,r,l),An=d):Er(n,r,l);break;default:Er(n,r,l)}}function vm(n){var r=n.updateQueue;if(r!==null){n.updateQueue=null;var l=n.stateNode;l===null&&(l=n.stateNode=new w0),r.forEach(function(d){var p=U0.bind(null,n,d);l.has(d)||(l.add(d),d.then(p,p))})}}function mi(n,r){var l=r.deletions;if(l!==null)for(var d=0;d<l.length;d++){var p=l[d];try{var v=n,T=r,I=T;e:for(;I!==null;){switch(I.tag){case 5:xn=I.stateNode,pi=!1;break e;case 3:xn=I.stateNode.containerInfo,pi=!0;break e;case 4:xn=I.stateNode.containerInfo,pi=!0;break e}I=I.return}if(xn===null)throw Error(t(160));_m(v,T,p),xn=null,pi=!1;var z=p.alternate;z!==null&&(z.return=null),p.return=null}catch(ie){en(p,r,ie)}}if(r.subtreeFlags&12854)for(r=r.child;r!==null;)xm(r,n),r=r.sibling}function xm(n,r){var l=n.alternate,d=n.flags;switch(n.tag){case 0:case 11:case 14:case 15:if(mi(r,n),Ni(n),d&4){try{sa(3,n,n.return),Ml(3,n)}catch(qe){en(n,n.return,qe)}try{sa(5,n,n.return)}catch(qe){en(n,n.return,qe)}}break;case 1:mi(r,n),Ni(n),d&512&&l!==null&&Vs(l,l.return);break;case 5:if(mi(r,n),Ni(n),d&512&&l!==null&&Vs(l,l.return),n.flags&32){var p=n.stateNode;try{ht(p,"")}catch(qe){en(n,n.return,qe)}}if(d&4&&(p=n.stateNode,p!=null)){var v=n.memoizedProps,T=l!==null?l.memoizedProps:v,I=n.type,z=n.updateQueue;if(n.updateQueue=null,z!==null)try{I==="input"&&v.type==="radio"&&v.name!=null&&it(p,v),dt(I,T);var ie=dt(I,v);for(T=0;T<z.length;T+=2){var Me=z[T],Te=z[T+1];Me==="style"?nt(p,Te):Me==="dangerouslySetInnerHTML"?ke(p,Te):Me==="children"?ht(p,Te):L(p,Me,Te,ie)}switch(I){case"input":gt(p,v);break;case"textarea":ve(p,v);break;case"select":var Se=p._wrapperState.wasMultiple;p._wrapperState.wasMultiple=!!v.multiple;var Fe=v.value;Fe!=null?P(p,!!v.multiple,Fe,!1):Se!==!!v.multiple&&(v.defaultValue!=null?P(p,!!v.multiple,v.defaultValue,!0):P(p,!!v.multiple,v.multiple?[]:"",!1))}p[qo]=v}catch(qe){en(n,n.return,qe)}}break;case 6:if(mi(r,n),Ni(n),d&4){if(n.stateNode===null)throw Error(t(162));p=n.stateNode,v=n.memoizedProps;try{p.nodeValue=v}catch(qe){en(n,n.return,qe)}}break;case 3:if(mi(r,n),Ni(n),d&4&&l!==null&&l.memoizedState.isDehydrated)try{Oo(r.containerInfo)}catch(qe){en(n,n.return,qe)}break;case 4:mi(r,n),Ni(n);break;case 13:mi(r,n),Ni(n),p=n.child,p.flags&8192&&(v=p.memoizedState!==null,p.stateNode.isHidden=v,!v||p.alternate!==null&&p.alternate.memoizedState!==null||(qu=G())),d&4&&vm(n);break;case 22:if(Me=l!==null&&l.memoizedState!==null,n.mode&1?(An=(ie=An)||Me,mi(r,n),An=ie):mi(r,n),Ni(n),d&8192){if(ie=n.memoizedState!==null,(n.stateNode.isHidden=ie)&&!Me&&(n.mode&1)!==0)for(Ge=n,Me=n.child;Me!==null;){for(Te=Ge=Me;Ge!==null;){switch(Se=Ge,Fe=Se.child,Se.tag){case 0:case 11:case 14:case 15:sa(4,Se,Se.return);break;case 1:Vs(Se,Se.return);var je=Se.stateNode;if(typeof je.componentWillUnmount=="function"){d=Se,l=Se.return;try{r=d,je.props=r.memoizedProps,je.state=r.memoizedState,je.componentWillUnmount()}catch(qe){en(d,l,qe)}}break;case 5:Vs(Se,Se.return);break;case 22:if(Se.memoizedState!==null){Mm(Te);continue}}Fe!==null?(Fe.return=Se,Ge=Fe):Mm(Te)}Me=Me.sibling}e:for(Me=null,Te=n;;){if(Te.tag===5){if(Me===null){Me=Te;try{p=Te.stateNode,ie?(v=p.style,typeof v.setProperty=="function"?v.setProperty("display","none","important"):v.display="none"):(I=Te.stateNode,z=Te.memoizedProps.style,T=z!=null&&z.hasOwnProperty("display")?z.display:null,I.style.display=Ye("display",T))}catch(qe){en(n,n.return,qe)}}}else if(Te.tag===6){if(Me===null)try{Te.stateNode.nodeValue=ie?"":Te.memoizedProps}catch(qe){en(n,n.return,qe)}}else if((Te.tag!==22&&Te.tag!==23||Te.memoizedState===null||Te===n)&&Te.child!==null){Te.child.return=Te,Te=Te.child;continue}if(Te===n)break e;for(;Te.sibling===null;){if(Te.return===null||Te.return===n)break e;Me===Te&&(Me=null),Te=Te.return}Me===Te&&(Me=null),Te.sibling.return=Te.return,Te=Te.sibling}}break;case 19:mi(r,n),Ni(n),d&4&&vm(n);break;case 21:break;default:mi(r,n),Ni(n)}}function Ni(n){var r=n.flags;if(r&2){try{e:{for(var l=n.return;l!==null;){if(mm(l)){var d=l;break e}l=l.return}throw Error(t(160))}switch(d.tag){case 5:var p=d.stateNode;d.flags&32&&(ht(p,""),d.flags&=-33);var v=gm(n);ju(n,v,p);break;case 3:case 4:var T=d.stateNode.containerInfo,I=gm(n);Wu(n,I,T);break;default:throw Error(t(161))}}catch(z){en(n,n.return,z)}n.flags&=-3}r&4096&&(n.flags&=-4097)}function R0(n,r,l){Ge=n,ym(n)}function ym(n,r,l){for(var d=(n.mode&1)!==0;Ge!==null;){var p=Ge,v=p.child;if(p.tag===22&&d){var T=p.memoizedState!==null||Sl;if(!T){var I=p.alternate,z=I!==null&&I.memoizedState!==null||An;I=Sl;var ie=An;if(Sl=T,(An=z)&&!ie)for(Ge=p;Ge!==null;)T=Ge,z=T.child,T.tag===22&&T.memoizedState!==null?Em(p):z!==null?(z.return=T,Ge=z):Em(p);for(;v!==null;)Ge=v,ym(v),v=v.sibling;Ge=p,Sl=I,An=ie}Sm(n)}else(p.subtreeFlags&8772)!==0&&v!==null?(v.return=p,Ge=v):Sm(n)}}function Sm(n){for(;Ge!==null;){var r=Ge;if((r.flags&8772)!==0){var l=r.alternate;try{if((r.flags&8772)!==0)switch(r.tag){case 0:case 11:case 15:An||Ml(5,r);break;case 1:var d=r.stateNode;if(r.flags&4&&!An)if(l===null)d.componentDidMount();else{var p=r.elementType===r.type?l.memoizedProps:fi(r.type,l.memoizedProps);d.componentDidUpdate(p,l.memoizedState,d.__reactInternalSnapshotBeforeUpdate)}var v=r.updateQueue;v!==null&&Mp(r,v,d);break;case 3:var T=r.updateQueue;if(T!==null){if(l=null,r.child!==null)switch(r.child.tag){case 5:l=r.child.stateNode;break;case 1:l=r.child.stateNode}Mp(r,T,l)}break;case 5:var I=r.stateNode;if(l===null&&r.flags&4){l=I;var z=r.memoizedProps;switch(r.type){case"button":case"input":case"select":case"textarea":z.autoFocus&&l.focus();break;case"img":z.src&&(l.src=z.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(r.memoizedState===null){var ie=r.alternate;if(ie!==null){var Me=ie.memoizedState;if(Me!==null){var Te=Me.dehydrated;Te!==null&&Oo(Te)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(t(163))}An||r.flags&512&&Gu(r)}catch(Se){en(r,r.return,Se)}}if(r===n){Ge=null;break}if(l=r.sibling,l!==null){l.return=r.return,Ge=l;break}Ge=r.return}}function Mm(n){for(;Ge!==null;){var r=Ge;if(r===n){Ge=null;break}var l=r.sibling;if(l!==null){l.return=r.return,Ge=l;break}Ge=r.return}}function Em(n){for(;Ge!==null;){var r=Ge;try{switch(r.tag){case 0:case 11:case 15:var l=r.return;try{Ml(4,r)}catch(z){en(r,l,z)}break;case 1:var d=r.stateNode;if(typeof d.componentDidMount=="function"){var p=r.return;try{d.componentDidMount()}catch(z){en(r,p,z)}}var v=r.return;try{Gu(r)}catch(z){en(r,v,z)}break;case 5:var T=r.return;try{Gu(r)}catch(z){en(r,T,z)}}}catch(z){en(r,r.return,z)}if(r===n){Ge=null;break}var I=r.sibling;if(I!==null){I.return=r.return,Ge=I;break}Ge=r.return}}var b0=Math.ceil,El=b.ReactCurrentDispatcher,Xu=b.ReactCurrentOwner,si=b.ReactCurrentBatchConfig,bt=0,fn=null,rn=null,yn=0,Zn=0,Gs=vr(0),an=0,oa=null,is=0,Tl=0,Yu=0,aa=null,Gn=null,qu=0,Ws=1/0,$i=null,wl=!1,Ku=null,Tr=null,Al=!1,wr=null,Rl=0,la=0,$u=null,bl=-1,Cl=0;function Nn(){return(bt&6)!==0?G():bl!==-1?bl:bl=G()}function Ar(n){return(n.mode&1)===0?1:(bt&2)!==0&&yn!==0?yn&-yn:d0.transition!==null?(Cl===0&&(Cl=Pn()),Cl):(n=St,n!==0||(n=window.event,n=n===void 0?16:wf(n.type)),n)}function gi(n,r,l,d){if(50<la)throw la=0,$u=null,Error(t(185));tn(n,l,d),((bt&2)===0||n!==fn)&&(n===fn&&((bt&2)===0&&(Tl|=l),an===4&&Rr(n,yn)),Wn(n,d),l===1&&bt===0&&(r.mode&1)===0&&(Ws=G()+500,il&&yr()))}function Wn(n,r){var l=n.callbackNode;qr(n,r);var d=ui(n,n===fn?yn:0);if(d===0)l!==null&&q(l),n.callbackNode=null,n.callbackPriority=0;else if(r=d&-d,n.callbackPriority!==r){if(l!=null&&q(l),r===1)n.tag===0?u0(wm.bind(null,n)):up(wm.bind(null,n)),o0(function(){(bt&6)===0&&yr()}),l=null;else{switch(_f(d)){case 1:l=De;break;case 4:l=He;break;case 16:l=Ve;break;case 536870912:l=ct;break;default:l=Ve}l=Dm(l,Tm.bind(null,n))}n.callbackPriority=r,n.callbackNode=l}}function Tm(n,r){if(bl=-1,Cl=0,(bt&6)!==0)throw Error(t(327));var l=n.callbackNode;if(js()&&n.callbackNode!==l)return null;var d=ui(n,n===fn?yn:0);if(d===0)return null;if((d&30)!==0||(d&n.expiredLanes)!==0||r)r=Pl(n,d);else{r=d;var p=bt;bt|=2;var v=Rm();(fn!==n||yn!==r)&&($i=null,Ws=G()+500,ss(n,r));do try{L0();break}catch(I){Am(n,I)}while(!0);pu(),El.current=v,bt=p,rn!==null?r=0:(fn=null,yn=0,r=an)}if(r!==0){if(r===2&&(p=Bt(n),p!==0&&(d=p,r=Zu(n,p))),r===1)throw l=oa,ss(n,0),Rr(n,d),Wn(n,G()),l;if(r===6)Rr(n,d);else{if(p=n.current.alternate,(d&30)===0&&!C0(p)&&(r=Pl(n,d),r===2&&(v=Bt(n),v!==0&&(d=v,r=Zu(n,v))),r===1))throw l=oa,ss(n,0),Rr(n,d),Wn(n,G()),l;switch(n.finishedWork=p,n.finishedLanes=d,r){case 0:case 1:throw Error(t(345));case 2:os(n,Gn,$i);break;case 3:if(Rr(n,d),(d&130023424)===d&&(r=qu+500-G(),10<r)){if(ui(n,0)!==0)break;if(p=n.suspendedLanes,(p&d)!==d){Nn(),n.pingedLanes|=n.suspendedLanes&p;break}n.timeoutHandle=iu(os.bind(null,n,Gn,$i),r);break}os(n,Gn,$i);break;case 4:if(Rr(n,d),(d&4194240)===d)break;for(r=n.eventTimes,p=-1;0<d;){var T=31-Lt(d);v=1<<T,T=r[T],T>p&&(p=T),d&=~v}if(d=p,d=G()-d,d=(120>d?120:480>d?480:1080>d?1080:1920>d?1920:3e3>d?3e3:4320>d?4320:1960*b0(d/1960))-d,10<d){n.timeoutHandle=iu(os.bind(null,n,Gn,$i),d);break}os(n,Gn,$i);break;case 5:os(n,Gn,$i);break;default:throw Error(t(329))}}}return Wn(n,G()),n.callbackNode===l?Tm.bind(null,n):null}function Zu(n,r){var l=aa;return n.current.memoizedState.isDehydrated&&(ss(n,r).flags|=256),n=Pl(n,r),n!==2&&(r=Gn,Gn=l,r!==null&&Qu(r)),n}function Qu(n){Gn===null?Gn=n:Gn.push.apply(Gn,n)}function C0(n){for(var r=n;;){if(r.flags&16384){var l=r.updateQueue;if(l!==null&&(l=l.stores,l!==null))for(var d=0;d<l.length;d++){var p=l[d],v=p.getSnapshot;p=p.value;try{if(!di(v(),p))return!1}catch{return!1}}}if(l=r.child,r.subtreeFlags&16384&&l!==null)l.return=r,r=l;else{if(r===n)break;for(;r.sibling===null;){if(r.return===null||r.return===n)return!0;r=r.return}r.sibling.return=r.return,r=r.sibling}}return!0}function Rr(n,r){for(r&=~Yu,r&=~Tl,n.suspendedLanes|=r,n.pingedLanes&=~r,n=n.expirationTimes;0<r;){var l=31-Lt(r),d=1<<l;n[l]=-1,r&=~d}}function wm(n){if((bt&6)!==0)throw Error(t(327));js();var r=ui(n,0);if((r&1)===0)return Wn(n,G()),null;var l=Pl(n,r);if(n.tag!==0&&l===2){var d=Bt(n);d!==0&&(r=d,l=Zu(n,d))}if(l===1)throw l=oa,ss(n,0),Rr(n,r),Wn(n,G()),l;if(l===6)throw Error(t(345));return n.finishedWork=n.current.alternate,n.finishedLanes=r,os(n,Gn,$i),Wn(n,G()),null}function Ju(n,r){var l=bt;bt|=1;try{return n(r)}finally{bt=l,bt===0&&(Ws=G()+500,il&&yr())}}function rs(n){wr!==null&&wr.tag===0&&(bt&6)===0&&js();var r=bt;bt|=1;var l=si.transition,d=St;try{if(si.transition=null,St=1,n)return n()}finally{St=d,si.transition=l,bt=r,(bt&6)===0&&yr()}}function ed(){Zn=Gs.current,Xt(Gs)}function ss(n,r){n.finishedWork=null,n.finishedLanes=0;var l=n.timeoutHandle;if(l!==-1&&(n.timeoutHandle=-1,s0(l)),rn!==null)for(l=rn.return;l!==null;){var d=l;switch(cu(d),d.tag){case 1:d=d.type.childContextTypes,d!=null&&tl();break;case 3:zs(),Xt(zn),Xt(En),Mu();break;case 5:yu(d);break;case 4:zs();break;case 13:Xt($t);break;case 19:Xt($t);break;case 10:mu(d.type._context);break;case 22:case 23:ed()}l=l.return}if(fn=n,rn=n=br(n.current,null),yn=Zn=r,an=0,oa=null,Yu=Tl=is=0,Gn=aa=null,es!==null){for(r=0;r<es.length;r++)if(l=es[r],d=l.interleaved,d!==null){l.interleaved=null;var p=d.next,v=l.pending;if(v!==null){var T=v.next;v.next=p,d.next=T}l.pending=d}es=null}return n}function Am(n,r){do{var l=rn;try{if(pu(),fl.current=_l,pl){for(var d=Zt.memoizedState;d!==null;){var p=d.queue;p!==null&&(p.pending=null),d=d.next}pl=!1}if(ns=0,hn=on=Zt=null,ea=!1,ta=0,Xu.current=null,l===null||l.return===null){an=1,oa=r,rn=null;break}e:{var v=n,T=l.return,I=l,z=r;if(r=yn,I.flags|=32768,z!==null&&typeof z=="object"&&typeof z.then=="function"){var ie=z,Me=I,Te=Me.tag;if((Me.mode&1)===0&&(Te===0||Te===11||Te===15)){var Se=Me.alternate;Se?(Me.updateQueue=Se.updateQueue,Me.memoizedState=Se.memoizedState,Me.lanes=Se.lanes):(Me.updateQueue=null,Me.memoizedState=null)}var Fe=Zp(T);if(Fe!==null){Fe.flags&=-257,Qp(Fe,T,I,v,r),Fe.mode&1&&$p(v,ie,r),r=Fe,z=ie;var je=r.updateQueue;if(je===null){var qe=new Set;qe.add(z),r.updateQueue=qe}else je.add(z);break e}else{if((r&1)===0){$p(v,ie,r),td();break e}z=Error(t(426))}}else if(Kt&&I.mode&1){var nn=Zp(T);if(nn!==null){(nn.flags&65536)===0&&(nn.flags|=256),Qp(nn,T,I,v,r),hu(Hs(z,I));break e}}v=z=Hs(z,I),an!==4&&(an=2),aa===null?aa=[v]:aa.push(v),v=T;do{switch(v.tag){case 3:v.flags|=65536,r&=-r,v.lanes|=r;var Z=qp(v,z,r);Sp(v,Z);break e;case 1:I=z;var W=v.type,ee=v.stateNode;if((v.flags&128)===0&&(typeof W.getDerivedStateFromError=="function"||ee!==null&&typeof ee.componentDidCatch=="function"&&(Tr===null||!Tr.has(ee)))){v.flags|=65536,r&=-r,v.lanes|=r;var Ae=Kp(v,I,r);Sp(v,Ae);break e}}v=v.return}while(v!==null)}Cm(l)}catch($e){r=$e,rn===l&&l!==null&&(rn=l=l.return);continue}break}while(!0)}function Rm(){var n=El.current;return El.current=_l,n===null?_l:n}function td(){(an===0||an===3||an===2)&&(an=4),fn===null||(is&268435455)===0&&(Tl&268435455)===0||Rr(fn,yn)}function Pl(n,r){var l=bt;bt|=2;var d=Rm();(fn!==n||yn!==r)&&($i=null,ss(n,r));do try{P0();break}catch(p){Am(n,p)}while(!0);if(pu(),bt=l,El.current=d,rn!==null)throw Error(t(261));return fn=null,yn=0,an}function P0(){for(;rn!==null;)bm(rn)}function L0(){for(;rn!==null&&!re();)bm(rn)}function bm(n){var r=Nm(n.alternate,n,Zn);n.memoizedProps=n.pendingProps,r===null?Cm(n):rn=r,Xu.current=null}function Cm(n){var r=n;do{var l=r.alternate;if(n=r.return,(r.flags&32768)===0){if(l=E0(l,r,Zn),l!==null){rn=l;return}}else{if(l=T0(l,r),l!==null){l.flags&=32767,rn=l;return}if(n!==null)n.flags|=32768,n.subtreeFlags=0,n.deletions=null;else{an=6,rn=null;return}}if(r=r.sibling,r!==null){rn=r;return}rn=r=n}while(r!==null);an===0&&(an=5)}function os(n,r,l){var d=St,p=si.transition;try{si.transition=null,St=1,N0(n,r,l,d)}finally{si.transition=p,St=d}return null}function N0(n,r,l,d){do js();while(wr!==null);if((bt&6)!==0)throw Error(t(327));l=n.finishedWork;var p=n.finishedLanes;if(l===null)return null;if(n.finishedWork=null,n.finishedLanes=0,l===n.current)throw Error(t(177));n.callbackNode=null,n.callbackPriority=0;var v=l.lanes|l.childLanes;if(Mn(n,v),n===fn&&(rn=fn=null,yn=0),(l.subtreeFlags&2064)===0&&(l.flags&2064)===0||Al||(Al=!0,Dm(Ve,function(){return js(),null})),v=(l.flags&15990)!==0,(l.subtreeFlags&15990)!==0||v){v=si.transition,si.transition=null;var T=St;St=1;var I=bt;bt|=4,Xu.current=null,A0(n,l),xm(l,n),Qv(tu),Ha=!!eu,tu=eu=null,n.current=l,R0(l),se(),bt=I,St=T,si.transition=v}else n.current=l;if(Al&&(Al=!1,wr=n,Rl=p),v=n.pendingLanes,v===0&&(Tr=null),Pt(l.stateNode),Wn(n,G()),r!==null)for(d=n.onRecoverableError,l=0;l<r.length;l++)p=r[l],d(p.value,{componentStack:p.stack,digest:p.digest});if(wl)throw wl=!1,n=Ku,Ku=null,n;return(Rl&1)!==0&&n.tag!==0&&js(),v=n.pendingLanes,(v&1)!==0?n===$u?la++:(la=0,$u=n):la=0,yr(),null}function js(){if(wr!==null){var n=_f(Rl),r=si.transition,l=St;try{if(si.transition=null,St=16>n?16:n,wr===null)var d=!1;else{if(n=wr,wr=null,Rl=0,(bt&6)!==0)throw Error(t(331));var p=bt;for(bt|=4,Ge=n.current;Ge!==null;){var v=Ge,T=v.child;if((Ge.flags&16)!==0){var I=v.deletions;if(I!==null){for(var z=0;z<I.length;z++){var ie=I[z];for(Ge=ie;Ge!==null;){var Me=Ge;switch(Me.tag){case 0:case 11:case 15:sa(8,Me,v)}var Te=Me.child;if(Te!==null)Te.return=Me,Ge=Te;else for(;Ge!==null;){Me=Ge;var Se=Me.sibling,Fe=Me.return;if(pm(Me),Me===ie){Ge=null;break}if(Se!==null){Se.return=Fe,Ge=Se;break}Ge=Fe}}}var je=v.alternate;if(je!==null){var qe=je.child;if(qe!==null){je.child=null;do{var nn=qe.sibling;qe.sibling=null,qe=nn}while(qe!==null)}}Ge=v}}if((v.subtreeFlags&2064)!==0&&T!==null)T.return=v,Ge=T;else e:for(;Ge!==null;){if(v=Ge,(v.flags&2048)!==0)switch(v.tag){case 0:case 11:case 15:sa(9,v,v.return)}var Z=v.sibling;if(Z!==null){Z.return=v.return,Ge=Z;break e}Ge=v.return}}var W=n.current;for(Ge=W;Ge!==null;){T=Ge;var ee=T.child;if((T.subtreeFlags&2064)!==0&&ee!==null)ee.return=T,Ge=ee;else e:for(T=W;Ge!==null;){if(I=Ge,(I.flags&2048)!==0)try{switch(I.tag){case 0:case 11:case 15:Ml(9,I)}}catch($e){en(I,I.return,$e)}if(I===T){Ge=null;break e}var Ae=I.sibling;if(Ae!==null){Ae.return=I.return,Ge=Ae;break e}Ge=I.return}}if(bt=p,yr(),ft&&typeof ft.onPostCommitFiberRoot=="function")try{ft.onPostCommitFiberRoot(Qe,n)}catch{}d=!0}return d}finally{St=l,si.transition=r}}return!1}function Pm(n,r,l){r=Hs(l,r),r=qp(n,r,1),n=Mr(n,r,1),r=Nn(),n!==null&&(tn(n,1,r),Wn(n,r))}function en(n,r,l){if(n.tag===3)Pm(n,n,l);else for(;r!==null;){if(r.tag===3){Pm(r,n,l);break}else if(r.tag===1){var d=r.stateNode;if(typeof r.type.getDerivedStateFromError=="function"||typeof d.componentDidCatch=="function"&&(Tr===null||!Tr.has(d))){n=Hs(l,n),n=Kp(r,n,1),r=Mr(r,n,1),n=Nn(),r!==null&&(tn(r,1,n),Wn(r,n));break}}r=r.return}}function D0(n,r,l){var d=n.pingCache;d!==null&&d.delete(r),r=Nn(),n.pingedLanes|=n.suspendedLanes&l,fn===n&&(yn&l)===l&&(an===4||an===3&&(yn&130023424)===yn&&500>G()-qu?ss(n,0):Yu|=l),Wn(n,r)}function Lm(n,r){r===0&&((n.mode&1)===0?r=1:(r=Tt,Tt<<=1,(Tt&130023424)===0&&(Tt=4194304)));var l=Nn();n=Yi(n,r),n!==null&&(tn(n,r,l),Wn(n,l))}function I0(n){var r=n.memoizedState,l=0;r!==null&&(l=r.retryLane),Lm(n,l)}function U0(n,r){var l=0;switch(n.tag){case 13:var d=n.stateNode,p=n.memoizedState;p!==null&&(l=p.retryLane);break;case 19:d=n.stateNode;break;default:throw Error(t(314))}d!==null&&d.delete(r),Lm(n,l)}var Nm;Nm=function(n,r,l){if(n!==null)if(n.memoizedProps!==r.pendingProps||zn.current)Vn=!0;else{if((n.lanes&l)===0&&(r.flags&128)===0)return Vn=!1,M0(n,r,l);Vn=(n.flags&131072)!==0}else Vn=!1,Kt&&(r.flags&1048576)!==0&&dp(r,sl,r.index);switch(r.lanes=0,r.tag){case 2:var d=r.type;yl(n,r),n=r.pendingProps;var p=Ds(r,En.current);Bs(r,l),p=wu(null,r,d,n,p,l);var v=Au();return r.flags|=1,typeof p=="object"&&p!==null&&typeof p.render=="function"&&p.$$typeof===void 0?(r.tag=1,r.memoizedState=null,r.updateQueue=null,Hn(d)?(v=!0,nl(r)):v=!1,r.memoizedState=p.state!==null&&p.state!==void 0?p.state:null,vu(r),p.updater=vl,r.stateNode=p,p._reactInternals=r,Nu(r,d,n,l),r=Fu(null,r,d,!0,v,l)):(r.tag=0,Kt&&v&&lu(r),Ln(null,r,p,l),r=r.child),r;case 16:d=r.elementType;e:{switch(yl(n,r),n=r.pendingProps,p=d._init,d=p(d._payload),r.type=d,p=r.tag=O0(d),n=fi(d,n),p){case 0:r=Uu(null,r,d,n,l);break e;case 1:r=rm(null,r,d,n,l);break e;case 11:r=Jp(null,r,d,n,l);break e;case 14:r=em(null,r,d,fi(d.type,n),l);break e}throw Error(t(306,d,""))}return r;case 0:return d=r.type,p=r.pendingProps,p=r.elementType===d?p:fi(d,p),Uu(n,r,d,p,l);case 1:return d=r.type,p=r.pendingProps,p=r.elementType===d?p:fi(d,p),rm(n,r,d,p,l);case 3:e:{if(sm(r),n===null)throw Error(t(387));d=r.pendingProps,v=r.memoizedState,p=v.element,yp(n,r),dl(r,d,null,l);var T=r.memoizedState;if(d=T.element,v.isDehydrated)if(v={element:d,isDehydrated:!1,cache:T.cache,pendingSuspenseBoundaries:T.pendingSuspenseBoundaries,transitions:T.transitions},r.updateQueue.baseState=v,r.memoizedState=v,r.flags&256){p=Hs(Error(t(423)),r),r=om(n,r,d,l,p);break e}else if(d!==p){p=Hs(Error(t(424)),r),r=om(n,r,d,l,p);break e}else for($n=_r(r.stateNode.containerInfo.firstChild),Kn=r,Kt=!0,hi=null,l=vp(r,null,d,l),r.child=l;l;)l.flags=l.flags&-3|4096,l=l.sibling;else{if(Fs(),d===p){r=Ki(n,r,l);break e}Ln(n,r,d,l)}r=r.child}return r;case 5:return Ep(r),n===null&&du(r),d=r.type,p=r.pendingProps,v=n!==null?n.memoizedProps:null,T=p.children,nu(d,p)?T=null:v!==null&&nu(d,v)&&(r.flags|=32),im(n,r),Ln(n,r,T,l),r.child;case 6:return n===null&&du(r),null;case 13:return am(n,r,l);case 4:return xu(r,r.stateNode.containerInfo),d=r.pendingProps,n===null?r.child=Os(r,null,d,l):Ln(n,r,d,l),r.child;case 11:return d=r.type,p=r.pendingProps,p=r.elementType===d?p:fi(d,p),Jp(n,r,d,p,l);case 7:return Ln(n,r,r.pendingProps,l),r.child;case 8:return Ln(n,r,r.pendingProps.children,l),r.child;case 12:return Ln(n,r,r.pendingProps.children,l),r.child;case 10:e:{if(d=r.type._context,p=r.pendingProps,v=r.memoizedProps,T=p.value,Gt(ll,d._currentValue),d._currentValue=T,v!==null)if(di(v.value,T)){if(v.children===p.children&&!zn.current){r=Ki(n,r,l);break e}}else for(v=r.child,v!==null&&(v.return=r);v!==null;){var I=v.dependencies;if(I!==null){T=v.child;for(var z=I.firstContext;z!==null;){if(z.context===d){if(v.tag===1){z=qi(-1,l&-l),z.tag=2;var ie=v.updateQueue;if(ie!==null){ie=ie.shared;var Me=ie.pending;Me===null?z.next=z:(z.next=Me.next,Me.next=z),ie.pending=z}}v.lanes|=l,z=v.alternate,z!==null&&(z.lanes|=l),gu(v.return,l,r),I.lanes|=l;break}z=z.next}}else if(v.tag===10)T=v.type===r.type?null:v.child;else if(v.tag===18){if(T=v.return,T===null)throw Error(t(341));T.lanes|=l,I=T.alternate,I!==null&&(I.lanes|=l),gu(T,l,r),T=v.sibling}else T=v.child;if(T!==null)T.return=v;else for(T=v;T!==null;){if(T===r){T=null;break}if(v=T.sibling,v!==null){v.return=T.return,T=v;break}T=T.return}v=T}Ln(n,r,p.children,l),r=r.child}return r;case 9:return p=r.type,d=r.pendingProps.children,Bs(r,l),p=ii(p),d=d(p),r.flags|=1,Ln(n,r,d,l),r.child;case 14:return d=r.type,p=fi(d,r.pendingProps),p=fi(d.type,p),em(n,r,d,p,l);case 15:return tm(n,r,r.type,r.pendingProps,l);case 17:return d=r.type,p=r.pendingProps,p=r.elementType===d?p:fi(d,p),yl(n,r),r.tag=1,Hn(d)?(n=!0,nl(r)):n=!1,Bs(r,l),Xp(r,d,p),Nu(r,d,p,l),Fu(null,r,d,!0,n,l);case 19:return cm(n,r,l);case 22:return nm(n,r,l)}throw Error(t(156,r.tag))};function Dm(n,r){return A(n,r)}function F0(n,r,l,d){this.tag=n,this.key=l,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=r,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=d,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function oi(n,r,l,d){return new F0(n,r,l,d)}function nd(n){return n=n.prototype,!(!n||!n.isReactComponent)}function O0(n){if(typeof n=="function")return nd(n)?1:0;if(n!=null){if(n=n.$$typeof,n===J)return 11;if(n===ue)return 14}return 2}function br(n,r){var l=n.alternate;return l===null?(l=oi(n.tag,r,n.key,n.mode),l.elementType=n.elementType,l.type=n.type,l.stateNode=n.stateNode,l.alternate=n,n.alternate=l):(l.pendingProps=r,l.type=n.type,l.flags=0,l.subtreeFlags=0,l.deletions=null),l.flags=n.flags&14680064,l.childLanes=n.childLanes,l.lanes=n.lanes,l.child=n.child,l.memoizedProps=n.memoizedProps,l.memoizedState=n.memoizedState,l.updateQueue=n.updateQueue,r=n.dependencies,l.dependencies=r===null?null:{lanes:r.lanes,firstContext:r.firstContext},l.sibling=n.sibling,l.index=n.index,l.ref=n.ref,l}function Ll(n,r,l,d,p,v){var T=2;if(d=n,typeof n=="function")nd(n)&&(T=1);else if(typeof n=="string")T=5;else e:switch(n){case F:return as(l.children,p,v,r);case X:T=8,p|=8;break;case C:return n=oi(12,l,r,p|2),n.elementType=C,n.lanes=v,n;case K:return n=oi(13,l,r,p),n.elementType=K,n.lanes=v,n;case fe:return n=oi(19,l,r,p),n.elementType=fe,n.lanes=v,n;case de:return Nl(l,p,v,r);default:if(typeof n=="object"&&n!==null)switch(n.$$typeof){case R:T=10;break e;case H:T=9;break e;case J:T=11;break e;case ue:T=14;break e;case ce:T=16,d=null;break e}throw Error(t(130,n==null?n:typeof n,""))}return r=oi(T,l,r,p),r.elementType=n,r.type=d,r.lanes=v,r}function as(n,r,l,d){return n=oi(7,n,d,r),n.lanes=l,n}function Nl(n,r,l,d){return n=oi(22,n,d,r),n.elementType=de,n.lanes=l,n.stateNode={isHidden:!1},n}function id(n,r,l){return n=oi(6,n,null,r),n.lanes=l,n}function rd(n,r,l){return r=oi(4,n.children!==null?n.children:[],n.key,r),r.lanes=l,r.stateNode={containerInfo:n.containerInfo,pendingChildren:null,implementation:n.implementation},r}function k0(n,r,l,d,p){this.tag=r,this.containerInfo=n,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Sn(0),this.expirationTimes=Sn(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Sn(0),this.identifierPrefix=d,this.onRecoverableError=p,this.mutableSourceEagerHydrationData=null}function sd(n,r,l,d,p,v,T,I,z){return n=new k0(n,r,l,I,z),r===1?(r=1,v===!0&&(r|=8)):r=0,v=oi(3,null,null,r),n.current=v,v.stateNode=n,v.memoizedState={element:d,isDehydrated:l,cache:null,transitions:null,pendingSuspenseBoundaries:null},vu(v),n}function B0(n,r,l){var d=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:k,key:d==null?null:""+d,children:n,containerInfo:r,implementation:l}}function Im(n){if(!n)return xr;n=n._reactInternals;e:{if(bi(n)!==n||n.tag!==1)throw Error(t(170));var r=n;do{switch(r.tag){case 3:r=r.stateNode.context;break e;case 1:if(Hn(r.type)){r=r.stateNode.__reactInternalMemoizedMergedChildContext;break e}}r=r.return}while(r!==null);throw Error(t(171))}if(n.tag===1){var l=n.type;if(Hn(l))return lp(n,l,r)}return r}function Um(n,r,l,d,p,v,T,I,z){return n=sd(l,d,!0,n,p,v,T,I,z),n.context=Im(null),l=n.current,d=Nn(),p=Ar(l),v=qi(d,p),v.callback=r??null,Mr(l,v,p),n.current.lanes=p,tn(n,p,d),Wn(n,d),n}function Dl(n,r,l,d){var p=r.current,v=Nn(),T=Ar(p);return l=Im(l),r.context===null?r.context=l:r.pendingContext=l,r=qi(v,T),r.payload={element:n},d=d===void 0?null:d,d!==null&&(r.callback=d),n=Mr(p,r,T),n!==null&&(gi(n,p,T,v),ul(n,p,T)),T}function Il(n){if(n=n.current,!n.child)return null;switch(n.child.tag){case 5:return n.child.stateNode;default:return n.child.stateNode}}function Fm(n,r){if(n=n.memoizedState,n!==null&&n.dehydrated!==null){var l=n.retryLane;n.retryLane=l!==0&&l<r?l:r}}function od(n,r){Fm(n,r),(n=n.alternate)&&Fm(n,r)}function z0(){return null}var Om=typeof reportError=="function"?reportError:function(n){console.error(n)};function ad(n){this._internalRoot=n}Ul.prototype.render=ad.prototype.render=function(n){var r=this._internalRoot;if(r===null)throw Error(t(409));Dl(n,r,null,null)},Ul.prototype.unmount=ad.prototype.unmount=function(){var n=this._internalRoot;if(n!==null){this._internalRoot=null;var r=n.containerInfo;rs(function(){Dl(null,n,null,null)}),r[Gi]=null}};function Ul(n){this._internalRoot=n}Ul.prototype.unstable_scheduleHydration=function(n){if(n){var r=yf();n={blockedOn:null,target:n,priority:r};for(var l=0;l<pr.length&&r!==0&&r<pr[l].priority;l++);pr.splice(l,0,n),l===0&&Ef(n)}};function ld(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11)}function Fl(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11&&(n.nodeType!==8||n.nodeValue!==" react-mount-point-unstable "))}function km(){}function H0(n,r,l,d,p){if(p){if(typeof d=="function"){var v=d;d=function(){var ie=Il(T);v.call(ie)}}var T=Um(r,d,n,0,null,!1,!1,"",km);return n._reactRootContainer=T,n[Gi]=T.current,Xo(n.nodeType===8?n.parentNode:n),rs(),T}for(;p=n.lastChild;)n.removeChild(p);if(typeof d=="function"){var I=d;d=function(){var ie=Il(z);I.call(ie)}}var z=sd(n,0,!1,null,null,!1,!1,"",km);return n._reactRootContainer=z,n[Gi]=z.current,Xo(n.nodeType===8?n.parentNode:n),rs(function(){Dl(r,z,l,d)}),z}function Ol(n,r,l,d,p){var v=l._reactRootContainer;if(v){var T=v;if(typeof p=="function"){var I=p;p=function(){var z=Il(T);I.call(z)}}Dl(r,T,n,p)}else T=H0(l,r,n,p,d);return Il(T)}vf=function(n){switch(n.tag){case 3:var r=n.stateNode;if(r.current.memoizedState.isDehydrated){var l=vn(r.pendingLanes);l!==0&&(Kr(r,l|1),Wn(r,G()),(bt&6)===0&&(Ws=G()+500,yr()))}break;case 13:rs(function(){var d=Yi(n,1);if(d!==null){var p=Nn();gi(d,n,1,p)}}),od(n,1)}},Dc=function(n){if(n.tag===13){var r=Yi(n,134217728);if(r!==null){var l=Nn();gi(r,n,134217728,l)}od(n,134217728)}},xf=function(n){if(n.tag===13){var r=Ar(n),l=Yi(n,r);if(l!==null){var d=Nn();gi(l,n,r,d)}od(n,r)}},yf=function(){return St},Sf=function(n,r){var l=St;try{return St=n,r()}finally{St=l}},Ce=function(n,r,l){switch(r){case"input":if(gt(n,l),r=l.name,l.type==="radio"&&r!=null){for(l=n;l.parentNode;)l=l.parentNode;for(l=l.querySelectorAll("input[name="+JSON.stringify(""+r)+'][type="radio"]'),r=0;r<l.length;r++){var d=l[r];if(d!==n&&d.form===n.form){var p=el(d);if(!p)throw Error(t(90));st(d),gt(d,p)}}}break;case"textarea":ve(n,l);break;case"select":r=l.value,r!=null&&P(n,!!l.multiple,r,!1)}},kt=Ju,$=rs;var V0={usingClientEntryPoint:!1,Events:[Ko,Ls,el,Ne,at,Ju]},ca={findFiberByHostInstance:$r,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},G0={bundleType:ca.bundleType,version:ca.version,rendererPackageName:ca.rendererPackageName,rendererConfig:ca.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:b.ReactCurrentDispatcher,findHostInstanceByFiber:function(n){return n=Oa(n),n===null?null:n.stateNode},findFiberByHostInstance:ca.findFiberByHostInstance||z0,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var kl=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!kl.isDisabled&&kl.supportsFiber)try{Qe=kl.inject(G0),ft=kl}catch{}}return jn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=V0,jn.createPortal=function(n,r){var l=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!ld(r))throw Error(t(200));return B0(n,r,null,l)},jn.createRoot=function(n,r){if(!ld(n))throw Error(t(299));var l=!1,d="",p=Om;return r!=null&&(r.unstable_strictMode===!0&&(l=!0),r.identifierPrefix!==void 0&&(d=r.identifierPrefix),r.onRecoverableError!==void 0&&(p=r.onRecoverableError)),r=sd(n,1,!1,null,null,l,!1,d,p),n[Gi]=r.current,Xo(n.nodeType===8?n.parentNode:n),new ad(r)},jn.findDOMNode=function(n){if(n==null)return null;if(n.nodeType===1)return n;var r=n._reactInternals;if(r===void 0)throw typeof n.render=="function"?Error(t(188)):(n=Object.keys(n).join(","),Error(t(268,n)));return n=Oa(r),n=n===null?null:n.stateNode,n},jn.flushSync=function(n){return rs(n)},jn.hydrate=function(n,r,l){if(!Fl(r))throw Error(t(200));return Ol(null,n,r,!0,l)},jn.hydrateRoot=function(n,r,l){if(!ld(n))throw Error(t(405));var d=l!=null&&l.hydratedSources||null,p=!1,v="",T=Om;if(l!=null&&(l.unstable_strictMode===!0&&(p=!0),l.identifierPrefix!==void 0&&(v=l.identifierPrefix),l.onRecoverableError!==void 0&&(T=l.onRecoverableError)),r=Um(r,null,n,1,l??null,p,!1,v,T),n[Gi]=r.current,Xo(n),d)for(n=0;n<d.length;n++)l=d[n],p=l._getVersion,p=p(l._source),r.mutableSourceEagerHydrationData==null?r.mutableSourceEagerHydrationData=[l,p]:r.mutableSourceEagerHydrationData.push(l,p);return new Ul(r)},jn.render=function(n,r,l){if(!Fl(r))throw Error(t(200));return Ol(null,n,r,!1,l)},jn.unmountComponentAtNode=function(n){if(!Fl(n))throw Error(t(40));return n._reactRootContainer?(rs(function(){Ol(null,null,n,!1,function(){n._reactRootContainer=null,n[Gi]=null})}),!0):!1},jn.unstable_batchedUpdates=Ju,jn.unstable_renderSubtreeIntoContainer=function(n,r,l,d){if(!Fl(l))throw Error(t(200));if(n==null||n._reactInternals===void 0)throw Error(t(38));return Ol(n,r,l,!1,d)},jn.version="18.3.1-next-f1338f8080-20240426",jn}var Xm;function Q0(){if(Xm)return dd.exports;Xm=1;function o(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(o)}catch(e){console.error(e)}}return o(),dd.exports=Z0(),dd.exports}var Ym;function J0(){if(Ym)return Bl;Ym=1;var o=Q0();return Bl.createRoot=o.createRoot,Bl.hydrateRoot=o.hydrateRoot,Bl}var ex=J0();const tx=y_(ex);async function Ss(o){if(!o.ok){let e=`HTTP ${o.status}`;try{const t=await o.json();t!=null&&t.detail&&(e=typeof t.detail=="string"?t.detail:JSON.stringify(t.detail))}catch{}throw new Error(e)}return await o.json()}async function nx(){const o=await fetch("/api/pro/v1/catalog");return Ss(o)}async function da(){const o=await fetch("/api/pro/v1/models");return(await Ss(o)).models||[]}async function pd(o){const e=await fetch(`/api/pro/v1/models/${encodeURIComponent(o)}`);return Ss(e)}async function ix(o=20){const e=await fetch(`/api/pro/v1/models/seed-flagship?cycles_samples=${o}`,{method:"POST"});return Ss(e)}async function rx(o){const e=await fetch("/api/pro/v1/generate/character",{method:"POST",body:o});return Ss(e)}async function sx(o){const e=await fetch("/api/pro/v1/upres",{method:"POST",body:o});return Ss(e)}async function ox(o){const e=await fetch(`/api/pro/v1/models/${encodeURIComponent(o)}`,{method:"DELETE"});await Ss(e)}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const jh="171",ho={ROTATE:0,DOLLY:1,PAN:2},co={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},ax=0,qm=1,lx=2,S_=1,M_=2,ir=3,lr=0,Fn=1,yi=2,Gr=0,fo=1,Km=2,$m=3,Zm=4,cx=5,gs=100,ux=101,dx=102,hx=103,fx=104,px=200,mx=201,gx=202,_x=203,Jd=204,eh=205,vx=206,xx=207,yx=208,Sx=209,Mx=210,Ex=211,Tx=212,wx=213,Ax=214,th=0,nh=1,ih=2,_o=3,rh=4,sh=5,oh=6,ah=7,E_=0,Rx=1,bx=2,Wr=0,Cx=1,Px=2,Lx=3,T_=4,Nx=5,Dx=6,Ix=7,Qm="attached",Ux="detached",w_=300,vo=301,xo=302,lh=303,ch=304,bc=306,yo=1e3,zr=1001,Ec=1002,On=1003,A_=1004,Sa=1005,ei=1006,mc=1007,sr=1008,cr=1009,R_=1010,b_=1011,Aa=1012,Xh=1013,vs=1014,Ei=1015,Pa=1016,Yh=1017,qh=1018,So=1020,C_=35902,P_=1021,L_=1022,ci=1023,N_=1024,D_=1025,po=1026,Mo=1027,Kh=1028,$h=1029,I_=1030,Zh=1031,Qh=1033,gc=33776,_c=33777,vc=33778,xc=33779,uh=35840,dh=35841,hh=35842,fh=35843,ph=36196,mh=37492,gh=37496,_h=37808,vh=37809,xh=37810,yh=37811,Sh=37812,Mh=37813,Eh=37814,Th=37815,wh=37816,Ah=37817,Rh=37818,bh=37819,Ch=37820,Ph=37821,yc=36492,Lh=36494,Nh=36495,U_=36283,Dh=36284,Ih=36285,Uh=36286,Ra=2300,ba=2301,md=2302,Jm=2400,eg=2401,tg=2402,Fx=2500,Ox=0,F_=1,Fh=2,kx=3200,Bx=3201,Jh=0,zx=1,Br="",gn="srgb",Bn="srgb-linear",Tc="linear",zt="srgb",Xs=7680,ng=519,Hx=512,Vx=513,Gx=514,O_=515,Wx=516,jx=517,Xx=518,Yx=519,Oh=35044,ig="300 es",or=2e3,wc=2001;class Ms{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const s=this._listeners[e];if(s!==void 0){const a=s.indexOf(t);a!==-1&&s.splice(a,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let a=0,c=s.length;a<c;a++)s[a].call(this,e);e.target=null}}}const Rn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let rg=1234567;const Ea=Math.PI/180,Eo=180/Math.PI;function Ti(){const o=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Rn[o&255]+Rn[o>>8&255]+Rn[o>>16&255]+Rn[o>>24&255]+"-"+Rn[e&255]+Rn[e>>8&255]+"-"+Rn[e>>16&15|64]+Rn[e>>24&255]+"-"+Rn[t&63|128]+Rn[t>>8&255]+"-"+Rn[t>>16&255]+Rn[t>>24&255]+Rn[i&255]+Rn[i>>8&255]+Rn[i>>16&255]+Rn[i>>24&255]).toLowerCase()}function xt(o,e,t){return Math.max(e,Math.min(t,o))}function ef(o,e){return(o%e+e)%e}function qx(o,e,t,i,s){return i+(o-e)*(s-i)/(t-e)}function Kx(o,e,t){return o!==e?(t-o)/(e-o):0}function Ta(o,e,t){return(1-t)*o+t*e}function $x(o,e,t,i){return Ta(o,e,1-Math.exp(-t*i))}function Zx(o,e=1){return e-Math.abs(ef(o,e*2)-e)}function Qx(o,e,t){return o<=e?0:o>=t?1:(o=(o-e)/(t-e),o*o*(3-2*o))}function Jx(o,e,t){return o<=e?0:o>=t?1:(o=(o-e)/(t-e),o*o*o*(o*(o*6-15)+10))}function ey(o,e){return o+Math.floor(Math.random()*(e-o+1))}function ty(o,e){return o+Math.random()*(e-o)}function ny(o){return o*(.5-Math.random())}function iy(o){o!==void 0&&(rg=o);let e=rg+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function ry(o){return o*Ea}function sy(o){return o*Eo}function oy(o){return(o&o-1)===0&&o!==0}function ay(o){return Math.pow(2,Math.ceil(Math.log(o)/Math.LN2))}function ly(o){return Math.pow(2,Math.floor(Math.log(o)/Math.LN2))}function cy(o,e,t,i,s){const a=Math.cos,c=Math.sin,u=a(t/2),h=c(t/2),f=a((e+i)/2),m=c((e+i)/2),g=a((e-i)/2),_=c((e-i)/2),y=a((i-e)/2),M=c((i-e)/2);switch(s){case"XYX":o.set(u*m,h*g,h*_,u*f);break;case"YZY":o.set(h*_,u*m,h*g,u*f);break;case"ZXZ":o.set(h*g,h*_,u*m,u*f);break;case"XZX":o.set(u*m,h*M,h*y,u*f);break;case"YXY":o.set(h*y,u*m,h*M,u*f);break;case"ZYZ":o.set(h*M,h*y,u*m,u*f);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Si(o,e){switch(e.constructor){case Float32Array:return o;case Uint32Array:return o/4294967295;case Uint16Array:return o/65535;case Uint8Array:return o/255;case Int32Array:return Math.max(o/2147483647,-1);case Int16Array:return Math.max(o/32767,-1);case Int8Array:return Math.max(o/127,-1);default:throw new Error("Invalid component type.")}}function Ft(o,e){switch(e.constructor){case Float32Array:return o;case Uint32Array:return Math.round(o*4294967295);case Uint16Array:return Math.round(o*65535);case Uint8Array:return Math.round(o*255);case Int32Array:return Math.round(o*2147483647);case Int16Array:return Math.round(o*32767);case Int8Array:return Math.round(o*127);default:throw new Error("Invalid component type.")}}const k_={DEG2RAD:Ea,RAD2DEG:Eo,generateUUID:Ti,clamp:xt,euclideanModulo:ef,mapLinear:qx,inverseLerp:Kx,lerp:Ta,damp:$x,pingpong:Zx,smoothstep:Qx,smootherstep:Jx,randInt:ey,randFloat:ty,randFloatSpread:ny,seededRandom:iy,degToRad:ry,radToDeg:sy,isPowerOfTwo:oy,ceilPowerOfTwo:ay,floorPowerOfTwo:ly,setQuaternionFromProperEuler:cy,normalize:Ft,denormalize:Si};class ot{constructor(e=0,t=0){ot.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=xt(this.x,e.x,t.x),this.y=xt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=xt(this.x,e,t),this.y=xt(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(xt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(xt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),a=this.x-e.x,c=this.y-e.y;return this.x=a*i-c*s+e.x,this.y=a*s+c*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class mt{constructor(e,t,i,s,a,c,u,h,f){mt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,a,c,u,h,f)}set(e,t,i,s,a,c,u,h,f){const m=this.elements;return m[0]=e,m[1]=s,m[2]=u,m[3]=t,m[4]=a,m[5]=h,m[6]=i,m[7]=c,m[8]=f,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,a=this.elements,c=i[0],u=i[3],h=i[6],f=i[1],m=i[4],g=i[7],_=i[2],y=i[5],M=i[8],E=s[0],S=s[3],x=s[6],D=s[1],L=s[4],b=s[7],V=s[2],k=s[5],F=s[8];return a[0]=c*E+u*D+h*V,a[3]=c*S+u*L+h*k,a[6]=c*x+u*b+h*F,a[1]=f*E+m*D+g*V,a[4]=f*S+m*L+g*k,a[7]=f*x+m*b+g*F,a[2]=_*E+y*D+M*V,a[5]=_*S+y*L+M*k,a[8]=_*x+y*b+M*F,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],a=e[3],c=e[4],u=e[5],h=e[6],f=e[7],m=e[8];return t*c*m-t*u*f-i*a*m+i*u*h+s*a*f-s*c*h}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],a=e[3],c=e[4],u=e[5],h=e[6],f=e[7],m=e[8],g=m*c-u*f,_=u*h-m*a,y=f*a-c*h,M=t*g+i*_+s*y;if(M===0)return this.set(0,0,0,0,0,0,0,0,0);const E=1/M;return e[0]=g*E,e[1]=(s*f-m*i)*E,e[2]=(u*i-s*c)*E,e[3]=_*E,e[4]=(m*t-s*h)*E,e[5]=(s*a-u*t)*E,e[6]=y*E,e[7]=(i*h-f*t)*E,e[8]=(c*t-i*a)*E,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,a,c,u){const h=Math.cos(a),f=Math.sin(a);return this.set(i*h,i*f,-i*(h*c+f*u)+c+e,-s*f,s*h,-s*(-f*c+h*u)+u+t,0,0,1),this}scale(e,t){return this.premultiply(gd.makeScale(e,t)),this}rotate(e){return this.premultiply(gd.makeRotation(-e)),this}translate(e,t){return this.premultiply(gd.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const gd=new mt;function B_(o){for(let e=o.length-1;e>=0;--e)if(o[e]>=65535)return!0;return!1}function Ca(o){return document.createElementNS("http://www.w3.org/1999/xhtml",o)}function uy(){const o=Ca("canvas");return o.style.display="block",o}const sg={};function lo(o){o in sg||(sg[o]=!0,console.warn(o))}function dy(o,e,t){return new Promise(function(i,s){function a(){switch(o.clientWaitSync(e,o.SYNC_FLUSH_COMMANDS_BIT,0)){case o.WAIT_FAILED:s();break;case o.TIMEOUT_EXPIRED:setTimeout(a,t);break;default:i()}}setTimeout(a,t)})}function hy(o){const e=o.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function fy(o){const e=o.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const og=new mt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ag=new mt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function py(){const o={enabled:!0,workingColorSpace:Bn,spaces:{},convert:function(s,a,c){return this.enabled===!1||a===c||!a||!c||(this.spaces[a].transfer===zt&&(s.r=ar(s.r),s.g=ar(s.g),s.b=ar(s.b)),this.spaces[a].primaries!==this.spaces[c].primaries&&(s.applyMatrix3(this.spaces[a].toXYZ),s.applyMatrix3(this.spaces[c].fromXYZ)),this.spaces[c].transfer===zt&&(s.r=mo(s.r),s.g=mo(s.g),s.b=mo(s.b))),s},fromWorkingColorSpace:function(s,a){return this.convert(s,this.workingColorSpace,a)},toWorkingColorSpace:function(s,a){return this.convert(s,a,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Br?Tc:this.spaces[s].transfer},getLuminanceCoefficients:function(s,a=this.workingColorSpace){return s.fromArray(this.spaces[a].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,a,c){return s.copy(this.spaces[a].toXYZ).multiply(this.spaces[c].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return o.define({[Bn]:{primaries:e,whitePoint:i,transfer:Tc,toXYZ:og,fromXYZ:ag,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:gn},outputColorSpaceConfig:{drawingBufferColorSpace:gn}},[gn]:{primaries:e,whitePoint:i,transfer:zt,toXYZ:og,fromXYZ:ag,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:gn}}}),o}const At=py();function ar(o){return o<.04045?o*.0773993808:Math.pow(o*.9478672986+.0521327014,2.4)}function mo(o){return o<.0031308?o*12.92:1.055*Math.pow(o,.41666)-.055}let Ys;class my{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Ys===void 0&&(Ys=Ca("canvas")),Ys.width=e.width,Ys.height=e.height;const i=Ys.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),t=Ys}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Ca("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),a=s.data;for(let c=0;c<a.length;c++)a[c]=ar(a[c]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(ar(t[i]/255)*255):t[i]=ar(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let gy=0;class z_{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:gy++}),this.uuid=Ti(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let a;if(Array.isArray(s)){a=[];for(let c=0,u=s.length;c<u;c++)s[c].isDataTexture?a.push(_d(s[c].image)):a.push(_d(s[c]))}else a=_d(s);i.url=a}return t||(e.images[this.uuid]=i),i}}function _d(o){return typeof HTMLImageElement<"u"&&o instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&o instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&o instanceof ImageBitmap?my.getDataURL(o):o.data?{data:Array.from(o.data),width:o.width,height:o.height,type:o.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let _y=0;class _n extends Ms{constructor(e=_n.DEFAULT_IMAGE,t=_n.DEFAULT_MAPPING,i=zr,s=zr,a=ei,c=sr,u=ci,h=cr,f=_n.DEFAULT_ANISOTROPY,m=Br){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:_y++}),this.uuid=Ti(),this.name="",this.source=new z_(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=a,this.minFilter=c,this.anisotropy=f,this.format=u,this.internalFormat=null,this.type=h,this.offset=new ot(0,0),this.repeat=new ot(1,1),this.center=new ot(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new mt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=m,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==w_)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case yo:e.x=e.x-Math.floor(e.x);break;case zr:e.x=e.x<0?0:1;break;case Ec:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case yo:e.y=e.y-Math.floor(e.y);break;case zr:e.y=e.y<0?0:1;break;case Ec:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}_n.DEFAULT_IMAGE=null;_n.DEFAULT_MAPPING=w_;_n.DEFAULT_ANISOTROPY=1;class It{constructor(e=0,t=0,i=0,s=1){It.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,a=this.w,c=e.elements;return this.x=c[0]*t+c[4]*i+c[8]*s+c[12]*a,this.y=c[1]*t+c[5]*i+c[9]*s+c[13]*a,this.z=c[2]*t+c[6]*i+c[10]*s+c[14]*a,this.w=c[3]*t+c[7]*i+c[11]*s+c[15]*a,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,a;const h=e.elements,f=h[0],m=h[4],g=h[8],_=h[1],y=h[5],M=h[9],E=h[2],S=h[6],x=h[10];if(Math.abs(m-_)<.01&&Math.abs(g-E)<.01&&Math.abs(M-S)<.01){if(Math.abs(m+_)<.1&&Math.abs(g+E)<.1&&Math.abs(M+S)<.1&&Math.abs(f+y+x-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const L=(f+1)/2,b=(y+1)/2,V=(x+1)/2,k=(m+_)/4,F=(g+E)/4,X=(M+S)/4;return L>b&&L>V?L<.01?(i=0,s=.707106781,a=.707106781):(i=Math.sqrt(L),s=k/i,a=F/i):b>V?b<.01?(i=.707106781,s=0,a=.707106781):(s=Math.sqrt(b),i=k/s,a=X/s):V<.01?(i=.707106781,s=.707106781,a=0):(a=Math.sqrt(V),i=F/a,s=X/a),this.set(i,s,a,t),this}let D=Math.sqrt((S-M)*(S-M)+(g-E)*(g-E)+(_-m)*(_-m));return Math.abs(D)<.001&&(D=1),this.x=(S-M)/D,this.y=(g-E)/D,this.z=(_-m)/D,this.w=Math.acos((f+y+x-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=xt(this.x,e.x,t.x),this.y=xt(this.y,e.y,t.y),this.z=xt(this.z,e.z,t.z),this.w=xt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=xt(this.x,e,t),this.y=xt(this.y,e,t),this.z=xt(this.z,e,t),this.w=xt(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(xt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class vy extends Ms{constructor(e=1,t=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new It(0,0,e,t),this.scissorTest=!1,this.viewport=new It(0,0,e,t);const s={width:e,height:t,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ei,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const a=new _n(s,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);a.flipY=!1,a.generateMipmaps=i.generateMipmaps,a.internalFormat=i.internalFormat,this.textures=[];const c=i.count;for(let u=0;u<c;u++)this.textures[u]=a.clone(),this.textures[u].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,a=this.textures.length;s<a;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,s=e.textures.length;i<s;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new z_(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class xs extends vy{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class H_ extends _n{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=On,this.minFilter=On,this.wrapR=zr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class xy extends _n{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=On,this.minFilter=On,this.wrapR=zr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ui{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,a,c,u){let h=i[s+0],f=i[s+1],m=i[s+2],g=i[s+3];const _=a[c+0],y=a[c+1],M=a[c+2],E=a[c+3];if(u===0){e[t+0]=h,e[t+1]=f,e[t+2]=m,e[t+3]=g;return}if(u===1){e[t+0]=_,e[t+1]=y,e[t+2]=M,e[t+3]=E;return}if(g!==E||h!==_||f!==y||m!==M){let S=1-u;const x=h*_+f*y+m*M+g*E,D=x>=0?1:-1,L=1-x*x;if(L>Number.EPSILON){const V=Math.sqrt(L),k=Math.atan2(V,x*D);S=Math.sin(S*k)/V,u=Math.sin(u*k)/V}const b=u*D;if(h=h*S+_*b,f=f*S+y*b,m=m*S+M*b,g=g*S+E*b,S===1-u){const V=1/Math.sqrt(h*h+f*f+m*m+g*g);h*=V,f*=V,m*=V,g*=V}}e[t]=h,e[t+1]=f,e[t+2]=m,e[t+3]=g}static multiplyQuaternionsFlat(e,t,i,s,a,c){const u=i[s],h=i[s+1],f=i[s+2],m=i[s+3],g=a[c],_=a[c+1],y=a[c+2],M=a[c+3];return e[t]=u*M+m*g+h*y-f*_,e[t+1]=h*M+m*_+f*g-u*y,e[t+2]=f*M+m*y+u*_-h*g,e[t+3]=m*M-u*g-h*_-f*y,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,a=e._z,c=e._order,u=Math.cos,h=Math.sin,f=u(i/2),m=u(s/2),g=u(a/2),_=h(i/2),y=h(s/2),M=h(a/2);switch(c){case"XYZ":this._x=_*m*g+f*y*M,this._y=f*y*g-_*m*M,this._z=f*m*M+_*y*g,this._w=f*m*g-_*y*M;break;case"YXZ":this._x=_*m*g+f*y*M,this._y=f*y*g-_*m*M,this._z=f*m*M-_*y*g,this._w=f*m*g+_*y*M;break;case"ZXY":this._x=_*m*g-f*y*M,this._y=f*y*g+_*m*M,this._z=f*m*M+_*y*g,this._w=f*m*g-_*y*M;break;case"ZYX":this._x=_*m*g-f*y*M,this._y=f*y*g+_*m*M,this._z=f*m*M-_*y*g,this._w=f*m*g+_*y*M;break;case"YZX":this._x=_*m*g+f*y*M,this._y=f*y*g+_*m*M,this._z=f*m*M-_*y*g,this._w=f*m*g-_*y*M;break;case"XZY":this._x=_*m*g-f*y*M,this._y=f*y*g-_*m*M,this._z=f*m*M+_*y*g,this._w=f*m*g+_*y*M;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+c)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],a=t[8],c=t[1],u=t[5],h=t[9],f=t[2],m=t[6],g=t[10],_=i+u+g;if(_>0){const y=.5/Math.sqrt(_+1);this._w=.25/y,this._x=(m-h)*y,this._y=(a-f)*y,this._z=(c-s)*y}else if(i>u&&i>g){const y=2*Math.sqrt(1+i-u-g);this._w=(m-h)/y,this._x=.25*y,this._y=(s+c)/y,this._z=(a+f)/y}else if(u>g){const y=2*Math.sqrt(1+u-i-g);this._w=(a-f)/y,this._x=(s+c)/y,this._y=.25*y,this._z=(h+m)/y}else{const y=2*Math.sqrt(1+g-i-u);this._w=(c-s)/y,this._x=(a+f)/y,this._y=(h+m)/y,this._z=.25*y}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(xt(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,a=e._z,c=e._w,u=t._x,h=t._y,f=t._z,m=t._w;return this._x=i*m+c*u+s*f-a*h,this._y=s*m+c*h+a*u-i*f,this._z=a*m+c*f+i*h-s*u,this._w=c*m-i*u-s*h-a*f,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,s=this._y,a=this._z,c=this._w;let u=c*e._w+i*e._x+s*e._y+a*e._z;if(u<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,u=-u):this.copy(e),u>=1)return this._w=c,this._x=i,this._y=s,this._z=a,this;const h=1-u*u;if(h<=Number.EPSILON){const y=1-t;return this._w=y*c+t*this._w,this._x=y*i+t*this._x,this._y=y*s+t*this._y,this._z=y*a+t*this._z,this.normalize(),this}const f=Math.sqrt(h),m=Math.atan2(f,u),g=Math.sin((1-t)*m)/f,_=Math.sin(t*m)/f;return this._w=c*g+this._w*_,this._x=i*g+this._x*_,this._y=s*g+this._y*_,this._z=a*g+this._z*_,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),a=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),a*Math.sin(t),a*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class Y{constructor(e=0,t=0,i=0){Y.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(lg.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(lg.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,a=e.elements;return this.x=a[0]*t+a[3]*i+a[6]*s,this.y=a[1]*t+a[4]*i+a[7]*s,this.z=a[2]*t+a[5]*i+a[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,a=e.elements,c=1/(a[3]*t+a[7]*i+a[11]*s+a[15]);return this.x=(a[0]*t+a[4]*i+a[8]*s+a[12])*c,this.y=(a[1]*t+a[5]*i+a[9]*s+a[13])*c,this.z=(a[2]*t+a[6]*i+a[10]*s+a[14])*c,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,a=e.x,c=e.y,u=e.z,h=e.w,f=2*(c*s-u*i),m=2*(u*t-a*s),g=2*(a*i-c*t);return this.x=t+h*f+c*g-u*m,this.y=i+h*m+u*f-a*g,this.z=s+h*g+a*m-c*f,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s,this.y=a[1]*t+a[5]*i+a[9]*s,this.z=a[2]*t+a[6]*i+a[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=xt(this.x,e.x,t.x),this.y=xt(this.y,e.y,t.y),this.z=xt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=xt(this.x,e,t),this.y=xt(this.y,e,t),this.z=xt(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(xt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,a=e.z,c=t.x,u=t.y,h=t.z;return this.x=s*h-a*u,this.y=a*c-i*h,this.z=i*u-s*c,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return vd.copy(this).projectOnVector(e),this.sub(vd)}reflect(e){return this.sub(vd.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(xt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const vd=new Y,lg=new Ui;class Oi{constructor(e=new Y(1/0,1/0,1/0),t=new Y(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(_i.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(_i.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=_i.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const a=i.getAttribute("position");if(t===!0&&a!==void 0&&e.isInstancedMesh!==!0)for(let c=0,u=a.count;c<u;c++)e.isMesh===!0?e.getVertexPosition(c,_i):_i.fromBufferAttribute(a,c),_i.applyMatrix4(e.matrixWorld),this.expandByPoint(_i);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),zl.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),zl.copy(i.boundingBox)),zl.applyMatrix4(e.matrixWorld),this.union(zl)}const s=e.children;for(let a=0,c=s.length;a<c;a++)this.expandByObject(s[a],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,_i),_i.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ha),Hl.subVectors(this.max,ha),qs.subVectors(e.a,ha),Ks.subVectors(e.b,ha),$s.subVectors(e.c,ha),Pr.subVectors(Ks,qs),Lr.subVectors($s,Ks),ls.subVectors(qs,$s);let t=[0,-Pr.z,Pr.y,0,-Lr.z,Lr.y,0,-ls.z,ls.y,Pr.z,0,-Pr.x,Lr.z,0,-Lr.x,ls.z,0,-ls.x,-Pr.y,Pr.x,0,-Lr.y,Lr.x,0,-ls.y,ls.x,0];return!xd(t,qs,Ks,$s,Hl)||(t=[1,0,0,0,1,0,0,0,1],!xd(t,qs,Ks,$s,Hl))?!1:(Vl.crossVectors(Pr,Lr),t=[Vl.x,Vl.y,Vl.z],xd(t,qs,Ks,$s,Hl))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,_i).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(_i).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Zi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Zi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Zi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Zi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Zi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Zi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Zi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Zi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Zi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Zi=[new Y,new Y,new Y,new Y,new Y,new Y,new Y,new Y],_i=new Y,zl=new Oi,qs=new Y,Ks=new Y,$s=new Y,Pr=new Y,Lr=new Y,ls=new Y,ha=new Y,Hl=new Y,Vl=new Y,cs=new Y;function xd(o,e,t,i,s){for(let a=0,c=o.length-3;a<=c;a+=3){cs.fromArray(o,a);const u=s.x*Math.abs(cs.x)+s.y*Math.abs(cs.y)+s.z*Math.abs(cs.z),h=e.dot(cs),f=t.dot(cs),m=i.dot(cs);if(Math.max(-Math.max(h,f,m),Math.min(h,f,m))>u)return!1}return!0}const yy=new Oi,fa=new Y,yd=new Y;class ki{constructor(e=new Y,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):yy.setFromPoints(e).getCenter(i);let s=0;for(let a=0,c=e.length;a<c;a++)s=Math.max(s,i.distanceToSquared(e[a]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;fa.subVectors(e,this.center);const t=fa.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(fa,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(yd.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(fa.copy(e.center).add(yd)),this.expandByPoint(fa.copy(e.center).sub(yd))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Qi=new Y,Sd=new Y,Gl=new Y,Nr=new Y,Md=new Y,Wl=new Y,Ed=new Y;class La{constructor(e=new Y,t=new Y(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Qi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Qi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Qi.copy(this.origin).addScaledVector(this.direction,t),Qi.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){Sd.copy(e).add(t).multiplyScalar(.5),Gl.copy(t).sub(e).normalize(),Nr.copy(this.origin).sub(Sd);const a=e.distanceTo(t)*.5,c=-this.direction.dot(Gl),u=Nr.dot(this.direction),h=-Nr.dot(Gl),f=Nr.lengthSq(),m=Math.abs(1-c*c);let g,_,y,M;if(m>0)if(g=c*h-u,_=c*u-h,M=a*m,g>=0)if(_>=-M)if(_<=M){const E=1/m;g*=E,_*=E,y=g*(g+c*_+2*u)+_*(c*g+_+2*h)+f}else _=a,g=Math.max(0,-(c*_+u)),y=-g*g+_*(_+2*h)+f;else _=-a,g=Math.max(0,-(c*_+u)),y=-g*g+_*(_+2*h)+f;else _<=-M?(g=Math.max(0,-(-c*a+u)),_=g>0?-a:Math.min(Math.max(-a,-h),a),y=-g*g+_*(_+2*h)+f):_<=M?(g=0,_=Math.min(Math.max(-a,-h),a),y=_*(_+2*h)+f):(g=Math.max(0,-(c*a+u)),_=g>0?a:Math.min(Math.max(-a,-h),a),y=-g*g+_*(_+2*h)+f);else _=c>0?-a:a,g=Math.max(0,-(c*_+u)),y=-g*g+_*(_+2*h)+f;return i&&i.copy(this.origin).addScaledVector(this.direction,g),s&&s.copy(Sd).addScaledVector(Gl,_),y}intersectSphere(e,t){Qi.subVectors(e.center,this.origin);const i=Qi.dot(this.direction),s=Qi.dot(Qi)-i*i,a=e.radius*e.radius;if(s>a)return null;const c=Math.sqrt(a-s),u=i-c,h=i+c;return h<0?null:u<0?this.at(h,t):this.at(u,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,a,c,u,h;const f=1/this.direction.x,m=1/this.direction.y,g=1/this.direction.z,_=this.origin;return f>=0?(i=(e.min.x-_.x)*f,s=(e.max.x-_.x)*f):(i=(e.max.x-_.x)*f,s=(e.min.x-_.x)*f),m>=0?(a=(e.min.y-_.y)*m,c=(e.max.y-_.y)*m):(a=(e.max.y-_.y)*m,c=(e.min.y-_.y)*m),i>c||a>s||((a>i||isNaN(i))&&(i=a),(c<s||isNaN(s))&&(s=c),g>=0?(u=(e.min.z-_.z)*g,h=(e.max.z-_.z)*g):(u=(e.max.z-_.z)*g,h=(e.min.z-_.z)*g),i>h||u>s)||((u>i||i!==i)&&(i=u),(h<s||s!==s)&&(s=h),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,Qi)!==null}intersectTriangle(e,t,i,s,a){Md.subVectors(t,e),Wl.subVectors(i,e),Ed.crossVectors(Md,Wl);let c=this.direction.dot(Ed),u;if(c>0){if(s)return null;u=1}else if(c<0)u=-1,c=-c;else return null;Nr.subVectors(this.origin,e);const h=u*this.direction.dot(Wl.crossVectors(Nr,Wl));if(h<0)return null;const f=u*this.direction.dot(Md.cross(Nr));if(f<0||h+f>c)return null;const m=-u*Nr.dot(Ed);return m<0?null:this.at(m/c,a)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class pt{constructor(e,t,i,s,a,c,u,h,f,m,g,_,y,M,E,S){pt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,a,c,u,h,f,m,g,_,y,M,E,S)}set(e,t,i,s,a,c,u,h,f,m,g,_,y,M,E,S){const x=this.elements;return x[0]=e,x[4]=t,x[8]=i,x[12]=s,x[1]=a,x[5]=c,x[9]=u,x[13]=h,x[2]=f,x[6]=m,x[10]=g,x[14]=_,x[3]=y,x[7]=M,x[11]=E,x[15]=S,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new pt().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,s=1/Zs.setFromMatrixColumn(e,0).length(),a=1/Zs.setFromMatrixColumn(e,1).length(),c=1/Zs.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*a,t[5]=i[5]*a,t[6]=i[6]*a,t[7]=0,t[8]=i[8]*c,t[9]=i[9]*c,t[10]=i[10]*c,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,a=e.z,c=Math.cos(i),u=Math.sin(i),h=Math.cos(s),f=Math.sin(s),m=Math.cos(a),g=Math.sin(a);if(e.order==="XYZ"){const _=c*m,y=c*g,M=u*m,E=u*g;t[0]=h*m,t[4]=-h*g,t[8]=f,t[1]=y+M*f,t[5]=_-E*f,t[9]=-u*h,t[2]=E-_*f,t[6]=M+y*f,t[10]=c*h}else if(e.order==="YXZ"){const _=h*m,y=h*g,M=f*m,E=f*g;t[0]=_+E*u,t[4]=M*u-y,t[8]=c*f,t[1]=c*g,t[5]=c*m,t[9]=-u,t[2]=y*u-M,t[6]=E+_*u,t[10]=c*h}else if(e.order==="ZXY"){const _=h*m,y=h*g,M=f*m,E=f*g;t[0]=_-E*u,t[4]=-c*g,t[8]=M+y*u,t[1]=y+M*u,t[5]=c*m,t[9]=E-_*u,t[2]=-c*f,t[6]=u,t[10]=c*h}else if(e.order==="ZYX"){const _=c*m,y=c*g,M=u*m,E=u*g;t[0]=h*m,t[4]=M*f-y,t[8]=_*f+E,t[1]=h*g,t[5]=E*f+_,t[9]=y*f-M,t[2]=-f,t[6]=u*h,t[10]=c*h}else if(e.order==="YZX"){const _=c*h,y=c*f,M=u*h,E=u*f;t[0]=h*m,t[4]=E-_*g,t[8]=M*g+y,t[1]=g,t[5]=c*m,t[9]=-u*m,t[2]=-f*m,t[6]=y*g+M,t[10]=_-E*g}else if(e.order==="XZY"){const _=c*h,y=c*f,M=u*h,E=u*f;t[0]=h*m,t[4]=-g,t[8]=f*m,t[1]=_*g+E,t[5]=c*m,t[9]=y*g-M,t[2]=M*g-y,t[6]=u*m,t[10]=E*g+_}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Sy,e,My)}lookAt(e,t,i){const s=this.elements;return Qn.subVectors(e,t),Qn.lengthSq()===0&&(Qn.z=1),Qn.normalize(),Dr.crossVectors(i,Qn),Dr.lengthSq()===0&&(Math.abs(i.z)===1?Qn.x+=1e-4:Qn.z+=1e-4,Qn.normalize(),Dr.crossVectors(i,Qn)),Dr.normalize(),jl.crossVectors(Qn,Dr),s[0]=Dr.x,s[4]=jl.x,s[8]=Qn.x,s[1]=Dr.y,s[5]=jl.y,s[9]=Qn.y,s[2]=Dr.z,s[6]=jl.z,s[10]=Qn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,a=this.elements,c=i[0],u=i[4],h=i[8],f=i[12],m=i[1],g=i[5],_=i[9],y=i[13],M=i[2],E=i[6],S=i[10],x=i[14],D=i[3],L=i[7],b=i[11],V=i[15],k=s[0],F=s[4],X=s[8],C=s[12],R=s[1],H=s[5],J=s[9],K=s[13],fe=s[2],ue=s[6],ce=s[10],de=s[14],O=s[3],le=s[7],oe=s[11],U=s[15];return a[0]=c*k+u*R+h*fe+f*O,a[4]=c*F+u*H+h*ue+f*le,a[8]=c*X+u*J+h*ce+f*oe,a[12]=c*C+u*K+h*de+f*U,a[1]=m*k+g*R+_*fe+y*O,a[5]=m*F+g*H+_*ue+y*le,a[9]=m*X+g*J+_*ce+y*oe,a[13]=m*C+g*K+_*de+y*U,a[2]=M*k+E*R+S*fe+x*O,a[6]=M*F+E*H+S*ue+x*le,a[10]=M*X+E*J+S*ce+x*oe,a[14]=M*C+E*K+S*de+x*U,a[3]=D*k+L*R+b*fe+V*O,a[7]=D*F+L*H+b*ue+V*le,a[11]=D*X+L*J+b*ce+V*oe,a[15]=D*C+L*K+b*de+V*U,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],a=e[12],c=e[1],u=e[5],h=e[9],f=e[13],m=e[2],g=e[6],_=e[10],y=e[14],M=e[3],E=e[7],S=e[11],x=e[15];return M*(+a*h*g-s*f*g-a*u*_+i*f*_+s*u*y-i*h*y)+E*(+t*h*y-t*f*_+a*c*_-s*c*y+s*f*m-a*h*m)+S*(+t*f*g-t*u*y-a*c*g+i*c*y+a*u*m-i*f*m)+x*(-s*u*m-t*h*g+t*u*_+s*c*g-i*c*_+i*h*m)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],a=e[3],c=e[4],u=e[5],h=e[6],f=e[7],m=e[8],g=e[9],_=e[10],y=e[11],M=e[12],E=e[13],S=e[14],x=e[15],D=g*S*f-E*_*f+E*h*y-u*S*y-g*h*x+u*_*x,L=M*_*f-m*S*f-M*h*y+c*S*y+m*h*x-c*_*x,b=m*E*f-M*g*f+M*u*y-c*E*y-m*u*x+c*g*x,V=M*g*h-m*E*h-M*u*_+c*E*_+m*u*S-c*g*S,k=t*D+i*L+s*b+a*V;if(k===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const F=1/k;return e[0]=D*F,e[1]=(E*_*a-g*S*a-E*s*y+i*S*y+g*s*x-i*_*x)*F,e[2]=(u*S*a-E*h*a+E*s*f-i*S*f-u*s*x+i*h*x)*F,e[3]=(g*h*a-u*_*a-g*s*f+i*_*f+u*s*y-i*h*y)*F,e[4]=L*F,e[5]=(m*S*a-M*_*a+M*s*y-t*S*y-m*s*x+t*_*x)*F,e[6]=(M*h*a-c*S*a-M*s*f+t*S*f+c*s*x-t*h*x)*F,e[7]=(c*_*a-m*h*a+m*s*f-t*_*f-c*s*y+t*h*y)*F,e[8]=b*F,e[9]=(M*g*a-m*E*a-M*i*y+t*E*y+m*i*x-t*g*x)*F,e[10]=(c*E*a-M*u*a+M*i*f-t*E*f-c*i*x+t*u*x)*F,e[11]=(m*u*a-c*g*a-m*i*f+t*g*f+c*i*y-t*u*y)*F,e[12]=V*F,e[13]=(m*E*s-M*g*s+M*i*_-t*E*_-m*i*S+t*g*S)*F,e[14]=(M*u*s-c*E*s-M*i*h+t*E*h+c*i*S-t*u*S)*F,e[15]=(c*g*s-m*u*s+m*i*h-t*g*h-c*i*_+t*u*_)*F,this}scale(e){const t=this.elements,i=e.x,s=e.y,a=e.z;return t[0]*=i,t[4]*=s,t[8]*=a,t[1]*=i,t[5]*=s,t[9]*=a,t[2]*=i,t[6]*=s,t[10]*=a,t[3]*=i,t[7]*=s,t[11]*=a,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),a=1-i,c=e.x,u=e.y,h=e.z,f=a*c,m=a*u;return this.set(f*c+i,f*u-s*h,f*h+s*u,0,f*u+s*h,m*u+i,m*h-s*c,0,f*h-s*u,m*h+s*c,a*h*h+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,a,c){return this.set(1,i,a,0,e,1,c,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,a=t._x,c=t._y,u=t._z,h=t._w,f=a+a,m=c+c,g=u+u,_=a*f,y=a*m,M=a*g,E=c*m,S=c*g,x=u*g,D=h*f,L=h*m,b=h*g,V=i.x,k=i.y,F=i.z;return s[0]=(1-(E+x))*V,s[1]=(y+b)*V,s[2]=(M-L)*V,s[3]=0,s[4]=(y-b)*k,s[5]=(1-(_+x))*k,s[6]=(S+D)*k,s[7]=0,s[8]=(M+L)*F,s[9]=(S-D)*F,s[10]=(1-(_+E))*F,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;let a=Zs.set(s[0],s[1],s[2]).length();const c=Zs.set(s[4],s[5],s[6]).length(),u=Zs.set(s[8],s[9],s[10]).length();this.determinant()<0&&(a=-a),e.x=s[12],e.y=s[13],e.z=s[14],vi.copy(this);const f=1/a,m=1/c,g=1/u;return vi.elements[0]*=f,vi.elements[1]*=f,vi.elements[2]*=f,vi.elements[4]*=m,vi.elements[5]*=m,vi.elements[6]*=m,vi.elements[8]*=g,vi.elements[9]*=g,vi.elements[10]*=g,t.setFromRotationMatrix(vi),i.x=a,i.y=c,i.z=u,this}makePerspective(e,t,i,s,a,c,u=or){const h=this.elements,f=2*a/(t-e),m=2*a/(i-s),g=(t+e)/(t-e),_=(i+s)/(i-s);let y,M;if(u===or)y=-(c+a)/(c-a),M=-2*c*a/(c-a);else if(u===wc)y=-c/(c-a),M=-c*a/(c-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+u);return h[0]=f,h[4]=0,h[8]=g,h[12]=0,h[1]=0,h[5]=m,h[9]=_,h[13]=0,h[2]=0,h[6]=0,h[10]=y,h[14]=M,h[3]=0,h[7]=0,h[11]=-1,h[15]=0,this}makeOrthographic(e,t,i,s,a,c,u=or){const h=this.elements,f=1/(t-e),m=1/(i-s),g=1/(c-a),_=(t+e)*f,y=(i+s)*m;let M,E;if(u===or)M=(c+a)*g,E=-2*g;else if(u===wc)M=a*g,E=-1*g;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+u);return h[0]=2*f,h[4]=0,h[8]=0,h[12]=-_,h[1]=0,h[5]=2*m,h[9]=0,h[13]=-y,h[2]=0,h[6]=0,h[10]=E,h[14]=-M,h[3]=0,h[7]=0,h[11]=0,h[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const Zs=new Y,vi=new pt,Sy=new Y(0,0,0),My=new Y(1,1,1),Dr=new Y,jl=new Y,Qn=new Y,cg=new pt,ug=new Ui;class Fi{constructor(e=0,t=0,i=0,s=Fi.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,a=s[0],c=s[4],u=s[8],h=s[1],f=s[5],m=s[9],g=s[2],_=s[6],y=s[10];switch(t){case"XYZ":this._y=Math.asin(xt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(-m,y),this._z=Math.atan2(-c,a)):(this._x=Math.atan2(_,f),this._z=0);break;case"YXZ":this._x=Math.asin(-xt(m,-1,1)),Math.abs(m)<.9999999?(this._y=Math.atan2(u,y),this._z=Math.atan2(h,f)):(this._y=Math.atan2(-g,a),this._z=0);break;case"ZXY":this._x=Math.asin(xt(_,-1,1)),Math.abs(_)<.9999999?(this._y=Math.atan2(-g,y),this._z=Math.atan2(-c,f)):(this._y=0,this._z=Math.atan2(h,a));break;case"ZYX":this._y=Math.asin(-xt(g,-1,1)),Math.abs(g)<.9999999?(this._x=Math.atan2(_,y),this._z=Math.atan2(h,a)):(this._x=0,this._z=Math.atan2(-c,f));break;case"YZX":this._z=Math.asin(xt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(-m,f),this._y=Math.atan2(-g,a)):(this._x=0,this._y=Math.atan2(u,y));break;case"XZY":this._z=Math.asin(-xt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(_,f),this._y=Math.atan2(u,a)):(this._x=Math.atan2(-m,y),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return cg.makeRotationFromQuaternion(e),this.setFromRotationMatrix(cg,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return ug.setFromEuler(this),this.setFromQuaternion(ug,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Fi.DEFAULT_ORDER="XYZ";class V_{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Ey=0;const dg=new Y,Qs=new Ui,Ji=new pt,Xl=new Y,pa=new Y,Ty=new Y,wy=new Ui,hg=new Y(1,0,0),fg=new Y(0,1,0),pg=new Y(0,0,1),mg={type:"added"},Ay={type:"removed"},Js={type:"childadded",child:null},Td={type:"childremoved",child:null};class Qt extends Ms{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Ey++}),this.uuid=Ti(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Qt.DEFAULT_UP.clone();const e=new Y,t=new Fi,i=new Ui,s=new Y(1,1,1);function a(){i.setFromEuler(t,!1)}function c(){t.setFromQuaternion(i,void 0,!1)}t._onChange(a),i._onChange(c),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new pt},normalMatrix:{value:new mt}}),this.matrix=new pt,this.matrixWorld=new pt,this.matrixAutoUpdate=Qt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Qt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new V_,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Qs.setFromAxisAngle(e,t),this.quaternion.multiply(Qs),this}rotateOnWorldAxis(e,t){return Qs.setFromAxisAngle(e,t),this.quaternion.premultiply(Qs),this}rotateX(e){return this.rotateOnAxis(hg,e)}rotateY(e){return this.rotateOnAxis(fg,e)}rotateZ(e){return this.rotateOnAxis(pg,e)}translateOnAxis(e,t){return dg.copy(e).applyQuaternion(this.quaternion),this.position.add(dg.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(hg,e)}translateY(e){return this.translateOnAxis(fg,e)}translateZ(e){return this.translateOnAxis(pg,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ji.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Xl.copy(e):Xl.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),pa.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ji.lookAt(pa,Xl,this.up):Ji.lookAt(Xl,pa,this.up),this.quaternion.setFromRotationMatrix(Ji),s&&(Ji.extractRotation(s.matrixWorld),Qs.setFromRotationMatrix(Ji),this.quaternion.premultiply(Qs.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(mg),Js.child=e,this.dispatchEvent(Js),Js.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Ay),Td.child=e,this.dispatchEvent(Td),Td.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ji.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ji.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ji),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(mg),Js.child=e,this.dispatchEvent(Js),Js.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const c=this.children[i].getObjectByProperty(e,t);if(c!==void 0)return c}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let a=0,c=s.length;a<c;a++)s[a].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(pa,e,Ty),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(pa,wy,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let a=0,c=s.length;a<c;a++)s[a].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(u=>({boxInitialized:u.boxInitialized,boxMin:u.box.min.toArray(),boxMax:u.box.max.toArray(),sphereInitialized:u.sphereInitialized,sphereRadius:u.sphere.radius,sphereCenter:u.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function a(u,h){return u[h.uuid]===void 0&&(u[h.uuid]=h.toJSON(e)),h.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=a(e.geometries,this.geometry);const u=this.geometry.parameters;if(u!==void 0&&u.shapes!==void 0){const h=u.shapes;if(Array.isArray(h))for(let f=0,m=h.length;f<m;f++){const g=h[f];a(e.shapes,g)}else a(e.shapes,h)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const u=[];for(let h=0,f=this.material.length;h<f;h++)u.push(a(e.materials,this.material[h]));s.material=u}else s.material=a(e.materials,this.material);if(this.children.length>0){s.children=[];for(let u=0;u<this.children.length;u++)s.children.push(this.children[u].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let u=0;u<this.animations.length;u++){const h=this.animations[u];s.animations.push(a(e.animations,h))}}if(t){const u=c(e.geometries),h=c(e.materials),f=c(e.textures),m=c(e.images),g=c(e.shapes),_=c(e.skeletons),y=c(e.animations),M=c(e.nodes);u.length>0&&(i.geometries=u),h.length>0&&(i.materials=h),f.length>0&&(i.textures=f),m.length>0&&(i.images=m),g.length>0&&(i.shapes=g),_.length>0&&(i.skeletons=_),y.length>0&&(i.animations=y),M.length>0&&(i.nodes=M)}return i.object=s,i;function c(u){const h=[];for(const f in u){const m=u[f];delete m.metadata,h.push(m)}return h}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}}Qt.DEFAULT_UP=new Y(0,1,0);Qt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Qt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const xi=new Y,er=new Y,wd=new Y,tr=new Y,eo=new Y,to=new Y,gg=new Y,Ad=new Y,Rd=new Y,bd=new Y,Cd=new It,Pd=new It,Ld=new It;class Mi{constructor(e=new Y,t=new Y,i=new Y){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),xi.subVectors(e,t),s.cross(xi);const a=s.lengthSq();return a>0?s.multiplyScalar(1/Math.sqrt(a)):s.set(0,0,0)}static getBarycoord(e,t,i,s,a){xi.subVectors(s,t),er.subVectors(i,t),wd.subVectors(e,t);const c=xi.dot(xi),u=xi.dot(er),h=xi.dot(wd),f=er.dot(er),m=er.dot(wd),g=c*f-u*u;if(g===0)return a.set(0,0,0),null;const _=1/g,y=(f*h-u*m)*_,M=(c*m-u*h)*_;return a.set(1-y-M,M,y)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,tr)===null?!1:tr.x>=0&&tr.y>=0&&tr.x+tr.y<=1}static getInterpolation(e,t,i,s,a,c,u,h){return this.getBarycoord(e,t,i,s,tr)===null?(h.x=0,h.y=0,"z"in h&&(h.z=0),"w"in h&&(h.w=0),null):(h.setScalar(0),h.addScaledVector(a,tr.x),h.addScaledVector(c,tr.y),h.addScaledVector(u,tr.z),h)}static getInterpolatedAttribute(e,t,i,s,a,c){return Cd.setScalar(0),Pd.setScalar(0),Ld.setScalar(0),Cd.fromBufferAttribute(e,t),Pd.fromBufferAttribute(e,i),Ld.fromBufferAttribute(e,s),c.setScalar(0),c.addScaledVector(Cd,a.x),c.addScaledVector(Pd,a.y),c.addScaledVector(Ld,a.z),c}static isFrontFacing(e,t,i,s){return xi.subVectors(i,t),er.subVectors(e,t),xi.cross(er).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return xi.subVectors(this.c,this.b),er.subVectors(this.a,this.b),xi.cross(er).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Mi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Mi.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,a){return Mi.getInterpolation(e,this.a,this.b,this.c,t,i,s,a)}containsPoint(e){return Mi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Mi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,a=this.c;let c,u;eo.subVectors(s,i),to.subVectors(a,i),Ad.subVectors(e,i);const h=eo.dot(Ad),f=to.dot(Ad);if(h<=0&&f<=0)return t.copy(i);Rd.subVectors(e,s);const m=eo.dot(Rd),g=to.dot(Rd);if(m>=0&&g<=m)return t.copy(s);const _=h*g-m*f;if(_<=0&&h>=0&&m<=0)return c=h/(h-m),t.copy(i).addScaledVector(eo,c);bd.subVectors(e,a);const y=eo.dot(bd),M=to.dot(bd);if(M>=0&&y<=M)return t.copy(a);const E=y*f-h*M;if(E<=0&&f>=0&&M<=0)return u=f/(f-M),t.copy(i).addScaledVector(to,u);const S=m*M-y*g;if(S<=0&&g-m>=0&&y-M>=0)return gg.subVectors(a,s),u=(g-m)/(g-m+(y-M)),t.copy(s).addScaledVector(gg,u);const x=1/(S+E+_);return c=E*x,u=_*x,t.copy(i).addScaledVector(eo,c).addScaledVector(to,u)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const G_={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ir={h:0,s:0,l:0},Yl={h:0,s:0,l:0};function Nd(o,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?o+(e-o)*6*t:t<1/2?e:t<2/3?o+(e-o)*6*(2/3-t):o}class rt{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=gn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,At.toWorkingColorSpace(this,t),this}setRGB(e,t,i,s=At.workingColorSpace){return this.r=e,this.g=t,this.b=i,At.toWorkingColorSpace(this,s),this}setHSL(e,t,i,s=At.workingColorSpace){if(e=ef(e,1),t=xt(t,0,1),i=xt(i,0,1),t===0)this.r=this.g=this.b=i;else{const a=i<=.5?i*(1+t):i+t-i*t,c=2*i-a;this.r=Nd(c,a,e+1/3),this.g=Nd(c,a,e),this.b=Nd(c,a,e-1/3)}return At.toWorkingColorSpace(this,s),this}setStyle(e,t=gn){function i(a){a!==void 0&&parseFloat(a)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let a;const c=s[1],u=s[2];switch(c){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(u))return i(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,t);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(u))return i(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,t);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(u))return i(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const a=s[1],c=a.length;if(c===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,t);if(c===6)return this.setHex(parseInt(a,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=gn){const i=G_[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ar(e.r),this.g=ar(e.g),this.b=ar(e.b),this}copyLinearToSRGB(e){return this.r=mo(e.r),this.g=mo(e.g),this.b=mo(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=gn){return At.fromWorkingColorSpace(bn.copy(this),e),Math.round(xt(bn.r*255,0,255))*65536+Math.round(xt(bn.g*255,0,255))*256+Math.round(xt(bn.b*255,0,255))}getHexString(e=gn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=At.workingColorSpace){At.fromWorkingColorSpace(bn.copy(this),t);const i=bn.r,s=bn.g,a=bn.b,c=Math.max(i,s,a),u=Math.min(i,s,a);let h,f;const m=(u+c)/2;if(u===c)h=0,f=0;else{const g=c-u;switch(f=m<=.5?g/(c+u):g/(2-c-u),c){case i:h=(s-a)/g+(s<a?6:0);break;case s:h=(a-i)/g+2;break;case a:h=(i-s)/g+4;break}h/=6}return e.h=h,e.s=f,e.l=m,e}getRGB(e,t=At.workingColorSpace){return At.fromWorkingColorSpace(bn.copy(this),t),e.r=bn.r,e.g=bn.g,e.b=bn.b,e}getStyle(e=gn){At.fromWorkingColorSpace(bn.copy(this),e);const t=bn.r,i=bn.g,s=bn.b;return e!==gn?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(Ir),this.setHSL(Ir.h+e,Ir.s+t,Ir.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Ir),e.getHSL(Yl);const i=Ta(Ir.h,Yl.h,t),s=Ta(Ir.s,Yl.s,t),a=Ta(Ir.l,Yl.l,t);return this.setHSL(i,s,a),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,a=e.elements;return this.r=a[0]*t+a[3]*i+a[6]*s,this.g=a[1]*t+a[4]*i+a[7]*s,this.b=a[2]*t+a[5]*i+a[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const bn=new rt;rt.NAMES=G_;let Ry=0;class wi extends Ms{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Ry++}),this.uuid=Ti(),this.name="",this.type="Material",this.blending=fo,this.side=lr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Jd,this.blendDst=eh,this.blendEquation=gs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new rt(0,0,0),this.blendAlpha=0,this.depthFunc=_o,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=ng,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Xs,this.stencilZFail=Xs,this.stencilZPass=Xs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==fo&&(i.blending=this.blending),this.side!==lr&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Jd&&(i.blendSrc=this.blendSrc),this.blendDst!==eh&&(i.blendDst=this.blendDst),this.blendEquation!==gs&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==_o&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==ng&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Xs&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Xs&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Xs&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(a){const c=[];for(const u in a){const h=a[u];delete h.metadata,c.push(h)}return c}if(t){const a=s(e.textures),c=s(e.images);a.length>0&&(i.textures=a),c.length>0&&(i.images=c)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let a=0;a!==s;++a)i[a]=t[a].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Ii extends wi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new rt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Fi,this.combine=E_,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const sn=new Y,ql=new ot;class kn{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Oh,this.updateRanges=[],this.gpuType=Ei,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,a=this.itemSize;s<a;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)ql.fromBufferAttribute(this,t),ql.applyMatrix3(e),this.setXY(t,ql.x,ql.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)sn.fromBufferAttribute(this,t),sn.applyMatrix3(e),this.setXYZ(t,sn.x,sn.y,sn.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)sn.fromBufferAttribute(this,t),sn.applyMatrix4(e),this.setXYZ(t,sn.x,sn.y,sn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)sn.fromBufferAttribute(this,t),sn.applyNormalMatrix(e),this.setXYZ(t,sn.x,sn.y,sn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)sn.fromBufferAttribute(this,t),sn.transformDirection(e),this.setXYZ(t,sn.x,sn.y,sn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Si(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Ft(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Si(t,this.array)),t}setX(e,t){return this.normalized&&(t=Ft(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Si(t,this.array)),t}setY(e,t){return this.normalized&&(t=Ft(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Si(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Ft(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Si(t,this.array)),t}setW(e,t){return this.normalized&&(t=Ft(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Ft(t,this.array),i=Ft(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=Ft(t,this.array),i=Ft(i,this.array),s=Ft(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,a){return e*=this.itemSize,this.normalized&&(t=Ft(t,this.array),i=Ft(i,this.array),s=Ft(s,this.array),a=Ft(a,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=a,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Oh&&(e.usage=this.usage),e}}class W_ extends kn{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class j_ extends kn{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class cn extends kn{constructor(e,t,i){super(new Float32Array(e),t,i)}}let by=0;const ai=new pt,Dd=new Qt,no=new Y,Jn=new Oi,ma=new Oi,mn=new Y;class Yn extends Ms{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:by++}),this.uuid=Ti(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(B_(e)?j_:W_)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const a=new mt().getNormalMatrix(e);i.applyNormalMatrix(a),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return ai.makeRotationFromQuaternion(e),this.applyMatrix4(ai),this}rotateX(e){return ai.makeRotationX(e),this.applyMatrix4(ai),this}rotateY(e){return ai.makeRotationY(e),this.applyMatrix4(ai),this}rotateZ(e){return ai.makeRotationZ(e),this.applyMatrix4(ai),this}translate(e,t,i){return ai.makeTranslation(e,t,i),this.applyMatrix4(ai),this}scale(e,t,i){return ai.makeScale(e,t,i),this.applyMatrix4(ai),this}lookAt(e){return Dd.lookAt(e),Dd.updateMatrix(),this.applyMatrix4(Dd.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(no).negate(),this.translate(no.x,no.y,no.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,a=e.length;s<a;s++){const c=e[s];i.push(c.x,c.y,c.z||0)}this.setAttribute("position",new cn(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const a=e[s];t.setXYZ(s,a.x,a.y,a.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Oi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new Y(-1/0,-1/0,-1/0),new Y(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const a=t[i];Jn.setFromBufferAttribute(a),this.morphTargetsRelative?(mn.addVectors(this.boundingBox.min,Jn.min),this.boundingBox.expandByPoint(mn),mn.addVectors(this.boundingBox.max,Jn.max),this.boundingBox.expandByPoint(mn)):(this.boundingBox.expandByPoint(Jn.min),this.boundingBox.expandByPoint(Jn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ki);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new Y,1/0);return}if(e){const i=this.boundingSphere.center;if(Jn.setFromBufferAttribute(e),t)for(let a=0,c=t.length;a<c;a++){const u=t[a];ma.setFromBufferAttribute(u),this.morphTargetsRelative?(mn.addVectors(Jn.min,ma.min),Jn.expandByPoint(mn),mn.addVectors(Jn.max,ma.max),Jn.expandByPoint(mn)):(Jn.expandByPoint(ma.min),Jn.expandByPoint(ma.max))}Jn.getCenter(i);let s=0;for(let a=0,c=e.count;a<c;a++)mn.fromBufferAttribute(e,a),s=Math.max(s,i.distanceToSquared(mn));if(t)for(let a=0,c=t.length;a<c;a++){const u=t[a],h=this.morphTargetsRelative;for(let f=0,m=u.count;f<m;f++)mn.fromBufferAttribute(u,f),h&&(no.fromBufferAttribute(e,f),mn.add(no)),s=Math.max(s,i.distanceToSquared(mn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,a=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new kn(new Float32Array(4*i.count),4));const c=this.getAttribute("tangent"),u=[],h=[];for(let X=0;X<i.count;X++)u[X]=new Y,h[X]=new Y;const f=new Y,m=new Y,g=new Y,_=new ot,y=new ot,M=new ot,E=new Y,S=new Y;function x(X,C,R){f.fromBufferAttribute(i,X),m.fromBufferAttribute(i,C),g.fromBufferAttribute(i,R),_.fromBufferAttribute(a,X),y.fromBufferAttribute(a,C),M.fromBufferAttribute(a,R),m.sub(f),g.sub(f),y.sub(_),M.sub(_);const H=1/(y.x*M.y-M.x*y.y);isFinite(H)&&(E.copy(m).multiplyScalar(M.y).addScaledVector(g,-y.y).multiplyScalar(H),S.copy(g).multiplyScalar(y.x).addScaledVector(m,-M.x).multiplyScalar(H),u[X].add(E),u[C].add(E),u[R].add(E),h[X].add(S),h[C].add(S),h[R].add(S))}let D=this.groups;D.length===0&&(D=[{start:0,count:e.count}]);for(let X=0,C=D.length;X<C;++X){const R=D[X],H=R.start,J=R.count;for(let K=H,fe=H+J;K<fe;K+=3)x(e.getX(K+0),e.getX(K+1),e.getX(K+2))}const L=new Y,b=new Y,V=new Y,k=new Y;function F(X){V.fromBufferAttribute(s,X),k.copy(V);const C=u[X];L.copy(C),L.sub(V.multiplyScalar(V.dot(C))).normalize(),b.crossVectors(k,C);const H=b.dot(h[X])<0?-1:1;c.setXYZW(X,L.x,L.y,L.z,H)}for(let X=0,C=D.length;X<C;++X){const R=D[X],H=R.start,J=R.count;for(let K=H,fe=H+J;K<fe;K+=3)F(e.getX(K+0)),F(e.getX(K+1)),F(e.getX(K+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new kn(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let _=0,y=i.count;_<y;_++)i.setXYZ(_,0,0,0);const s=new Y,a=new Y,c=new Y,u=new Y,h=new Y,f=new Y,m=new Y,g=new Y;if(e)for(let _=0,y=e.count;_<y;_+=3){const M=e.getX(_+0),E=e.getX(_+1),S=e.getX(_+2);s.fromBufferAttribute(t,M),a.fromBufferAttribute(t,E),c.fromBufferAttribute(t,S),m.subVectors(c,a),g.subVectors(s,a),m.cross(g),u.fromBufferAttribute(i,M),h.fromBufferAttribute(i,E),f.fromBufferAttribute(i,S),u.add(m),h.add(m),f.add(m),i.setXYZ(M,u.x,u.y,u.z),i.setXYZ(E,h.x,h.y,h.z),i.setXYZ(S,f.x,f.y,f.z)}else for(let _=0,y=t.count;_<y;_+=3)s.fromBufferAttribute(t,_+0),a.fromBufferAttribute(t,_+1),c.fromBufferAttribute(t,_+2),m.subVectors(c,a),g.subVectors(s,a),m.cross(g),i.setXYZ(_+0,m.x,m.y,m.z),i.setXYZ(_+1,m.x,m.y,m.z),i.setXYZ(_+2,m.x,m.y,m.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)mn.fromBufferAttribute(e,t),mn.normalize(),e.setXYZ(t,mn.x,mn.y,mn.z)}toNonIndexed(){function e(u,h){const f=u.array,m=u.itemSize,g=u.normalized,_=new f.constructor(h.length*m);let y=0,M=0;for(let E=0,S=h.length;E<S;E++){u.isInterleavedBufferAttribute?y=h[E]*u.data.stride+u.offset:y=h[E]*m;for(let x=0;x<m;x++)_[M++]=f[y++]}return new kn(_,m,g)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Yn,i=this.index.array,s=this.attributes;for(const u in s){const h=s[u],f=e(h,i);t.setAttribute(u,f)}const a=this.morphAttributes;for(const u in a){const h=[],f=a[u];for(let m=0,g=f.length;m<g;m++){const _=f[m],y=e(_,i);h.push(y)}t.morphAttributes[u]=h}t.morphTargetsRelative=this.morphTargetsRelative;const c=this.groups;for(let u=0,h=c.length;u<h;u++){const f=c[u];t.addGroup(f.start,f.count,f.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const h=this.parameters;for(const f in h)h[f]!==void 0&&(e[f]=h[f]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const h in i){const f=i[h];e.data.attributes[h]=f.toJSON(e.data)}const s={};let a=!1;for(const h in this.morphAttributes){const f=this.morphAttributes[h],m=[];for(let g=0,_=f.length;g<_;g++){const y=f[g];m.push(y.toJSON(e.data))}m.length>0&&(s[h]=m,a=!0)}a&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const c=this.groups;c.length>0&&(e.data.groups=JSON.parse(JSON.stringify(c)));const u=this.boundingSphere;return u!==null&&(e.data.boundingSphere={center:u.center.toArray(),radius:u.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(t));const s=e.attributes;for(const f in s){const m=s[f];this.setAttribute(f,m.clone(t))}const a=e.morphAttributes;for(const f in a){const m=[],g=a[f];for(let _=0,y=g.length;_<y;_++)m.push(g[_].clone(t));this.morphAttributes[f]=m}this.morphTargetsRelative=e.morphTargetsRelative;const c=e.groups;for(let f=0,m=c.length;f<m;f++){const g=c[f];this.addGroup(g.start,g.count,g.materialIndex)}const u=e.boundingBox;u!==null&&(this.boundingBox=u.clone());const h=e.boundingSphere;return h!==null&&(this.boundingSphere=h.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const _g=new pt,us=new La,Kl=new ki,vg=new Y,$l=new Y,Zl=new Y,Ql=new Y,Id=new Y,Jl=new Y,xg=new Y,ec=new Y;class Ht extends Qt{constructor(e=new Yn,t=new Ii){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,c=s.length;a<c;a++){const u=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[u]=a}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,a=i.morphAttributes.position,c=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const u=this.morphTargetInfluences;if(a&&u){Jl.set(0,0,0);for(let h=0,f=a.length;h<f;h++){const m=u[h],g=a[h];m!==0&&(Id.fromBufferAttribute(g,e),c?Jl.addScaledVector(Id,m):Jl.addScaledVector(Id.sub(t),m))}t.add(Jl)}return t}raycast(e,t){const i=this.geometry,s=this.material,a=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Kl.copy(i.boundingSphere),Kl.applyMatrix4(a),us.copy(e.ray).recast(e.near),!(Kl.containsPoint(us.origin)===!1&&(us.intersectSphere(Kl,vg)===null||us.origin.distanceToSquared(vg)>(e.far-e.near)**2))&&(_g.copy(a).invert(),us.copy(e.ray).applyMatrix4(_g),!(i.boundingBox!==null&&us.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,us)))}_computeIntersections(e,t,i){let s;const a=this.geometry,c=this.material,u=a.index,h=a.attributes.position,f=a.attributes.uv,m=a.attributes.uv1,g=a.attributes.normal,_=a.groups,y=a.drawRange;if(u!==null)if(Array.isArray(c))for(let M=0,E=_.length;M<E;M++){const S=_[M],x=c[S.materialIndex],D=Math.max(S.start,y.start),L=Math.min(u.count,Math.min(S.start+S.count,y.start+y.count));for(let b=D,V=L;b<V;b+=3){const k=u.getX(b),F=u.getX(b+1),X=u.getX(b+2);s=tc(this,x,e,i,f,m,g,k,F,X),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=S.materialIndex,t.push(s))}}else{const M=Math.max(0,y.start),E=Math.min(u.count,y.start+y.count);for(let S=M,x=E;S<x;S+=3){const D=u.getX(S),L=u.getX(S+1),b=u.getX(S+2);s=tc(this,c,e,i,f,m,g,D,L,b),s&&(s.faceIndex=Math.floor(S/3),t.push(s))}}else if(h!==void 0)if(Array.isArray(c))for(let M=0,E=_.length;M<E;M++){const S=_[M],x=c[S.materialIndex],D=Math.max(S.start,y.start),L=Math.min(h.count,Math.min(S.start+S.count,y.start+y.count));for(let b=D,V=L;b<V;b+=3){const k=b,F=b+1,X=b+2;s=tc(this,x,e,i,f,m,g,k,F,X),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=S.materialIndex,t.push(s))}}else{const M=Math.max(0,y.start),E=Math.min(h.count,y.start+y.count);for(let S=M,x=E;S<x;S+=3){const D=S,L=S+1,b=S+2;s=tc(this,c,e,i,f,m,g,D,L,b),s&&(s.faceIndex=Math.floor(S/3),t.push(s))}}}}function Cy(o,e,t,i,s,a,c,u){let h;if(e.side===Fn?h=i.intersectTriangle(c,a,s,!0,u):h=i.intersectTriangle(s,a,c,e.side===lr,u),h===null)return null;ec.copy(u),ec.applyMatrix4(o.matrixWorld);const f=t.ray.origin.distanceTo(ec);return f<t.near||f>t.far?null:{distance:f,point:ec.clone(),object:o}}function tc(o,e,t,i,s,a,c,u,h,f){o.getVertexPosition(u,$l),o.getVertexPosition(h,Zl),o.getVertexPosition(f,Ql);const m=Cy(o,e,t,i,$l,Zl,Ql,xg);if(m){const g=new Y;Mi.getBarycoord(xg,$l,Zl,Ql,g),s&&(m.uv=Mi.getInterpolatedAttribute(s,u,h,f,g,new ot)),a&&(m.uv1=Mi.getInterpolatedAttribute(a,u,h,f,g,new ot)),c&&(m.normal=Mi.getInterpolatedAttribute(c,u,h,f,g,new Y),m.normal.dot(i.direction)>0&&m.normal.multiplyScalar(-1));const _={a:u,b:h,c:f,normal:new Y,materialIndex:0};Mi.getNormal($l,Zl,Ql,_.normal),m.face=_,m.barycoord=g}return m}class bo extends Yn{constructor(e=1,t=1,i=1,s=1,a=1,c=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:a,depthSegments:c};const u=this;s=Math.floor(s),a=Math.floor(a),c=Math.floor(c);const h=[],f=[],m=[],g=[];let _=0,y=0;M("z","y","x",-1,-1,i,t,e,c,a,0),M("z","y","x",1,-1,i,t,-e,c,a,1),M("x","z","y",1,1,e,i,t,s,c,2),M("x","z","y",1,-1,e,i,-t,s,c,3),M("x","y","z",1,-1,e,t,i,s,a,4),M("x","y","z",-1,-1,e,t,-i,s,a,5),this.setIndex(h),this.setAttribute("position",new cn(f,3)),this.setAttribute("normal",new cn(m,3)),this.setAttribute("uv",new cn(g,2));function M(E,S,x,D,L,b,V,k,F,X,C){const R=b/F,H=V/X,J=b/2,K=V/2,fe=k/2,ue=F+1,ce=X+1;let de=0,O=0;const le=new Y;for(let oe=0;oe<ce;oe++){const U=oe*H-K;for(let ne=0;ne<ue;ne++){const Le=ne*R-J;le[E]=Le*D,le[S]=U*L,le[x]=fe,f.push(le.x,le.y,le.z),le[E]=0,le[S]=0,le[x]=k>0?1:-1,m.push(le.x,le.y,le.z),g.push(ne/F),g.push(1-oe/X),de+=1}}for(let oe=0;oe<X;oe++)for(let U=0;U<F;U++){const ne=_+U+ue*oe,Le=_+U+ue*(oe+1),Q=_+(U+1)+ue*(oe+1),he=_+(U+1)+ue*oe;h.push(ne,Le,he),h.push(Le,Q,he),O+=6}u.addGroup(y,O,C),y+=O,_+=de}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new bo(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function To(o){const e={};for(const t in o){e[t]={};for(const i in o[t]){const s=o[t][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone():Array.isArray(s)?e[t][i]=s.slice():e[t][i]=s}}return e}function In(o){const e={};for(let t=0;t<o.length;t++){const i=To(o[t]);for(const s in i)e[s]=i[s]}return e}function Py(o){const e=[];for(let t=0;t<o.length;t++)e.push(o[t].clone());return e}function X_(o){const e=o.getRenderTarget();return e===null?o.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:At.workingColorSpace}const Ly={clone:To,merge:In};var Ny=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Dy=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class jr extends wi{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Ny,this.fragmentShader=Dy,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=To(e.uniforms),this.uniformsGroups=Py(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const c=this.uniforms[s].value;c&&c.isTexture?t.uniforms[s]={type:"t",value:c.toJSON(e).uuid}:c&&c.isColor?t.uniforms[s]={type:"c",value:c.getHex()}:c&&c.isVector2?t.uniforms[s]={type:"v2",value:c.toArray()}:c&&c.isVector3?t.uniforms[s]={type:"v3",value:c.toArray()}:c&&c.isVector4?t.uniforms[s]={type:"v4",value:c.toArray()}:c&&c.isMatrix3?t.uniforms[s]={type:"m3",value:c.toArray()}:c&&c.isMatrix4?t.uniforms[s]={type:"m4",value:c.toArray()}:t.uniforms[s]={value:c}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class Y_ extends Qt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new pt,this.projectionMatrix=new pt,this.projectionMatrixInverse=new pt,this.coordinateSystem=or}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Ur=new Y,yg=new ot,Sg=new ot;class Un extends Y_{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Eo*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Ea*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Eo*2*Math.atan(Math.tan(Ea*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Ur.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Ur.x,Ur.y).multiplyScalar(-e/Ur.z),Ur.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Ur.x,Ur.y).multiplyScalar(-e/Ur.z)}getViewSize(e,t){return this.getViewBounds(e,yg,Sg),t.subVectors(Sg,yg)}setViewOffset(e,t,i,s,a,c){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=c,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Ea*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,a=-.5*s;const c=this.view;if(this.view!==null&&this.view.enabled){const h=c.fullWidth,f=c.fullHeight;a+=c.offsetX*s/h,t-=c.offsetY*i/f,s*=c.width/h,i*=c.height/f}const u=this.filmOffset;u!==0&&(a+=e*u/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+s,t,t-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const io=-90,ro=1;class Iy extends Qt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Un(io,ro,e,t);s.layers=this.layers,this.add(s);const a=new Un(io,ro,e,t);a.layers=this.layers,this.add(a);const c=new Un(io,ro,e,t);c.layers=this.layers,this.add(c);const u=new Un(io,ro,e,t);u.layers=this.layers,this.add(u);const h=new Un(io,ro,e,t);h.layers=this.layers,this.add(h);const f=new Un(io,ro,e,t);f.layers=this.layers,this.add(f)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,a,c,u,h]=t;for(const f of t)this.remove(f);if(e===or)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),c.up.set(0,0,1),c.lookAt(0,-1,0),u.up.set(0,1,0),u.lookAt(0,0,1),h.up.set(0,1,0),h.lookAt(0,0,-1);else if(e===wc)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),c.up.set(0,0,-1),c.lookAt(0,-1,0),u.up.set(0,-1,0),u.lookAt(0,0,1),h.up.set(0,-1,0),h.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const f of t)this.add(f),f.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[a,c,u,h,f,m]=this.children,g=e.getRenderTarget(),_=e.getActiveCubeFace(),y=e.getActiveMipmapLevel(),M=e.xr.enabled;e.xr.enabled=!1;const E=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,s),e.render(t,a),e.setRenderTarget(i,1,s),e.render(t,c),e.setRenderTarget(i,2,s),e.render(t,u),e.setRenderTarget(i,3,s),e.render(t,h),e.setRenderTarget(i,4,s),e.render(t,f),i.texture.generateMipmaps=E,e.setRenderTarget(i,5,s),e.render(t,m),e.setRenderTarget(g,_,y),e.xr.enabled=M,i.texture.needsPMREMUpdate=!0}}class q_ extends _n{constructor(e,t,i,s,a,c,u,h,f,m){e=e!==void 0?e:[],t=t!==void 0?t:vo,super(e,t,i,s,a,c,u,h,f,m),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Uy extends xs{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new q_(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:ei}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new bo(5,5,5),a=new jr({name:"CubemapFromEquirect",uniforms:To(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Fn,blending:Gr});a.uniforms.tEquirect.value=t;const c=new Ht(s,a),u=t.minFilter;return t.minFilter===sr&&(t.minFilter=ei),new Iy(1,10,this).update(e,c),t.minFilter=u,c.geometry.dispose(),c.material.dispose(),this}clear(e,t,i,s){const a=e.getRenderTarget();for(let c=0;c<6;c++)e.setRenderTarget(this,c),e.clear(t,i,s);e.setRenderTarget(a)}}class tf{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new rt(e),this.density=t}clone(){return new tf(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class K_ extends Qt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Fi,this.environmentIntensity=1,this.environmentRotation=new Fi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class Fy{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Oh,this.updateRanges=[],this.version=0,this.uuid=Ti()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let s=0,a=this.stride;s<a;s++)this.array[e+s]=t.array[i+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ti()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(t,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ti()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Dn=new Y;class nf{constructor(e,t,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)Dn.fromBufferAttribute(this,t),Dn.applyMatrix4(e),this.setXYZ(t,Dn.x,Dn.y,Dn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Dn.fromBufferAttribute(this,t),Dn.applyNormalMatrix(e),this.setXYZ(t,Dn.x,Dn.y,Dn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Dn.fromBufferAttribute(this,t),Dn.transformDirection(e),this.setXYZ(t,Dn.x,Dn.y,Dn.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=Si(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Ft(i,this.array)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=Ft(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Ft(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Ft(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Ft(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Si(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Si(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Si(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Si(t,this.array)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ft(t,this.array),i=Ft(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ft(t,this.array),i=Ft(i,this.array),s=Ft(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this}setXYZW(e,t,i,s,a){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ft(t,this.array),i=Ft(i,this.array),s=Ft(s,this.array),a=Ft(a,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this.data.array[e+3]=a,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)t.push(this.data.array[s+a])}return new kn(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new nf(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)t.push(this.data.array[s+a])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}const Mg=new Y,Eg=new It,Tg=new It,Oy=new Y,wg=new pt,nc=new Y,Ud=new ki,Ag=new pt,Fd=new La;class ky extends Ht{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Qm,this.bindMatrix=new pt,this.bindMatrixInverse=new pt,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new Oi),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,nc),this.boundingBox.expandByPoint(nc)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new ki),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,nc),this.boundingSphere.expandByPoint(nc)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const i=this.material,s=this.matrixWorld;i!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ud.copy(this.boundingSphere),Ud.applyMatrix4(s),e.ray.intersectsSphere(Ud)!==!1&&(Ag.copy(s).invert(),Fd.copy(e.ray).applyMatrix4(Ag),!(this.boundingBox!==null&&Fd.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Fd)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new It,t=this.geometry.attributes.skinWeight;for(let i=0,s=t.count;i<s;i++){e.fromBufferAttribute(t,i);const a=1/e.manhattanLength();a!==1/0?e.multiplyScalar(a):e.set(1,0,0,0),t.setXYZW(i,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Qm?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Ux?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const i=this.skeleton,s=this.geometry;Eg.fromBufferAttribute(s.attributes.skinIndex,e),Tg.fromBufferAttribute(s.attributes.skinWeight,e),Mg.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let a=0;a<4;a++){const c=Tg.getComponent(a);if(c!==0){const u=Eg.getComponent(a);wg.multiplyMatrices(i.bones[u].matrixWorld,i.boneInverses[u]),t.addScaledVector(Oy.copy(Mg).applyMatrix4(wg),c)}}return t.applyMatrix4(this.bindMatrixInverse)}}class $_ extends Qt{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Z_ extends _n{constructor(e=null,t=1,i=1,s,a,c,u,h,f=On,m=On,g,_){super(null,c,u,h,f,m,s,a,g,_),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Rg=new pt,By=new pt;class rf{constructor(e=[],t=[]){this.uuid=Ti(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let i=0,s=this.bones.length;i<s;i++)this.boneInverses.push(new pt)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const i=new pt;this.bones[e]&&i.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(i)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const i=this.bones[e];i&&i.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const i=this.bones[e];i&&(i.parent&&i.parent.isBone?(i.matrix.copy(i.parent.matrixWorld).invert(),i.matrix.multiply(i.matrixWorld)):i.matrix.copy(i.matrixWorld),i.matrix.decompose(i.position,i.quaternion,i.scale))}}update(){const e=this.bones,t=this.boneInverses,i=this.boneMatrices,s=this.boneTexture;for(let a=0,c=e.length;a<c;a++){const u=e[a]?e[a].matrixWorld:By;Rg.multiplyMatrices(u,t[a]),Rg.toArray(i,a*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new rf(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const i=new Z_(t,e,e,ci,Ei);return i.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=i,this}getBoneByName(e){for(let t=0,i=this.bones.length;t<i;t++){const s=this.bones[t];if(s.name===e)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let i=0,s=e.bones.length;i<s;i++){const a=e.bones[i];let c=t[a];c===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",a),c=new $_),this.bones.push(c),this.boneInverses.push(new pt().fromArray(e.boneInverses[i]))}return this.init(),this}toJSON(){const e={metadata:{version:4.6,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,i=this.boneInverses;for(let s=0,a=t.length;s<a;s++){const c=t[s];e.bones.push(c.uuid);const u=i[s];e.boneInverses.push(u.toArray())}return e}}class kh extends kn{constructor(e,t,i,s=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const so=new pt,bg=new pt,ic=[],Cg=new Oi,zy=new pt,ga=new Ht,_a=new ki;class Hy extends Ht{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new kh(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,zy)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Oi),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,so),Cg.copy(e.boundingBox).applyMatrix4(so),this.boundingBox.union(Cg)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new ki),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,so),_a.copy(e.boundingSphere).applyMatrix4(so),this.boundingSphere.union(_a)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const i=t.morphTargetInfluences,s=this.morphTexture.source.data.data,a=i.length+1,c=e*a+1;for(let u=0;u<i.length;u++)i[u]=s[c+u]}raycast(e,t){const i=this.matrixWorld,s=this.count;if(ga.geometry=this.geometry,ga.material=this.material,ga.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),_a.copy(this.boundingSphere),_a.applyMatrix4(i),e.ray.intersectsSphere(_a)!==!1))for(let a=0;a<s;a++){this.getMatrixAt(a,so),bg.multiplyMatrices(i,so),ga.matrixWorld=bg,ga.raycast(e,ic);for(let c=0,u=ic.length;c<u;c++){const h=ic[c];h.instanceId=a,h.object=this,t.push(h)}ic.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new kh(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const i=t.morphTargetInfluences,s=i.length+1;this.morphTexture===null&&(this.morphTexture=new Z_(new Float32Array(s*this.count),s,this.count,Kh,Ei));const a=this.morphTexture.source.data.data;let c=0;for(let f=0;f<i.length;f++)c+=i[f];const u=this.geometry.morphTargetsRelative?1:1-c,h=s*e;a[h]=u,a.set(i,h+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}const Od=new Y,Vy=new Y,Gy=new mt;class kr{constructor(e=new Y(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=Od.subVectors(i,t).cross(Vy.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(Od),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/s;return a<0||a>1?null:t.copy(e.start).addScaledVector(i,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||Gy.getNormalMatrix(e),s=this.coplanarPoint(Od).applyMatrix4(e),a=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(a),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ds=new ki,rc=new Y;class sf{constructor(e=new kr,t=new kr,i=new kr,s=new kr,a=new kr,c=new kr){this.planes=[e,t,i,s,a,c]}set(e,t,i,s,a,c){const u=this.planes;return u[0].copy(e),u[1].copy(t),u[2].copy(i),u[3].copy(s),u[4].copy(a),u[5].copy(c),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=or){const i=this.planes,s=e.elements,a=s[0],c=s[1],u=s[2],h=s[3],f=s[4],m=s[5],g=s[6],_=s[7],y=s[8],M=s[9],E=s[10],S=s[11],x=s[12],D=s[13],L=s[14],b=s[15];if(i[0].setComponents(h-a,_-f,S-y,b-x).normalize(),i[1].setComponents(h+a,_+f,S+y,b+x).normalize(),i[2].setComponents(h+c,_+m,S+M,b+D).normalize(),i[3].setComponents(h-c,_-m,S-M,b-D).normalize(),i[4].setComponents(h-u,_-g,S-E,b-L).normalize(),t===or)i[5].setComponents(h+u,_+g,S+E,b+L).normalize();else if(t===wc)i[5].setComponents(u,g,E,L).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ds.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ds.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ds)}intersectsSprite(e){return ds.center.set(0,0,0),ds.radius=.7071067811865476,ds.applyMatrix4(e.matrixWorld),this.intersectsSphere(ds)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let a=0;a<6;a++)if(t[a].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(rc.x=s.normal.x>0?e.max.x:e.min.x,rc.y=s.normal.y>0?e.max.y:e.min.y,rc.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(rc)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Cc extends wi{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new rt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Ac=new Y,Rc=new Y,Pg=new pt,va=new La,sc=new ki,kd=new Y,Lg=new Y;class of extends Qt{constructor(e=new Yn,t=new Cc){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let s=1,a=t.count;s<a;s++)Ac.fromBufferAttribute(t,s-1),Rc.fromBufferAttribute(t,s),i[s]=i[s-1],i[s]+=Ac.distanceTo(Rc);e.setAttribute("lineDistance",new cn(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,s=this.matrixWorld,a=e.params.Line.threshold,c=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),sc.copy(i.boundingSphere),sc.applyMatrix4(s),sc.radius+=a,e.ray.intersectsSphere(sc)===!1)return;Pg.copy(s).invert(),va.copy(e.ray).applyMatrix4(Pg);const u=a/((this.scale.x+this.scale.y+this.scale.z)/3),h=u*u,f=this.isLineSegments?2:1,m=i.index,_=i.attributes.position;if(m!==null){const y=Math.max(0,c.start),M=Math.min(m.count,c.start+c.count);for(let E=y,S=M-1;E<S;E+=f){const x=m.getX(E),D=m.getX(E+1),L=oc(this,e,va,h,x,D);L&&t.push(L)}if(this.isLineLoop){const E=m.getX(M-1),S=m.getX(y),x=oc(this,e,va,h,E,S);x&&t.push(x)}}else{const y=Math.max(0,c.start),M=Math.min(_.count,c.start+c.count);for(let E=y,S=M-1;E<S;E+=f){const x=oc(this,e,va,h,E,E+1);x&&t.push(x)}if(this.isLineLoop){const E=oc(this,e,va,h,M-1,y);E&&t.push(E)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,c=s.length;a<c;a++){const u=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[u]=a}}}}}function oc(o,e,t,i,s,a){const c=o.geometry.attributes.position;if(Ac.fromBufferAttribute(c,s),Rc.fromBufferAttribute(c,a),t.distanceSqToSegment(Ac,Rc,kd,Lg)>i)return;kd.applyMatrix4(o.matrixWorld);const h=e.ray.origin.distanceTo(kd);if(!(h<e.near||h>e.far))return{distance:h,point:Lg.clone().applyMatrix4(o.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:o}}const Ng=new Y,Dg=new Y;class af extends of{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let s=0,a=t.count;s<a;s+=2)Ng.fromBufferAttribute(t,s),Dg.fromBufferAttribute(t,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+Ng.distanceTo(Dg);e.setAttribute("lineDistance",new cn(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Wy extends of{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class Q_ extends wi{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new rt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Ig=new pt,Bh=new La,ac=new ki,lc=new Y;class jy extends Qt{constructor(e=new Yn,t=new Q_){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const i=this.geometry,s=this.matrixWorld,a=e.params.Points.threshold,c=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),ac.copy(i.boundingSphere),ac.applyMatrix4(s),ac.radius+=a,e.ray.intersectsSphere(ac)===!1)return;Ig.copy(s).invert(),Bh.copy(e.ray).applyMatrix4(Ig);const u=a/((this.scale.x+this.scale.y+this.scale.z)/3),h=u*u,f=i.index,g=i.attributes.position;if(f!==null){const _=Math.max(0,c.start),y=Math.min(f.count,c.start+c.count);for(let M=_,E=y;M<E;M++){const S=f.getX(M);lc.fromBufferAttribute(g,S),Ug(lc,S,h,s,e,t,this)}}else{const _=Math.max(0,c.start),y=Math.min(g.count,c.start+c.count);for(let M=_,E=y;M<E;M++)lc.fromBufferAttribute(g,M),Ug(lc,M,h,s,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,c=s.length;a<c;a++){const u=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[u]=a}}}}}function Ug(o,e,t,i,s,a,c){const u=Bh.distanceSqToPoint(o);if(u<t){const h=new Y;Bh.closestPointToPoint(o,h),h.applyMatrix4(i);const f=s.ray.origin.distanceTo(h);if(f<s.near||f>s.far)return;a.push({distance:f,distanceToRay:Math.sqrt(u),point:h,index:e,face:null,faceIndex:null,barycoord:null,object:c})}}class Hr extends Qt{constructor(){super(),this.isGroup=!0,this.type="Group"}}class J_ extends _n{constructor(e,t,i,s,a,c,u,h,f,m=po){if(m!==po&&m!==Mo)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&m===po&&(i=vs),i===void 0&&m===Mo&&(i=So),super(null,s,a,c,u,h,m,i,f),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=u!==void 0?u:On,this.minFilter=h!==void 0?h:On,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class lf extends Yn{constructor(e=1,t=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:i,thetaLength:s},t=Math.max(3,t);const a=[],c=[],u=[],h=[],f=new Y,m=new ot;c.push(0,0,0),u.push(0,0,1),h.push(.5,.5);for(let g=0,_=3;g<=t;g++,_+=3){const y=i+g/t*s;f.x=e*Math.cos(y),f.y=e*Math.sin(y),c.push(f.x,f.y,f.z),u.push(0,0,1),m.x=(c[_]/e+1)/2,m.y=(c[_+1]/e+1)/2,h.push(m.x,m.y)}for(let g=1;g<=t;g++)a.push(g,g+1,0);this.setIndex(a),this.setAttribute("position",new cn(c,3)),this.setAttribute("normal",new cn(u,3)),this.setAttribute("uv",new cn(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new lf(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class Pc extends Yn{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const a=e/2,c=t/2,u=Math.floor(i),h=Math.floor(s),f=u+1,m=h+1,g=e/u,_=t/h,y=[],M=[],E=[],S=[];for(let x=0;x<m;x++){const D=x*_-c;for(let L=0;L<f;L++){const b=L*g-a;M.push(b,-D,0),E.push(0,0,1),S.push(L/u),S.push(1-x/h)}}for(let x=0;x<h;x++)for(let D=0;D<u;D++){const L=D+f*x,b=D+f*(x+1),V=D+1+f*(x+1),k=D+1+f*x;y.push(L,b,k),y.push(b,V,k)}this.setIndex(y),this.setAttribute("position",new cn(M,3)),this.setAttribute("normal",new cn(E,3)),this.setAttribute("uv",new cn(S,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Pc(e.width,e.height,e.widthSegments,e.heightSegments)}}class cf extends Yn{constructor(e=.5,t=1,i=32,s=1,a=0,c=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:i,phiSegments:s,thetaStart:a,thetaLength:c},i=Math.max(3,i),s=Math.max(1,s);const u=[],h=[],f=[],m=[];let g=e;const _=(t-e)/s,y=new Y,M=new ot;for(let E=0;E<=s;E++){for(let S=0;S<=i;S++){const x=a+S/i*c;y.x=g*Math.cos(x),y.y=g*Math.sin(x),h.push(y.x,y.y,y.z),f.push(0,0,1),M.x=(y.x/t+1)/2,M.y=(y.y/t+1)/2,m.push(M.x,M.y)}g+=_}for(let E=0;E<s;E++){const S=E*(i+1);for(let x=0;x<i;x++){const D=x+S,L=D,b=D+i+1,V=D+i+2,k=D+1;u.push(L,b,k),u.push(b,V,k)}}this.setIndex(u),this.setAttribute("position",new cn(h,3)),this.setAttribute("normal",new cn(f,3)),this.setAttribute("uv",new cn(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new cf(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class ys extends wi{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new rt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new rt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Jh,this.normalScale=new ot(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Fi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Bi extends ys{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ot(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return xt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new rt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new rt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new rt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class Xy extends wi{constructor(e){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Jh,this.normalScale=new ot(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.flatShading=e.flatShading,this}}class Yy extends wi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=kx,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class qy extends wi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}function cc(o,e,t){return!o||!t&&o.constructor===e?o:typeof e.BYTES_PER_ELEMENT=="number"?new e(o):Array.prototype.slice.call(o)}function Ky(o){return ArrayBuffer.isView(o)&&!(o instanceof DataView)}function $y(o){function e(s,a){return o[s]-o[a]}const t=o.length,i=new Array(t);for(let s=0;s!==t;++s)i[s]=s;return i.sort(e),i}function Fg(o,e,t){const i=o.length,s=new o.constructor(i);for(let a=0,c=0;c!==i;++a){const u=t[a]*e;for(let h=0;h!==e;++h)s[c++]=o[u+h]}return s}function ev(o,e,t,i){let s=1,a=o[0];for(;a!==void 0&&a[i]===void 0;)a=o[s++];if(a===void 0)return;let c=a[i];if(c!==void 0)if(Array.isArray(c))do c=a[i],c!==void 0&&(e.push(a.time),t.push.apply(t,c)),a=o[s++];while(a!==void 0);else if(c.toArray!==void 0)do c=a[i],c!==void 0&&(e.push(a.time),c.toArray(t,t.length)),a=o[s++];while(a!==void 0);else do c=a[i],c!==void 0&&(e.push(a.time),t.push(c)),a=o[s++];while(a!==void 0)}class Na{constructor(e,t,i,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let i=this._cachedIndex,s=t[i],a=t[i-1];e:{t:{let c;n:{i:if(!(e<s)){for(let u=i+2;;){if(s===void 0){if(e<a)break i;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===u)break;if(a=s,s=t[++i],e<s)break t}c=t.length;break n}if(!(e>=a)){const u=t[1];e<u&&(i=2,a=u);for(let h=i-2;;){if(a===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===h)break;if(s=a,a=t[--i-1],e>=a)break t}c=i,i=0;break n}break e}for(;i<c;){const u=i+c>>>1;e<t[u]?c=u:i=u+1}if(s=t[i],a=t[i-1],a===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,a,s)}return this.interpolate_(i,a,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,i=this.sampleValues,s=this.valueSize,a=e*s;for(let c=0;c!==s;++c)t[c]=i[a+c];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}class Zy extends Na{constructor(e,t,i,s){super(e,t,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Jm,endingEnd:Jm}}intervalChanged_(e,t,i){const s=this.parameterPositions;let a=e-2,c=e+1,u=s[a],h=s[c];if(u===void 0)switch(this.getSettings_().endingStart){case eg:a=e,u=2*t-i;break;case tg:a=s.length-2,u=t+s[a]-s[a+1];break;default:a=e,u=i}if(h===void 0)switch(this.getSettings_().endingEnd){case eg:c=e,h=2*i-t;break;case tg:c=1,h=i+s[1]-s[0];break;default:c=e-1,h=t}const f=(i-t)*.5,m=this.valueSize;this._weightPrev=f/(t-u),this._weightNext=f/(h-i),this._offsetPrev=a*m,this._offsetNext=c*m}interpolate_(e,t,i,s){const a=this.resultBuffer,c=this.sampleValues,u=this.valueSize,h=e*u,f=h-u,m=this._offsetPrev,g=this._offsetNext,_=this._weightPrev,y=this._weightNext,M=(i-t)/(s-t),E=M*M,S=E*M,x=-_*S+2*_*E-_*M,D=(1+_)*S+(-1.5-2*_)*E+(-.5+_)*M+1,L=(-1-y)*S+(1.5+y)*E+.5*M,b=y*S-y*E;for(let V=0;V!==u;++V)a[V]=x*c[m+V]+D*c[f+V]+L*c[h+V]+b*c[g+V];return a}}class Qy extends Na{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){const a=this.resultBuffer,c=this.sampleValues,u=this.valueSize,h=e*u,f=h-u,m=(i-t)/(s-t),g=1-m;for(let _=0;_!==u;++_)a[_]=c[f+_]*g+c[h+_]*m;return a}}class Jy extends Na{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e){return this.copySampleValue_(e-1)}}class zi{constructor(e,t,i,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=cc(t,this.TimeBufferType),this.values=cc(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:cc(e.times,Array),values:cc(e.values,Array)};const s=e.getInterpolation();s!==e.DefaultInterpolation&&(i.interpolation=s)}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new Jy(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Qy(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Zy(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Ra:t=this.InterpolantFactoryMethodDiscrete;break;case ba:t=this.InterpolantFactoryMethodLinear;break;case md:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){const i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return console.warn("THREE.KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ra;case this.InterpolantFactoryMethodLinear:return ba;case this.InterpolantFactoryMethodSmooth:return md}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]*=e}return this}trim(e,t){const i=this.times,s=i.length;let a=0,c=s-1;for(;a!==s&&i[a]<e;)++a;for(;c!==-1&&i[c]>t;)--c;if(++c,a!==0||c!==s){a>=c&&(c=Math.max(c,1),a=c-1);const u=this.getValueSize();this.times=i.slice(a,c),this.values=this.values.slice(a*u,c*u)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);const i=this.times,s=this.values,a=i.length;a===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let c=null;for(let u=0;u!==a;u++){const h=i[u];if(typeof h=="number"&&isNaN(h)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,u,h),e=!1;break}if(c!==null&&c>h){console.error("THREE.KeyframeTrack: Out of order keys.",this,u,h,c),e=!1;break}c=h}if(s!==void 0&&Ky(s))for(let u=0,h=s.length;u!==h;++u){const f=s[u];if(isNaN(f)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,u,f),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===md,a=e.length-1;let c=1;for(let u=1;u<a;++u){let h=!1;const f=e[u],m=e[u+1];if(f!==m&&(u!==1||f!==e[0]))if(s)h=!0;else{const g=u*i,_=g-i,y=g+i;for(let M=0;M!==i;++M){const E=t[g+M];if(E!==t[_+M]||E!==t[y+M]){h=!0;break}}}if(h){if(u!==c){e[c]=e[u];const g=u*i,_=c*i;for(let y=0;y!==i;++y)t[_+y]=t[g+y]}++c}}if(a>0){e[c]=e[a];for(let u=a*i,h=c*i,f=0;f!==i;++f)t[h+f]=t[u+f];++c}return c!==e.length?(this.times=e.slice(0,c),this.values=t.slice(0,c*i)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),i=this.constructor,s=new i(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}}zi.prototype.TimeBufferType=Float32Array;zi.prototype.ValueBufferType=Float32Array;zi.prototype.DefaultInterpolation=ba;class Co extends zi{constructor(e,t,i){super(e,t,i)}}Co.prototype.ValueTypeName="bool";Co.prototype.ValueBufferType=Array;Co.prototype.DefaultInterpolation=Ra;Co.prototype.InterpolantFactoryMethodLinear=void 0;Co.prototype.InterpolantFactoryMethodSmooth=void 0;class tv extends zi{}tv.prototype.ValueTypeName="color";class wo extends zi{}wo.prototype.ValueTypeName="number";class eS extends Na{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){const a=this.resultBuffer,c=this.sampleValues,u=this.valueSize,h=(i-t)/(s-t);let f=e*u;for(let m=f+u;f!==m;f+=4)Ui.slerpFlat(a,0,c,f-u,c,f,h);return a}}class Ao extends zi{InterpolantFactoryMethodLinear(e){return new eS(this.times,this.values,this.getValueSize(),e)}}Ao.prototype.ValueTypeName="quaternion";Ao.prototype.InterpolantFactoryMethodSmooth=void 0;class Po extends zi{constructor(e,t,i){super(e,t,i)}}Po.prototype.ValueTypeName="string";Po.prototype.ValueBufferType=Array;Po.prototype.DefaultInterpolation=Ra;Po.prototype.InterpolantFactoryMethodLinear=void 0;Po.prototype.InterpolantFactoryMethodSmooth=void 0;class Ro extends zi{}Ro.prototype.ValueTypeName="vector";class tS{constructor(e="",t=-1,i=[],s=Fx){this.name=e,this.tracks=i,this.duration=t,this.blendMode=s,this.uuid=Ti(),this.duration<0&&this.resetDuration()}static parse(e){const t=[],i=e.tracks,s=1/(e.fps||1);for(let c=0,u=i.length;c!==u;++c)t.push(iS(i[c]).scale(s));const a=new this(e.name,e.duration,t,e.blendMode);return a.uuid=e.uuid,a}static toJSON(e){const t=[],i=e.tracks,s={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode};for(let a=0,c=i.length;a!==c;++a)t.push(zi.toJSON(i[a]));return s}static CreateFromMorphTargetSequence(e,t,i,s){const a=t.length,c=[];for(let u=0;u<a;u++){let h=[],f=[];h.push((u+a-1)%a,u,(u+1)%a),f.push(0,1,0);const m=$y(h);h=Fg(h,1,m),f=Fg(f,1,m),!s&&h[0]===0&&(h.push(a),f.push(f[0])),c.push(new wo(".morphTargetInfluences["+t[u].name+"]",h,f).scale(1/i))}return new this(e,-1,c)}static findByName(e,t){let i=e;if(!Array.isArray(e)){const s=e;i=s.geometry&&s.geometry.animations||s.animations}for(let s=0;s<i.length;s++)if(i[s].name===t)return i[s];return null}static CreateClipsFromMorphTargetSequences(e,t,i){const s={},a=/^([\w-]*?)([\d]+)$/;for(let u=0,h=e.length;u<h;u++){const f=e[u],m=f.name.match(a);if(m&&m.length>1){const g=m[1];let _=s[g];_||(s[g]=_=[]),_.push(f)}}const c=[];for(const u in s)c.push(this.CreateFromMorphTargetSequence(u,s[u],t,i));return c}static parseAnimation(e,t){if(!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;const i=function(g,_,y,M,E){if(y.length!==0){const S=[],x=[];ev(y,S,x,M),S.length!==0&&E.push(new g(_,S,x))}},s=[],a=e.name||"default",c=e.fps||30,u=e.blendMode;let h=e.length||-1;const f=e.hierarchy||[];for(let g=0;g<f.length;g++){const _=f[g].keys;if(!(!_||_.length===0))if(_[0].morphTargets){const y={};let M;for(M=0;M<_.length;M++)if(_[M].morphTargets)for(let E=0;E<_[M].morphTargets.length;E++)y[_[M].morphTargets[E]]=-1;for(const E in y){const S=[],x=[];for(let D=0;D!==_[M].morphTargets.length;++D){const L=_[M];S.push(L.time),x.push(L.morphTarget===E?1:0)}s.push(new wo(".morphTargetInfluence["+E+"]",S,x))}h=y.length*c}else{const y=".bones["+t[g].name+"]";i(Ro,y+".position",_,"pos",s),i(Ao,y+".quaternion",_,"rot",s),i(Ro,y+".scale",_,"scl",s)}}return s.length===0?null:new this(a,h,s,u)}resetDuration(){const e=this.tracks;let t=0;for(let i=0,s=e.length;i!==s;++i){const a=this.tracks[i];t=Math.max(t,a.times[a.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let t=0;t<this.tracks.length;t++)e.push(this.tracks[t].clone());return new this.constructor(this.name,this.duration,e,this.blendMode)}toJSON(){return this.constructor.toJSON(this)}}function nS(o){switch(o.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return wo;case"vector":case"vector2":case"vector3":case"vector4":return Ro;case"color":return tv;case"quaternion":return Ao;case"bool":case"boolean":return Co;case"string":return Po}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+o)}function iS(o){if(o.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=nS(o.type);if(o.times===void 0){const t=[],i=[];ev(o.keys,t,i,"value"),o.times=t,o.values=i}return e.parse!==void 0?e.parse(o):new e(o.name,o.times,o.values,o.interpolation)}const Vr={enabled:!1,files:{},add:function(o,e){this.enabled!==!1&&(this.files[o]=e)},get:function(o){if(this.enabled!==!1)return this.files[o]},remove:function(o){delete this.files[o]},clear:function(){this.files={}}};class rS{constructor(e,t,i){const s=this;let a=!1,c=0,u=0,h;const f=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this.itemStart=function(m){u++,a===!1&&s.onStart!==void 0&&s.onStart(m,c,u),a=!0},this.itemEnd=function(m){c++,s.onProgress!==void 0&&s.onProgress(m,c,u),c===u&&(a=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(m){s.onError!==void 0&&s.onError(m)},this.resolveURL=function(m){return h?h(m):m},this.setURLModifier=function(m){return h=m,this},this.addHandler=function(m,g){return f.push(m,g),this},this.removeHandler=function(m){const g=f.indexOf(m);return g!==-1&&f.splice(g,2),this},this.getHandler=function(m){for(let g=0,_=f.length;g<_;g+=2){const y=f[g],M=f[g+1];if(y.global&&(y.lastIndex=0),y.test(m))return M}return null}}}const sS=new rS;class Lo{constructor(e){this.manager=e!==void 0?e:sS,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const i=this;return new Promise(function(s,a){i.load(e,s,t,a)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}Lo.DEFAULT_MATERIAL_NAME="__DEFAULT";const nr={};class oS extends Error{constructor(e,t){super(e),this.response=t}}class nv extends Lo{constructor(e){super(e)}load(e,t,i,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const a=Vr.get(e);if(a!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(a),this.manager.itemEnd(e)},0),a;if(nr[e]!==void 0){nr[e].push({onLoad:t,onProgress:i,onError:s});return}nr[e]=[],nr[e].push({onLoad:t,onProgress:i,onError:s});const c=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),u=this.mimeType,h=this.responseType;fetch(c).then(f=>{if(f.status===200||f.status===0){if(f.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||f.body===void 0||f.body.getReader===void 0)return f;const m=nr[e],g=f.body.getReader(),_=f.headers.get("X-File-Size")||f.headers.get("Content-Length"),y=_?parseInt(_):0,M=y!==0;let E=0;const S=new ReadableStream({start(x){D();function D(){g.read().then(({done:L,value:b})=>{if(L)x.close();else{E+=b.byteLength;const V=new ProgressEvent("progress",{lengthComputable:M,loaded:E,total:y});for(let k=0,F=m.length;k<F;k++){const X=m[k];X.onProgress&&X.onProgress(V)}x.enqueue(b),D()}},L=>{x.error(L)})}}});return new Response(S)}else throw new oS(`fetch for "${f.url}" responded with ${f.status}: ${f.statusText}`,f)}).then(f=>{switch(h){case"arraybuffer":return f.arrayBuffer();case"blob":return f.blob();case"document":return f.text().then(m=>new DOMParser().parseFromString(m,u));case"json":return f.json();default:if(u===void 0)return f.text();{const g=/charset="?([^;"\s]*)"?/i.exec(u),_=g&&g[1]?g[1].toLowerCase():void 0,y=new TextDecoder(_);return f.arrayBuffer().then(M=>y.decode(M))}}}).then(f=>{Vr.add(e,f);const m=nr[e];delete nr[e];for(let g=0,_=m.length;g<_;g++){const y=m[g];y.onLoad&&y.onLoad(f)}}).catch(f=>{const m=nr[e];if(m===void 0)throw this.manager.itemError(e),f;delete nr[e];for(let g=0,_=m.length;g<_;g++){const y=m[g];y.onError&&y.onError(f)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}}class aS extends Lo{constructor(e){super(e)}load(e,t,i,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const a=this,c=Vr.get(e);if(c!==void 0)return a.manager.itemStart(e),setTimeout(function(){t&&t(c),a.manager.itemEnd(e)},0),c;const u=Ca("img");function h(){m(),Vr.add(e,this),t&&t(this),a.manager.itemEnd(e)}function f(g){m(),s&&s(g),a.manager.itemError(e),a.manager.itemEnd(e)}function m(){u.removeEventListener("load",h,!1),u.removeEventListener("error",f,!1)}return u.addEventListener("load",h,!1),u.addEventListener("error",f,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(u.crossOrigin=this.crossOrigin),a.manager.itemStart(e),u.src=e,u}}class lS extends Lo{constructor(e){super(e)}load(e,t,i,s){const a=new _n,c=new aS(this.manager);return c.setCrossOrigin(this.crossOrigin),c.setPath(this.path),c.load(e,function(u){a.image=u,a.needsUpdate=!0,t!==void 0&&t(a)},i,s),a}}class uf extends Qt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new rt(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}const Bd=new pt,Og=new Y,kg=new Y;class df{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ot(512,512),this.map=null,this.mapPass=null,this.matrix=new pt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new sf,this._frameExtents=new ot(1,1),this._viewportCount=1,this._viewports=[new It(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;Og.setFromMatrixPosition(e.matrixWorld),t.position.copy(Og),kg.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(kg),t.updateMatrixWorld(),Bd.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Bd),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Bd)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class cS extends df{constructor(){super(new Un(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(e){const t=this.camera,i=Eo*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height,a=e.distance||t.far;(i!==t.fov||s!==t.aspect||a!==t.far)&&(t.fov=i,t.aspect=s,t.far=a,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class uS extends uf{constructor(e,t,i=0,s=Math.PI/3,a=0,c=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Qt.DEFAULT_UP),this.updateMatrix(),this.target=new Qt,this.distance=i,this.angle=s,this.penumbra=a,this.decay=c,this.map=null,this.shadow=new cS}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}const Bg=new pt,xa=new Y,zd=new Y;class dS extends df{constructor(){super(new Un(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ot(4,2),this._viewportCount=6,this._viewports=[new It(2,1,1,1),new It(0,1,1,1),new It(3,1,1,1),new It(1,1,1,1),new It(3,0,1,1),new It(1,0,1,1)],this._cubeDirections=[new Y(1,0,0),new Y(-1,0,0),new Y(0,0,1),new Y(0,0,-1),new Y(0,1,0),new Y(0,-1,0)],this._cubeUps=[new Y(0,1,0),new Y(0,1,0),new Y(0,1,0),new Y(0,1,0),new Y(0,0,1),new Y(0,0,-1)]}updateMatrices(e,t=0){const i=this.camera,s=this.matrix,a=e.distance||i.far;a!==i.far&&(i.far=a,i.updateProjectionMatrix()),xa.setFromMatrixPosition(e.matrixWorld),i.position.copy(xa),zd.copy(i.position),zd.add(this._cubeDirections[t]),i.up.copy(this._cubeUps[t]),i.lookAt(zd),i.updateMatrixWorld(),s.makeTranslation(-xa.x,-xa.y,-xa.z),Bg.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Bg)}}class iv extends uf{constructor(e,t,i=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new dS}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class hf extends Y_{constructor(e=-1,t=1,i=1,s=-1,a=.1,c=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=a,this.far=c,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,a,c){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=c,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let a=i-e,c=i+e,u=s+t,h=s-t;if(this.view!==null&&this.view.enabled){const f=(this.right-this.left)/this.view.fullWidth/this.zoom,m=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=f*this.view.offsetX,c=a+f*this.view.width,u-=m*this.view.offsetY,h=u-m*this.view.height}this.projectionMatrix.makeOrthographic(a,c,u,h,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class hS extends df{constructor(){super(new hf(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Sc extends uf{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Qt.DEFAULT_UP),this.updateMatrix(),this.target=new Qt,this.shadow=new hS}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class wa{static decodeText(e){if(console.warn("THREE.LoaderUtils: decodeText() has been deprecated with r165 and will be removed with r175. Use TextDecoder instead."),typeof TextDecoder<"u")return new TextDecoder().decode(e);let t="";for(let i=0,s=e.length;i<s;i++)t+=String.fromCharCode(e[i]);try{return decodeURIComponent(escape(t))}catch{return t}}static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}class fS extends Lo{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"}}setOptions(e){return this.options=e,this}load(e,t,i,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const a=this,c=Vr.get(e);if(c!==void 0){if(a.manager.itemStart(e),c.then){c.then(f=>{t&&t(f),a.manager.itemEnd(e)}).catch(f=>{s&&s(f)});return}return setTimeout(function(){t&&t(c),a.manager.itemEnd(e)},0),c}const u={};u.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",u.headers=this.requestHeader;const h=fetch(e,u).then(function(f){return f.blob()}).then(function(f){return createImageBitmap(f,Object.assign(a.options,{colorSpaceConversion:"none"}))}).then(function(f){return Vr.add(e,f),t&&t(f),a.manager.itemEnd(e),f}).catch(function(f){s&&s(f),Vr.remove(e),a.manager.itemError(e),a.manager.itemEnd(e)});Vr.add(e,h),a.manager.itemStart(e)}}class pS extends Un{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class mS{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=zg(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=zg();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function zg(){return performance.now()}const ff="\\[\\]\\.:\\/",gS=new RegExp("["+ff+"]","g"),pf="[^"+ff+"]",_S="[^"+ff.replace("\\.","")+"]",vS=/((?:WC+[\/:])*)/.source.replace("WC",pf),xS=/(WCOD+)?/.source.replace("WCOD",_S),yS=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",pf),SS=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",pf),MS=new RegExp("^"+vS+xS+yS+SS+"$"),ES=["material","materials","bones","map"];class TS{constructor(e,t,i){const s=i||Ot.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();const i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(e,t)}setValue(e,t){const i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,a=i.length;s!==a;++s)i[s].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].unbind()}}class Ot{constructor(e,t,i){this.path=t,this.parsedPath=i||Ot.parseTrackName(t),this.node=Ot.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new Ot.Composite(e,t,i):new Ot(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(gS,"")}static parseTrackName(e){const t=MS.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);const i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){const a=i.nodeName.substring(s+1);ES.indexOf(a)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=a)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){const i=function(a){for(let c=0;c<a.length;c++){const u=a[c];if(u.name===t||u.uuid===t)return u;const h=i(u.children);if(h)return h}return null},s=i(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const i=this.resolvedProperty;for(let s=0,a=i.length;s!==a;++s)e[t++]=i[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const i=this.resolvedProperty;for(let s=0,a=i.length;s!==a;++s)i[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const i=this.resolvedProperty;for(let s=0,a=i.length;s!==a;++s)i[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const i=this.resolvedProperty;for(let s=0,a=i.length;s!==a;++s)i[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,i=t.objectName,s=t.propertyName;let a=t.propertyIndex;if(e||(e=Ot.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let f=t.objectIndex;switch(i){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let m=0;m<e.length;m++)if(e[m].name===f){f=m;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(f!==void 0){if(e[f]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[f]}}const c=e[s];if(c===void 0){const f=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+f+"."+s+" but it wasn't found.",e);return}let u=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?u=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(u=this.Versioning.MatrixWorldNeedsUpdate);let h=this.BindingType.Direct;if(a!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[a]!==void 0&&(a=e.morphTargetDictionary[a])}h=this.BindingType.ArrayElement,this.resolvedProperty=c,this.propertyIndex=a}else c.fromArray!==void 0&&c.toArray!==void 0?(h=this.BindingType.HasFromToArray,this.resolvedProperty=c):Array.isArray(c)?(h=this.BindingType.EntireArray,this.resolvedProperty=c):this.propertyName=s;this.getValue=this.GetterByBindingType[h],this.setValue=this.SetterByBindingTypeAndVersioning[h][u]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}Ot.Composite=TS;Ot.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Ot.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Ot.prototype.GetterByBindingType=[Ot.prototype._getValue_direct,Ot.prototype._getValue_array,Ot.prototype._getValue_arrayElement,Ot.prototype._getValue_toArray];Ot.prototype.SetterByBindingTypeAndVersioning=[[Ot.prototype._setValue_direct,Ot.prototype._setValue_direct_setNeedsUpdate,Ot.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Ot.prototype._setValue_array,Ot.prototype._setValue_array_setNeedsUpdate,Ot.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Ot.prototype._setValue_arrayElement,Ot.prototype._setValue_arrayElement_setNeedsUpdate,Ot.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Ot.prototype._setValue_fromArray,Ot.prototype._setValue_fromArray_setNeedsUpdate,Ot.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class Hg{constructor(e=1,t=0,i=0){return this.radius=e,this.phi=t,this.theta=i,this}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=xt(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(xt(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}const Fr=new Y,uc=new pt,Hd=new pt;class wS extends af{constructor(e){const t=rv(e),i=new Yn,s=[],a=[],c=new rt(0,0,1),u=new rt(0,1,0);for(let f=0;f<t.length;f++){const m=t[f];m.parent&&m.parent.isBone&&(s.push(0,0,0),s.push(0,0,0),a.push(c.r,c.g,c.b),a.push(u.r,u.g,u.b))}i.setAttribute("position",new cn(s,3)),i.setAttribute("color",new cn(a,3));const h=new Cc({vertexColors:!0,depthTest:!1,depthWrite:!1,toneMapped:!1,transparent:!0});super(i,h),this.isSkeletonHelper=!0,this.type="SkeletonHelper",this.root=e,this.bones=t,this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1}updateMatrixWorld(e){const t=this.bones,i=this.geometry,s=i.getAttribute("position");Hd.copy(this.root.matrixWorld).invert();for(let a=0,c=0;a<t.length;a++){const u=t[a];u.parent&&u.parent.isBone&&(uc.multiplyMatrices(Hd,u.matrixWorld),Fr.setFromMatrixPosition(uc),s.setXYZ(c,Fr.x,Fr.y,Fr.z),uc.multiplyMatrices(Hd,u.parent.matrixWorld),Fr.setFromMatrixPosition(uc),s.setXYZ(c+1,Fr.x,Fr.y,Fr.z),c+=2)}i.getAttribute("position").needsUpdate=!0,super.updateMatrixWorld(e)}dispose(){this.geometry.dispose(),this.material.dispose()}}function rv(o){const e=[];o.isBone===!0&&e.push(o);for(let t=0;t<o.children.length;t++)e.push.apply(e,rv(o.children[t]));return e}class AS extends af{constructor(e=10,t=10,i=4473924,s=8947848){i=new rt(i),s=new rt(s);const a=t/2,c=e/t,u=e/2,h=[],f=[];for(let _=0,y=0,M=-u;_<=t;_++,M+=c){h.push(-u,0,M,u,0,M),h.push(M,0,-u,M,0,u);const E=_===a?i:s;E.toArray(f,y),y+=3,E.toArray(f,y),y+=3,E.toArray(f,y),y+=3,E.toArray(f,y),y+=3}const m=new Yn;m.setAttribute("position",new cn(h,3)),m.setAttribute("color",new cn(f,3));const g=new Cc({vertexColors:!0,toneMapped:!1});super(m,g),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class RS extends Ms{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}}function Vg(o,e,t,i){const s=bS(i);switch(t){case P_:return o*e;case N_:return o*e;case D_:return o*e*2;case Kh:return o*e/s.components*s.byteLength;case $h:return o*e/s.components*s.byteLength;case I_:return o*e*2/s.components*s.byteLength;case Zh:return o*e*2/s.components*s.byteLength;case L_:return o*e*3/s.components*s.byteLength;case ci:return o*e*4/s.components*s.byteLength;case Qh:return o*e*4/s.components*s.byteLength;case gc:case _c:return Math.floor((o+3)/4)*Math.floor((e+3)/4)*8;case vc:case xc:return Math.floor((o+3)/4)*Math.floor((e+3)/4)*16;case dh:case fh:return Math.max(o,16)*Math.max(e,8)/4;case uh:case hh:return Math.max(o,8)*Math.max(e,8)/2;case ph:case mh:return Math.floor((o+3)/4)*Math.floor((e+3)/4)*8;case gh:return Math.floor((o+3)/4)*Math.floor((e+3)/4)*16;case _h:return Math.floor((o+3)/4)*Math.floor((e+3)/4)*16;case vh:return Math.floor((o+4)/5)*Math.floor((e+3)/4)*16;case xh:return Math.floor((o+4)/5)*Math.floor((e+4)/5)*16;case yh:return Math.floor((o+5)/6)*Math.floor((e+4)/5)*16;case Sh:return Math.floor((o+5)/6)*Math.floor((e+5)/6)*16;case Mh:return Math.floor((o+7)/8)*Math.floor((e+4)/5)*16;case Eh:return Math.floor((o+7)/8)*Math.floor((e+5)/6)*16;case Th:return Math.floor((o+7)/8)*Math.floor((e+7)/8)*16;case wh:return Math.floor((o+9)/10)*Math.floor((e+4)/5)*16;case Ah:return Math.floor((o+9)/10)*Math.floor((e+5)/6)*16;case Rh:return Math.floor((o+9)/10)*Math.floor((e+7)/8)*16;case bh:return Math.floor((o+9)/10)*Math.floor((e+9)/10)*16;case Ch:return Math.floor((o+11)/12)*Math.floor((e+9)/10)*16;case Ph:return Math.floor((o+11)/12)*Math.floor((e+11)/12)*16;case yc:case Lh:case Nh:return Math.ceil(o/4)*Math.ceil(e/4)*16;case U_:case Dh:return Math.ceil(o/4)*Math.ceil(e/4)*8;case Ih:case Uh:return Math.ceil(o/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function bS(o){switch(o){case cr:case R_:return{byteLength:1,components:1};case Aa:case b_:case Pa:return{byteLength:2,components:1};case Yh:case qh:return{byteLength:2,components:4};case vs:case Xh:case Ei:return{byteLength:4,components:1};case C_:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${o}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:jh}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=jh);/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function sv(){let o=null,e=!1,t=null,i=null;function s(a,c){t(a,c),i=o.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(i=o.requestAnimationFrame(s),e=!0)},stop:function(){o.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(a){t=a},setContext:function(a){o=a}}}function CS(o){const e=new WeakMap;function t(u,h){const f=u.array,m=u.usage,g=f.byteLength,_=o.createBuffer();o.bindBuffer(h,_),o.bufferData(h,f,m),u.onUploadCallback();let y;if(f instanceof Float32Array)y=o.FLOAT;else if(f instanceof Uint16Array)u.isFloat16BufferAttribute?y=o.HALF_FLOAT:y=o.UNSIGNED_SHORT;else if(f instanceof Int16Array)y=o.SHORT;else if(f instanceof Uint32Array)y=o.UNSIGNED_INT;else if(f instanceof Int32Array)y=o.INT;else if(f instanceof Int8Array)y=o.BYTE;else if(f instanceof Uint8Array)y=o.UNSIGNED_BYTE;else if(f instanceof Uint8ClampedArray)y=o.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+f);return{buffer:_,type:y,bytesPerElement:f.BYTES_PER_ELEMENT,version:u.version,size:g}}function i(u,h,f){const m=h.array,g=h.updateRanges;if(o.bindBuffer(f,u),g.length===0)o.bufferSubData(f,0,m);else{g.sort((y,M)=>y.start-M.start);let _=0;for(let y=1;y<g.length;y++){const M=g[_],E=g[y];E.start<=M.start+M.count+1?M.count=Math.max(M.count,E.start+E.count-M.start):(++_,g[_]=E)}g.length=_+1;for(let y=0,M=g.length;y<M;y++){const E=g[y];o.bufferSubData(f,E.start*m.BYTES_PER_ELEMENT,m,E.start,E.count)}h.clearUpdateRanges()}h.onUploadCallback()}function s(u){return u.isInterleavedBufferAttribute&&(u=u.data),e.get(u)}function a(u){u.isInterleavedBufferAttribute&&(u=u.data);const h=e.get(u);h&&(o.deleteBuffer(h.buffer),e.delete(u))}function c(u,h){if(u.isInterleavedBufferAttribute&&(u=u.data),u.isGLBufferAttribute){const m=e.get(u);(!m||m.version<u.version)&&e.set(u,{buffer:u.buffer,type:u.type,bytesPerElement:u.elementSize,version:u.version});return}const f=e.get(u);if(f===void 0)e.set(u,t(u,h));else if(f.version<u.version){if(f.size!==u.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(f.buffer,u,h),f.version=u.version}}return{get:s,remove:a,update:c}}var PS=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,LS=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,NS=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,DS=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,IS=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,US=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,FS=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,OS=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,kS=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,BS=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,zS=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,HS=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,VS=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,GS=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,WS=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,jS=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,XS=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,YS=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,qS=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,KS=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,$S=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,ZS=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,QS=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,JS=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,eM=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,tM=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,nM=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,iM=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,rM=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,sM=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,oM="gl_FragColor = linearToOutputTexel( gl_FragColor );",aM=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,lM=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,cM=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,uM=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,dM=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,hM=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fM=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,pM=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,mM=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,gM=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,_M=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,vM=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,xM=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,yM=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,SM=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,MM=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,EM=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,TM=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,wM=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,AM=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,RM=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,bM=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,CM=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,PM=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,LM=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,NM=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,DM=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,IM=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,UM=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,FM=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,OM=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,kM=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,BM=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,zM=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,HM=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,VM=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,GM=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,WM=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,jM=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,XM=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,YM=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,qM=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,KM=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,$M=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ZM=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,QM=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,JM=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,eE=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,tE=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,nE=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,iE=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,rE=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,sE=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,oE=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,aE=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,lE=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,cE=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,uE=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,dE=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,hE=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,fE=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,pE=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,mE=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,gE=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,_E=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,vE=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,xE=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,yE=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,SE=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,ME=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,EE=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,TE=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,wE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,AE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,RE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,bE=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const CE=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,PE=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,LE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,NE=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,DE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,IE=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,UE=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,FE=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,OE=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,kE=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,BE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,zE=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,HE=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,VE=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,GE=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,WE=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,jE=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,XE=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,YE=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,qE=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,KE=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,$E=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,ZE=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,QE=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,JE=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,eT=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,tT=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,nT=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,iT=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,rT=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sT=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,oT=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,aT=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,lT=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,vt={alphahash_fragment:PS,alphahash_pars_fragment:LS,alphamap_fragment:NS,alphamap_pars_fragment:DS,alphatest_fragment:IS,alphatest_pars_fragment:US,aomap_fragment:FS,aomap_pars_fragment:OS,batching_pars_vertex:kS,batching_vertex:BS,begin_vertex:zS,beginnormal_vertex:HS,bsdfs:VS,iridescence_fragment:GS,bumpmap_pars_fragment:WS,clipping_planes_fragment:jS,clipping_planes_pars_fragment:XS,clipping_planes_pars_vertex:YS,clipping_planes_vertex:qS,color_fragment:KS,color_pars_fragment:$S,color_pars_vertex:ZS,color_vertex:QS,common:JS,cube_uv_reflection_fragment:eM,defaultnormal_vertex:tM,displacementmap_pars_vertex:nM,displacementmap_vertex:iM,emissivemap_fragment:rM,emissivemap_pars_fragment:sM,colorspace_fragment:oM,colorspace_pars_fragment:aM,envmap_fragment:lM,envmap_common_pars_fragment:cM,envmap_pars_fragment:uM,envmap_pars_vertex:dM,envmap_physical_pars_fragment:MM,envmap_vertex:hM,fog_vertex:fM,fog_pars_vertex:pM,fog_fragment:mM,fog_pars_fragment:gM,gradientmap_pars_fragment:_M,lightmap_pars_fragment:vM,lights_lambert_fragment:xM,lights_lambert_pars_fragment:yM,lights_pars_begin:SM,lights_toon_fragment:EM,lights_toon_pars_fragment:TM,lights_phong_fragment:wM,lights_phong_pars_fragment:AM,lights_physical_fragment:RM,lights_physical_pars_fragment:bM,lights_fragment_begin:CM,lights_fragment_maps:PM,lights_fragment_end:LM,logdepthbuf_fragment:NM,logdepthbuf_pars_fragment:DM,logdepthbuf_pars_vertex:IM,logdepthbuf_vertex:UM,map_fragment:FM,map_pars_fragment:OM,map_particle_fragment:kM,map_particle_pars_fragment:BM,metalnessmap_fragment:zM,metalnessmap_pars_fragment:HM,morphinstance_vertex:VM,morphcolor_vertex:GM,morphnormal_vertex:WM,morphtarget_pars_vertex:jM,morphtarget_vertex:XM,normal_fragment_begin:YM,normal_fragment_maps:qM,normal_pars_fragment:KM,normal_pars_vertex:$M,normal_vertex:ZM,normalmap_pars_fragment:QM,clearcoat_normal_fragment_begin:JM,clearcoat_normal_fragment_maps:eE,clearcoat_pars_fragment:tE,iridescence_pars_fragment:nE,opaque_fragment:iE,packing:rE,premultiplied_alpha_fragment:sE,project_vertex:oE,dithering_fragment:aE,dithering_pars_fragment:lE,roughnessmap_fragment:cE,roughnessmap_pars_fragment:uE,shadowmap_pars_fragment:dE,shadowmap_pars_vertex:hE,shadowmap_vertex:fE,shadowmask_pars_fragment:pE,skinbase_vertex:mE,skinning_pars_vertex:gE,skinning_vertex:_E,skinnormal_vertex:vE,specularmap_fragment:xE,specularmap_pars_fragment:yE,tonemapping_fragment:SE,tonemapping_pars_fragment:ME,transmission_fragment:EE,transmission_pars_fragment:TE,uv_pars_fragment:wE,uv_pars_vertex:AE,uv_vertex:RE,worldpos_vertex:bE,background_vert:CE,background_frag:PE,backgroundCube_vert:LE,backgroundCube_frag:NE,cube_vert:DE,cube_frag:IE,depth_vert:UE,depth_frag:FE,distanceRGBA_vert:OE,distanceRGBA_frag:kE,equirect_vert:BE,equirect_frag:zE,linedashed_vert:HE,linedashed_frag:VE,meshbasic_vert:GE,meshbasic_frag:WE,meshlambert_vert:jE,meshlambert_frag:XE,meshmatcap_vert:YE,meshmatcap_frag:qE,meshnormal_vert:KE,meshnormal_frag:$E,meshphong_vert:ZE,meshphong_frag:QE,meshphysical_vert:JE,meshphysical_frag:eT,meshtoon_vert:tT,meshtoon_frag:nT,points_vert:iT,points_frag:rT,shadow_vert:sT,shadow_frag:oT,sprite_vert:aT,sprite_frag:lT},Ue={common:{diffuse:{value:new rt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new mt},alphaMap:{value:null},alphaMapTransform:{value:new mt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new mt}},envmap:{envMap:{value:null},envMapRotation:{value:new mt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new mt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new mt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new mt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new mt},normalScale:{value:new ot(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new mt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new mt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new mt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new mt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new rt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new rt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new mt},alphaTest:{value:0},uvTransform:{value:new mt}},sprite:{diffuse:{value:new rt(16777215)},opacity:{value:1},center:{value:new ot(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new mt},alphaMap:{value:null},alphaMapTransform:{value:new mt},alphaTest:{value:0}}},Di={basic:{uniforms:In([Ue.common,Ue.specularmap,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.fog]),vertexShader:vt.meshbasic_vert,fragmentShader:vt.meshbasic_frag},lambert:{uniforms:In([Ue.common,Ue.specularmap,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.fog,Ue.lights,{emissive:{value:new rt(0)}}]),vertexShader:vt.meshlambert_vert,fragmentShader:vt.meshlambert_frag},phong:{uniforms:In([Ue.common,Ue.specularmap,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.fog,Ue.lights,{emissive:{value:new rt(0)},specular:{value:new rt(1118481)},shininess:{value:30}}]),vertexShader:vt.meshphong_vert,fragmentShader:vt.meshphong_frag},standard:{uniforms:In([Ue.common,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.roughnessmap,Ue.metalnessmap,Ue.fog,Ue.lights,{emissive:{value:new rt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:vt.meshphysical_vert,fragmentShader:vt.meshphysical_frag},toon:{uniforms:In([Ue.common,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.gradientmap,Ue.fog,Ue.lights,{emissive:{value:new rt(0)}}]),vertexShader:vt.meshtoon_vert,fragmentShader:vt.meshtoon_frag},matcap:{uniforms:In([Ue.common,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.fog,{matcap:{value:null}}]),vertexShader:vt.meshmatcap_vert,fragmentShader:vt.meshmatcap_frag},points:{uniforms:In([Ue.points,Ue.fog]),vertexShader:vt.points_vert,fragmentShader:vt.points_frag},dashed:{uniforms:In([Ue.common,Ue.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:vt.linedashed_vert,fragmentShader:vt.linedashed_frag},depth:{uniforms:In([Ue.common,Ue.displacementmap]),vertexShader:vt.depth_vert,fragmentShader:vt.depth_frag},normal:{uniforms:In([Ue.common,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,{opacity:{value:1}}]),vertexShader:vt.meshnormal_vert,fragmentShader:vt.meshnormal_frag},sprite:{uniforms:In([Ue.sprite,Ue.fog]),vertexShader:vt.sprite_vert,fragmentShader:vt.sprite_frag},background:{uniforms:{uvTransform:{value:new mt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:vt.background_vert,fragmentShader:vt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new mt}},vertexShader:vt.backgroundCube_vert,fragmentShader:vt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:vt.cube_vert,fragmentShader:vt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:vt.equirect_vert,fragmentShader:vt.equirect_frag},distanceRGBA:{uniforms:In([Ue.common,Ue.displacementmap,{referencePosition:{value:new Y},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:vt.distanceRGBA_vert,fragmentShader:vt.distanceRGBA_frag},shadow:{uniforms:In([Ue.lights,Ue.fog,{color:{value:new rt(0)},opacity:{value:1}}]),vertexShader:vt.shadow_vert,fragmentShader:vt.shadow_frag}};Di.physical={uniforms:In([Di.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new mt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new mt},clearcoatNormalScale:{value:new ot(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new mt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new mt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new mt},sheen:{value:0},sheenColor:{value:new rt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new mt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new mt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new mt},transmissionSamplerSize:{value:new ot},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new mt},attenuationDistance:{value:0},attenuationColor:{value:new rt(0)},specularColor:{value:new rt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new mt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new mt},anisotropyVector:{value:new ot},anisotropyMap:{value:null},anisotropyMapTransform:{value:new mt}}]),vertexShader:vt.meshphysical_vert,fragmentShader:vt.meshphysical_frag};const dc={r:0,b:0,g:0},hs=new Fi,cT=new pt;function uT(o,e,t,i,s,a,c){const u=new rt(0);let h=a===!0?0:1,f,m,g=null,_=0,y=null;function M(L){let b=L.isScene===!0?L.background:null;return b&&b.isTexture&&(b=(L.backgroundBlurriness>0?t:e).get(b)),b}function E(L){let b=!1;const V=M(L);V===null?x(u,h):V&&V.isColor&&(x(V,1),b=!0);const k=o.xr.getEnvironmentBlendMode();k==="additive"?i.buffers.color.setClear(0,0,0,1,c):k==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,c),(o.autoClear||b)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),o.clear(o.autoClearColor,o.autoClearDepth,o.autoClearStencil))}function S(L,b){const V=M(b);V&&(V.isCubeTexture||V.mapping===bc)?(m===void 0&&(m=new Ht(new bo(1,1,1),new jr({name:"BackgroundCubeMaterial",uniforms:To(Di.backgroundCube.uniforms),vertexShader:Di.backgroundCube.vertexShader,fragmentShader:Di.backgroundCube.fragmentShader,side:Fn,depthTest:!1,depthWrite:!1,fog:!1})),m.geometry.deleteAttribute("normal"),m.geometry.deleteAttribute("uv"),m.onBeforeRender=function(k,F,X){this.matrixWorld.copyPosition(X.matrixWorld)},Object.defineProperty(m.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(m)),hs.copy(b.backgroundRotation),hs.x*=-1,hs.y*=-1,hs.z*=-1,V.isCubeTexture&&V.isRenderTargetTexture===!1&&(hs.y*=-1,hs.z*=-1),m.material.uniforms.envMap.value=V,m.material.uniforms.flipEnvMap.value=V.isCubeTexture&&V.isRenderTargetTexture===!1?-1:1,m.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,m.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,m.material.uniforms.backgroundRotation.value.setFromMatrix4(cT.makeRotationFromEuler(hs)),m.material.toneMapped=At.getTransfer(V.colorSpace)!==zt,(g!==V||_!==V.version||y!==o.toneMapping)&&(m.material.needsUpdate=!0,g=V,_=V.version,y=o.toneMapping),m.layers.enableAll(),L.unshift(m,m.geometry,m.material,0,0,null)):V&&V.isTexture&&(f===void 0&&(f=new Ht(new Pc(2,2),new jr({name:"BackgroundMaterial",uniforms:To(Di.background.uniforms),vertexShader:Di.background.vertexShader,fragmentShader:Di.background.fragmentShader,side:lr,depthTest:!1,depthWrite:!1,fog:!1})),f.geometry.deleteAttribute("normal"),Object.defineProperty(f.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(f)),f.material.uniforms.t2D.value=V,f.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,f.material.toneMapped=At.getTransfer(V.colorSpace)!==zt,V.matrixAutoUpdate===!0&&V.updateMatrix(),f.material.uniforms.uvTransform.value.copy(V.matrix),(g!==V||_!==V.version||y!==o.toneMapping)&&(f.material.needsUpdate=!0,g=V,_=V.version,y=o.toneMapping),f.layers.enableAll(),L.unshift(f,f.geometry,f.material,0,0,null))}function x(L,b){L.getRGB(dc,X_(o)),i.buffers.color.setClear(dc.r,dc.g,dc.b,b,c)}function D(){m!==void 0&&(m.geometry.dispose(),m.material.dispose()),f!==void 0&&(f.geometry.dispose(),f.material.dispose())}return{getClearColor:function(){return u},setClearColor:function(L,b=1){u.set(L),h=b,x(u,h)},getClearAlpha:function(){return h},setClearAlpha:function(L){h=L,x(u,h)},render:E,addToRenderList:S,dispose:D}}function dT(o,e){const t=o.getParameter(o.MAX_VERTEX_ATTRIBS),i={},s=_(null);let a=s,c=!1;function u(R,H,J,K,fe){let ue=!1;const ce=g(K,J,H);a!==ce&&(a=ce,f(a.object)),ue=y(R,K,J,fe),ue&&M(R,K,J,fe),fe!==null&&e.update(fe,o.ELEMENT_ARRAY_BUFFER),(ue||c)&&(c=!1,b(R,H,J,K),fe!==null&&o.bindBuffer(o.ELEMENT_ARRAY_BUFFER,e.get(fe).buffer))}function h(){return o.createVertexArray()}function f(R){return o.bindVertexArray(R)}function m(R){return o.deleteVertexArray(R)}function g(R,H,J){const K=J.wireframe===!0;let fe=i[R.id];fe===void 0&&(fe={},i[R.id]=fe);let ue=fe[H.id];ue===void 0&&(ue={},fe[H.id]=ue);let ce=ue[K];return ce===void 0&&(ce=_(h()),ue[K]=ce),ce}function _(R){const H=[],J=[],K=[];for(let fe=0;fe<t;fe++)H[fe]=0,J[fe]=0,K[fe]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:H,enabledAttributes:J,attributeDivisors:K,object:R,attributes:{},index:null}}function y(R,H,J,K){const fe=a.attributes,ue=H.attributes;let ce=0;const de=J.getAttributes();for(const O in de)if(de[O].location>=0){const oe=fe[O];let U=ue[O];if(U===void 0&&(O==="instanceMatrix"&&R.instanceMatrix&&(U=R.instanceMatrix),O==="instanceColor"&&R.instanceColor&&(U=R.instanceColor)),oe===void 0||oe.attribute!==U||U&&oe.data!==U.data)return!0;ce++}return a.attributesNum!==ce||a.index!==K}function M(R,H,J,K){const fe={},ue=H.attributes;let ce=0;const de=J.getAttributes();for(const O in de)if(de[O].location>=0){let oe=ue[O];oe===void 0&&(O==="instanceMatrix"&&R.instanceMatrix&&(oe=R.instanceMatrix),O==="instanceColor"&&R.instanceColor&&(oe=R.instanceColor));const U={};U.attribute=oe,oe&&oe.data&&(U.data=oe.data),fe[O]=U,ce++}a.attributes=fe,a.attributesNum=ce,a.index=K}function E(){const R=a.newAttributes;for(let H=0,J=R.length;H<J;H++)R[H]=0}function S(R){x(R,0)}function x(R,H){const J=a.newAttributes,K=a.enabledAttributes,fe=a.attributeDivisors;J[R]=1,K[R]===0&&(o.enableVertexAttribArray(R),K[R]=1),fe[R]!==H&&(o.vertexAttribDivisor(R,H),fe[R]=H)}function D(){const R=a.newAttributes,H=a.enabledAttributes;for(let J=0,K=H.length;J<K;J++)H[J]!==R[J]&&(o.disableVertexAttribArray(J),H[J]=0)}function L(R,H,J,K,fe,ue,ce){ce===!0?o.vertexAttribIPointer(R,H,J,fe,ue):o.vertexAttribPointer(R,H,J,K,fe,ue)}function b(R,H,J,K){E();const fe=K.attributes,ue=J.getAttributes(),ce=H.defaultAttributeValues;for(const de in ue){const O=ue[de];if(O.location>=0){let le=fe[de];if(le===void 0&&(de==="instanceMatrix"&&R.instanceMatrix&&(le=R.instanceMatrix),de==="instanceColor"&&R.instanceColor&&(le=R.instanceColor)),le!==void 0){const oe=le.normalized,U=le.itemSize,ne=e.get(le);if(ne===void 0)continue;const Le=ne.buffer,Q=ne.type,he=ne.bytesPerElement,ge=Q===o.INT||Q===o.UNSIGNED_INT||le.gpuType===Xh;if(le.isInterleavedBufferAttribute){const pe=le.data,Re=pe.stride,Pe=le.offset;if(pe.isInstancedInterleavedBuffer){for(let Oe=0;Oe<O.locationSize;Oe++)x(O.location+Oe,pe.meshPerAttribute);R.isInstancedMesh!==!0&&K._maxInstanceCount===void 0&&(K._maxInstanceCount=pe.meshPerAttribute*pe.count)}else for(let Oe=0;Oe<O.locationSize;Oe++)S(O.location+Oe);o.bindBuffer(o.ARRAY_BUFFER,Le);for(let Oe=0;Oe<O.locationSize;Oe++)L(O.location+Oe,U/O.locationSize,Q,oe,Re*he,(Pe+U/O.locationSize*Oe)*he,ge)}else{if(le.isInstancedBufferAttribute){for(let pe=0;pe<O.locationSize;pe++)x(O.location+pe,le.meshPerAttribute);R.isInstancedMesh!==!0&&K._maxInstanceCount===void 0&&(K._maxInstanceCount=le.meshPerAttribute*le.count)}else for(let pe=0;pe<O.locationSize;pe++)S(O.location+pe);o.bindBuffer(o.ARRAY_BUFFER,Le);for(let pe=0;pe<O.locationSize;pe++)L(O.location+pe,U/O.locationSize,Q,oe,U*he,U/O.locationSize*pe*he,ge)}}else if(ce!==void 0){const oe=ce[de];if(oe!==void 0)switch(oe.length){case 2:o.vertexAttrib2fv(O.location,oe);break;case 3:o.vertexAttrib3fv(O.location,oe);break;case 4:o.vertexAttrib4fv(O.location,oe);break;default:o.vertexAttrib1fv(O.location,oe)}}}}D()}function V(){X();for(const R in i){const H=i[R];for(const J in H){const K=H[J];for(const fe in K)m(K[fe].object),delete K[fe];delete H[J]}delete i[R]}}function k(R){if(i[R.id]===void 0)return;const H=i[R.id];for(const J in H){const K=H[J];for(const fe in K)m(K[fe].object),delete K[fe];delete H[J]}delete i[R.id]}function F(R){for(const H in i){const J=i[H];if(J[R.id]===void 0)continue;const K=J[R.id];for(const fe in K)m(K[fe].object),delete K[fe];delete J[R.id]}}function X(){C(),c=!0,a!==s&&(a=s,f(a.object))}function C(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:u,reset:X,resetDefaultState:C,dispose:V,releaseStatesOfGeometry:k,releaseStatesOfProgram:F,initAttributes:E,enableAttribute:S,disableUnusedAttributes:D}}function hT(o,e,t){let i;function s(f){i=f}function a(f,m){o.drawArrays(i,f,m),t.update(m,i,1)}function c(f,m,g){g!==0&&(o.drawArraysInstanced(i,f,m,g),t.update(m,i,g))}function u(f,m,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,f,0,m,0,g);let y=0;for(let M=0;M<g;M++)y+=m[M];t.update(y,i,1)}function h(f,m,g,_){if(g===0)return;const y=e.get("WEBGL_multi_draw");if(y===null)for(let M=0;M<f.length;M++)c(f[M],m[M],_[M]);else{y.multiDrawArraysInstancedWEBGL(i,f,0,m,0,_,0,g);let M=0;for(let E=0;E<g;E++)M+=m[E]*_[E];t.update(M,i,1)}}this.setMode=s,this.render=a,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function fT(o,e,t,i){let s;function a(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const F=e.get("EXT_texture_filter_anisotropic");s=o.getParameter(F.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function c(F){return!(F!==ci&&i.convert(F)!==o.getParameter(o.IMPLEMENTATION_COLOR_READ_FORMAT))}function u(F){const X=F===Pa&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(F!==cr&&i.convert(F)!==o.getParameter(o.IMPLEMENTATION_COLOR_READ_TYPE)&&F!==Ei&&!X)}function h(F){if(F==="highp"){if(o.getShaderPrecisionFormat(o.VERTEX_SHADER,o.HIGH_FLOAT).precision>0&&o.getShaderPrecisionFormat(o.FRAGMENT_SHADER,o.HIGH_FLOAT).precision>0)return"highp";F="mediump"}return F==="mediump"&&o.getShaderPrecisionFormat(o.VERTEX_SHADER,o.MEDIUM_FLOAT).precision>0&&o.getShaderPrecisionFormat(o.FRAGMENT_SHADER,o.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let f=t.precision!==void 0?t.precision:"highp";const m=h(f);m!==f&&(console.warn("THREE.WebGLRenderer:",f,"not supported, using",m,"instead."),f=m);const g=t.logarithmicDepthBuffer===!0,_=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),y=o.getParameter(o.MAX_TEXTURE_IMAGE_UNITS),M=o.getParameter(o.MAX_VERTEX_TEXTURE_IMAGE_UNITS),E=o.getParameter(o.MAX_TEXTURE_SIZE),S=o.getParameter(o.MAX_CUBE_MAP_TEXTURE_SIZE),x=o.getParameter(o.MAX_VERTEX_ATTRIBS),D=o.getParameter(o.MAX_VERTEX_UNIFORM_VECTORS),L=o.getParameter(o.MAX_VARYING_VECTORS),b=o.getParameter(o.MAX_FRAGMENT_UNIFORM_VECTORS),V=M>0,k=o.getParameter(o.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:h,textureFormatReadable:c,textureTypeReadable:u,precision:f,logarithmicDepthBuffer:g,reverseDepthBuffer:_,maxTextures:y,maxVertexTextures:M,maxTextureSize:E,maxCubemapSize:S,maxAttributes:x,maxVertexUniforms:D,maxVaryings:L,maxFragmentUniforms:b,vertexTextures:V,maxSamples:k}}function pT(o){const e=this;let t=null,i=0,s=!1,a=!1;const c=new kr,u=new mt,h={value:null,needsUpdate:!1};this.uniform=h,this.numPlanes=0,this.numIntersection=0,this.init=function(g,_){const y=g.length!==0||_||i!==0||s;return s=_,i=g.length,y},this.beginShadows=function(){a=!0,m(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(g,_){t=m(g,_,0)},this.setState=function(g,_,y){const M=g.clippingPlanes,E=g.clipIntersection,S=g.clipShadows,x=o.get(g);if(!s||M===null||M.length===0||a&&!S)a?m(null):f();else{const D=a?0:i,L=D*4;let b=x.clippingState||null;h.value=b,b=m(M,_,L,y);for(let V=0;V!==L;++V)b[V]=t[V];x.clippingState=b,this.numIntersection=E?this.numPlanes:0,this.numPlanes+=D}};function f(){h.value!==t&&(h.value=t,h.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function m(g,_,y,M){const E=g!==null?g.length:0;let S=null;if(E!==0){if(S=h.value,M!==!0||S===null){const x=y+E*4,D=_.matrixWorldInverse;u.getNormalMatrix(D),(S===null||S.length<x)&&(S=new Float32Array(x));for(let L=0,b=y;L!==E;++L,b+=4)c.copy(g[L]).applyMatrix4(D,u),c.normal.toArray(S,b),S[b+3]=c.constant}h.value=S,h.needsUpdate=!0}return e.numPlanes=E,e.numIntersection=0,S}}function mT(o){let e=new WeakMap;function t(c,u){return u===lh?c.mapping=vo:u===ch&&(c.mapping=xo),c}function i(c){if(c&&c.isTexture){const u=c.mapping;if(u===lh||u===ch)if(e.has(c)){const h=e.get(c).texture;return t(h,c.mapping)}else{const h=c.image;if(h&&h.height>0){const f=new Uy(h.height);return f.fromEquirectangularTexture(o,c),e.set(c,f),c.addEventListener("dispose",s),t(f.texture,c.mapping)}else return null}}return c}function s(c){const u=c.target;u.removeEventListener("dispose",s);const h=e.get(u);h!==void 0&&(e.delete(u),h.dispose())}function a(){e=new WeakMap}return{get:i,dispose:a}}const uo=4,Gg=[.125,.215,.35,.446,.526,.582],_s=20,Vd=new hf,Wg=new rt;let Gd=null,Wd=0,jd=0,Xd=!1;const ms=(1+Math.sqrt(5))/2,oo=1/ms,jg=[new Y(-ms,oo,0),new Y(ms,oo,0),new Y(-oo,0,ms),new Y(oo,0,ms),new Y(0,ms,-oo),new Y(0,ms,oo),new Y(-1,1,-1),new Y(1,1,-1),new Y(-1,1,1),new Y(1,1,1)];class zh{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,s=100){Gd=this._renderer.getRenderTarget(),Wd=this._renderer.getActiveCubeFace(),jd=this._renderer.getActiveMipmapLevel(),Xd=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const a=this._allocateTargets();return a.depthBuffer=!0,this._sceneToCubeUV(e,i,s,a),t>0&&this._blur(a,0,0,t),this._applyPMREM(a),this._cleanup(a),a}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=qg(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Yg(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Gd,Wd,jd),this._renderer.xr.enabled=Xd,e.scissorTest=!1,hc(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===vo||e.mapping===xo?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Gd=this._renderer.getRenderTarget(),Wd=this._renderer.getActiveCubeFace(),jd=this._renderer.getActiveMipmapLevel(),Xd=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:ei,minFilter:ei,generateMipmaps:!1,type:Pa,format:ci,colorSpace:Bn,depthBuffer:!1},s=Xg(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Xg(e,t,i);const{_lodMax:a}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=gT(a)),this._blurMaterial=_T(a,e,t)}return s}_compileMaterial(e){const t=new Ht(this._lodPlanes[0],e);this._renderer.compile(t,Vd)}_sceneToCubeUV(e,t,i,s){const u=new Un(90,1,t,i),h=[1,-1,1,1,1,1],f=[1,1,1,-1,-1,-1],m=this._renderer,g=m.autoClear,_=m.toneMapping;m.getClearColor(Wg),m.toneMapping=Wr,m.autoClear=!1;const y=new Ii({name:"PMREM.Background",side:Fn,depthWrite:!1,depthTest:!1}),M=new Ht(new bo,y);let E=!1;const S=e.background;S?S.isColor&&(y.color.copy(S),e.background=null,E=!0):(y.color.copy(Wg),E=!0);for(let x=0;x<6;x++){const D=x%3;D===0?(u.up.set(0,h[x],0),u.lookAt(f[x],0,0)):D===1?(u.up.set(0,0,h[x]),u.lookAt(0,f[x],0)):(u.up.set(0,h[x],0),u.lookAt(0,0,f[x]));const L=this._cubeSize;hc(s,D*L,x>2?L:0,L,L),m.setRenderTarget(s),E&&m.render(M,u),m.render(e,u)}M.geometry.dispose(),M.material.dispose(),m.toneMapping=_,m.autoClear=g,e.background=S}_textureToCubeUV(e,t){const i=this._renderer,s=e.mapping===vo||e.mapping===xo;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=qg()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Yg());const a=s?this._cubemapMaterial:this._equirectMaterial,c=new Ht(this._lodPlanes[0],a),u=a.uniforms;u.envMap.value=e;const h=this._cubeSize;hc(t,0,0,3*h,2*h),i.setRenderTarget(t),i.render(c,Vd)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const s=this._lodPlanes.length;for(let a=1;a<s;a++){const c=Math.sqrt(this._sigmas[a]*this._sigmas[a]-this._sigmas[a-1]*this._sigmas[a-1]),u=jg[(s-a-1)%jg.length];this._blur(e,a-1,a,c,u)}t.autoClear=i}_blur(e,t,i,s,a){const c=this._pingPongRenderTarget;this._halfBlur(e,c,t,i,s,"latitudinal",a),this._halfBlur(c,e,i,i,s,"longitudinal",a)}_halfBlur(e,t,i,s,a,c,u){const h=this._renderer,f=this._blurMaterial;c!=="latitudinal"&&c!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const m=3,g=new Ht(this._lodPlanes[s],f),_=f.uniforms,y=this._sizeLods[i]-1,M=isFinite(a)?Math.PI/(2*y):2*Math.PI/(2*_s-1),E=a/M,S=isFinite(a)?1+Math.floor(m*E):_s;S>_s&&console.warn(`sigmaRadians, ${a}, is too large and will clip, as it requested ${S} samples when the maximum is set to ${_s}`);const x=[];let D=0;for(let F=0;F<_s;++F){const X=F/E,C=Math.exp(-X*X/2);x.push(C),F===0?D+=C:F<S&&(D+=2*C)}for(let F=0;F<x.length;F++)x[F]=x[F]/D;_.envMap.value=e.texture,_.samples.value=S,_.weights.value=x,_.latitudinal.value=c==="latitudinal",u&&(_.poleAxis.value=u);const{_lodMax:L}=this;_.dTheta.value=M,_.mipInt.value=L-i;const b=this._sizeLods[s],V=3*b*(s>L-uo?s-L+uo:0),k=4*(this._cubeSize-b);hc(t,V,k,3*b,2*b),h.setRenderTarget(t),h.render(g,Vd)}}function gT(o){const e=[],t=[],i=[];let s=o;const a=o-uo+1+Gg.length;for(let c=0;c<a;c++){const u=Math.pow(2,s);t.push(u);let h=1/u;c>o-uo?h=Gg[c-o+uo-1]:c===0&&(h=0),i.push(h);const f=1/(u-2),m=-f,g=1+f,_=[m,m,g,m,g,g,m,m,g,g,m,g],y=6,M=6,E=3,S=2,x=1,D=new Float32Array(E*M*y),L=new Float32Array(S*M*y),b=new Float32Array(x*M*y);for(let k=0;k<y;k++){const F=k%3*2/3-1,X=k>2?0:-1,C=[F,X,0,F+2/3,X,0,F+2/3,X+1,0,F,X,0,F+2/3,X+1,0,F,X+1,0];D.set(C,E*M*k),L.set(_,S*M*k);const R=[k,k,k,k,k,k];b.set(R,x*M*k)}const V=new Yn;V.setAttribute("position",new kn(D,E)),V.setAttribute("uv",new kn(L,S)),V.setAttribute("faceIndex",new kn(b,x)),e.push(V),s>uo&&s--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function Xg(o,e,t){const i=new xs(o,e,t);return i.texture.mapping=bc,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function hc(o,e,t,i,s){o.viewport.set(e,t,i,s),o.scissor.set(e,t,i,s)}function _T(o,e,t){const i=new Float32Array(_s),s=new Y(0,1,0);return new jr({name:"SphericalGaussianBlur",defines:{n:_s,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${o}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:mf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Gr,depthTest:!1,depthWrite:!1})}function Yg(){return new jr({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:mf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Gr,depthTest:!1,depthWrite:!1})}function qg(){return new jr({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:mf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Gr,depthTest:!1,depthWrite:!1})}function mf(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function vT(o){let e=new WeakMap,t=null;function i(u){if(u&&u.isTexture){const h=u.mapping,f=h===lh||h===ch,m=h===vo||h===xo;if(f||m){let g=e.get(u);const _=g!==void 0?g.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==_)return t===null&&(t=new zh(o)),g=f?t.fromEquirectangular(u,g):t.fromCubemap(u,g),g.texture.pmremVersion=u.pmremVersion,e.set(u,g),g.texture;if(g!==void 0)return g.texture;{const y=u.image;return f&&y&&y.height>0||m&&y&&s(y)?(t===null&&(t=new zh(o)),g=f?t.fromEquirectangular(u):t.fromCubemap(u),g.texture.pmremVersion=u.pmremVersion,e.set(u,g),u.addEventListener("dispose",a),g.texture):null}}}return u}function s(u){let h=0;const f=6;for(let m=0;m<f;m++)u[m]!==void 0&&h++;return h===f}function a(u){const h=u.target;h.removeEventListener("dispose",a);const f=e.get(h);f!==void 0&&(e.delete(h),f.dispose())}function c(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:c}}function xT(o){const e={};function t(i){if(e[i]!==void 0)return e[i];let s;switch(i){case"WEBGL_depth_texture":s=o.getExtension("WEBGL_depth_texture")||o.getExtension("MOZ_WEBGL_depth_texture")||o.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=o.getExtension("EXT_texture_filter_anisotropic")||o.getExtension("MOZ_EXT_texture_filter_anisotropic")||o.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=o.getExtension("WEBGL_compressed_texture_s3tc")||o.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||o.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=o.getExtension("WEBGL_compressed_texture_pvrtc")||o.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=o.getExtension(i)}return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&lo("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function yT(o,e,t,i){const s={},a=new WeakMap;function c(g){const _=g.target;_.index!==null&&e.remove(_.index);for(const M in _.attributes)e.remove(_.attributes[M]);_.removeEventListener("dispose",c),delete s[_.id];const y=a.get(_);y&&(e.remove(y),a.delete(_)),i.releaseStatesOfGeometry(_),_.isInstancedBufferGeometry===!0&&delete _._maxInstanceCount,t.memory.geometries--}function u(g,_){return s[_.id]===!0||(_.addEventListener("dispose",c),s[_.id]=!0,t.memory.geometries++),_}function h(g){const _=g.attributes;for(const y in _)e.update(_[y],o.ARRAY_BUFFER)}function f(g){const _=[],y=g.index,M=g.attributes.position;let E=0;if(y!==null){const D=y.array;E=y.version;for(let L=0,b=D.length;L<b;L+=3){const V=D[L+0],k=D[L+1],F=D[L+2];_.push(V,k,k,F,F,V)}}else if(M!==void 0){const D=M.array;E=M.version;for(let L=0,b=D.length/3-1;L<b;L+=3){const V=L+0,k=L+1,F=L+2;_.push(V,k,k,F,F,V)}}else return;const S=new(B_(_)?j_:W_)(_,1);S.version=E;const x=a.get(g);x&&e.remove(x),a.set(g,S)}function m(g){const _=a.get(g);if(_){const y=g.index;y!==null&&_.version<y.version&&f(g)}else f(g);return a.get(g)}return{get:u,update:h,getWireframeAttribute:m}}function ST(o,e,t){let i;function s(_){i=_}let a,c;function u(_){a=_.type,c=_.bytesPerElement}function h(_,y){o.drawElements(i,y,a,_*c),t.update(y,i,1)}function f(_,y,M){M!==0&&(o.drawElementsInstanced(i,y,a,_*c,M),t.update(y,i,M))}function m(_,y,M){if(M===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,y,0,a,_,0,M);let S=0;for(let x=0;x<M;x++)S+=y[x];t.update(S,i,1)}function g(_,y,M,E){if(M===0)return;const S=e.get("WEBGL_multi_draw");if(S===null)for(let x=0;x<_.length;x++)f(_[x]/c,y[x],E[x]);else{S.multiDrawElementsInstancedWEBGL(i,y,0,a,_,0,E,0,M);let x=0;for(let D=0;D<M;D++)x+=y[D]*E[D];t.update(x,i,1)}}this.setMode=s,this.setIndex=u,this.render=h,this.renderInstances=f,this.renderMultiDraw=m,this.renderMultiDrawInstances=g}function MT(o){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(a,c,u){switch(t.calls++,c){case o.TRIANGLES:t.triangles+=u*(a/3);break;case o.LINES:t.lines+=u*(a/2);break;case o.LINE_STRIP:t.lines+=u*(a-1);break;case o.LINE_LOOP:t.lines+=u*a;break;case o.POINTS:t.points+=u*a;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",c);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function ET(o,e,t){const i=new WeakMap,s=new It;function a(c,u,h){const f=c.morphTargetInfluences,m=u.morphAttributes.position||u.morphAttributes.normal||u.morphAttributes.color,g=m!==void 0?m.length:0;let _=i.get(u);if(_===void 0||_.count!==g){let R=function(){X.dispose(),i.delete(u),u.removeEventListener("dispose",R)};var y=R;_!==void 0&&_.texture.dispose();const M=u.morphAttributes.position!==void 0,E=u.morphAttributes.normal!==void 0,S=u.morphAttributes.color!==void 0,x=u.morphAttributes.position||[],D=u.morphAttributes.normal||[],L=u.morphAttributes.color||[];let b=0;M===!0&&(b=1),E===!0&&(b=2),S===!0&&(b=3);let V=u.attributes.position.count*b,k=1;V>e.maxTextureSize&&(k=Math.ceil(V/e.maxTextureSize),V=e.maxTextureSize);const F=new Float32Array(V*k*4*g),X=new H_(F,V,k,g);X.type=Ei,X.needsUpdate=!0;const C=b*4;for(let H=0;H<g;H++){const J=x[H],K=D[H],fe=L[H],ue=V*k*4*H;for(let ce=0;ce<J.count;ce++){const de=ce*C;M===!0&&(s.fromBufferAttribute(J,ce),F[ue+de+0]=s.x,F[ue+de+1]=s.y,F[ue+de+2]=s.z,F[ue+de+3]=0),E===!0&&(s.fromBufferAttribute(K,ce),F[ue+de+4]=s.x,F[ue+de+5]=s.y,F[ue+de+6]=s.z,F[ue+de+7]=0),S===!0&&(s.fromBufferAttribute(fe,ce),F[ue+de+8]=s.x,F[ue+de+9]=s.y,F[ue+de+10]=s.z,F[ue+de+11]=fe.itemSize===4?s.w:1)}}_={count:g,texture:X,size:new ot(V,k)},i.set(u,_),u.addEventListener("dispose",R)}if(c.isInstancedMesh===!0&&c.morphTexture!==null)h.getUniforms().setValue(o,"morphTexture",c.morphTexture,t);else{let M=0;for(let S=0;S<f.length;S++)M+=f[S];const E=u.morphTargetsRelative?1:1-M;h.getUniforms().setValue(o,"morphTargetBaseInfluence",E),h.getUniforms().setValue(o,"morphTargetInfluences",f)}h.getUniforms().setValue(o,"morphTargetsTexture",_.texture,t),h.getUniforms().setValue(o,"morphTargetsTextureSize",_.size)}return{update:a}}function TT(o,e,t,i){let s=new WeakMap;function a(h){const f=i.render.frame,m=h.geometry,g=e.get(h,m);if(s.get(g)!==f&&(e.update(g),s.set(g,f)),h.isInstancedMesh&&(h.hasEventListener("dispose",u)===!1&&h.addEventListener("dispose",u),s.get(h)!==f&&(t.update(h.instanceMatrix,o.ARRAY_BUFFER),h.instanceColor!==null&&t.update(h.instanceColor,o.ARRAY_BUFFER),s.set(h,f))),h.isSkinnedMesh){const _=h.skeleton;s.get(_)!==f&&(_.update(),s.set(_,f))}return g}function c(){s=new WeakMap}function u(h){const f=h.target;f.removeEventListener("dispose",u),t.remove(f.instanceMatrix),f.instanceColor!==null&&t.remove(f.instanceColor)}return{update:a,dispose:c}}const ov=new _n,Kg=new J_(1,1),av=new H_,lv=new xy,cv=new q_,$g=[],Zg=[],Qg=new Float32Array(16),Jg=new Float32Array(9),e_=new Float32Array(4);function No(o,e,t){const i=o[0];if(i<=0||i>0)return o;const s=e*t;let a=$g[s];if(a===void 0&&(a=new Float32Array(s),$g[s]=a),e!==0){i.toArray(a,0);for(let c=1,u=0;c!==e;++c)u+=t,o[c].toArray(a,u)}return a}function un(o,e){if(o.length!==e.length)return!1;for(let t=0,i=o.length;t<i;t++)if(o[t]!==e[t])return!1;return!0}function dn(o,e){for(let t=0,i=e.length;t<i;t++)o[t]=e[t]}function Lc(o,e){let t=Zg[e];t===void 0&&(t=new Int32Array(e),Zg[e]=t);for(let i=0;i!==e;++i)t[i]=o.allocateTextureUnit();return t}function wT(o,e){const t=this.cache;t[0]!==e&&(o.uniform1f(this.addr,e),t[0]=e)}function AT(o,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(o.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(un(t,e))return;o.uniform2fv(this.addr,e),dn(t,e)}}function RT(o,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(o.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(o.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(un(t,e))return;o.uniform3fv(this.addr,e),dn(t,e)}}function bT(o,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(o.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(un(t,e))return;o.uniform4fv(this.addr,e),dn(t,e)}}function CT(o,e){const t=this.cache,i=e.elements;if(i===void 0){if(un(t,e))return;o.uniformMatrix2fv(this.addr,!1,e),dn(t,e)}else{if(un(t,i))return;e_.set(i),o.uniformMatrix2fv(this.addr,!1,e_),dn(t,i)}}function PT(o,e){const t=this.cache,i=e.elements;if(i===void 0){if(un(t,e))return;o.uniformMatrix3fv(this.addr,!1,e),dn(t,e)}else{if(un(t,i))return;Jg.set(i),o.uniformMatrix3fv(this.addr,!1,Jg),dn(t,i)}}function LT(o,e){const t=this.cache,i=e.elements;if(i===void 0){if(un(t,e))return;o.uniformMatrix4fv(this.addr,!1,e),dn(t,e)}else{if(un(t,i))return;Qg.set(i),o.uniformMatrix4fv(this.addr,!1,Qg),dn(t,i)}}function NT(o,e){const t=this.cache;t[0]!==e&&(o.uniform1i(this.addr,e),t[0]=e)}function DT(o,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(o.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(un(t,e))return;o.uniform2iv(this.addr,e),dn(t,e)}}function IT(o,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(o.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(un(t,e))return;o.uniform3iv(this.addr,e),dn(t,e)}}function UT(o,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(o.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(un(t,e))return;o.uniform4iv(this.addr,e),dn(t,e)}}function FT(o,e){const t=this.cache;t[0]!==e&&(o.uniform1ui(this.addr,e),t[0]=e)}function OT(o,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(o.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(un(t,e))return;o.uniform2uiv(this.addr,e),dn(t,e)}}function kT(o,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(o.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(un(t,e))return;o.uniform3uiv(this.addr,e),dn(t,e)}}function BT(o,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(o.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(un(t,e))return;o.uniform4uiv(this.addr,e),dn(t,e)}}function zT(o,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(o.uniform1i(this.addr,s),i[0]=s);let a;this.type===o.SAMPLER_2D_SHADOW?(Kg.compareFunction=O_,a=Kg):a=ov,t.setTexture2D(e||a,s)}function HT(o,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(o.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||lv,s)}function VT(o,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(o.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||cv,s)}function GT(o,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(o.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||av,s)}function WT(o){switch(o){case 5126:return wT;case 35664:return AT;case 35665:return RT;case 35666:return bT;case 35674:return CT;case 35675:return PT;case 35676:return LT;case 5124:case 35670:return NT;case 35667:case 35671:return DT;case 35668:case 35672:return IT;case 35669:case 35673:return UT;case 5125:return FT;case 36294:return OT;case 36295:return kT;case 36296:return BT;case 35678:case 36198:case 36298:case 36306:case 35682:return zT;case 35679:case 36299:case 36307:return HT;case 35680:case 36300:case 36308:case 36293:return VT;case 36289:case 36303:case 36311:case 36292:return GT}}function jT(o,e){o.uniform1fv(this.addr,e)}function XT(o,e){const t=No(e,this.size,2);o.uniform2fv(this.addr,t)}function YT(o,e){const t=No(e,this.size,3);o.uniform3fv(this.addr,t)}function qT(o,e){const t=No(e,this.size,4);o.uniform4fv(this.addr,t)}function KT(o,e){const t=No(e,this.size,4);o.uniformMatrix2fv(this.addr,!1,t)}function $T(o,e){const t=No(e,this.size,9);o.uniformMatrix3fv(this.addr,!1,t)}function ZT(o,e){const t=No(e,this.size,16);o.uniformMatrix4fv(this.addr,!1,t)}function QT(o,e){o.uniform1iv(this.addr,e)}function JT(o,e){o.uniform2iv(this.addr,e)}function ew(o,e){o.uniform3iv(this.addr,e)}function tw(o,e){o.uniform4iv(this.addr,e)}function nw(o,e){o.uniform1uiv(this.addr,e)}function iw(o,e){o.uniform2uiv(this.addr,e)}function rw(o,e){o.uniform3uiv(this.addr,e)}function sw(o,e){o.uniform4uiv(this.addr,e)}function ow(o,e,t){const i=this.cache,s=e.length,a=Lc(t,s);un(i,a)||(o.uniform1iv(this.addr,a),dn(i,a));for(let c=0;c!==s;++c)t.setTexture2D(e[c]||ov,a[c])}function aw(o,e,t){const i=this.cache,s=e.length,a=Lc(t,s);un(i,a)||(o.uniform1iv(this.addr,a),dn(i,a));for(let c=0;c!==s;++c)t.setTexture3D(e[c]||lv,a[c])}function lw(o,e,t){const i=this.cache,s=e.length,a=Lc(t,s);un(i,a)||(o.uniform1iv(this.addr,a),dn(i,a));for(let c=0;c!==s;++c)t.setTextureCube(e[c]||cv,a[c])}function cw(o,e,t){const i=this.cache,s=e.length,a=Lc(t,s);un(i,a)||(o.uniform1iv(this.addr,a),dn(i,a));for(let c=0;c!==s;++c)t.setTexture2DArray(e[c]||av,a[c])}function uw(o){switch(o){case 5126:return jT;case 35664:return XT;case 35665:return YT;case 35666:return qT;case 35674:return KT;case 35675:return $T;case 35676:return ZT;case 5124:case 35670:return QT;case 35667:case 35671:return JT;case 35668:case 35672:return ew;case 35669:case 35673:return tw;case 5125:return nw;case 36294:return iw;case 36295:return rw;case 36296:return sw;case 35678:case 36198:case 36298:case 36306:case 35682:return ow;case 35679:case 36299:case 36307:return aw;case 35680:case 36300:case 36308:case 36293:return lw;case 36289:case 36303:case 36311:case 36292:return cw}}class dw{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=WT(t.type)}}class hw{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=uw(t.type)}}class fw{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let a=0,c=s.length;a!==c;++a){const u=s[a];u.setValue(e,t[u.id],i)}}}const Yd=/(\w+)(\])?(\[|\.)?/g;function t_(o,e){o.seq.push(e),o.map[e.id]=e}function pw(o,e,t){const i=o.name,s=i.length;for(Yd.lastIndex=0;;){const a=Yd.exec(i),c=Yd.lastIndex;let u=a[1];const h=a[2]==="]",f=a[3];if(h&&(u=u|0),f===void 0||f==="["&&c+2===s){t_(t,f===void 0?new dw(u,o,e):new hw(u,o,e));break}else{let g=t.map[u];g===void 0&&(g=new fw(u),t_(t,g)),t=g}}}class Mc{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const a=e.getActiveUniform(t,s),c=e.getUniformLocation(t,a.name);pw(a,c,this)}}setValue(e,t,i,s){const a=this.map[t];a!==void 0&&a.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let a=0,c=t.length;a!==c;++a){const u=t[a],h=i[u.id];h.needsUpdate!==!1&&u.setValue(e,h.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,a=e.length;s!==a;++s){const c=e[s];c.id in t&&i.push(c)}return i}}function n_(o,e,t){const i=o.createShader(e);return o.shaderSource(i,t),o.compileShader(i),i}const mw=37297;let gw=0;function _w(o,e){const t=o.split(`
`),i=[],s=Math.max(e-6,0),a=Math.min(e+6,t.length);for(let c=s;c<a;c++){const u=c+1;i.push(`${u===e?">":" "} ${u}: ${t[c]}`)}return i.join(`
`)}const i_=new mt;function vw(o){At._getMatrix(i_,At.workingColorSpace,o);const e=`mat3( ${i_.elements.map(t=>t.toFixed(4))} )`;switch(At.getTransfer(o)){case Tc:return[e,"LinearTransferOETF"];case zt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",o),[e,"LinearTransferOETF"]}}function r_(o,e,t){const i=o.getShaderParameter(e,o.COMPILE_STATUS),s=o.getShaderInfoLog(e).trim();if(i&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const c=parseInt(a[1]);return t.toUpperCase()+`

`+s+`

`+_w(o.getShaderSource(e),c)}else return s}function xw(o,e){const t=vw(e);return[`vec4 ${o}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function yw(o,e){let t;switch(e){case Cx:t="Linear";break;case Px:t="Reinhard";break;case Lx:t="Cineon";break;case T_:t="ACESFilmic";break;case Dx:t="AgX";break;case Ix:t="Neutral";break;case Nx:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+o+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const fc=new Y;function Sw(){At.getLuminanceCoefficients(fc);const o=fc.x.toFixed(4),e=fc.y.toFixed(4),t=fc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${o}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Mw(o){return[o.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",o.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ma).join(`
`)}function Ew(o){const e=[];for(const t in o){const i=o[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function Tw(o,e){const t={},i=o.getProgramParameter(e,o.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const a=o.getActiveAttrib(e,s),c=a.name;let u=1;a.type===o.FLOAT_MAT2&&(u=2),a.type===o.FLOAT_MAT3&&(u=3),a.type===o.FLOAT_MAT4&&(u=4),t[c]={type:a.type,location:o.getAttribLocation(e,c),locationSize:u}}return t}function Ma(o){return o!==""}function s_(o,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return o.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function o_(o,e){return o.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const ww=/^[ \t]*#include +<([\w\d./]+)>/gm;function Hh(o){return o.replace(ww,Rw)}const Aw=new Map;function Rw(o,e){let t=vt[e];if(t===void 0){const i=Aw.get(e);if(i!==void 0)t=vt[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Hh(t)}const bw=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function a_(o){return o.replace(bw,Cw)}function Cw(o,e,t,i){let s="";for(let a=parseInt(e);a<parseInt(t);a++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return s}function l_(o){let e=`precision ${o.precision} float;
	precision ${o.precision} int;
	precision ${o.precision} sampler2D;
	precision ${o.precision} samplerCube;
	precision ${o.precision} sampler3D;
	precision ${o.precision} sampler2DArray;
	precision ${o.precision} sampler2DShadow;
	precision ${o.precision} samplerCubeShadow;
	precision ${o.precision} sampler2DArrayShadow;
	precision ${o.precision} isampler2D;
	precision ${o.precision} isampler3D;
	precision ${o.precision} isamplerCube;
	precision ${o.precision} isampler2DArray;
	precision ${o.precision} usampler2D;
	precision ${o.precision} usampler3D;
	precision ${o.precision} usamplerCube;
	precision ${o.precision} usampler2DArray;
	`;return o.precision==="highp"?e+=`
#define HIGH_PRECISION`:o.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:o.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Pw(o){let e="SHADOWMAP_TYPE_BASIC";return o.shadowMapType===S_?e="SHADOWMAP_TYPE_PCF":o.shadowMapType===M_?e="SHADOWMAP_TYPE_PCF_SOFT":o.shadowMapType===ir&&(e="SHADOWMAP_TYPE_VSM"),e}function Lw(o){let e="ENVMAP_TYPE_CUBE";if(o.envMap)switch(o.envMapMode){case vo:case xo:e="ENVMAP_TYPE_CUBE";break;case bc:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Nw(o){let e="ENVMAP_MODE_REFLECTION";if(o.envMap)switch(o.envMapMode){case xo:e="ENVMAP_MODE_REFRACTION";break}return e}function Dw(o){let e="ENVMAP_BLENDING_NONE";if(o.envMap)switch(o.combine){case E_:e="ENVMAP_BLENDING_MULTIPLY";break;case Rx:e="ENVMAP_BLENDING_MIX";break;case bx:e="ENVMAP_BLENDING_ADD";break}return e}function Iw(o){const e=o.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function Uw(o,e,t,i){const s=o.getContext(),a=t.defines;let c=t.vertexShader,u=t.fragmentShader;const h=Pw(t),f=Lw(t),m=Nw(t),g=Dw(t),_=Iw(t),y=Mw(t),M=Ew(a),E=s.createProgram();let S,x,D=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(S=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M].filter(Ma).join(`
`),S.length>0&&(S+=`
`),x=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M].filter(Ma).join(`
`),x.length>0&&(x+=`
`)):(S=[l_(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+m:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+h:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ma).join(`
`),x=[l_(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+f:"",t.envMap?"#define "+m:"",t.envMap?"#define "+g:"",_?"#define CUBEUV_TEXEL_WIDTH "+_.texelWidth:"",_?"#define CUBEUV_TEXEL_HEIGHT "+_.texelHeight:"",_?"#define CUBEUV_MAX_MIP "+_.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+h:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Wr?"#define TONE_MAPPING":"",t.toneMapping!==Wr?vt.tonemapping_pars_fragment:"",t.toneMapping!==Wr?yw("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",vt.colorspace_pars_fragment,xw("linearToOutputTexel",t.outputColorSpace),Sw(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ma).join(`
`)),c=Hh(c),c=s_(c,t),c=o_(c,t),u=Hh(u),u=s_(u,t),u=o_(u,t),c=a_(c),u=a_(u),t.isRawShaderMaterial!==!0&&(D=`#version 300 es
`,S=[y,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+S,x=["#define varying in",t.glslVersion===ig?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===ig?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+x);const L=D+S+c,b=D+x+u,V=n_(s,s.VERTEX_SHADER,L),k=n_(s,s.FRAGMENT_SHADER,b);s.attachShader(E,V),s.attachShader(E,k),t.index0AttributeName!==void 0?s.bindAttribLocation(E,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(E,0,"position"),s.linkProgram(E);function F(H){if(o.debug.checkShaderErrors){const J=s.getProgramInfoLog(E).trim(),K=s.getShaderInfoLog(V).trim(),fe=s.getShaderInfoLog(k).trim();let ue=!0,ce=!0;if(s.getProgramParameter(E,s.LINK_STATUS)===!1)if(ue=!1,typeof o.debug.onShaderError=="function")o.debug.onShaderError(s,E,V,k);else{const de=r_(s,V,"vertex"),O=r_(s,k,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(E,s.VALIDATE_STATUS)+`

Material Name: `+H.name+`
Material Type: `+H.type+`

Program Info Log: `+J+`
`+de+`
`+O)}else J!==""?console.warn("THREE.WebGLProgram: Program Info Log:",J):(K===""||fe==="")&&(ce=!1);ce&&(H.diagnostics={runnable:ue,programLog:J,vertexShader:{log:K,prefix:S},fragmentShader:{log:fe,prefix:x}})}s.deleteShader(V),s.deleteShader(k),X=new Mc(s,E),C=Tw(s,E)}let X;this.getUniforms=function(){return X===void 0&&F(this),X};let C;this.getAttributes=function(){return C===void 0&&F(this),C};let R=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=s.getProgramParameter(E,mw)),R},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(E),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=gw++,this.cacheKey=e,this.usedTimes=1,this.program=E,this.vertexShader=V,this.fragmentShader=k,this}let Fw=0;class Ow{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),a=this._getShaderStage(i),c=this._getShaderCacheForMaterial(e);return c.has(s)===!1&&(c.add(s),s.usedTimes++),c.has(a)===!1&&(c.add(a),a.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new kw(e),t.set(e,i)),i}}class kw{constructor(e){this.id=Fw++,this.code=e,this.usedTimes=0}}function Bw(o,e,t,i,s,a,c){const u=new V_,h=new Ow,f=new Set,m=[],g=s.logarithmicDepthBuffer,_=s.vertexTextures;let y=s.precision;const M={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function E(C){return f.add(C),C===0?"uv":`uv${C}`}function S(C,R,H,J,K){const fe=J.fog,ue=K.geometry,ce=C.isMeshStandardMaterial?J.environment:null,de=(C.isMeshStandardMaterial?t:e).get(C.envMap||ce),O=de&&de.mapping===bc?de.image.height:null,le=M[C.type];C.precision!==null&&(y=s.getMaxPrecision(C.precision),y!==C.precision&&console.warn("THREE.WebGLProgram.getParameters:",C.precision,"not supported, using",y,"instead."));const oe=ue.morphAttributes.position||ue.morphAttributes.normal||ue.morphAttributes.color,U=oe!==void 0?oe.length:0;let ne=0;ue.morphAttributes.position!==void 0&&(ne=1),ue.morphAttributes.normal!==void 0&&(ne=2),ue.morphAttributes.color!==void 0&&(ne=3);let Le,Q,he,ge;if(le){const xe=Di[le];Le=xe.vertexShader,Q=xe.fragmentShader}else Le=C.vertexShader,Q=C.fragmentShader,h.update(C),he=h.getVertexShaderID(C),ge=h.getFragmentShaderID(C);const pe=o.getRenderTarget(),Re=o.state.buffers.depth.getReversed(),Pe=K.isInstancedMesh===!0,Oe=K.isBatchedMesh===!0,Et=!!C.map,st=!!C.matcap,Rt=!!de,B=!!C.aoMap,Yt=!!C.lightMap,it=!!C.bumpMap,gt=!!C.normalMap,Ke=!!C.displacementMap,Dt=!!C.emissiveMap,We=!!C.metalnessMap,P=!!C.roughnessMap,w=C.anisotropy>0,te=C.clearcoat>0,ve=C.dispersion>0,ye=C.iridescence>0,me=C.sheen>0,Xe=C.transmission>0,be=w&&!!C.anisotropyMap,ke=te&&!!C.clearcoatMap,ht=te&&!!C.clearcoatNormalMap,Ee=te&&!!C.clearcoatRoughnessMap,Be=ye&&!!C.iridescenceMap,Ye=ye&&!!C.iridescenceThicknessMap,nt=me&&!!C.sheenColorMap,ze=me&&!!C.sheenRoughnessMap,_t=!!C.specularMap,dt=!!C.specularColorMap,Ct=!!C.specularIntensityMap,j=Xe&&!!C.transmissionMap,Ce=Xe&&!!C.thicknessMap,ae=!!C.gradientMap,_e=!!C.alphaMap,Ie=C.alphaTest>0,Ne=!!C.alphaHash,at=!!C.extensions;let kt=Wr;C.toneMapped&&(pe===null||pe.isXRRenderTarget===!0)&&(kt=o.toneMapping);const $={shaderID:le,shaderType:C.type,shaderName:C.name,vertexShader:Le,fragmentShader:Q,defines:C.defines,customVertexShaderID:he,customFragmentShaderID:ge,isRawShaderMaterial:C.isRawShaderMaterial===!0,glslVersion:C.glslVersion,precision:y,batching:Oe,batchingColor:Oe&&K._colorsTexture!==null,instancing:Pe,instancingColor:Pe&&K.instanceColor!==null,instancingMorph:Pe&&K.morphTexture!==null,supportsVertexTextures:_,outputColorSpace:pe===null?o.outputColorSpace:pe.isXRRenderTarget===!0?pe.texture.colorSpace:Bn,alphaToCoverage:!!C.alphaToCoverage,map:Et,matcap:st,envMap:Rt,envMapMode:Rt&&de.mapping,envMapCubeUVHeight:O,aoMap:B,lightMap:Yt,bumpMap:it,normalMap:gt,displacementMap:_&&Ke,emissiveMap:Dt,normalMapObjectSpace:gt&&C.normalMapType===zx,normalMapTangentSpace:gt&&C.normalMapType===Jh,metalnessMap:We,roughnessMap:P,anisotropy:w,anisotropyMap:be,clearcoat:te,clearcoatMap:ke,clearcoatNormalMap:ht,clearcoatRoughnessMap:Ee,dispersion:ve,iridescence:ye,iridescenceMap:Be,iridescenceThicknessMap:Ye,sheen:me,sheenColorMap:nt,sheenRoughnessMap:ze,specularMap:_t,specularColorMap:dt,specularIntensityMap:Ct,transmission:Xe,transmissionMap:j,thicknessMap:Ce,gradientMap:ae,opaque:C.transparent===!1&&C.blending===fo&&C.alphaToCoverage===!1,alphaMap:_e,alphaTest:Ie,alphaHash:Ne,combine:C.combine,mapUv:Et&&E(C.map.channel),aoMapUv:B&&E(C.aoMap.channel),lightMapUv:Yt&&E(C.lightMap.channel),bumpMapUv:it&&E(C.bumpMap.channel),normalMapUv:gt&&E(C.normalMap.channel),displacementMapUv:Ke&&E(C.displacementMap.channel),emissiveMapUv:Dt&&E(C.emissiveMap.channel),metalnessMapUv:We&&E(C.metalnessMap.channel),roughnessMapUv:P&&E(C.roughnessMap.channel),anisotropyMapUv:be&&E(C.anisotropyMap.channel),clearcoatMapUv:ke&&E(C.clearcoatMap.channel),clearcoatNormalMapUv:ht&&E(C.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ee&&E(C.clearcoatRoughnessMap.channel),iridescenceMapUv:Be&&E(C.iridescenceMap.channel),iridescenceThicknessMapUv:Ye&&E(C.iridescenceThicknessMap.channel),sheenColorMapUv:nt&&E(C.sheenColorMap.channel),sheenRoughnessMapUv:ze&&E(C.sheenRoughnessMap.channel),specularMapUv:_t&&E(C.specularMap.channel),specularColorMapUv:dt&&E(C.specularColorMap.channel),specularIntensityMapUv:Ct&&E(C.specularIntensityMap.channel),transmissionMapUv:j&&E(C.transmissionMap.channel),thicknessMapUv:Ce&&E(C.thicknessMap.channel),alphaMapUv:_e&&E(C.alphaMap.channel),vertexTangents:!!ue.attributes.tangent&&(gt||w),vertexColors:C.vertexColors,vertexAlphas:C.vertexColors===!0&&!!ue.attributes.color&&ue.attributes.color.itemSize===4,pointsUvs:K.isPoints===!0&&!!ue.attributes.uv&&(Et||_e),fog:!!fe,useFog:C.fog===!0,fogExp2:!!fe&&fe.isFogExp2,flatShading:C.flatShading===!0,sizeAttenuation:C.sizeAttenuation===!0,logarithmicDepthBuffer:g,reverseDepthBuffer:Re,skinning:K.isSkinnedMesh===!0,morphTargets:ue.morphAttributes.position!==void 0,morphNormals:ue.morphAttributes.normal!==void 0,morphColors:ue.morphAttributes.color!==void 0,morphTargetsCount:U,morphTextureStride:ne,numDirLights:R.directional.length,numPointLights:R.point.length,numSpotLights:R.spot.length,numSpotLightMaps:R.spotLightMap.length,numRectAreaLights:R.rectArea.length,numHemiLights:R.hemi.length,numDirLightShadows:R.directionalShadowMap.length,numPointLightShadows:R.pointShadowMap.length,numSpotLightShadows:R.spotShadowMap.length,numSpotLightShadowsWithMaps:R.numSpotLightShadowsWithMaps,numLightProbes:R.numLightProbes,numClippingPlanes:c.numPlanes,numClipIntersection:c.numIntersection,dithering:C.dithering,shadowMapEnabled:o.shadowMap.enabled&&H.length>0,shadowMapType:o.shadowMap.type,toneMapping:kt,decodeVideoTexture:Et&&C.map.isVideoTexture===!0&&At.getTransfer(C.map.colorSpace)===zt,decodeVideoTextureEmissive:Dt&&C.emissiveMap.isVideoTexture===!0&&At.getTransfer(C.emissiveMap.colorSpace)===zt,premultipliedAlpha:C.premultipliedAlpha,doubleSided:C.side===yi,flipSided:C.side===Fn,useDepthPacking:C.depthPacking>=0,depthPacking:C.depthPacking||0,index0AttributeName:C.index0AttributeName,extensionClipCullDistance:at&&C.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(at&&C.extensions.multiDraw===!0||Oe)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:C.customProgramCacheKey()};return $.vertexUv1s=f.has(1),$.vertexUv2s=f.has(2),$.vertexUv3s=f.has(3),f.clear(),$}function x(C){const R=[];if(C.shaderID?R.push(C.shaderID):(R.push(C.customVertexShaderID),R.push(C.customFragmentShaderID)),C.defines!==void 0)for(const H in C.defines)R.push(H),R.push(C.defines[H]);return C.isRawShaderMaterial===!1&&(D(R,C),L(R,C),R.push(o.outputColorSpace)),R.push(C.customProgramCacheKey),R.join()}function D(C,R){C.push(R.precision),C.push(R.outputColorSpace),C.push(R.envMapMode),C.push(R.envMapCubeUVHeight),C.push(R.mapUv),C.push(R.alphaMapUv),C.push(R.lightMapUv),C.push(R.aoMapUv),C.push(R.bumpMapUv),C.push(R.normalMapUv),C.push(R.displacementMapUv),C.push(R.emissiveMapUv),C.push(R.metalnessMapUv),C.push(R.roughnessMapUv),C.push(R.anisotropyMapUv),C.push(R.clearcoatMapUv),C.push(R.clearcoatNormalMapUv),C.push(R.clearcoatRoughnessMapUv),C.push(R.iridescenceMapUv),C.push(R.iridescenceThicknessMapUv),C.push(R.sheenColorMapUv),C.push(R.sheenRoughnessMapUv),C.push(R.specularMapUv),C.push(R.specularColorMapUv),C.push(R.specularIntensityMapUv),C.push(R.transmissionMapUv),C.push(R.thicknessMapUv),C.push(R.combine),C.push(R.fogExp2),C.push(R.sizeAttenuation),C.push(R.morphTargetsCount),C.push(R.morphAttributeCount),C.push(R.numDirLights),C.push(R.numPointLights),C.push(R.numSpotLights),C.push(R.numSpotLightMaps),C.push(R.numHemiLights),C.push(R.numRectAreaLights),C.push(R.numDirLightShadows),C.push(R.numPointLightShadows),C.push(R.numSpotLightShadows),C.push(R.numSpotLightShadowsWithMaps),C.push(R.numLightProbes),C.push(R.shadowMapType),C.push(R.toneMapping),C.push(R.numClippingPlanes),C.push(R.numClipIntersection),C.push(R.depthPacking)}function L(C,R){u.disableAll(),R.supportsVertexTextures&&u.enable(0),R.instancing&&u.enable(1),R.instancingColor&&u.enable(2),R.instancingMorph&&u.enable(3),R.matcap&&u.enable(4),R.envMap&&u.enable(5),R.normalMapObjectSpace&&u.enable(6),R.normalMapTangentSpace&&u.enable(7),R.clearcoat&&u.enable(8),R.iridescence&&u.enable(9),R.alphaTest&&u.enable(10),R.vertexColors&&u.enable(11),R.vertexAlphas&&u.enable(12),R.vertexUv1s&&u.enable(13),R.vertexUv2s&&u.enable(14),R.vertexUv3s&&u.enable(15),R.vertexTangents&&u.enable(16),R.anisotropy&&u.enable(17),R.alphaHash&&u.enable(18),R.batching&&u.enable(19),R.dispersion&&u.enable(20),R.batchingColor&&u.enable(21),C.push(u.mask),u.disableAll(),R.fog&&u.enable(0),R.useFog&&u.enable(1),R.flatShading&&u.enable(2),R.logarithmicDepthBuffer&&u.enable(3),R.reverseDepthBuffer&&u.enable(4),R.skinning&&u.enable(5),R.morphTargets&&u.enable(6),R.morphNormals&&u.enable(7),R.morphColors&&u.enable(8),R.premultipliedAlpha&&u.enable(9),R.shadowMapEnabled&&u.enable(10),R.doubleSided&&u.enable(11),R.flipSided&&u.enable(12),R.useDepthPacking&&u.enable(13),R.dithering&&u.enable(14),R.transmission&&u.enable(15),R.sheen&&u.enable(16),R.opaque&&u.enable(17),R.pointsUvs&&u.enable(18),R.decodeVideoTexture&&u.enable(19),R.decodeVideoTextureEmissive&&u.enable(20),R.alphaToCoverage&&u.enable(21),C.push(u.mask)}function b(C){const R=M[C.type];let H;if(R){const J=Di[R];H=Ly.clone(J.uniforms)}else H=C.uniforms;return H}function V(C,R){let H;for(let J=0,K=m.length;J<K;J++){const fe=m[J];if(fe.cacheKey===R){H=fe,++H.usedTimes;break}}return H===void 0&&(H=new Uw(o,R,C,a),m.push(H)),H}function k(C){if(--C.usedTimes===0){const R=m.indexOf(C);m[R]=m[m.length-1],m.pop(),C.destroy()}}function F(C){h.remove(C)}function X(){h.dispose()}return{getParameters:S,getProgramCacheKey:x,getUniforms:b,acquireProgram:V,releaseProgram:k,releaseShaderCache:F,programs:m,dispose:X}}function zw(){let o=new WeakMap;function e(c){return o.has(c)}function t(c){let u=o.get(c);return u===void 0&&(u={},o.set(c,u)),u}function i(c){o.delete(c)}function s(c,u,h){o.get(c)[u]=h}function a(){o=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:a}}function Hw(o,e){return o.groupOrder!==e.groupOrder?o.groupOrder-e.groupOrder:o.renderOrder!==e.renderOrder?o.renderOrder-e.renderOrder:o.material.id!==e.material.id?o.material.id-e.material.id:o.z!==e.z?o.z-e.z:o.id-e.id}function c_(o,e){return o.groupOrder!==e.groupOrder?o.groupOrder-e.groupOrder:o.renderOrder!==e.renderOrder?o.renderOrder-e.renderOrder:o.z!==e.z?e.z-o.z:o.id-e.id}function u_(){const o=[];let e=0;const t=[],i=[],s=[];function a(){e=0,t.length=0,i.length=0,s.length=0}function c(g,_,y,M,E,S){let x=o[e];return x===void 0?(x={id:g.id,object:g,geometry:_,material:y,groupOrder:M,renderOrder:g.renderOrder,z:E,group:S},o[e]=x):(x.id=g.id,x.object=g,x.geometry=_,x.material=y,x.groupOrder=M,x.renderOrder=g.renderOrder,x.z=E,x.group=S),e++,x}function u(g,_,y,M,E,S){const x=c(g,_,y,M,E,S);y.transmission>0?i.push(x):y.transparent===!0?s.push(x):t.push(x)}function h(g,_,y,M,E,S){const x=c(g,_,y,M,E,S);y.transmission>0?i.unshift(x):y.transparent===!0?s.unshift(x):t.unshift(x)}function f(g,_){t.length>1&&t.sort(g||Hw),i.length>1&&i.sort(_||c_),s.length>1&&s.sort(_||c_)}function m(){for(let g=e,_=o.length;g<_;g++){const y=o[g];if(y.id===null)break;y.id=null,y.object=null,y.geometry=null,y.material=null,y.group=null}}return{opaque:t,transmissive:i,transparent:s,init:a,push:u,unshift:h,finish:m,sort:f}}function Vw(){let o=new WeakMap;function e(i,s){const a=o.get(i);let c;return a===void 0?(c=new u_,o.set(i,[c])):s>=a.length?(c=new u_,a.push(c)):c=a[s],c}function t(){o=new WeakMap}return{get:e,dispose:t}}function Gw(){const o={};return{get:function(e){if(o[e.id]!==void 0)return o[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new Y,color:new rt};break;case"SpotLight":t={position:new Y,direction:new Y,color:new rt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new Y,color:new rt,distance:0,decay:0};break;case"HemisphereLight":t={direction:new Y,skyColor:new rt,groundColor:new rt};break;case"RectAreaLight":t={color:new rt,position:new Y,halfWidth:new Y,halfHeight:new Y};break}return o[e.id]=t,t}}}function Ww(){const o={};return{get:function(e){if(o[e.id]!==void 0)return o[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot,shadowCameraNear:1,shadowCameraFar:1e3};break}return o[e.id]=t,t}}}let jw=0;function Xw(o,e){return(e.castShadow?2:0)-(o.castShadow?2:0)+(e.map?1:0)-(o.map?1:0)}function Yw(o){const e=new Gw,t=Ww(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let f=0;f<9;f++)i.probe.push(new Y);const s=new Y,a=new pt,c=new pt;function u(f){let m=0,g=0,_=0;for(let C=0;C<9;C++)i.probe[C].set(0,0,0);let y=0,M=0,E=0,S=0,x=0,D=0,L=0,b=0,V=0,k=0,F=0;f.sort(Xw);for(let C=0,R=f.length;C<R;C++){const H=f[C],J=H.color,K=H.intensity,fe=H.distance,ue=H.shadow&&H.shadow.map?H.shadow.map.texture:null;if(H.isAmbientLight)m+=J.r*K,g+=J.g*K,_+=J.b*K;else if(H.isLightProbe){for(let ce=0;ce<9;ce++)i.probe[ce].addScaledVector(H.sh.coefficients[ce],K);F++}else if(H.isDirectionalLight){const ce=e.get(H);if(ce.color.copy(H.color).multiplyScalar(H.intensity),H.castShadow){const de=H.shadow,O=t.get(H);O.shadowIntensity=de.intensity,O.shadowBias=de.bias,O.shadowNormalBias=de.normalBias,O.shadowRadius=de.radius,O.shadowMapSize=de.mapSize,i.directionalShadow[y]=O,i.directionalShadowMap[y]=ue,i.directionalShadowMatrix[y]=H.shadow.matrix,D++}i.directional[y]=ce,y++}else if(H.isSpotLight){const ce=e.get(H);ce.position.setFromMatrixPosition(H.matrixWorld),ce.color.copy(J).multiplyScalar(K),ce.distance=fe,ce.coneCos=Math.cos(H.angle),ce.penumbraCos=Math.cos(H.angle*(1-H.penumbra)),ce.decay=H.decay,i.spot[E]=ce;const de=H.shadow;if(H.map&&(i.spotLightMap[V]=H.map,V++,de.updateMatrices(H),H.castShadow&&k++),i.spotLightMatrix[E]=de.matrix,H.castShadow){const O=t.get(H);O.shadowIntensity=de.intensity,O.shadowBias=de.bias,O.shadowNormalBias=de.normalBias,O.shadowRadius=de.radius,O.shadowMapSize=de.mapSize,i.spotShadow[E]=O,i.spotShadowMap[E]=ue,b++}E++}else if(H.isRectAreaLight){const ce=e.get(H);ce.color.copy(J).multiplyScalar(K),ce.halfWidth.set(H.width*.5,0,0),ce.halfHeight.set(0,H.height*.5,0),i.rectArea[S]=ce,S++}else if(H.isPointLight){const ce=e.get(H);if(ce.color.copy(H.color).multiplyScalar(H.intensity),ce.distance=H.distance,ce.decay=H.decay,H.castShadow){const de=H.shadow,O=t.get(H);O.shadowIntensity=de.intensity,O.shadowBias=de.bias,O.shadowNormalBias=de.normalBias,O.shadowRadius=de.radius,O.shadowMapSize=de.mapSize,O.shadowCameraNear=de.camera.near,O.shadowCameraFar=de.camera.far,i.pointShadow[M]=O,i.pointShadowMap[M]=ue,i.pointShadowMatrix[M]=H.shadow.matrix,L++}i.point[M]=ce,M++}else if(H.isHemisphereLight){const ce=e.get(H);ce.skyColor.copy(H.color).multiplyScalar(K),ce.groundColor.copy(H.groundColor).multiplyScalar(K),i.hemi[x]=ce,x++}}S>0&&(o.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Ue.LTC_FLOAT_1,i.rectAreaLTC2=Ue.LTC_FLOAT_2):(i.rectAreaLTC1=Ue.LTC_HALF_1,i.rectAreaLTC2=Ue.LTC_HALF_2)),i.ambient[0]=m,i.ambient[1]=g,i.ambient[2]=_;const X=i.hash;(X.directionalLength!==y||X.pointLength!==M||X.spotLength!==E||X.rectAreaLength!==S||X.hemiLength!==x||X.numDirectionalShadows!==D||X.numPointShadows!==L||X.numSpotShadows!==b||X.numSpotMaps!==V||X.numLightProbes!==F)&&(i.directional.length=y,i.spot.length=E,i.rectArea.length=S,i.point.length=M,i.hemi.length=x,i.directionalShadow.length=D,i.directionalShadowMap.length=D,i.pointShadow.length=L,i.pointShadowMap.length=L,i.spotShadow.length=b,i.spotShadowMap.length=b,i.directionalShadowMatrix.length=D,i.pointShadowMatrix.length=L,i.spotLightMatrix.length=b+V-k,i.spotLightMap.length=V,i.numSpotLightShadowsWithMaps=k,i.numLightProbes=F,X.directionalLength=y,X.pointLength=M,X.spotLength=E,X.rectAreaLength=S,X.hemiLength=x,X.numDirectionalShadows=D,X.numPointShadows=L,X.numSpotShadows=b,X.numSpotMaps=V,X.numLightProbes=F,i.version=jw++)}function h(f,m){let g=0,_=0,y=0,M=0,E=0;const S=m.matrixWorldInverse;for(let x=0,D=f.length;x<D;x++){const L=f[x];if(L.isDirectionalLight){const b=i.directional[g];b.direction.setFromMatrixPosition(L.matrixWorld),s.setFromMatrixPosition(L.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(S),g++}else if(L.isSpotLight){const b=i.spot[y];b.position.setFromMatrixPosition(L.matrixWorld),b.position.applyMatrix4(S),b.direction.setFromMatrixPosition(L.matrixWorld),s.setFromMatrixPosition(L.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(S),y++}else if(L.isRectAreaLight){const b=i.rectArea[M];b.position.setFromMatrixPosition(L.matrixWorld),b.position.applyMatrix4(S),c.identity(),a.copy(L.matrixWorld),a.premultiply(S),c.extractRotation(a),b.halfWidth.set(L.width*.5,0,0),b.halfHeight.set(0,L.height*.5,0),b.halfWidth.applyMatrix4(c),b.halfHeight.applyMatrix4(c),M++}else if(L.isPointLight){const b=i.point[_];b.position.setFromMatrixPosition(L.matrixWorld),b.position.applyMatrix4(S),_++}else if(L.isHemisphereLight){const b=i.hemi[E];b.direction.setFromMatrixPosition(L.matrixWorld),b.direction.transformDirection(S),E++}}}return{setup:u,setupView:h,state:i}}function d_(o){const e=new Yw(o),t=[],i=[];function s(m){f.camera=m,t.length=0,i.length=0}function a(m){t.push(m)}function c(m){i.push(m)}function u(){e.setup(t)}function h(m){e.setupView(t,m)}const f={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:f,setupLights:u,setupLightsView:h,pushLight:a,pushShadow:c}}function qw(o){let e=new WeakMap;function t(s,a=0){const c=e.get(s);let u;return c===void 0?(u=new d_(o),e.set(s,[u])):a>=c.length?(u=new d_(o),c.push(u)):u=c[a],u}function i(){e=new WeakMap}return{get:t,dispose:i}}const Kw=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,$w=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Zw(o,e,t){let i=new sf;const s=new ot,a=new ot,c=new It,u=new Yy({depthPacking:Bx}),h=new qy,f={},m=t.maxTextureSize,g={[lr]:Fn,[Fn]:lr,[yi]:yi},_=new jr({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ot},radius:{value:4}},vertexShader:Kw,fragmentShader:$w}),y=_.clone();y.defines.HORIZONTAL_PASS=1;const M=new Yn;M.setAttribute("position",new kn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const E=new Ht(M,_),S=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=S_;let x=this.type;this.render=function(k,F,X){if(S.enabled===!1||S.autoUpdate===!1&&S.needsUpdate===!1||k.length===0)return;const C=o.getRenderTarget(),R=o.getActiveCubeFace(),H=o.getActiveMipmapLevel(),J=o.state;J.setBlending(Gr),J.buffers.color.setClear(1,1,1,1),J.buffers.depth.setTest(!0),J.setScissorTest(!1);const K=x!==ir&&this.type===ir,fe=x===ir&&this.type!==ir;for(let ue=0,ce=k.length;ue<ce;ue++){const de=k[ue],O=de.shadow;if(O===void 0){console.warn("THREE.WebGLShadowMap:",de,"has no shadow.");continue}if(O.autoUpdate===!1&&O.needsUpdate===!1)continue;s.copy(O.mapSize);const le=O.getFrameExtents();if(s.multiply(le),a.copy(O.mapSize),(s.x>m||s.y>m)&&(s.x>m&&(a.x=Math.floor(m/le.x),s.x=a.x*le.x,O.mapSize.x=a.x),s.y>m&&(a.y=Math.floor(m/le.y),s.y=a.y*le.y,O.mapSize.y=a.y)),O.map===null||K===!0||fe===!0){const U=this.type!==ir?{minFilter:On,magFilter:On}:{};O.map!==null&&O.map.dispose(),O.map=new xs(s.x,s.y,U),O.map.texture.name=de.name+".shadowMap",O.camera.updateProjectionMatrix()}o.setRenderTarget(O.map),o.clear();const oe=O.getViewportCount();for(let U=0;U<oe;U++){const ne=O.getViewport(U);c.set(a.x*ne.x,a.y*ne.y,a.x*ne.z,a.y*ne.w),J.viewport(c),O.updateMatrices(de,U),i=O.getFrustum(),b(F,X,O.camera,de,this.type)}O.isPointLightShadow!==!0&&this.type===ir&&D(O,X),O.needsUpdate=!1}x=this.type,S.needsUpdate=!1,o.setRenderTarget(C,R,H)};function D(k,F){const X=e.update(E);_.defines.VSM_SAMPLES!==k.blurSamples&&(_.defines.VSM_SAMPLES=k.blurSamples,y.defines.VSM_SAMPLES=k.blurSamples,_.needsUpdate=!0,y.needsUpdate=!0),k.mapPass===null&&(k.mapPass=new xs(s.x,s.y)),_.uniforms.shadow_pass.value=k.map.texture,_.uniforms.resolution.value=k.mapSize,_.uniforms.radius.value=k.radius,o.setRenderTarget(k.mapPass),o.clear(),o.renderBufferDirect(F,null,X,_,E,null),y.uniforms.shadow_pass.value=k.mapPass.texture,y.uniforms.resolution.value=k.mapSize,y.uniforms.radius.value=k.radius,o.setRenderTarget(k.map),o.clear(),o.renderBufferDirect(F,null,X,y,E,null)}function L(k,F,X,C){let R=null;const H=X.isPointLight===!0?k.customDistanceMaterial:k.customDepthMaterial;if(H!==void 0)R=H;else if(R=X.isPointLight===!0?h:u,o.localClippingEnabled&&F.clipShadows===!0&&Array.isArray(F.clippingPlanes)&&F.clippingPlanes.length!==0||F.displacementMap&&F.displacementScale!==0||F.alphaMap&&F.alphaTest>0||F.map&&F.alphaTest>0){const J=R.uuid,K=F.uuid;let fe=f[J];fe===void 0&&(fe={},f[J]=fe);let ue=fe[K];ue===void 0&&(ue=R.clone(),fe[K]=ue,F.addEventListener("dispose",V)),R=ue}if(R.visible=F.visible,R.wireframe=F.wireframe,C===ir?R.side=F.shadowSide!==null?F.shadowSide:F.side:R.side=F.shadowSide!==null?F.shadowSide:g[F.side],R.alphaMap=F.alphaMap,R.alphaTest=F.alphaTest,R.map=F.map,R.clipShadows=F.clipShadows,R.clippingPlanes=F.clippingPlanes,R.clipIntersection=F.clipIntersection,R.displacementMap=F.displacementMap,R.displacementScale=F.displacementScale,R.displacementBias=F.displacementBias,R.wireframeLinewidth=F.wireframeLinewidth,R.linewidth=F.linewidth,X.isPointLight===!0&&R.isMeshDistanceMaterial===!0){const J=o.properties.get(R);J.light=X}return R}function b(k,F,X,C,R){if(k.visible===!1)return;if(k.layers.test(F.layers)&&(k.isMesh||k.isLine||k.isPoints)&&(k.castShadow||k.receiveShadow&&R===ir)&&(!k.frustumCulled||i.intersectsObject(k))){k.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,k.matrixWorld);const K=e.update(k),fe=k.material;if(Array.isArray(fe)){const ue=K.groups;for(let ce=0,de=ue.length;ce<de;ce++){const O=ue[ce],le=fe[O.materialIndex];if(le&&le.visible){const oe=L(k,le,C,R);k.onBeforeShadow(o,k,F,X,K,oe,O),o.renderBufferDirect(X,null,K,oe,k,O),k.onAfterShadow(o,k,F,X,K,oe,O)}}}else if(fe.visible){const ue=L(k,fe,C,R);k.onBeforeShadow(o,k,F,X,K,ue,null),o.renderBufferDirect(X,null,K,ue,k,null),k.onAfterShadow(o,k,F,X,K,ue,null)}}const J=k.children;for(let K=0,fe=J.length;K<fe;K++)b(J[K],F,X,C,R)}function V(k){k.target.removeEventListener("dispose",V);for(const X in f){const C=f[X],R=k.target.uuid;R in C&&(C[R].dispose(),delete C[R])}}}const Qw={[th]:nh,[ih]:oh,[rh]:ah,[_o]:sh,[nh]:th,[oh]:ih,[ah]:rh,[sh]:_o};function Jw(o,e){function t(){let j=!1;const Ce=new It;let ae=null;const _e=new It(0,0,0,0);return{setMask:function(Ie){ae!==Ie&&!j&&(o.colorMask(Ie,Ie,Ie,Ie),ae=Ie)},setLocked:function(Ie){j=Ie},setClear:function(Ie,Ne,at,kt,$){$===!0&&(Ie*=kt,Ne*=kt,at*=kt),Ce.set(Ie,Ne,at,kt),_e.equals(Ce)===!1&&(o.clearColor(Ie,Ne,at,kt),_e.copy(Ce))},reset:function(){j=!1,ae=null,_e.set(-1,0,0,0)}}}function i(){let j=!1,Ce=!1,ae=null,_e=null,Ie=null;return{setReversed:function(Ne){if(Ce!==Ne){const at=e.get("EXT_clip_control");Ce?at.clipControlEXT(at.LOWER_LEFT_EXT,at.ZERO_TO_ONE_EXT):at.clipControlEXT(at.LOWER_LEFT_EXT,at.NEGATIVE_ONE_TO_ONE_EXT);const kt=Ie;Ie=null,this.setClear(kt)}Ce=Ne},getReversed:function(){return Ce},setTest:function(Ne){Ne?pe(o.DEPTH_TEST):Re(o.DEPTH_TEST)},setMask:function(Ne){ae!==Ne&&!j&&(o.depthMask(Ne),ae=Ne)},setFunc:function(Ne){if(Ce&&(Ne=Qw[Ne]),_e!==Ne){switch(Ne){case th:o.depthFunc(o.NEVER);break;case nh:o.depthFunc(o.ALWAYS);break;case ih:o.depthFunc(o.LESS);break;case _o:o.depthFunc(o.LEQUAL);break;case rh:o.depthFunc(o.EQUAL);break;case sh:o.depthFunc(o.GEQUAL);break;case oh:o.depthFunc(o.GREATER);break;case ah:o.depthFunc(o.NOTEQUAL);break;default:o.depthFunc(o.LEQUAL)}_e=Ne}},setLocked:function(Ne){j=Ne},setClear:function(Ne){Ie!==Ne&&(Ce&&(Ne=1-Ne),o.clearDepth(Ne),Ie=Ne)},reset:function(){j=!1,ae=null,_e=null,Ie=null,Ce=!1}}}function s(){let j=!1,Ce=null,ae=null,_e=null,Ie=null,Ne=null,at=null,kt=null,$=null;return{setTest:function(xe){j||(xe?pe(o.STENCIL_TEST):Re(o.STENCIL_TEST))},setMask:function(xe){Ce!==xe&&!j&&(o.stencilMask(xe),Ce=xe)},setFunc:function(xe,Ut,Wt){(ae!==xe||_e!==Ut||Ie!==Wt)&&(o.stencilFunc(xe,Ut,Wt),ae=xe,_e=Ut,Ie=Wt)},setOp:function(xe,Ut,Wt){(Ne!==xe||at!==Ut||kt!==Wt)&&(o.stencilOp(xe,Ut,Wt),Ne=xe,at=Ut,kt=Wt)},setLocked:function(xe){j=xe},setClear:function(xe){$!==xe&&(o.clearStencil(xe),$=xe)},reset:function(){j=!1,Ce=null,ae=null,_e=null,Ie=null,Ne=null,at=null,kt=null,$=null}}}const a=new t,c=new i,u=new s,h=new WeakMap,f=new WeakMap;let m={},g={},_=new WeakMap,y=[],M=null,E=!1,S=null,x=null,D=null,L=null,b=null,V=null,k=null,F=new rt(0,0,0),X=0,C=!1,R=null,H=null,J=null,K=null,fe=null;const ue=o.getParameter(o.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let ce=!1,de=0;const O=o.getParameter(o.VERSION);O.indexOf("WebGL")!==-1?(de=parseFloat(/^WebGL (\d)/.exec(O)[1]),ce=de>=1):O.indexOf("OpenGL ES")!==-1&&(de=parseFloat(/^OpenGL ES (\d)/.exec(O)[1]),ce=de>=2);let le=null,oe={};const U=o.getParameter(o.SCISSOR_BOX),ne=o.getParameter(o.VIEWPORT),Le=new It().fromArray(U),Q=new It().fromArray(ne);function he(j,Ce,ae,_e){const Ie=new Uint8Array(4),Ne=o.createTexture();o.bindTexture(j,Ne),o.texParameteri(j,o.TEXTURE_MIN_FILTER,o.NEAREST),o.texParameteri(j,o.TEXTURE_MAG_FILTER,o.NEAREST);for(let at=0;at<ae;at++)j===o.TEXTURE_3D||j===o.TEXTURE_2D_ARRAY?o.texImage3D(Ce,0,o.RGBA,1,1,_e,0,o.RGBA,o.UNSIGNED_BYTE,Ie):o.texImage2D(Ce+at,0,o.RGBA,1,1,0,o.RGBA,o.UNSIGNED_BYTE,Ie);return Ne}const ge={};ge[o.TEXTURE_2D]=he(o.TEXTURE_2D,o.TEXTURE_2D,1),ge[o.TEXTURE_CUBE_MAP]=he(o.TEXTURE_CUBE_MAP,o.TEXTURE_CUBE_MAP_POSITIVE_X,6),ge[o.TEXTURE_2D_ARRAY]=he(o.TEXTURE_2D_ARRAY,o.TEXTURE_2D_ARRAY,1,1),ge[o.TEXTURE_3D]=he(o.TEXTURE_3D,o.TEXTURE_3D,1,1),a.setClear(0,0,0,1),c.setClear(1),u.setClear(0),pe(o.DEPTH_TEST),c.setFunc(_o),it(!1),gt(qm),pe(o.CULL_FACE),B(Gr);function pe(j){m[j]!==!0&&(o.enable(j),m[j]=!0)}function Re(j){m[j]!==!1&&(o.disable(j),m[j]=!1)}function Pe(j,Ce){return g[j]!==Ce?(o.bindFramebuffer(j,Ce),g[j]=Ce,j===o.DRAW_FRAMEBUFFER&&(g[o.FRAMEBUFFER]=Ce),j===o.FRAMEBUFFER&&(g[o.DRAW_FRAMEBUFFER]=Ce),!0):!1}function Oe(j,Ce){let ae=y,_e=!1;if(j){ae=_.get(Ce),ae===void 0&&(ae=[],_.set(Ce,ae));const Ie=j.textures;if(ae.length!==Ie.length||ae[0]!==o.COLOR_ATTACHMENT0){for(let Ne=0,at=Ie.length;Ne<at;Ne++)ae[Ne]=o.COLOR_ATTACHMENT0+Ne;ae.length=Ie.length,_e=!0}}else ae[0]!==o.BACK&&(ae[0]=o.BACK,_e=!0);_e&&o.drawBuffers(ae)}function Et(j){return M!==j?(o.useProgram(j),M=j,!0):!1}const st={[gs]:o.FUNC_ADD,[ux]:o.FUNC_SUBTRACT,[dx]:o.FUNC_REVERSE_SUBTRACT};st[hx]=o.MIN,st[fx]=o.MAX;const Rt={[px]:o.ZERO,[mx]:o.ONE,[gx]:o.SRC_COLOR,[Jd]:o.SRC_ALPHA,[Mx]:o.SRC_ALPHA_SATURATE,[yx]:o.DST_COLOR,[vx]:o.DST_ALPHA,[_x]:o.ONE_MINUS_SRC_COLOR,[eh]:o.ONE_MINUS_SRC_ALPHA,[Sx]:o.ONE_MINUS_DST_COLOR,[xx]:o.ONE_MINUS_DST_ALPHA,[Ex]:o.CONSTANT_COLOR,[Tx]:o.ONE_MINUS_CONSTANT_COLOR,[wx]:o.CONSTANT_ALPHA,[Ax]:o.ONE_MINUS_CONSTANT_ALPHA};function B(j,Ce,ae,_e,Ie,Ne,at,kt,$,xe){if(j===Gr){E===!0&&(Re(o.BLEND),E=!1);return}if(E===!1&&(pe(o.BLEND),E=!0),j!==cx){if(j!==S||xe!==C){if((x!==gs||b!==gs)&&(o.blendEquation(o.FUNC_ADD),x=gs,b=gs),xe)switch(j){case fo:o.blendFuncSeparate(o.ONE,o.ONE_MINUS_SRC_ALPHA,o.ONE,o.ONE_MINUS_SRC_ALPHA);break;case Km:o.blendFunc(o.ONE,o.ONE);break;case $m:o.blendFuncSeparate(o.ZERO,o.ONE_MINUS_SRC_COLOR,o.ZERO,o.ONE);break;case Zm:o.blendFuncSeparate(o.ZERO,o.SRC_COLOR,o.ZERO,o.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",j);break}else switch(j){case fo:o.blendFuncSeparate(o.SRC_ALPHA,o.ONE_MINUS_SRC_ALPHA,o.ONE,o.ONE_MINUS_SRC_ALPHA);break;case Km:o.blendFunc(o.SRC_ALPHA,o.ONE);break;case $m:o.blendFuncSeparate(o.ZERO,o.ONE_MINUS_SRC_COLOR,o.ZERO,o.ONE);break;case Zm:o.blendFunc(o.ZERO,o.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",j);break}D=null,L=null,V=null,k=null,F.set(0,0,0),X=0,S=j,C=xe}return}Ie=Ie||Ce,Ne=Ne||ae,at=at||_e,(Ce!==x||Ie!==b)&&(o.blendEquationSeparate(st[Ce],st[Ie]),x=Ce,b=Ie),(ae!==D||_e!==L||Ne!==V||at!==k)&&(o.blendFuncSeparate(Rt[ae],Rt[_e],Rt[Ne],Rt[at]),D=ae,L=_e,V=Ne,k=at),(kt.equals(F)===!1||$!==X)&&(o.blendColor(kt.r,kt.g,kt.b,$),F.copy(kt),X=$),S=j,C=!1}function Yt(j,Ce){j.side===yi?Re(o.CULL_FACE):pe(o.CULL_FACE);let ae=j.side===Fn;Ce&&(ae=!ae),it(ae),j.blending===fo&&j.transparent===!1?B(Gr):B(j.blending,j.blendEquation,j.blendSrc,j.blendDst,j.blendEquationAlpha,j.blendSrcAlpha,j.blendDstAlpha,j.blendColor,j.blendAlpha,j.premultipliedAlpha),c.setFunc(j.depthFunc),c.setTest(j.depthTest),c.setMask(j.depthWrite),a.setMask(j.colorWrite);const _e=j.stencilWrite;u.setTest(_e),_e&&(u.setMask(j.stencilWriteMask),u.setFunc(j.stencilFunc,j.stencilRef,j.stencilFuncMask),u.setOp(j.stencilFail,j.stencilZFail,j.stencilZPass)),Dt(j.polygonOffset,j.polygonOffsetFactor,j.polygonOffsetUnits),j.alphaToCoverage===!0?pe(o.SAMPLE_ALPHA_TO_COVERAGE):Re(o.SAMPLE_ALPHA_TO_COVERAGE)}function it(j){R!==j&&(j?o.frontFace(o.CW):o.frontFace(o.CCW),R=j)}function gt(j){j!==ax?(pe(o.CULL_FACE),j!==H&&(j===qm?o.cullFace(o.BACK):j===lx?o.cullFace(o.FRONT):o.cullFace(o.FRONT_AND_BACK))):Re(o.CULL_FACE),H=j}function Ke(j){j!==J&&(ce&&o.lineWidth(j),J=j)}function Dt(j,Ce,ae){j?(pe(o.POLYGON_OFFSET_FILL),(K!==Ce||fe!==ae)&&(o.polygonOffset(Ce,ae),K=Ce,fe=ae)):Re(o.POLYGON_OFFSET_FILL)}function We(j){j?pe(o.SCISSOR_TEST):Re(o.SCISSOR_TEST)}function P(j){j===void 0&&(j=o.TEXTURE0+ue-1),le!==j&&(o.activeTexture(j),le=j)}function w(j,Ce,ae){ae===void 0&&(le===null?ae=o.TEXTURE0+ue-1:ae=le);let _e=oe[ae];_e===void 0&&(_e={type:void 0,texture:void 0},oe[ae]=_e),(_e.type!==j||_e.texture!==Ce)&&(le!==ae&&(o.activeTexture(ae),le=ae),o.bindTexture(j,Ce||ge[j]),_e.type=j,_e.texture=Ce)}function te(){const j=oe[le];j!==void 0&&j.type!==void 0&&(o.bindTexture(j.type,null),j.type=void 0,j.texture=void 0)}function ve(){try{o.compressedTexImage2D.apply(o,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function ye(){try{o.compressedTexImage3D.apply(o,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function me(){try{o.texSubImage2D.apply(o,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function Xe(){try{o.texSubImage3D.apply(o,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function be(){try{o.compressedTexSubImage2D.apply(o,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function ke(){try{o.compressedTexSubImage3D.apply(o,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function ht(){try{o.texStorage2D.apply(o,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function Ee(){try{o.texStorage3D.apply(o,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function Be(){try{o.texImage2D.apply(o,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function Ye(){try{o.texImage3D.apply(o,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function nt(j){Le.equals(j)===!1&&(o.scissor(j.x,j.y,j.z,j.w),Le.copy(j))}function ze(j){Q.equals(j)===!1&&(o.viewport(j.x,j.y,j.z,j.w),Q.copy(j))}function _t(j,Ce){let ae=f.get(Ce);ae===void 0&&(ae=new WeakMap,f.set(Ce,ae));let _e=ae.get(j);_e===void 0&&(_e=o.getUniformBlockIndex(Ce,j.name),ae.set(j,_e))}function dt(j,Ce){const _e=f.get(Ce).get(j);h.get(Ce)!==_e&&(o.uniformBlockBinding(Ce,_e,j.__bindingPointIndex),h.set(Ce,_e))}function Ct(){o.disable(o.BLEND),o.disable(o.CULL_FACE),o.disable(o.DEPTH_TEST),o.disable(o.POLYGON_OFFSET_FILL),o.disable(o.SCISSOR_TEST),o.disable(o.STENCIL_TEST),o.disable(o.SAMPLE_ALPHA_TO_COVERAGE),o.blendEquation(o.FUNC_ADD),o.blendFunc(o.ONE,o.ZERO),o.blendFuncSeparate(o.ONE,o.ZERO,o.ONE,o.ZERO),o.blendColor(0,0,0,0),o.colorMask(!0,!0,!0,!0),o.clearColor(0,0,0,0),o.depthMask(!0),o.depthFunc(o.LESS),c.setReversed(!1),o.clearDepth(1),o.stencilMask(4294967295),o.stencilFunc(o.ALWAYS,0,4294967295),o.stencilOp(o.KEEP,o.KEEP,o.KEEP),o.clearStencil(0),o.cullFace(o.BACK),o.frontFace(o.CCW),o.polygonOffset(0,0),o.activeTexture(o.TEXTURE0),o.bindFramebuffer(o.FRAMEBUFFER,null),o.bindFramebuffer(o.DRAW_FRAMEBUFFER,null),o.bindFramebuffer(o.READ_FRAMEBUFFER,null),o.useProgram(null),o.lineWidth(1),o.scissor(0,0,o.canvas.width,o.canvas.height),o.viewport(0,0,o.canvas.width,o.canvas.height),m={},le=null,oe={},g={},_=new WeakMap,y=[],M=null,E=!1,S=null,x=null,D=null,L=null,b=null,V=null,k=null,F=new rt(0,0,0),X=0,C=!1,R=null,H=null,J=null,K=null,fe=null,Le.set(0,0,o.canvas.width,o.canvas.height),Q.set(0,0,o.canvas.width,o.canvas.height),a.reset(),c.reset(),u.reset()}return{buffers:{color:a,depth:c,stencil:u},enable:pe,disable:Re,bindFramebuffer:Pe,drawBuffers:Oe,useProgram:Et,setBlending:B,setMaterial:Yt,setFlipSided:it,setCullFace:gt,setLineWidth:Ke,setPolygonOffset:Dt,setScissorTest:We,activeTexture:P,bindTexture:w,unbindTexture:te,compressedTexImage2D:ve,compressedTexImage3D:ye,texImage2D:Be,texImage3D:Ye,updateUBOMapping:_t,uniformBlockBinding:dt,texStorage2D:ht,texStorage3D:Ee,texSubImage2D:me,texSubImage3D:Xe,compressedTexSubImage2D:be,compressedTexSubImage3D:ke,scissor:nt,viewport:ze,reset:Ct}}function eA(o,e,t,i,s,a,c){const u=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,h=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),f=new ot,m=new WeakMap;let g;const _=new WeakMap;let y=!1;try{y=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function M(P,w){return y?new OffscreenCanvas(P,w):Ca("canvas")}function E(P,w,te){let ve=1;const ye=We(P);if((ye.width>te||ye.height>te)&&(ve=te/Math.max(ye.width,ye.height)),ve<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){const me=Math.floor(ve*ye.width),Xe=Math.floor(ve*ye.height);g===void 0&&(g=M(me,Xe));const be=w?M(me,Xe):g;return be.width=me,be.height=Xe,be.getContext("2d").drawImage(P,0,0,me,Xe),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ye.width+"x"+ye.height+") to ("+me+"x"+Xe+")."),be}else return"data"in P&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ye.width+"x"+ye.height+")."),P;return P}function S(P){return P.generateMipmaps}function x(P){o.generateMipmap(P)}function D(P){return P.isWebGLCubeRenderTarget?o.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?o.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?o.TEXTURE_2D_ARRAY:o.TEXTURE_2D}function L(P,w,te,ve,ye=!1){if(P!==null){if(o[P]!==void 0)return o[P];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let me=w;if(w===o.RED&&(te===o.FLOAT&&(me=o.R32F),te===o.HALF_FLOAT&&(me=o.R16F),te===o.UNSIGNED_BYTE&&(me=o.R8)),w===o.RED_INTEGER&&(te===o.UNSIGNED_BYTE&&(me=o.R8UI),te===o.UNSIGNED_SHORT&&(me=o.R16UI),te===o.UNSIGNED_INT&&(me=o.R32UI),te===o.BYTE&&(me=o.R8I),te===o.SHORT&&(me=o.R16I),te===o.INT&&(me=o.R32I)),w===o.RG&&(te===o.FLOAT&&(me=o.RG32F),te===o.HALF_FLOAT&&(me=o.RG16F),te===o.UNSIGNED_BYTE&&(me=o.RG8)),w===o.RG_INTEGER&&(te===o.UNSIGNED_BYTE&&(me=o.RG8UI),te===o.UNSIGNED_SHORT&&(me=o.RG16UI),te===o.UNSIGNED_INT&&(me=o.RG32UI),te===o.BYTE&&(me=o.RG8I),te===o.SHORT&&(me=o.RG16I),te===o.INT&&(me=o.RG32I)),w===o.RGB_INTEGER&&(te===o.UNSIGNED_BYTE&&(me=o.RGB8UI),te===o.UNSIGNED_SHORT&&(me=o.RGB16UI),te===o.UNSIGNED_INT&&(me=o.RGB32UI),te===o.BYTE&&(me=o.RGB8I),te===o.SHORT&&(me=o.RGB16I),te===o.INT&&(me=o.RGB32I)),w===o.RGBA_INTEGER&&(te===o.UNSIGNED_BYTE&&(me=o.RGBA8UI),te===o.UNSIGNED_SHORT&&(me=o.RGBA16UI),te===o.UNSIGNED_INT&&(me=o.RGBA32UI),te===o.BYTE&&(me=o.RGBA8I),te===o.SHORT&&(me=o.RGBA16I),te===o.INT&&(me=o.RGBA32I)),w===o.RGB&&te===o.UNSIGNED_INT_5_9_9_9_REV&&(me=o.RGB9_E5),w===o.RGBA){const Xe=ye?Tc:At.getTransfer(ve);te===o.FLOAT&&(me=o.RGBA32F),te===o.HALF_FLOAT&&(me=o.RGBA16F),te===o.UNSIGNED_BYTE&&(me=Xe===zt?o.SRGB8_ALPHA8:o.RGBA8),te===o.UNSIGNED_SHORT_4_4_4_4&&(me=o.RGBA4),te===o.UNSIGNED_SHORT_5_5_5_1&&(me=o.RGB5_A1)}return(me===o.R16F||me===o.R32F||me===o.RG16F||me===o.RG32F||me===o.RGBA16F||me===o.RGBA32F)&&e.get("EXT_color_buffer_float"),me}function b(P,w){let te;return P?w===null||w===vs||w===So?te=o.DEPTH24_STENCIL8:w===Ei?te=o.DEPTH32F_STENCIL8:w===Aa&&(te=o.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===vs||w===So?te=o.DEPTH_COMPONENT24:w===Ei?te=o.DEPTH_COMPONENT32F:w===Aa&&(te=o.DEPTH_COMPONENT16),te}function V(P,w){return S(P)===!0||P.isFramebufferTexture&&P.minFilter!==On&&P.minFilter!==ei?Math.log2(Math.max(w.width,w.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?w.mipmaps.length:1}function k(P){const w=P.target;w.removeEventListener("dispose",k),X(w),w.isVideoTexture&&m.delete(w)}function F(P){const w=P.target;w.removeEventListener("dispose",F),R(w)}function X(P){const w=i.get(P);if(w.__webglInit===void 0)return;const te=P.source,ve=_.get(te);if(ve){const ye=ve[w.__cacheKey];ye.usedTimes--,ye.usedTimes===0&&C(P),Object.keys(ve).length===0&&_.delete(te)}i.remove(P)}function C(P){const w=i.get(P);o.deleteTexture(w.__webglTexture);const te=P.source,ve=_.get(te);delete ve[w.__cacheKey],c.memory.textures--}function R(P){const w=i.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),i.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let ve=0;ve<6;ve++){if(Array.isArray(w.__webglFramebuffer[ve]))for(let ye=0;ye<w.__webglFramebuffer[ve].length;ye++)o.deleteFramebuffer(w.__webglFramebuffer[ve][ye]);else o.deleteFramebuffer(w.__webglFramebuffer[ve]);w.__webglDepthbuffer&&o.deleteRenderbuffer(w.__webglDepthbuffer[ve])}else{if(Array.isArray(w.__webglFramebuffer))for(let ve=0;ve<w.__webglFramebuffer.length;ve++)o.deleteFramebuffer(w.__webglFramebuffer[ve]);else o.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&o.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&o.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let ve=0;ve<w.__webglColorRenderbuffer.length;ve++)w.__webglColorRenderbuffer[ve]&&o.deleteRenderbuffer(w.__webglColorRenderbuffer[ve]);w.__webglDepthRenderbuffer&&o.deleteRenderbuffer(w.__webglDepthRenderbuffer)}const te=P.textures;for(let ve=0,ye=te.length;ve<ye;ve++){const me=i.get(te[ve]);me.__webglTexture&&(o.deleteTexture(me.__webglTexture),c.memory.textures--),i.remove(te[ve])}i.remove(P)}let H=0;function J(){H=0}function K(){const P=H;return P>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+s.maxTextures),H+=1,P}function fe(P){const w=[];return w.push(P.wrapS),w.push(P.wrapT),w.push(P.wrapR||0),w.push(P.magFilter),w.push(P.minFilter),w.push(P.anisotropy),w.push(P.internalFormat),w.push(P.format),w.push(P.type),w.push(P.generateMipmaps),w.push(P.premultiplyAlpha),w.push(P.flipY),w.push(P.unpackAlignment),w.push(P.colorSpace),w.join()}function ue(P,w){const te=i.get(P);if(P.isVideoTexture&&Ke(P),P.isRenderTargetTexture===!1&&P.version>0&&te.__version!==P.version){const ve=P.image;if(ve===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ve.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Q(te,P,w);return}}t.bindTexture(o.TEXTURE_2D,te.__webglTexture,o.TEXTURE0+w)}function ce(P,w){const te=i.get(P);if(P.version>0&&te.__version!==P.version){Q(te,P,w);return}t.bindTexture(o.TEXTURE_2D_ARRAY,te.__webglTexture,o.TEXTURE0+w)}function de(P,w){const te=i.get(P);if(P.version>0&&te.__version!==P.version){Q(te,P,w);return}t.bindTexture(o.TEXTURE_3D,te.__webglTexture,o.TEXTURE0+w)}function O(P,w){const te=i.get(P);if(P.version>0&&te.__version!==P.version){he(te,P,w);return}t.bindTexture(o.TEXTURE_CUBE_MAP,te.__webglTexture,o.TEXTURE0+w)}const le={[yo]:o.REPEAT,[zr]:o.CLAMP_TO_EDGE,[Ec]:o.MIRRORED_REPEAT},oe={[On]:o.NEAREST,[A_]:o.NEAREST_MIPMAP_NEAREST,[Sa]:o.NEAREST_MIPMAP_LINEAR,[ei]:o.LINEAR,[mc]:o.LINEAR_MIPMAP_NEAREST,[sr]:o.LINEAR_MIPMAP_LINEAR},U={[Hx]:o.NEVER,[Yx]:o.ALWAYS,[Vx]:o.LESS,[O_]:o.LEQUAL,[Gx]:o.EQUAL,[Xx]:o.GEQUAL,[Wx]:o.GREATER,[jx]:o.NOTEQUAL};function ne(P,w){if(w.type===Ei&&e.has("OES_texture_float_linear")===!1&&(w.magFilter===ei||w.magFilter===mc||w.magFilter===Sa||w.magFilter===sr||w.minFilter===ei||w.minFilter===mc||w.minFilter===Sa||w.minFilter===sr)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),o.texParameteri(P,o.TEXTURE_WRAP_S,le[w.wrapS]),o.texParameteri(P,o.TEXTURE_WRAP_T,le[w.wrapT]),(P===o.TEXTURE_3D||P===o.TEXTURE_2D_ARRAY)&&o.texParameteri(P,o.TEXTURE_WRAP_R,le[w.wrapR]),o.texParameteri(P,o.TEXTURE_MAG_FILTER,oe[w.magFilter]),o.texParameteri(P,o.TEXTURE_MIN_FILTER,oe[w.minFilter]),w.compareFunction&&(o.texParameteri(P,o.TEXTURE_COMPARE_MODE,o.COMPARE_REF_TO_TEXTURE),o.texParameteri(P,o.TEXTURE_COMPARE_FUNC,U[w.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===On||w.minFilter!==Sa&&w.minFilter!==sr||w.type===Ei&&e.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||i.get(w).__currentAnisotropy){const te=e.get("EXT_texture_filter_anisotropic");o.texParameterf(P,te.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,s.getMaxAnisotropy())),i.get(w).__currentAnisotropy=w.anisotropy}}}function Le(P,w){let te=!1;P.__webglInit===void 0&&(P.__webglInit=!0,w.addEventListener("dispose",k));const ve=w.source;let ye=_.get(ve);ye===void 0&&(ye={},_.set(ve,ye));const me=fe(w);if(me!==P.__cacheKey){ye[me]===void 0&&(ye[me]={texture:o.createTexture(),usedTimes:0},c.memory.textures++,te=!0),ye[me].usedTimes++;const Xe=ye[P.__cacheKey];Xe!==void 0&&(ye[P.__cacheKey].usedTimes--,Xe.usedTimes===0&&C(w)),P.__cacheKey=me,P.__webglTexture=ye[me].texture}return te}function Q(P,w,te){let ve=o.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(ve=o.TEXTURE_2D_ARRAY),w.isData3DTexture&&(ve=o.TEXTURE_3D);const ye=Le(P,w),me=w.source;t.bindTexture(ve,P.__webglTexture,o.TEXTURE0+te);const Xe=i.get(me);if(me.version!==Xe.__version||ye===!0){t.activeTexture(o.TEXTURE0+te);const be=At.getPrimaries(At.workingColorSpace),ke=w.colorSpace===Br?null:At.getPrimaries(w.colorSpace),ht=w.colorSpace===Br||be===ke?o.NONE:o.BROWSER_DEFAULT_WEBGL;o.pixelStorei(o.UNPACK_FLIP_Y_WEBGL,w.flipY),o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),o.pixelStorei(o.UNPACK_ALIGNMENT,w.unpackAlignment),o.pixelStorei(o.UNPACK_COLORSPACE_CONVERSION_WEBGL,ht);let Ee=E(w.image,!1,s.maxTextureSize);Ee=Dt(w,Ee);const Be=a.convert(w.format,w.colorSpace),Ye=a.convert(w.type);let nt=L(w.internalFormat,Be,Ye,w.colorSpace,w.isVideoTexture);ne(ve,w);let ze;const _t=w.mipmaps,dt=w.isVideoTexture!==!0,Ct=Xe.__version===void 0||ye===!0,j=me.dataReady,Ce=V(w,Ee);if(w.isDepthTexture)nt=b(w.format===Mo,w.type),Ct&&(dt?t.texStorage2D(o.TEXTURE_2D,1,nt,Ee.width,Ee.height):t.texImage2D(o.TEXTURE_2D,0,nt,Ee.width,Ee.height,0,Be,Ye,null));else if(w.isDataTexture)if(_t.length>0){dt&&Ct&&t.texStorage2D(o.TEXTURE_2D,Ce,nt,_t[0].width,_t[0].height);for(let ae=0,_e=_t.length;ae<_e;ae++)ze=_t[ae],dt?j&&t.texSubImage2D(o.TEXTURE_2D,ae,0,0,ze.width,ze.height,Be,Ye,ze.data):t.texImage2D(o.TEXTURE_2D,ae,nt,ze.width,ze.height,0,Be,Ye,ze.data);w.generateMipmaps=!1}else dt?(Ct&&t.texStorage2D(o.TEXTURE_2D,Ce,nt,Ee.width,Ee.height),j&&t.texSubImage2D(o.TEXTURE_2D,0,0,0,Ee.width,Ee.height,Be,Ye,Ee.data)):t.texImage2D(o.TEXTURE_2D,0,nt,Ee.width,Ee.height,0,Be,Ye,Ee.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){dt&&Ct&&t.texStorage3D(o.TEXTURE_2D_ARRAY,Ce,nt,_t[0].width,_t[0].height,Ee.depth);for(let ae=0,_e=_t.length;ae<_e;ae++)if(ze=_t[ae],w.format!==ci)if(Be!==null)if(dt){if(j)if(w.layerUpdates.size>0){const Ie=Vg(ze.width,ze.height,w.format,w.type);for(const Ne of w.layerUpdates){const at=ze.data.subarray(Ne*Ie/ze.data.BYTES_PER_ELEMENT,(Ne+1)*Ie/ze.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(o.TEXTURE_2D_ARRAY,ae,0,0,Ne,ze.width,ze.height,1,Be,at)}w.clearLayerUpdates()}else t.compressedTexSubImage3D(o.TEXTURE_2D_ARRAY,ae,0,0,0,ze.width,ze.height,Ee.depth,Be,ze.data)}else t.compressedTexImage3D(o.TEXTURE_2D_ARRAY,ae,nt,ze.width,ze.height,Ee.depth,0,ze.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else dt?j&&t.texSubImage3D(o.TEXTURE_2D_ARRAY,ae,0,0,0,ze.width,ze.height,Ee.depth,Be,Ye,ze.data):t.texImage3D(o.TEXTURE_2D_ARRAY,ae,nt,ze.width,ze.height,Ee.depth,0,Be,Ye,ze.data)}else{dt&&Ct&&t.texStorage2D(o.TEXTURE_2D,Ce,nt,_t[0].width,_t[0].height);for(let ae=0,_e=_t.length;ae<_e;ae++)ze=_t[ae],w.format!==ci?Be!==null?dt?j&&t.compressedTexSubImage2D(o.TEXTURE_2D,ae,0,0,ze.width,ze.height,Be,ze.data):t.compressedTexImage2D(o.TEXTURE_2D,ae,nt,ze.width,ze.height,0,ze.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):dt?j&&t.texSubImage2D(o.TEXTURE_2D,ae,0,0,ze.width,ze.height,Be,Ye,ze.data):t.texImage2D(o.TEXTURE_2D,ae,nt,ze.width,ze.height,0,Be,Ye,ze.data)}else if(w.isDataArrayTexture)if(dt){if(Ct&&t.texStorage3D(o.TEXTURE_2D_ARRAY,Ce,nt,Ee.width,Ee.height,Ee.depth),j)if(w.layerUpdates.size>0){const ae=Vg(Ee.width,Ee.height,w.format,w.type);for(const _e of w.layerUpdates){const Ie=Ee.data.subarray(_e*ae/Ee.data.BYTES_PER_ELEMENT,(_e+1)*ae/Ee.data.BYTES_PER_ELEMENT);t.texSubImage3D(o.TEXTURE_2D_ARRAY,0,0,0,_e,Ee.width,Ee.height,1,Be,Ye,Ie)}w.clearLayerUpdates()}else t.texSubImage3D(o.TEXTURE_2D_ARRAY,0,0,0,0,Ee.width,Ee.height,Ee.depth,Be,Ye,Ee.data)}else t.texImage3D(o.TEXTURE_2D_ARRAY,0,nt,Ee.width,Ee.height,Ee.depth,0,Be,Ye,Ee.data);else if(w.isData3DTexture)dt?(Ct&&t.texStorage3D(o.TEXTURE_3D,Ce,nt,Ee.width,Ee.height,Ee.depth),j&&t.texSubImage3D(o.TEXTURE_3D,0,0,0,0,Ee.width,Ee.height,Ee.depth,Be,Ye,Ee.data)):t.texImage3D(o.TEXTURE_3D,0,nt,Ee.width,Ee.height,Ee.depth,0,Be,Ye,Ee.data);else if(w.isFramebufferTexture){if(Ct)if(dt)t.texStorage2D(o.TEXTURE_2D,Ce,nt,Ee.width,Ee.height);else{let ae=Ee.width,_e=Ee.height;for(let Ie=0;Ie<Ce;Ie++)t.texImage2D(o.TEXTURE_2D,Ie,nt,ae,_e,0,Be,Ye,null),ae>>=1,_e>>=1}}else if(_t.length>0){if(dt&&Ct){const ae=We(_t[0]);t.texStorage2D(o.TEXTURE_2D,Ce,nt,ae.width,ae.height)}for(let ae=0,_e=_t.length;ae<_e;ae++)ze=_t[ae],dt?j&&t.texSubImage2D(o.TEXTURE_2D,ae,0,0,Be,Ye,ze):t.texImage2D(o.TEXTURE_2D,ae,nt,Be,Ye,ze);w.generateMipmaps=!1}else if(dt){if(Ct){const ae=We(Ee);t.texStorage2D(o.TEXTURE_2D,Ce,nt,ae.width,ae.height)}j&&t.texSubImage2D(o.TEXTURE_2D,0,0,0,Be,Ye,Ee)}else t.texImage2D(o.TEXTURE_2D,0,nt,Be,Ye,Ee);S(w)&&x(ve),Xe.__version=me.version,w.onUpdate&&w.onUpdate(w)}P.__version=w.version}function he(P,w,te){if(w.image.length!==6)return;const ve=Le(P,w),ye=w.source;t.bindTexture(o.TEXTURE_CUBE_MAP,P.__webglTexture,o.TEXTURE0+te);const me=i.get(ye);if(ye.version!==me.__version||ve===!0){t.activeTexture(o.TEXTURE0+te);const Xe=At.getPrimaries(At.workingColorSpace),be=w.colorSpace===Br?null:At.getPrimaries(w.colorSpace),ke=w.colorSpace===Br||Xe===be?o.NONE:o.BROWSER_DEFAULT_WEBGL;o.pixelStorei(o.UNPACK_FLIP_Y_WEBGL,w.flipY),o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),o.pixelStorei(o.UNPACK_ALIGNMENT,w.unpackAlignment),o.pixelStorei(o.UNPACK_COLORSPACE_CONVERSION_WEBGL,ke);const ht=w.isCompressedTexture||w.image[0].isCompressedTexture,Ee=w.image[0]&&w.image[0].isDataTexture,Be=[];for(let _e=0;_e<6;_e++)!ht&&!Ee?Be[_e]=E(w.image[_e],!0,s.maxCubemapSize):Be[_e]=Ee?w.image[_e].image:w.image[_e],Be[_e]=Dt(w,Be[_e]);const Ye=Be[0],nt=a.convert(w.format,w.colorSpace),ze=a.convert(w.type),_t=L(w.internalFormat,nt,ze,w.colorSpace),dt=w.isVideoTexture!==!0,Ct=me.__version===void 0||ve===!0,j=ye.dataReady;let Ce=V(w,Ye);ne(o.TEXTURE_CUBE_MAP,w);let ae;if(ht){dt&&Ct&&t.texStorage2D(o.TEXTURE_CUBE_MAP,Ce,_t,Ye.width,Ye.height);for(let _e=0;_e<6;_e++){ae=Be[_e].mipmaps;for(let Ie=0;Ie<ae.length;Ie++){const Ne=ae[Ie];w.format!==ci?nt!==null?dt?j&&t.compressedTexSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Ie,0,0,Ne.width,Ne.height,nt,Ne.data):t.compressedTexImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Ie,_t,Ne.width,Ne.height,0,Ne.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):dt?j&&t.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Ie,0,0,Ne.width,Ne.height,nt,ze,Ne.data):t.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Ie,_t,Ne.width,Ne.height,0,nt,ze,Ne.data)}}}else{if(ae=w.mipmaps,dt&&Ct){ae.length>0&&Ce++;const _e=We(Be[0]);t.texStorage2D(o.TEXTURE_CUBE_MAP,Ce,_t,_e.width,_e.height)}for(let _e=0;_e<6;_e++)if(Ee){dt?j&&t.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,0,0,Be[_e].width,Be[_e].height,nt,ze,Be[_e].data):t.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,_t,Be[_e].width,Be[_e].height,0,nt,ze,Be[_e].data);for(let Ie=0;Ie<ae.length;Ie++){const at=ae[Ie].image[_e].image;dt?j&&t.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Ie+1,0,0,at.width,at.height,nt,ze,at.data):t.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Ie+1,_t,at.width,at.height,0,nt,ze,at.data)}}else{dt?j&&t.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,0,0,nt,ze,Be[_e]):t.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,_t,nt,ze,Be[_e]);for(let Ie=0;Ie<ae.length;Ie++){const Ne=ae[Ie];dt?j&&t.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Ie+1,0,0,nt,ze,Ne.image[_e]):t.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Ie+1,_t,nt,ze,Ne.image[_e])}}}S(w)&&x(o.TEXTURE_CUBE_MAP),me.__version=ye.version,w.onUpdate&&w.onUpdate(w)}P.__version=w.version}function ge(P,w,te,ve,ye,me){const Xe=a.convert(te.format,te.colorSpace),be=a.convert(te.type),ke=L(te.internalFormat,Xe,be,te.colorSpace),ht=i.get(w),Ee=i.get(te);if(Ee.__renderTarget=w,!ht.__hasExternalTextures){const Be=Math.max(1,w.width>>me),Ye=Math.max(1,w.height>>me);ye===o.TEXTURE_3D||ye===o.TEXTURE_2D_ARRAY?t.texImage3D(ye,me,ke,Be,Ye,w.depth,0,Xe,be,null):t.texImage2D(ye,me,ke,Be,Ye,0,Xe,be,null)}t.bindFramebuffer(o.FRAMEBUFFER,P),gt(w)?u.framebufferTexture2DMultisampleEXT(o.FRAMEBUFFER,ve,ye,Ee.__webglTexture,0,it(w)):(ye===o.TEXTURE_2D||ye>=o.TEXTURE_CUBE_MAP_POSITIVE_X&&ye<=o.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&o.framebufferTexture2D(o.FRAMEBUFFER,ve,ye,Ee.__webglTexture,me),t.bindFramebuffer(o.FRAMEBUFFER,null)}function pe(P,w,te){if(o.bindRenderbuffer(o.RENDERBUFFER,P),w.depthBuffer){const ve=w.depthTexture,ye=ve&&ve.isDepthTexture?ve.type:null,me=b(w.stencilBuffer,ye),Xe=w.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT,be=it(w);gt(w)?u.renderbufferStorageMultisampleEXT(o.RENDERBUFFER,be,me,w.width,w.height):te?o.renderbufferStorageMultisample(o.RENDERBUFFER,be,me,w.width,w.height):o.renderbufferStorage(o.RENDERBUFFER,me,w.width,w.height),o.framebufferRenderbuffer(o.FRAMEBUFFER,Xe,o.RENDERBUFFER,P)}else{const ve=w.textures;for(let ye=0;ye<ve.length;ye++){const me=ve[ye],Xe=a.convert(me.format,me.colorSpace),be=a.convert(me.type),ke=L(me.internalFormat,Xe,be,me.colorSpace),ht=it(w);te&&gt(w)===!1?o.renderbufferStorageMultisample(o.RENDERBUFFER,ht,ke,w.width,w.height):gt(w)?u.renderbufferStorageMultisampleEXT(o.RENDERBUFFER,ht,ke,w.width,w.height):o.renderbufferStorage(o.RENDERBUFFER,ke,w.width,w.height)}}o.bindRenderbuffer(o.RENDERBUFFER,null)}function Re(P,w){if(w&&w.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(o.FRAMEBUFFER,P),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ve=i.get(w.depthTexture);ve.__renderTarget=w,(!ve.__webglTexture||w.depthTexture.image.width!==w.width||w.depthTexture.image.height!==w.height)&&(w.depthTexture.image.width=w.width,w.depthTexture.image.height=w.height,w.depthTexture.needsUpdate=!0),ue(w.depthTexture,0);const ye=ve.__webglTexture,me=it(w);if(w.depthTexture.format===po)gt(w)?u.framebufferTexture2DMultisampleEXT(o.FRAMEBUFFER,o.DEPTH_ATTACHMENT,o.TEXTURE_2D,ye,0,me):o.framebufferTexture2D(o.FRAMEBUFFER,o.DEPTH_ATTACHMENT,o.TEXTURE_2D,ye,0);else if(w.depthTexture.format===Mo)gt(w)?u.framebufferTexture2DMultisampleEXT(o.FRAMEBUFFER,o.DEPTH_STENCIL_ATTACHMENT,o.TEXTURE_2D,ye,0,me):o.framebufferTexture2D(o.FRAMEBUFFER,o.DEPTH_STENCIL_ATTACHMENT,o.TEXTURE_2D,ye,0);else throw new Error("Unknown depthTexture format")}function Pe(P){const w=i.get(P),te=P.isWebGLCubeRenderTarget===!0;if(w.__boundDepthTexture!==P.depthTexture){const ve=P.depthTexture;if(w.__depthDisposeCallback&&w.__depthDisposeCallback(),ve){const ye=()=>{delete w.__boundDepthTexture,delete w.__depthDisposeCallback,ve.removeEventListener("dispose",ye)};ve.addEventListener("dispose",ye),w.__depthDisposeCallback=ye}w.__boundDepthTexture=ve}if(P.depthTexture&&!w.__autoAllocateDepthBuffer){if(te)throw new Error("target.depthTexture not supported in Cube render targets");Re(w.__webglFramebuffer,P)}else if(te){w.__webglDepthbuffer=[];for(let ve=0;ve<6;ve++)if(t.bindFramebuffer(o.FRAMEBUFFER,w.__webglFramebuffer[ve]),w.__webglDepthbuffer[ve]===void 0)w.__webglDepthbuffer[ve]=o.createRenderbuffer(),pe(w.__webglDepthbuffer[ve],P,!1);else{const ye=P.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT,me=w.__webglDepthbuffer[ve];o.bindRenderbuffer(o.RENDERBUFFER,me),o.framebufferRenderbuffer(o.FRAMEBUFFER,ye,o.RENDERBUFFER,me)}}else if(t.bindFramebuffer(o.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer===void 0)w.__webglDepthbuffer=o.createRenderbuffer(),pe(w.__webglDepthbuffer,P,!1);else{const ve=P.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT,ye=w.__webglDepthbuffer;o.bindRenderbuffer(o.RENDERBUFFER,ye),o.framebufferRenderbuffer(o.FRAMEBUFFER,ve,o.RENDERBUFFER,ye)}t.bindFramebuffer(o.FRAMEBUFFER,null)}function Oe(P,w,te){const ve=i.get(P);w!==void 0&&ge(ve.__webglFramebuffer,P,P.texture,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,0),te!==void 0&&Pe(P)}function Et(P){const w=P.texture,te=i.get(P),ve=i.get(w);P.addEventListener("dispose",F);const ye=P.textures,me=P.isWebGLCubeRenderTarget===!0,Xe=ye.length>1;if(Xe||(ve.__webglTexture===void 0&&(ve.__webglTexture=o.createTexture()),ve.__version=w.version,c.memory.textures++),me){te.__webglFramebuffer=[];for(let be=0;be<6;be++)if(w.mipmaps&&w.mipmaps.length>0){te.__webglFramebuffer[be]=[];for(let ke=0;ke<w.mipmaps.length;ke++)te.__webglFramebuffer[be][ke]=o.createFramebuffer()}else te.__webglFramebuffer[be]=o.createFramebuffer()}else{if(w.mipmaps&&w.mipmaps.length>0){te.__webglFramebuffer=[];for(let be=0;be<w.mipmaps.length;be++)te.__webglFramebuffer[be]=o.createFramebuffer()}else te.__webglFramebuffer=o.createFramebuffer();if(Xe)for(let be=0,ke=ye.length;be<ke;be++){const ht=i.get(ye[be]);ht.__webglTexture===void 0&&(ht.__webglTexture=o.createTexture(),c.memory.textures++)}if(P.samples>0&&gt(P)===!1){te.__webglMultisampledFramebuffer=o.createFramebuffer(),te.__webglColorRenderbuffer=[],t.bindFramebuffer(o.FRAMEBUFFER,te.__webglMultisampledFramebuffer);for(let be=0;be<ye.length;be++){const ke=ye[be];te.__webglColorRenderbuffer[be]=o.createRenderbuffer(),o.bindRenderbuffer(o.RENDERBUFFER,te.__webglColorRenderbuffer[be]);const ht=a.convert(ke.format,ke.colorSpace),Ee=a.convert(ke.type),Be=L(ke.internalFormat,ht,Ee,ke.colorSpace,P.isXRRenderTarget===!0),Ye=it(P);o.renderbufferStorageMultisample(o.RENDERBUFFER,Ye,Be,P.width,P.height),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0+be,o.RENDERBUFFER,te.__webglColorRenderbuffer[be])}o.bindRenderbuffer(o.RENDERBUFFER,null),P.depthBuffer&&(te.__webglDepthRenderbuffer=o.createRenderbuffer(),pe(te.__webglDepthRenderbuffer,P,!0)),t.bindFramebuffer(o.FRAMEBUFFER,null)}}if(me){t.bindTexture(o.TEXTURE_CUBE_MAP,ve.__webglTexture),ne(o.TEXTURE_CUBE_MAP,w);for(let be=0;be<6;be++)if(w.mipmaps&&w.mipmaps.length>0)for(let ke=0;ke<w.mipmaps.length;ke++)ge(te.__webglFramebuffer[be][ke],P,w,o.COLOR_ATTACHMENT0,o.TEXTURE_CUBE_MAP_POSITIVE_X+be,ke);else ge(te.__webglFramebuffer[be],P,w,o.COLOR_ATTACHMENT0,o.TEXTURE_CUBE_MAP_POSITIVE_X+be,0);S(w)&&x(o.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Xe){for(let be=0,ke=ye.length;be<ke;be++){const ht=ye[be],Ee=i.get(ht);t.bindTexture(o.TEXTURE_2D,Ee.__webglTexture),ne(o.TEXTURE_2D,ht),ge(te.__webglFramebuffer,P,ht,o.COLOR_ATTACHMENT0+be,o.TEXTURE_2D,0),S(ht)&&x(o.TEXTURE_2D)}t.unbindTexture()}else{let be=o.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(be=P.isWebGL3DRenderTarget?o.TEXTURE_3D:o.TEXTURE_2D_ARRAY),t.bindTexture(be,ve.__webglTexture),ne(be,w),w.mipmaps&&w.mipmaps.length>0)for(let ke=0;ke<w.mipmaps.length;ke++)ge(te.__webglFramebuffer[ke],P,w,o.COLOR_ATTACHMENT0,be,ke);else ge(te.__webglFramebuffer,P,w,o.COLOR_ATTACHMENT0,be,0);S(w)&&x(be),t.unbindTexture()}P.depthBuffer&&Pe(P)}function st(P){const w=P.textures;for(let te=0,ve=w.length;te<ve;te++){const ye=w[te];if(S(ye)){const me=D(P),Xe=i.get(ye).__webglTexture;t.bindTexture(me,Xe),x(me),t.unbindTexture()}}}const Rt=[],B=[];function Yt(P){if(P.samples>0){if(gt(P)===!1){const w=P.textures,te=P.width,ve=P.height;let ye=o.COLOR_BUFFER_BIT;const me=P.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT,Xe=i.get(P),be=w.length>1;if(be)for(let ke=0;ke<w.length;ke++)t.bindFramebuffer(o.FRAMEBUFFER,Xe.__webglMultisampledFramebuffer),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0+ke,o.RENDERBUFFER,null),t.bindFramebuffer(o.FRAMEBUFFER,Xe.__webglFramebuffer),o.framebufferTexture2D(o.DRAW_FRAMEBUFFER,o.COLOR_ATTACHMENT0+ke,o.TEXTURE_2D,null,0);t.bindFramebuffer(o.READ_FRAMEBUFFER,Xe.__webglMultisampledFramebuffer),t.bindFramebuffer(o.DRAW_FRAMEBUFFER,Xe.__webglFramebuffer);for(let ke=0;ke<w.length;ke++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(ye|=o.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(ye|=o.STENCIL_BUFFER_BIT)),be){o.framebufferRenderbuffer(o.READ_FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.RENDERBUFFER,Xe.__webglColorRenderbuffer[ke]);const ht=i.get(w[ke]).__webglTexture;o.framebufferTexture2D(o.DRAW_FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,ht,0)}o.blitFramebuffer(0,0,te,ve,0,0,te,ve,ye,o.NEAREST),h===!0&&(Rt.length=0,B.length=0,Rt.push(o.COLOR_ATTACHMENT0+ke),P.depthBuffer&&P.resolveDepthBuffer===!1&&(Rt.push(me),B.push(me),o.invalidateFramebuffer(o.DRAW_FRAMEBUFFER,B)),o.invalidateFramebuffer(o.READ_FRAMEBUFFER,Rt))}if(t.bindFramebuffer(o.READ_FRAMEBUFFER,null),t.bindFramebuffer(o.DRAW_FRAMEBUFFER,null),be)for(let ke=0;ke<w.length;ke++){t.bindFramebuffer(o.FRAMEBUFFER,Xe.__webglMultisampledFramebuffer),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0+ke,o.RENDERBUFFER,Xe.__webglColorRenderbuffer[ke]);const ht=i.get(w[ke]).__webglTexture;t.bindFramebuffer(o.FRAMEBUFFER,Xe.__webglFramebuffer),o.framebufferTexture2D(o.DRAW_FRAMEBUFFER,o.COLOR_ATTACHMENT0+ke,o.TEXTURE_2D,ht,0)}t.bindFramebuffer(o.DRAW_FRAMEBUFFER,Xe.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.resolveDepthBuffer===!1&&h){const w=P.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT;o.invalidateFramebuffer(o.DRAW_FRAMEBUFFER,[w])}}}function it(P){return Math.min(s.maxSamples,P.samples)}function gt(P){const w=i.get(P);return P.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function Ke(P){const w=c.render.frame;m.get(P)!==w&&(m.set(P,w),P.update())}function Dt(P,w){const te=P.colorSpace,ve=P.format,ye=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||te!==Bn&&te!==Br&&(At.getTransfer(te)===zt?(ve!==ci||ye!==cr)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",te)),w}function We(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(f.width=P.naturalWidth||P.width,f.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(f.width=P.displayWidth,f.height=P.displayHeight):(f.width=P.width,f.height=P.height),f}this.allocateTextureUnit=K,this.resetTextureUnits=J,this.setTexture2D=ue,this.setTexture2DArray=ce,this.setTexture3D=de,this.setTextureCube=O,this.rebindTextures=Oe,this.setupRenderTarget=Et,this.updateRenderTargetMipmap=st,this.updateMultisampleRenderTarget=Yt,this.setupDepthRenderbuffer=Pe,this.setupFrameBufferTexture=ge,this.useMultisampledRTT=gt}function tA(o,e){function t(i,s=Br){let a;const c=At.getTransfer(s);if(i===cr)return o.UNSIGNED_BYTE;if(i===Yh)return o.UNSIGNED_SHORT_4_4_4_4;if(i===qh)return o.UNSIGNED_SHORT_5_5_5_1;if(i===C_)return o.UNSIGNED_INT_5_9_9_9_REV;if(i===R_)return o.BYTE;if(i===b_)return o.SHORT;if(i===Aa)return o.UNSIGNED_SHORT;if(i===Xh)return o.INT;if(i===vs)return o.UNSIGNED_INT;if(i===Ei)return o.FLOAT;if(i===Pa)return o.HALF_FLOAT;if(i===P_)return o.ALPHA;if(i===L_)return o.RGB;if(i===ci)return o.RGBA;if(i===N_)return o.LUMINANCE;if(i===D_)return o.LUMINANCE_ALPHA;if(i===po)return o.DEPTH_COMPONENT;if(i===Mo)return o.DEPTH_STENCIL;if(i===Kh)return o.RED;if(i===$h)return o.RED_INTEGER;if(i===I_)return o.RG;if(i===Zh)return o.RG_INTEGER;if(i===Qh)return o.RGBA_INTEGER;if(i===gc||i===_c||i===vc||i===xc)if(c===zt)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(i===gc)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===_c)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===vc)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===xc)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(i===gc)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===_c)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===vc)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===xc)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===uh||i===dh||i===hh||i===fh)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(i===uh)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===dh)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===hh)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===fh)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===ph||i===mh||i===gh)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(i===ph||i===mh)return c===zt?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(i===gh)return c===zt?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===_h||i===vh||i===xh||i===yh||i===Sh||i===Mh||i===Eh||i===Th||i===wh||i===Ah||i===Rh||i===bh||i===Ch||i===Ph)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(i===_h)return c===zt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===vh)return c===zt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===xh)return c===zt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===yh)return c===zt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Sh)return c===zt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Mh)return c===zt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Eh)return c===zt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Th)return c===zt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===wh)return c===zt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Ah)return c===zt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Rh)return c===zt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===bh)return c===zt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Ch)return c===zt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Ph)return c===zt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===yc||i===Lh||i===Nh)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(i===yc)return c===zt?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Lh)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Nh)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===U_||i===Dh||i===Ih||i===Uh)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(i===yc)return a.COMPRESSED_RED_RGTC1_EXT;if(i===Dh)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Ih)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Uh)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===So?o.UNSIGNED_INT_24_8:o[i]!==void 0?o[i]:null}return{convert:t}}const nA={type:"move"};class qd{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Hr,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Hr,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new Y,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new Y),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Hr,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new Y,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new Y),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,a=null,c=null;const u=this._targetRay,h=this._grip,f=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(f&&e.hand){c=!0;for(const E of e.hand.values()){const S=t.getJointPose(E,i),x=this._getHandJoint(f,E);S!==null&&(x.matrix.fromArray(S.transform.matrix),x.matrix.decompose(x.position,x.rotation,x.scale),x.matrixWorldNeedsUpdate=!0,x.jointRadius=S.radius),x.visible=S!==null}const m=f.joints["index-finger-tip"],g=f.joints["thumb-tip"],_=m.position.distanceTo(g.position),y=.02,M=.005;f.inputState.pinching&&_>y+M?(f.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!f.inputState.pinching&&_<=y-M&&(f.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else h!==null&&e.gripSpace&&(a=t.getPose(e.gripSpace,i),a!==null&&(h.matrix.fromArray(a.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,a.linearVelocity?(h.hasLinearVelocity=!0,h.linearVelocity.copy(a.linearVelocity)):h.hasLinearVelocity=!1,a.angularVelocity?(h.hasAngularVelocity=!0,h.angularVelocity.copy(a.angularVelocity)):h.hasAngularVelocity=!1));u!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&a!==null&&(s=a),s!==null&&(u.matrix.fromArray(s.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,s.linearVelocity?(u.hasLinearVelocity=!0,u.linearVelocity.copy(s.linearVelocity)):u.hasLinearVelocity=!1,s.angularVelocity?(u.hasAngularVelocity=!0,u.angularVelocity.copy(s.angularVelocity)):u.hasAngularVelocity=!1,this.dispatchEvent(nA)))}return u!==null&&(u.visible=s!==null),h!==null&&(h.visible=a!==null),f!==null&&(f.visible=c!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Hr;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const iA=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,rA=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class sA{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,i){if(this.texture===null){const s=new _n,a=e.properties.get(s);a.__webglTexture=t.texture,(t.depthNear!=i.depthNear||t.depthFar!=i.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new jr({vertexShader:iA,fragmentShader:rA,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Ht(new Pc(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class oA extends Ms{constructor(e,t){super();const i=this;let s=null,a=1,c=null,u="local-floor",h=1,f=null,m=null,g=null,_=null,y=null,M=null;const E=new sA,S=t.getContextAttributes();let x=null,D=null;const L=[],b=[],V=new ot;let k=null;const F=new Un;F.viewport=new It;const X=new Un;X.viewport=new It;const C=[F,X],R=new pS;let H=null,J=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Q){let he=L[Q];return he===void 0&&(he=new qd,L[Q]=he),he.getTargetRaySpace()},this.getControllerGrip=function(Q){let he=L[Q];return he===void 0&&(he=new qd,L[Q]=he),he.getGripSpace()},this.getHand=function(Q){let he=L[Q];return he===void 0&&(he=new qd,L[Q]=he),he.getHandSpace()};function K(Q){const he=b.indexOf(Q.inputSource);if(he===-1)return;const ge=L[he];ge!==void 0&&(ge.update(Q.inputSource,Q.frame,f||c),ge.dispatchEvent({type:Q.type,data:Q.inputSource}))}function fe(){s.removeEventListener("select",K),s.removeEventListener("selectstart",K),s.removeEventListener("selectend",K),s.removeEventListener("squeeze",K),s.removeEventListener("squeezestart",K),s.removeEventListener("squeezeend",K),s.removeEventListener("end",fe),s.removeEventListener("inputsourceschange",ue);for(let Q=0;Q<L.length;Q++){const he=b[Q];he!==null&&(b[Q]=null,L[Q].disconnect(he))}H=null,J=null,E.reset(),e.setRenderTarget(x),y=null,_=null,g=null,s=null,D=null,Le.stop(),i.isPresenting=!1,e.setPixelRatio(k),e.setSize(V.width,V.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Q){a=Q,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Q){u=Q,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return f||c},this.setReferenceSpace=function(Q){f=Q},this.getBaseLayer=function(){return _!==null?_:y},this.getBinding=function(){return g},this.getFrame=function(){return M},this.getSession=function(){return s},this.setSession=async function(Q){if(s=Q,s!==null){if(x=e.getRenderTarget(),s.addEventListener("select",K),s.addEventListener("selectstart",K),s.addEventListener("selectend",K),s.addEventListener("squeeze",K),s.addEventListener("squeezestart",K),s.addEventListener("squeezeend",K),s.addEventListener("end",fe),s.addEventListener("inputsourceschange",ue),S.xrCompatible!==!0&&await t.makeXRCompatible(),k=e.getPixelRatio(),e.getSize(V),s.renderState.layers===void 0){const he={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:a};y=new XRWebGLLayer(s,t,he),s.updateRenderState({baseLayer:y}),e.setPixelRatio(1),e.setSize(y.framebufferWidth,y.framebufferHeight,!1),D=new xs(y.framebufferWidth,y.framebufferHeight,{format:ci,type:cr,colorSpace:e.outputColorSpace,stencilBuffer:S.stencil})}else{let he=null,ge=null,pe=null;S.depth&&(pe=S.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,he=S.stencil?Mo:po,ge=S.stencil?So:vs);const Re={colorFormat:t.RGBA8,depthFormat:pe,scaleFactor:a};g=new XRWebGLBinding(s,t),_=g.createProjectionLayer(Re),s.updateRenderState({layers:[_]}),e.setPixelRatio(1),e.setSize(_.textureWidth,_.textureHeight,!1),D=new xs(_.textureWidth,_.textureHeight,{format:ci,type:cr,depthTexture:new J_(_.textureWidth,_.textureHeight,ge,void 0,void 0,void 0,void 0,void 0,void 0,he),stencilBuffer:S.stencil,colorSpace:e.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:_.ignoreDepthValues===!1})}D.isXRRenderTarget=!0,this.setFoveation(h),f=null,c=await s.requestReferenceSpace(u),Le.setContext(s),Le.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return E.getDepthTexture()};function ue(Q){for(let he=0;he<Q.removed.length;he++){const ge=Q.removed[he],pe=b.indexOf(ge);pe>=0&&(b[pe]=null,L[pe].disconnect(ge))}for(let he=0;he<Q.added.length;he++){const ge=Q.added[he];let pe=b.indexOf(ge);if(pe===-1){for(let Pe=0;Pe<L.length;Pe++)if(Pe>=b.length){b.push(ge),pe=Pe;break}else if(b[Pe]===null){b[Pe]=ge,pe=Pe;break}if(pe===-1)break}const Re=L[pe];Re&&Re.connect(ge)}}const ce=new Y,de=new Y;function O(Q,he,ge){ce.setFromMatrixPosition(he.matrixWorld),de.setFromMatrixPosition(ge.matrixWorld);const pe=ce.distanceTo(de),Re=he.projectionMatrix.elements,Pe=ge.projectionMatrix.elements,Oe=Re[14]/(Re[10]-1),Et=Re[14]/(Re[10]+1),st=(Re[9]+1)/Re[5],Rt=(Re[9]-1)/Re[5],B=(Re[8]-1)/Re[0],Yt=(Pe[8]+1)/Pe[0],it=Oe*B,gt=Oe*Yt,Ke=pe/(-B+Yt),Dt=Ke*-B;if(he.matrixWorld.decompose(Q.position,Q.quaternion,Q.scale),Q.translateX(Dt),Q.translateZ(Ke),Q.matrixWorld.compose(Q.position,Q.quaternion,Q.scale),Q.matrixWorldInverse.copy(Q.matrixWorld).invert(),Re[10]===-1)Q.projectionMatrix.copy(he.projectionMatrix),Q.projectionMatrixInverse.copy(he.projectionMatrixInverse);else{const We=Oe+Ke,P=Et+Ke,w=it-Dt,te=gt+(pe-Dt),ve=st*Et/P*We,ye=Rt*Et/P*We;Q.projectionMatrix.makePerspective(w,te,ve,ye,We,P),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert()}}function le(Q,he){he===null?Q.matrixWorld.copy(Q.matrix):Q.matrixWorld.multiplyMatrices(he.matrixWorld,Q.matrix),Q.matrixWorldInverse.copy(Q.matrixWorld).invert()}this.updateCamera=function(Q){if(s===null)return;let he=Q.near,ge=Q.far;E.texture!==null&&(E.depthNear>0&&(he=E.depthNear),E.depthFar>0&&(ge=E.depthFar)),R.near=X.near=F.near=he,R.far=X.far=F.far=ge,(H!==R.near||J!==R.far)&&(s.updateRenderState({depthNear:R.near,depthFar:R.far}),H=R.near,J=R.far),F.layers.mask=Q.layers.mask|2,X.layers.mask=Q.layers.mask|4,R.layers.mask=F.layers.mask|X.layers.mask;const pe=Q.parent,Re=R.cameras;le(R,pe);for(let Pe=0;Pe<Re.length;Pe++)le(Re[Pe],pe);Re.length===2?O(R,F,X):R.projectionMatrix.copy(F.projectionMatrix),oe(Q,R,pe)};function oe(Q,he,ge){ge===null?Q.matrix.copy(he.matrixWorld):(Q.matrix.copy(ge.matrixWorld),Q.matrix.invert(),Q.matrix.multiply(he.matrixWorld)),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.updateMatrixWorld(!0),Q.projectionMatrix.copy(he.projectionMatrix),Q.projectionMatrixInverse.copy(he.projectionMatrixInverse),Q.isPerspectiveCamera&&(Q.fov=Eo*2*Math.atan(1/Q.projectionMatrix.elements[5]),Q.zoom=1)}this.getCamera=function(){return R},this.getFoveation=function(){if(!(_===null&&y===null))return h},this.setFoveation=function(Q){h=Q,_!==null&&(_.fixedFoveation=Q),y!==null&&y.fixedFoveation!==void 0&&(y.fixedFoveation=Q)},this.hasDepthSensing=function(){return E.texture!==null},this.getDepthSensingMesh=function(){return E.getMesh(R)};let U=null;function ne(Q,he){if(m=he.getViewerPose(f||c),M=he,m!==null){const ge=m.views;y!==null&&(e.setRenderTargetFramebuffer(D,y.framebuffer),e.setRenderTarget(D));let pe=!1;ge.length!==R.cameras.length&&(R.cameras.length=0,pe=!0);for(let Pe=0;Pe<ge.length;Pe++){const Oe=ge[Pe];let Et=null;if(y!==null)Et=y.getViewport(Oe);else{const Rt=g.getViewSubImage(_,Oe);Et=Rt.viewport,Pe===0&&(e.setRenderTargetTextures(D,Rt.colorTexture,_.ignoreDepthValues?void 0:Rt.depthStencilTexture),e.setRenderTarget(D))}let st=C[Pe];st===void 0&&(st=new Un,st.layers.enable(Pe),st.viewport=new It,C[Pe]=st),st.matrix.fromArray(Oe.transform.matrix),st.matrix.decompose(st.position,st.quaternion,st.scale),st.projectionMatrix.fromArray(Oe.projectionMatrix),st.projectionMatrixInverse.copy(st.projectionMatrix).invert(),st.viewport.set(Et.x,Et.y,Et.width,Et.height),Pe===0&&(R.matrix.copy(st.matrix),R.matrix.decompose(R.position,R.quaternion,R.scale)),pe===!0&&R.cameras.push(st)}const Re=s.enabledFeatures;if(Re&&Re.includes("depth-sensing")){const Pe=g.getDepthInformation(ge[0]);Pe&&Pe.isValid&&Pe.texture&&E.init(e,Pe,s.renderState)}}for(let ge=0;ge<L.length;ge++){const pe=b[ge],Re=L[ge];pe!==null&&Re!==void 0&&Re.update(pe,he,f||c)}U&&U(Q,he),he.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:he}),M=null}const Le=new sv;Le.setAnimationLoop(ne),this.setAnimationLoop=function(Q){U=Q},this.dispose=function(){}}}const fs=new Fi,aA=new pt;function lA(o,e){function t(S,x){S.matrixAutoUpdate===!0&&S.updateMatrix(),x.value.copy(S.matrix)}function i(S,x){x.color.getRGB(S.fogColor.value,X_(o)),x.isFog?(S.fogNear.value=x.near,S.fogFar.value=x.far):x.isFogExp2&&(S.fogDensity.value=x.density)}function s(S,x,D,L,b){x.isMeshBasicMaterial||x.isMeshLambertMaterial?a(S,x):x.isMeshToonMaterial?(a(S,x),g(S,x)):x.isMeshPhongMaterial?(a(S,x),m(S,x)):x.isMeshStandardMaterial?(a(S,x),_(S,x),x.isMeshPhysicalMaterial&&y(S,x,b)):x.isMeshMatcapMaterial?(a(S,x),M(S,x)):x.isMeshDepthMaterial?a(S,x):x.isMeshDistanceMaterial?(a(S,x),E(S,x)):x.isMeshNormalMaterial?a(S,x):x.isLineBasicMaterial?(c(S,x),x.isLineDashedMaterial&&u(S,x)):x.isPointsMaterial?h(S,x,D,L):x.isSpriteMaterial?f(S,x):x.isShadowMaterial?(S.color.value.copy(x.color),S.opacity.value=x.opacity):x.isShaderMaterial&&(x.uniformsNeedUpdate=!1)}function a(S,x){S.opacity.value=x.opacity,x.color&&S.diffuse.value.copy(x.color),x.emissive&&S.emissive.value.copy(x.emissive).multiplyScalar(x.emissiveIntensity),x.map&&(S.map.value=x.map,t(x.map,S.mapTransform)),x.alphaMap&&(S.alphaMap.value=x.alphaMap,t(x.alphaMap,S.alphaMapTransform)),x.bumpMap&&(S.bumpMap.value=x.bumpMap,t(x.bumpMap,S.bumpMapTransform),S.bumpScale.value=x.bumpScale,x.side===Fn&&(S.bumpScale.value*=-1)),x.normalMap&&(S.normalMap.value=x.normalMap,t(x.normalMap,S.normalMapTransform),S.normalScale.value.copy(x.normalScale),x.side===Fn&&S.normalScale.value.negate()),x.displacementMap&&(S.displacementMap.value=x.displacementMap,t(x.displacementMap,S.displacementMapTransform),S.displacementScale.value=x.displacementScale,S.displacementBias.value=x.displacementBias),x.emissiveMap&&(S.emissiveMap.value=x.emissiveMap,t(x.emissiveMap,S.emissiveMapTransform)),x.specularMap&&(S.specularMap.value=x.specularMap,t(x.specularMap,S.specularMapTransform)),x.alphaTest>0&&(S.alphaTest.value=x.alphaTest);const D=e.get(x),L=D.envMap,b=D.envMapRotation;L&&(S.envMap.value=L,fs.copy(b),fs.x*=-1,fs.y*=-1,fs.z*=-1,L.isCubeTexture&&L.isRenderTargetTexture===!1&&(fs.y*=-1,fs.z*=-1),S.envMapRotation.value.setFromMatrix4(aA.makeRotationFromEuler(fs)),S.flipEnvMap.value=L.isCubeTexture&&L.isRenderTargetTexture===!1?-1:1,S.reflectivity.value=x.reflectivity,S.ior.value=x.ior,S.refractionRatio.value=x.refractionRatio),x.lightMap&&(S.lightMap.value=x.lightMap,S.lightMapIntensity.value=x.lightMapIntensity,t(x.lightMap,S.lightMapTransform)),x.aoMap&&(S.aoMap.value=x.aoMap,S.aoMapIntensity.value=x.aoMapIntensity,t(x.aoMap,S.aoMapTransform))}function c(S,x){S.diffuse.value.copy(x.color),S.opacity.value=x.opacity,x.map&&(S.map.value=x.map,t(x.map,S.mapTransform))}function u(S,x){S.dashSize.value=x.dashSize,S.totalSize.value=x.dashSize+x.gapSize,S.scale.value=x.scale}function h(S,x,D,L){S.diffuse.value.copy(x.color),S.opacity.value=x.opacity,S.size.value=x.size*D,S.scale.value=L*.5,x.map&&(S.map.value=x.map,t(x.map,S.uvTransform)),x.alphaMap&&(S.alphaMap.value=x.alphaMap,t(x.alphaMap,S.alphaMapTransform)),x.alphaTest>0&&(S.alphaTest.value=x.alphaTest)}function f(S,x){S.diffuse.value.copy(x.color),S.opacity.value=x.opacity,S.rotation.value=x.rotation,x.map&&(S.map.value=x.map,t(x.map,S.mapTransform)),x.alphaMap&&(S.alphaMap.value=x.alphaMap,t(x.alphaMap,S.alphaMapTransform)),x.alphaTest>0&&(S.alphaTest.value=x.alphaTest)}function m(S,x){S.specular.value.copy(x.specular),S.shininess.value=Math.max(x.shininess,1e-4)}function g(S,x){x.gradientMap&&(S.gradientMap.value=x.gradientMap)}function _(S,x){S.metalness.value=x.metalness,x.metalnessMap&&(S.metalnessMap.value=x.metalnessMap,t(x.metalnessMap,S.metalnessMapTransform)),S.roughness.value=x.roughness,x.roughnessMap&&(S.roughnessMap.value=x.roughnessMap,t(x.roughnessMap,S.roughnessMapTransform)),x.envMap&&(S.envMapIntensity.value=x.envMapIntensity)}function y(S,x,D){S.ior.value=x.ior,x.sheen>0&&(S.sheenColor.value.copy(x.sheenColor).multiplyScalar(x.sheen),S.sheenRoughness.value=x.sheenRoughness,x.sheenColorMap&&(S.sheenColorMap.value=x.sheenColorMap,t(x.sheenColorMap,S.sheenColorMapTransform)),x.sheenRoughnessMap&&(S.sheenRoughnessMap.value=x.sheenRoughnessMap,t(x.sheenRoughnessMap,S.sheenRoughnessMapTransform))),x.clearcoat>0&&(S.clearcoat.value=x.clearcoat,S.clearcoatRoughness.value=x.clearcoatRoughness,x.clearcoatMap&&(S.clearcoatMap.value=x.clearcoatMap,t(x.clearcoatMap,S.clearcoatMapTransform)),x.clearcoatRoughnessMap&&(S.clearcoatRoughnessMap.value=x.clearcoatRoughnessMap,t(x.clearcoatRoughnessMap,S.clearcoatRoughnessMapTransform)),x.clearcoatNormalMap&&(S.clearcoatNormalMap.value=x.clearcoatNormalMap,t(x.clearcoatNormalMap,S.clearcoatNormalMapTransform),S.clearcoatNormalScale.value.copy(x.clearcoatNormalScale),x.side===Fn&&S.clearcoatNormalScale.value.negate())),x.dispersion>0&&(S.dispersion.value=x.dispersion),x.iridescence>0&&(S.iridescence.value=x.iridescence,S.iridescenceIOR.value=x.iridescenceIOR,S.iridescenceThicknessMinimum.value=x.iridescenceThicknessRange[0],S.iridescenceThicknessMaximum.value=x.iridescenceThicknessRange[1],x.iridescenceMap&&(S.iridescenceMap.value=x.iridescenceMap,t(x.iridescenceMap,S.iridescenceMapTransform)),x.iridescenceThicknessMap&&(S.iridescenceThicknessMap.value=x.iridescenceThicknessMap,t(x.iridescenceThicknessMap,S.iridescenceThicknessMapTransform))),x.transmission>0&&(S.transmission.value=x.transmission,S.transmissionSamplerMap.value=D.texture,S.transmissionSamplerSize.value.set(D.width,D.height),x.transmissionMap&&(S.transmissionMap.value=x.transmissionMap,t(x.transmissionMap,S.transmissionMapTransform)),S.thickness.value=x.thickness,x.thicknessMap&&(S.thicknessMap.value=x.thicknessMap,t(x.thicknessMap,S.thicknessMapTransform)),S.attenuationDistance.value=x.attenuationDistance,S.attenuationColor.value.copy(x.attenuationColor)),x.anisotropy>0&&(S.anisotropyVector.value.set(x.anisotropy*Math.cos(x.anisotropyRotation),x.anisotropy*Math.sin(x.anisotropyRotation)),x.anisotropyMap&&(S.anisotropyMap.value=x.anisotropyMap,t(x.anisotropyMap,S.anisotropyMapTransform))),S.specularIntensity.value=x.specularIntensity,S.specularColor.value.copy(x.specularColor),x.specularColorMap&&(S.specularColorMap.value=x.specularColorMap,t(x.specularColorMap,S.specularColorMapTransform)),x.specularIntensityMap&&(S.specularIntensityMap.value=x.specularIntensityMap,t(x.specularIntensityMap,S.specularIntensityMapTransform))}function M(S,x){x.matcap&&(S.matcap.value=x.matcap)}function E(S,x){const D=e.get(x).light;S.referencePosition.value.setFromMatrixPosition(D.matrixWorld),S.nearDistance.value=D.shadow.camera.near,S.farDistance.value=D.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function cA(o,e,t,i){let s={},a={},c=[];const u=o.getParameter(o.MAX_UNIFORM_BUFFER_BINDINGS);function h(D,L){const b=L.program;i.uniformBlockBinding(D,b)}function f(D,L){let b=s[D.id];b===void 0&&(M(D),b=m(D),s[D.id]=b,D.addEventListener("dispose",S));const V=L.program;i.updateUBOMapping(D,V);const k=e.render.frame;a[D.id]!==k&&(_(D),a[D.id]=k)}function m(D){const L=g();D.__bindingPointIndex=L;const b=o.createBuffer(),V=D.__size,k=D.usage;return o.bindBuffer(o.UNIFORM_BUFFER,b),o.bufferData(o.UNIFORM_BUFFER,V,k),o.bindBuffer(o.UNIFORM_BUFFER,null),o.bindBufferBase(o.UNIFORM_BUFFER,L,b),b}function g(){for(let D=0;D<u;D++)if(c.indexOf(D)===-1)return c.push(D),D;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function _(D){const L=s[D.id],b=D.uniforms,V=D.__cache;o.bindBuffer(o.UNIFORM_BUFFER,L);for(let k=0,F=b.length;k<F;k++){const X=Array.isArray(b[k])?b[k]:[b[k]];for(let C=0,R=X.length;C<R;C++){const H=X[C];if(y(H,k,C,V)===!0){const J=H.__offset,K=Array.isArray(H.value)?H.value:[H.value];let fe=0;for(let ue=0;ue<K.length;ue++){const ce=K[ue],de=E(ce);typeof ce=="number"||typeof ce=="boolean"?(H.__data[0]=ce,o.bufferSubData(o.UNIFORM_BUFFER,J+fe,H.__data)):ce.isMatrix3?(H.__data[0]=ce.elements[0],H.__data[1]=ce.elements[1],H.__data[2]=ce.elements[2],H.__data[3]=0,H.__data[4]=ce.elements[3],H.__data[5]=ce.elements[4],H.__data[6]=ce.elements[5],H.__data[7]=0,H.__data[8]=ce.elements[6],H.__data[9]=ce.elements[7],H.__data[10]=ce.elements[8],H.__data[11]=0):(ce.toArray(H.__data,fe),fe+=de.storage/Float32Array.BYTES_PER_ELEMENT)}o.bufferSubData(o.UNIFORM_BUFFER,J,H.__data)}}}o.bindBuffer(o.UNIFORM_BUFFER,null)}function y(D,L,b,V){const k=D.value,F=L+"_"+b;if(V[F]===void 0)return typeof k=="number"||typeof k=="boolean"?V[F]=k:V[F]=k.clone(),!0;{const X=V[F];if(typeof k=="number"||typeof k=="boolean"){if(X!==k)return V[F]=k,!0}else if(X.equals(k)===!1)return X.copy(k),!0}return!1}function M(D){const L=D.uniforms;let b=0;const V=16;for(let F=0,X=L.length;F<X;F++){const C=Array.isArray(L[F])?L[F]:[L[F]];for(let R=0,H=C.length;R<H;R++){const J=C[R],K=Array.isArray(J.value)?J.value:[J.value];for(let fe=0,ue=K.length;fe<ue;fe++){const ce=K[fe],de=E(ce),O=b%V,le=O%de.boundary,oe=O+le;b+=le,oe!==0&&V-oe<de.storage&&(b+=V-oe),J.__data=new Float32Array(de.storage/Float32Array.BYTES_PER_ELEMENT),J.__offset=b,b+=de.storage}}}const k=b%V;return k>0&&(b+=V-k),D.__size=b,D.__cache={},this}function E(D){const L={boundary:0,storage:0};return typeof D=="number"||typeof D=="boolean"?(L.boundary=4,L.storage=4):D.isVector2?(L.boundary=8,L.storage=8):D.isVector3||D.isColor?(L.boundary=16,L.storage=12):D.isVector4?(L.boundary=16,L.storage=16):D.isMatrix3?(L.boundary=48,L.storage=48):D.isMatrix4?(L.boundary=64,L.storage=64):D.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",D),L}function S(D){const L=D.target;L.removeEventListener("dispose",S);const b=c.indexOf(L.__bindingPointIndex);c.splice(b,1),o.deleteBuffer(s[L.id]),delete s[L.id],delete a[L.id]}function x(){for(const D in s)o.deleteBuffer(s[D]);c=[],s={},a={}}return{bind:h,update:f,dispose:x}}class uA{constructor(e={}){const{canvas:t=uy(),context:i=null,depth:s=!0,stencil:a=!1,alpha:c=!1,antialias:u=!1,premultipliedAlpha:h=!0,preserveDrawingBuffer:f=!1,powerPreference:m="default",failIfMajorPerformanceCaveat:g=!1,reverseDepthBuffer:_=!1}=e;this.isWebGLRenderer=!0;let y;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");y=i.getContextAttributes().alpha}else y=c;const M=new Uint32Array(4),E=new Int32Array(4);let S=null,x=null;const D=[],L=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=gn,this.toneMapping=Wr,this.toneMappingExposure=1;const b=this;let V=!1,k=0,F=0,X=null,C=-1,R=null;const H=new It,J=new It;let K=null;const fe=new rt(0);let ue=0,ce=t.width,de=t.height,O=1,le=null,oe=null;const U=new It(0,0,ce,de),ne=new It(0,0,ce,de);let Le=!1;const Q=new sf;let he=!1,ge=!1;const pe=new pt,Re=new pt,Pe=new Y,Oe=new It,Et={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let st=!1;function Rt(){return X===null?O:1}let B=i;function Yt(A,q){return t.getContext(A,q)}try{const A={alpha:!0,depth:s,stencil:a,antialias:u,premultipliedAlpha:h,preserveDrawingBuffer:f,powerPreference:m,failIfMajorPerformanceCaveat:g};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${jh}`),t.addEventListener("webglcontextlost",_e,!1),t.addEventListener("webglcontextrestored",Ie,!1),t.addEventListener("webglcontextcreationerror",Ne,!1),B===null){const q="webgl2";if(B=Yt(q,A),B===null)throw Yt(q)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}let it,gt,Ke,Dt,We,P,w,te,ve,ye,me,Xe,be,ke,ht,Ee,Be,Ye,nt,ze,_t,dt,Ct,j;function Ce(){it=new xT(B),it.init(),dt=new tA(B,it),gt=new fT(B,it,e,dt),Ke=new Jw(B,it),gt.reverseDepthBuffer&&_&&Ke.buffers.depth.setReversed(!0),Dt=new MT(B),We=new zw,P=new eA(B,it,Ke,We,gt,dt,Dt),w=new mT(b),te=new vT(b),ve=new CS(B),Ct=new dT(B,ve),ye=new yT(B,ve,Dt,Ct),me=new TT(B,ye,ve,Dt),nt=new ET(B,gt,P),Ee=new pT(We),Xe=new Bw(b,w,te,it,gt,Ct,Ee),be=new lA(b,We),ke=new Vw,ht=new qw(it),Ye=new uT(b,w,te,Ke,me,y,h),Be=new Zw(b,me,gt),j=new cA(B,Dt,gt,Ke),ze=new hT(B,it,Dt),_t=new ST(B,it,Dt),Dt.programs=Xe.programs,b.capabilities=gt,b.extensions=it,b.properties=We,b.renderLists=ke,b.shadowMap=Be,b.state=Ke,b.info=Dt}Ce();const ae=new oA(b,B);this.xr=ae,this.getContext=function(){return B},this.getContextAttributes=function(){return B.getContextAttributes()},this.forceContextLoss=function(){const A=it.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=it.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return O},this.setPixelRatio=function(A){A!==void 0&&(O=A,this.setSize(ce,de,!1))},this.getSize=function(A){return A.set(ce,de)},this.setSize=function(A,q,re=!0){if(ae.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}ce=A,de=q,t.width=Math.floor(A*O),t.height=Math.floor(q*O),re===!0&&(t.style.width=A+"px",t.style.height=q+"px"),this.setViewport(0,0,A,q)},this.getDrawingBufferSize=function(A){return A.set(ce*O,de*O).floor()},this.setDrawingBufferSize=function(A,q,re){ce=A,de=q,O=re,t.width=Math.floor(A*re),t.height=Math.floor(q*re),this.setViewport(0,0,A,q)},this.getCurrentViewport=function(A){return A.copy(H)},this.getViewport=function(A){return A.copy(U)},this.setViewport=function(A,q,re,se){A.isVector4?U.set(A.x,A.y,A.z,A.w):U.set(A,q,re,se),Ke.viewport(H.copy(U).multiplyScalar(O).round())},this.getScissor=function(A){return A.copy(ne)},this.setScissor=function(A,q,re,se){A.isVector4?ne.set(A.x,A.y,A.z,A.w):ne.set(A,q,re,se),Ke.scissor(J.copy(ne).multiplyScalar(O).round())},this.getScissorTest=function(){return Le},this.setScissorTest=function(A){Ke.setScissorTest(Le=A)},this.setOpaqueSort=function(A){le=A},this.setTransparentSort=function(A){oe=A},this.getClearColor=function(A){return A.copy(Ye.getClearColor())},this.setClearColor=function(){Ye.setClearColor.apply(Ye,arguments)},this.getClearAlpha=function(){return Ye.getClearAlpha()},this.setClearAlpha=function(){Ye.setClearAlpha.apply(Ye,arguments)},this.clear=function(A=!0,q=!0,re=!0){let se=0;if(A){let G=!1;if(X!==null){const we=X.texture.format;G=we===Qh||we===Zh||we===$h}if(G){const we=X.texture.type,De=we===cr||we===vs||we===Aa||we===So||we===Yh||we===qh,He=Ye.getClearColor(),Ve=Ye.getClearAlpha(),lt=He.r,ct=He.g,Qe=He.b;De?(M[0]=lt,M[1]=ct,M[2]=Qe,M[3]=Ve,B.clearBufferuiv(B.COLOR,0,M)):(E[0]=lt,E[1]=ct,E[2]=Qe,E[3]=Ve,B.clearBufferiv(B.COLOR,0,E))}else se|=B.COLOR_BUFFER_BIT}q&&(se|=B.DEPTH_BUFFER_BIT),re&&(se|=B.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),B.clear(se)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",_e,!1),t.removeEventListener("webglcontextrestored",Ie,!1),t.removeEventListener("webglcontextcreationerror",Ne,!1),Ye.dispose(),ke.dispose(),ht.dispose(),We.dispose(),w.dispose(),te.dispose(),me.dispose(),Ct.dispose(),j.dispose(),Xe.dispose(),ae.dispose(),ae.removeEventListener("sessionstart",Ai),ae.removeEventListener("sessionend",Ri),Hi.stop()};function _e(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),V=!0}function Ie(){console.log("THREE.WebGLRenderer: Context Restored."),V=!1;const A=Dt.autoReset,q=Be.enabled,re=Be.autoUpdate,se=Be.needsUpdate,G=Be.type;Ce(),Dt.autoReset=A,Be.enabled=q,Be.autoUpdate=re,Be.needsUpdate=se,Be.type=G}function Ne(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function at(A){const q=A.target;q.removeEventListener("dispose",at),kt(q)}function kt(A){$(A),We.remove(A)}function $(A){const q=We.get(A).programs;q!==void 0&&(q.forEach(function(re){Xe.releaseProgram(re)}),A.isShaderMaterial&&Xe.releaseShaderCache(A))}this.renderBufferDirect=function(A,q,re,se,G,we){q===null&&(q=Et);const De=G.isMesh&&G.matrixWorld.determinant()<0,He=Ua(A,q,re,se,G);Ke.setMaterial(se,De);let Ve=re.index,lt=1;if(se.wireframe===!0){if(Ve=ye.getWireframeAttribute(re),Ve===void 0)return;lt=2}const ct=re.drawRange,Qe=re.attributes.position;let ft=ct.start*lt,Pt=(ct.start+ct.count)*lt;we!==null&&(ft=Math.max(ft,we.start*lt),Pt=Math.min(Pt,(we.start+we.count)*lt)),Ve!==null?(ft=Math.max(ft,0),Pt=Math.min(Pt,Ve.count)):Qe!=null&&(ft=Math.max(ft,0),Pt=Math.min(Pt,Qe.count));const Lt=Pt-ft;if(Lt<0||Lt===1/0)return;Ct.setup(G,se,He,re,Ve);let qt,wt=ze;if(Ve!==null&&(qt=ve.get(Ve),wt=_t,wt.setIndex(qt)),G.isMesh)se.wireframe===!0?(Ke.setLineWidth(se.wireframeLinewidth*Rt()),wt.setMode(B.LINES)):wt.setMode(B.TRIANGLES);else if(G.isLine){let Je=se.linewidth;Je===void 0&&(Je=1),Ke.setLineWidth(Je*Rt()),G.isLineSegments?wt.setMode(B.LINES):G.isLineLoop?wt.setMode(B.LINE_LOOP):wt.setMode(B.LINE_STRIP)}else G.isPoints?wt.setMode(B.POINTS):G.isSprite&&wt.setMode(B.TRIANGLES);if(G.isBatchedMesh)if(G._multiDrawInstances!==null)wt.renderMultiDrawInstances(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount,G._multiDrawInstances);else if(it.get("WEBGL_multi_draw"))wt.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{const Je=G._multiDrawStarts,Jt=G._multiDrawCounts,Tt=G._multiDrawCount,vn=Ve?ve.get(Ve).bytesPerElement:1,ui=We.get(se).currentProgram.getUniforms();for(let Cn=0;Cn<Tt;Cn++)ui.setValue(B,"_gl_DrawID",Cn),wt.render(Je[Cn]/vn,Jt[Cn])}else if(G.isInstancedMesh)wt.renderInstances(ft,Lt,G.count);else if(re.isInstancedBufferGeometry){const Je=re._maxInstanceCount!==void 0?re._maxInstanceCount:1/0,Jt=Math.min(re.instanceCount,Je);wt.renderInstances(ft,Lt,Jt)}else wt.render(ft,Lt)};function xe(A,q,re){A.transparent===!0&&A.side===yi&&A.forceSinglePass===!1?(A.side=Fn,A.needsUpdate=!0,Es(A,q,re),A.side=lr,A.needsUpdate=!0,Es(A,q,re),A.side=yi):Es(A,q,re)}this.compile=function(A,q,re=null){re===null&&(re=A),x=ht.get(re),x.init(q),L.push(x),re.traverseVisible(function(G){G.isLight&&G.layers.test(q.layers)&&(x.pushLight(G),G.castShadow&&x.pushShadow(G))}),A!==re&&A.traverseVisible(function(G){G.isLight&&G.layers.test(q.layers)&&(x.pushLight(G),G.castShadow&&x.pushShadow(G))}),x.setupLights();const se=new Set;return A.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;const we=G.material;if(we)if(Array.isArray(we))for(let De=0;De<we.length;De++){const He=we[De];xe(He,re,G),se.add(He)}else xe(we,re,G),se.add(we)}),L.pop(),x=null,se},this.compileAsync=function(A,q,re=null){const se=this.compile(A,q,re);return new Promise(G=>{function we(){if(se.forEach(function(De){We.get(De).currentProgram.isReady()&&se.delete(De)}),se.size===0){G(A);return}setTimeout(we,10)}it.get("KHR_parallel_shader_compile")!==null?we():setTimeout(we,10)})};let Ut=null;function Wt(A){Ut&&Ut(A)}function Ai(){Hi.stop()}function Ri(){Hi.start()}const Hi=new sv;Hi.setAnimationLoop(Wt),typeof self<"u"&&Hi.setContext(self),this.setAnimationLoop=function(A){Ut=A,ae.setAnimationLoop(A),A===null?Hi.stop():Hi.start()},ae.addEventListener("sessionstart",Ai),ae.addEventListener("sessionend",Ri),this.render=function(A,q){if(q!==void 0&&q.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(V===!0)return;if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),q.parent===null&&q.matrixWorldAutoUpdate===!0&&q.updateMatrixWorld(),ae.enabled===!0&&ae.isPresenting===!0&&(ae.cameraAutoUpdate===!0&&ae.updateCamera(q),q=ae.getCamera()),A.isScene===!0&&A.onBeforeRender(b,A,q,X),x=ht.get(A,L.length),x.init(q),L.push(x),Re.multiplyMatrices(q.projectionMatrix,q.matrixWorldInverse),Q.setFromProjectionMatrix(Re),ge=this.localClippingEnabled,he=Ee.init(this.clippingPlanes,ge),S=ke.get(A,D.length),S.init(),D.push(S),ae.enabled===!0&&ae.isPresenting===!0){const we=b.xr.getDepthSensingMesh();we!==null&&Vi(we,q,-1/0,b.sortObjects)}Vi(A,q,0,b.sortObjects),S.finish(),b.sortObjects===!0&&S.sort(le,oe),st=ae.enabled===!1||ae.isPresenting===!1||ae.hasDepthSensing()===!1,st&&Ye.addToRenderList(S,A),this.info.render.frame++,he===!0&&Ee.beginShadows();const re=x.state.shadowsArray;Be.render(re,A,q),he===!0&&Ee.endShadows(),this.info.autoReset===!0&&this.info.reset();const se=S.opaque,G=S.transmissive;if(x.setupLights(),q.isArrayCamera){const we=q.cameras;if(G.length>0)for(let De=0,He=we.length;De<He;De++){const Ve=we[De];Yr(se,G,A,Ve)}st&&Ye.render(A);for(let De=0,He=we.length;De<He;De++){const Ve=we[De];Xr(S,A,Ve,Ve.viewport)}}else G.length>0&&Yr(se,G,A,q),st&&Ye.render(A),Xr(S,A,q);X!==null&&(P.updateMultisampleRenderTarget(X),P.updateRenderTargetMipmap(X)),A.isScene===!0&&A.onAfterRender(b,A,q),Ct.resetDefaultState(),C=-1,R=null,L.pop(),L.length>0?(x=L[L.length-1],he===!0&&Ee.setGlobalState(b.clippingPlanes,x.state.camera)):x=null,D.pop(),D.length>0?S=D[D.length-1]:S=null};function Vi(A,q,re,se){if(A.visible===!1)return;if(A.layers.test(q.layers)){if(A.isGroup)re=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(q);else if(A.isLight)x.pushLight(A),A.castShadow&&x.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||Q.intersectsSprite(A)){se&&Oe.setFromMatrixPosition(A.matrixWorld).applyMatrix4(Re);const De=me.update(A),He=A.material;He.visible&&S.push(A,De,He,re,Oe.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||Q.intersectsObject(A))){const De=me.update(A),He=A.material;if(se&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),Oe.copy(A.boundingSphere.center)):(De.boundingSphere===null&&De.computeBoundingSphere(),Oe.copy(De.boundingSphere.center)),Oe.applyMatrix4(A.matrixWorld).applyMatrix4(Re)),Array.isArray(He)){const Ve=De.groups;for(let lt=0,ct=Ve.length;lt<ct;lt++){const Qe=Ve[lt],ft=He[Qe.materialIndex];ft&&ft.visible&&S.push(A,De,ft,re,Oe.z,Qe)}}else He.visible&&S.push(A,De,He,re,Oe.z,null)}}const we=A.children;for(let De=0,He=we.length;De<He;De++)Vi(we[De],q,re,se)}function Xr(A,q,re,se){const G=A.opaque,we=A.transmissive,De=A.transparent;x.setupLightsView(re),he===!0&&Ee.setGlobalState(b.clippingPlanes,re),se&&Ke.viewport(H.copy(se)),G.length>0&&ur(G,q,re),we.length>0&&ur(we,q,re),De.length>0&&ur(De,q,re),Ke.buffers.depth.setTest(!0),Ke.buffers.depth.setMask(!0),Ke.buffers.color.setMask(!0),Ke.setPolygonOffset(!1)}function Yr(A,q,re,se){if((re.isScene===!0?re.overrideMaterial:null)!==null)return;x.state.transmissionRenderTarget[se.id]===void 0&&(x.state.transmissionRenderTarget[se.id]=new xs(1,1,{generateMipmaps:!0,type:it.has("EXT_color_buffer_half_float")||it.has("EXT_color_buffer_float")?Pa:cr,minFilter:sr,samples:4,stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:At.workingColorSpace}));const we=x.state.transmissionRenderTarget[se.id],De=se.viewport||H;we.setSize(De.z,De.w);const He=b.getRenderTarget();b.setRenderTarget(we),b.getClearColor(fe),ue=b.getClearAlpha(),ue<1&&b.setClearColor(16777215,.5),b.clear(),st&&Ye.render(re);const Ve=b.toneMapping;b.toneMapping=Wr;const lt=se.viewport;if(se.viewport!==void 0&&(se.viewport=void 0),x.setupLightsView(se),he===!0&&Ee.setGlobalState(b.clippingPlanes,se),ur(A,re,se),P.updateMultisampleRenderTarget(we),P.updateRenderTargetMipmap(we),it.has("WEBGL_multisampled_render_to_texture")===!1){let ct=!1;for(let Qe=0,ft=q.length;Qe<ft;Qe++){const Pt=q[Qe],Lt=Pt.object,qt=Pt.geometry,wt=Pt.material,Je=Pt.group;if(wt.side===yi&&Lt.layers.test(se.layers)){const Jt=wt.side;wt.side=Fn,wt.needsUpdate=!0,Da(Lt,re,se,qt,wt,Je),wt.side=Jt,wt.needsUpdate=!0,ct=!0}}ct===!0&&(P.updateMultisampleRenderTarget(we),P.updateRenderTargetMipmap(we))}b.setRenderTarget(He),b.setClearColor(fe,ue),lt!==void 0&&(se.viewport=lt),b.toneMapping=Ve}function ur(A,q,re){const se=q.isScene===!0?q.overrideMaterial:null;for(let G=0,we=A.length;G<we;G++){const De=A[G],He=De.object,Ve=De.geometry,lt=se===null?De.material:se,ct=De.group;He.layers.test(re.layers)&&Da(He,q,re,Ve,lt,ct)}}function Da(A,q,re,se,G,we){A.onBeforeRender(b,q,re,se,G,we),A.modelViewMatrix.multiplyMatrices(re.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),G.onBeforeRender(b,q,re,se,A,we),G.transparent===!0&&G.side===yi&&G.forceSinglePass===!1?(G.side=Fn,G.needsUpdate=!0,b.renderBufferDirect(re,q,se,G,A,we),G.side=lr,G.needsUpdate=!0,b.renderBufferDirect(re,q,se,G,A,we),G.side=yi):b.renderBufferDirect(re,q,se,G,A,we),A.onAfterRender(b,q,re,se,G,we)}function Es(A,q,re){q.isScene!==!0&&(q=Et);const se=We.get(A),G=x.state.lights,we=x.state.shadowsArray,De=G.state.version,He=Xe.getParameters(A,G.state,we,q,re),Ve=Xe.getProgramCacheKey(He);let lt=se.programs;se.environment=A.isMeshStandardMaterial?q.environment:null,se.fog=q.fog,se.envMap=(A.isMeshStandardMaterial?te:w).get(A.envMap||se.environment),se.envMapRotation=se.environment!==null&&A.envMap===null?q.environmentRotation:A.envMapRotation,lt===void 0&&(A.addEventListener("dispose",at),lt=new Map,se.programs=lt);let ct=lt.get(Ve);if(ct!==void 0){if(se.currentProgram===ct&&se.lightsStateVersion===De)return bi(A,He),ct}else He.uniforms=Xe.getUniforms(A),A.onBeforeCompile(He,b),ct=Xe.acquireProgram(He,Ve),lt.set(Ve,ct),se.uniforms=He.uniforms;const Qe=se.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Qe.clippingPlanes=Ee.uniform),bi(A,He),se.needsLights=Nc(A),se.lightsStateVersion=De,se.needsLights&&(Qe.ambientLightColor.value=G.state.ambient,Qe.lightProbe.value=G.state.probe,Qe.directionalLights.value=G.state.directional,Qe.directionalLightShadows.value=G.state.directionalShadow,Qe.spotLights.value=G.state.spot,Qe.spotLightShadows.value=G.state.spotShadow,Qe.rectAreaLights.value=G.state.rectArea,Qe.ltc_1.value=G.state.rectAreaLTC1,Qe.ltc_2.value=G.state.rectAreaLTC2,Qe.pointLights.value=G.state.point,Qe.pointLightShadows.value=G.state.pointShadow,Qe.hemisphereLights.value=G.state.hemi,Qe.directionalShadowMap.value=G.state.directionalShadowMap,Qe.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Qe.spotShadowMap.value=G.state.spotShadowMap,Qe.spotLightMatrix.value=G.state.spotLightMatrix,Qe.spotLightMap.value=G.state.spotLightMap,Qe.pointShadowMap.value=G.state.pointShadowMap,Qe.pointShadowMatrix.value=G.state.pointShadowMatrix),se.currentProgram=ct,se.uniformsList=null,ct}function Ia(A){if(A.uniformsList===null){const q=A.currentProgram.getUniforms();A.uniformsList=Mc.seqWithValue(q.seq,A.uniforms)}return A.uniformsList}function bi(A,q){const re=We.get(A);re.outputColorSpace=q.outputColorSpace,re.batching=q.batching,re.batchingColor=q.batchingColor,re.instancing=q.instancing,re.instancingColor=q.instancingColor,re.instancingMorph=q.instancingMorph,re.skinning=q.skinning,re.morphTargets=q.morphTargets,re.morphNormals=q.morphNormals,re.morphColors=q.morphColors,re.morphTargetsCount=q.morphTargetsCount,re.numClippingPlanes=q.numClippingPlanes,re.numIntersection=q.numClipIntersection,re.vertexAlphas=q.vertexAlphas,re.vertexTangents=q.vertexTangents,re.toneMapping=q.toneMapping}function Ua(A,q,re,se,G){q.isScene!==!0&&(q=Et),P.resetTextureUnits();const we=q.fog,De=se.isMeshStandardMaterial?q.environment:null,He=X===null?b.outputColorSpace:X.isXRRenderTarget===!0?X.texture.colorSpace:Bn,Ve=(se.isMeshStandardMaterial?te:w).get(se.envMap||De),lt=se.vertexColors===!0&&!!re.attributes.color&&re.attributes.color.itemSize===4,ct=!!re.attributes.tangent&&(!!se.normalMap||se.anisotropy>0),Qe=!!re.morphAttributes.position,ft=!!re.morphAttributes.normal,Pt=!!re.morphAttributes.color;let Lt=Wr;se.toneMapped&&(X===null||X.isXRRenderTarget===!0)&&(Lt=b.toneMapping);const qt=re.morphAttributes.position||re.morphAttributes.normal||re.morphAttributes.color,wt=qt!==void 0?qt.length:0,Je=We.get(se),Jt=x.state.lights;if(he===!0&&(ge===!0||A!==R)){const tn=A===R&&se.id===C;Ee.setState(se,A,tn)}let Tt=!1;se.version===Je.__version?(Je.needsLights&&Je.lightsStateVersion!==Jt.state.version||Je.outputColorSpace!==He||G.isBatchedMesh&&Je.batching===!1||!G.isBatchedMesh&&Je.batching===!0||G.isBatchedMesh&&Je.batchingColor===!0&&G.colorTexture===null||G.isBatchedMesh&&Je.batchingColor===!1&&G.colorTexture!==null||G.isInstancedMesh&&Je.instancing===!1||!G.isInstancedMesh&&Je.instancing===!0||G.isSkinnedMesh&&Je.skinning===!1||!G.isSkinnedMesh&&Je.skinning===!0||G.isInstancedMesh&&Je.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&Je.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&Je.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&Je.instancingMorph===!1&&G.morphTexture!==null||Je.envMap!==Ve||se.fog===!0&&Je.fog!==we||Je.numClippingPlanes!==void 0&&(Je.numClippingPlanes!==Ee.numPlanes||Je.numIntersection!==Ee.numIntersection)||Je.vertexAlphas!==lt||Je.vertexTangents!==ct||Je.morphTargets!==Qe||Je.morphNormals!==ft||Je.morphColors!==Pt||Je.toneMapping!==Lt||Je.morphTargetsCount!==wt)&&(Tt=!0):(Tt=!0,Je.__version=se.version);let vn=Je.currentProgram;Tt===!0&&(vn=Es(se,q,G));let ui=!1,Cn=!1,qr=!1;const Bt=vn.getUniforms(),Pn=Je.uniforms;if(Ke.useProgram(vn.program)&&(ui=!0,Cn=!0,qr=!0),se.id!==C&&(C=se.id,Cn=!0),ui||R!==A){Ke.buffers.depth.getReversed()?(pe.copy(A.projectionMatrix),hy(pe),fy(pe),Bt.setValue(B,"projectionMatrix",pe)):Bt.setValue(B,"projectionMatrix",A.projectionMatrix),Bt.setValue(B,"viewMatrix",A.matrixWorldInverse);const Mn=Bt.map.cameraPosition;Mn!==void 0&&Mn.setValue(B,Pe.setFromMatrixPosition(A.matrixWorld)),gt.logarithmicDepthBuffer&&Bt.setValue(B,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(se.isMeshPhongMaterial||se.isMeshToonMaterial||se.isMeshLambertMaterial||se.isMeshBasicMaterial||se.isMeshStandardMaterial||se.isShaderMaterial)&&Bt.setValue(B,"isOrthographic",A.isOrthographicCamera===!0),R!==A&&(R=A,Cn=!0,qr=!0)}if(G.isSkinnedMesh){Bt.setOptional(B,G,"bindMatrix"),Bt.setOptional(B,G,"bindMatrixInverse");const tn=G.skeleton;tn&&(tn.boneTexture===null&&tn.computeBoneTexture(),Bt.setValue(B,"boneTexture",tn.boneTexture,P))}G.isBatchedMesh&&(Bt.setOptional(B,G,"batchingTexture"),Bt.setValue(B,"batchingTexture",G._matricesTexture,P),Bt.setOptional(B,G,"batchingIdTexture"),Bt.setValue(B,"batchingIdTexture",G._indirectTexture,P),Bt.setOptional(B,G,"batchingColorTexture"),G._colorsTexture!==null&&Bt.setValue(B,"batchingColorTexture",G._colorsTexture,P));const Sn=re.morphAttributes;if((Sn.position!==void 0||Sn.normal!==void 0||Sn.color!==void 0)&&nt.update(G,re,vn),(Cn||Je.receiveShadow!==G.receiveShadow)&&(Je.receiveShadow=G.receiveShadow,Bt.setValue(B,"receiveShadow",G.receiveShadow)),se.isMeshGouraudMaterial&&se.envMap!==null&&(Pn.envMap.value=Ve,Pn.flipEnvMap.value=Ve.isCubeTexture&&Ve.isRenderTargetTexture===!1?-1:1),se.isMeshStandardMaterial&&se.envMap===null&&q.environment!==null&&(Pn.envMapIntensity.value=q.environmentIntensity),Cn&&(Bt.setValue(B,"toneMappingExposure",b.toneMappingExposure),Je.needsLights&&Fa(Pn,qr),we&&se.fog===!0&&be.refreshFogUniforms(Pn,we),be.refreshMaterialUniforms(Pn,se,O,de,x.state.transmissionRenderTarget[A.id]),Mc.upload(B,Ia(Je),Pn,P)),se.isShaderMaterial&&se.uniformsNeedUpdate===!0&&(Mc.upload(B,Ia(Je),Pn,P),se.uniformsNeedUpdate=!1),se.isSpriteMaterial&&Bt.setValue(B,"center",G.center),Bt.setValue(B,"modelViewMatrix",G.modelViewMatrix),Bt.setValue(B,"normalMatrix",G.normalMatrix),Bt.setValue(B,"modelMatrix",G.matrixWorld),se.isShaderMaterial||se.isRawShaderMaterial){const tn=se.uniformsGroups;for(let Mn=0,Kr=tn.length;Mn<Kr;Mn++){const St=tn[Mn];j.update(St,vn),j.bind(St,vn)}}return vn}function Fa(A,q){A.ambientLightColor.needsUpdate=q,A.lightProbe.needsUpdate=q,A.directionalLights.needsUpdate=q,A.directionalLightShadows.needsUpdate=q,A.pointLights.needsUpdate=q,A.pointLightShadows.needsUpdate=q,A.spotLights.needsUpdate=q,A.spotLightShadows.needsUpdate=q,A.rectAreaLights.needsUpdate=q,A.hemisphereLights.needsUpdate=q}function Nc(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return k},this.getActiveMipmapLevel=function(){return F},this.getRenderTarget=function(){return X},this.setRenderTargetTextures=function(A,q,re){We.get(A.texture).__webglTexture=q,We.get(A.depthTexture).__webglTexture=re;const se=We.get(A);se.__hasExternalTextures=!0,se.__autoAllocateDepthBuffer=re===void 0,se.__autoAllocateDepthBuffer||it.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),se.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(A,q){const re=We.get(A);re.__webglFramebuffer=q,re.__useDefaultFramebuffer=q===void 0},this.setRenderTarget=function(A,q=0,re=0){X=A,k=q,F=re;let se=!0,G=null,we=!1,De=!1;if(A){const Ve=We.get(A);if(Ve.__useDefaultFramebuffer!==void 0)Ke.bindFramebuffer(B.FRAMEBUFFER,null),se=!1;else if(Ve.__webglFramebuffer===void 0)P.setupRenderTarget(A);else if(Ve.__hasExternalTextures)P.rebindTextures(A,We.get(A.texture).__webglTexture,We.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){const Qe=A.depthTexture;if(Ve.__boundDepthTexture!==Qe){if(Qe!==null&&We.has(Qe)&&(A.width!==Qe.image.width||A.height!==Qe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");P.setupDepthRenderbuffer(A)}}const lt=A.texture;(lt.isData3DTexture||lt.isDataArrayTexture||lt.isCompressedArrayTexture)&&(De=!0);const ct=We.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(ct[q])?G=ct[q][re]:G=ct[q],we=!0):A.samples>0&&P.useMultisampledRTT(A)===!1?G=We.get(A).__webglMultisampledFramebuffer:Array.isArray(ct)?G=ct[re]:G=ct,H.copy(A.viewport),J.copy(A.scissor),K=A.scissorTest}else H.copy(U).multiplyScalar(O).floor(),J.copy(ne).multiplyScalar(O).floor(),K=Le;if(Ke.bindFramebuffer(B.FRAMEBUFFER,G)&&se&&Ke.drawBuffers(A,G),Ke.viewport(H),Ke.scissor(J),Ke.setScissorTest(K),we){const Ve=We.get(A.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_CUBE_MAP_POSITIVE_X+q,Ve.__webglTexture,re)}else if(De){const Ve=We.get(A.texture),lt=q||0;B.framebufferTextureLayer(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,Ve.__webglTexture,re||0,lt)}C=-1},this.readRenderTargetPixels=function(A,q,re,se,G,we,De){if(!(A&&A.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let He=We.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&De!==void 0&&(He=He[De]),He){Ke.bindFramebuffer(B.FRAMEBUFFER,He);try{const Ve=A.texture,lt=Ve.format,ct=Ve.type;if(!gt.textureFormatReadable(lt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!gt.textureTypeReadable(ct)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}q>=0&&q<=A.width-se&&re>=0&&re<=A.height-G&&B.readPixels(q,re,se,G,dt.convert(lt),dt.convert(ct),we)}finally{const Ve=X!==null?We.get(X).__webglFramebuffer:null;Ke.bindFramebuffer(B.FRAMEBUFFER,Ve)}}},this.readRenderTargetPixelsAsync=async function(A,q,re,se,G,we,De){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let He=We.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&De!==void 0&&(He=He[De]),He){const Ve=A.texture,lt=Ve.format,ct=Ve.type;if(!gt.textureFormatReadable(lt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!gt.textureTypeReadable(ct))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(q>=0&&q<=A.width-se&&re>=0&&re<=A.height-G){Ke.bindFramebuffer(B.FRAMEBUFFER,He);const Qe=B.createBuffer();B.bindBuffer(B.PIXEL_PACK_BUFFER,Qe),B.bufferData(B.PIXEL_PACK_BUFFER,we.byteLength,B.STREAM_READ),B.readPixels(q,re,se,G,dt.convert(lt),dt.convert(ct),0);const ft=X!==null?We.get(X).__webglFramebuffer:null;Ke.bindFramebuffer(B.FRAMEBUFFER,ft);const Pt=B.fenceSync(B.SYNC_GPU_COMMANDS_COMPLETE,0);return B.flush(),await dy(B,Pt,4),B.bindBuffer(B.PIXEL_PACK_BUFFER,Qe),B.getBufferSubData(B.PIXEL_PACK_BUFFER,0,we),B.deleteBuffer(Qe),B.deleteSync(Pt),we}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(A,q=null,re=0){A.isTexture!==!0&&(lo("WebGLRenderer: copyFramebufferToTexture function signature has changed."),q=arguments[0]||null,A=arguments[1]);const se=Math.pow(2,-re),G=Math.floor(A.image.width*se),we=Math.floor(A.image.height*se),De=q!==null?q.x:0,He=q!==null?q.y:0;P.setTexture2D(A,0),B.copyTexSubImage2D(B.TEXTURE_2D,re,0,0,De,He,G,we),Ke.unbindTexture()};const Oa=B.createFramebuffer(),ka=B.createFramebuffer();this.copyTextureToTexture=function(A,q,re=null,se=null,G=0,we=null){A.isTexture!==!0&&(lo("WebGLRenderer: copyTextureToTexture function signature has changed."),se=arguments[0]||null,A=arguments[1],q=arguments[2],we=arguments[3]||0,re=null),we===null&&(G!==0?(lo("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),we=G,G=0):we=0);let De,He,Ve,lt,ct,Qe,ft,Pt,Lt;const qt=A.isCompressedTexture?A.mipmaps[we]:A.image;if(re!==null)De=re.max.x-re.min.x,He=re.max.y-re.min.y,Ve=re.isBox3?re.max.z-re.min.z:1,lt=re.min.x,ct=re.min.y,Qe=re.isBox3?re.min.z:0;else{const Sn=Math.pow(2,-G);De=Math.floor(qt.width*Sn),He=Math.floor(qt.height*Sn),A.isDataArrayTexture?Ve=qt.depth:A.isData3DTexture?Ve=Math.floor(qt.depth*Sn):Ve=1,lt=0,ct=0,Qe=0}se!==null?(ft=se.x,Pt=se.y,Lt=se.z):(ft=0,Pt=0,Lt=0);const wt=dt.convert(q.format),Je=dt.convert(q.type);let Jt;q.isData3DTexture?(P.setTexture3D(q,0),Jt=B.TEXTURE_3D):q.isDataArrayTexture||q.isCompressedArrayTexture?(P.setTexture2DArray(q,0),Jt=B.TEXTURE_2D_ARRAY):(P.setTexture2D(q,0),Jt=B.TEXTURE_2D),B.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,q.flipY),B.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,q.premultiplyAlpha),B.pixelStorei(B.UNPACK_ALIGNMENT,q.unpackAlignment);const Tt=B.getParameter(B.UNPACK_ROW_LENGTH),vn=B.getParameter(B.UNPACK_IMAGE_HEIGHT),ui=B.getParameter(B.UNPACK_SKIP_PIXELS),Cn=B.getParameter(B.UNPACK_SKIP_ROWS),qr=B.getParameter(B.UNPACK_SKIP_IMAGES);B.pixelStorei(B.UNPACK_ROW_LENGTH,qt.width),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,qt.height),B.pixelStorei(B.UNPACK_SKIP_PIXELS,lt),B.pixelStorei(B.UNPACK_SKIP_ROWS,ct),B.pixelStorei(B.UNPACK_SKIP_IMAGES,Qe);const Bt=A.isDataArrayTexture||A.isData3DTexture,Pn=q.isDataArrayTexture||q.isData3DTexture;if(A.isDepthTexture){const Sn=We.get(A),tn=We.get(q),Mn=We.get(Sn.__renderTarget),Kr=We.get(tn.__renderTarget);Ke.bindFramebuffer(B.READ_FRAMEBUFFER,Mn.__webglFramebuffer),Ke.bindFramebuffer(B.DRAW_FRAMEBUFFER,Kr.__webglFramebuffer);for(let St=0;St<Ve;St++)Bt&&(B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,We.get(A).__webglTexture,G,Qe+St),B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,We.get(q).__webglTexture,we,Lt+St)),B.blitFramebuffer(lt,ct,De,He,ft,Pt,De,He,B.DEPTH_BUFFER_BIT,B.NEAREST);Ke.bindFramebuffer(B.READ_FRAMEBUFFER,null),Ke.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else if(G!==0||A.isRenderTargetTexture||We.has(A)){const Sn=We.get(A),tn=We.get(q);Ke.bindFramebuffer(B.READ_FRAMEBUFFER,Oa),Ke.bindFramebuffer(B.DRAW_FRAMEBUFFER,ka);for(let Mn=0;Mn<Ve;Mn++)Bt?B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Sn.__webglTexture,G,Qe+Mn):B.framebufferTexture2D(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,Sn.__webglTexture,G),Pn?B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,tn.__webglTexture,we,Lt+Mn):B.framebufferTexture2D(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,tn.__webglTexture,we),G!==0?B.blitFramebuffer(lt,ct,De,He,ft,Pt,De,He,B.COLOR_BUFFER_BIT,B.NEAREST):Pn?B.copyTexSubImage3D(Jt,we,ft,Pt,Lt+Mn,lt,ct,De,He):B.copyTexSubImage2D(Jt,we,ft,Pt,lt,ct,De,He);Ke.bindFramebuffer(B.READ_FRAMEBUFFER,null),Ke.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else Pn?A.isDataTexture||A.isData3DTexture?B.texSubImage3D(Jt,we,ft,Pt,Lt,De,He,Ve,wt,Je,qt.data):q.isCompressedArrayTexture?B.compressedTexSubImage3D(Jt,we,ft,Pt,Lt,De,He,Ve,wt,qt.data):B.texSubImage3D(Jt,we,ft,Pt,Lt,De,He,Ve,wt,Je,qt):A.isDataTexture?B.texSubImage2D(B.TEXTURE_2D,we,ft,Pt,De,He,wt,Je,qt.data):A.isCompressedTexture?B.compressedTexSubImage2D(B.TEXTURE_2D,we,ft,Pt,qt.width,qt.height,wt,qt.data):B.texSubImage2D(B.TEXTURE_2D,we,ft,Pt,De,He,wt,Je,qt);B.pixelStorei(B.UNPACK_ROW_LENGTH,Tt),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,vn),B.pixelStorei(B.UNPACK_SKIP_PIXELS,ui),B.pixelStorei(B.UNPACK_SKIP_ROWS,Cn),B.pixelStorei(B.UNPACK_SKIP_IMAGES,qr),we===0&&q.generateMipmaps&&B.generateMipmap(Jt),Ke.unbindTexture()},this.copyTextureToTexture3D=function(A,q,re=null,se=null,G=0){return A.isTexture!==!0&&(lo("WebGLRenderer: copyTextureToTexture3D function signature has changed."),re=arguments[0]||null,se=arguments[1]||null,A=arguments[2],q=arguments[3],G=arguments[4]||0),lo('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(A,q,re,se,G)},this.initRenderTarget=function(A){We.get(A).__webglFramebuffer===void 0&&P.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?P.setTextureCube(A,0):A.isData3DTexture?P.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?P.setTexture2DArray(A,0):P.setTexture2D(A,0),Ke.unbindTexture()},this.resetState=function(){k=0,F=0,X=null,Ke.reset(),Ct.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return or}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorspace=At._getDrawingBufferColorSpace(e),t.unpackColorSpace=At._getUnpackColorSpace()}}const h_={type:"change"},gf={type:"start"},uv={type:"end"},pc=new La,f_=new kr,dA=Math.cos(70*k_.DEG2RAD),ln=new Y,Xn=2*Math.PI,Vt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Kd=1e-6;class hA extends RS{constructor(e,t=null){super(e,t),this.state=Vt.NONE,this.enabled=!0,this.target=new Y,this.cursor=new Y,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:ho.ROTATE,MIDDLE:ho.DOLLY,RIGHT:ho.PAN},this.touches={ONE:co.ROTATE,TWO:co.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new Y,this._lastQuaternion=new Ui,this._lastTargetPosition=new Y,this._quat=new Ui().setFromUnitVectors(e.up,new Y(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Hg,this._sphericalDelta=new Hg,this._scale=1,this._panOffset=new Y,this._rotateStart=new ot,this._rotateEnd=new ot,this._rotateDelta=new ot,this._panStart=new ot,this._panEnd=new ot,this._panDelta=new ot,this._dollyStart=new ot,this._dollyEnd=new ot,this._dollyDelta=new ot,this._dollyDirection=new Y,this._mouse=new ot,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=pA.bind(this),this._onPointerDown=fA.bind(this),this._onPointerUp=mA.bind(this),this._onContextMenu=MA.bind(this),this._onMouseWheel=vA.bind(this),this._onKeyDown=xA.bind(this),this._onTouchStart=yA.bind(this),this._onTouchMove=SA.bind(this),this._onMouseDown=gA.bind(this),this._onMouseMove=_A.bind(this),this._interceptControlDown=EA.bind(this),this._interceptControlUp=TA.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(h_),this.update(),this.state=Vt.NONE}update(e=null){const t=this.object.position;ln.copy(t).sub(this.target),ln.applyQuaternion(this._quat),this._spherical.setFromVector3(ln),this.autoRotate&&this.state===Vt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(i)&&isFinite(s)&&(i<-Math.PI?i+=Xn:i>Math.PI&&(i-=Xn),s<-Math.PI?s+=Xn:s>Math.PI&&(s-=Xn),i<=s?this._spherical.theta=Math.max(i,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+s)/2?Math.max(i,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let a=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const c=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),a=c!=this._spherical.radius}if(ln.setFromSpherical(this._spherical),ln.applyQuaternion(this._quatInverse),t.copy(this.target).add(ln),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let c=null;if(this.object.isPerspectiveCamera){const u=ln.length();c=this._clampDistance(u*this._scale);const h=u-c;this.object.position.addScaledVector(this._dollyDirection,h),this.object.updateMatrixWorld(),a=!!h}else if(this.object.isOrthographicCamera){const u=new Y(this._mouse.x,this._mouse.y,0);u.unproject(this.object);const h=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),a=h!==this.object.zoom;const f=new Y(this._mouse.x,this._mouse.y,0);f.unproject(this.object),this.object.position.sub(f).add(u),this.object.updateMatrixWorld(),c=ln.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;c!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(c).add(this.object.position):(pc.origin.copy(this.object.position),pc.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(pc.direction))<dA?this.object.lookAt(this.target):(f_.setFromNormalAndCoplanarPoint(this.object.up,this.target),pc.intersectPlane(f_,this.target))))}else if(this.object.isOrthographicCamera){const c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),c!==this.object.zoom&&(this.object.updateProjectionMatrix(),a=!0)}return this._scale=1,this._performCursorZoom=!1,a||this._lastPosition.distanceToSquared(this.object.position)>Kd||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Kd||this._lastTargetPosition.distanceToSquared(this.target)>Kd?(this.dispatchEvent(h_),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?Xn/60*this.autoRotateSpeed*e:Xn/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){ln.setFromMatrixColumn(t,0),ln.multiplyScalar(-e),this._panOffset.add(ln)}_panUp(e,t){this.screenSpacePanning===!0?ln.setFromMatrixColumn(t,1):(ln.setFromMatrixColumn(t,0),ln.crossVectors(this.object.up,ln)),ln.multiplyScalar(e),this._panOffset.add(ln)}_pan(e,t){const i=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;ln.copy(s).sub(this.target);let a=ln.length();a*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*a/i.clientHeight,this.object.matrix),this._panUp(2*t*a/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),s=e-i.left,a=t-i.top,c=i.width,u=i.height;this._mouse.x=s/c*2-1,this._mouse.y=-(a/u)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Xn*this._rotateDelta.x/t.clientHeight),this._rotateUp(Xn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(Xn*this.rotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-Xn*this.rotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(Xn*this.rotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-Xn*this.rotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(i,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(i,s)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,a=Math.sqrt(i*i+s*s);this._dollyStart.set(0,a)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),s=.5*(e.pageX+i.x),a=.5*(e.pageY+i.y);this._rotateEnd.set(s,a)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Xn*this._rotateDelta.x/t.clientHeight),this._rotateUp(Xn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(i,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,a=Math.sqrt(i*i+s*s);this._dollyEnd.set(0,a),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const c=(e.pageX+t.x)*.5,u=(e.pageY+t.y)*.5;this._updateZoomParameters(c,u)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new ot,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function fA(o){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(o.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(o)&&(this._addPointer(o),o.pointerType==="touch"?this._onTouchStart(o):this._onMouseDown(o)))}function pA(o){this.enabled!==!1&&(o.pointerType==="touch"?this._onTouchMove(o):this._onMouseMove(o))}function mA(o){switch(this._removePointer(o),this._pointers.length){case 0:this.domElement.releasePointerCapture(o.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(uv),this.state=Vt.NONE;break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function gA(o){let e;switch(o.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case ho.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(o),this.state=Vt.DOLLY;break;case ho.ROTATE:if(o.ctrlKey||o.metaKey||o.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(o),this.state=Vt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(o),this.state=Vt.ROTATE}break;case ho.PAN:if(o.ctrlKey||o.metaKey||o.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(o),this.state=Vt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(o),this.state=Vt.PAN}break;default:this.state=Vt.NONE}this.state!==Vt.NONE&&this.dispatchEvent(gf)}function _A(o){switch(this.state){case Vt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(o);break;case Vt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(o);break;case Vt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(o);break}}function vA(o){this.enabled===!1||this.enableZoom===!1||this.state!==Vt.NONE||(o.preventDefault(),this.dispatchEvent(gf),this._handleMouseWheel(this._customWheelEvent(o)),this.dispatchEvent(uv))}function xA(o){this.enabled!==!1&&this._handleKeyDown(o)}function yA(o){switch(this._trackPointer(o),this._pointers.length){case 1:switch(this.touches.ONE){case co.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(o),this.state=Vt.TOUCH_ROTATE;break;case co.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(o),this.state=Vt.TOUCH_PAN;break;default:this.state=Vt.NONE}break;case 2:switch(this.touches.TWO){case co.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(o),this.state=Vt.TOUCH_DOLLY_PAN;break;case co.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(o),this.state=Vt.TOUCH_DOLLY_ROTATE;break;default:this.state=Vt.NONE}break;default:this.state=Vt.NONE}this.state!==Vt.NONE&&this.dispatchEvent(gf)}function SA(o){switch(this._trackPointer(o),this.state){case Vt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(o),this.update();break;case Vt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(o),this.update();break;case Vt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(o),this.update();break;case Vt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(o),this.update();break;default:this.state=Vt.NONE}}function MA(o){this.enabled!==!1&&o.preventDefault()}function EA(o){o.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function TA(o){o.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function p_(o,e){if(e===Ox)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),o;if(e===Fh||e===F_){let t=o.getIndex();if(t===null){const c=[],u=o.getAttribute("position");if(u!==void 0){for(let h=0;h<u.count;h++)c.push(h);o.setIndex(c),t=o.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),o}const i=t.count-2,s=[];if(e===Fh)for(let c=1;c<=i;c++)s.push(t.getX(0)),s.push(t.getX(c)),s.push(t.getX(c+1));else for(let c=0;c<i;c++)c%2===0?(s.push(t.getX(c)),s.push(t.getX(c+1)),s.push(t.getX(c+2))):(s.push(t.getX(c+2)),s.push(t.getX(c+1)),s.push(t.getX(c)));s.length/3!==i&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const a=o.clone();return a.setIndex(s),a.clearGroups(),a}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),o}class wA extends Lo{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new PA(t)}),this.register(function(t){return new LA(t)}),this.register(function(t){return new zA(t)}),this.register(function(t){return new HA(t)}),this.register(function(t){return new VA(t)}),this.register(function(t){return new DA(t)}),this.register(function(t){return new IA(t)}),this.register(function(t){return new UA(t)}),this.register(function(t){return new FA(t)}),this.register(function(t){return new CA(t)}),this.register(function(t){return new OA(t)}),this.register(function(t){return new NA(t)}),this.register(function(t){return new BA(t)}),this.register(function(t){return new kA(t)}),this.register(function(t){return new RA(t)}),this.register(function(t){return new GA(t)}),this.register(function(t){return new WA(t)})}load(e,t,i,s){const a=this;let c;if(this.resourcePath!=="")c=this.resourcePath;else if(this.path!==""){const f=wa.extractUrlBase(e);c=wa.resolveURL(f,this.path)}else c=wa.extractUrlBase(e);this.manager.itemStart(e);const u=function(f){s?s(f):console.error(f),a.manager.itemError(e),a.manager.itemEnd(e)},h=new nv(this.manager);h.setPath(this.path),h.setResponseType("arraybuffer"),h.setRequestHeader(this.requestHeader),h.setWithCredentials(this.withCredentials),h.load(e,function(f){try{a.parse(f,c,function(m){t(m),a.manager.itemEnd(e)},u)}catch(m){u(m)}},i,u)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,i,s){let a;const c={},u={},h=new TextDecoder;if(typeof e=="string")a=JSON.parse(e);else if(e instanceof ArrayBuffer)if(h.decode(new Uint8Array(e,0,4))===dv){try{c[Mt.KHR_BINARY_GLTF]=new jA(e)}catch(g){s&&s(g);return}a=JSON.parse(c[Mt.KHR_BINARY_GLTF].content)}else a=JSON.parse(h.decode(e));else a=e;if(a.asset===void 0||a.asset.version[0]<2){s&&s(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const f=new r1(a,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});f.fileLoader.setRequestHeader(this.requestHeader);for(let m=0;m<this.pluginCallbacks.length;m++){const g=this.pluginCallbacks[m](f);g.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),u[g.name]=g,c[g.name]=!0}if(a.extensionsUsed)for(let m=0;m<a.extensionsUsed.length;++m){const g=a.extensionsUsed[m],_=a.extensionsRequired||[];switch(g){case Mt.KHR_MATERIALS_UNLIT:c[g]=new bA;break;case Mt.KHR_DRACO_MESH_COMPRESSION:c[g]=new XA(a,this.dracoLoader);break;case Mt.KHR_TEXTURE_TRANSFORM:c[g]=new YA;break;case Mt.KHR_MESH_QUANTIZATION:c[g]=new qA;break;default:_.indexOf(g)>=0&&u[g]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+g+'".')}}f.setExtensions(c),f.setPlugins(u),f.parse(i,s)}parseAsync(e,t){const i=this;return new Promise(function(s,a){i.parse(e,t,s,a)})}}function AA(){let o={};return{get:function(e){return o[e]},add:function(e,t){o[e]=t},remove:function(e){delete o[e]},removeAll:function(){o={}}}}const Mt={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class RA{constructor(e){this.parser=e,this.name=Mt.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let i=0,s=t.length;i<s;i++){const a=t[i];a.extensions&&a.extensions[this.name]&&a.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,a.extensions[this.name].light)}}_loadLight(e){const t=this.parser,i="light:"+e;let s=t.cache.get(i);if(s)return s;const a=t.json,h=((a.extensions&&a.extensions[this.name]||{}).lights||[])[e];let f;const m=new rt(16777215);h.color!==void 0&&m.setRGB(h.color[0],h.color[1],h.color[2],Bn);const g=h.range!==void 0?h.range:0;switch(h.type){case"directional":f=new Sc(m),f.target.position.set(0,0,-1),f.add(f.target);break;case"point":f=new iv(m),f.distance=g;break;case"spot":f=new uS(m),f.distance=g,h.spot=h.spot||{},h.spot.innerConeAngle=h.spot.innerConeAngle!==void 0?h.spot.innerConeAngle:0,h.spot.outerConeAngle=h.spot.outerConeAngle!==void 0?h.spot.outerConeAngle:Math.PI/4,f.angle=h.spot.outerConeAngle,f.penumbra=1-h.spot.innerConeAngle/h.spot.outerConeAngle,f.target.position.set(0,0,-1),f.add(f.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+h.type)}return f.position.set(0,0,0),f.decay=2,rr(f,h),h.intensity!==void 0&&(f.intensity=h.intensity),f.name=t.createUniqueName(h.name||"light_"+e),s=Promise.resolve(f),t.cache.add(i,s),s}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,i=this.parser,a=i.json.nodes[e],u=(a.extensions&&a.extensions[this.name]||{}).light;return u===void 0?null:this._loadLight(u).then(function(h){return i._getNodeRef(t.cache,u,h)})}}class bA{constructor(){this.name=Mt.KHR_MATERIALS_UNLIT}getMaterialType(){return Ii}extendParams(e,t,i){const s=[];e.color=new rt(1,1,1),e.opacity=1;const a=t.pbrMetallicRoughness;if(a){if(Array.isArray(a.baseColorFactor)){const c=a.baseColorFactor;e.color.setRGB(c[0],c[1],c[2],Bn),e.opacity=c[3]}a.baseColorTexture!==void 0&&s.push(i.assignTexture(e,"map",a.baseColorTexture,gn))}return Promise.all(s)}}class CA{constructor(e){this.parser=e,this.name=Mt.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const s=this.parser.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const a=s.extensions[this.name].emissiveStrength;return a!==void 0&&(t.emissiveIntensity=a),Promise.resolve()}}class PA{constructor(e){this.parser=e,this.name=Mt.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:Bi}extendMaterialParams(e,t){const i=this.parser,s=i.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const a=[],c=s.extensions[this.name];if(c.clearcoatFactor!==void 0&&(t.clearcoat=c.clearcoatFactor),c.clearcoatTexture!==void 0&&a.push(i.assignTexture(t,"clearcoatMap",c.clearcoatTexture)),c.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=c.clearcoatRoughnessFactor),c.clearcoatRoughnessTexture!==void 0&&a.push(i.assignTexture(t,"clearcoatRoughnessMap",c.clearcoatRoughnessTexture)),c.clearcoatNormalTexture!==void 0&&(a.push(i.assignTexture(t,"clearcoatNormalMap",c.clearcoatNormalTexture)),c.clearcoatNormalTexture.scale!==void 0)){const u=c.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new ot(u,u)}return Promise.all(a)}}class LA{constructor(e){this.parser=e,this.name=Mt.KHR_MATERIALS_DISPERSION}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:Bi}extendMaterialParams(e,t){const s=this.parser.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const a=s.extensions[this.name];return t.dispersion=a.dispersion!==void 0?a.dispersion:0,Promise.resolve()}}class NA{constructor(e){this.parser=e,this.name=Mt.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:Bi}extendMaterialParams(e,t){const i=this.parser,s=i.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const a=[],c=s.extensions[this.name];return c.iridescenceFactor!==void 0&&(t.iridescence=c.iridescenceFactor),c.iridescenceTexture!==void 0&&a.push(i.assignTexture(t,"iridescenceMap",c.iridescenceTexture)),c.iridescenceIor!==void 0&&(t.iridescenceIOR=c.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),c.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=c.iridescenceThicknessMinimum),c.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=c.iridescenceThicknessMaximum),c.iridescenceThicknessTexture!==void 0&&a.push(i.assignTexture(t,"iridescenceThicknessMap",c.iridescenceThicknessTexture)),Promise.all(a)}}class DA{constructor(e){this.parser=e,this.name=Mt.KHR_MATERIALS_SHEEN}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:Bi}extendMaterialParams(e,t){const i=this.parser,s=i.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const a=[];t.sheenColor=new rt(0,0,0),t.sheenRoughness=0,t.sheen=1;const c=s.extensions[this.name];if(c.sheenColorFactor!==void 0){const u=c.sheenColorFactor;t.sheenColor.setRGB(u[0],u[1],u[2],Bn)}return c.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=c.sheenRoughnessFactor),c.sheenColorTexture!==void 0&&a.push(i.assignTexture(t,"sheenColorMap",c.sheenColorTexture,gn)),c.sheenRoughnessTexture!==void 0&&a.push(i.assignTexture(t,"sheenRoughnessMap",c.sheenRoughnessTexture)),Promise.all(a)}}class IA{constructor(e){this.parser=e,this.name=Mt.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:Bi}extendMaterialParams(e,t){const i=this.parser,s=i.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const a=[],c=s.extensions[this.name];return c.transmissionFactor!==void 0&&(t.transmission=c.transmissionFactor),c.transmissionTexture!==void 0&&a.push(i.assignTexture(t,"transmissionMap",c.transmissionTexture)),Promise.all(a)}}class UA{constructor(e){this.parser=e,this.name=Mt.KHR_MATERIALS_VOLUME}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:Bi}extendMaterialParams(e,t){const i=this.parser,s=i.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const a=[],c=s.extensions[this.name];t.thickness=c.thicknessFactor!==void 0?c.thicknessFactor:0,c.thicknessTexture!==void 0&&a.push(i.assignTexture(t,"thicknessMap",c.thicknessTexture)),t.attenuationDistance=c.attenuationDistance||1/0;const u=c.attenuationColor||[1,1,1];return t.attenuationColor=new rt().setRGB(u[0],u[1],u[2],Bn),Promise.all(a)}}class FA{constructor(e){this.parser=e,this.name=Mt.KHR_MATERIALS_IOR}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:Bi}extendMaterialParams(e,t){const s=this.parser.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const a=s.extensions[this.name];return t.ior=a.ior!==void 0?a.ior:1.5,Promise.resolve()}}class OA{constructor(e){this.parser=e,this.name=Mt.KHR_MATERIALS_SPECULAR}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:Bi}extendMaterialParams(e,t){const i=this.parser,s=i.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const a=[],c=s.extensions[this.name];t.specularIntensity=c.specularFactor!==void 0?c.specularFactor:1,c.specularTexture!==void 0&&a.push(i.assignTexture(t,"specularIntensityMap",c.specularTexture));const u=c.specularColorFactor||[1,1,1];return t.specularColor=new rt().setRGB(u[0],u[1],u[2],Bn),c.specularColorTexture!==void 0&&a.push(i.assignTexture(t,"specularColorMap",c.specularColorTexture,gn)),Promise.all(a)}}class kA{constructor(e){this.parser=e,this.name=Mt.EXT_MATERIALS_BUMP}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:Bi}extendMaterialParams(e,t){const i=this.parser,s=i.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const a=[],c=s.extensions[this.name];return t.bumpScale=c.bumpFactor!==void 0?c.bumpFactor:1,c.bumpTexture!==void 0&&a.push(i.assignTexture(t,"bumpMap",c.bumpTexture)),Promise.all(a)}}class BA{constructor(e){this.parser=e,this.name=Mt.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:Bi}extendMaterialParams(e,t){const i=this.parser,s=i.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const a=[],c=s.extensions[this.name];return c.anisotropyStrength!==void 0&&(t.anisotropy=c.anisotropyStrength),c.anisotropyRotation!==void 0&&(t.anisotropyRotation=c.anisotropyRotation),c.anisotropyTexture!==void 0&&a.push(i.assignTexture(t,"anisotropyMap",c.anisotropyTexture)),Promise.all(a)}}class zA{constructor(e){this.parser=e,this.name=Mt.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,i=t.json,s=i.textures[e];if(!s.extensions||!s.extensions[this.name])return null;const a=s.extensions[this.name],c=t.options.ktx2Loader;if(!c){if(i.extensionsRequired&&i.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,a.source,c)}}class HA{constructor(e){this.parser=e,this.name=Mt.EXT_TEXTURE_WEBP,this.isSupported=null}loadTexture(e){const t=this.name,i=this.parser,s=i.json,a=s.textures[e];if(!a.extensions||!a.extensions[t])return null;const c=a.extensions[t],u=s.images[c.source];let h=i.textureLoader;if(u.uri){const f=i.options.manager.getHandler(u.uri);f!==null&&(h=f)}return this.detectSupport().then(function(f){if(f)return i.loadTextureImage(e,c.source,h);if(s.extensionsRequired&&s.extensionsRequired.indexOf(t)>=0)throw new Error("THREE.GLTFLoader: WebP required by asset but unsupported.");return i.loadTexture(e)})}detectSupport(){return this.isSupported||(this.isSupported=new Promise(function(e){const t=new Image;t.src="data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",t.onload=t.onerror=function(){e(t.height===1)}})),this.isSupported}}class VA{constructor(e){this.parser=e,this.name=Mt.EXT_TEXTURE_AVIF,this.isSupported=null}loadTexture(e){const t=this.name,i=this.parser,s=i.json,a=s.textures[e];if(!a.extensions||!a.extensions[t])return null;const c=a.extensions[t],u=s.images[c.source];let h=i.textureLoader;if(u.uri){const f=i.options.manager.getHandler(u.uri);f!==null&&(h=f)}return this.detectSupport().then(function(f){if(f)return i.loadTextureImage(e,c.source,h);if(s.extensionsRequired&&s.extensionsRequired.indexOf(t)>=0)throw new Error("THREE.GLTFLoader: AVIF required by asset but unsupported.");return i.loadTexture(e)})}detectSupport(){return this.isSupported||(this.isSupported=new Promise(function(e){const t=new Image;t.src="data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=",t.onload=t.onerror=function(){e(t.height===1)}})),this.isSupported}}class GA{constructor(e){this.name=Mt.EXT_MESHOPT_COMPRESSION,this.parser=e}loadBufferView(e){const t=this.parser.json,i=t.bufferViews[e];if(i.extensions&&i.extensions[this.name]){const s=i.extensions[this.name],a=this.parser.getDependency("buffer",s.buffer),c=this.parser.options.meshoptDecoder;if(!c||!c.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return a.then(function(u){const h=s.byteOffset||0,f=s.byteLength||0,m=s.count,g=s.byteStride,_=new Uint8Array(u,h,f);return c.decodeGltfBufferAsync?c.decodeGltfBufferAsync(m,g,_,s.mode,s.filter).then(function(y){return y.buffer}):c.ready.then(function(){const y=new ArrayBuffer(m*g);return c.decodeGltfBuffer(new Uint8Array(y),m,g,_,s.mode,s.filter),y})})}else return null}}class WA{constructor(e){this.name=Mt.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,i=t.nodes[e];if(!i.extensions||!i.extensions[this.name]||i.mesh===void 0)return null;const s=t.meshes[i.mesh];for(const f of s.primitives)if(f.mode!==li.TRIANGLES&&f.mode!==li.TRIANGLE_STRIP&&f.mode!==li.TRIANGLE_FAN&&f.mode!==void 0)return null;const c=i.extensions[this.name].attributes,u=[],h={};for(const f in c)u.push(this.parser.getDependency("accessor",c[f]).then(m=>(h[f]=m,h[f])));return u.length<1?null:(u.push(this.parser.createNodeMesh(e)),Promise.all(u).then(f=>{const m=f.pop(),g=m.isGroup?m.children:[m],_=f[0].count,y=[];for(const M of g){const E=new pt,S=new Y,x=new Ui,D=new Y(1,1,1),L=new Hy(M.geometry,M.material,_);for(let b=0;b<_;b++)h.TRANSLATION&&S.fromBufferAttribute(h.TRANSLATION,b),h.ROTATION&&x.fromBufferAttribute(h.ROTATION,b),h.SCALE&&D.fromBufferAttribute(h.SCALE,b),L.setMatrixAt(b,E.compose(S,x,D));for(const b in h)if(b==="_COLOR_0"){const V=h[b];L.instanceColor=new kh(V.array,V.itemSize,V.normalized)}else b!=="TRANSLATION"&&b!=="ROTATION"&&b!=="SCALE"&&M.geometry.setAttribute(b,h[b]);Qt.prototype.copy.call(L,M),this.parser.assignFinalMaterial(L),y.push(L)}return m.isGroup?(m.clear(),m.add(...y),m):y[0]}))}}const dv="glTF",ya=12,m_={JSON:1313821514,BIN:5130562};class jA{constructor(e){this.name=Mt.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,ya),i=new TextDecoder;if(this.header={magic:i.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==dv)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const s=this.header.length-ya,a=new DataView(e,ya);let c=0;for(;c<s;){const u=a.getUint32(c,!0);c+=4;const h=a.getUint32(c,!0);if(c+=4,h===m_.JSON){const f=new Uint8Array(e,ya+c,u);this.content=i.decode(f)}else if(h===m_.BIN){const f=ya+c;this.body=e.slice(f,f+u)}c+=u}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class XA{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=Mt.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const i=this.json,s=this.dracoLoader,a=e.extensions[this.name].bufferView,c=e.extensions[this.name].attributes,u={},h={},f={};for(const m in c){const g=Vh[m]||m.toLowerCase();u[g]=c[m]}for(const m in e.attributes){const g=Vh[m]||m.toLowerCase();if(c[m]!==void 0){const _=i.accessors[e.attributes[m]],y=go[_.componentType];f[g]=y.name,h[g]=_.normalized===!0}}return t.getDependency("bufferView",a).then(function(m){return new Promise(function(g,_){s.decodeDracoFile(m,function(y){for(const M in y.attributes){const E=y.attributes[M],S=h[M];S!==void 0&&(E.normalized=S)}g(y)},u,f,Bn,_)})})}}class YA{constructor(){this.name=Mt.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}}class qA{constructor(){this.name=Mt.KHR_MESH_QUANTIZATION}}class hv extends Na{constructor(e,t,i,s){super(e,t,i,s)}copySampleValue_(e){const t=this.resultBuffer,i=this.sampleValues,s=this.valueSize,a=e*s*3+s;for(let c=0;c!==s;c++)t[c]=i[a+c];return t}interpolate_(e,t,i,s){const a=this.resultBuffer,c=this.sampleValues,u=this.valueSize,h=u*2,f=u*3,m=s-t,g=(i-t)/m,_=g*g,y=_*g,M=e*f,E=M-f,S=-2*y+3*_,x=y-_,D=1-S,L=x-_+g;for(let b=0;b!==u;b++){const V=c[E+b+u],k=c[E+b+h]*m,F=c[M+b+u],X=c[M+b]*m;a[b]=D*V+L*k+S*F+x*X}return a}}const KA=new Ui;class $A extends hv{interpolate_(e,t,i,s){const a=super.interpolate_(e,t,i,s);return KA.fromArray(a).normalize().toArray(a),a}}const li={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},go={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},g_={9728:On,9729:ei,9984:A_,9985:mc,9986:Sa,9987:sr},__={33071:zr,33648:Ec,10497:yo},$d={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Vh={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Or={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},ZA={CUBICSPLINE:void 0,LINEAR:ba,STEP:Ra},Zd={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function QA(o){return o.DefaultMaterial===void 0&&(o.DefaultMaterial=new ys({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:lr})),o.DefaultMaterial}function ps(o,e,t){for(const i in t.extensions)o[i]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[i]=t.extensions[i])}function rr(o,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(o.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function JA(o,e,t){let i=!1,s=!1,a=!1;for(let f=0,m=e.length;f<m;f++){const g=e[f];if(g.POSITION!==void 0&&(i=!0),g.NORMAL!==void 0&&(s=!0),g.COLOR_0!==void 0&&(a=!0),i&&s&&a)break}if(!i&&!s&&!a)return Promise.resolve(o);const c=[],u=[],h=[];for(let f=0,m=e.length;f<m;f++){const g=e[f];if(i){const _=g.POSITION!==void 0?t.getDependency("accessor",g.POSITION):o.attributes.position;c.push(_)}if(s){const _=g.NORMAL!==void 0?t.getDependency("accessor",g.NORMAL):o.attributes.normal;u.push(_)}if(a){const _=g.COLOR_0!==void 0?t.getDependency("accessor",g.COLOR_0):o.attributes.color;h.push(_)}}return Promise.all([Promise.all(c),Promise.all(u),Promise.all(h)]).then(function(f){const m=f[0],g=f[1],_=f[2];return i&&(o.morphAttributes.position=m),s&&(o.morphAttributes.normal=g),a&&(o.morphAttributes.color=_),o.morphTargetsRelative=!0,o})}function e1(o,e){if(o.updateMorphTargets(),e.weights!==void 0)for(let t=0,i=e.weights.length;t<i;t++)o.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(o.morphTargetInfluences.length===t.length){o.morphTargetDictionary={};for(let i=0,s=t.length;i<s;i++)o.morphTargetDictionary[t[i]]=i}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function t1(o){let e;const t=o.extensions&&o.extensions[Mt.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Qd(t.attributes):e=o.indices+":"+Qd(o.attributes)+":"+o.mode,o.targets!==void 0)for(let i=0,s=o.targets.length;i<s;i++)e+=":"+Qd(o.targets[i]);return e}function Qd(o){let e="";const t=Object.keys(o).sort();for(let i=0,s=t.length;i<s;i++)e+=t[i]+":"+o[t[i]]+";";return e}function Gh(o){switch(o){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function n1(o){return o.search(/\.jpe?g($|\?)/i)>0||o.search(/^data\:image\/jpeg/)===0?"image/jpeg":o.search(/\.webp($|\?)/i)>0||o.search(/^data\:image\/webp/)===0?"image/webp":o.search(/\.ktx2($|\?)/i)>0||o.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const i1=new pt;class r1{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new AA,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let i=!1,s=-1,a=!1,c=-1;if(typeof navigator<"u"){const u=navigator.userAgent;i=/^((?!chrome|android).)*safari/i.test(u)===!0;const h=u.match(/Version\/(\d+)/);s=i&&h?parseInt(h[1],10):-1,a=u.indexOf("Firefox")>-1,c=a?u.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||i&&s<17||a&&c<98?this.textureLoader=new lS(this.options.manager):this.textureLoader=new fS(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new nv(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const i=this,s=this.json,a=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(c){return c._markDefs&&c._markDefs()}),Promise.all(this._invokeAll(function(c){return c.beforeRoot&&c.beforeRoot()})).then(function(){return Promise.all([i.getDependencies("scene"),i.getDependencies("animation"),i.getDependencies("camera")])}).then(function(c){const u={scene:c[0][s.scene||0],scenes:c[0],animations:c[1],cameras:c[2],asset:s.asset,parser:i,userData:{}};return ps(a,u,s),rr(u,s),Promise.all(i._invokeAll(function(h){return h.afterRoot&&h.afterRoot(u)})).then(function(){for(const h of u.scenes)h.updateMatrixWorld();e(u)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],i=this.json.meshes||[];for(let s=0,a=t.length;s<a;s++){const c=t[s].joints;for(let u=0,h=c.length;u<h;u++)e[c[u]].isBone=!0}for(let s=0,a=e.length;s<a;s++){const c=e[s];c.mesh!==void 0&&(this._addNodeRef(this.meshCache,c.mesh),c.skin!==void 0&&(i[c.mesh].isSkinnedMesh=!0)),c.camera!==void 0&&this._addNodeRef(this.cameraCache,c.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,i){if(e.refs[t]<=1)return i;const s=i.clone(),a=(c,u)=>{const h=this.associations.get(c);h!=null&&this.associations.set(u,h);for(const[f,m]of c.children.entries())a(m,u.children[f])};return a(i,s),s.name+="_instance_"+e.uses[t]++,s}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let i=0;i<t.length;i++){const s=e(t[i]);if(s)return s}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const i=[];for(let s=0;s<t.length;s++){const a=e(t[s]);a&&i.push(a)}return i}getDependency(e,t){const i=e+":"+t;let s=this.cache.get(i);if(!s){switch(e){case"scene":s=this.loadScene(t);break;case"node":s=this._invokeOne(function(a){return a.loadNode&&a.loadNode(t)});break;case"mesh":s=this._invokeOne(function(a){return a.loadMesh&&a.loadMesh(t)});break;case"accessor":s=this.loadAccessor(t);break;case"bufferView":s=this._invokeOne(function(a){return a.loadBufferView&&a.loadBufferView(t)});break;case"buffer":s=this.loadBuffer(t);break;case"material":s=this._invokeOne(function(a){return a.loadMaterial&&a.loadMaterial(t)});break;case"texture":s=this._invokeOne(function(a){return a.loadTexture&&a.loadTexture(t)});break;case"skin":s=this.loadSkin(t);break;case"animation":s=this._invokeOne(function(a){return a.loadAnimation&&a.loadAnimation(t)});break;case"camera":s=this.loadCamera(t);break;default:if(s=this._invokeOne(function(a){return a!=this&&a.getDependency&&a.getDependency(e,t)}),!s)throw new Error("Unknown type: "+e);break}this.cache.add(i,s)}return s}getDependencies(e){let t=this.cache.get(e);if(!t){const i=this,s=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(s.map(function(a,c){return i.getDependency(e,c)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],i=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[Mt.KHR_BINARY_GLTF].body);const s=this.options;return new Promise(function(a,c){i.load(wa.resolveURL(t.uri,s.path),a,void 0,function(){c(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(i){const s=t.byteLength||0,a=t.byteOffset||0;return i.slice(a,a+s)})}loadAccessor(e){const t=this,i=this.json,s=this.json.accessors[e];if(s.bufferView===void 0&&s.sparse===void 0){const c=$d[s.type],u=go[s.componentType],h=s.normalized===!0,f=new u(s.count*c);return Promise.resolve(new kn(f,c,h))}const a=[];return s.bufferView!==void 0?a.push(this.getDependency("bufferView",s.bufferView)):a.push(null),s.sparse!==void 0&&(a.push(this.getDependency("bufferView",s.sparse.indices.bufferView)),a.push(this.getDependency("bufferView",s.sparse.values.bufferView))),Promise.all(a).then(function(c){const u=c[0],h=$d[s.type],f=go[s.componentType],m=f.BYTES_PER_ELEMENT,g=m*h,_=s.byteOffset||0,y=s.bufferView!==void 0?i.bufferViews[s.bufferView].byteStride:void 0,M=s.normalized===!0;let E,S;if(y&&y!==g){const x=Math.floor(_/y),D="InterleavedBuffer:"+s.bufferView+":"+s.componentType+":"+x+":"+s.count;let L=t.cache.get(D);L||(E=new f(u,x*y,s.count*y/m),L=new Fy(E,y/m),t.cache.add(D,L)),S=new nf(L,h,_%y/m,M)}else u===null?E=new f(s.count*h):E=new f(u,_,s.count*h),S=new kn(E,h,M);if(s.sparse!==void 0){const x=$d.SCALAR,D=go[s.sparse.indices.componentType],L=s.sparse.indices.byteOffset||0,b=s.sparse.values.byteOffset||0,V=new D(c[1],L,s.sparse.count*x),k=new f(c[2],b,s.sparse.count*h);u!==null&&(S=new kn(S.array.slice(),S.itemSize,S.normalized)),S.normalized=!1;for(let F=0,X=V.length;F<X;F++){const C=V[F];if(S.setX(C,k[F*h]),h>=2&&S.setY(C,k[F*h+1]),h>=3&&S.setZ(C,k[F*h+2]),h>=4&&S.setW(C,k[F*h+3]),h>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}S.normalized=M}return S})}loadTexture(e){const t=this.json,i=this.options,a=t.textures[e].source,c=t.images[a];let u=this.textureLoader;if(c.uri){const h=i.manager.getHandler(c.uri);h!==null&&(u=h)}return this.loadTextureImage(e,a,u)}loadTextureImage(e,t,i){const s=this,a=this.json,c=a.textures[e],u=a.images[t],h=(u.uri||u.bufferView)+":"+c.sampler;if(this.textureCache[h])return this.textureCache[h];const f=this.loadImageSource(t,i).then(function(m){m.flipY=!1,m.name=c.name||u.name||"",m.name===""&&typeof u.uri=="string"&&u.uri.startsWith("data:image/")===!1&&(m.name=u.uri);const _=(a.samplers||{})[c.sampler]||{};return m.magFilter=g_[_.magFilter]||ei,m.minFilter=g_[_.minFilter]||sr,m.wrapS=__[_.wrapS]||yo,m.wrapT=__[_.wrapT]||yo,m.generateMipmaps=!m.isCompressedTexture&&m.minFilter!==On&&m.minFilter!==ei,s.associations.set(m,{textures:e}),m}).catch(function(){return null});return this.textureCache[h]=f,f}loadImageSource(e,t){const i=this,s=this.json,a=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(g=>g.clone());const c=s.images[e],u=self.URL||self.webkitURL;let h=c.uri||"",f=!1;if(c.bufferView!==void 0)h=i.getDependency("bufferView",c.bufferView).then(function(g){f=!0;const _=new Blob([g],{type:c.mimeType});return h=u.createObjectURL(_),h});else if(c.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const m=Promise.resolve(h).then(function(g){return new Promise(function(_,y){let M=_;t.isImageBitmapLoader===!0&&(M=function(E){const S=new _n(E);S.needsUpdate=!0,_(S)}),t.load(wa.resolveURL(g,a.path),M,void 0,y)})}).then(function(g){return f===!0&&u.revokeObjectURL(h),rr(g,c),g.userData.mimeType=c.mimeType||n1(c.uri),g}).catch(function(g){throw console.error("THREE.GLTFLoader: Couldn't load texture",h),g});return this.sourceCache[e]=m,m}assignTexture(e,t,i,s){const a=this;return this.getDependency("texture",i.index).then(function(c){if(!c)return null;if(i.texCoord!==void 0&&i.texCoord>0&&(c=c.clone(),c.channel=i.texCoord),a.extensions[Mt.KHR_TEXTURE_TRANSFORM]){const u=i.extensions!==void 0?i.extensions[Mt.KHR_TEXTURE_TRANSFORM]:void 0;if(u){const h=a.associations.get(c);c=a.extensions[Mt.KHR_TEXTURE_TRANSFORM].extendTexture(c,u),a.associations.set(c,h)}}return s!==void 0&&(c.colorSpace=s),e[t]=c,c})}assignFinalMaterial(e){const t=e.geometry;let i=e.material;const s=t.attributes.tangent===void 0,a=t.attributes.color!==void 0,c=t.attributes.normal===void 0;if(e.isPoints){const u="PointsMaterial:"+i.uuid;let h=this.cache.get(u);h||(h=new Q_,wi.prototype.copy.call(h,i),h.color.copy(i.color),h.map=i.map,h.sizeAttenuation=!1,this.cache.add(u,h)),i=h}else if(e.isLine){const u="LineBasicMaterial:"+i.uuid;let h=this.cache.get(u);h||(h=new Cc,wi.prototype.copy.call(h,i),h.color.copy(i.color),h.map=i.map,this.cache.add(u,h)),i=h}if(s||a||c){let u="ClonedMaterial:"+i.uuid+":";s&&(u+="derivative-tangents:"),a&&(u+="vertex-colors:"),c&&(u+="flat-shading:");let h=this.cache.get(u);h||(h=i.clone(),a&&(h.vertexColors=!0),c&&(h.flatShading=!0),s&&(h.normalScale&&(h.normalScale.y*=-1),h.clearcoatNormalScale&&(h.clearcoatNormalScale.y*=-1)),this.cache.add(u,h),this.associations.set(h,this.associations.get(i))),i=h}e.material=i}getMaterialType(){return ys}loadMaterial(e){const t=this,i=this.json,s=this.extensions,a=i.materials[e];let c;const u={},h=a.extensions||{},f=[];if(h[Mt.KHR_MATERIALS_UNLIT]){const g=s[Mt.KHR_MATERIALS_UNLIT];c=g.getMaterialType(),f.push(g.extendParams(u,a,t))}else{const g=a.pbrMetallicRoughness||{};if(u.color=new rt(1,1,1),u.opacity=1,Array.isArray(g.baseColorFactor)){const _=g.baseColorFactor;u.color.setRGB(_[0],_[1],_[2],Bn),u.opacity=_[3]}g.baseColorTexture!==void 0&&f.push(t.assignTexture(u,"map",g.baseColorTexture,gn)),u.metalness=g.metallicFactor!==void 0?g.metallicFactor:1,u.roughness=g.roughnessFactor!==void 0?g.roughnessFactor:1,g.metallicRoughnessTexture!==void 0&&(f.push(t.assignTexture(u,"metalnessMap",g.metallicRoughnessTexture)),f.push(t.assignTexture(u,"roughnessMap",g.metallicRoughnessTexture))),c=this._invokeOne(function(_){return _.getMaterialType&&_.getMaterialType(e)}),f.push(Promise.all(this._invokeAll(function(_){return _.extendMaterialParams&&_.extendMaterialParams(e,u)})))}a.doubleSided===!0&&(u.side=yi);const m=a.alphaMode||Zd.OPAQUE;if(m===Zd.BLEND?(u.transparent=!0,u.depthWrite=!1):(u.transparent=!1,m===Zd.MASK&&(u.alphaTest=a.alphaCutoff!==void 0?a.alphaCutoff:.5)),a.normalTexture!==void 0&&c!==Ii&&(f.push(t.assignTexture(u,"normalMap",a.normalTexture)),u.normalScale=new ot(1,1),a.normalTexture.scale!==void 0)){const g=a.normalTexture.scale;u.normalScale.set(g,g)}if(a.occlusionTexture!==void 0&&c!==Ii&&(f.push(t.assignTexture(u,"aoMap",a.occlusionTexture)),a.occlusionTexture.strength!==void 0&&(u.aoMapIntensity=a.occlusionTexture.strength)),a.emissiveFactor!==void 0&&c!==Ii){const g=a.emissiveFactor;u.emissive=new rt().setRGB(g[0],g[1],g[2],Bn)}return a.emissiveTexture!==void 0&&c!==Ii&&f.push(t.assignTexture(u,"emissiveMap",a.emissiveTexture,gn)),Promise.all(f).then(function(){const g=new c(u);return a.name&&(g.name=a.name),rr(g,a),t.associations.set(g,{materials:e}),a.extensions&&ps(s,g,a),g})}createUniqueName(e){const t=Ot.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,i=this.extensions,s=this.primitiveCache;function a(u){return i[Mt.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(u,t).then(function(h){return v_(h,u,t)})}const c=[];for(let u=0,h=e.length;u<h;u++){const f=e[u],m=t1(f),g=s[m];if(g)c.push(g.promise);else{let _;f.extensions&&f.extensions[Mt.KHR_DRACO_MESH_COMPRESSION]?_=a(f):_=v_(new Yn,f,t),s[m]={primitive:f,promise:_},c.push(_)}}return Promise.all(c)}loadMesh(e){const t=this,i=this.json,s=this.extensions,a=i.meshes[e],c=a.primitives,u=[];for(let h=0,f=c.length;h<f;h++){const m=c[h].material===void 0?QA(this.cache):this.getDependency("material",c[h].material);u.push(m)}return u.push(t.loadGeometries(c)),Promise.all(u).then(function(h){const f=h.slice(0,h.length-1),m=h[h.length-1],g=[];for(let y=0,M=m.length;y<M;y++){const E=m[y],S=c[y];let x;const D=f[y];if(S.mode===li.TRIANGLES||S.mode===li.TRIANGLE_STRIP||S.mode===li.TRIANGLE_FAN||S.mode===void 0)x=a.isSkinnedMesh===!0?new ky(E,D):new Ht(E,D),x.isSkinnedMesh===!0&&x.normalizeSkinWeights(),S.mode===li.TRIANGLE_STRIP?x.geometry=p_(x.geometry,F_):S.mode===li.TRIANGLE_FAN&&(x.geometry=p_(x.geometry,Fh));else if(S.mode===li.LINES)x=new af(E,D);else if(S.mode===li.LINE_STRIP)x=new of(E,D);else if(S.mode===li.LINE_LOOP)x=new Wy(E,D);else if(S.mode===li.POINTS)x=new jy(E,D);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+S.mode);Object.keys(x.geometry.morphAttributes).length>0&&e1(x,a),x.name=t.createUniqueName(a.name||"mesh_"+e),rr(x,a),S.extensions&&ps(s,x,S),t.assignFinalMaterial(x),g.push(x)}for(let y=0,M=g.length;y<M;y++)t.associations.set(g[y],{meshes:e,primitives:y});if(g.length===1)return a.extensions&&ps(s,g[0],a),g[0];const _=new Hr;a.extensions&&ps(s,_,a),t.associations.set(_,{meshes:e});for(let y=0,M=g.length;y<M;y++)_.add(g[y]);return _})}loadCamera(e){let t;const i=this.json.cameras[e],s=i[i.type];if(!s){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return i.type==="perspective"?t=new Un(k_.radToDeg(s.yfov),s.aspectRatio||1,s.znear||1,s.zfar||2e6):i.type==="orthographic"&&(t=new hf(-s.xmag,s.xmag,s.ymag,-s.ymag,s.znear,s.zfar)),i.name&&(t.name=this.createUniqueName(i.name)),rr(t,i),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],i=[];for(let s=0,a=t.joints.length;s<a;s++)i.push(this._loadNodeShallow(t.joints[s]));return t.inverseBindMatrices!==void 0?i.push(this.getDependency("accessor",t.inverseBindMatrices)):i.push(null),Promise.all(i).then(function(s){const a=s.pop(),c=s,u=[],h=[];for(let f=0,m=c.length;f<m;f++){const g=c[f];if(g){u.push(g);const _=new pt;a!==null&&_.fromArray(a.array,f*16),h.push(_)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[f])}return new rf(u,h)})}loadAnimation(e){const t=this.json,i=this,s=t.animations[e],a=s.name?s.name:"animation_"+e,c=[],u=[],h=[],f=[],m=[];for(let g=0,_=s.channels.length;g<_;g++){const y=s.channels[g],M=s.samplers[y.sampler],E=y.target,S=E.node,x=s.parameters!==void 0?s.parameters[M.input]:M.input,D=s.parameters!==void 0?s.parameters[M.output]:M.output;E.node!==void 0&&(c.push(this.getDependency("node",S)),u.push(this.getDependency("accessor",x)),h.push(this.getDependency("accessor",D)),f.push(M),m.push(E))}return Promise.all([Promise.all(c),Promise.all(u),Promise.all(h),Promise.all(f),Promise.all(m)]).then(function(g){const _=g[0],y=g[1],M=g[2],E=g[3],S=g[4],x=[];for(let D=0,L=_.length;D<L;D++){const b=_[D],V=y[D],k=M[D],F=E[D],X=S[D];if(b===void 0)continue;b.updateMatrix&&b.updateMatrix();const C=i._createAnimationTracks(b,V,k,F,X);if(C)for(let R=0;R<C.length;R++)x.push(C[R])}return new tS(a,void 0,x)})}createNodeMesh(e){const t=this.json,i=this,s=t.nodes[e];return s.mesh===void 0?null:i.getDependency("mesh",s.mesh).then(function(a){const c=i._getNodeRef(i.meshCache,s.mesh,a);return s.weights!==void 0&&c.traverse(function(u){if(u.isMesh)for(let h=0,f=s.weights.length;h<f;h++)u.morphTargetInfluences[h]=s.weights[h]}),c})}loadNode(e){const t=this.json,i=this,s=t.nodes[e],a=i._loadNodeShallow(e),c=[],u=s.children||[];for(let f=0,m=u.length;f<m;f++)c.push(i.getDependency("node",u[f]));const h=s.skin===void 0?Promise.resolve(null):i.getDependency("skin",s.skin);return Promise.all([a,Promise.all(c),h]).then(function(f){const m=f[0],g=f[1],_=f[2];_!==null&&m.traverse(function(y){y.isSkinnedMesh&&y.bind(_,i1)});for(let y=0,M=g.length;y<M;y++)m.add(g[y]);return m})}_loadNodeShallow(e){const t=this.json,i=this.extensions,s=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const a=t.nodes[e],c=a.name?s.createUniqueName(a.name):"",u=[],h=s._invokeOne(function(f){return f.createNodeMesh&&f.createNodeMesh(e)});return h&&u.push(h),a.camera!==void 0&&u.push(s.getDependency("camera",a.camera).then(function(f){return s._getNodeRef(s.cameraCache,a.camera,f)})),s._invokeAll(function(f){return f.createNodeAttachment&&f.createNodeAttachment(e)}).forEach(function(f){u.push(f)}),this.nodeCache[e]=Promise.all(u).then(function(f){let m;if(a.isBone===!0?m=new $_:f.length>1?m=new Hr:f.length===1?m=f[0]:m=new Qt,m!==f[0])for(let g=0,_=f.length;g<_;g++)m.add(f[g]);if(a.name&&(m.userData.name=a.name,m.name=c),rr(m,a),a.extensions&&ps(i,m,a),a.matrix!==void 0){const g=new pt;g.fromArray(a.matrix),m.applyMatrix4(g)}else a.translation!==void 0&&m.position.fromArray(a.translation),a.rotation!==void 0&&m.quaternion.fromArray(a.rotation),a.scale!==void 0&&m.scale.fromArray(a.scale);return s.associations.has(m)||s.associations.set(m,{}),s.associations.get(m).nodes=e,m}),this.nodeCache[e]}loadScene(e){const t=this.extensions,i=this.json.scenes[e],s=this,a=new Hr;i.name&&(a.name=s.createUniqueName(i.name)),rr(a,i),i.extensions&&ps(t,a,i);const c=i.nodes||[],u=[];for(let h=0,f=c.length;h<f;h++)u.push(s.getDependency("node",c[h]));return Promise.all(u).then(function(h){for(let m=0,g=h.length;m<g;m++)a.add(h[m]);const f=m=>{const g=new Map;for(const[_,y]of s.associations)(_ instanceof wi||_ instanceof _n)&&g.set(_,y);return m.traverse(_=>{const y=s.associations.get(_);y!=null&&g.set(_,y)}),g};return s.associations=f(a),a})}_createAnimationTracks(e,t,i,s,a){const c=[],u=e.name?e.name:e.uuid,h=[];Or[a.path]===Or.weights?e.traverse(function(_){_.morphTargetInfluences&&h.push(_.name?_.name:_.uuid)}):h.push(u);let f;switch(Or[a.path]){case Or.weights:f=wo;break;case Or.rotation:f=Ao;break;case Or.position:case Or.scale:f=Ro;break;default:switch(i.itemSize){case 1:f=wo;break;case 2:case 3:default:f=Ro;break}break}const m=s.interpolation!==void 0?ZA[s.interpolation]:ba,g=this._getArrayFromAccessor(i);for(let _=0,y=h.length;_<y;_++){const M=new f(h[_]+"."+Or[a.path],t.array,g,m);s.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(M),c.push(M)}return c}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const i=Gh(t.constructor),s=new Float32Array(t.length);for(let a=0,c=t.length;a<c;a++)s[a]=t[a]*i;t=s}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(i){const s=this instanceof Ao?$A:hv;return new s(this.times,this.values,this.getValueSize()/3,i)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function s1(o,e,t){const i=e.attributes,s=new Oi;if(i.POSITION!==void 0){const u=t.json.accessors[i.POSITION],h=u.min,f=u.max;if(h!==void 0&&f!==void 0){if(s.set(new Y(h[0],h[1],h[2]),new Y(f[0],f[1],f[2])),u.normalized){const m=Gh(go[u.componentType]);s.min.multiplyScalar(m),s.max.multiplyScalar(m)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const a=e.targets;if(a!==void 0){const u=new Y,h=new Y;for(let f=0,m=a.length;f<m;f++){const g=a[f];if(g.POSITION!==void 0){const _=t.json.accessors[g.POSITION],y=_.min,M=_.max;if(y!==void 0&&M!==void 0){if(h.setX(Math.max(Math.abs(y[0]),Math.abs(M[0]))),h.setY(Math.max(Math.abs(y[1]),Math.abs(M[1]))),h.setZ(Math.max(Math.abs(y[2]),Math.abs(M[2]))),_.normalized){const E=Gh(go[_.componentType]);h.multiplyScalar(E)}u.max(h)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}s.expandByVector(u)}o.boundingBox=s;const c=new ki;s.getCenter(c.center),c.radius=s.min.distanceTo(s.max)/2,o.boundingSphere=c}function v_(o,e,t){const i=e.attributes,s=[];function a(c,u){return t.getDependency("accessor",c).then(function(h){o.setAttribute(u,h)})}for(const c in i){const u=Vh[c]||c.toLowerCase();u in o.attributes||s.push(a(i[c],u))}if(e.indices!==void 0&&!o.index){const c=t.getDependency("accessor",e.indices).then(function(u){o.setIndex(u)});s.push(c)}return At.workingColorSpace!==Bn&&"COLOR_0"in i&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${At.workingColorSpace}" not supported.`),rr(o,e),s1(o,e,t),Promise.all(s).then(function(){return e.targets!==void 0?JA(o,e.targets,t):o})}class o1 extends K_{constructor(){super();const e=new bo;e.deleteAttribute("uv");const t=new ys({side:Fn}),i=new ys,s=new iv(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);const a=new Ht(e,t);a.position.set(-.757,13.219,.717),a.scale.set(31.713,28.305,28.591),this.add(a);const c=new Ht(e,i);c.position.set(-10.906,2.009,1.846),c.rotation.set(0,-.195,0),c.scale.set(2.328,7.905,4.651),this.add(c);const u=new Ht(e,i);u.position.set(-5.607,-.754,-.758),u.rotation.set(0,.994,0),u.scale.set(1.97,1.534,3.955),this.add(u);const h=new Ht(e,i);h.position.set(6.167,.857,7.803),h.rotation.set(0,.561,0),h.scale.set(3.927,6.285,3.687),this.add(h);const f=new Ht(e,i);f.position.set(-2.017,.018,6.124),f.rotation.set(0,.333,0),f.scale.set(2.002,4.566,2.064),this.add(f);const m=new Ht(e,i);m.position.set(2.291,-.756,-2.621),m.rotation.set(0,-.286,0),m.scale.set(1.546,1.552,1.496),this.add(m);const g=new Ht(e,i);g.position.set(-2.193,-.369,-5.547),g.rotation.set(0,.516,0),g.scale.set(3.875,3.487,2.986),this.add(g);const _=new Ht(e,ao(50));_.position.set(-16.116,14.37,8.208),_.scale.set(.1,2.428,2.739),this.add(_);const y=new Ht(e,ao(50));y.position.set(-16.109,18.021,-8.207),y.scale.set(.1,2.425,2.751),this.add(y);const M=new Ht(e,ao(17));M.position.set(14.904,12.198,-1.832),M.scale.set(.15,4.265,6.331),this.add(M);const E=new Ht(e,ao(43));E.position.set(-.462,8.89,14.52),E.scale.set(4.38,5.441,.088),this.add(E);const S=new Ht(e,ao(20));S.position.set(3.235,11.486,-12.541),S.scale.set(2.5,2,.1),this.add(S);const x=new Ht(e,ao(100));x.position.set(0,20,0),x.scale.set(1,.1,1),this.add(x)}dispose(){const e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(const t of e)t.dispose()}}function ao(o){const e=new Ii;return e.color.setScalar(o),e}const a1={studio:{keyColor:16775408,keyInt:2.35,fillColor:12573183,fillInt:1.05,rimColor:15134975,rimInt:1.65,exposure:1.1},cyber:{keyColor:6220500,keyInt:2.5,fillColor:8490232,fillInt:1.35,rimColor:3718648,rimInt:2.4,exposure:1.15},warm:{keyColor:16766369,keyInt:2.55,fillColor:9684477,fillInt:.85,rimColor:16639626,rimInt:1.75,exposure:1.12},dramatic:{keyColor:16777215,keyInt:3.1,fillColor:1976635,fillInt:.35,rimColor:6333946,rimInt:2.6,exposure:1.04}},l1=({glbUrl:o,frontAxis:e,shading:t,lighting:i,showSkeleton:s,autoTurn:a,activeLod:c,cameraPreset:u,cameraTrigger:h})=>{const f=Ze.useRef(null),[m,g]=Ze.useState(!1),[_,y]=Ze.useState(0),[M,E]=Ze.useState(null),[S,x]=Ze.useState({meshes:0,tris:0,bones:0,textures:0}),D=Ze.useRef(null),L=Ze.useRef(null),b=Ze.useRef(null),V=Ze.useRef(null),k=Ze.useRef(null),F=Ze.useRef(null),X=Ze.useRef(null),C=Ze.useRef(new Map),R=Ze.useRef(null),H=Ze.useRef(a);return H.current=a,Ze.useEffect(()=>{const J=f.current;if(!J)return;const K=new K_;K.background=new rt(724501),K.fog=new tf(724501,.085),D.current=K;const fe=new Un(36,Math.max(1,J.clientWidth)/Math.max(1,J.clientHeight),.04,60);fe.position.set(.72,1.18,2.55),b.current=fe;const ue=new uA({antialias:!0,powerPreference:"high-performance"});ue.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),ue.setSize(J.clientWidth,J.clientHeight),ue.toneMapping=T_,ue.toneMappingExposure=1.1,ue.outputColorSpace=gn,ue.shadowMap.enabled=!0,ue.shadowMap.type=M_,J.innerHTML="",J.appendChild(ue.domElement),L.current=ue;const ce=new zh(ue),de=ce.fromScene(new o1,.04).texture;K.environment=de,K.environmentIntensity=.72,ce.dispose();const O=new hA(fe,ue.domElement);O.enableDamping=!0,O.dampingFactor=.065,O.minDistance=.38,O.maxDistance=8.5,O.target.set(0,.92,0),O.update(),V.current=O;const le=new lf(1.45,72);le.rotateX(-Math.PI/2);const oe=new ys({color:1119778,roughness:.72,metalness:.18}),U=new Ht(le,oe);U.receiveShadow=!0,U.position.y=-.001,K.add(U);const ne=new cf(.68,.7,72);ne.rotateX(-Math.PI/2);const Le=new Ii({color:3718648,transparent:!0,opacity:.35,side:yi}),Q=new Ht(ne,Le);Q.position.y=.001,K.add(Q);const he=new AS(4.8,24,1976635,1317673);he.position.y=5e-4,K.add(he);const ge=new Sc(16775408,2.35);ge.position.set(2.2,3.2,2.5),ge.castShadow=!0,ge.shadow.mapSize.set(2048,2048),ge.shadow.camera.near=.5,ge.shadow.camera.far=9.5;const pe=1.4;ge.shadow.camera.left=-pe,ge.shadow.camera.right=pe,ge.shadow.camera.top=pe*1.5,ge.shadow.camera.bottom=-.2,ge.shadow.bias=-4e-4,K.add(ge);const Re=new Sc(12573183,1.05);Re.position.set(-2.5,1.8,1.6),K.add(Re);const Pe=new Sc(15134975,1.65);Pe.position.set(0,2.5,-2.6),K.add(Pe),R.current={key:ge,fill:Re,rim:Pe};const Oe=new Hr;K.add(Oe),k.current=Oe;let Et=0;const st=new mS,Rt=()=>{Et=requestAnimationFrame(Rt);const Yt=st.getDelta();H.current&&k.current&&(k.current.rotation.y+=Yt*.48),O.update(),ue.render(K,fe)};Rt();const B=new ResizeObserver(()=>{if(!J||!L.current||!b.current)return;const Yt=Math.max(1,J.clientWidth),it=Math.max(1,J.clientHeight);b.current.aspect=Yt/it,b.current.updateProjectionMatrix(),L.current.setSize(Yt,it)});return B.observe(J),()=>{cancelAnimationFrame(Et),B.disconnect(),O.dispose(),ue.dispose(),de.dispose()}},[]),Ze.useEffect(()=>{const J=D.current,K=k.current,fe=L.current;if(!J||!K||!o)return;let ue=!1;for(g(!0),y(0),E(null),X.current&&(J.remove(X.current),X.current.dispose(),X.current=null),F.current=null;K.children.length>0;)K.remove(K.children[0]);K.rotation.set(0,0,0),C.current.clear();const ce=fe?fe.capabilities.getMaxAnisotropy():8;return new wA().load(o,O=>{if(ue)return;const le=O.scene;e==="-Z"&&(le.rotation.y=Math.PI);const oe=new Oi().setFromObject(le);if(!oe.isEmpty()){const ge=oe.getCenter(new Y);le.position.x-=ge.x,le.position.z-=ge.z,le.position.y-=oe.min.y}let U=0,ne=0,Le=0,Q=null;const he=new Set;if(le.traverse(ge=>{var Re,Pe;const pe=ge;if(pe.isMesh){U+=1,pe.castShadow=!0,pe.receiveShadow=!0;const Oe=pe.geometry;Oe&&(ne+=Oe.index?Math.round(Oe.index.count/3):Math.round((((Re=Oe.attributes.position)==null?void 0:Re.count)||0)/3));const Et=Array.isArray(pe.material)?pe.material:[pe.material];for(const Rt of Et){const B=Rt;if(!B)continue;const Yt=[B.map,B.normalMap,B.roughnessMap,B.metalnessMap,B.aoMap];for(const it of Yt)it&&(it.anisotropy=ce,it.needsUpdate=!0,he.add(it.uuid));if(B.normalMap&&Oe&&Oe.index&&Oe.attributes.position&&Oe.attributes.normal&&Oe.attributes.uv&&!Oe.attributes.tangent)try{Oe.computeTangents()}catch{}}C.current.set(pe.uuid,pe.material);const st=pe;st.isSkinnedMesh&&st.skeleton&&st.skeleton.bones.length>Le&&(Le=st.skeleton.bones.length,Q=((Pe=st.skeleton.bones[0])==null?void 0:Pe.parent)||le)}}),K.add(le),Q&&Le>0){const ge=new wS(Q),pe=ge.material;pe.linewidth=2,pe.depthTest=!1,ge.renderOrder=999,ge.visible=s,J.add(ge),X.current=ge}x({meshes:U,tris:ne,bones:Le,textures:he.size}),x_(K,t,C.current),g(!1)},O=>{O.total>0&&y(Math.min(99,Math.round(O.loaded/O.total*100)))},O=>{ue||(E(O instanceof Error?O.message:"Failed to load GLB stream"),g(!1))}),()=>{ue=!0}},[o,e]),Ze.useEffect(()=>{k.current&&x_(k.current,t,C.current)},[t]),Ze.useEffect(()=>{X.current&&(X.current.visible=s)},[s]),Ze.useEffect(()=>{const J=a1[i];R.current&&(R.current.key.color.setHex(J.keyColor),R.current.key.intensity=J.keyInt,R.current.fill.color.setHex(J.fillColor),R.current.fill.intensity=J.fillInt,R.current.rim.color.setHex(J.rimColor),R.current.rim.intensity=J.rimInt),L.current&&(L.current.toneMappingExposure=J.exposure)},[i]),Ze.useEffect(()=>{const J=b.current,K=V.current;if(!(!J||!K)){switch(k.current&&(k.current.rotation.y=0),u){case"front":J.position.set(0,1.04,2.65),K.target.set(0,.92,0);break;case"back":J.position.set(0,1.04,-2.65),K.target.set(0,.92,0);break;case"portrait":J.position.set(.18,1.56,.72),K.target.set(0,1.52,0);break;case"three_quarter":case"reset":default:J.position.set(.78,1.18,2.52),K.target.set(0,.92,0);break}K.update()}},[u,h]),N.jsxs("div",{className:"vp-shell",children:[N.jsx("div",{ref:f,className:"vp-canvas"}),N.jsxs("div",{className:"vp-hud-top",children:[N.jsx("span",{className:"vp-pill vp-pill-accent",children:c}),N.jsx("span",{className:"vp-pill vp-pill-tex",children:S.textures>0?`${S.textures} PBR TEXTURES · 16x ANISO`:"UNTEX / SCALAR"}),N.jsxs("span",{className:"vp-pill",children:[S.tris.toLocaleString()," TRIS"]}),N.jsxs("span",{className:"vp-pill",children:[S.meshes," SUB-MESHES"]}),S.bones>0&&N.jsxs("span",{className:"vp-pill",children:[S.bones," UE5 BONES"]})]}),m&&N.jsxs("div",{className:"vp-overlay",children:[N.jsx("div",{className:"vp-spinner"}),N.jsxs("div",{className:"vp-loading-title",children:["Streaming High-Poly Textured GLB ",_>0?`(${_}%)`:""]}),N.jsx("div",{className:"vp-loading-sub",children:"Uploading 1K/2K PBR Albedo, Normal & ORM textures to WebGL2 GPU…"})]}),M&&N.jsxs("div",{className:"vp-overlay vp-error",children:[N.jsx("div",{className:"vp-loading-title",children:"Viewport Load Error"}),N.jsx("div",{className:"vp-loading-sub",children:M})]})]})};function x_(o,e,t){const i=new ys({color:11906984,roughness:.44,metalness:.04}),s=new Xy({flatShading:!1});o.traverse(a=>{const c=a;if(!c.isMesh)return;const u=t.get(c.uuid);if(u)if(e==="pbr")c.material=u,c1(c.material,!1);else if(e==="texwire")if(Array.isArray(u))c.material=u.map(h=>{const f=h.clone();return f.wireframe=!0,f});else{const h=u.clone();h.wireframe=!0,c.material=h}else if(e==="albedo"){const h=f=>{const m=f;return new Ii({map:m.map||null,color:m.map?16777215:m.color||14412542})};c.material=Array.isArray(u)?u.map(h):h(u)}else e==="clay"?c.material=i:e==="normals"&&(c.material=s)})}function c1(o,e){Array.isArray(o)?o.forEach(t=>{"wireframe"in t&&(t.wireframe=e)}):"wireframe"in o&&(o.wireframe=e)}const u1=[{key:"skin_hex",label:"Epidermal Skin SSS"},{key:"hair_hex",label:"Strand Groom Albedo"},{key:"top_hex",label:"Camisole Rib-Knit"},{key:"denim_hex",label:"Stonewash Denim Twill"},{key:"belt_hex",label:"Pebbled Leather Belt"},{key:"metal_hex",label:"Brushed Metal Hardware"},{key:"shoes_hex",label:"Tumbled Leather Sneakers"}],d1=()=>{var _e,Ie,Ne,at,kt;const[o,e]=Ze.useState(null),[t,i]=Ze.useState([]),[s,a]=Ze.useState(null),[c,u]=Ze.useState("LOD0"),[h,f]=Ze.useState("vault"),[m,g]=Ze.useState("textures"),[_,y]=Ze.useState("all"),[M,E]=Ze.useState(null),[S,x]=Ze.useState("pbr"),[D,L]=Ze.useState("studio"),[b,V]=Ze.useState(!1),[k,F]=Ze.useState(!0),[X,C]=Ze.useState("three_quarter"),[R,H]=Ze.useState(0),[J,K]=Ze.useState("SK_UE5_CustomTextured"),[fe,ue]=Ze.useState("ue5_realistic_female"),[ce,de]=Ze.useState(2),[O,le]=Ze.useState(1024),[oe,U]=Ze.useState(16),[ne,Le]=Ze.useState(!0),[Q,he]=Ze.useState(1),[ge,pe]=Ze.useState(1),[Re,Pe]=Ze.useState(1),[Oe,Et]=Ze.useState({skin_hex:"#E3B8A3",hair_hex:"#1E1613",top_hex:"#16161B",denim_hex:"#5B82B0",belt_hex:"#1F1F25",metal_hex:"#DCE0E6",shoes_hex:"#F2F0EC"}),[st,Rt]=Ze.useState(null),[B,Yt]=Ze.useState(!0),[it,gt]=Ze.useState("CH_HighPoly_TexturedUpres"),[Ke,Dt]=Ze.useState(2),[We,P]=Ze.useState("skin_pores"),[w,te]=Ze.useState(.0016),[ve,ye]=Ze.useState("ue5_manny"),[me,Xe]=Ze.useState(null),[be,ke]=Ze.useState(!0),[ht,Ee]=Ze.useState(null),[Be,Ye]=Ze.useState(null);Ze.useEffect(()=>{let $=!0;return(async()=>{try{const[xe,Ut]=await Promise.all([nx(),da()]);if(!$)return;if(e(xe),i(Ut),Ut.length>0){const Wt=await pd(Ut[0].model_id);$&&(a(Wt),u("LOD0"))}else if(xe.bpy_available){Ee("Building High-Poly Textured 3D Showcase Collection (Subsurf L2 + 21 PBR Maps + UE5 Rig)…");const Wt=await ix(20),Ai=await da();$&&(i(Ai),a(Wt),Ee(null))}}catch(xe){$&&(Ye(xe instanceof Error?xe.message:"Failed to connect to 3DModel Pro API"),Ee(null))}})(),()=>{$=!1}},[]);const nt=$=>{ue($);const xe=o==null?void 0:o.archetypes.find(Ut=>Ut.id===$);xe&&(Et({...xe.swatches}),K(xe.name),he(xe.proportions.shoulder_scale),pe(xe.proportions.waist_scale),Pe(xe.proportions.hip_scale))},ze=async $=>{try{Ye(null);const xe=await pd($);a(xe),u("LOD0")}catch(xe){Ye(xe instanceof Error?xe.message:"Could not load high-poly asset")}},_t=async $=>{$.preventDefault(),Ye(null),Ee(`Forging High-Poly Textured '${J}' (Subsurf L${ce} · ${O}px PBR Textures · 23-Bone UE5 Rig)…`);try{const xe=new FormData;xe.append("title",J),xe.append("archetype",fe),xe.append("subsurf_level",String(ce)),xe.append("texture_resolution",String(O)),xe.append("cycles_samples",String(oe)),xe.append("generate_lods",String(ne)),xe.append("shoulder_scale",String(Q)),xe.append("waist_scale",String(ge)),xe.append("hip_scale",String(Re)),Object.entries(Oe).forEach(([Ai,Ri])=>xe.append(Ai,Ri)),st&&(xe.append("reference_file",st),xe.append("adapt_to_reference",String(B)));const Ut=await rx(xe),Wt=await da();i(Wt),a(Ut),u("LOD0"),g("textures")}catch(xe){Ye(xe instanceof Error?xe.message:"Character Forge failed")}finally{Ee(null)}},dt=async $=>{$.preventDefault(),Ye(null),Ee(`Subdividing & PBR Texturing '${it}' (Catmull-Clark L${Ke} + UV Albedo + ${We} Normal Map)…`);try{const xe=new FormData;xe.append("title",it),xe.append("subsurf_level",String(Ke)),xe.append("micro_detail",We),xe.append("detail_strength",String(w)),xe.append("rigging_backend",ve),xe.append("generate_lods","true"),me?(xe.append("file",me),xe.append("use_sample_sheet","false")):xe.append("use_sample_sheet",String(be));const Ut=await sx(xe),Wt=await da();i(Wt),a(Ut),u("LOD0"),g("textures")}catch(xe){Ye(xe instanceof Error?xe.message:"High-Poly Up-Res failed")}finally{Ee(null)}},Ct=async $=>{try{await ox($);const xe=await da();i(xe),(s==null?void 0:s.model_id)===$&&a(xe[0]?await pd(xe[0].model_id):null)}catch(xe){Ye(xe instanceof Error?xe.message:"Delete failed")}},j=Ze.useMemo(()=>{var xe;if(!s)return null;const $=(xe=s.lod_chain)==null?void 0:xe.find(Ut=>Ut.lod===c);return($==null?void 0:$.url)||s.primary_glb_url||null},[s,c]),Ce=Ze.useMemo(()=>{const $=(s==null?void 0:s.texture_maps)||[];return _==="all"?$:$.filter(xe=>xe.channel===_)},[s,_]),ae=$=>{C($),H(xe=>xe+1)};return N.jsxs("div",{className:"pro-app",children:[N.jsxs("header",{className:"pro-topbar",children:[N.jsxs("div",{className:"pro-brand",children:[N.jsx("div",{className:"pro-logo-mark",children:"3D"}),N.jsxs("div",{children:[N.jsxs("div",{className:"pro-brand-row",children:[N.jsx("span",{className:"pro-title",children:"3DModel Pro"}),N.jsx("span",{className:"pro-edition-badge",children:"HIGH-POLY TEXTURED 3D STUDIO"})]}),N.jsx("div",{className:"pro-subtitle",children:"High-Poly Subdivided 3D Models with Embedded 1K/2K PBR Textures (Albedo · Normal · ORM) & UE5 Rig"})]})]}),N.jsxs("div",{className:"pro-topbar-right",children:[N.jsxs("div",{className:"pro-status-chip",children:[N.jsx("span",{className:`pro-dot ${o!=null&&o.bpy_available?"ok":"warn"}`}),o!=null&&o.bpy_available?"Blender 4.5 PBR Baker Ready":"Mesh Subdivision Engine"]}),N.jsxs("div",{className:"pro-status-chip",children:[t.length," Textured High-Poly Models"]}),N.jsx("a",{href:"/api/pro/v1/docs",target:"_blank",rel:"noreferrer",className:"pro-ghost-btn",children:"Pro REST API"})]})]}),Be&&N.jsxs("div",{className:"pro-error-banner",children:[N.jsx("span",{children:Be}),N.jsx("button",{onClick:()=>Ye(null),children:"Dismiss"})]}),N.jsxs("main",{className:"pro-grid",children:[N.jsxs("aside",{className:"pro-panel pro-left",children:[N.jsxs("div",{className:"pro-tabs",children:[N.jsxs("button",{className:h==="vault"?"active":"",onClick:()=>f("vault"),children:["Textured Models (",t.length,")"]}),N.jsx("button",{className:h==="forge"?"active":"",onClick:()=>f("forge"),children:"Character Forge"}),N.jsx("button",{className:h==="upres"?"active":"",onClick:()=>f("upres"),children:"Up-Res & Texture"})]}),N.jsxs("div",{className:"pro-panel-scroll",children:[h==="vault"&&N.jsxs("div",{className:"pro-vault-list",children:[N.jsxs("div",{className:"pro-section-intro",children:["Click any ",N.jsx("strong",{children:"High-Poly Textured 3D Model"})," below to stream its UV-mapped PBR textures (BaseColor, Tangent Normal & ORM) into the real-time 3D viewport."]}),t.map($=>{var xe;return N.jsxs("div",{className:`pro-vault-card ${(s==null?void 0:s.model_id)===$.model_id?"selected":""}`,onClick:()=>ze($.model_id),children:[$.lookdev_url&&N.jsx("img",{src:$.lookdev_url,alt:$.title,className:"pro-vault-thumb"}),N.jsxs("div",{className:"pro-vault-meta",children:[N.jsxs("div",{className:"pro-vault-title-row",children:[N.jsx("span",{className:"pro-vault-title",children:$.title}),$.is_flagship&&N.jsx("span",{className:"pro-mini-tag",children:"SHOWCASE"})]}),N.jsxs("div",{className:"pro-vault-sub",children:[$.triangles.toLocaleString()," tris ·"," ",N.jsxs("strong",{children:[$.embedded_texture_count||((xe=$.texture_maps)==null?void 0:xe.length)||3," PBR maps"]})," ·"," ",$.bone_count," bones"]}),N.jsxs("div",{className:"pro-vault-actions",children:[N.jsx("span",{className:"pro-arch-pill",children:$.archetype_title}),!$.is_flagship&&N.jsx("button",{type:"button",className:"pro-del-btn",onClick:Ut=>{Ut.stopPropagation(),Ct($.model_id)},children:"Delete"})]})]})]},$.model_id)})]}),h==="forge"&&N.jsxs("form",{onSubmit:_t,className:"pro-form",children:[N.jsxs("div",{className:"pro-field",children:[N.jsx("label",{children:"Asset Name / UE5 Skeletal Prefix"}),N.jsx("input",{type:"text",value:J,onChange:$=>K($.target.value),required:!0})]}),N.jsxs("div",{className:"pro-field",children:[N.jsx("label",{children:"High-Poly Textured Character Archetype"}),N.jsx("div",{className:"pro-archetype-grid",children:((o==null?void 0:o.archetypes)||[]).map($=>N.jsxs("button",{type:"button",className:`pro-arch-card ${fe===$.id?"selected":""}`,onClick:()=>nt($.id),children:[N.jsxs("div",{className:"pro-arch-top",children:[N.jsx("span",{className:"pro-arch-name",children:$.title}),N.jsx("span",{className:"pro-arch-badge",children:$.badge})]}),N.jsx("p",{children:$.description})]},$.id))})]}),N.jsxs("div",{className:"pro-field-row",children:[N.jsxs("div",{className:"pro-field",children:[N.jsx("label",{children:"Subdivision Density"}),N.jsxs("select",{value:ce,onChange:$=>de(Number($.target.value)),children:[N.jsx("option",{value:1,children:"L1 · ~81K Tris"}),N.jsx("option",{value:2,children:"L2 · ~301K Tris (UE5)"}),N.jsx("option",{value:3,children:"L3 · ~1.12M Tris (Nanite)"})]})]}),N.jsxs("div",{className:"pro-field",children:[N.jsx("label",{children:"PBR Texture Resolution"}),N.jsxs("select",{value:O,onChange:$=>le(Number($.target.value)),children:[N.jsx("option",{value:512,children:"512px · Fast Preview"}),N.jsx("option",{value:1024,children:"1024px · 1K Studio PBR"}),N.jsx("option",{value:2048,children:"2048px · 2K Ultra PBR"})]})]})]}),N.jsxs("div",{className:"pro-field",children:[N.jsx("label",{children:"Cycles LookDev Sheet"}),N.jsxs("select",{value:oe,onChange:$=>U(Number($.target.value)),children:[N.jsx("option",{value:0,children:"Fast Mesh Turnaround"}),N.jsx("option",{value:16,children:"16 Samples (Cycles Raytraced)"}),N.jsx("option",{value:32,children:"32 Samples (Studio Master)"})]})]}),N.jsxs("div",{className:"pro-field",children:[N.jsx("label",{children:"Baked PBR Texture Palette (Albedo + Normal + ORM)"}),N.jsx("div",{className:"pro-swatch-grid",children:u1.map(({key:$,label:xe})=>N.jsxs("label",{className:"pro-swatch-item",children:[N.jsx("input",{type:"color",value:Oe[$]||"#ffffff",onChange:Ut=>Et(Wt=>({...Wt,[$]:Ut.target.value}))}),N.jsx("span",{children:xe})]},$))})]}),N.jsxs("div",{className:"pro-field",children:[N.jsx("label",{children:"Anatomical Proportion Morphs"}),N.jsxs("div",{className:"pro-slider-group",children:[N.jsxs("div",{children:[N.jsxs("span",{children:["Shoulder Width (",Q.toFixed(2),"×)"]}),N.jsx("input",{type:"range",min:.85,max:1.18,step:.01,value:Q,onChange:$=>he(Number($.target.value))})]}),N.jsxs("div",{children:[N.jsxs("span",{children:["Waist Taper (",ge.toFixed(2),"×)"]}),N.jsx("input",{type:"range",min:.85,max:1.18,step:.01,value:ge,onChange:$=>pe(Number($.target.value))})]}),N.jsxs("div",{children:[N.jsxs("span",{children:["Hip / Pelvis Scale (",Re.toFixed(2),"×)"]}),N.jsx("input",{type:"range",min:.88,max:1.18,step:.01,value:Re,onChange:$=>Pe(Number($.target.value))})]})]})]}),N.jsxs("div",{className:"pro-field",children:[N.jsx("label",{children:"Optional Front|Back Turnaround Reference"}),N.jsx("input",{type:"file",accept:"image/*",onChange:$=>{var xe;return Rt(((xe=$.target.files)==null?void 0:xe[0])||null)}}),st&&N.jsxs("label",{className:"pro-check",children:[N.jsx("input",{type:"checkbox",checked:B,onChange:$=>Yt($.target.checked)}),"Auto-adapt PBR garment colors & proportions from image"]})]}),N.jsxs("label",{className:"pro-check",children:[N.jsx("input",{type:"checkbox",checked:ne,onChange:$=>Le($.target.checked)}),"Export Textured Multi-LOD Chain (LOD0, LOD1, LOD2, LOD3)"]}),N.jsx("button",{type:"submit",className:"pro-primary-btn",disabled:!!ht,children:"Forge High-Poly Textured 3D Character"})]}),h==="upres"&&N.jsxs("form",{onSubmit:dt,className:"pro-form",children:[N.jsxs("div",{className:"pro-section-intro",children:["Convert any low-poly mesh (",N.jsx("code",{children:".glb"}),", ",N.jsx("code",{children:".obj"}),") or Dual-View character sheet into a Catmull-Clark subdivided High-Poly 3D model with baked UV Albedo, Tangent-Space Micro-Normal & ORM textures."]}),N.jsxs("div",{className:"pro-field",children:[N.jsx("label",{children:"Output Asset Title"}),N.jsx("input",{type:"text",value:it,onChange:$=>gt($.target.value),required:!0})]}),N.jsxs("div",{className:"pro-field",children:[N.jsx("label",{children:"Upload 3D Mesh (.glb/.obj/.ply) or Turnaround Image"}),N.jsx("input",{type:"file",accept:".glb,.gltf,.obj,.ply,.stl,image/*",onChange:$=>{var xe;return Xe(((xe=$.target.files)==null?void 0:xe[0])||null)}}),!me&&N.jsxs("label",{className:"pro-check",children:[N.jsx("input",{type:"checkbox",checked:be,onChange:$=>ke($.target.checked)}),"Use built-in Dual-View Character Sheet (sample_input.jpg)"]})]}),N.jsxs("div",{className:"pro-field-row",children:[N.jsxs("div",{className:"pro-field",children:[N.jsx("label",{children:"Catmull-Clark Level"}),N.jsxs("select",{value:Ke,onChange:$=>Dt(Number($.target.value)),children:[N.jsx("option",{value:1,children:"Level 1 (4× Polys)"}),N.jsx("option",{value:2,children:"Level 2 (16× Polys)"}),N.jsx("option",{value:3,children:"Level 3 (64× Nanite)"})]})]}),N.jsxs("div",{className:"pro-field",children:[N.jsx("label",{children:"Auto-Rigging"}),N.jsxs("select",{value:ve,onChange:$=>ye($.target.value),children:[N.jsx("option",{value:"ue5_manny",children:"UE5 Manny (23 Bones)"}),N.jsx("option",{value:"heuristic",children:"Humanoid (22 Bones)"}),N.jsx("option",{value:"none",children:"Static High-Poly Prop"})]})]})]}),N.jsxs("div",{className:"pro-field",children:[N.jsx("label",{children:"Micro-Surface Normal Map & Relief"}),N.jsx("select",{value:We,onChange:$=>P($.target.value),children:((o==null?void 0:o.micro_detail_profiles)||[]).map($=>N.jsx("option",{value:$.id,children:$.label},$.id))})]}),We!=="none"&&N.jsxs("div",{className:"pro-field",children:[N.jsxs("label",{children:["Displacement Amplitude (",(w*1e3).toFixed(2)," mm)"]}),N.jsx("input",{type:"range",min:4e-4,max:.005,step:2e-4,value:w,onChange:$=>te(Number($.target.value))})]}),N.jsx("button",{type:"submit",className:"pro-primary-btn",disabled:!!ht,children:"Build High-Poly Textured Asset + LOD0–LOD3"})]})]})]}),N.jsxs("section",{className:"pro-center",children:[t.length>0&&N.jsxs("div",{className:"pro-showcase-strip",children:[N.jsx("span",{className:"pro-strip-label",children:"HIGH-POLY TEXTURED MODELS:"}),N.jsx("div",{className:"pro-strip-chips",children:t.map($=>{var xe;return N.jsxs("button",{type:"button",className:`pro-strip-chip ${(s==null?void 0:s.model_id)===$.model_id?"active":""}`,onClick:()=>ze($.model_id),children:[$.lookdev_url&&N.jsx("img",{src:$.lookdev_url,alt:""}),N.jsxs("div",{children:[N.jsx("div",{className:"pro-strip-title",children:$.title.split("·")[0].trim()}),N.jsxs("div",{className:"pro-strip-meta",children:[Math.round($.triangles/1e3),"K tris ·"," ",$.embedded_texture_count||((xe=$.texture_maps)==null?void 0:xe.length)||3," maps"]})]})]},$.model_id)})})]}),N.jsxs("div",{className:"pro-viewport-toolbar",children:[N.jsxs("div",{className:"pro-tool-group",children:[N.jsx("span",{className:"pro-tool-label",children:"3D Texture View"}),[["pbr","Textured PBR"],["albedo","Albedo Map"],["texwire","Textured + Wire"],["normals","Normals"],["clay","Untextured Clay"]].map(([$,xe])=>N.jsx("button",{className:S===$?"active":"",onClick:()=>x($),children:xe},$))]}),N.jsxs("div",{className:"pro-tool-group",children:[N.jsx("span",{className:"pro-tool-label",children:"Rig & Lighting"}),N.jsx("button",{className:b?"active":"",onClick:()=>V($=>!$),children:"UE5 Bones"}),N.jsx("button",{className:k?"active":"",onClick:()=>F($=>!$),children:"Turntable"}),N.jsxs("select",{value:D,onChange:$=>L($.target.value),className:"pro-mini-select",children:[N.jsx("option",{value:"studio",children:"3-Point Neutral HDR"}),N.jsx("option",{value:"cyber",children:"Cyber Rim Studio"}),N.jsx("option",{value:"warm",children:"Golden Runway"}),N.jsx("option",{value:"dramatic",children:"Dramatic Key"})]})]}),N.jsxs("div",{className:"pro-tool-group",children:[N.jsx("span",{className:"pro-tool-label",children:"Camera"}),N.jsx("button",{onClick:()=>ae("three_quarter"),children:"3/4"}),N.jsx("button",{onClick:()=>ae("front"),children:"Front"}),N.jsx("button",{onClick:()=>ae("back"),children:"Back"}),N.jsx("button",{onClick:()=>ae("portrait"),children:"Close-Up"})]})]}),N.jsxs("div",{className:"pro-viewport-stage",children:[N.jsx(l1,{glbUrl:j,frontAxis:(s==null?void 0:s.front_axis)||"-Z",shading:S,lighting:D,showSkeleton:b,autoTurn:k,activeLod:c,cameraPreset:X,cameraTrigger:R}),ht&&N.jsxs("div",{className:"pro-busy-modal",children:[N.jsx("div",{className:"vp-spinner"}),N.jsx("div",{className:"pro-busy-title",children:"3DModel Pro PBR Baker & Subdivision Active"}),N.jsx("div",{className:"pro-busy-sub",children:ht})]})]}),s&&N.jsxs("div",{className:"pro-export-bar",children:[N.jsxs("div",{className:"pro-export-info",children:[N.jsx("strong",{children:s.title}),N.jsxs("span",{children:[s.triangles.toLocaleString()," tris ·"," ",s.embedded_texture_count||((_e=s.texture_maps)==null?void 0:_e.length)||3," PBR textures · ",s.height_m,"m · ",s.skeleton_standard]})]}),N.jsxs("div",{className:"pro-export-btns",children:[s.fbx_url&&N.jsx("a",{href:s.fbx_url,download:!0,className:"pro-dl-btn pro-dl-ue5",children:"UE5 .FBX (Embedded PBR)"}),s.primary_glb_url&&N.jsx("a",{href:s.primary_glb_url,download:!0,className:"pro-dl-btn",children:"Textured LOD0 .GLB"}),s.pack_zip_url&&N.jsx("a",{href:s.pack_zip_url,download:!0,className:"pro-dl-btn",children:"Full Pack + Textures (.ZIP)"})]})]})]}),N.jsxs("aside",{className:"pro-panel pro-right",children:[N.jsxs("div",{className:"pro-tabs",children:[N.jsxs("button",{className:m==="textures"?"active":"",onClick:()=>g("textures"),children:["PBR Maps (",((Ie=s==null?void 0:s.texture_maps)==null?void 0:Ie.length)||0,")"]}),N.jsx("button",{className:m==="lods"?"active":"",onClick:()=>g("lods"),children:"LODs"}),N.jsx("button",{className:m==="rig"?"active":"",onClick:()=>g("rig"),children:"UE5 Rig"}),N.jsx("button",{className:m==="renders"?"active":"",onClick:()=>g("renders"),children:"Renders"})]}),N.jsxs("div",{className:"pro-panel-scroll",children:[!s&&N.jsx("div",{className:"pro-empty",children:"Select or forge a High-Poly Textured 3D model."}),s&&m==="textures"&&N.jsxs("div",{className:"pro-inspector-stack",children:[N.jsxs("div",{className:"pro-kpi-grid",children:[N.jsxs("div",{className:"pro-kpi",children:[N.jsx("span",{children:"Embedded PBR Maps"}),N.jsxs("strong",{children:[s.embedded_texture_count||((Ne=s.texture_maps)==null?void 0:Ne.length)||3," Maps"]})]}),N.jsxs("div",{className:"pro-kpi",children:[N.jsx("span",{children:"LOD0 Triangles"}),N.jsx("strong",{children:s.triangles.toLocaleString()})]}),N.jsxs("div",{className:"pro-kpi",children:[N.jsx("span",{children:"Texture Resolution"}),N.jsxs("strong",{children:[s.texture_resolution||1024,"×",s.texture_resolution||1024]})]}),N.jsxs("div",{className:"pro-kpi",children:[N.jsx("span",{children:"UV Channels"}),N.jsx("strong",{children:"TEXCOORD_0 (100%)"})]})]}),N.jsx("div",{className:"pro-tex-filter-row",children:["all","albedo","normal","orm"].map($=>N.jsx("button",{type:"button",className:_===$?"active":"",onClick:()=>y($),children:$==="all"?"All Maps":$==="albedo"?"Albedo":$==="normal"?"Normal":"ORM"},$))}),N.jsx("div",{className:"pro-tex-grid",children:Ce.map($=>N.jsxs("div",{className:"pro-tex-card",onClick:()=>E($),children:[$.url&&N.jsx("img",{src:$.url,alt:$.label,loading:"lazy"}),N.jsxs("div",{className:"pro-tex-card-meta",children:[N.jsx("span",{className:`pro-ch-tag ch-${$.channel}`,children:$.channel.toUpperCase()}),N.jsx("div",{className:"pro-tex-card-title",children:$.label})]})]},$.filename))}),((at=s.materials)==null?void 0:at.length)>0&&N.jsxs("div",{className:"pro-mat-section",children:[N.jsxs("h4",{children:["UE5 Material Slots (",s.materials.length,")"]}),s.materials.map($=>N.jsxs("div",{className:"pro-mat-row",children:[N.jsx("span",{className:"pro-mat-dot",style:{background:$.hex}}),N.jsxs("div",{children:[N.jsx("div",{className:"pro-mat-name",children:$.slot}),N.jsx("div",{className:"pro-mat-type",children:$.type})]})]},$.slot))]})]}),s&&m==="lods"&&N.jsxs("div",{className:"pro-inspector-stack",children:[N.jsxs("div",{className:"pro-section-intro",children:["Click any ",N.jsx("strong",{children:"Textured LOD tier"})," below to stream that geometry tier into the live 3D viewport with full embedded PBR textures & skinning:"]}),N.jsx("div",{className:"pro-lod-section",children:(s.lod_chain||[]).map($=>N.jsxs("button",{type:"button",className:`pro-lod-card ${c===$.lod?"active":""}`,onClick:()=>u($.lod),children:[N.jsxs("div",{className:"pro-lod-row",children:[N.jsx("span",{className:"pro-lod-id",children:$.lod}),N.jsx("span",{className:"pro-lod-label",children:$.label}),N.jsxs("span",{className:"pro-lod-pct",children:[Math.round($.ratio*100),"%"]})]}),N.jsxs("div",{className:"pro-lod-sub",children:[$.triangles.toLocaleString()," tris · ",$.vertices.toLocaleString()," ","verts · ",$.size_mb," MB"]})]},$.lod))})]}),s&&m==="rig"&&N.jsxs("div",{className:"pro-rig-panel",children:[N.jsxs("div",{className:"pro-rig-summary",children:[N.jsx("strong",{children:s.armature_name}),N.jsxs("span",{children:[s.bone_count," Deforming Joints · ",s.skeleton_standard]})]}),N.jsx("button",{type:"button",className:"pro-secondary-btn",onClick:()=>V($=>!$),children:b?"Hide 3D Bone Overlay":"Show 3D Bone Overlay in Viewport"}),N.jsx("div",{className:"pro-bone-list",children:(((kt=s.skeleton)==null?void 0:kt.bones)||[]).map($=>N.jsxs("div",{className:"pro-bone-row",children:[N.jsx("span",{className:"pro-bone-idx",children:String($.index).padStart(2,"0")}),N.jsx("span",{className:"pro-bone-name",children:$.name}),N.jsxs("span",{className:"pro-bone-parent",children:["← ",$.parent||"ROOT"]})]},$.name))})]}),s&&m==="renders"&&N.jsxs("div",{className:"pro-renders-stack",children:[s.lookdev_url&&N.jsxs("div",{className:"pro-render-card",children:[N.jsx("h4",{children:"Cycles Raytraced Textured LookDev"}),N.jsx("img",{src:s.lookdev_url,alt:"Cycles LookDev"})]}),s.rig_preview_url&&N.jsxs("div",{className:"pro-render-card",children:[N.jsx("h4",{children:"23-Bone UE5 Skeleton Alignment"}),N.jsx("img",{src:s.rig_preview_url,alt:"Skeleton Alignment"})]})]})]})]})]}),M&&N.jsx("div",{className:"pro-lightbox",onClick:()=>E(null),children:N.jsxs("div",{className:"pro-lightbox-card",onClick:$=>$.stopPropagation(),children:[N.jsxs("div",{className:"pro-lightbox-head",children:[N.jsxs("div",{children:[N.jsx("strong",{children:M.label}),N.jsxs("span",{children:[M.channel_title," · ",M.filename]})]}),N.jsxs("div",{className:"pro-lightbox-actions",children:[M.url&&N.jsx("a",{href:M.url,download:!0,className:"pro-dl-btn",children:"Download PNG"}),N.jsx("button",{type:"button",className:"pro-ghost-btn",onClick:()=>E(null),children:"Close"})]})]}),M.url&&N.jsx("img",{src:M.url,alt:M.label})]})})]})};tx.createRoot(document.getElementById("root")).render(N.jsx(q0.StrictMode,{children:N.jsx(d1,{})}));
