"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { getDiagnostics } from "@/lib/api";
import type { Diagnostics } from "@/lib/types";

export default function VerificationPage() {
  const [model, setModel] = useState<Diagnostics | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    getDiagnostics("t1").then(setModel);
  }, []);

  if (!model) {
    return <p className="text-gray-500">กำลังโหลด...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">ตรวจสอบการเชื่อมต่อ</h1>
        <StatusBadge status={model.overallStatus} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>สถานะโดยรวม</CardTitle>
        </CardHeader>
        <CardBody>
          <p className="text-gray-700">
            {model.overallStatus === "ready" && "ระบบพร้อมสำหรับการทดลอง"}
            {model.overallStatus === "warning" && "บางส่วนยังต้องตรวจสอบ แต่ยังสามารถใช้งานได้"}
            {model.overallStatus === "error" && "มีข้อผิดพลาดทีต้องแก้ไขก่อนเริ่มใช้งาน"}
          </p>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {model.categories.map((c) => (
          <Card key={c.name}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{c.name}</CardTitle>
                <StatusBadge status={c.status} />
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-gray-700">{c.message}</p>
              {c.detail && showAdvanced && <p className="mt-2 text-sm text-gray-500">{c.detail}</p>}
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={() => setShowAdvanced(!showAdvanced)} variant="secondary">
          {showAdvanced ? "ซ่อนรายละเอียด" : "ดูรายละเอียด"}
        </Button>
      </div>
    </div>
  );
}
