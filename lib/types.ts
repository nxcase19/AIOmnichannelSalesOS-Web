export type ConnectionStatus = "connected" | "pending" | "warning" | "error" | "disabled" | "not_configured";
export type WebhookStatus = "verified" | "pending" | "error" | "not_configured";
export type CaptureStatus = "enabled" | "disabled";
export type PermissionStatus = "ok" | "missing" | "pending";
export type OverallStatus = "ready" | "warning" | "error";

export type FacebookBusiness = {
  businessId: string;
  name: string;
};

export type FacebookPageOption = {
  pageId: string;
  name: string;
};

export type FacebookPage = {
  tenantId: string;
  pageId: string;
  name: string;
  businessId: string;
  businessName: string;
  status: ConnectionStatus;
  webhookStatus: WebhookStatus;
  captureStatus: CaptureStatus;
  lastEventAt: number | null;
  lastVerifiedAt: number | null;
  permissionStatus: PermissionStatus;
  permissionDetails: string[];
};

export type TenantSummary = {
  tenantId: string;
  totalPages: number;
  connectedPages: number;
  activeCapture: number;
  recentEvents: number;
  overallStatus: OverallStatus;
};

export type DashboardModel = {
  overallStatus: OverallStatus;
  connectedPages: number;
  totalPages: number;
  recentEvents: number;
  pendingActions: string[];
  readinessAnswer: string;
  nextAction: string;
};

export type Diagnostics = {
  overallStatus: OverallStatus;
  categories: {
    name: string;
    status: OverallStatus;
    message: string;
    detail?: string;
  }[];
};

export type ConnectionResult = {
  tenantId: string;
  businessId: string;
  businessName: string;
  connectedPages: number;
  pages: FacebookPageOption[];
  incompleteItems: string[];
  nextAction: string;
};
