/**
 * SEO Utility Functions
 * 
 * Helper functions for managing meta tags, Open Graph, Twitter Cards,
 * and canonical URLs dynamically per page.
 * 
 * Usage:
 * import { updateSEO } from '../utils/seo';
 * 
 * useEffect(() => {
 *   updateSEO({
 *     title: 'Page Title',
 *     description: 'Page description',
 *     keywords: 'keyword1, keyword2',
 *     canonical: 'https://example.com/page',
 *     ogImage: 'https://example.com/og-image.jpg'
 *   });
 * }, []);
 */

/**
 * Updates page meta tags for SEO
 * 
 * @param {Object} options - SEO configuration object
 * @param {string} options.title - Page title (required)
 * @param {string} options.description - Meta description (required)
 * @param {string} options.keywords - Meta keywords (optional)
 * @param {string} options.canonical - Canonical URL (optional)
 * @param {string} options.ogImage - Open Graph image URL (optional)
 * @param {string} options.ogType - Open Graph type (default: 'website')
 * @param {string} options.twitterCard - Twitter card type (default: 'summary_large_image')
 */
export const updateSEO = ({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  ogType = 'website',
  twitterCard = 'summary_large_image'
}) => {
  // Get base URL from environment or use current origin
  const baseUrl = process.env.REACT_APP_BASE_URL || window.location.origin;
  
  // Update document title
  if (title) {
    document.title = `${title} | Anupaat Nivesh`;
  }
  
  // Update or create meta tags
  const updateMetaTag = (name, content, attribute = 'name') => {
    if (!content) return;
    
    let element = document.querySelector(`meta[${attribute}="${name}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attribute, name);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };
  
  // Basic meta tags
  updateMetaTag('description', description);
  updateMetaTag('keywords', keywords);
  
  // Canonical URL
  if (canonical) {
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical.startsWith('http') ? canonical : `${baseUrl}${canonical}`);
  }
  
  // Open Graph tags
  updateMetaTag('og:title', title, 'property');
  updateMetaTag('og:description', description, 'property');
  updateMetaTag('og:type', ogType, 'property');
  updateMetaTag('og:url', canonical ? (canonical.startsWith('http') ? canonical : `${baseUrl}${canonical}`) : window.location.href, 'property');
  updateMetaTag('og:image', ogImage || `${baseUrl}/logo.png`, 'property');
  updateMetaTag('og:site_name', 'Anupaat Nivesh', 'property');
  
  // Twitter Card tags
  updateMetaTag('twitter:card', twitterCard);
  updateMetaTag('twitter:title', title);
  updateMetaTag('twitter:description', description);
  updateMetaTag('twitter:image', ogImage || `${baseUrl}/logo.png`);
};

/**
 * Structured Data Helper
 * 
 * Creates JSON-LD structured data for FAQ schema (placeholder)
 * Can be extended for other schema types (Organization, BreadcrumbList, etc.)
 * 
 * @param {Object} faqData - FAQ data array
 * @returns {string} JSON-LD script content
 */
export const generateFAQSchema = (faqData = []) => {
  if (!Array.isArray(faqData) || faqData.length === 0) {
    return null;
  }
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
  
  return JSON.stringify(schema);
};

/**
 * Adds structured data script to document head
 * 
 * @param {string} jsonLd - JSON-LD string
 * @param {string} id - Unique ID for the script tag (optional)
 */
export const addStructuredData = (jsonLd, id = 'structured-data') => {
  // Remove existing script with same ID
  const existing = document.getElementById(id);
  if (existing) {
    existing.remove();
  }
  
  if (!jsonLd) return;
  
  const script = document.createElement('script');
  script.id = id;
  script.type = 'application/ld+json';
  script.text = jsonLd;
  document.head.appendChild(script);
};

/**
 * React Hook for SEO updates
 * 
 * Usage in components:
 * import { useSEO } from '../utils/seo';
 * 
 * useSEO({
 *   title: 'Page Title',
 *   description: 'Page description'
 * });
 * 
 * Note: This hook requires React to be imported in the component file.
 * For better tree-shaking, use updateSEO directly in useEffect instead.
 */
export const useSEO = (seoConfig) => {
  // This is a placeholder - components should use updateSEO directly in useEffect
  // to avoid requiring React in this utility file
  if (typeof window !== 'undefined') {
    updateSEO(seoConfig);
  }
};

