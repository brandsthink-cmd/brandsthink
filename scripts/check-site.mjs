import assert from 'node:assert/strict';
const base=process.argv[2]||'http://localhost:5173';
const get=async p=>{const r=await fetch(base+p);return {r,text:await r.text()}};
const {text:xml}=await get('/sitemap.xml');const routes=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname);assert(routes.length>=30);
let links=new Set();const titleSet=new Set();let schemas=0;
for(const path of routes){const {r,text}=await get(path);assert.equal(r.status,200,path);assert.equal((text.match(/<h1[\s>]/g)||[]).length,1,`${path}: h1`);const title=text.match(/<title>(.*?)<\/title>/s)?.[1];assert(title,`${path}: title`);assert(!titleSet.has(title),`${path}: duplicate title`);titleSet.add(title);assert(/name="description"/.test(text),`${path}: description`);assert(/rel="canonical"/.test(text),`${path}: canonical`);assert(text.includes('property="og:title"'),`${path}: OG`);for(const m of text.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)){JSON.parse(m[1]);schemas++}for(const m of text.matchAll(/href="(\/[^"#?]*)/g))links.add(m[1]);}
for(const path of links){const {r}=await get(path);assert(r.status<400,`${path}: broken internal link`)}
const missing=await get('/page-that-does-not-exist/');assert.equal(missing.r.status,404);
const invalid=await fetch(base+'/api/leads',{method:'POST',headers:{Origin:base,'Content-Type':'application/json'},body:JSON.stringify({name:'x'})});assert.equal(invalid.status,400);
const crossOrigin=await fetch(base+'/api/leads',{method:'POST',headers:{Origin:'https://invalid.example','Content-Type':'application/json'},body:'{}'});assert.equal(crossOrigin.status,403);
console.log(JSON.stringify({routes:routes.length,uniqueTitles:titleSet.size,internalLinks:links.size,validSchemaBlocks:schemas,notFound:404,invalidInput:400,crossOrigin:403},null,2));
