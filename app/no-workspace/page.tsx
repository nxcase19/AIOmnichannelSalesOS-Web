"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";

export default function NoWorkspacePage() {
  const { state, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (state.kind === "unauthenticated") {
      router.replace("/login");
    }
  }, [state, router]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>ยังไม่มีพื้นที่ทำงาน</CardTitle>
      </CardHeader>
      <CardBody>
        <p className="mb-4 text-gray-700">
          บัญชีของคุณยังไม่มีพื้นที่ทำงาน กรุณาติดต่อผู้ดูแลระบบ
        </p>
        <button
          onClick={logout}
          className="text-sm text-red-600 hover:underline"
          type="button"
        >
          ออกจากระบบ
        </button>
      </CardBody>
    </Card>
  );
}
