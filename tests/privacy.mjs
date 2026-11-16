import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
const source = fs.readFileSync('privacy.js', 'utf8');
function harness({ choice, blocked = false, dnt = false, gpc = false, enabled = true } = {}) {
  const requests = [], listeners = {}, buttons = ['allow','deny'].map(value => ({dataset:{analyticsChoice:value},setAttribute(){},addEventListener(_,fn){this.click=fn;}}));
  const store = new Map(choice ? [['jsfun.analytics.v1',choice]] : []);
  const context = { URL, encodeURIComponent, navigator:{doNotTrack:dnt?'1':'0',globalPrivacyControl:gpc}, location:{hostname:'jamesabela.github.io',search:'?code=SECRET&name=Student',hash:'#private'},
    localStorage:{getItem(k){if(blocked)throw Error();return store.get(k);},setItem(k,v){if(blocked)throw Error();store.set(k,v);}},
    document:{currentScript:{dataset:{page:'/pythoncopy.html'}},title:'SECRET student work',referrer:'https://example.org/?name=Student',getElementById(){return {textContent:''};},querySelectorAll(s){return s==='[data-analytics-choice]'?buttons:[];},createElement(){return {remove(){}};},body:{appendChild(el){requests.push(el);}}},window:{addEventListener(k,fn){listeners[k]=fn;}}};
  context.window.top=context.window.self=context.window;
  vm.runInNewContext(enabled?source:source.replace('ANALYTICS_ENABLED = true','ANALYTICS_ENABLED = false'),context);
  return {requests,buttons,store,listeners};
}
assert.equal(harness().requests.length,0);
assert.equal(harness({blocked:true}).requests.length,0);
for(const options of [{dnt:true},{gpc:true},{enabled:false}]) assert.equal(harness({choice:'allow',...options}).requests.length,0);
const h=harness();h.buttons[0].click();assert.equal(h.requests.length,1);
const request=h.requests[0];assert.equal(request.referrerPolicy,'no-referrer');
assert.equal(request.src,'https://jabela.goatcounter.com/count?p=%2Fpythoncopy.html&ns=true');
assert.equal(h.store.get('jsfun.analytics.v1'),'allow');h.buttons[1].click();assert.equal(h.store.get('jsfun.analytics.v1'),'deny');
assert.equal(h.requests.length,1);assert.equal(harness({choice:'deny'}).requests.length,0);assert.equal(harness({choice:'allow'}).requests.length,1);
const other=harness();other.store.set('jsfun.analytics.v1','allow');other.listeners.storage({key:'jsfun.analytics.v1'});assert.equal(other.requests.length,0);
const files=execFileSync('git',['ls-files','*.html'],{encoding:'utf8'}).trim().split('\n');
for(const file of files){const html=fs.readFileSync(file,'utf8');assert.match(html,/href="(?:\.\.\/)*privacy.html"/,file);assert.match(html,/<meta name="referrer" content="no-referrer">/,file);assert.doesNotMatch(html,/src=["'](?:https?:)?\/\/gc.zgo.at/,file);const m=html.match(/<script src="([^"]*privacy.js)"/);assert.ok(m,file);assert.ok(fs.existsSync(new URL(m[1],new URL(file,`file://${process.cwd()}/`))),file);assert.doesNotMatch(html,/<iframe\b[^>]*\ssrc=["']https?:\/\//,file);}
console.log(`PASS: ${files.length} page links, scripts, referrer policies and embed gates; default deny, opt-in/out, privacy signals, central switch, storage failure and content-free analytics.`);
