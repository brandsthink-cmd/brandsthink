import {Motion} from '@/components/experience';
import type {Metadata} from 'next';
import './globals.css';
import './motion.css';
import {Header,Footer} from '@/components/site';
import {JsonLd,metadata as meta,url} from '@/lib/seo';
import {site} from '@/content/site';
export const metadata:Metadata={...meta('BrandsThink | Growth Marketing in Trivandrum & Kochi',site.description),metadataBase:new URL(site.origin),icons:{icon:'/favicon.svg'},robots:{index:true,follow:true}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><Motion/><Header/>{children}<Footer/><JsonLd data={{'@context':'https://schema.org','@graph':[{'@type':'Organization','@id':url()+'#organization',name:site.name,url:url(),description:site.description,telephone:site.phones[0],award:site.award,areaServed:['Trivandrum','Calicut','Kochi','UAE','UK']},{'@type':'WebSite','@id':url()+'#website',name:site.name,url:url(),publisher:{'@id':url()+'#organization'}}]}}/></body></html>}
