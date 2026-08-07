"use client";

export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, LinkButton } from "@/components/ui/button";
import { getPagesForBusiness } from "@/lib/api";
import type { FacebookPageOption } from "@/lib/types";

function PageContent() {
  const search = useSearchParams();
  const businessId = search.get("businessId") ?? "";
  const [pages, setPages] = useState<FacebookPageOption[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (businessId) {
      getPagesForBusiness("t1", businessId).then(setPages);
    }
  }, [businessId]);

  const filtered = useMemo(() => {
    return pages.filter((p) => {
      const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase()) || p.pageId.includes(query);
      const matchesFilter = true;
      return matchesQuery && matchesFilter;
    });
  }, [pages, query]);

  const allSelected = filtered.length > 0 && filtered.every((p) => selected.has(p.pageId));

  function toggleAll() {
    const next = new Set(selected);
    if (allSelected) {
      filtered.forEach((p) => next.delete(p.pageId));
    } else {
      filtered.forEach((p) => next.add(p.pageId));
    }
    setSelected(next);
  }

  function toggle(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  }

  const pageIds = Array.from(selected).join(",");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">เลือกหน้า Facebook</h1>

      <Card>
        <CardHeader>
          <CardTitle>เลือก Page สำหรับ Business {businessId}</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <input
              type="text"
              placeholder="ค้นหาหน้า..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm sm:w-64"
              aria-label="ค้นหาหน้า"
            />
            <Button onClick={toggleAll} variant="secondary" className="text-sm">
              {allSelected ? "ยกเลิกเลือกทั้งหมด" : "เลือกทั้งหมด"}
            </Button>
          </div>

          <p className="mb-2 text-sm text-gray-600">เลือก {selected.size} จาก {pages.length} หน้า</p>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {filtered.map((p) => (
              <label
                key={p.pageId}
                className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 transition hover:bg-gray-50 ${selected.has(p.pageId) ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
              >
                <input
                  type="checkbox"
                  checked={selected.has(p.pageId)}
                  onChange={() => toggle(p.pageId)}
                  className="h-4 w-4"
                  aria-label={p.name}
                />
                <span className="font-medium">{p.name}</span>
                <span className="ml-auto text-xs text-gray-500">{p.pageId}</span>
              </label>
            ))}
            {filtered.length === 0 && <p className="text-gray-500">ไม่พบหน้า</p>}
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-between">
            <LinkButton href={`/facebook/connect/business`} variant="ghost">กลับ</LinkButton>
            <LinkButton
              href={`/facebook/connect/review?businessId=${encodeURIComponent(businessId)}&pageIds=${encodeURIComponent(pageIds)}`}
              variant={selected.size > 0 ? "primary" : "secondary"}
              className={selected.size === 0 ? "pointer-events-none opacity-50" : ""}
            >
              ต่อไป · {selected.size} หน้า
            </LinkButton>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default function ConnectStep3PagesPage() {
  return (
    <Suspense fallback={<p className="text-gray-500">กำลังโหลด...</p>}>
      <PageContent />
    </Suspense>
  );
}
