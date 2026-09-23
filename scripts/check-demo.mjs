import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve('docs');
async function walk(dir){const out=[];for(const item of await fs.readdir(dir,{withFileTypes:true})){const file=path.join(dir,item.name);if(item.isDirectory())out.push(...await walk(file));else out.push(file)}return out}
const files=await walk(root);let links=0;let schemas=0;
for(const file of files.filter(f=>f.endsWith('.html'))){const html=await fs.readFile(file,'utf8');assert.equal((html.match(/<h1[\s>]/g)||[]).length,1,file);assert(html.includes('noindex,follow'),file);assert(!html.includes('/api/leads'),file);assert(!html.includes('self.__next'),file);for(const m of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)){JSON.parse(m[1]);schemas++}for(const m of html.matchAll(/(?:href|src)="([^"#]+)"/g)){if(!m[1].startsWith('/'))continue;assert(m[1].startsWith('/brandsthink/'),m[1]);const rel=m[1].slice('/brandsthink/'.length).split(/[?#]/)[0];const target=path.join(root,rel.endsWith('/')||!rel?rel+'index.html':rel);assert((await fs.stat(target)).isFile(),target);links++}if(html.includes('<form')){assert(html.includes('type="submit" disabled'),file);assert(html.includes('name="consent" type="checkbox" required'),file);assert(html.includes('does not save or send'),file)}}
console.log(JSON.stringify({htmlPages:files.filter(f=>f.endsWith('.html')).length,checkedLinks:links,jsonLdBlocks:schemas,assets:files.filter(f=>!f.endsWith('.html')).length},null,2));
