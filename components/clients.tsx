import clients from '@/content/clients.json';

const featuredNames=['Amazon Prime Video','Netflix','TATA Neu','Intel','PS5','4 Sides TV Telugu','BNI Trivandrum','Binomo','Civilianz','Moza Al Raqmi Law Firm','John Cox Memorial CSI Institute of Technology','Wayanad Trip Planner'];

export function ClientLogos({featured=false}:{featured?:boolean}){
 const items=featured?featuredNames.map(name=>clients.find(client=>client.name===name)!).filter(Boolean):clients;
 return <ul className={`client-logo-grid${featured?' client-logo-grid-featured':''}`} aria-label={featured?'Selected BrandsThink clients':'BrandsThink client logos'}>
  {items.map(client=><li className="client-logo-card" key={client.slug}>
   <div className={`client-logo-image client-logo-${client.background}`}><img src={client.src} alt={`${client.name} logo`} width={client.width} height={client.height} loading="lazy" decoding="async"/></div>
   <span>{client.name}</span>
  </li>)}
 </ul>;
}

export function ClientsShowcase(){return <section id="clients" className="section clients-section" aria-labelledby="clients-heading">
 <div className="section-heading"><div><p className="eyebrow">OUR CLIENTS</p><h2 id="clients-heading">Good company.<br/><span>Great collaborations.</span></h2></div><a className="text-link" href="/clients/">Explore all clients ↗</a></div>
 <ClientLogos featured/>
 </section>}
