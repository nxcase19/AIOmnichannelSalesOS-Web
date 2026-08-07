"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { LinkButton } from "@/components/ui/button";
import { getDashboard } from "@/lib/api";
import type { DashboardModel } from "@/lib/types";

export default function HomePage() {
  const [model, setModel] = useState<DashboardModel | null>(null);

  useEffect(() => {
    getDashboard("t1").then(setModel);
  }, []);

  if (!model) {
    return <p className="text-gray-500">กำลังโหลดข้อมูล...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">ภาพรวมความพร้อม</h1>
        <StatusBadge status={model.overallStatus} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>หน้าทั้งหมด</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="text-3xl font-bold text-gray-900">{model.totalPages}</div>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>เชื่อมต่อแล้ว</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="text-3xl font-bold text-gray-900">{model.connectedPages}</div>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>เหตุการณ์ล่าสุด</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="text-3xl font-bold text-gray-900">{model.recentEvents}</div>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>สถานะ</CardTitle>
          </CardHeader>
          <CardBody>
            <StatusBadge status={model.overallStatus} />
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ระบบพร้อมหรือไม่?</CardTitle>
        </CardHeader>
        <CardBody>
          <p className="mb-2 text-lg">{model.readinessAnswer}</p>
          <p className="text-gray-600">{model.nextAction}</p>
          <div className="mt-4">
            <LinkButton href="/facebook" variant="primary">
              ดู Facebook Connections
            </LinkButton>
          </div>
        </CardBody>
      </Card>

      {model.pendingActions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>การดำเนินการที่ค้าง</CardTitle>
          </CardHeader>
          <CardBody>
            <ul className="list-inside list-disc space-y-1">
              {model.pendingActions.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
