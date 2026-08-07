"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { LinkButton } from "@/components/ui/button";
import { getTenantPages } from "@/lib/api";
import type { FacebookPage } from "@/lib/types";

export default function PageManagementPage() {
  const [pages, setPages] = useState<FacebookPage[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    getTenantPages("t1").then(setPages);
  }, []);

  const filtered = useMemo(() => {
    return pages.filter((p) => {
      const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase()) || p.pageId.includes(query);
      const matchesFilter = filter === "all" ? true : p.status === filter;
      return matchesQuery && matchesFilter;
    });
  }, [pages, query, filter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Page Management</h1>
        <LinkButton href="/facebook/connect">+ เพิ่มหน้า</LinkButton>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>รายการหน้า</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="ค้นหาหน้า..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm sm:w-64"
              aria-label="ค้นหาหน้า"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              aria-label="กรองตามสถานะ"
            >
              <option value="all">ทั้งหมด</option>
              <option value="connected">เชื่อมต่อแล้ว</option>
              <option value="pending">รอดำเนินการ</option>
              <option value="warning">คำเตือน</option>
              <option value="error">ผิดพลาด</option>
              <option value="disabled">ปิดใช้งาน</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 text-gray-600">
                <tr>
                  <th className="py-2 pr-4">หน้า</th>
                  <th className="py-2 pr-4">Business</th>
                  <th className="py-2 pr-4">เชื่อมต่อ</th>
                  <th className="py-2 pr-4">Webhook</th>
                  <th className="py-2 pr-4">Capture</th>
                  <th className="py-2 pr-4">เหตุการณ์ล่าสุด</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.pageId} className="border-b border-gray-100 last:border-0">
                    <td className="py-3 pr-4 font-medium">{p.name}</td>
                    <td className="py-3 pr-4">{p.businessName}</td>
                    <td className="py-3 pr-4"><StatusBadge status={p.status} /></td>
                    <td className="py-3 pr-4"><StatusBadge status={p.webhookStatus} /></td>
                    <td className="py-3 pr-4"><StatusBadge status={p.captureStatus} /></td>
                    <td className="py-3 pr-4 text-gray-500">
                      {p.lastEventAt ? new Date(p.lastEventAt).toLocaleString("th-TH") : "-"}
                    </td>
                    <td className="py-3">
                      <LinkButton href={`/facebook/pages/${p.pageId}`} variant="ghost" className="!px-2 !py-1 text-xs">
                        ดู
                      </LinkButton>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-4 text-center text-gray-500">
                      ไม่พบหน้าที่ตรงกัน
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
