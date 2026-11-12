/**
 * Per-route SEO defaults for public pages.
 * Titles should NOT include "| Anupaat Nivesh" — updateSEO appends the brand.
 */

export const SITE_NAME = 'Anupaat Nivesh';
export const DEFAULT_OG_IMAGE = '/logo192.png';

/** Paths that must not be indexed. */
export const NOINDEX_PATH_PREFIXES = [
  '/payment',
  '/payment-success',
  '/payment-error',
  '/valuation/login',
  '/internal/',
  '/mediadata',
  '/invest/admin',
  '/invest/payment-success',
  '/onboarding',
];

export const SEO_BY_PATH = {
  '/': {
    title: 'Financial Planning & Mutual Fund Advisory',
    description:
      'AMFI-registered mutual fund distributor helping Indian families build wealth with goal-based SIPs, elemental portfolios, and disciplined advisory.',
    keywords:
      'mutual funds, financial planning, SIP, AMFI registered, investment advisor, Anupaat Nivesh, goal-based investing',
  },
  '/home': {
    title: 'Financial Planning & Mutual Fund Advisory',
    description:
      'AMFI-registered mutual fund distributor helping Indian families build wealth with goal-based SIPs, elemental portfolios, and disciplined advisory.',
  },
  '/about': {
    title: 'About Us',
    description:
      'Meet Anupaat Nivesh — an independent, AMFI-registered advisory firm focused on transparent, goal-based investing for Indian families.',
  },
  '/offerings': {
    title: 'Investment Offerings',
    description:
      'Explore mutual fund baskets, fixed income, bonds, P2P lending, unlisted stocks, and loan against securities with Anupaat Nivesh.',
  },
  '/contact': {
    title: 'Contact Us',
    description:
      'Talk to Anupaat Nivesh for financial planning, mutual fund SIPs, and portfolio reviews. Reach us by form, phone, or WhatsApp.',
  },
  '/ourApp': {
    title: 'Our Investment App',
    description:
      'Track SIPs, portfolios, and onboarding on the Anupaat Nivesh app — paperless KYC and goal-based investing on the go.',
  },
  '/appdownload': {
    title: 'Download the App',
    description:
      'Download the Anupaat Nivesh app to start SIPs, complete KYC, and manage your mutual fund portfolio.',
  },
  '/calculators': {
    title: 'Investment Calculators',
    description:
      'Use SIP, lumpsum, and step-up calculators to estimate long-term investment outcomes. Educational tools from Anupaat Nivesh.',
  },
  '/consulting-session': {
    title: '1-on-1 Consulting Session',
    description:
      'Book a paid 1-on-1 financial consulting session with Anupaat Nivesh for goal planning, asset allocation, and portfolio clarity.',
  },
  '/book-session': {
    title: 'Book a Consulting Session',
    description:
      'Schedule your Anupaat Nivesh consulting session — pick a slot, share goals, and pay securely online.',
  },
  '/signup': {
    title: 'Sign Up — Start Investing',
    description:
      'Sign up with Anupaat Nivesh for self or assisted mutual fund onboarding. AMFI-registered distributor.',
  },
  '/valuation': {
    title: 'MarketCompass — When & Where to Invest',
    description:
      'MarketCompass turns valuation history into plain pacing and allocation hints — when to add money and how much equity fits the backdrop.',
  },
  '/faqs': {
    title: 'FAQs',
    description:
      'Answers on mutual funds, SIPs, MarketCompass, risk, and how Anupaat Nivesh works with clients.',
  },
  '/partner-with-us': {
    title: 'Partner With Us',
    description:
      'Partner with Anupaat Nivesh as a sub-broker or referral partner and help more families invest with discipline.',
  },
  '/corporate': {
    title: 'Corporate Corner',
    description:
      'Corporate financial wellness and investment education sessions from Anupaat Nivesh for teams across India.',
  },
  '/privacy-policy': {
    title: 'Privacy Policy',
    description:
      'How Anupaat Nivesh collects, uses, and protects personal information for advisory and mutual fund distribution services.',
  },
  '/loan-against-securities': {
    title: 'Loan Against Securities',
    description:
      'Unlock liquidity against mutual funds or shares without selling your investments. Learn how LAS works with Anupaat Nivesh.',
  },
  '/fixed-income-alternatives': {
    title: 'Fixed Income & Alternatives',
    description:
      'Discover fixed deposits, bonds, unlisted stocks, and P2P lending — consultation-first products from Anupaat Nivesh.',
  },
  '/fixed-deposits': {
    title: 'Fixed Deposits',
    description:
      'Compare and explore fixed deposit options with clear risk disclosure and advisory support from Anupaat Nivesh.',
  },
  '/bonds': {
    title: 'Bonds',
    description:
      'Learn about bond investing for income and diversification, with Anupaat Nivesh guidance on fit and risk.',
  },
  '/unlisted-stocks': {
    title: 'Unlisted Stocks',
    description:
      'Understand unlisted equity opportunities, liquidity constraints, and suitability with Anupaat Nivesh.',
  },
  '/p2p-lending': {
    title: 'P2P Lending',
    description:
      'Explore peer-to-peer lending as an alternative income sleeve — risks, process, and advisory context from Anupaat Nivesh.',
  },
  '/tools': {
    title: 'Investment Tools',
    description:
      'Calculators, FIDOK organiser, MarketCompass, and market breadth tools to plan with more clarity.',
  },
  '/screeners': {
    title: 'Market Screeners Hub',
    description:
      'Live market pulse, deals, corporate actions, and screener shortcuts — NSE-backed insights from Anupaat Nivesh.',
  },
  '/screeners/sector-rotation': {
    title: 'Sector Rotation Dashboard',
    description:
      'Track sector relative strength, heatmaps, and rotation leaders to inform mutual fund and equity allocation context.',
  },
  '/screeners/market-breadth': {
    title: 'Market Breadth Screener',
    description:
      'View market breadth — highs vs lows, industry clusters, and session thrust — inside Anupaat Nivesh.',
  },
  '/invest': {
    title: 'Invest Hub',
    description:
      'Elemental mutual fund baskets, fund explorer, and market insights in one Anupaat Nivesh invest flow.',
  },
  '/invest/baskets': {
    title: 'Mutual Fund Baskets — FIRE, WATER, EARTH',
    description:
      'Curated elemental mutual fund baskets for growth, balance, and capital preservation. Unlock details with Anupaat Nivesh.',
  },
  '/invest/funds': {
    title: 'Mutual Fund Explorer',
    description:
      'Browse and compare mutual fund schemes with Anupaat Nivesh before building a goal-based portfolio.',
  },
  '/invest/risk-profile': {
    title: 'Risk Profile Quiz',
    description:
      'Find your investing personality and match it to an Anupaat Nivesh elemental basket.',
  },
  '/invest/goals': {
    title: 'Goal GPS',
    description:
      'Map financial goals to investment horizons and portfolio building blocks with Anupaat Nivesh Goal GPS.',
  },
  '/invest/basket/fire': {
    title: 'FIRE Basket — Growth Seekers',
    description:
      'FIRE elemental basket for long-term wealth creation with aggressive multi-cap mutual fund exposure.',
  },
  '/invest/basket/water': {
    title: 'WATER Basket — Balanced Builders',
    description:
      'WATER elemental basket for controlled volatility and balanced growth across asset classes.',
  },
  '/invest/basket/earth': {
    title: 'EARTH Basket — Wealth Preservers',
    description:
      'EARTH elemental basket for capital preservation and income with hybrid debt-first allocation.',
  },
  '/ArthAI': {
    title: 'ArthAI Finance Assistant',
    description:
      'Chat with ArthAI — Anupaat Nivesh’s educational finance assistant for SIPs, goals, and mutual fund basics.',
  },
  '/chatbot': {
    title: 'ArthAI Finance Assistant',
    description:
      'Chat with ArthAI — Anupaat Nivesh’s educational finance assistant for SIPs, goals, and mutual fund basics.',
  },
};

