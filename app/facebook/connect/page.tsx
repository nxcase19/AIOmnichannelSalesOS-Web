"use client";

import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";

export default function ConnectStep1Page() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">เชื่อมต่อ Facebook</h1>

      <div className="mx-auto max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>ขั้นตอนที่ 1: เข้าสู่ระบบ Facebook</CardTitle>
          </CardHeader>
          <CardBody>
            <p className="mb-4 text-sm text-gray-700">
              ระบบจะนำทางคุณไปยัง Facebook เพื่อเลือก Business และ Page ที่ต้องการเชื่อมต่อ
              โดยไม่ต้องกรอก secret หรือ token ด้วยตนเอง
            </p>
            <div className="flex justify-center">
              <LinkButton href="/facebook/connect/business" className="w-full sm:w-auto">
                เชื่อมต่อ Facebook
              </LinkButton>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
