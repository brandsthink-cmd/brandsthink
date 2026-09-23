import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {site,services,locations,industries,articles,caseStudies} from '../content/site.ts';
const server=process.argv[2]||'http://localhost:5174';
const base='/brandsthink';
const origin='https://brandsthink-cmd.github.io'+base;
const routes=['','services','industries','case-studies','clients','insights','about','contact','privacy',...services.map(s=>s.slug),...locations.map(s=>s.slug),...industries.map(s=>'industries/'+s.slug),...articles.map(s=>'insights/'+s.slug),...caseStudies.filter(s=>s.approved).map(s=>'case-studies/'+s.slug)];
const assets=new Set();
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
function transform(html,route){
 // Keep semantic content and JSON-LD; use a small demo interaction script instead of React hydration.
 html=html.replace(/<script\b([^>]*)>[\s\S]*?<\/script>/gi,(all,attrs)=>attrs.includes('application/ld+json')?all:'');
 html=html.replace(/<link\b[^>]*(?:as="script"|rel="modulepreload")[^>]*>/gi,'');
 html=html.replaceAll(site.origin,origin);
 html=html.replace(/\b(href|src|action)="\/(?!\/)([^"]*)"/g,(_,attr,value)=>`${attr}="${base}/${value}"`);
 html=html.replace(/<meta\b[^>]*name="robots"[^>]*>/gi,'');
 html=html.replace('</head>',`<meta name="robots" content="noindex,follow"><script src="${base}/demo.js" defer></script><link rel="stylesheet" href="${base}/demo.css"></head>`);
 html=html.replace(/<button\b(?=[^>]*id="audit-consent")[^>]*>[\s\S]*?<\/button>/g,'<input class="consent-box" id="audit-consent" name="consent" type="checkbox" required>');
 html=html.replace(/<input\b(?=[^>]*type="checkbox")(?=[^>]*aria-hidden="true")[^>]*>/g,'');
 html=html.replaceAll('Request my growth audit ↗','Prepare WhatsApp enquiry ↗');
 html=html.replaceAll('* Required fields','Demo: prepare a WhatsApp enquiry. This form does not save or send your details. * Required fields');
 html=html.replaceAll('Your request is securely recorded for BrandsThink to review.','On this demo, you prepare a message and choose whether to send it on WhatsApp.');
 html=html.replaceAll('Please enable JavaScript to submit this form, or call us using the number above.','Please enable JavaScript to prepare a WhatsApp message, or call the number above.');
 // Never allow a no-JavaScript submission to put contact details into the URL.
 html=html.replace(/<button class="button" type="submit"/g,'<button class="button" type="submit" disabled');
 if(route==='privacy'){
 html=html.replace(/<div class="article-body">[\s\S]*?<\/main>/,`<div class="article-body"><section><h2>About this demo</h2><p>This is a static GitHub Pages demonstration of the BrandsThink website. The form prepares a message in your browser. It does not save an enquiry in a database or automatically send it.</p></section><section><h2>Your choices</h2><p>You choose whether to open WhatsApp and send the prepared message. WhatsApp then handles the information according to its own terms. Do not enter sensitive information into the demo.</p></section><section><h2>Hosting</h2><p>GitHub Pages serves this website and may process technical request information. This demo adds no advertising trackers, optional analytics or browser storage.</p></section><section><h2>Contact</h2><p>Contact BrandsThink at +91 9633033322 or +91 7012380072 with questions about an enquiry sent to the team.</p></section></div></main>`);
 }
 for(const m of html.matchAll(/(?:src|href)="\/brandsthink\/([^"?#]+\.(?:css|webp|svg))"/g))assets.add(m[1]);
 assert(!html.includes('self.__next_f'),route+': flight data retained');
 assert(!html.includes('/api/leads'),route+': backend dependency retained');
 assert.equal((html.match(/<h1[\s>]/g)||[]).length,1,route+': h1');
 return html;
}
for(const route of routes){const response=await fetch(`${server}/${route?route+'/':''}`);assert.equal(response.status,200,route);const html=transform(await response.text(),route);const dir=path.join('docs',route);await fs.mkdir(dir,{recursive:true});await fs.writeFile(path.join(dir,'index.html'),html)}
const missing=await fetch(server+'/this-page-does-not-exist');assert.equal(missing.status,404);await fs.writeFile('docs/404.html',transform(await missing.text(),'404'));
for(const asset of assets){if(['demo.css'].includes(asset))continue;const from=path.join('dist/client',asset);const to=path.join('docs',asset);await fs.mkdir(path.dirname(to),{recursive:true});await fs.copyFile(from,to)}
await fs.copyFile('scripts/demo/demo.js','docs/demo.js');await fs.copyFile('scripts/demo/demo.css','docs/demo.css');
await fs.writeFile('docs/.nojekyll','');
await fs.writeFile('docs/robots.txt',`User-agent: *\nAllow: /\n# Demo pages use noindex to avoid competing with the production site.\nSitemap: ${origin}/sitemap.xml\n`);
await fs.writeFile('docs/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(p=>`<url><loc>${origin}/${p?p+'/':''}</loc></url>`).join('')}</urlset>`);
console.log(`Exported ${routes.length} pages and ${assets.size} assets to docs/.`);
