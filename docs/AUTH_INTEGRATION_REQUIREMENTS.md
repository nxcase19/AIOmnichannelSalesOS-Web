# Frontend Authentication Integration Requirements

**Phase:** AUTH-ARCH-01  
**Repository:** `D:\AIOmnichannelSalesOS-Web`  
**AIES Authority:** `D:\AIES`  
**Status:** Blueprint / Requirements Only — No Implementation  
**Date:** 2026-08-08

---

## 1. Current State

- The frontend uses a typed `lib/api.ts` abstraction.
- `lib/config.ts` is currently `USE_MOCK = true`.
- `NEXT_PUBLIC_API_TOKEN` has been removed.
- `Authorization` headers are no longer sent.
- No login, session, or workspace selection UI exists yet.
- All data is rendered from `lib/fixtures.ts`.

---

## 2. Session Strategy

### 2.1 Transport

The frontend must rely on **HttpOnly cookies**, not browser-stored tokens.

```
Browser
  → POST /api/v1/auth/login
  ← Set-Cookie: session=<opaque-id>; HttpOnly; Secure; SameSite=Lax; Path=/
  → Subsequent API calls include cookie automatically
  ← Backend resolves session, user, workspace, and authorization
```

### 2.2 `fetch` configuration

All API calls in `lib/api.ts` must set:

```ts
fetch(url, {
  method: 'GET' | 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    'X-Workspace-Id': workspaceId, // if the user has selected a workspace
  },
});
```

No `Authorization` header. No `NEXT_PUBLIC_*` token.

### 2.3 Cookie attributes the backend must set

- `HttpOnly`
- `Secure` (production)
- `SameSite=Lax` or `Strict`
- `Path=/`
- `Max-Age` / `Expires`
- Domain scoped to the backend origin or same-site if frontend and backend are sibling subdomains.

---

## 3. Required Auth Screens

| Route | Purpose | State |
|-------|---------|-------|
| `/login` | Sign in with magic link or password | Not implemented |
| `/signup` | First-time account creation | Not implemented |
| `/onboarding/workspace` | Create the first workspace after signup | Not implemented |
| `/workspaces` | List and select a workspace | Not implemented |
| `/workspace/switch` | Switch active workspace | Not implemented |
| `/session-expired` | Show session timeout, prompt login | Not implemented |
| `/unauthorized` | Show permission denied | Not implemented |
| `/no-workspace` | User has no workspace memberships | Not implemented |
| `/invitations` | Accept a workspace invite (if applicable) | Not implemented |
| `/logout` | Clear session and redirect to `/login` | Not implemented |

---

## 4. Workspace Selection UX

### 4.1 Multi-workspace support

- After login, if the user has one workspace, enter it automatically.
- If the user has multiple workspaces, show `/workspaces`.
- The active workspace id is stored in the React app state (not `localStorage` for authority).
- Every API call includes `X-Workspace-Id` from app state.
- The backend verifies membership before any data access.

### 4.2 Workspace switcher

- A shell-level switcher in `AppShell`.
- On switch, set React state and refetch relevant data.
- The previous workspace data must be cleared from React state to prevent cross-workspace leakage.

---

## 5. API Client Changes (Future Implementation)

### 5.1 `lib/config.ts` (future)

```ts
export const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? '';
export const USE_MOCK = false; // once session auth is implemented
```

No `API_TOKEN`. No `NEXT_PUBLIC_*` secrets.

### 5.2 `lib/api.ts` (future)

```ts
async function apiCall<T>(path: string, method: 'GET' | 'POST' = 'GET', body?: unknown): Promise<T> {
  const url = `${API_BASE}${path}`;
  const init: RequestInit = {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  if (workspaceId) {
    init.headers['X-Workspace-Id'] = workspaceId;
  }
  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }
  const res = await fetch(url, init);
  if (!res.ok) {
    if (res.status === 401) {
      // redirect to /login
    }
    if (res.status === 403) {
      // redirect to /unauthorized or /workspaces
    }
    throw new Error(`API error ${res.status}`);
  }
  return res.json() as Promise<T>;
}
```

### 5.3 Auth-aware wrapper

Introduce an `AuthProvider`:

```tsx
<AuthProvider>
  <AppShell />
</AuthProvider>
```

- Holds `user`, `workspaces`, `activeWorkspaceId`.
- Provides `login`, `logout`, `switchWorkspace`.
- Fetches `/api/v1/auth/session` on app load.

---

## 6. CSRF and Security

### 6.1 Same-site API

The backend and frontend must be on the same site, or the backend must use `SameSite=None; Secure` with explicit trusted frontend origin.

Recommended:

- `app.example.com` (frontend)
- `api.example.com` (backend)
- Cookie `Domain=.example.com` and `SameSite=Lax`.

### 6.2 CSRF tokens

For V1 (read-only mostly), `SameSite=Lax` is sufficient.

