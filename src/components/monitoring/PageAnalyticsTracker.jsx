/**
 * PageAnalyticsTracker - Tracks page visits and sends analytics to the backend.
 * Logs visit_start on entry, visit_end and duration on leave (route change or tab close).
 */

import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  logPageVisit,
  updatePageVisitEnd,
  getVisitorId,
  getReportIdFromPath,
  setCurrentVisit,
} from '@/utils/page-analytics';
import { getEnv } from '@/utils/env-validation';

function PageAnalyticsTracker() {
  const location = useLocation();
  const isEnabled = String(getEnv('PHI_ENABLE_ANALYTICS', 'true')).toLowerCase() === 'true';
  const currentRef = useRef({
    logName: null,
    path: null,
    visitor_id: null,
    visit_start: null,
    report_id: null,
  });

  useEffect(() => {
    if (!isEnabled) return;

    const path = location.pathname || '/';
    if (path === '*') return;

    // On leaving previous page: send visit_end (by name or by path+visitor_id+visit_start)
    const prev = currentRef.current;
    if (prev.path) {
      updatePageVisitEnd(
        {
          logName: prev.logName,
          path: prev.path,
          visitor_id: prev.visitor_id,
          visit_start: prev.visit_start,
          report_id: prev.report_id,
        },
        false,
      );
    }

    // On entering new page: store path/visitor_id/visit_start/report_id immediately so we can update on leave
    const visit_start = new Date().toISOString();
    const visitor_id = getVisitorId();
    const report_id = getReportIdFromPath(path) ?? undefined;
    currentRef.current = { logName: null, path, visitor_id, visit_start, report_id };
    setCurrentVisit(currentRef.current);
    logPageVisit(path, { visit_start, report_id }).then((logName) => {
      currentRef.current = { ...currentRef.current, logName };
      setCurrentVisit(currentRef.current);
    });
  }, [location.pathname, isEnabled]);

  useEffect(() => {
    if (!isEnabled) return;

    const handleUnload = () => {
      const prev = currentRef.current;
      if (prev.path) {
        updatePageVisitEnd(
          {
            logName: prev.logName,
            path: prev.path,
            visitor_id: prev.visitor_id,
            visit_start: prev.visit_start,
            report_id: prev.report_id,
          },
          true,
        );
      }
    };

    window.addEventListener('pagehide', handleUnload);
    return () => window.removeEventListener('pagehide', handleUnload);
  }, [isEnabled]);

  return null;
}

export default PageAnalyticsTracker;
