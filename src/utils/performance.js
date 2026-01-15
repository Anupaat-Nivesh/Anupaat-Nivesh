/**
 * Performance Optimization Utilities
 * Lazy loading, image optimization, and performance monitoring
 */

/**
 * Lazy load images with intersection observer
 */
export const lazyLoadImages = () => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        }
      });
    });

    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
};

/**
 * Preload critical resources
 */
export const preloadCriticalResources = () => {
  // Preload critical fonts
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'font';
  link.type = 'font/woff2';
  link.crossOrigin = 'anonymous';
  // Add font URL if needed
  // document.head.appendChild(link);
};

/**
 * Defer non-critical CSS
 */
export const deferNonCriticalCSS = () => {
  // Add defer attribute to non-critical stylesheets
  const nonCriticalStyles = document.querySelectorAll('link[rel="stylesheet"][data-defer]');
  nonCriticalStyles.forEach(link => {
    link.media = 'print';
    link.onload = function() {
      this.media = 'all';
    };
  });
};

/**
 * Initialize performance optimizations
 */
export const initPerformanceOptimizations = () => {
  // Lazy load images
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', lazyLoadImages);
  } else {
    lazyLoadImages();
  }

  // Preload critical resources
  preloadCriticalResources();

  // Defer non-critical CSS
  deferNonCriticalCSS();
};

/**
 * Monitor Core Web Vitals
 */
export const monitorWebVitals = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    // Track Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (window.gtag) {
        window.gtag('event', 'web_vitals', {
          'event_category': 'Web Vitals',
          'event_label': 'LCP',
          'value': Math.round(lastEntry.renderTime || lastEntry.loadTime)
        });
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // Track First Input Delay (FID)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        if (window.gtag) {
          window.gtag('event', 'web_vitals', {
            'event_category': 'Web Vitals',
            'event_label': 'FID',
            'value': Math.round(entry.processingStart - entry.startTime)
          });
        }
      });
    }).observe({ entryTypes: ['first-input'] });

    // Track Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      if (window.gtag) {
        window.gtag('event', 'web_vitals', {
          'event_category': 'Web Vitals',
          'event_label': 'CLS',
          'value': Math.round(clsValue * 1000)
        });
      }
    }).observe({ entryTypes: ['layout-shift'] });
  }
};

