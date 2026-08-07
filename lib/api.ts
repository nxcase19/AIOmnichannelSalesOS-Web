import type {
  FacebookBusiness,
  FacebookPage,
  FacebookPageOption,
  TenantSummary,
  DashboardModel,
  Diagnostics,
  ConnectionReview,
  ConnectionResult,
} from "./types";
import { API_BASE, DEFAULT_TENANT, USE_MOCK } from "./config";
import { businesses, allPageOptions, pages, tenantSummary, dashboard, diagnostics } from "./fixtures";

// Re-export types that screens already import.
export type { FacebookBusiness, FacebookPage, FacebookPageOption, TenantSummary, DashboardModel, Diagnostics } from "./types";

export type ApiError = { status: number; message: string };

async function apiCall<T>(path: string, method: "GET" | "POST" = "GET", body?: unknown): Promise<T> {
  const url = `${API_BASE}${path}`;
  const init: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-Tenant-Id": DEFAULT_TENANT,
    },
  };
  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }
  const res = await fetch(url, init);
  if (!res.ok) {
    const text = await res.text().catch(() => "unknown error");
    const err: ApiError = { status: res.status, message: text };
    throw err;
  }
  return res.json() as Promise<T>;
}

function tenantPath(tenantId: string) {
  return `/api/v1/tenants/${encodeURIComponent(tenantId)}`;
}

// ---------------------------------------------------------------------------
// Development fixture fallback
// ---------------------------------------------------------------------------

export async function getBusinesses(tenantId: string): Promise<FacebookBusiness[]> {
  if (USE_MOCK) return Promise.resolve(businesses);
  return apiCall<FacebookBusiness[]>(`${tenantPath(tenantId)}/facebook/businesses`);
}

export async function getPagesForBusiness(
  tenantId: string,
  businessId: string,
): Promise<FacebookPageOption[]> {
  if (USE_MOCK) return Promise.resolve(allPageOptions[businessId] ?? []);
  return apiCall<FacebookPageOption[]>(
    `${tenantPath(tenantId)}/facebook/businesses/${encodeURIComponent(businessId)}/pages`,
  );
}

export async function getTenantPages(tenantId: string): Promise<FacebookPage[]> {
  if (USE_MOCK) return Promise.resolve(pages);
  return apiCall<FacebookPage[]>(`${tenantPath(tenantId)}/facebook/pages`);
}

export async function getTenantSummary(tenantId: string): Promise<TenantSummary> {
  if (USE_MOCK) return Promise.resolve(tenantSummary);
  return apiCall<TenantSummary>(`${tenantPath(tenantId)}/facebook/summary`);
}

export async function getDashboard(tenantId: string): Promise<DashboardModel> {
  if (USE_MOCK) return Promise.resolve(dashboard);
  return apiCall<DashboardModel>(`${tenantPath(tenantId)}/dashboard/readiness`);
}

export async function getDiagnostics(tenantId: string): Promise<Diagnostics> {
  if (USE_MOCK) return Promise.resolve(diagnostics);
  return apiCall<Diagnostics>(`${tenantPath(tenantId)}/facebook/diagnostics`);
}

export async function getPageById(
  tenantId: string,
  pageId: string,
): Promise<FacebookPage | undefined> {
  if (USE_MOCK) return Promise.resolve(pages.find((p) => p.pageId === pageId));
  try {
    return await apiCall<FacebookPage>(
      `${tenantPath(tenantId)}/facebook/pages/${encodeURIComponent(pageId)}`,
    );
  } catch (err) {
    const e = err as ApiError;
    if (e.status === 404) return undefined;
    throw err;
  }
}

export async function reviewConnection(
  tenantId: string,
  businessId: string,
  pageIds: string[],
): Promise<ConnectionReview> {
  if (USE_MOCK) {
    const business = businesses.find((b) => b.businessId === businessId);
    const selected = (allPageOptions[businessId] ?? []).filter((p) => pageIds.includes(p.pageId));
    return Promise.resolve({
      businessId,
      businessName: business?.name ?? businessId,
      pages: selected.map((p) => ({ pageId: p.pageId, name: p.name, permissions: ["pages_messaging", "pages_read_engagement"] })),
    });
  }
  return apiCall<ConnectionReview>(`${tenantPath(tenantId)}/facebook/connections/review`, "POST", {
    businessId,
    pageIds,
  });
}

export async function completeConnection(
  tenantId: string,
  businessId: string,
  pageIds: string[],
): Promise<ConnectionResult> {
  if (USE_MOCK) {
    const business = businesses.find((b) => b.businessId === businessId);
    const selected = (allPageOptions[businessId] ?? []).filter((p) => pageIds.includes(p.pageId));
    return Promise.resolve({
      tenantId,
      businessId,
      businessName: business?.name ?? businessId,
      connectedPages: selected.length,
      pageIds: selected.map((p) => p.pageId),
      incompleteItems: ["Waiting for backend approval before live activation", "Webhook verification pending"],
    });
  }
  return apiCall<ConnectionResult>(`${tenantPath(tenantId)}/facebook/connections`, "POST", {
    businessId,
    pageIds,
  });
}
