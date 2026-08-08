"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";

export default function WorkspacesPage() {
  const { state, selectWorkspace } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (state.kind !== "authenticated") return;
    if (state.workspaces.length === 0) {
      router.replace("/no-workspace");
    } else if (state.workspaces.length === 1) {
      selectWorkspace(state.workspaces[0].tenantId);
      router.replace("/");
    }
  }, [state, router, selectWorkspace]);

  const handleSelect = useCallback(
    (tenantId: string) => {
      selectWorkspace(tenantId);
      router.replace("/");
    },
    [selectWorkspace, router],
  );

  if (state.kind !== "authenticated") {
    return null;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>เลือกพื้นที่ทำงาน</CardTitle>
      </CardHeader>
      <CardBody>
        <p className="mb-4 text-gray-700">เลือกพื้นที่ทำงานที่ต้องการเข้าใช้งาน</p>
        <ul className="space-y-2">
          {state.workspaces.map((workspace) => (
            <li key={workspace.tenantId}>
              <Button
                onClick={() => handleSelect(workspace.tenantId)}
                variant="secondary"
                className="w-full justify-start"
              >
                <span className="font-medium">{workspace.tenantId}</span>
                <span className="ml-2 text-xs text-gray-500">({workspace.roleId})</span>
              </Button>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}
