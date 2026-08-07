# AI Omnichannel Sales OS — Web

**Product:** AI Omnichannel Sales OS SaaS Web UI  
**Repository:** `D:\AIOmnichannelSalesOS-Web`  
**Backend Authority:** `D:\AIOmnichannelSalesOS`  
**AIES Authority:** `D:\AIES`

## Role

This repository owns the AI Omnichannel Sales OS Web UI:

- SaaS onboarding
- Facebook Connections UI
- Multi-page management
- Connection diagnostics
- Responsive/mobile UX

It does **not** own the backend, database, tenant security, OAuth secrets, Meta tokens, webhook business logic, advertising persistence, or backend business rules. Those live in `D:\AIOmnichannelSalesOS`.

## Tech Stack

- Next.js 15
- TypeScript
- App Router
- Tailwind CSS v4

## Scripts

- `npm run dev` — development server
- `npm run build` — production build with type checking
- `npm run lint` — ESLint
- `npm run typecheck` — standalone TypeScript check

## Phase

`WEB-PHASE-01` — SaaS Frontend Foundation & Facebook Multi-Page UX.
