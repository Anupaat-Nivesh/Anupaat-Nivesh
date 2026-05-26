/**
 * mediaData.js
 *
 * Central data for the homepage Media Gallery. Each item opens in the
 * immersive viewer (video, short, or image) with editorial context.
 *
 * ---------------------------------------------------------------------------
 * HOW TO UPDATE (homepage “As Seen Across Platforms” section)
 * ---------------------------------------------------------------------------
 * 1. Edit this file in the repo — add/remove objects from the `mediaData` array.
 * 2. Deploy a new build; Create React App bakes this list in at compile time.
 * 3. Optional fallback: if backend media APIs are unavailable, this static list
 *    continues to render. In normal production, `/api/media/public` is preferred.
 *
 * Item shape:
 *   {
 *     id: string
 *     type: 'youtube' | 'youtubeShort' | 'photo' | 'socialPost'
 *     title: string
 *     thumbnail?: string
 *     url?: string — for socialPost: full LinkedIn or X/Twitter URL
 *     photoUrls?: string[] — optional; 2+ absolute or bundled URLs = one album (stack + horizontal viewer)
 *     videoId?: string (required for YouTube types)
 *     source?: string
 *     date?: string
 *     articleContent: string — about 60–90 words (max ~90) for the side column; socialPost can be slightly longer when synced from LinkedIn OG text
 *     shortDescription?: string — one line for gallery cards
 *     thumbnail?: string — for socialPost: optional OG cover image URL (shown on gallery cards)
 *     fullArticleContent?: string — optional extra copy for APIs/admin; the viewer uses articleContent on the right for social posts
 *     thumbFocus?: 'top' | 'center' | 'bottom' — optional `object-position` for gallery thumbnails (16:10 cover);
 *       tall images also get a gentle top bias automatically when this is omitted
 *   }
 */

import carousel1 from '../../assets/illustrations/carousel1-illustration.webp';
import financialAwarenessCgc from '../../assets/illustrations/financial-awareness-cgc-university-1120w.jpg';
import panelDiscussionChandigarh from '../../assets/illustrations/panel-discussion-business-school-chandigarh-1120w.jpg';
import teamCiiFestivalOct2025 from '../../assets/illustrations/team-anupaat-niwesh-cii-festival-oct-2025-1120w.jpg';
import edelweissEventRadhikaA from '../../assets/illustrations/event-edelweiss-radhika-gupta-with-founders-a-1120w.jpg';
import edelweissEventRadhikaB from '../../assets/illustrations/event-edelweiss-radhika-gupta-with-founders-b-1120w.jpg';
import etWealthCoverStory from '../../assets/illustrations/et-wealth-cover-story-full.png';
import etWealthFounderFeature from '../../assets/illustrations/et-wealth-founder-feature-infographic-v2.png';
import etWealthQualityLifeCostIndex from '../../assets/illustrations/et-wealth-quality-life-cost-index.png';
import etWealthPropertyRatesTier2 from '../../assets/illustrations/et-wealth-property-rates-rent-tier2.png';

export const youtubeThumb = (videoId) =>
    videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';

