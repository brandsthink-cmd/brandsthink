import {ClientLogos} from '@/components/clients';
import {CTA,PageIntro} from '@/components/site';
import {metadata as pageMetadata,PageSchema} from '@/lib/seo';

const title='Our Clients | BrandsThink';
const description='Explore the brands, businesses and organisations BrandsThink has worked with across creative, marketing and technology.';
export const metadata=pageMetadata(title,description,'/clients/');
export default function ClientsPage(){return <main id="main">
 <PageIntro label="OUR CLIENTS" title="Brands we’ve worked with." description={description}/>
 <section className="section client-directory" aria-label="Our client gallery"><ClientLogos/></section>
 <section className="section client-work-link"><h2>A logo is the beginning<br/>of the story.</h2><p className="lead">Talk to us about relevant projects, the work involved and available references.</p><a className="text-link" href="/case-studies/">Explore our work ↗</a></section>
 <CTA/><PageSchema title={title} description={description} path="/clients/"/>
 </main>}
