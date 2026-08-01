import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { logAnalyticsEvent } from '../firebase';

export default function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    // Record page view whenever the URL / path changes
    const fullPath = location.pathname + location.search;
    
    logAnalyticsEvent('page_view', {
      page_path: fullPath,
      page_title: document.title,
      page_location: window.location.href
    });
  }, [location]);

  return null;
}
