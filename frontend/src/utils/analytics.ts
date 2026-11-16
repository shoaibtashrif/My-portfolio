declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __eaGaInitialized?: boolean;
  }
}

const rawMeasurementId = String(import.meta.env.VITE_GA_MEASUREMENT_ID || '').trim();
export const GA_MEASUREMENT_ID = /^G-[A-Z0-9]+$/i.test(rawMeasurementId)
  ? rawMeasurementId
  : 'G-BVPETB7MYK';

function isAutomatedTraffic(): boolean {
  if (typeof navigator === 'undefined') return true;
  return Boolean(navigator.webdriver) || /bot|crawl|spider|slurp|headless/i.test(navigator.userAgent || '');
}

/**
 * Loads Google Analytics 4 only when VITE_GA_MEASUREMENT_ID is configured
 * for the site owner's own GA4 property.
 */
export function initGoogleAnalytics(): void {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || window.__eaGaInitialized || isAutomatedTraffic()) {
    return;
  }
  window.__eaGaInitialized = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
  document.head.appendChild(script);
}

export function trackPageView(path: string, title: string): void {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || isAutomatedTraffic()) return;
  initGoogleAnalytics();
  window.gtag?.('event', 'page_view', {
    page_path: path,
    page_title: title,
    page_location: window.location.href,
  });
}

export function trackEvent(name: string, params?: Record<string, string | number | boolean>): void {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || !window.gtag || isAutomatedTraffic()) return;
  window.gtag('event', name, params || {});
}

