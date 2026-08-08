import { API_BASE } from "./config";

export type AuthUser = {
  readonly id: string;
  readonly displayName: string | undefined;
  readonly email: string | undefined;
};

export type Workspace = {
  readonly tenantId: string;
  readonly roleId: string;
};

export type Session = {
  readonly authenticated: true;
  readonly principalId: string;
  readonly user: AuthUser;
  readonly workspaces: Workspace[];
};

export type SessionResult = Session | { authenticated: false };

export type MagicLinkConsumeResult = {
  readonly principalId: string;
  readonly workspaces: Workspace[];
};

async function authFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const url = `${API_BASE}${path}`;
  const response = await fetch(url, {
    ...init,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...init.headers,
    },
  });
  return response;
}

export async function requestMagicLink(email: string): Promise<void> {
  const response = await authFetch("/api/v1/auth/magic-link/request", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email.trim() }),
  });

  if (!response.ok) {
    throw new Error(`Magic link request failed: ${response.status}`);
  }
}

export async function consumeMagicLink(
  token: string,
): Promise<MagicLinkConsumeResult> {
  const encoded = encodeURIComponent(token);
  const response = await authFetch(`/api/v1/auth/magic-link/consume?token=${encoded}`);

  if (!response.ok) {
    throw new Error(`Magic link is invalid or expired`);
  }

  return (await response.json()) as MagicLinkConsumeResult;
}

export async function getSession(): Promise<SessionResult | null> {
  const response = await authFetch("/api/v1/auth/session");

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Session check failed: ${response.status}`);
  }

  return (await response.json()) as SessionResult;
}

export async function logout(): Promise<void> {
  const response = await authFetch("/api/v1/auth/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  if (!response.ok && response.status !== 204) {
    throw new Error(`Logout failed: ${response.status}`);
  }
}
