# BrandsThink website

Latest website source including the award spotlight, 100+ client metric, 93 client logos, 13 work/BTS/explainer videos, WhatsApp enquiry handoff, and Trivandrum, Kochi and Calicut pages.

## Run locally

Use Node.js 22.13 or newer. Install with npm run install:ci, then npm run dev. Build with npm run build.

## Hosting

This source uses Vinext and Cloudflare Workers with D1 for saved enquiries. It is not yet a standard Vercel/Next.js deployment. Before deploying to Vercel, replace the Cloudflare-specific runtime and lead storage, use standard Next.js build scripts, and configure the final site origin. The existing published site is unchanged by this repository upload.

No credentials, production database, or owner-specific hosting project ID are included. Set up your own hosting and database before running the saved-enquiry endpoint in production.

## Edit content

- content/site.ts: services, metrics, contacts, FAQs and location content.
- content/clients.json: client logos and asset sources.
- components/clients.tsx: homepage client order.
- components/work-videos.tsx: YouTube video groups.
- app/motion.css: award styling and reduced-motion-aware animation.
- public/: website media.

The form saves the enquiry and opens a prepared WhatsApp message for the visitor to review and send. It does not automatically send WhatsApp messages.
