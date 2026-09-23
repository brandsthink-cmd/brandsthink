import {site} from '@/content/site';
export function GET(){return new Response(`User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${site.origin}/sitemap.xml\n`,{headers:{'Content-Type':'text/plain; charset=utf-8'}})}
