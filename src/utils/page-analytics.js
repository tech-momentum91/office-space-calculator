/**
 * Page analytics utility for Lead Magnets.
 * Collects browser/device info and sends to the backend API.
 */

import { getApiUrl } from '@/utils/env-validation';

const VISITOR_ID_KEY = 'phi_visitor_id';

/** Current page visit context - updated by PageAnalyticsTracker for lead-capture calls */
let _currentVisit = {
  logName: null,
  path: null,
  visitor_id: null,
  visit_start: null,
  report_id: null,
};

export function setCurrentVisit(data) {
  _currentVisit = { ..._currentVisit, ...data };
}

export function getCurrentVisit() {
  return { ..._currentVisit };
}

/**
 * Get or create a persistent visitor ID (stored in localStorage)
 */
export function getVisitorId() {
  try {
    let id = localStorage.getItem(VISITOR_ID_KEY);
    if (!id) {
      id = `v_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
      localStorage.setItem(VISITOR_ID_KEY, id);
    }
    return id;
  } catch {
    return `v_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  }
}

/**
 * Parse user agent to detect device type
 */
function getDeviceType() {
  const ua = navigator.userAgent || '';
  console.log('user agent', ua);
  const lower = ua.toLowerCase();
  console.log('lower', lower);
  if (
    /tablet|ipad|playbook|silk/i.test(ua) ||
    (lower.includes('mobile') && !lower.includes('mobile safari'))
  ) {
    console.log('tablet');
    if (/ipad|tablet/i.test(ua)) return 'tablet';
  }
  if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile/i.test(ua)) {
    console.log('mobile');
    return 'mobile';
  }
  return 'desktop';
}

/**
 * Parse user agent for OS
 */
function getOperatingSystem() {
  const ua = navigator.userAgent || '';
  if (/windows nt/i.test(ua)) return 'Windows';
  if (/mac os x|macintosh/i.test(ua)) return 'macOS';
  if (/linux/i.test(ua)) return 'Linux';
  if (/android/i.test(ua)) return 'Android';
  if (/iphone|ipad|ipod/i.test(ua)) return 'iOS';
  if (/cros/i.test(ua)) return 'Chrome OS';
  return 'Unknown';
}

/**
 * Parse user agent for browser
 */
function getBrowser() {
  const ua = navigator.userAgent || '';
  const match = ua.match(/(?:edg|opr|chrome|crios|fxios|safari)\/[\d.]+/i);
  if (match) {
    const name = match[0].split('/')[0].toLowerCase();
    if (name === 'crios') return 'Chrome';
    if (name === 'fxios') return 'Firefox';
    if (name === 'opr') return 'Opera';
    if (name === 'edg') return 'Edge';
    if (name === 'chrome') return 'Chrome';
    if (name === 'safari') return 'Safari';
  }
  if (ua.includes('Firefox')) return 'Firefox';
  return 'Unknown';
}

/**
 * Map route path to human-readable page name
 */
const PAGE_NAMES = {
  '/': 'Welcome',
  '/welcome': 'Welcome',
  '/calculator': 'Office Space Calculator',
  '/login': 'Login',
  '/reset-password': 'Reset Password',
  '/email-sent': 'Email Sent',
  '/set-password': 'Set Password',
  '/dashboard': 'Dashboard',
  '/details-space-analysis': 'Details Space Analysis',
};

function getPageName(path) {
  if (path.startsWith('/details-space-analysis')) return 'Details Space Analysis';
  return PAGE_NAMES[path] || path || 'Unknown';
}

/**
 * Build analytics payload from current context
 */
export function buildAnalyticsPayload(path, options = {}) {
  const pageName = options.page_name ?? getPageName(path);
  return {
    path: path || '/',
    page_name: pageName,
    visitor_id: getVisitorId(),
    referrer: document.referrer || undefined,
    device_type: getDeviceType(),
    operating_system: getOperatingSystem(),
    browser: getBrowser(),
    user_agent: navigator.userAgent || undefined,
    time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone || undefined,
    visit_start: options.visit_start ?? new Date().toISOString(),
    source:
      options.source ?? new URLSearchParams(window.location.search).get('utm_source') ?? undefined,
    medium:
      options.medium ?? new URLSearchParams(window.location.search).get('utm_medium') ?? undefined,
    campaign:
      options.campaign ??
      new URLSearchParams(window.location.search).get('utm_campaign') ??
      undefined,
    ...options,
  };
}

const LOG_API =
  'phi_designs_backend.phi_design_app.doctype.lead_magnets_analytics.lead_magnets_analytics';

/**
 * Send analytics to the backend API. Returns the doc name on success.
 */
export async function logPageVisit(path, options = {}) {
  const apiUrl = getApiUrl();
  if (!apiUrl) return null;

  const payload = buildAnalyticsPayload(path, options);
  const url = `${apiUrl}/api/method/${LOG_API}.log_lead_magnets_analytics`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
      keepalive: true,
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data?.message?.name ?? data?.name ?? null;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[Analytics] Failed to log page visit:', error.message);
    }
    return null;
  }
}

/**
 * Extract report_id from path for /details-space-analysis/:reportId
 */
export function getReportIdFromPath(path) {
  if (!path?.startsWith('/details-space-analysis')) return undefined;
  const parts = path.split('/').filter(Boolean);
  return parts[1] || undefined; // ['details-space-analysis', 'reportId']
}

/**
 * Update an existing visit with visit_end, duration, report_id, lead_captured.
 * Pass logName when available; otherwise pass path, visitor_id, visit_start for backend lookup.
 * Uses sendBeacon when unloading for reliability.
 */
export function updatePageVisitEnd(options, useBeacon = false) {
  const apiUrl = getApiUrl();
  if (!apiUrl) return;

  const { logName, path, visitor_id, visit_start, report_id, lead_captured } = options;
  if (!logName && !(path && visitor_id && visit_start)) return;

  const visitEnd = new Date();
  const startTime = visit_start ? new Date(visit_start) : null;
  const durationSeconds = startTime ? Math.round((visitEnd - startTime) / 1000) : 0;

  const payload = {
    ...(logName && { name: logName }),
    ...(path && visitor_id && visit_start && { path, visitor_id, visit_start }),
    visit_end: visitEnd.toISOString(),
    duration_seconds: durationSeconds,
    ...(report_id !== undefined && { report_id }),
    ...(lead_captured !== undefined && { lead_captured }),
  };
  const url = `${apiUrl}/api/method/${LOG_API}.update_lead_magnets_visit`;

  if (useBeacon) {
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    navigator.sendBeacon(url, blob);
    return;
  }

  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
    keepalive: true,
  }).catch(() => {});
}

/**
 * Mark the current visit as lead captured (user unlocked on Details Space Analysis).
 * Call this when the user successfully submits the unlock form.
 * Uses the current visit context from PageAnalyticsTracker; pass options to override.
 */
export function markPageVisitLeadCaptured(options = {}) {
  const apiUrl = getApiUrl();
  if (!apiUrl) return;

  const ctx = getCurrentVisit();
  const { logName, path, visitor_id, visit_start } = { ...ctx, ...options };
  if (!logName && !(path && visitor_id && visit_start)) return;

  const payload = {
    ...(logName && { name: logName }),
    ...(path && visitor_id && visit_start && { path, visitor_id, visit_start }),
    lead_captured: true,
  };
  const url = `${apiUrl}/api/method/${LOG_API}.update_lead_magnets_visit`;

  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  }).catch(() => {});
}
