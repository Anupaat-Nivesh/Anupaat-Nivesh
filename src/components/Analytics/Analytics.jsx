import { useEffect } from 'react';

const GA_ID = process.env.REACT_APP_GA_MEASUREMENT_ID || '';
const GSC_VERIFICATION = process.env.REACT_APP_GOOGLE_SITE_VERIFICATION || '';
const BING_VERIFICATION = process.env.REACT_APP_BING_SITE_VERIFICATION || '';

function upsertMeta(name, content) {
  if (!content) return;
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function loadGtag(measurementId) {
  if (!measurementId || window.gtag) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, { anonymize_ip: true });
}

/**
 * Injects GA4 + webmaster verification meta when env vars are set at build time.
 */
export default function Analytics() {
  useEffect(() => {
    upsertMeta('google-site-verification', GSC_VERIFICATION);
    upsertMeta('msvalidate.01', BING_VERIFICATION);
    loadGtag(GA_ID);
  }, []);

  return null;
}
