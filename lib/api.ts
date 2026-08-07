import type {
  FacebookBusiness,
  FacebookPage,
  FacebookPageOption,
  TenantSummary,
  DashboardModel,
  Diagnostics,
} from "./types";
import { businesses, allPageOptions, pages, tenantSummary, dashboard, diagnostics } from "./fixtures";

// Development fixtures / mock adapter for WEB-PHASE-01.
// These functions simulate the future backend JSON API surface.
// They must be replaced by real HTTP calls when backend contracts are ready.

export async function getBusinesses(_tenantId: string): Promise<FacebookBusiness[]> {
  return Promise.resolve(businesses);
}

export async function getPagesForBusiness(
  _tenantId: string,
  businessId: string,
): Promise<FacebookPageOption[]> {
  return Promise.resolve(allPageOptions[businessId] ?? []);
}

export async function getTenantPages(_tenantId: string): Promise<FacebookPage[]> {
  return Promise.resolve(pages);
}

export async function getTenantSummary(_tenantId: string): Promise<TenantSummary> {
  return Promise.resolve(tenantSummary);
}

export async function getDashboard(_tenantId: string): Promise<DashboardModel> {
  return Promise.resolve(dashboard);
}

export async function getDiagnostics(_tenantId: string): Promise<Diagnostics> {
  return Promise.resolve(diagnostics);
}

export async function getPageById(
  _tenantId: string,
  pageId: string,
): Promise<FacebookPage | undefined> {
  return Promise.resolve(pages.find((p) => p.pageId === pageId));
}
