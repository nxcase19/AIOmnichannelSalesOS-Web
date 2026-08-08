"use client";

import { LinkButton } from "@/components/ui/button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";

export default function SessionExpiredPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>เซสชันหมดอายุ</CardTitle>
      </CardHeader>
      <CardBody>
        <p className="mb-4 text-gray-700">เซสชันของคุณหมดอายุแล้ว กรุณาเข้าสู่ระบบใหม่</p>
        <LinkButton href="/login" variant="primary">
          เข้าสู่ระบบ
        </LinkButton>
      </CardBody>
    </Card>
  );
}
