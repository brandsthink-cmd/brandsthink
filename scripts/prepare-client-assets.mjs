// Extract exact supplied logo pixels; never redraw marks or invent client artwork.
// Usage: node scripts/prepare-client-assets.mjs <folder-with-supplied-files>
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const source=process.argv[2];
if(!source)throw new Error('Provide the supplied client asset folder.');
const originals=[
 ['Alien Shipping Logo.jpg','Alien Shipping'],
 ['Almathaq Logo.png','AlMathaq'],
 ['AlphaArc Logo.png','AlphaArc'],
 ['CPIP Logo Final.png','CarePlus Institute of Paramedical'],
 ['Creations  logo 4.png','Creations'],
 ['Danzora Logo.png','Danzora','dark'],
 ['empire RGB black only Full logo.png','Empire Tattoo'],
 ['Ensemblee Logo Original Final.png','Ensemblee'],
 ['Ente Story Logo 3.3.png','Ente Story'],
 ['FH Fitness Club Logo - Black 7.png','Fit Hackers Fitness Club','dark'],
 ['Full Logo.svg','Central Scotland Malayalee Association'],
 ['God Bright Photography.png','God Bright Photography','dark'],
 ['Gotripzee Logo - White.png','Gotripzee','dark'],
 ['Logo Square.png','VKA Builders'],
 ['logo.png','M. S. Sarkar Dispensary'],
 ['Mayfair Foods.png','Mayfair Foods'],
 ['McLa Logo.png','McLa','dark'],
 ['Memoir Holidays Logo White.png','Memoir Holidays','dark'],
 ['MET_SAND_White-02.png','MetSand','dark'],
 ['MORLAW Logo 5.png','Moza Al Raqmi Law Firm'],
 ['NIMA Logo New 8.png','Northern Ireland Malayali Association'],
 ['Pet Traces Logo 1.1.png','Pet Traces'],
 ['Phifer.png','Phifer','dark'],
 ['PHR Logo.png','Provenance HR Consultancy'],
 ['PIAE Logo 3.png','Perfect'],
 ['planet jewel logo.png','Planet Jewel'],
 ['Priyadarshan Vastu Logo.png','Dr. Priyadarshan Vastu'],
 ["RJ's Tea Town Logo.png","RJ’s Tea Town"],
 ['Saji Exports Logo Blue.png','Saji Exports'],
 ['Sandeep Connect Logo 2.png','Sandeep Connect'],
 ['Svaad Logo.png','Svaad'],
 ['Teachers Near Me Logo.png','Teachers Near Me'],
 ['TID Logo Final.png','Thekkumkal Infra Developers'],
 ['tp-logo-black-color.png','Teal Parrot'],
 ['TVM Homes Logo white.png','TVM Homes','dark'],
 ['ULKA TV Logo.jpg','ULKA TV'],
 ['Uplife Logo - Original.png','Uplife'],
 ['V Power Solar Solutions Logo.png','V Power Solar Solutions'],
 ['Varnam Logo.png','Varnam','dark'],
 ['Vishweka Arurveda Logo.png','Vishweka Ayurveda','dark'],
 ['Wayanad Trip Planner Logo - White.png','Wayanad Trip Planner','dark'],
 ['WISHCRAFT Full.png','Wishcraft'],
];
const crops=[];
const row=(file,names,left,top,step,width,height)=>names.forEach((name,i)=>{if(name)crops.push({file,name,box:{left:left+i*step,top,width,height}})});
row('clients 1.png',['Intel','Amazon Prime Video','Netflix','TATA Neu','Turnip','Binomo','Rooter','Rush Gaming Universe'],110,140,175,150,112);
// The old screenshot repeats the Telugu mark under its Malayalam caption. Keep one exact mark.
row('clients 1.png',['4 Sides TV Kannada','4 Sides TV Hindi','4 Sides TV English',null,'4 Sides TV Telugu','4 Sides TV Fashion','BNI Trivandrum','Indimasi'],110,390,175,150,140);
// Three personal-brand portraits in screenshot 2 are not logos and are not part of this logo gallery.
row('clients 2.png',['KT Edurite','EAFL','John Cox Memorial CSI Institute of Technology','Palazhi Ayurveda','Trichut Fashion Jewellery'],37,10,175,150,135);
crops.push({file:'clients 2.png',name:'Acotoman India Private Limited',box:{left:44,top:338,width:137,height:116}});
row('clients 2.png',['Civilianz','Spice Kettle','Zirimart','Ziridaily','Obiz Overseas','Fortuna Events','Friday Bird'],212,320,175,150,140);
row('clients 3.png',['Surplus','Lekshmi & Associates','Gamers Junction','Atharv','Cinephile','Alina Interiors','Yashvasin Logistics','Virus Mens Park'],3,0,175,150,136);
row('clients 3.png',['AZ Insurance Agency','KURDFC','Nexus Makeover Studio','AMMA','3rd Degree Productions','Delight Baiko','Simple Distributors','Nalla Chaya'],3,264,175,150,137);
row('clients 4.png',['Electromech Systems & Technologies','Arc N Glow','Granny Movie','Indian Fashion TV','Pobail','Zela Fashion Channel'],35,40,245,180,133);
// Exclude the old screenshot's cursor halo in the whitespace beside this mark.
crops.find(crop=>crop.name==='Arc N Glow').box={left:300,top:40,width:145,height:133};
await fs.mkdir('public/clients',{recursive:true});
const clients=[];
async function save(name,pipeline,background,provenance){
 const slug=name.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 const output=`public/clients/${slug}.webp`;
 const buffer=await pipeline.trim({threshold:8}).resize({width:420,height:200,fit:'inside',withoutEnlargement:true}).webp({lossless:true}).toBuffer();
 await fs.writeFile(output,buffer);
 const {width,height}=await sharp(buffer).metadata();
 clients.push({name,slug,src:`/clients/${slug}.webp`,width,height,background,source:provenance});
}
for(const [file,name,background='light'] of originals)await save(name,sharp(path.join(source,file)),background,'original');
for(const {file,name,box} of crops)await save(name,sharp(await sharp(path.join(source,file)).extract(box).png().toBuffer()),'light','old-site');
clients.push({name:'PS5',slug:'ps5',src:'/clients/ps5.svg',width:512,height:111,background:'light',source:'https://commons.wikimedia.org/wiki/File:PlayStation_5_logo_and_wordmark.svg'});
clients.sort((a,b)=>a.name.localeCompare(b.name));
await fs.writeFile('content/clients.json',JSON.stringify(clients,null,2)+'\n');
console.log(`Prepared ${clients.length} distinct client logos (${originals.length} originals, ${crops.length} screenshot extracts).`);
