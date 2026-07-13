# Recep Usta — Portfolio

Ultra-premium dark portfolio for **Recep Usta**: network engineering, cloud systems, cyber security, software development and AI automation.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS
- Framer Motion + GSAP + Lenis
- Three.js / React Three Fiber
- Spline (optional via `NEXT_PUBLIC_SPLINE_SCENE_URL`)
- Lucide + React Icons

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — Turbopack dev server
- `npm run build` — production build
- `npm start` — serve production build
- `npm run lint` — ESLint

## Content / CMS

Dynamic content lives in `src/data/*` and is abstracted through `src/lib/cms.ts` for future CMS providers (Sanity, Payload, etc.).

## Environment

Copy `.env.example` and optionally set:

```
NEXT_PUBLIC_SPLINE_SCENE_URL=https://prod.spline.design/your-scene/scene.splinecode
NEXT_PUBLIC_SITE_URL=https://recepusta.com
```

## SEO

- Metadata + Open Graph + Twitter Cards
- JSON-LD (Person, WebSite, BlogPosting, CreativeWork)
- `sitemap.xml` and `robots.txt`
