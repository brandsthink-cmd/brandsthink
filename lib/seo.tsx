import type {Metadata} from 'next';
import {site} from '@/content/site';
export const url=(path='/')=>`${site.origin}${path}`;
export function metadata(title:string,description:string,path='/'):Metadata{return {title,description,alternates:{canonical:url(path)},openGraph:{type:'website',siteName:site.name,title,description,url:url(path),locale:'en_IN'},twitter:{card:'summary',title,description}}}
export function JsonLd({data}:{data:unknown}){return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(data).replace(/</g,'\\u003c')}}/>}
export function PageSchema({title,description,path,service,article,faq,areaServed}:{title:string;description:string;path:string;service?:boolean;article?:boolean;faq?:string[][];areaServed?:string[]}){return <JsonLd data={{'@context':'https://schema.org','@graph':[
 {'@type':article?'Article':'WebPage','@id':url(path)+'#page',url:url(path),name:title,...(article?{headline:title,author:{'@type':'Organization',name:site.name,url:url()},publisher:{'@id':url()+'#organization'}}:{}),description,isPartOf:{'@id':url()+'#website'}},
 {'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:url()},{'@type':'ListItem',position:2,name:title,item:url(path)}]},
 ...(service?[{'@type':'Service',name:title,description,url:url(path),provider:{'@id':url()+'#organization'},areaServed:areaServed||['Trivandrum','Calicut','Kochi']}]:[]),
 ...(faq?.length?[{'@type':'FAQPage',mainEntity:faq.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))}]:[])
 ]}}/>}