For V1 state-changing endpoints (POST /api/v1/.../connections, etc.), add a **double-submit cookie** or a **synchronizer token** pattern:

- Backend sets `csrf-token` as a non-HttpOnly cookie.
- Frontend reads it and sends `X-CSRF-Token` header.
- Backend compares cookie value with header.

This prevents cross-origin POST/PUT/PATCH.

### 6.3 No token in browser storage

- No `localStorage.setItem('token')`.
- No `NEXT_PUBLIC_*` secrets.
- No `Authorization: Bearer` in the browser bundle.

---

## 7. Login Flow Options

### 7.1 Recommended V1: Email Magic Link

1. User enters email on `/login`.
2. Frontend `POST /api/v1/auth/magic-link { email }`.
3. Backend sends an email with a one-time login link.
4. User clicks the link. Backend verifies the token, creates a session, sets the cookie.
5. Frontend detects the cookie on the next API call.

### 7.2 Future: Google / Facebook / LINE Login

1. Frontend redirects to OAuth provider.
2. Provider returns authorization `code` to a backend callback (`/api/v1/auth/callback/:provider`).
3. Backend exchanges code, resolves `ExternalIdentity`, links to `CanonicalUser`.
4. Backend sets session cookie.
5. Frontend is authenticated on next request.

### 7.3 Facebook separation

- `facebook` as **identity provider** only proves the human owns a Facebook account.
- `facebook-pages` OAuth remains a workspace channel integration.
- The UI must keep these conceptually separate:
  - "Sign in with Facebook" = SaaS login.
  - "Connect Facebook Page" = workspace channel integration.

---

## 8. Session Handling

### 8.1 Initial load

On client hydration, the `AuthProvider` calls `GET /api/v1/auth/session`:

```ts
const session = await fetch(`${API_BASE}/api/v1/auth/session`, { credentials: 'include' });
```

- `200` → user is authenticated, receive `user` and `workspaces`.
- `401` → redirect to `/login`.

### 8.2 Expiry

- On `401` from any API call, redirect to `/session-expired`.
- On `403`, redirect to `/unauthorized` or `/workspaces`.

### 8.3 Logout

```ts
await fetch(`${API_BASE}/api/v1/auth/logout`, { method: 'POST', credentials: 'include' });
```

After logout, clear React state and redirect to `/login`.

---

## 9. Future LINE / LIFF Compatibility

- The web `AuthProvider` must remain conceptually compatible with LINE identity.
- LINE `userId` will become an `ExternalIdentity` on the same `CanonicalUser`.
- LIFF may use a short-lived token exchange pattern; the web `AuthProvider` does not need to handle this now.
- No LINE-specific UI in V1.

---

## 10. Integration with Backend Web API

### 10.1 Current `WebApiAuthGuard`

- `WebApiAuthGuard` uses `WEB_API_DEV_TOKEN`.
- It must be replaced before the frontend sends real API calls.

### 10.2 Future guard

A new guard must:

1. Read the `session` cookie.
2. Resolve `CanonicalUser` from the session store.
3. Resolve the requested workspace from `X-Workspace-Id` or path.
4. Verify `WorkspaceMembership`.
5. Build `TenantContext` and `AuthorizationContext`.
6. Reject if any step fails.

### 10.3 CORS

- `NEXT_PUBLIC_API_URL` remains the backend origin.
- The backend's `WEB_FRONTEND_ORIGIN` must be set to the deployed frontend domain.
- CORS credentials must be enabled.

---

## 11. Implementation Checklist (Not to be executed in AUTH-ARCH-01)

- [ ] Implement `/login`, `/signup`, `/workspaces`, `/session-expired`, `/unauthorized` routes.
- [ ] Implement `AuthProvider` and `useAuth()` hook.
- [ ] Update `lib/api.ts` to use `credentials: 'include'` and remove `Authorization` headers.
- [ ] Add `X-Workspace-Id` header to all workspace-scoped calls.
- [ ] Add error handling for `401` and `403`.
- [ ] Implement workspace switcher in `AppShell`.
- [ ] Update `.env.example` to remove `NEXT_PUBLIC_API_TOKEN` permanently (already done).
- [ ] Coordinate with backend implementation of session middleware and new guard.

---

## 12. Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Cookie not sent cross-origin | High | Keep backend/frontend same-site or use `SameSite=None; Secure` with custom domain |
| CSRF on POST endpoints | Medium | Implement double-submit cookie or synchronizer token |
| Session leakage in React state | Medium | Clear user/workspace state on logout and workspace switch |
| Token-in-bundle regression | High | Lint rule: no `NEXT_PUBLIC_*` token variables in `lib/api.ts` |

---

## 13. Founder Decisions Required

1. V1 login method (recommended: email magic link).
2. Custom domain plan (for cookie scoping).
3. Whether to support social login in V1 or defer.
4. CSRF token strategy for V1.
5. Approval to begin implementation of backend session middleware and frontend `AuthProvider`.
