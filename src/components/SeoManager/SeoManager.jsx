import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { updateSEO, addStructuredData } from '../../utils/seo';
import {
  DEFAULT_OG_IMAGE,
  resolveSeoForPath,
  shouldNoIndex,
  SITE_NAME,
} from '../../data/seoPages';

function organizationSchema(baseUrl) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name: SITE_NAME,
    url: baseUrl,
    logo: `${baseUrl}/logo192.png`,
    image: `${baseUrl}${DEFAULT_OG_IMAGE}`,
    description:
      'AMFI-registered mutual fund distributor and financial advisory firm helping Indian families invest with discipline.',
    telephone: '+91-95011-95200',
    email: 'contact@anupaatnivesh.com',
    address: [
      {
        '@type': 'PostalAddress',
        streetAddress: '#162/2, Dadu Majra',
        addressLocality: 'Chandigarh',
        addressRegion: 'Chandigarh',
        postalCode: '160014',
        addressCountry: 'IN',
      },
      {
        '@type': 'PostalAddress',
        streetAddress: 'Suite 333, Medallion 68, Sector 68',
        addressLocality: 'Mohali',
        addressRegion: 'Punjab',
        postalCode: '160062',
        addressCountry: 'IN',
      },
    ],
    sameAs: [
      'https://www.facebook.com/anupaatnivesh',
      'https://twitter.com/Anupaatnivesh',
      'https://www.youtube.com/@anupaatnivesh',
      'https://www.linkedin.com/company/anupaatnivesh/',
      'https://wa.me/919501195200',
    ],
  });
}

/**
 * Applies route-level title, description, canonical, robots, and org schema.
 * Mount once inside the Router (e.g. App or MainLayout).
 */
export default function SeoManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = resolveSeoForPath(pathname);
    const noindex = shouldNoIndex(pathname);

    updateSEO({
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords,
      canonical: seo.canonical,
      ogImage: seo.ogImage || DEFAULT_OG_IMAGE,
      robots: noindex ? 'noindex, nofollow' : 'index, follow',
    });

    const baseUrl = (process.env.REACT_APP_BASE_URL || window.location.origin).replace(/\/$/, '');
    if (pathname === '/' || pathname === '/home') {
      addStructuredData(organizationSchema(baseUrl), 'org-structured-data');
    } else {
      const existing = document.getElementById('org-structured-data');
      if (existing) existing.remove();
    }
  }, [pathname]);

  return null;
}
