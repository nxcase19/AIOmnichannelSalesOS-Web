"use client";

import type { ConnectionStatus, WebhookStatus, CaptureStatus, PermissionStatus, OverallStatus } from "@/lib/types";

type AnyStatus = ConnectionStatus | WebhookStatus | CaptureStatus | PermissionStatus | OverallStatus;

const styles: Record<string, string> = {
  connected: "bg-green-100 text-green-800 border-green-200",
  verified: "bg-green-100 text-green-800 border-green-200",
  ready: "bg-green-100 text-green-800 border-green-200",
  ok: "bg-green-100 text-green-800 border-green-200",
  enabled: "bg-blue-100 text-blue-800 border-blue-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  warning: "bg-amber-100 text-amber-800 border-amber-200",
  error: "bg-red-100 text-red-800 border-red-200",
  disabled: "bg-gray-100 text-gray-700 border-gray-200",
  not_configured: "bg-gray-100 text-gray-700 border-gray-200",
  missing: "bg-red-100 text-red-800 border-red-200",
};

const labels: Record<string, string> = {
  connected: "เชื่อมต่อแล้ว",
  pending: "รอดำเนินการ",
  warning: "คำเตือน",
  error: "ผิดพลาด",
  disabled: "ปิดใช้งาน",
  not_configured: "ยังไม่ได้ตั้งค่า",
  verified: "ตรวจสอบแล้ว",
  enabled: "เปิดใช้งาน",
  ok: "ผ่าน",
  missing: "ไม่มีสิทธิ์",
  ready: "พร้อม",
};

export function StatusBadge({ status, label }: { status: AnyStatus; label?: string }) {
  const text = label ?? labels[status] ?? status;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? styles.pending}`}
    >
      {text}
    </span>
  );
}
