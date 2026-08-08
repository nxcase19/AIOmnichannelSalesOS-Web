"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

type ConsumeState = "verifying" | "success" | "expired" | "invalid" | "error";

export default function MagicLinkCallbackPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { consumeMagicLink, state } = useAuth();
  const [consumeState, setConsumeState] = useState<ConsumeState>("verifying");

  const handleConsume = useCallback(async () => {
    if (!token || token.length < 32) {
      setConsumeState("invalid");
      return;
    }

    try {
      await consumeMagicLink(token);
      setConsumeState("success");
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (message.includes("expired")) {
        setConsumeState("expired");
      } else if (message.includes("invalid")) {
        setConsumeState("invalid");
      } else {
        setConsumeState("error");
      }
    }
  }, [token, consumeMagicLink]);

  useEffect(() => {
    handleConsume();
  }, [handleConsume]);

  if (state.kind === "authenticated") {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>เข้าสู่ระบบสำเร็จ</CardTitle>
        </CardHeader>
        <CardBody>
          <p className="text-gray-700">กำลังพาคุณไปยังหน้าหลัก...</p>
        </CardBody>
      </Card>
    );
  }

  if (consumeState === "verifying") {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>กำลังตรวจสอบลิงก์...</CardTitle>
        </CardHeader>
        <CardBody>
          <p className="text-gray-600">กรุณารอสักครู่ ระบบกำลังยืนยันลิงก์เข้าสู่ระบบของคุณ</p>
        </CardBody>
      </Card>
    );
  }

  if (consumeState === "success") {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>เข้าสู่ระบบสำเร็จ</CardTitle>
        </CardHeader>
        <CardBody>
          <p className="text-gray-700">กำลังพาคุณไปยังหน้าหลัก...</p>
        </CardBody>
      </Card>
    );
  }

  if (consumeState === "expired") {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>ลิงก์หมดอายุแล้ว</CardTitle>
        </CardHeader>
        <CardBody>
          <p className="mb-4 text-gray-700">ลิงก์นี้หมดอายุแล้ว กรุณาขอลิงก์ใหม่</p>
          <LinkButton href="/login" variant="primary">
            ขอลิงก์ใหม่
          </LinkButton>
        </CardBody>
      </Card>
    );
  }

  if (consumeState === "invalid") {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>ลิงก์ไม่ถูกต้อง</CardTitle>
        </CardHeader>
        <CardBody>
          <p className="mb-4 text-gray-700">
            ลิงก์นี้ไม่ถูกต้อง หรืออาจถูกใช้ไปแล้ว กรุณาขอลิงก์ใหม่
          </p>
          <LinkButton href="/login" variant="primary">
            ขอลิงก์ใหม่
          </LinkButton>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>ไม่สามารถเข้าสู่ระบบได้</CardTitle>
      </CardHeader>
      <CardBody>
        <p className="mb-4 text-gray-700">
          เกิดข้อผิดพลาดขณะเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง
        </p>
        <Button onClick={handleConsume} variant="primary">
          ลองอีกครั้ง
        </Button>
      </CardBody>
    </Card>
  );
}
