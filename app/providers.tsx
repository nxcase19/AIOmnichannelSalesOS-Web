"use client";

import { AuthProvider } from "@/lib/auth-context";
import { AppShell } from "@/components/shell/app-shell";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppShell>{children}</AppShell>
    </AuthProvider>
  );
}
