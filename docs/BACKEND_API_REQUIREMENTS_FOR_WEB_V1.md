# Backend API Requirements for Web V1

**Repository:** `D:\AIOmnichannelSalesOS-Web`  
**Backend Authority:** `D:\AIOmnichannelSalesOS`  
**Date:** 2026-08-08

---

## Scope

This document lists the JSON API contracts required by the WEB-PHASE-01 frontend. The frontend currently uses typed mock adapters (`lib/api.ts`, `lib/fixtures.ts`). These contracts must be implemented in the backend authority before production integration.

---

## Authentication & Security

- All endpoints require an authenticated principal.
- Tokens are **NEVER** exposed to the frontend.
- The frontend sends the tenant context via a secure header or cookie provided by the backend.
- CORS must allow the frontend origin only.

---

## Contracts

### 1. Facebook Connections Overview

| | |
|---|---|
| **Purpose** | Summary of Facebook pages, connected pages, active capture, and recent events. |
| **Method** | `GET` |
| **Path** | `/api/v1/tenants/{tenantId}/facebook/summary` |
| **Auth** | Authenticated tenant user |
| **Tenant scope** | `tenantId` in path or context |
| **Permission** | `facebook:read` |
| **Request** | — |
| **Response** | `TenantSummary` |

```ts
interface TenantSummary {
  tenantId: string;
  totalPages: number;
  connectedPages: number;
  activeCapture: number;
  recentEvents: number;
  overallStatus: "ready" | "warning" | "error";
}
```

---

### 2. Business Selection

| | |
|---|---|
| **Purpose** | List Facebook Business assets available to the tenant. |
| **Method** | `GET` |
| **Path** | `/api/v1/tenants/{tenantId}/facebook/businesses` |
| **Auth** | Authenticated tenant user |
| **Tenant scope** | `tenantId` |
| **Permission** | `facebook:read` |
| **Response** | `FacebookBusiness[]` |

```ts
interface FacebookBusiness {
  businessId: string;
  name: string;
}
```

---

### 3. Multi-Page Selection

| | |
|---|---|
| **Purpose** | List Facebook Pages for a selected business. |
| **Method** | `GET` |
| **Path** | `/api/v1/tenants/{tenantId}/facebook/businesses/{businessId}/pages` |
| **Auth** | Authenticated tenant user |
| **Tenant scope** | `tenantId` + `businessId` |
| **Permission** | `facebook:read` |
| **Response** | `FacebookPageOption[]` |

```ts
interface FacebookPageOption {
  pageId: string;
  name: string;
}
```

---

### 4. Permission Review

| | |
|---|---|
| **Purpose** | Return permission scope for selected pages. |
| **Method** | `POST` |
| **Path** | `/api/v1/tenants/{tenantId}/facebook/connections/review` |
| **Auth** | Authenticated tenant user |
| **Tenant scope** | `tenantId` |
| **Permission** | `facebook:write` |
| **Request body** | `{ businessId: string; pageIds: string[] }` |
| **Response** | `{ business: FacebookBusiness; pages: { pageId: string; name: string; permissions: string[] }[] }` |

---

### 5. Connection Completion

| | |
|---|---|
| **Purpose** | Persist selected pages to tenant registry in dry-run/approved mode. |
| **Method** | `POST` |
| **Path** | `/api/v1/tenants/{tenantId}/facebook/connections` |
| **Auth** | Authenticated tenant user + Operator/Founder approval |
| **Tenant scope** | `tenantId` |
| **Permission** | `facebook:write` |
| **Request body** | `{ businessId: string; pageIds: string[] }` |
| **Response** | `{ tenantId: string; businessId: string; connectedPages: number; pageIds: string[] }` |

---

### 6. Page Management / Page Detail

#### 6.1 List Pages

| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/api/v1/tenants/{tenantId}/facebook/pages` |
| **Auth** | Authenticated tenant user |
| **Response** | `FacebookPage[]` |

#### 6.2 Get Page

| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/api/v1/tenants/{tenantId}/facebook/pages/{pageId}` |
| **Auth** | Authenticated tenant user |
| **Response** | `FacebookPage` |

#### 6.3 Enable/Disable Page

| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/api/v1/tenants/{tenantId}/facebook/pages/{pageId}/enable`<br>`/disable` |
| **Auth** | Authenticated tenant user |
| **Permission** | `facebook:write` |
| **Response** | `FacebookPage` |

```ts
interface FacebookPage {
  tenantId: string;
  pageId: string;
  name: string;
  businessId: string;
  businessName: string;
  status: "connected" | "pending" | "warning" | "error" | "disabled" | "not_configured";
  webhookStatus: "verified" | "pending" | "error" | "not_configured";
  captureStatus: "enabled" | "disabled";
  lastEventAt: number | null;
  lastVerifiedAt: number | null;
  permissionStatus: "ok" | "missing" | "pending";
  permissionDetails: string[];
}
```

---

### 7. Verification & Diagnostics

| | |
|---|---|
| **Purpose** | Health/diagnostics for tenant Facebook setup. |
| **Method** | `GET` |
| **Path** | `/api/v1/tenants/{tenantId}/facebook/diagnostics` |
| **Auth** | Authenticated tenant user |
| **Tenant scope** | `tenantId` |
| **Permission** | `facebook:read` |
| **Response** | `Diagnostics` |

```ts
interface Diagnostics {
  overallStatus: "ready" | "warning" | "error";
  categories: {
    name: string;
    status: "ready" | "warning" | "error";
    message: string;
    detail?: string;
  }[];
}
```

---

### 8. SaaS Home / Readiness Dashboard

| | |
|---|---|
| **Purpose** | Readiness summary for the SaaS home. |
| **Method** | `GET` |
| **Path** | `/api/v1/tenants/{tenantId}/dashboard/readiness` |
| **Auth** | Authenticated tenant user |
| **Response** | `DashboardModel` |

```ts
interface DashboardModel {
  overallStatus: "ready" | "warning" | "error";
  connectedPages: number;
  totalPages: number;
  recentEvents: number;
  pendingActions: string[];
  readinessAnswer: string;
  nextAction: string;
}
```

---

## Secret Boundary

- **Never exposed:** Meta App Secret, Page Access Tokens, raw OAuth tokens, `DATABASE_URL`, `APPROVAL_TOKEN`.
- **Frontend receives only:** page names, statuses, permission labels, safe metrics, and prepared messages.
