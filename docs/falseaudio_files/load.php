function isCompatible(ua){return!!((function(){'use strict';return!this&&Function.prototype.bind&&window.JSON;}())&&'querySelector'in document&&'localStorage'in window&&'addEventListener'in window&&!ua.match(/MSIE 10|NetFront|Opera Mini|S40OviBrowser|MeeGo|Android.+Glass|^Mozilla\/5\.0 .+ Gecko\/$|googleweblight|PLAYSTATION|PlayStation/));}if(!isCompatible(navigator.userAgent)){document.documentElement.className=document.documentElement.className.replace(/(^|\s)client-js(\s|$)/,'$1client-nojs$2');while(window.NORLQ&&NORLQ[0]){NORLQ.shift()();}NORLQ={push:function(fn){fn();}};RLQ={push:function(){}};}else{if(window.performance&&performance.mark){performance.mark('mwStartup');}(function(){'use strict';var mw,StringSet,log,isES6Supported,hasOwn=Object.hasOwnProperty,console=window.console;function fnv132(str){var hash=0x811C9DC5,i=0;for(;i<str.length;i++){hash+=(hash<<1)+(hash<<4)+(hash<<7)+(hash<<8)+(hash<<24);hash^=str.charCodeAt(i);}hash=(hash>>>0).toString(36).slice(0,5);while(hash.
length<5){hash='0'+hash;}return hash;}function defineFallbacks(){StringSet=window.Set||function(){var set=Object.create(null);return{add:function(value){set[value]=!0;},has:function(value){return value in set;}};};}function setGlobalMapValue(map,key,value){map.values[key]=value;log.deprecate(window,key,value,map===mw.config&&'Use mw.config instead.');}function logError(topic,data){var msg,e=data.exception;if(console&&console.log){msg=(e?'Exception':'Error')+' in '+data.source+(data.module?' in module '+data.module:'')+(e?':':'.');console.log(msg);if(e&&console.warn){console.warn(e);}}}function Map(global){this.values=Object.create(null);if(global===!0){this.set=function(selection,value){var s;if(arguments.length>1){if(typeof selection==='string'){setGlobalMapValue(this,selection,value);return!0;}}else if(typeof selection==='object'){for(s in selection){setGlobalMapValue(this,s,selection[s]);}return!0;}return!1;};}}Map.prototype={constructor:Map,get:function(selection,
fallback){var results,i;fallback=arguments.length>1?fallback:null;if(Array.isArray(selection)){results={};for(i=0;i<selection.length;i++){if(typeof selection[i]==='string'){results[selection[i]]=selection[i]in this.values?this.values[selection[i]]:fallback;}}return results;}if(typeof selection==='string'){return selection in this.values?this.values[selection]:fallback;}if(selection===undefined){results={};for(i in this.values){results[i]=this.values[i];}return results;}return fallback;},set:function(selection,value){var s;if(arguments.length>1){if(typeof selection==='string'){this.values[selection]=value;return!0;}}else if(typeof selection==='object'){for(s in selection){this.values[s]=selection[s];}return!0;}return!1;},exists:function(selection){return typeof selection==='string'&&selection in this.values;}};defineFallbacks();log=function(){};log.warn=console&&console.warn?Function.prototype.bind.call(console.warn,console):function(){};log.error=console&&console.error?Function.
prototype.bind.call(console.error,console):function(){};log.deprecate=function(obj,key,val,msg,logName){var stacks;function maybeLog(){var name=logName||key,trace=new Error().stack;if(!stacks){stacks=new StringSet();}if(!stacks.has(trace)){stacks.add(trace);if(logName||obj===window){mw.track('mw.deprecate',name);}mw.log.warn('Use of "'+name+'" is deprecated.'+(msg?' '+msg:''));}}try{Object.defineProperty(obj,key,{configurable:!0,enumerable:!0,get:function(){maybeLog();return val;},set:function(newVal){maybeLog();val=newVal;}});}catch(err){obj[key]=val;}};isES6Supported=typeof Promise==='function'&&Promise.prototype.finally&&/./g.flags==='g'&&(function(){try{new Function('var \ud800\udec0;');return!0;}catch(e){return!1;}}());mw={redefineFallbacksForTest:window.QUnit&&defineFallbacks,now:function(){var perf=window.performance,navStart=perf&&perf.timing&&perf.timing.navigationStart;mw.now=navStart&&perf.now?function(){return navStart+perf.now();}:Date.now;return mw.now();},
trackQueue:[],track:function(topic,data){mw.trackQueue.push({topic:topic,data:data});},trackError:function(topic,data){mw.track(topic,data);logError(topic,data);},Map:Map,config:new Map(!1),messages:new Map(),templates:new Map(),log:log,loader:(function(){var registry=Object.create(null),sources=Object.create(null),handlingPendingRequests=!1,pendingRequests=[],queue=[],jobs=[],willPropagate=!1,errorModules=[],baseModules=["jquery","mediawiki.base"],marker=document.querySelector('meta[name="ResourceLoaderDynamicStyles"]'),lastCssBuffer,rAF=window.requestAnimationFrame||setTimeout;function newStyleTag(text,nextNode){var el=document.createElement('style');el.appendChild(document.createTextNode(text));if(nextNode&&nextNode.parentNode){nextNode.parentNode.insertBefore(el,nextNode);}else{document.head.appendChild(el);}return el;}function flushCssBuffer(cssBuffer){var i;if(cssBuffer===lastCssBuffer){lastCssBuffer=null;}newStyleTag(cssBuffer.cssText,marker);for(i=0;i<cssBuffer.
callbacks.length;i++){cssBuffer.callbacks[i]();}}function addEmbeddedCSS(cssText,callback){if(!lastCssBuffer||cssText.slice(0,'@import'.length)==='@import'){lastCssBuffer={cssText:'',callbacks:[]};rAF(flushCssBuffer.bind(null,lastCssBuffer));}lastCssBuffer.cssText+='\n'+cssText;lastCssBuffer.callbacks.push(callback);}function getCombinedVersion(modules){var hashes=modules.reduce(function(result,module){return result+registry[module].version;},'');return fnv132(hashes);}function allReady(modules){var i=0;for(;i<modules.length;i++){if(mw.loader.getState(modules[i])!=='ready'){return!1;}}return!0;}function allWithImplicitReady(module){return allReady(registry[module].dependencies)&&(baseModules.indexOf(module)!==-1||allReady(baseModules));}function anyFailed(modules){var state,i=0;for(;i<modules.length;i++){state=mw.loader.getState(modules[i]);if(state==='error'||state==='missing'){return modules[i];}}return!1;}function doPropagation(){var errorModule,baseModuleError,module,i,
failed,job,didPropagate=!0;do{didPropagate=!1;while(errorModules.length){errorModule=errorModules.shift();baseModuleError=baseModules.indexOf(errorModule)!==-1;for(module in registry){if(registry[module].state!=='error'&&registry[module].state!=='missing'){if(baseModuleError&&baseModules.indexOf(module)===-1){registry[module].state='error';didPropagate=!0;}else if(registry[module].dependencies.indexOf(errorModule)!==-1){registry[module].state='error';errorModules.push(module);didPropagate=!0;}}}}for(module in registry){if(registry[module].state==='loaded'&&allWithImplicitReady(module)){execute(module);didPropagate=!0;}}for(i=0;i<jobs.length;i++){job=jobs[i];failed=anyFailed(job.dependencies);if(failed!==!1||allReady(job.dependencies)){jobs.splice(i,1);i-=1;try{if(failed!==!1&&job.error){job.error(new Error('Failed dependency: '+failed),job.dependencies);}else if(failed===!1&&job.ready){job.ready();}}catch(e){mw.trackError('resourceloader.exception',{exception:e,
source:'load-callback'});}didPropagate=!0;}}}while(didPropagate);willPropagate=!1;}function requestPropagation(){if(willPropagate){return;}willPropagate=!0;mw.requestIdleCallback(doPropagation,{timeout:1});}function setAndPropagate(module,state){registry[module].state=state;if(state==='loaded'||state==='ready'||state==='error'||state==='missing'){if(state==='ready'){mw.loader.store.add(module);}else if(state==='error'||state==='missing'){errorModules.push(module);}requestPropagation();}}function sortDependencies(module,resolved,unresolved){var e,i,skip,deps;if(!(module in registry)){e=new Error('Unknown module: '+module);e.name='DependencyError';throw e;}if(!isES6Supported&&registry[module].requiresES6){e=new Error('Module requires ES6 but ES6 is not supported: '+module);e.name='ES6Error';throw e;}if(typeof registry[module].skip==='string'){skip=(new Function(registry[module].skip)());registry[module].skip=!!skip;if(skip){registry[module].dependencies=[];setAndPropagate(module,
'ready');return;}}if(!unresolved){unresolved=new StringSet();}deps=registry[module].dependencies;unresolved.add(module);for(i=0;i<deps.length;i++){if(resolved.indexOf(deps[i])===-1){if(unresolved.has(deps[i])){e=new Error('Circular reference detected: '+module+' -> '+deps[i]);e.name='DependencyError';throw e;}sortDependencies(deps[i],resolved,unresolved);}}resolved.push(module);}function resolve(modules){var resolved=baseModules.slice(),i=0;for(;i<modules.length;i++){sortDependencies(modules[i],resolved);}return resolved;}function resolveStubbornly(modules){var saved,resolved=baseModules.slice(),i=0;for(;i<modules.length;i++){saved=resolved.slice();try{sortDependencies(modules[i],resolved);}catch(err){resolved=saved;if(err.name==='ES6Error'){mw.log.warn('Skipped ES6-only module '+modules[i]);}else{mw.log.warn('Skipped unresolvable module '+modules[i]);if(modules[i]in registry){mw.trackError('resourceloader.exception',{exception:err,source:'resolve'});}}}}return resolved;}function
resolveRelativePath(relativePath,basePath){var prefixes,prefix,baseDirParts,relParts=relativePath.match(/^((?:\.\.?\/)+)(.*)$/);if(!relParts){return null;}baseDirParts=basePath.split('/');baseDirParts.pop();prefixes=relParts[1].split('/');prefixes.pop();while((prefix=prefixes.pop())!==undefined){if(prefix==='..'){baseDirParts.pop();}}return(baseDirParts.length?baseDirParts.join('/')+'/':'')+relParts[2];}function makeRequireFunction(moduleObj,basePath){return function require(moduleName){var fileName,fileContent,result,moduleParam,scriptFiles=moduleObj.script.files;fileName=resolveRelativePath(moduleName,basePath);if(fileName===null){return mw.loader.require(moduleName);}if(!hasOwn.call(scriptFiles,fileName)){throw new Error('Cannot require undefined file '+fileName);}if(hasOwn.call(moduleObj.packageExports,fileName)){return moduleObj.packageExports[fileName];}fileContent=scriptFiles[fileName];if(typeof fileContent==='function'){moduleParam={exports:{}};fileContent(makeRequireFunction(
moduleObj,fileName),moduleParam);result=moduleParam.exports;}else{result=fileContent;}moduleObj.packageExports[fileName]=result;return result;};}function addScript(src,callback){var script=document.createElement('script');script.src=src;script.onload=script.onerror=function(){if(script.parentNode){script.parentNode.removeChild(script);}if(callback){callback();callback=null;}};document.head.appendChild(script);}function queueModuleScript(src,moduleName,callback){pendingRequests.push(function(){if(moduleName!=='jquery'){window.require=mw.loader.require;window.module=registry[moduleName].module;}addScript(src,function(){delete window.module;callback();if(pendingRequests[0]){pendingRequests.shift()();}else{handlingPendingRequests=!1;}});});if(!handlingPendingRequests&&pendingRequests[0]){handlingPendingRequests=!0;pendingRequests.shift()();}}function addLink(url,media,nextNode){var el=document.createElement('link');el.rel='stylesheet';if(media){el.media=media;}el.href=url;if(nextNode
&&nextNode.parentNode){nextNode.parentNode.insertBefore(el,nextNode);}else{document.head.appendChild(el);}}function domEval(code){var script=document.createElement('script');if(mw.config.get('wgCSPNonce')!==!1){script.nonce=mw.config.get('wgCSPNonce');}script.text=code;document.head.appendChild(script);script.parentNode.removeChild(script);}function enqueue(dependencies,ready,error){var failed;if(allReady(dependencies)){if(ready!==undefined){ready();}return;}failed=anyFailed(dependencies);if(failed!==!1){if(error!==undefined){error(new Error('Dependency '+failed+' failed to load'),dependencies);}return;}if(ready!==undefined||error!==undefined){jobs.push({dependencies:dependencies.filter(function(module){var state=registry[module].state;return state==='registered'||state==='loaded'||state==='loading'||state==='executing';}),ready:ready,error:error});}dependencies.forEach(function(module){if(registry[module].state==='registered'&&queue.indexOf(module)===-1){queue.push(module);}});
mw.loader.work();}function execute(module){var key,value,media,i,urls,cssHandle,siteDeps,siteDepErr,runScript,cssPending=0;if(registry[module].state!=='loaded'){throw new Error('Module in state "'+registry[module].state+'" may not execute: '+module);}registry[module].state='executing';runScript=function(){var script,markModuleReady,nestedAddScript,mainScript;script=registry[module].script;markModuleReady=function(){setAndPropagate(module,'ready');};nestedAddScript=function(arr,callback,j){if(j>=arr.length){callback();return;}queueModuleScript(arr[j],module,function(){nestedAddScript(arr,callback,j+1);});};try{if(Array.isArray(script)){nestedAddScript(script,markModuleReady,0);}else if(typeof script==='function'||(typeof script==='object'&&script!==null)){if(typeof script==='function'){if(module==='jquery'){script();}else{script(window.$,window.$,mw.loader.require,registry[module].module);}}else{mainScript=script.files[script.main];if(typeof mainScript!=='function'){throw new Error(
'Main file in module '+module+' must be a function');}mainScript(makeRequireFunction(registry[module],script.main),registry[module].module);}markModuleReady();}else if(typeof script==='string'){domEval(script);markModuleReady();}else{markModuleReady();}}catch(e){setAndPropagate(module,'error');mw.trackError('resourceloader.exception',{exception:e,module:module,source:'module-execute'});}};if(registry[module].messages){mw.messages.set(registry[module].messages);}if(registry[module].templates){mw.templates.set(module,registry[module].templates);}cssHandle=function(){cssPending++;return function(){var runScriptCopy;cssPending--;if(cssPending===0){runScriptCopy=runScript;runScript=undefined;runScriptCopy();}};};if(registry[module].style){for(key in registry[module].style){value=registry[module].style[key];media=undefined;if(key!=='url'&&key!=='css'){if(typeof value==='string'){addEmbeddedCSS(value,cssHandle());}else{media=key;key='bc-url';}}if(Array.isArray(value)){for(i=0;i<value.length;i++
){if(key==='bc-url'){addLink(value[i],media,marker);}else if(key==='css'){addEmbeddedCSS(value[i],cssHandle());}}}else if(typeof value==='object'){for(media in value){urls=value[media];for(i=0;i<urls.length;i++){addLink(urls[i],media,marker);}}}}}if(module==='user'){try{siteDeps=resolve(['site']);}catch(e){siteDepErr=e;runScript();}if(siteDepErr===undefined){enqueue(siteDeps,runScript,runScript);}}else if(cssPending===0){runScript();}}function sortQuery(o){var key,sorted={},a=[];for(key in o){a.push(key);}a.sort();for(key=0;key<a.length;key++){sorted[a[key]]=o[a[key]];}return sorted;}function buildModulesString(moduleMap){var p,prefix,str=[],list=[];function restore(suffix){return p+suffix;}for(prefix in moduleMap){p=prefix===''?'':prefix+'.';str.push(p+moduleMap[prefix].join(','));list.push.apply(list,moduleMap[prefix].map(restore));}return{str:str.join('|'),list:list};}function resolveIndexedDependencies(modules){var i,j,deps;function resolveIndex(dep){return typeof dep==='number'?
modules[dep][0]:dep;}for(i=0;i<modules.length;i++){deps=modules[i][2];if(deps){for(j=0;j<deps.length;j++){deps[j]=resolveIndex(deps[j]);}}}}function makeQueryString(params){return Object.keys(params).map(function(key){return encodeURIComponent(key)+'='+encodeURIComponent(params[key]);}).join('&');}function batchRequest(batch){var reqBase,splits,b,bSource,bGroup,source,group,i,modules,sourceLoadScript,currReqBase,currReqBaseLength,moduleMap,currReqModules,l,lastDotIndex,prefix,suffix,bytesAdded;function doRequest(){var query=Object.create(currReqBase),packed=buildModulesString(moduleMap);query.modules=packed.str;query.version=getCombinedVersion(packed.list);query=sortQuery(query);addScript(sourceLoadScript+'?'+makeQueryString(query));}if(!batch.length){return;}batch.sort();reqBase={"lang":"en","skin":"vector"};splits=Object.create(null);for(b=0;b<batch.length;b++){bSource=registry[batch[b]].source;bGroup=registry[batch[b]].group;if(!splits[bSource]){splits[bSource]=Object.create(null);}
if(!splits[bSource][bGroup]){splits[bSource][bGroup]=[];}splits[bSource][bGroup].push(batch[b]);}for(source in splits){sourceLoadScript=sources[source];for(group in splits[source]){modules=splits[source][group];currReqBase=Object.create(reqBase);if(group===0&&mw.config.get('wgUserName')!==null){currReqBase.user=mw.config.get('wgUserName');}currReqBaseLength=makeQueryString(currReqBase).length+23;l=currReqBaseLength;moduleMap=Object.create(null);currReqModules=[];for(i=0;i<modules.length;i++){lastDotIndex=modules[i].lastIndexOf('.');prefix=modules[i].substr(0,lastDotIndex);suffix=modules[i].slice(lastDotIndex+1);bytesAdded=moduleMap[prefix]?suffix.length+3:modules[i].length+3;if(currReqModules.length&&l+bytesAdded>mw.loader.maxQueryLength){doRequest();l=currReqBaseLength;moduleMap=Object.create(null);currReqModules=[];mw.track('resourceloader.splitRequest',{maxQueryLength:mw.loader.maxQueryLength});}if(!moduleMap[prefix]){moduleMap[prefix]=[];}l+=bytesAdded;moduleMap[prefix].push(suffix
);currReqModules.push(modules[i]);}if(currReqModules.length){doRequest();}}}}function asyncEval(implementations,cb){if(!implementations.length){return;}mw.requestIdleCallback(function(){try{domEval(implementations.join(';'));}catch(err){cb(err);}});}function getModuleKey(module){return module in registry?(module+'@'+registry[module].version):null;}function splitModuleKey(key){var index=key.indexOf('@');if(index===-1){return{name:key,version:''};}return{name:key.slice(0,index),version:key.slice(index+1)};}function registerOne(module,version,dependencies,group,source,skip){var requiresES6=!1;if(module in registry){throw new Error('module already registered: '+module);}version=String(version||'');if(version.slice(-1)==='!'){version=version.slice(0,-1);requiresES6=!0;}registry[module]={module:{exports:{}},packageExports:{},version:version,requiresES6:requiresES6,dependencies:dependencies||[],group:typeof group==='undefined'?null:group,source:typeof source==='string'?source:'local',
state:'registered',skip:typeof skip==='string'?skip:null};}return{moduleRegistry:registry,maxQueryLength:2000,addStyleTag:newStyleTag,enqueue:enqueue,resolve:resolve,work:function(){var q,module,implementation,storedImplementations=[],storedNames=[],requestNames=[],batch=new StringSet();mw.loader.store.init();q=queue.length;while(q--){module=queue[q];if(module in registry&&registry[module].state==='registered'){if(!batch.has(module)){registry[module].state='loading';batch.add(module);implementation=mw.loader.store.get(module);if(implementation){storedImplementations.push(implementation);storedNames.push(module);}else{requestNames.push(module);}}}}queue=[];asyncEval(storedImplementations,function(err){var failed;mw.loader.store.stats.failed++;mw.loader.store.clear();mw.trackError('resourceloader.exception',{exception:err,source:'store-eval'});failed=storedNames.filter(function(name){return registry[name].state==='loading';});batchRequest(failed);});batchRequest(requestNames);},addSource
:function(ids){var id;for(id in ids){if(id in sources){throw new Error('source already registered: '+id);}sources[id]=ids[id];}},register:function(modules){var i;if(typeof modules==='object'){resolveIndexedDependencies(modules);for(i=0;i<modules.length;i++){registerOne.apply(null,modules[i]);}}else{registerOne.apply(null,arguments);}},implement:function(module,script,style,messages,templates){var split=splitModuleKey(module),name=split.name,version=split.version;if(!(name in registry)){mw.loader.register(name);}if(registry[name].script!==undefined){throw new Error('module already implemented: '+name);}if(version){registry[name].version=version;}registry[name].script=script||null;registry[name].style=style||null;registry[name].messages=messages||null;registry[name].templates=templates||null;if(registry[name].state!=='error'&&registry[name].state!=='missing'){setAndPropagate(name,'loaded');}},load:function(modules,type){if(typeof modules==='string'&&/^(https?:)?\/?\//.test(modules)){if(
type==='text/css'){addLink(modules);}else if(type==='text/javascript'||type===undefined){addScript(modules);}else{throw new Error('Invalid type '+type);}}else{modules=typeof modules==='string'?[modules]:modules;enqueue(resolveStubbornly(modules),undefined,undefined);}},state:function(states){var module,state;for(module in states){state=states[module];if(!(module in registry)){mw.loader.register(module);}setAndPropagate(module,state);}},getState:function(module){return module in registry?registry[module].state:null;},getModuleNames:function(){return Object.keys(registry);},require:function(moduleName){var state=mw.loader.getState(moduleName);if(state!=='ready'){throw new Error('Module "'+moduleName+'" is not loaded');}return registry[moduleName].module.exports;},store:{enabled:null,MODULE_SIZE_MAX:1e5,items:{},queue:[],stats:{hits:0,misses:0,expired:0,failed:0},toJSON:function(){return{items:mw.loader.store.items,vary:mw.loader.store.vary,asOf:Math.ceil(Date.now()/1e7)};},key:
"MediaWikiModuleStore:archwiki",vary:"vector:1:en",init:function(){var raw,data;if(this.enabled!==null){return;}if(!!0||/Firefox/.test(navigator.userAgent)){this.clear();this.enabled=!1;return;}try{raw=localStorage.getItem(this.key);this.enabled=!0;data=JSON.parse(raw);if(data&&typeof data.items==='object'&&data.vary===this.vary&&Date.now()<(data.asOf*1e7)+259e7){this.items=data.items;return;}}catch(e){}if(raw===undefined){this.enabled=!1;}},get:function(module){var key;if(this.enabled){key=getModuleKey(module);if(key in this.items){this.stats.hits++;return this.items[key];}this.stats.misses++;}return!1;},add:function(module){if(this.enabled){this.queue.push(module);this.requestUpdate();}},set:function(module){var key,args,src,encodedScript,descriptor=mw.loader.moduleRegistry[module];key=getModuleKey(module);if(key in this.items||!descriptor||descriptor.state!=='ready'||!descriptor.version||descriptor.group===1||descriptor.group===0||[descriptor.script,descriptor.style,
descriptor.messages,descriptor.templates].indexOf(undefined)!==-1){return;}try{if(typeof descriptor.script==='function'){encodedScript=String(descriptor.script);}else if(typeof descriptor.script==='object'&&descriptor.script&&!Array.isArray(descriptor.script)){encodedScript='{'+'main:'+JSON.stringify(descriptor.script.main)+','+'files:{'+Object.keys(descriptor.script.files).map(function(file){var value=descriptor.script.files[file];return JSON.stringify(file)+':'+(typeof value==='function'?value:JSON.stringify(value));}).join(',')+'}}';}else{encodedScript=JSON.stringify(descriptor.script);}args=[JSON.stringify(key),encodedScript,JSON.stringify(descriptor.style),JSON.stringify(descriptor.messages),JSON.stringify(descriptor.templates)];}catch(e){mw.trackError('resourceloader.exception',{exception:e,source:'store-localstorage-json'});return;}src='mw.loader.implement('+args.join(',')+');';if(src.length>this.MODULE_SIZE_MAX){return;}this.items[key]=src;},prune:function(){var key,module;for(
key in this.items){module=key.slice(0,key.indexOf('@'));if(getModuleKey(module)!==key){this.stats.expired++;delete this.items[key];}else if(this.items[key].length>this.MODULE_SIZE_MAX){delete this.items[key];}}},clear:function(){this.items={};try{localStorage.removeItem(this.key);}catch(e){}},requestUpdate:(function(){var hasPendingWrites=!1;function flushWrites(){var data,key;mw.loader.store.prune();while(mw.loader.store.queue.length){mw.loader.store.set(mw.loader.store.queue.shift());}key=mw.loader.store.key;try{localStorage.removeItem(key);data=JSON.stringify(mw.loader.store);localStorage.setItem(key,data);}catch(e){mw.trackError('resourceloader.exception',{exception:e,source:'store-localstorage-update'});}hasPendingWrites=!1;}function onTimeout(){mw.requestIdleCallback(flushWrites);}return function(){if(!hasPendingWrites){hasPendingWrites=!0;setTimeout(onTimeout,2000);}};}())}};}())};window.mw=window.mediaWiki=mw;}());mw.requestIdleCallbackInternal=function(callback){
setTimeout(function(){var start=mw.now();callback({didTimeout:!1,timeRemaining:function(){return Math.max(0,50-(mw.now()-start));}});},1);};mw.requestIdleCallback=window.requestIdleCallback?window.requestIdleCallback.bind(window):mw.requestIdleCallbackInternal;(function(){var queue;mw.loader.addSource({"local":"/load.php"});mw.loader.register([["site","o9aaw",[1]],["site.styles","qn4hs",[],2],["noscript","r22l1",[],3],["filepage","1yjvh"],["user","k1cuu",[],0],["user.styles","8fimp",[],0],["user.defaults","3xwm1"],["user.options","1hzgi",[6],1],["mediawiki.skinning.elements","1wj61"],["mediawiki.skinning.content","1wj61"],["mediawiki.skinning.interface","fwksq"],["jquery.makeCollapsible.styles","dm1ye"],["mediawiki.skinning.content.parsoid","1qwnv"],["mediawiki.skinning.content.externallinks","cwknq"],["jquery","2t9il"],["es6-promise","yfxca",[16]],["es6-polyfills","1eg94",[],null,null,"return typeof Promise==='function'\u0026\u0026Promise.prototype.finally;"],["mediawiki.base",
"5yur3",[14]],["jquery.chosen","oqs2c"],["jquery.client","fn93f"],["jquery.color","dcjsx"],["jquery.confirmable","11aay",[113]],["jquery.cookie","1smd3"],["jquery.form","1wtf2"],["jquery.fullscreen","1xq4o"],["jquery.highlightText","1tsxs",[86]],["jquery.hoverIntent","1aklr"],["jquery.i18n","29w1w",[112]],["jquery.lengthLimit","1llrz",[69]],["jquery.makeCollapsible","1armk",[11]],["jquery.mw-jump","r425l"],["jquery.spinner","16kkr",[32]],["jquery.spinner.styles","o62ui"],["jquery.jStorage","1ccp7"],["jquery.suggestions","9e98z",[25]],["jquery.tablesorter","qji78",[36,114,86]],["jquery.tablesorter.styles","e9s3l"],["jquery.textSelection","152er",[19]],["jquery.throttle-debounce","xl0tk"],["jquery.tipsy","2xdg6"],["jquery.ui","1dv91"],["moment","d6rz2",[110,86]],["vue","fegcm"],["vuex","c4upc",[15,42]],["wvui","138e9",[42]],["mediawiki.template","xae8l"],["mediawiki.template.mustache","nyt38",[45]],["mediawiki.apipretty","1cr6m"],["mediawiki.api","1ufrw",[74,113]],[
"mediawiki.content.json","d8vj3"],["mediawiki.confirmCloseWindow","1khkw"],["mediawiki.debug","19rux",[203]],["mediawiki.diff.styles","ikrf7"],["mediawiki.feedback","n55vm",[273,211]],["mediawiki.feedlink","szobh"],["mediawiki.filewarning","1oumg",[203,215]],["mediawiki.ForeignApi","191mv",[57]],["mediawiki.ForeignApi.core","bd8b3",[83,48,199]],["mediawiki.helplink","12yue"],["mediawiki.hlist","7nynt"],["mediawiki.htmlform","db2r3",[28,86]],["mediawiki.htmlform.ooui","14rir",[203]],["mediawiki.htmlform.styles","tsbav"],["mediawiki.htmlform.ooui.styles","fg820"],["mediawiki.icon","j5ayk"],["mediawiki.inspect","tfpyz",[69,86]],["mediawiki.notification","1fw1k",[86,93]],["mediawiki.notification.convertmessagebox","3la3s",[66]],["mediawiki.notification.convertmessagebox.styles","wj24b"],["mediawiki.String","15280"],["mediawiki.pager.tablePager","1qsqm"],["mediawiki.pulsatingdot","tj1mg"],["mediawiki.searchSuggest","32yoc",[34,48]],["mediawiki.storage","187em"],["mediawiki.Title","1rych",[
69,86]],["mediawiki.Upload","1sdt0",[48]],["mediawiki.ForeignUpload","u99il",[56,75]],["mediawiki.ForeignStructuredUpload","mi56z",[76]],["mediawiki.Upload.Dialog","issxg",[79]],["mediawiki.Upload.BookletLayout","p8fwi",[75,84,196,41,206,211,216,217]],["mediawiki.ForeignStructuredUpload.BookletLayout","cpmmk",[77,79,117,181,175]],["mediawiki.toc","ckf9m",[90]],["mediawiki.toc.styles","zhs94"],["mediawiki.Uri","sqmr8",[86]],["mediawiki.user","vgae7",[48,90]],["mediawiki.userSuggest","18k7y",[34,48]],["mediawiki.util","iak7g",[19]],["mediawiki.viewport","1vq57"],["mediawiki.checkboxtoggle","2yuhf"],["mediawiki.checkboxtoggle.styles","15kl9"],["mediawiki.cookie","9mjqs",[22]],["mediawiki.experiments","hufn5"],["mediawiki.editfont.styles","1ewsx"],["mediawiki.visibleTimeout","119wq"],["mediawiki.action.delete","1dgz0",[28,203]],["mediawiki.action.edit","1o9b5",[37,96,48,92,177]],["mediawiki.action.edit.styles","a2ef6"],["mediawiki.action.edit.collapsibleFooter","mu8ur",[29,64,73]],[
"mediawiki.action.edit.preview","sssja",[29,31,37,52,84,203]],["mediawiki.action.history","vgbiv",[29]],["mediawiki.action.history.styles","1ji9u"],["mediawiki.action.protect","l4iij",[28,203]],["mediawiki.action.view.metadata","1h3zt",[108]],["mediawiki.action.view.categoryPage.styles","19q3o"],["mediawiki.action.view.postEdit","1ppwz",[113,66]],["mediawiki.action.view.redirect","19xk3",[19]],["mediawiki.action.view.redirectPage","4zbf6"],["mediawiki.action.edit.editWarning","1gdkg",[37,50,113]],["mediawiki.action.view.filepage","9tfa0"],["mediawiki.action.styles","64lwx"],["mediawiki.language","xbgr9",[111]],["mediawiki.cldr","erqtv",[112]],["mediawiki.libs.pluralruleparser","pvwvv"],["mediawiki.jqueryMsg","1sxgg",[110,86,7]],["mediawiki.language.months","1mcng",[110]],["mediawiki.language.names","vz7lk",[110]],["mediawiki.language.specialCharacters","qaysy",[110]],["mediawiki.libs.jpegmeta","c4xwo"],["mediawiki.page.gallery","18lwp",[38,119]],["mediawiki.page.gallery.styles","1aadm"
],["mediawiki.page.gallery.slideshow","164d3",[48,206,225,227]],["mediawiki.page.ready","11t8f",[48]],["mediawiki.page.watch.ajax","13d77",[48]],["mediawiki.page.image.pagination","1hhs1",[31,86]],["mediawiki.rcfilters.filters.base.styles","e69lc"],["mediawiki.rcfilters.highlightCircles.seenunseen.styles","1fvny"],["mediawiki.rcfilters.filters.dm","15f3c",[83,84,199]],["mediawiki.rcfilters.filters.ui","yoh14",[29,126,172,212,219,221,222,223,225,226]],["mediawiki.interface.helpers.styles","7v7uy"],["mediawiki.special","xo2rc"],["mediawiki.special.apisandbox","81x7a",[29,83,192,178,202,217,222]],["mediawiki.special.block","bbzkl",[60,175,191,182,192,189,217,219]],["mediawiki.misc-authed-ooui","hbxyk",[61,172,177]],["mediawiki.misc-authed-pref","r18bc",[7]],["mediawiki.misc-authed-curate","18ydi",[21,31,48]],["mediawiki.special.changeslist","195oo"],["mediawiki.special.changeslist.watchlistexpiry","1jn93",[129]],["mediawiki.special.changeslist.enhanced","19caq"],[
"mediawiki.special.changeslist.legend","pyumk"],["mediawiki.special.changeslist.legend.js","ntrpi",[29,90]],["mediawiki.special.contributions","wcllz",[29,113,175,202]],["mediawiki.special.edittags","1x1ih",[18,28]],["mediawiki.special.import","k6r2i",[172]],["mediawiki.special.import.styles.ooui","d6hnx"],["mediawiki.special.preferences.ooui","1pcv5",[50,92,67,73,182,177]],["mediawiki.special.preferences.styles.ooui","1ci0n"],["mediawiki.special.recentchanges","13ytr",[172]],["mediawiki.special.revisionDelete","1a7mj",[28]],["mediawiki.special.search","1cmha",[194]],["mediawiki.special.search.commonsInterwikiWidget","1s9x8",[83,48]],["mediawiki.special.search.interwikiwidget.styles","14p79"],["mediawiki.special.search.styles","15lsy"],["mediawiki.special.unwatchedPages","urar8",[48]],["mediawiki.special.upload","1nr6j",[31,48,50,117,129,45]],["mediawiki.special.userlogin.common.styles","no33f"],["mediawiki.special.userlogin.login.styles","lttkh"],["mediawiki.special.createaccount",
"l1b8g",[48]],["mediawiki.special.userlogin.signup.styles","1qxvi"],["mediawiki.special.userrights","15936",[28,67]],["mediawiki.special.watchlist","qba1s",[48,203,222]],["mediawiki.special.version","1qu9b"],["mediawiki.legacy.config","hz80y"],["mediawiki.legacy.commonPrint","5d5tm"],["mediawiki.legacy.protect","pa56c",[28]],["mediawiki.legacy.shared","fwksq"],["mediawiki.ui","10fkn"],["mediawiki.ui.checkbox","1rg6q"],["mediawiki.ui.radio","287dx"],["mediawiki.ui.anchor","w5in5"],["mediawiki.ui.button","1pnnr"],["mediawiki.ui.input","1wvkk"],["mediawiki.ui.icon","1wakh"],["mediawiki.widgets","1mz0n",[48,173,206,216]],["mediawiki.widgets.styles","rqacs"],["mediawiki.widgets.AbandonEditDialog","1n79q",[211]],["mediawiki.widgets.DateInputWidget","1erfg",[176,41,206,227]],["mediawiki.widgets.DateInputWidget.styles","nf6xt"],["mediawiki.widgets.visibleLengthLimit","1wyjs",[28,203]],["mediawiki.widgets.datetime","10vht",[86,203,226,227]],["mediawiki.widgets.expiry","19dtp",[178,41,206]],[
"mediawiki.widgets.CheckMatrixWidget","12na7",[203]],["mediawiki.widgets.CategoryMultiselectWidget","slkpi",[56,206]],["mediawiki.widgets.SelectWithInputWidget","oe83m",[183,206]],["mediawiki.widgets.SelectWithInputWidget.styles","1fufa"],["mediawiki.widgets.SizeFilterWidget","sawvf",[185,206]],["mediawiki.widgets.SizeFilterWidget.styles","15b9u"],["mediawiki.widgets.MediaSearch","1hnr8",[56,206]],["mediawiki.widgets.Table","1gmb8",[206]],["mediawiki.widgets.TagMultiselectWidget","syz4w",[206]],["mediawiki.widgets.UserInputWidget","1oqp3",[48,206]],["mediawiki.widgets.UsersMultiselectWidget","1iec8",[48,206]],["mediawiki.widgets.NamespacesMultiselectWidget","1nuht",[206]],["mediawiki.widgets.TitlesMultiselectWidget","2tq85",[172]],["mediawiki.widgets.TagMultiselectWidget.styles","1vzh9"],["mediawiki.widgets.SearchInputWidget","1ri9j",[72,172,222]],["mediawiki.widgets.SearchInputWidget.styles","68its"],["mediawiki.widgets.StashedFileWidget","1ik9v",[48,203]],[
"mediawiki.watchstar.widgets","1ya1g",[202]],["mediawiki.deflate","gu4pi"],["oojs","1fhbo"],["mediawiki.router","1f8qs",[201]],["oojs-router","1xhla",[199]],["oojs-ui","yfxca",[209,206,211]],["oojs-ui-core","1u7r5",[110,199,205,204,213]],["oojs-ui-core.styles","1pauj"],["oojs-ui-core.icons","1m1na"],["oojs-ui-widgets","1ixsg",[203,208]],["oojs-ui-widgets.styles","7iunh"],["oojs-ui-widgets.icons","1gg3r"],["oojs-ui-toolbars","1avni",[203,210]],["oojs-ui-toolbars.icons","zlgop"],["oojs-ui-windows","1l2in",[203,212]],["oojs-ui-windows.icons","1v7dw"],["oojs-ui.styles.indicators","1uqy0"],["oojs-ui.styles.icons-accessibility","ol0ru"],["oojs-ui.styles.icons-alerts","ql9cf"],["oojs-ui.styles.icons-content","l4gpc"],["oojs-ui.styles.icons-editing-advanced","kxn6e"],["oojs-ui.styles.icons-editing-citation","ts2u5"],["oojs-ui.styles.icons-editing-core","19jer"],["oojs-ui.styles.icons-editing-list","19thp"],["oojs-ui.styles.icons-editing-styling","12w5y"],["oojs-ui.styles.icons-interactions",
"hv662"],["oojs-ui.styles.icons-layout","dnm69"],["oojs-ui.styles.icons-location","1wcu4"],["oojs-ui.styles.icons-media","wh1nt"],["oojs-ui.styles.icons-moderation","1kec0"],["oojs-ui.styles.icons-movement","w42p0"],["oojs-ui.styles.icons-user","1qplx"],["oojs-ui.styles.icons-wikimedia","cs9js"],["skins.monobook.styles","18fgm"],["skins.monobook.responsive","1fuho"],["skins.monobook.mobile.uls","18u9r"],["skins.monobook.mobile.echohack","12ty6",[86,215]],["skins.monobook.mobile","158mg",[86]],["skins.vector.search","1e4r5",[83,44]],["skins.vector.styles.legacy","17rln"],["skins.vector.styles","1mcfk"],["skins.vector.icons","19svm"],["skins.vector.js","11ven",[121]],["skins.vector.legacy.js","1ynhz",[121]],["zzz.ext.archLinux.styles","y7qrf"],["ext.nuke.confirm","qvw09",[113]],["ext.abuseFilter","1iiv2"],["ext.abuseFilter.edit","1mi01",[31,37,48,50,206]],["ext.abuseFilter.tools","12z2a",[31,48]],["ext.abuseFilter.examine","kyyo4",[31,48]],["ext.abuseFilter.ace","11te7",[
"ext.codeEditor.ace"]],["ext.abuseFilter.visualEditor","1b19z"],["ext.checkUser","gcwoh",[35,83,70,73,172,217,219,222,224,226,228]],["ext.checkUser.styles","1flvi"],["ext.guidedTour.tour.checkuserinvestigateform","1r7uv",["ext.guidedTour"]],["ext.guidedTour.tour.checkuserinvestigate","1aysm",[249,"ext.guidedTour"]],["ext.interwiki.specialpage","xk4er"],["ext.confirmEdit.editPreview.ipwhitelist.styles","snao4"],["ext.confirmEdit.visualEditor","1o5d1",[272]],["ext.confirmEdit.simpleCaptcha","13yvy"],["ext.wikiEditor","w2fie",[34,37,38,40,116,84,206,216,217,218,219,220,221,225,45],4],["ext.wikiEditor.styles","ij13s",[],4],["ext.CodeMirror","1vpnp",[260,37,40,84,221]],["ext.CodeMirror.data","x46tp"],["ext.CodeMirror.lib","1sz2p"],["ext.CodeMirror.addons","5a9iv",[261]],["ext.CodeMirror.mode.mediawiki","1gmm7",[261]],["ext.CodeMirror.lib.mode.css","1934i",[261]],["ext.CodeMirror.lib.mode.javascript","fl4m2",[261]],["ext.CodeMirror.lib.mode.xml","1aj3q",[261]],[
"ext.CodeMirror.lib.mode.htmlmixed","1j6tv",[264,265,266]],["ext.CodeMirror.lib.mode.clike","1wjfq",[261]],["ext.CodeMirror.lib.mode.php","1iw8b",[268,267]],["ext.CodeMirror.visualEditor.init","1wfaq"],["ext.CodeMirror.visualEditor","1dr7k",["ext.visualEditor.mwcore",48]],["ext.confirmEdit.CaptchaInputWidget","1fb8z",[203]],["mediawiki.messagePoster","1wtgm",[56]]]);mw.config.set(window.RLCONF||{});mw.loader.state(window.RLSTATE||{});mw.loader.load(window.RLPAGEMODULES||[]);queue=window.RLQ||[];RLQ=[];RLQ.push=function(fn){if(typeof fn==='function'){fn();}else{RLQ[RLQ.length]=fn;}};while(queue[0]){RLQ.push(queue.shift());}NORLQ={push:function(){}};}());}
