import {z} from 'zod';
import {getDB} from '@/lib/db';
import {site} from '@/content/site';
const optionalText=(max:number)=>z.string().trim().max(max).optional().default('');
const numberField=z.union([z.literal(''),z.coerce.number().int().min(0).max(100000000)]).optional();
const schema=z.object({id:z.string().uuid(),name:z.string().trim().min(2).max(100),business:z.string().trim().min(2).max(160),email:z.string().trim().email().max(254),phone:optionalText(30),website:z.union([z.literal(''),z.string().url().max(500).refine(v=>/^https?:\/\//i.test(v))]).optional().default(''),industry:optionalText(100),budget:optionalText(80),currentLeads:numberField,targetLeads:numberField,challenge:z.string().trim().min(10).max(2000),consent:z.literal(true),companyFax:z.literal('').optional()});
const reply=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
export async function POST(request:Request){
 const origin=request.headers.get('origin');const requestUrl=new URL(request.url);const allowed=[site.origin];if(requestUrl.hostname==='localhost'||requestUrl.hostname==='127.0.0.1')allowed.push(requestUrl.origin);
 if(!origin||!allowed.includes(origin))return reply({error:'Please submit the form from the BrandsThink website.'},403);
 if(!request.headers.get('content-type')?.includes('application/json'))return reply({error:'Unsupported request format.'},415);
 if(Number(request.headers.get('content-length')||0)>12000)return reply({error:'Please shorten your message.'},413);
 let input:unknown;try{const reader=request.body?.getReader();if(!reader)return reply({error:'Missing request.'},400);const chunks:Uint8Array[]=[];let size=0;while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>12000){await reader.cancel();return reply({error:'Please shorten your message.'},413)}chunks.push(value)}const buffer=new Uint8Array(size);let offset=0;for(const c of chunks){buffer.set(c,offset);offset+=c.length}input=JSON.parse(new TextDecoder().decode(buffer))}catch{return reply({error:'Please check your form and try again.'},400)}
 const parsed=schema.safeParse(input);if(!parsed.success)return reply({error:'Please check required fields, email, website address and consent.'},400);const d=parsed.data;
 try{const db=getDB();const ip=request.headers.get('cf-connecting-ip')||'local';const day=new Date().toISOString().slice(0,10);const hash=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(`${day}|${ip}|${site.origin}`));const ipHash=Array.from(new Uint8Array(hash),b=>b.toString(16).padStart(2,'0')).join('');
 const existing=await db.prepare('SELECT id, email FROM leads WHERE id = ?').bind(d.id).first<{id:string;email:string}>();if(existing){if(existing.email!==d.email)return reply({error:'Please reload the form and try again.'},409);return reply({reference:`BT-${d.id}`,saved:true})}
 const count=await db.prepare("SELECT COUNT(*) AS total FROM leads WHERE ip_hash = ? AND created_at > datetime('now', '-1 hour')").bind(ipHash).first<{total:number}>();if((count?.total||0)>=10)return reply({error:'Too many requests. Please try again later or call our team.'},429);
 await db.prepare('INSERT INTO leads (id,name,business,email,phone,website,industry,budget,current_leads,target_leads,challenge,consent,privacy_version,ip_hash) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)').bind(d.id,d.name,d.business,d.email,d.phone,d.website,d.industry,d.budget,d.currentLeads===''||d.currentLeads===undefined?null:d.currentLeads,d.targetLeads===''||d.targetLeads===undefined?null:d.targetLeads,d.challenge,1,'2026-09-19',ipHash).run();
 return reply({reference:`BT-${d.id}`,saved:true},201);
 }catch{console.error('Lead request could not be persisted');return reply({error:'We could not save your request. Your details remain in the form. Please retry or call +91 9633033322.'},503)}
}
