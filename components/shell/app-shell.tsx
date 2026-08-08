"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

const publicPaths = new Set(["/login", "/auth/magic-link", "/no-workspace", "/session-expired", "/unauthorized"]);

function isPublicPath(pathname: string): boolean {
  return publicPaths.has(pathname) || pathname.startsWith("/_next");
}

const nav = [
  { href: "/", label: "หน้าแรก" },
  { href: "/facebook", label: "Facebook Overview" },
  { href: "/facebook/tenants", label: "Connections" },
  { href: "/facebook/pages", label: "Page Management" },
  { href: "/facebook/verify", label: "Verification" },
  { href: "/facebook/connect", label: "Connect Facebook" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { state, logout } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (state.kind === "unauthenticated" && !isPublicPath(pathname)) {
      router.replace("/login");
      return;
    }

    if (state.kind === "authenticated") {
      if (pathname === "/login" || pathname === "/auth/magic-link") {
        if (state.selectedWorkspaceId) {
          router.replace("/");
        } else if (state.workspaces.length === 0) {
          router.replace("/no-workspace");
        } else {
          router.replace("/workspaces");
        }
      }
    }
  }, [state, pathname, router]);

  if (state.kind === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">กำลังโหลด...</p>
      </div>
    );
  }

  if (state.kind === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="flex min-h-screen items-center justify-center p-4">{children}</main>
      </div>
    );
  }

  const selectedLabel =
    state.selectedWorkspaceId
      ? `พื้นที่ทำงาน: ${state.selectedWorkspaceId}`
      : "เลือกพื้นที่ทำงาน";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button
              className="rounded p-2 text-gray-600 hover:bg-gray-100 md:hidden"
              onClick={() => setOpen(!open)}
              aria-label={open ? "ปิดเมนู" : "เปิดเมนู"}
            >
              {open ? "✕" : "☰"}
            </button>
            <Link href="/" className="font-semibold text-gray-900">
              AI Omnichannel Sales OS
            </Link>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="hidden sm:inline">{state.user.email ?? state.user.id}</span>
            <span className="hidden text-gray-300 md:inline">|</span>
            <Link href="/workspaces" className="hidden text-blue-600 hover:underline md:inline">
              {selectedLabel}
            </Link>
            <Button variant="ghost" onClick={logout} className="text-red-600">
              ออกจากระบบ
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col md:flex-row">
        <aside
          className={`${open ? "block" : "hidden"} w-full border-b border-gray-200 bg-white px-4 py-3 md:block md:w-60 md:border-b-0 md:border-r md:min-h-[calc(100vh-3.5rem)]`}
        >
          <nav className="space-y-1">
            {nav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-md px-3 py-2 text-sm font-medium ${active ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-4 md:p-6">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
