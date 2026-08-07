"use client";

export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { LinkButton } from "@/components/ui/button";
import { getBusinesses, getPagesForBusiness } from "@/lib/api";
import type { FacebookBusiness, FacebookPageOption } from "@/lib/types";

function PageContent() {
  const search = useSearchParams();
  const businessId = search.get("businessId") ?? "";
  const pageIdParam = search.get("pageIds") ?? "";
  const selectedIds = useMemo(() => pageIdParam.split(",").filter(Boolean), [pageIdParam]);

  const [business, setBusiness] = useState<FacebookBusiness | null>(null);
  const [pages, setPages] = useState<FacebookPageOption[]>([]);

  useEffect(() => {
    getBusinesses("t1").then((bs) => setBusiness(bs.find((b) => b.businessId === businessId) ?? null));
    getPagesForBusiness("t1", businessId).then((ps) => setPages(ps));
  }, [businessId]);

  const selected = pages.filter((p) => selectedIds.includes(p.pageId));
  const incomplete = [
    "ต้องรอการอนุมัติจาก backend ก่อนใช้งานจริง",
    "ตรวจสอบ webhook callback URL ในขั้นตอนถัดไป",
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">การเชื่อมต่อเสร็จสมบูรณ์</h1>

      <Card>
        <CardHeader>
          <CardTitle>ผลการเชื่อมต่อ</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="mb-4 flex items-center gap-2">
            <StatusBadge status="pending" label="บันทึกลง registry ในโหมด dry-run" />
          </div>

          <p className="mb-2"><span className="text-gray-500">Business:</span> {business?.name ?? businessId}</p>
          <p className="mb-4"><span className="text-gray-500">Page ที่เลือก:</span> {selected.length} หน้า</p>

          <ul className="mb-6 space-y-2">
            {selected.map((p) => (
              <li key={p.pageId} className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 p-2 text-sm">
                <span className="font-medium">{p.name}</span>
                <span className="text-xs text-gray-500">{p.pageId}</span>
              </li>
            ))}
          </ul>

          {incomplete.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-2 font-medium text-gray-900">รายการที่ยังไม่เสร็จ</h3>
              <ul className="list-inside list-disc text-sm text-gray-700">
                {incomplete.map((i) => <li key={i}>{i}</li>)}
              </ul>
            </div>
          )}

          <p className="mb-4 text-sm text-gray-600">การกระทำต่อไป: ตรวจสอบการเชื่อมต่อและเปิด webhook verification</p>

          <div className="flex flex-col gap-2 sm:flex-row">
            <LinkButton href="/facebook/pages" variant="primary">จัดการหน้า</LinkButton>
            <LinkButton href="/facebook/verify" variant="secondary">ตรวจสอบการเชื่อมต่อ</LinkButton>
            <LinkButton href="/facebook/connect" variant="ghost">เชื่อมต่อเพิ่ม</LinkButton>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default function ConnectStep5CompletePage() {
  return (
    <Suspense fallback={<p className="text-gray-500">กำลังโหลด...</p>}>
      <PageContent />
    </Suspense>
  );
}
