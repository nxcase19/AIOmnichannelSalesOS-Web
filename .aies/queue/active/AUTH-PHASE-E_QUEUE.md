# AUTH-PHASE-E Frontend Queue

## Authority

- Source: AIES
- Repository: `D:\AIOmnichannelSalesOS-Web`
- Execution Mode: `AIES_PHASE_EXECUTION_MODE_PILOT_001`
- Authorized by: AUTH-PHASE-D complete (`7bc7d7a`)
- Predecessor: `AUTH-PHASE-D` (`7bc7d7a`)
- Backend authority (read/verify only): `D:\AIOmnichannelSalesOS`

## Scope

Implement the complete browser-side authentication experience for the Email Magic Link and workspace session architecture.

## Approved Decisions

- Frontend login UX: authorized.
- Email magic-link request/consume UX: authorized.
- `AuthProvider` / session state: authorized.
- Authenticated route protection (UX only): authorized.
- Workspace selection UX: authorized.
- Logout UX: authorized.
- Browser-safe session API integration (`credentials: 'include'`): authorized.
- Mobile/responsive auth experience: authorized.
- Production migration / email activation: NOT authorized.
- Google/Facebook/LINE Login: NOT authorized.
- PrismaMagicLinkStore: NOT authorized.
- WEB_API_DEV_TOKEN: NOT authorized for frontend.
- Production business API cutover: NOT authorized.

## Tasks

- [ ] AUTHE-001 Pre-flight read and backend contract audit
- [ ] AUTHE-002 Auth client
- [ ] AUTHE-003 Auth domain state
- [ ] AUTHE-004 AuthProvider
- [ ] AUTHE-005 Login screen
- [ ] AUTHE-006 Magic link request UX
- [ ] AUTHE-007 Callback / consume UX
- [ ] AUTHE-008 Session bootstrap
- [ ] AUTHE-009 Workspace selection
- [ ] AUTHE-010 Authenticated shell
- [ ] AUTHE-011 Route protection
- [ ] AUTHE-012 Logout
- [ ] AUTHE-013 API client workspace context
- [ ] AUTHE-014 Mock/Real boundary
- [ ] AUTHE-015 Responsive UX
- [ ] AUTHE-016 Accessibility
- [ ] AUTHE-017 Security audit
- [ ] AUTHE-018 Tests
- [ ] AUTHE-019 Backend compatibility check
- [ ] AUTHE-020 Production readiness boundary
- [ ] AUTHE-021 Create `docs/AUTH-PHASE-E-CONSOLIDATED-REPORT.md`
- [ ] AUTHE-022 Final validation: `npm run typecheck`, `npm run lint`, `npm run build`, tests
- [ ] AUTHE-023 Commit/push; queue active → completed; state final

## Stop Gate

`WAIT_FOR_FOUNDER_REVIEW` after Phase E completion.
