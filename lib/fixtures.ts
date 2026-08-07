import type { FacebookBusiness, FacebookPage, FacebookPageOption, TenantSummary, DashboardModel, Diagnostics } from "./types";

export const now = 1760073600000; // 2026-08-10T00:00:00Z

export const businesses: FacebookBusiness[] = [
  { businessId: "biz-abc-group", name: "ABC Group" },
  { businessId: "biz-marketing", name: "ABC Marketing" },
  { businessId: "biz-shop", name: "ABC Shop" },
];

const basePages: FacebookPageOption[] = [
  { pageId: "page-a", name: "Page A" },
  { pageId: "page-b", name: "Page B" },
  { pageId: "page-c", name: "Page C" },
  { pageId: "page-d", name: "Page D" },
  { pageId: "page-e", name: "Page E" },
];

export const allPageOptions: Record<string, FacebookPageOption[]> = {
  "biz-abc-group": basePages,
  "biz-marketing": basePages.slice(0, 3),
  "biz-shop": basePages.slice(2),
};

export const pages: FacebookPage[] = [
  {
    tenantId: "t1",
    pageId: "page-a",
    name: "Page A",
    businessId: "biz-abc-group",
    businessName: "ABC Group",
    status: "connected",
    webhookStatus: "verified",
    captureStatus: "enabled",
    lastEventAt: now - 3600000,
    lastVerifiedAt: now - 7200000,
    permissionStatus: "ok",
    permissionDetails: ["pages_messaging", "pages_read_engagement"],
  },
  {
    tenantId: "t1",
    pageId: "page-b",
    name: "Page B",
    businessId: "biz-abc-group",
    businessName: "ABC Group",
    status: "connected",
    webhookStatus: "verified",
    captureStatus: "enabled",
    lastEventAt: now - 7200000,
    lastVerifiedAt: now - 14400000,
    permissionStatus: "ok",
    permissionDetails: ["pages_messaging"],
  },
  {
    tenantId: "t1",
    pageId: "page-c",
    name: "Page C",
    businessId: "biz-abc-group",
    businessName: "ABC Group",
    status: "warning",
    webhookStatus: "error",
    captureStatus: "enabled",
    lastEventAt: now - 18000000,
    lastVerifiedAt: now - 86400000,
    permissionStatus: "pending",
    permissionDetails: ["pages_messaging"],
  },
  {
    tenantId: "t1",
    pageId: "page-d",
    name: "Page D",
    businessId: "biz-abc-group",
    businessName: "ABC Group",
    status: "error",
    webhookStatus: "not_configured",
    captureStatus: "disabled",
    lastEventAt: null,
    lastVerifiedAt: null,
    permissionStatus: "missing",
    permissionDetails: [],
  },
  {
    tenantId: "t1",
    pageId: "page-e",
    name: "Page E",
    businessId: "biz-abc-group",
    businessName: "ABC Group",
    status: "pending",
    webhookStatus: "pending",
    captureStatus: "disabled",
    lastEventAt: null,
    lastVerifiedAt: null,
    permissionStatus: "pending",
    permissionDetails: [],
  },
];

export const tenantSummary: TenantSummary = {
  tenantId: "t1",
  totalPages: pages.length,
  connectedPages: pages.filter((p) => p.status === "connected").length,
  activeCapture: pages.filter((p) => p.captureStatus === "enabled").length,
  recentEvents: 1234,
  overallStatus: "warning",
};

export const dashboard: DashboardModel = {
  overallStatus: "warning",
  connectedPages: 2,
  totalPages: 5,
  recentEvents: 1234,
  pendingActions: [
    "ตรวจสอบการเชื่อมต่อ Page C",
    "เปิดใช้งาน Data Capture สำหรับ Page E",
    "ยืนยันสิทธิ์ Page D ให้เรียบร้อย",
  ],
  readinessAnswer: "ระบบพร้อมทำงานในโหมดทดสอบ แต่ยังมีบางหน้าที่ต้องตรวจสอบ",
  nextAction: "ตรวจสอบ Facebook Connections และแก้ไขหน้าที่มีคำเตือน",
};

export const diagnostics: Diagnostics = {
  overallStatus: "warning",
  categories: [
    { name: "เชื่อมต่อ Facebook", status: "ready", message: "มี Business และ Page ที่เลือกไว้" },
    { name: "Webhooks", status: "warning", message: "Page C ตอบสนองช้า", detail: "ล่าสุดตรวจสอบเมื่อ 1 ชั่วโมงที่แล้ว" },
    { name: "สิทธิ์", status: "warning", message: "Page D ยังไม่ได้รับสิทธิ์ pages_messaging", detail: "ตรวจสอบใน Meta Developer Console" },
    { name: "Data Capture", status: "ready", message: "2 จาก 5 หน้าเปิดรับข้อมูล" },
  ],
};
