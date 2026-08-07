"use client";

export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { reviewConnection } from "@/lib/api";
import type { ConnectionReview } from "@/lib/types";

function PageContent() {
  const search = useSearchParams();
  const businessId = search.get("businessId") ?? "";
  const pageIdParam = search.get("pageIds") ?? "";
  const selectedIds = useMemo(() => pageIdParam.split(",").filter(Boolean), [pageIdParam]);

  const [review, setReview] = useState<ConnectionReview | null>(null);

  useEffect(() => {
    if (businessId && selectedIds.length > 0) {
      reviewConnection("t1", businessId, selectedIds).then(setReview);
    }
  }, [businessId, selectedIds]);

  if (!review) {
    return <p className="text-gray-500">กำลังโหลด...</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">ตรวจสอบสิทธิ์</h1>

      <Card>
        <CardHeader>
          <CardTitle>สรุปการเชื่อมต่อ</CardTitle>
        </CardHeader>
        <CardBody>
          <p className="mb-2"><span className="text-gray-500">Business:</span> {review.businessName}</p>
          <p className="mb-4"><span className="text-gray-500">Page ที่เลือก:</span> {review.pages.length} หน้า</p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 text-gray-600">
                <tr>
                  <th className="py-2 pr-4">Page</th>
                  <th className="py-2 pr-4">สิทธิ์ที่ขอ</th>
                </tr>
              </thead>
              <tbody>
                {review.pages.map((p) => (
                  <tr key={p.pageId} className="border-b border-gray-100 last:border-0">
                    <td className="py-2 pr-4 font-medium">{p.name}</td>
                    <td className="py-2 pr-4 text-gray-600">{p.permissions.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
            ไม่มี token หรือ secret ปรากฏหน้าจอนี้ ข้อมูลการอนุมัติจะจัดการฝั่ง backend
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-between">
            <LinkButton href={`/facebook/connect/pages?businessId=${encodeURIComponent(businessId)}&pageIds=${encodeURIComponent(pageIdParam)}`} variant="ghost">
              กลับ
            </LinkButton>
            <LinkButton
              href={`/facebook/connect/complete?businessId=${encodeURIComponent(businessId)}&pageIds=${encodeURIComponent(pageIdParam)}`}
              variant="primary"
            >
              ยืนยันการเชื่อมต่อ
            </LinkButton>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default function ConnectStep4ReviewPage() {
  return (
    <Suspense fallback={<p className="text-gray-500">กำลังโหลด...</p>}>
      <PageContent />
    </Suspense>
  );
}
