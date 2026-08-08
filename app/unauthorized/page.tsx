"use client";

import { LinkButton } from "@/components/ui/button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";

export default function UnauthorizedPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>ไม่อนุญาต</CardTitle>
      </CardHeader>
      <CardBody>
        <p className="mb-4 text-gray-700">
          คุณไม่มีสิทธิ์เข้าถึงส่วนนี้ กรุณาเลือกพื้นที่ทำงานที่ถูกต้อง
        </p>
        <div className="flex flex-col gap-2">
          <LinkButton href="/workspaces" variant="primary">
            เลือกพื้นที่ทำงาน
          </LinkButton>
          <LinkButton href="/" variant="ghost">
            กลับหน้าหลัก
          </LinkButton>
        </div>
      </CardBody>
    </Card>
  );
}
