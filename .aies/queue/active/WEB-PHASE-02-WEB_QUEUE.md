---
phase: WEB-PHASE-02
subtitle: Web Real Data Integration
status: active
frontend: true
createdAt: 2026-08-08T02:20:00Z
---

# WEB-PHASE-02 Web Queue

## Objective

Connect `D:\AIOmnichannelSalesOS-Web` to the real backend JSON API contracts while preserving the typed API abstraction and mock-fallback capability.

## Authority

- `D:\AIOmnichannelSalesOS-Web` owns: typed API client, routes, components, presentation, browser-safe state.
- `D:\AIOmnichannelSalesOS` owns: auth, tenant truth, secrets, business logic.

## Dependencies

- `WEB_PHASE_01_COMPLETE`
- `AIOS_WEB_FRONTEND_FOUNDATION_COMPLETE`
- `WEB-PHASE-02-BACKEND` JSON API available

## Queue

| ID | Task | Deliverable | Condition |
|----|------|-------------|-----------|
| WEB02-FE-001 | Read backend API requirements | `docs/WEB-PHASE-02-CONSOLIDATED-REPORT.md` | Contract surface understood |
| WEB02-FE-002 | Add configurable backend base URL | `.env.example`, `lib/config.ts` | `NEXT_PUBLIC_API_URL` supported |
| WEB02-FE-003 | Implement typed HTTP API client | `lib/api-real.ts` | Returns same types as `lib/api.ts` |
| WEB02-FE-004 | Add error/loading state abstraction | `lib/api.ts` updated | loading/unauthorized/error/retry supported |
| WEB02-FE-005 | Wire real data into Dashboard | `app/page.tsx` | Uses backend readiness endpoint |
| WEB02-FE-006 | Wire real data into Connections | `app/facebook/page.tsx` | Uses summary endpoint |
| WEB02-FE-007 | Wire real data into Page list/detail | `app/facebook/pages/**` | Uses registry endpoints |
| WEB02-FE-008 | Wire real data into wizard | `app/facebook/connect/**` | Uses businesses/pages/connections endpoints |
| WEB02-FE-009 | Wire real data into Verification | `app/facebook/verify/page.tsx` | Uses diagnostics endpoint |
| WEB02-FE-010 | Add focused tests | `*.test.ts` or `*.test.tsx` | Critical behavior covered |
| WEB02-FE-011 | Run visual QA | Screenshot evidence / notes | Desktop/mobile/empty/warning/error |
| WEB02-FE-012 | Run frontend validation | `npm run typecheck/build/lint` | Green |
| WEB02-FE-013 | Create consolidated report | `docs/WEB-PHASE-02-CONSOLIDATED-REPORT.md` | Complete |

## Stop Conditions

- Need to modify backend, AIES, or AIES-Studio
- Need to expose or store secrets in frontend
- Backend contracts missing and not resolvable in phase scope
- Build failure