export const DEFAULT_SEO = {
  title: SITE_NAME,
  description:
    'Personalized financial advisory and AMFI-registered mutual fund distribution from Anupaat Nivesh.',
  keywords: 'Anupaat Nivesh, mutual funds, SIP, financial planning, AMFI',
};

export function resolveSeoForPath(pathname) {
  const path = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname || '/';
  const exact = SEO_BY_PATH[path];
  if (exact) return { ...DEFAULT_SEO, ...exact, canonical: path === '/home' ? '/' : path };

  if (path.startsWith('/invest/fund/')) {
    return {
      ...DEFAULT_SEO,
      title: 'Mutual Fund Details',
      description: 'Scheme details and context for mutual fund investing with Anupaat Nivesh.',
      canonical: path,
    };
  }

  if (path.startsWith('/invest/basket/')) {
    return {
      ...DEFAULT_SEO,
      title: 'Mutual Fund Basket',
      description: 'Elemental mutual fund basket details from Anupaat Nivesh.',
      canonical: path,
    };
  }

  return {
    ...DEFAULT_SEO,
    canonical: path,
  };
}

export function shouldNoIndex(pathname) {
  const path = pathname || '/';
  if (
    NOINDEX_PATH_PREFIXES.some(
      (prefix) => path === prefix || path.startsWith(`${prefix}/`) || path.startsWith(prefix)
    )
  ) {
    return true;
  }
  // Unknown public routes (404s) should not be indexed.
  if (SEO_BY_PATH[path] || path.startsWith('/invest/fund/') || path.startsWith('/invest/basket/')) {
    return false;
  }
  return true;
}

/** Absolute public URLs for sitemap.xml generation reference. */
export const SITEMAP_PATHS = Object.keys(SEO_BY_PATH).filter(
  (p) => p !== '/home' && !shouldNoIndex(p)
);
