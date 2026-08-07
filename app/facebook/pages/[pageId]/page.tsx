"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button, LinkButton } from "@/components/ui/button";
import { getPageById } from "@/lib/api";
import type { FacebookPage } from "@/lib/types";

export default function PageDetailPage() {
  const { pageId } = useParams<{ pageId: string }>();
  const [page, setPage] = useState<FacebookPage | null>(null);
  const [capture, setCapture] = useState(false);

  useEffect(() => {
    getPageById("t1", pageId).then((p) => {
      if (p) setPage(p);
    });
  }, [pageId]);

  if (!page) {
    return <p className="text-gray-500">กำลังโหลด...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{page.name}</h1>
          <p className="text-sm text-gray-500">รายละเอียดหน้า · ID: {page.pageId}</p>
        </div>
        <LinkButton href="/facebook/pages" variant="secondary">กลับ</LinkButton>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>สถานะเชื่อมต่อ</CardTitle></CardHeader>
          <CardBody>
            <div className="space-y-2">
              <div className="flex items-center justify-between"><span>Connection</span><StatusBadge status={page.status} /></div>
              <div className="flex items-center justify-between"><span>Webhook</span><StatusBadge status={page.webhookStatus} /></div>
              <div className="flex items-center justify-between"><span>สิทธิ์</span><StatusBadge status={page.permissionStatus} /></div>
              <div className="flex items-center justify-between"><span>Capture</span><StatusBadge status={page.captureStatus} /></div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader><CardTitle>ข้อมูลล่าสุด</CardTitle></CardHeader>
          <CardBody>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-500">Business:</span> {page.businessName}</p>
              <p><span className="text-gray-500">เหตุการณ์ล่าสุด:</span> {page.lastEventAt ? new Date(page.lastEventAt).toLocaleString("th-TH") : "-"}</p>
              <p><span className="text-gray-500">ตรวจสอบล่าสุด:</span> {page.lastVerifiedAt ? new Date(page.lastVerifiedAt).toLocaleString("th-TH") : "-"}</p>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>สิทธิ์ที่ต้องใช้</CardTitle></CardHeader>
        <CardBody>
          <ul className="list-inside list-disc text-sm">
            {page.permissionDetails.length > 0 ? page.permissionDetails.map((d) => <li key={d}>{d}</li>) : <li className="text-gray-500">ไม่มียี่ห้อสิทธิ์</li>}
          </ul>
        </CardBody>
      </Card>

      <Card>
        <CardHeader><CardTitle>การจัดการ</CardTitle></CardHeader>
        <CardBody>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setCapture(!capture)} variant={capture ? "primary" : "secondary"}>
              {capture ? "เปิด Data Capture" : "สลับ Data Capture"}
            </Button>
            <Button onClick={() => {}} variant="secondary">ตรวจสอบใหม่</Button>
            <Button onClick={() => {}} variant="ghost">ยกเลิกการเชื่อมต่อ</Button>
          </div>
          <p className="mt-2 text-xs text-gray-500">การกระทำจริงจังส่งต่อไปยัง backend ต้องได้รับอนุมัติ</p>
        </CardBody>
      </Card>
    </div>
  );
}
