"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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
  const [open, setOpen] = useState(false);

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
          <div className="text-sm text-gray-500">Admin user · Tenant 1</div>
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
