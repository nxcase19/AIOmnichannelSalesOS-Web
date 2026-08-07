"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { LinkButton } from "@/components/ui/button";
import { getTenantPages } from "@/lib/api";
import type { FacebookPage } from "@/lib/types";

export default function TenantConnectionsPage() {
  const [pages, setPages] = useState<FacebookPage[]>([]);

  useEffect(() => {
    getTenantPages("t1").then(setPages);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Facebook Connections</h1>
        <LinkButton href="/facebook/connect">+ เชื่อมต่อ</LinkButton>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tenant: t1</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 text-gray-600">
                <tr>
                  <th className="py-2 pr-4">หน้า</th>
                  <th className="py-2 pr-4">Business</th>
                  <th className="py-2 pr-4">สถานะ</th>
                  <th className="py-2 pr-4">Webhook</th>
                  <th className="py-2 pr-4">Capture</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {pages.map((p) => (
                  <tr key={p.pageId} className="border-b border-gray-100 last:border-0">
                    <td className="py-3 pr-4 font-medium">{p.name}</td>
                    <td className="py-3 pr-4">{p.businessName}</td>
                    <td className="py-3 pr-4"><StatusBadge status={p.status} /></td>
                    <td className="py-3 pr-4"><StatusBadge status={p.webhookStatus} /></td>
                    <td className="py-3 pr-4"><StatusBadge status={p.captureStatus} /></td>
                    <td className="py-3">
                      <LinkButton href={`/facebook/pages/${p.pageId}`} variant="ghost" className="!px-2 !py-1 text-xs">
                        จัดการ
                      </LinkButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
