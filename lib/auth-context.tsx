"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import * as authClient from "./auth-client";
import type { AuthUser, Workspace, MagicLinkConsumeResult } from "./auth-client";

export type AuthStatus =
  | { kind: "loading" }
  | { kind: "unauthenticated" }
  | {
      kind: "authenticated";
      user: AuthUser;
      workspaces: Workspace[];
      selectedWorkspaceId: string | undefined;
    };

type AuthContextValue = {
  state: AuthStatus;
  refreshSession: () => Promise<void>;
  consumeMagicLink: (token: string) => Promise<MagicLinkConsumeResult>;
  selectWorkspace: (tenantId: string) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthStatus>({ kind: "loading" });

  const refreshSession = useCallback(async () => {
    try {
      const session = await authClient.getSession();
      if (!session || session.authenticated === false) {
        setState({ kind: "unauthenticated" });
        return;
      }

      const { user, workspaces } = session;
      setState({
        kind: "authenticated",
        user,
        workspaces,
        selectedWorkspaceId: workspaces.length === 1 ? workspaces[0].tenantId : undefined,
      });
    } catch {
      setState({ kind: "unauthenticated" });
    }
  }, []);

  const consumeMagicLink = useCallback(async (token: string) => {
    const result = await authClient.consumeMagicLink(token);
    // After cookie is set, refresh session to load user and workspaces.
    await refreshSession();
    return result;
  }, [refreshSession]);

  const selectWorkspace = useCallback((tenantId: string) => {
    setState((prev) => {
      if (prev.kind !== "authenticated") return prev;
      if (!prev.workspaces.some((w) => w.tenantId === tenantId)) return prev;
      return { ...prev, selectedWorkspaceId: tenantId };
    });
  }, []);

  const logout = useCallback(async () => {
    try {
      await authClient.logout();
    } finally {
      setState({ kind: "unauthenticated" });
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const value = useMemo(
    () => ({ state, refreshSession, consumeMagicLink, selectWorkspace, logout }),
    [state, refreshSession, consumeMagicLink, selectWorkspace, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return value;
}
