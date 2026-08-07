// Environment configuration for the AI Omnichannel Sales OS Web frontend.
// No NEXT_PUBLIC_* value is secret. It is visible in the browser bundle.

export const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? '';
export const DEFAULT_TENANT = 't1';

// Real backend API calls are disabled until an approved, browser-safe
// authentication mechanism exists. All screens currently use the documented
// mock fixture adapter.
export const USE_MOCK = true;
