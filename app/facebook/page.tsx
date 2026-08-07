"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { getTenantSummary, getTenantPages } from "@/lib/api";
import type { FacebookPage, TenantSummary } from "@/lib/types";

export default function FacebookOverviewPage() {
  const [summary, setSummary] = useState<TenantSummary | null>(null);
  const [pages, setPages] = useState<FacebookPage[]>([]);

  useEffect(() => {
    getTenantSummary("t1").then(setSummary);
    getTenantPages("t1").then(setPages);
  }, []);

  if (!summary) {
    return <p className="text-gray-500">กำลังโหลด...</p>;
  }

  const recent = pages
    .filter((p) => p.lastEventAt !== null)
    .sort((a, b) => (b.lastEventAt ?? 0) - (a.lastEventAt ?? 0))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Facebook Overview</h1>
          <p className="text-sm text-gray-500">ภาพรวมการเชื่อมต่อ Facebook</p>
        </div>
        <LinkButton href="/facebook/connect">+ เชื่อมต่อ Facebook</LinkButton>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader><CardTitle>หน้าทั้งหมด</CardTitle></CardHeader>
          <CardBody><div className="text-3xl font-bold">{summary.totalPages}</div></CardBody>
        </Card>
        <Card>
          <CardHeader><CardTitle>เชื่อมต่อแล้ว</CardTitle></CardHeader>
          <CardBody><div className="text-3xl font-bold">{summary.connectedPages}</div></CardBody>
        </Card>
        <Card>
          <CardHeader><CardTitle>Active Capture</CardTitle></CardHeader>
          <CardBody><div className="text-3xl font-bold">{summary.activeCapture}</div></CardBody>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recent Events</CardTitle></CardHeader>
          <CardBody><div className="text-3xl font-bold">{summary.recentEvents}</div></CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>เหตุการณ์ล่าสุด</CardTitle>
        </CardHeader>
        <CardBody>
          {recent.length === 0 ? (
            <p className="text-gray-500">ยังไม่มียี่ห้อเหตุการณ์</p>
          ) : (
            <ul className="space-y-2">
              {recent.map((p) => (
                <li key={p.pageId} className="flex items-center justify-between border-b border-gray-100 py-2 last:border-0">
                  <span>{p.name}</span>
                  <span className="text-sm text-gray-500">
                    {p.lastEventAt ? new Date(p.lastEventAt).toLocaleString("th-TH") : "-"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
