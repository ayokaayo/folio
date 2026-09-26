/**
 * Scroll reveal: elements marked with `data-reveal` settle onto the lattice (fade in while rising one
 * 16px cell) the first time they enter the viewport, on first load, after client navigation, and when
 * content is added later. Elements entering together stagger by 80ms (capped at five steps).
 *
 * The logic is an inline script in <head>, not a React component, so nothing waits on the app bundle:
 * hidden content is revealed even if hydration is slow or fails. Content is hidden only when this
 * script runs on a screen that allows motion (see globals.css); no JS, print or reduced motion show
 * everything as is. Reveal state lives in `data-revealed`, an attribute React never touches. Keyboard
 * focus reveals its wrappers at once, and nodes removed by navigation stop being observed. If any
 * callback throws, the script unhides everything rather than leave content invisible.
 */

/** Spread onto an element to reveal it. The script may set `data-revealed` before hydration. */
export const REVEAL = { 'data-reveal': '', suppressHydrationWarning: true } as const

export const REVEAL_BOOT = `(function(){try{
var d=document.documentElement;
if(!('IntersectionObserver' in window)||!matchMedia('screen and (prefers-reduced-motion: no-preference)').matches)return;
d.setAttribute('data-reveal-on','');
var sel='[data-reveal]:not([data-revealed])',queue=[],frame=0,io;
function off(){d.removeAttribute('data-reveal-on');if(io)io.disconnect()}
function guard(f){return function(){try{return f.apply(this,arguments)}catch(e){off()}}}
function show(el){el.setAttribute('data-revealed','')}
var flush=guard(function(){frame=0;var batch=queue.splice(0);batch.sort(function(a,b){var p=a.getBoundingClientRect(),q=b.getBoundingClientRect();return p.top-q.top||p.left-q.left});
batch.forEach(function(el,k){k?setTimeout(function(){show(el)},Math.min(k,5)*80):show(el)})});
io=new IntersectionObserver(guard(function(es){es.forEach(function(e){if(e.isIntersecting){io.unobserve(e.target);queue.push(e.target)}});if(queue.length&&!frame)frame=requestAnimationFrame(flush)}),{rootMargin:'0px 0px -64px 0px'});
function scan(root){if(root.matches&&root.matches(sel))watch(root);if(root.querySelectorAll)root.querySelectorAll(sel).forEach(watch)}
function watch(el){if(!el.__reveal){el.__reveal=1;io.observe(el)}}
function drop(el){if(el.__reveal&&!el.isConnected){io.unobserve(el);el.__reveal=0}}
function forget(root){if(root.matches&&root.matches(sel))drop(root);if(root.querySelectorAll)root.querySelectorAll(sel).forEach(drop)}
new MutationObserver(guard(function(ms){ms.forEach(function(m){m.removedNodes.forEach(function(n){if(n.nodeType===1)forget(n)});m.addedNodes.forEach(function(n){if(n.nodeType===1)scan(n)})});if(document.readyState!=='loading')edge()})).observe(d,{childList:true,subtree:true});
document.addEventListener('focusin',guard(function(e){var el=e.target.closest&&e.target.closest('[data-reveal]');while(el){io.unobserve(el);show(el);el=el.parentElement&&el.parentElement.closest('[data-reveal]')}}));
function edge(){if(d.scrollHeight&&scrollY+innerHeight>=d.scrollHeight-2)document.querySelectorAll(sel).forEach(function(el){io.unobserve(el);show(el)})}
edge=guard(edge);addEventListener('scroll',edge,{passive:true});addEventListener('resize',edge);addEventListener('load',edge);
document.addEventListener('DOMContentLoaded',guard(function(){scan(document)}));
}catch(e){document.documentElement.removeAttribute('data-reveal-on')}})()`
