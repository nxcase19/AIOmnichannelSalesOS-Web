// Environment configuration for the AI Omnichannel Sales OS Web frontend.
// No server-only secrets may be stored in NEXT_PUBLIC_ variables.

export const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? '';
export const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN ?? '';
export const DEFAULT_TENANT = 't1';

// MOCK fallback is enabled when the backend URL or token is not configured.
// This is a development safety behavior, not a production strategy.
export const USE_MOCK = !API_BASE || !API_TOKEN;
