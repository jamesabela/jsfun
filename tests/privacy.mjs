import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
const source = fs.readFileSync('privacy.js', 'utf8');
function harness({ choice, blocked = false, dnt = false, gpc = false, enabled = true, hostname = 'jamesabela.github.io' } = {}) {
  const requests = [], listeners = {}, buttons = ['allow','deny'].map(value => ({dataset:{analyticsChoice:value},setAttribute(){},addEventListener(_,fn){this.click=fn;}}));
  const output = {textContent: ''};
  const store = new Map(choice ? [['jsfun.analytics.v1',choice]] : []);
  const context = { URL, encodeURIComponent, navigator:{doNotTrack:dnt?'1':'0',globalPrivacyControl:gpc}, location:{hostname,search:'?code=SECRET&name=Student',hash:'#private'},
    localStorage:{getItem(k){if(blocked)throw Error();return store.get(k);},setItem(k,v){if(blocked)throw Error();store.set(k,v);}},
    document:{currentScript:{dataset:{page:'/pythoncopy.html'}},title:'SECRET student work',referrer:'https://example.org/?name=Student',getElementById(){return output;},querySelectorAll(s){return s==='[data-analytics-choice]'?buttons:[];},createElement(){return {remove(){}};},body:{appendChild(el){requests.push(el);}}},window:{addEventListener(k,fn){listeners[k]=fn;}}};
  context.window.top=context.window.self=context.window;
  vm.runInNewContext(enabled?source:source.replace('ANALYTICS_ENABLED = true','ANALYTICS_ENABLED = false'),context);
  return {requests,buttons,store,listeners,output};
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
assert.match(harness().output.textContent, /No choice saved yet/);
assert.match(h.output.textContent, /This choice is saved/);
const preview = harness({hostname:'172.20.1.53'});
preview.buttons[0].click();
assert.equal(preview.requests.length, 0);
assert.match(preview.output.textContent, /Preview mode/);
const unavailable = harness({blocked:true});
unavailable.buttons[0].click();
assert.match(unavailable.output.textContent, /could not save/);
other.store.clear();other.listeners.storage({key:null});
assert.match(other.output.textContent, /No choice saved yet/);
const files=[...new Set(execFileSync('git',['ls-files','--cached','--others','--exclude-standard','*.html'],{encoding:'utf8'}).trim().split('\n'))];
for(const file of files){const html=fs.readFileSync(file,'utf8');if(file!=='privacy.html')assert.match(html,/href="(?:\.\.\/)*privacy.html"/,file);assert.match(html,/<meta name="referrer" content="no-referrer">/,file);assert.doesNotMatch(html,/src=["'](?:https?:)?\/\/gc.zgo.at/,file);const m=html.match(/<script src="([^"]*privacy.js)"/);assert.ok(m,file);assert.ok(html.includes(`data-page="/${file}"`), `${file}: fixed page identifier must match its repository path`);assert.ok(fs.existsSync(new URL(m[1],new URL(file,`file://${process.cwd()}/`))),file);assert.doesNotMatch(html,/<iframe\b[^>]*\ssrc=["']https?:\/\//,file);}
console.log(`PASS: ${files.length} page links, scripts, referrer policies and embed gates; default deny, opt-in/out, privacy signals, central switch, storage failure and content-free analytics.`);