const mediaData = [
    {
        id: 'yt-one-fund-smart-diversification',
        type: 'youtube',
        videoId: 'EhjaUQ33uek',
        title: 'One fund to rule them all — smart diversification',
        shortDescription: 'Why one thoughtfully built diversified fund can simplify decisions without giving up balance.',
        source: 'YouTube · Anupaat Nivesh',
        date: 'Investor education',
        articleContent:
            'This session argues for simplicity on purpose: a single, well-designed diversified fund can cover broad equity and debt exposure so households stop juggling overlapping schemes that look different but behave alike. We walk through what “smart diversification” actually means—asset classes, drawdown temperament, and rebalancing discipline—versus collecting tickers for reassurance. The goal is behavioural: fewer switches, clearer reporting, and a portfolio you can explain to family in one sentence. Pair the watch with your own goal dates and risk budget; if one core fund fits, let compounding do the quiet work.',
    },
    {
        id: 'yt-short-rule-of-72-doubling',
        type: 'youtubeShort',
        videoId: '1vUg_wx7dls',
        title: 'The Rule of 72 — how fast can money double?',
        shortDescription: 'A sixty-second refresher on doubling time and why the math is a guide, not a promise.',
        source: 'YouTube Shorts · Anupaat Nivesh',
        date: 'Quick tip',
        articleContent:
            'The Rule of 72 estimates how many years it takes money to double: divide seventy-two by the annual return you assume. It is a teaching shortcut, not a contract—real markets wobble, taxes and fees bite, and compounding is rarely a straight line. Still, the frame helps beginners feel the cost of waiting and the upside of starting early with sensible return assumptions. Use the Short as a conversation opener with your advisor: what rate is realistic after inflation, and does your SIP horizon match the patience the rule quietly demands?',
    },
    {
        id: 'social-linkedin-save-tax-fixed-deposits',
        type: 'socialPost',
        title: 'How to Save Tax on Fixed Deposits',
        thumbnail:
            'https://media.licdn.com/dms/image/v2/D4D12AQFCSLYvb5Am-w/article-cover_image-shrink_720_1280/B4DZiE0gIEHwAM-/0/1754575013164?e=2147483647&v=beta&t=hrUm7RglYGxm7afpaH09jcS4z9CeFw0KjY47bQ91S_w',
        url: 'https://www.linkedin.com/pulse/how-save-tax-fixed-deposits-akashdeep-garg-qpfp--ccshf/',
        shortDescription:
            'FD interest is taxed as “income from other sources”; Akashdeep compares post-tax FD yields with tax-aware arbitrage mutual funds.',
        source: 'LinkedIn',
        date: 'Aug 2025',
        articleContent:
            'Most Indian households still default to fixed deposits for safety, yet interest is taxed at slab rates as “income from other sources,” which can quietly compress the yield you thought you signed up for. Akashdeep Garg’s LinkedIn piece compares post-tax FD outcomes with tax-aware arbitrage mutual funds for certain horizons and who should even consider the switch. It is educational, not a product pitch—read the full thread on LinkedIn for tables, numbers, and disclaimers.',
        fullArticleContent:
            'This on-site version summarises the LinkedIn article for readers who want the thesis before opening another tab.\n\nFixed deposits remain the comfort pick for principal safety, but the interest is added to your total income and taxed at your marginal slab. In higher brackets, a 7% headline FD can feel closer to high single digits after tax—and that is before inflation erodes purchasing power. The piece also notes how some small-savings exemptions behave differently between tax regimes, which matters when you are comparing “net in hand” outcomes rather than advertised coupons alone.\n\nThe article introduces arbitrage mutual funds as one alternative for investors who want relatively stable navigation with a different tax treatment on gains versus interest income, including how short-term and long-term capital gains rules can compare to slab-based FD taxation for certain holding periods. It ends with a simple audience filter—who should even consider the idea—and a reminder that longer horizons may open other debt or hybrid tools depending on risk tolerance and goals.\n\nDisclosure: this summary is not a buy or sell recommendation; it is educational context aligned with the original post. Tables, numeric walk-throughs, and any updates after publish date live on LinkedIn—use “On LinkedIn” in the viewer to read the authoritative version.',
    },
    {
        id: 'social-x-icici-equity-valuation-green-zone',
        type: 'socialPost',
        title: 'Equity Valuation Index: green zone and a 3+ year horizon',
        url: 'https://x.com/anupaatnivesh/status/2053719001319244239',
        shortDescription:
            'ICICI Prudential MF’s Equity Valuation Index is in the green zone—attractive entry context for long-horizon equity investors.',
        source: 'X',
        date: 'May 2026',
        articleContent:
            'This post references ICICI Prudential Mutual Fund’s proprietary Equity Valuation Index sitting in the “green zone,” described as a signal for comparatively attractive entry levels for equity investors who can stay invested for three years or more. Valuation lenses can inform patience and allocation discipline, but they are not a substitute for your own goals, liquidity, and risk budget. We keep it in the gallery as transparent market literacy. Open the post on X for the full graphic, conversation, and replies; then discuss with your advisor how such indicators fit your mandate—not as a universal timing trigger.',
    },
    {
        id: 'photo-financial-awareness-cgc-mohali',
        type: 'photo',
        title: 'Financial Awareness Session in CGC University',
        thumbnail: financialAwarenessCgc,
        url: financialAwarenessCgc,
        shortDescription:
            'Founder Akash Garg and our team led a financial awareness session for BBA students at CGC University, Mohali.',
        source: 'Campus outreach',
        date: 'CGC University · Mohali',
        articleContent:
            'Founder Akash Garg and our team joined BBA students at CGC University, Mohali, for a candid financial awareness session. We bridged classroom vocabulary to everyday choices—budgets, credit hygiene, investing versus saving, and patience over hype—grounded in first salaries, EMIs, and realistic horizons. Campus outreach widens the ecosystem beyond our client roster: sharper questions today support calmer markets tomorrow. Thank you to CGC and the cohort; institutions seeking a similar format can reach us through the contact page.',
    },
    {
        id: 'photo-panel-uoba-chandigarh',
        type: 'photo',
        title: 'Panel Discussion at University of Business Administration, Chandigarh',
        thumbnail: panelDiscussionChandigarh,
        url: panelDiscussionChandigarh,
        shortDescription:
            'Founder Akash Garg on stage for a panel discussion with students and faculty at the University of Business Administration, Chandigarh.',
        source: 'Campus panel',
        date: 'Chandigarh',
        articleContent:
            'Our founder Akash Garg joined a panel at the University of Business Administration in Chandigarh—alongside faculty and practitioners—for a grounded exchange on markets, careers, and habits that separate headline noise from durable progress. Students pressed on risk, credibility, and reading incentives without cynicism. We treat these stages as two-way learning, not a broadcast, because judgement sharpens in rooms like this. Thank you to the hosts and the student community for the rigour and warmth.',
    },
    {
        id: 'photo-team-cii-festival-oct-2025',
        type: 'photo',
        title: 'Team at CII Festival, October 2025',
        thumbnail: teamCiiFestivalOct2025,
        url: teamCiiFestivalOct2025,
        shortDescription:
            'Anupaat Niwesh team at our exhibition stall during the CII festival, October 2025.',
        source: 'Industry exhibition',
        date: 'October 2025',
        articleContent:
            'In October 2025 our team represented Anupaat Nivesh at the CII festival exhibition floor—booth conversations beside brochures, laptops, and the disciplined questions visitors actually ask. The stall paired practical literacy with regulated mutual fund distribution: emergency funds, hospital bills, retirement pacing, and clearing myths without theatre. Busy halls reward clarity, so steady answers beat slogans. We are grateful to the CII ecosystem and every visitor who paused to learn; meeting investors where curiosity already gathers is core to how we work.',
    },
    {
        id: 'photo-album-edelweiss-radhika-gupta-with-founders',
        type: 'photo',
        title: 'Industry evening with Radhika Gupta, CEO — Edelweiss Mutual Fund',
        thumbnail: edelweissEventRadhikaA,
        url: edelweissEventRadhikaA,
        photoUrls: [edelweissEventRadhikaA, edelweissEventRadhikaB],
        thumbFocus: 'top',
        shortDescription:
            'Founders Akash Garg and Gourav Chugh with Radhika Gupta (CEO, Edelweiss Mutual Fund) at an event she helped organise.',
        source: 'Industry gathering',
        date: 'May 2026',
        articleContent:
            'Founders Akash Garg and Gourav Chugh spent an evening with Radhika Gupta, CEO of Edelweiss Mutual Fund, at an event she helped organise—conversation stayed on investor outcomes, distribution duty, and the long arc of trusted advice rather than sound bites. Moments like this sharpen our bar for transparency. We are grateful for the warmth and candour; these frames belong in the gallery as quiet proof that stewardship is a shared discipline across firms. Thank you to Radhika Gupta and the Edelweiss team for hosting us with such care.',
    },
    {
        id: 'photo-et-wealth-metro-small-town-cover-story',
        type: 'photo',
        title: 'Metro to small town? The money math of moving out',
        thumbnail: etWealthCoverStory,
        url: etWealthCoverStory,
        photoUrls: [
            etWealthCoverStory,
            etWealthFounderFeature,
            etWealthQualityLifeCostIndex,
            etWealthPropertyRatesTier2,
        ],
        articleUrl: '/media/et-wealth-edition-may-18-24-2026.pdf',
        thumbFocus: 'top',
        shortDescription:
            'ET Wealth cover story (May 2026) with founder feature plus metro-vs-tier-2 data charts.',
        source: 'The Economic Times Wealth',
        date: 'May 18–24, 2026',
        articleContent:
            'The Economic Times Wealth (Vol. 16, No. 20, May 18–24, 2026) features our founder Akashdeep Garg and Rohita Rani in its cover story on leaving metros for tier-2 cities. After moving from Delhi NCR to Chandigarh in 2022, they report unchanged income but living costs down roughly twenty-five to thirty percent—lower rent, traffic, pollution, and fuel—while noting fewer IT job openings locally. In print, Garg says he has no regrets: life feels better than a metro on every count that matters day to day. We share it as press context on real trade-offs, not as relocation or tax advice for readers.',
        fullArticleContent:
            'Publication: The Economic Times Wealth · Cover story · Issue dated May 18–24, 2026 (Volume 16, Number 20).\n\nHeadline: “Metro to small town? The money math of moving out.”\n\nFeatured: Akashdeep Garg (40), financial adviser, and Rohita Rani (39), data engineer—relocated from Delhi NCR to Chandigarh in 2022.\n\nBenefits cited: lower rentals and construction costs; less traffic, pollution, and fuel spend.\n\nDrawbacks cited: fewer job opportunities, especially in IT.\n\nFinancial snapshot in the feature: no change in income; expenses down an estimated 25–30%.\n\nQuote: “I have no regrets about shifting because it’s better than a metro in every way.”\n\nThis gallery entry uses licensed scan excerpts for recognition only; read the full edition for complete reporting and context.',
    },
    {
        id: 'photo-press-feature',
        type: 'photo',
        title: 'Why Goal-Based Investing Matters in 2026',
        thumbnail: carousel1,
        shortDescription: 'Long-form perspective on SIPs and tax-aware planning.',
        source: 'Press feature',
        date: 'Featured',
        articleContent:
            'In 2026, households win when they choose signal over noise. This perspective frames goal-based investing as architecture—which goal funds first, how much liquidity stays on hand, and when a flashy alternative is a distraction. It also shows advisor-led mutual fund distribution with transparent reporting as the counterweight to app-only hype. We keep it in the gallery as a reminder: investor education and honest distribution belong in the same conversation.',
    },
];

export default mediaData;
