# AIES Authority Reference — AI Omnichannel Sales OS Web

## Central Authority

- **Path:** `D:\AIES`
- **Role:** Central AIES engineering, governance, standards, architecture, and reusable authority repository.
- **Scope:** Cross-product frameworks, governance rules, shared patterns, and central knowledge.

## Product Authority

- **Path:** `D:\AIOmnichannelSalesOS-Web`
- **Role:** AI Omnichannel Sales OS SaaS Web UI product authority.
- **Scope:**
  - SaaS Web UI
  - Onboarding experience
  - Facebook Connections UI
  - Multi-page management UI
  - Connection diagnostics presentation
  - Dashboards
  - Responsive/mobile UX
  - Client-side interaction

## Backend Authority

- **Path:** `D:\AIOmnichannelSalesOS`
- **Role:** AI Omnichannel Sales OS backend/runtime authority.
- **Scope:**
  - Backend/API
  - Database
  - Tenant security authority
  - OAuth secrets
  - Meta tokens
  - Webhook business logic
  - Advertising persistence
  - Backend business rules

## Repository Boundaries

| Responsibility | Owner |
|----------------|-------|
| SaaS Web UI | `D:\AIOmnichannelSalesOS-Web` |
| Backend API / runtime | `D:\AIOmnichannelSalesOS` |
| Central AIES governance | `D:\AIES` |
| AIES Studio product | `D:\AIES-Studio` (unrelated) |

## Rules

1. This frontend must read applicable AIES central engineering rules before product development.
2. This frontend must not modify `D:\AIES` or `D:\AIOmnichannelSalesOS`.
3. This frontend must not store or process backend secrets.
4. All token material remains in the backend authority.
5. Tenant/Page configuration is backend-owned; the frontend displays only what the backend permits.
