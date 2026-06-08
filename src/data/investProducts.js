import financeIllustration from '../assets/illustrations/finance-01.svg';
import investmentIllustration from '../assets/illustrations/investment-01.svg';
import stockIllustration from '../assets/illustrations/stock market-01.svg';
import developMoneyIllustration from '../assets/illustrations/develop money-01.svg';

export const PRODUCT_CATEGORIES = {
  fixed_income: 'Fixed income',
  alternatives: 'Alternatives',
};

export const investProducts = [
  {
    id: 'fixed-deposits',
    route: '/fixed-deposits',
    category: 'fixed_income',
    categoryLabel: PRODUCT_CATEGORIES.fixed_income,
    title: 'Fixed Deposits (FD)',
    tagline: 'Stable returns with capital preservation',
    description:
      'Fixed deposits let you park surplus cash with banks or NBFCs for a fixed tenure at a predetermined interest rate. They suit investors who prioritise safety and predictable income over market volatility.',
    benefits: [
      {
        heading: 'Predictable returns',
        description: 'Know your interest payout upfront for the chosen tenure.',
      },
      {
        heading: 'Capital safety',
        description: 'Suited for conservative goals where principal protection matters.',
      },
      {
        heading: 'Flexible tenures',
        description: 'From short-term parking to multi-year savings — pick what fits your horizon.',
      },
      {
        heading: 'Easy to understand',
        description: 'A straightforward product with no daily NAV or market timing decisions.',
      },
    ],
    idealFor: [
      'Emergency fund parking beyond daily liquidity needs',
      'Goals within 1–3 years where stability matters',
      'Conservative investors comparing post-tax FD yields',
      'Retirees seeking regular interest income',
    ],
    status: 'coming_soon',
    ctaLabel: 'Book consultation',
    ctaPath: '/book-consultation',
    illustration: financeIllustration,
    crossLinks: [],
  },
  {
    id: 'bonds',
    route: '/bonds',
    category: 'fixed_income',
    categoryLabel: PRODUCT_CATEGORIES.fixed_income,
    title: 'Bonds',
    tagline: 'Income and duration for your fixed-income allocation',
    description:
      'Bonds are debt instruments issued by governments, PSUs, or corporates. They can offer regular coupon income and help diversify beyond bank FDs — with credit and interest-rate risks to understand before investing.',
    benefits: [
      {
        heading: 'Regular income',
        description: 'Many bonds pay periodic coupons — useful for income planning.',
      },
      {
        heading: 'Portfolio diversification',
        description: 'Complement equity and mutual funds with a debt sleeve.',
      },
      {
        heading: 'Range of issuers',
        description: 'Government, PSU, and corporate options across ratings and tenures.',
      },
      {
        heading: 'Listed liquidity',
        description: 'Some bonds trade on exchanges; others are held to maturity.',
      },
    ],
    idealFor: [
      'Investors building a core fixed-income allocation',
      'Those comfortable with credit and duration concepts',
      'Income seekers comparing bonds vs debt mutual funds',
      'Medium-term goals with defined cash-flow needs',
    ],
    status: 'coming_soon',
    ctaLabel: 'Book consultation',
    ctaPath: '/book-consultation',
    illustration: investmentIllustration,
    crossLinks: [
      { label: 'Mutual fund baskets', path: '/invest/baskets' },
    ],
  },
  {
    id: 'unlisted-stocks',
    route: '/unlisted-stocks',
    category: 'alternatives',
    categoryLabel: PRODUCT_CATEGORIES.alternatives,
    title: 'Unlisted Stocks',
    tagline: 'Access pre-IPO and private-market equity opportunities',
    description:
      'Unlisted shares represent equity in companies not yet traded on public exchanges. They can offer early exposure to growth stories but carry liquidity, valuation, and regulatory constraints that differ from listed equities.',
    benefits: [
      {
        heading: 'Early-stage access',
        description: 'Participate before a potential public listing or next funding round.',
      },
      {
        heading: 'Portfolio differentiation',
        description: 'Add an alternatives sleeve beyond mutual funds and listed stocks.',
      },
      {
        heading: 'Curated opportunities',
        description: 'We help you evaluate quality issuers and documentation — not hype.',
      },
      {
        heading: 'Guided onboarding',
        description: 'Consultation-first process to match risk appetite and ticket size.',
      },
    ],
    idealFor: [
      'Experienced investors with surplus capital and long horizons',
      'Those who understand illiquidity and private-market risks',
      'Investors seeking pre-IPO exposure with proper due diligence',
      'HNIs diversifying beyond traditional equity baskets',
    ],
    status: 'coming_soon',
    ctaLabel: 'Book consultation',
    ctaPath: '/book-consultation',
    illustration: stockIllustration,
    crossLinks: [
      { label: 'Mutual fund baskets', path: '/invest/baskets' },
      { label: 'Stock screeners', path: '/screeners' },
    ],
  },
  {
    id: 'p2p-lending',
    route: '/p2p-lending',
    category: 'alternatives',
    categoryLabel: PRODUCT_CATEGORIES.alternatives,
    title: 'P2P Lending',
    tagline: 'Peer-to-peer lending with transparent risk disclosure',
    description:
      'P2P platforms connect lenders with verified borrowers, potentially offering yields above traditional savings products. Returns are not guaranteed — credit risk, platform risk, and RBI guidelines apply.',
    benefits: [
      {
        heading: 'Yield potential',
        description: 'May offer higher indicative returns than savings accounts for matched risk.',
      },
      {
        heading: 'Diversified lending',
        description: 'Spread exposure across multiple borrowers where platforms allow.',
      },
      {
        heading: 'Regulated framework',
        description: 'RBI-regulated NBFC-P2P norms govern eligible platforms in India.',
      },
      {
        heading: 'Advisory-led entry',
        description: 'We explain risks and suitability before you commit capital.',
      },
    ],
    idealFor: [
      'Investors who understand credit and platform risk',
      'Those with surplus funds beyond emergency and core portfolios',
      'Yield seekers comparing P2P vs FD and short-term debt',
      'Users willing to read platform disclosures and RBI limits',
    ],
    status: 'coming_soon',
    ctaLabel: 'Book consultation',
    ctaPath: '/book-consultation',
    illustration: developMoneyIllustration,
    crossLinks: [],
  },
];

export function getProductById(id) {
  return investProducts.find((p) => p.id === id) || null;
}

export function getProductsByCategory(category) {
  return investProducts.filter((p) => p.category === category);
}
