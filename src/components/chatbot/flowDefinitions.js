// ============================================
// FLOW DEFINITIONS - CTA Tree Configurations
// ============================================
// Defines all conversation flows with up to 10 levels of depth

import { INTENTS, LANGUAGES } from './arthAI';
import { CTANode } from './conversationEngine';

/**
 * SCENARIO 1: "What is SIP?" Flow (10 Levels)
 * Complete flow as per user specification
 */
export const sipInfoFlow = [
  // Level 1: Introduction
  new CTANode({
    id: 'sip_intro_l1',
    intent: INTENTS.BEGINNER_QUERY,
    level: 1,
    message: (state) => {
      const lang = state.userProfile.language;
      const messages = {
        [LANGUAGES.ENGLISH]: "**SIP means Systematic Investment Plan** — you invest a fixed amount every month to build long-term wealth through mutual funds.",
        [LANGUAGES.HINDI]: "**SIP का मतलब है Systematic Investment Plan** — आप हर महीने एक निश्चित राशि निवेश करते हैं म्यूचुअल फंड के माध्यम से दीर्घकालिक धन बनाने के लिए।",
        [LANGUAGES.HINGLISH]: "**SIP matlab Systematic Investment Plan** — aap har mahine ek fixed amount invest karte hain mutual funds ke through long-term wealth banane ke liye.",
        [LANGUAGES.PUNJABI]: "**SIP ਦਾ ਮਤਲਬ ਹੈ Systematic Investment Plan** — ਤੁਸੀਂ ਹਰ ਮਹੀਨੇ ਇੱਕ ਨਿਸ਼ਚਿਤ ਰਾਸ਼ੀ ਨਿਵੇਸ਼ ਕਰਦੇ ਹੋ ਮਿਊਚੁਅਲ ਫੰਡਾਂ ਦੁਆਰਾ ਲੰਬੇ ਸਮੇਂ ਦੀ ਦੌਲਤ ਬਣਾਉਣ ਲਈ।"
      };
      return messages[lang] || messages[LANGUAGES.HINGLISH];
    },
    ctas: [
      { id: 'explain_simple', label: '💡 Explain in Simple Terms', next: 'sip_simple_l2' },
      { id: 'returns', label: '📈 How much return can SIP give?', next: 'sip_returns_l2' },
      { id: 'plan_sip', label: '🎯 Plan My SIP', next: 'goal_entry_l1' },
      { id: 'calculator', label: '🧮 SIP Calculator', next: 'sip_calc_entry' },
      { id: 'back', label: '🔙 Back to Menu', next: 'home' }
    ]
  }),

  // Level 2: Explain in Simple Terms
  new CTANode({
    id: 'sip_simple_l2',
    intent: INTENTS.BEGINNER_QUERY,
    level: 2,
    requiresLLM: true, // Use LLM for rich explanation with examples and analogies
    message: (state) => {
      const lang = state.userProfile.language;
      const messages = {
        [LANGUAGES.ENGLISH]: "Let me explain SIP in simple terms with real-life examples and analogies...",
        [LANGUAGES.HINGLISH]: "Main SIP ko simple terms mein explain karta hoon real-life examples aur analogies ke saath...",
        [LANGUAGES.HINDI]: "मैं SIP को सरल शब्दों में वास्तविक जीवन के उदाहरणों और सादृश्यों के साथ समझाता हूं...",
        [LANGUAGES.PUNJABI]: "ਮੈਂ SIP ਨੂੰ ਸਧਾਰਨ ਸ਼ਬਦਾਂ ਵਿੱਚ ਅਸਲ ਜੀਵਨ ਦੀਆਂ ਉਦਾਹਰਣਾਂ ਅਤੇ ਸਮਾਨਤਾਵਾਂ ਨਾਲ ਸਮਝਾਉਂਦਾ ਹਾਂ..."
      };
      return messages[lang] || messages[LANGUAGES.HINGLISH];
    },
    ctas: [
      { id: 'is_safe', label: '🤔 Is SIP Safe?', next: 'sip_safety_l3' },
      { id: 'how_much', label: '🎯 How much should I invest monthly?', next: 'sip_amount_l3' },
      { id: 'where_invested', label: '📊 Where does SIP money get invested?', next: 'sip_investment_l3' },
      { id: 'calculate_goal', label: '🧮 Calculate SIP for my goal', next: 'goal_entry_l1' },
      { id: 'advisor', label: '🗣️ Talk to Advisor', next: 'advisor_entry' },
      { id: 'back', label: '🔙 Back', next: 'sip_intro_l1' }
    ]
  }),

  // Level 2: How much return can SIP give?
  new CTANode({
    id: 'sip_returns_l2',
    intent: INTENTS.PRODUCT_EXPLORATION,
    level: 2,
    requiresLLM: true,
    message: (state) => {
      const lang = state.userProfile.language;
      const messages = {
        [LANGUAGES.ENGLISH]: "SIP returns depend on market performance and are not guaranteed. Let me explain realistic return expectations...",
        [LANGUAGES.HINGLISH]: "SIP returns market performance par depend karte hain aur guaranteed nahi hain. Main realistic return expectations explain karta hoon...",
        [LANGUAGES.HINDI]: "SIP रिटर्न बाजार के प्रदर्शन पर निर्भर करते हैं और गारंटीशुदा नहीं हैं। मैं यथार्थवादी रिटर्न अपेक्षाएं समझाता हूं...",
        [LANGUAGES.PUNJABI]: "SIP ਰਿਟਰਨ ਮਾਰਕੀਟ ਦੇ ਪ੍ਰਦਰਸ਼ਨ 'ਤੇ ਨਿਰਭਰ ਕਰਦੇ ਹਨ ਅਤੇ ਗਾਰੰਟੀਡ ਨਹੀਂ ਹਨ। ਮੈਂ ਯਥਾਰਥਵਾਦੀ ਰਿਟਰਨ ਉਮੀਦਾਂ ਸਮਝਾਉਂਦਾ ਹਾਂ..."
      };
      return messages[lang] || messages[LANGUAGES.HINGLISH];
    },
    ctas: [
      { id: 'example_calc', label: '💡 See Example Calculation', next: 'sip_example_calc_l3' },
      { id: 'calculator', label: '🧮 Use SIP Calculator', next: 'sip_calc_entry' },
      { id: 'factors', label: '📊 Factors Affecting Returns', next: 'sip_factors_l3' },
      { id: 'back', label: '🔙 Back', next: 'sip_intro_l1' }
    ]
  }),

  // Level 3: Is SIP Safe?
  new CTANode({
    id: 'sip_safety_l3',
    intent: INTENTS.FEAR_OR_RISK_CONCERN,
    level: 3,
    requiresLLM: true,
    message: (state) => {
      return "Let me explain SIP safety and risk factors...";
    },
    ctas: [
      { id: 'risk_profiling', label: '🛡️ How much risk is OK for me?', next: 'risk_profiling_l4' },
      { id: 'goal_sip', label: '🎯 Plan a Goal-Based SIP', next: 'goal_entry_l1' },
      { id: 'simulation', label: '🧮 Run a SIP Simulation', next: 'sip_calc_entry' },
      { id: 'advisor_guidance', label: '👩‍💼 Advisor Guidance', next: 'advisor_entry' },
      { id: 'back', label: '🔙 Back', next: 'sip_simple_l2' }
    ]
  }),

  // Level 4: Risk Profiling Entry
  new CTANode({
    id: 'risk_profiling_l4',
    intent: 'risk_profiling',
    level: 4,
    message: (state) => {
      const lang = state.userProfile.language;
      const messages = {
        [LANGUAGES.ENGLISH]: "**Risk Profiling** 🛡️\n\nTo recommend the right investment approach, I need to understand your situation better.\n\n**What is your primary purpose for investing?**",
        [LANGUAGES.HINGLISH]: "**Risk Profiling** 🛡️\n\nSahi investment approach suggest karne ke liye, mujhe aapki situation samajhni hogi.\n\n**Aapka primary purpose kya hai investing ka?**"
      };
      return messages[lang] || messages[LANGUAGES.HINGLISH];
    },
    ctas: [
      { id: 'goal_retirement', label: '🏖️ Retirement', next: 'risk_time_l5', condition: (state) => { state.updateProfile('goalFocus', 'retirement'); return true; } },
      { id: 'goal_education', label: '🎓 Child Education', next: 'risk_time_l5', condition: (state) => { state.updateProfile('goalFocus', 'child_education'); return true; } },
      { id: 'goal_wealth', label: '💰 Wealth Creation', next: 'risk_time_l5', condition: (state) => { state.updateProfile('goalFocus', 'wealth_creation'); return true; } },
      { id: 'goal_short_term', label: '📅 Short-term Savings', next: 'risk_time_l5', condition: (state) => { state.updateProfile('goalFocus', 'short_term'); return true; } },
      { id: 'back', label: '🔙 Back', next: 'sip_safety_l3' }
    ]
  }),

  // Level 5: Time Horizon
  new CTANode({
    id: 'risk_time_l5',
    intent: 'risk_profiling',
    level: 5,
    message: (state) => {
      return "**What is your time horizon?**\n\nHow long can you stay invested?";
    },
    ctas: [
      { id: 'time_short', label: '< 3 years', next: 'risk_capacity_l6', condition: (state) => { state.updateProfile('timeHorizon', '<3'); return true; } },
      { id: 'time_medium', label: '3–5 years', next: 'risk_capacity_l6', condition: (state) => { state.updateProfile('timeHorizon', '3-5'); return true; } },
      { id: 'time_long', label: '5–10 years', next: 'risk_capacity_l6', condition: (state) => { state.updateProfile('timeHorizon', '5-10'); return true; } },
      { id: 'time_very_long', label: '10+ years', next: 'risk_capacity_l6', condition: (state) => { state.updateProfile('timeHorizon', '10+'); return true; } },
      { id: 'back', label: '🔙 Back', next: 'risk_profiling_l4' }
    ]
  }),

  // Level 6: Risk Capacity
  new CTANode({
    id: 'risk_capacity_l6',
    intent: 'risk_profiling',
    level: 6,
    message: (state) => {
      return "**How comfortable are you with market fluctuations?**\n\nThis helps determine your risk capacity.";
    },
    ctas: [
      { id: 'risk_low', label: '🟢 Low (Prefer stability)', next: 'allocation_l7', condition: (state) => { state.updateProfile('riskProfile', 'low'); return true; } },
      { id: 'risk_moderate', label: '🟡 Moderate (Balanced)', next: 'allocation_l7', condition: (state) => { state.updateProfile('riskProfile', 'moderate'); return true; } },
      { id: 'risk_high', label: '🔴 High (Growth focus)', next: 'allocation_l7', condition: (state) => { state.updateProfile('riskProfile', 'high'); return true; } },
      { id: 'back', label: '🔙 Back', next: 'risk_time_l5' }
    ]
  }),

  // Level 7: Asset Allocation Recommendation
  new CTANode({
    id: 'allocation_l7',
    intent: 'portfolio_allocation_education',
    level: 7,
    requiresLLM: true, // Use LLM to generate personalized allocation
    message: (state) => {
      const { riskProfile, timeHorizon, goalFocus } = state.userProfile;
      return `Based on your profile (${riskProfile} risk, ${timeHorizon} horizon, ${goalFocus} goal), let me suggest an appropriate asset allocation...`;
    },
    ctas: [
      { id: 'show_portfolio', label: '📊 Show Example Portfolio', next: 'portfolio_example_l8' },
      { id: 'calculate_sip', label: '🧮 Calculate SIP for this plan', next: 'sip_calc_entry' },
      { id: 'advisor', label: '👩‍💼 Talk to Advisor', next: 'advisor_entry' },
      { id: 'back', label: '🔙 Back', next: 'risk_capacity_l6' }
    ]
  }),

  // Level 8: Portfolio Example
  new CTANode({
    id: 'portfolio_example_l8',
    intent: 'portfolio_allocation_education',
    level: 8,
    requiresLLM: true,
    message: (state) => {
      return "Here's an example portfolio structure based on your profile...";
    },
    ctas: [
      { id: 'calculate', label: '🧮 Calculate SIP', next: 'sip_calc_entry' },
      { id: 'goal_planning', label: '🎯 Link to Goal Planning', next: 'goal_entry_l1' },
      { id: 'share_details', label: '📞 Share your details', next: 'lead_capture_l9' },
      { id: 'back', label: '🔙 Back', next: 'allocation_l7' }
    ]
  }),

  // Level 9: Lead Capture
  new CTANode({
    id: 'lead_capture_l9',
    intent: INTENTS.LEAD_CAPTURE_OPPORTUNITY,
    level: 9,
    message: (state) => {
      return "If you'd like personal guidance, share your phone or email — we'll help you set up the right plan.";
    },
    ctas: [
      { id: 'submit', label: '📞 Submit', next: 'lead_thankyou_l10' },
      { id: 'skip', label: '❌ Skip', next: 'continue_exploring' },
      { id: 'back', label: '🔙 Back', next: 'portfolio_example_l8' }
    ]
  }),

  // Level 10: Conversion Tracking (Thank You)
  new CTANode({
    id: 'lead_thankyou_l10',
    intent: INTENTS.LEAD_CAPTURE_OPPORTUNITY,
    level: 10,
    message: (state) => {
      const lang = state.userProfile.language;
      const messages = {
        [LANGUAGES.ENGLISH]: "**Thank you!** 🙏\n\nOur advisor will connect with you soon. Meanwhile, you can continue exploring your goals.",
        [LANGUAGES.HINGLISH]: "**Thank you!** 🙏\n\nHamara advisor jald hi aap se connect karega. Is beech mein, aap apne goals explore karte rahein.",
        [LANGUAGES.HINDI]: "**धन्यवाद!** 🙏\n\nहमारा सलाहकार जल्द ही आपसे जुड़ेगा। इस बीच, आप अपने लक्ष्यों का पता लगाते रह सकते हैं।",
        [LANGUAGES.PUNJABI]: "**ਧੰਨਵਾਦ!** 🙏\n\nਸਾਡਾ ਸਲਾਹਕਾਰ ਜਲਦੀ ਹੀ ਤੁਹਾਡੇ ਨਾਲ ਜੁੜੇਗਾ। ਇਸ ਦੌਰਾਨ, ਤੁਸੀਂ ਆਪਣੇ ਟੀਚਿਆਂ ਦੀ ਖੋਜ ਜਾਰੀ ਰੱਖ ਸਕਦੇ ਹੋ।"
      };
      return messages[lang] || messages[LANGUAGES.HINGLISH];
    },
    ctas: [
      { id: 'continue', label: 'Continue Exploring', next: 'home' },
      { id: 'goal_planning', label: '🎯 Goal Planning', next: 'goal_entry_l1' },
      { id: 'calculator', label: '🧮 Calculator', next: 'sip_calc_entry' }
    ]
  }),

  // Additional nodes for Level 2 branches
  // Level 3: How much should I invest monthly?
  new CTANode({
    id: 'sip_amount_l3',
    intent: INTENTS.BEGINNER_QUERY,
    level: 3,
    requiresLLM: true,
    message: (state) => {
      return "The amount you should invest monthly depends on your goals, income, and expenses. Let me help you determine the right amount...";
    },
    ctas: [
      { id: 'goal_planning', label: '🎯 Start Goal Planning', next: 'goal_entry_l1' },
      { id: 'calculator', label: '🧮 Use Calculator', next: 'sip_calc_entry' },
      { id: 'advisor', label: '🗣️ Talk to Advisor', next: 'advisor_entry' },
      { id: 'back', label: '🔙 Back', next: 'sip_simple_l2' }
    ]
  }),

  // Level 3: Where does SIP money get invested?
  new CTANode({
    id: 'sip_investment_l3',
    intent: INTENTS.PRODUCT_EXPLORATION,
    level: 3,
    requiresLLM: true,
    message: (state) => {
      return "SIP money gets invested in mutual funds, which in turn invest in stocks, bonds, and other securities. Let me explain the investment structure...";
    },
    ctas: [
      { id: 'mf_types', label: '📦 Types of Mutual Funds', next: 'mf_types_l2' },
      { id: 'portfolio', label: '📊 Portfolio Structure', next: 'portfolio_example_l8' },
      { id: 'back', label: '🔙 Back', next: 'sip_simple_l2' }
    ]
  }),

  // Level 3: SIP Example Calculation
  new CTANode({
    id: 'sip_example_calc_l3',
    intent: INTENTS.PRODUCT_EXPLORATION,
    level: 3,
    message: (state) => {
      return "**Example:** ₹5,000/month SIP for 20 years at 12% expected return:\n\n• Total Invested: ₹12,00,000\n• Expected Maturity: ~₹50,00,000\n• Estimated Returns: ~₹38,00,000\n\n*Note: Returns are market-linked and not guaranteed.*";
    },
    ctas: [
      { id: 'calculator', label: '🧮 Calculate Your SIP', next: 'sip_calc_entry' },
      { id: 'goal_planning', label: '🎯 Plan for My Goal', next: 'goal_entry_l1' },
      { id: 'back', label: '🔙 Back', next: 'sip_returns_l2' }
    ]
  }),

  // Level 3: Factors Affecting Returns
  new CTANode({
    id: 'sip_factors_l3',
    intent: INTENTS.PRODUCT_EXPLORATION,
    level: 3,
    requiresLLM: true,
    message: (state) => {
      return "Several factors affect SIP returns: market performance, fund selection, time horizon, and investment discipline. Let me explain each...";
    },
    ctas: [
      { id: 'fund_selection', label: '📊 Fund Selection Tips', next: 'fund_selection_l4' },
      { id: 'time_horizon', label: '⏰ Time Horizon Impact', next: 'time_horizon_l4' },
      { id: 'back', label: '🔙 Back', next: 'sip_returns_l2' }
    ]
  }),

  // Continue exploring node
  new CTANode({
    id: 'continue_exploring',
    intent: 'home',
    level: 0,
    message: (state) => {
      const lang = state.userProfile.language;
      const messages = {
        [LANGUAGES.ENGLISH]: "No problem! Feel free to continue exploring. What would you like to know?",
        [LANGUAGES.HINGLISH]: "Koi baat nahi! Aap explore karte rahein. Aap kya janna chahte hain?",
        [LANGUAGES.HINDI]: "कोई बात नहीं! बेझिझक जारी रखें। आप क्या जानना चाहते हैं?",
        [LANGUAGES.PUNJABI]: "ਕੋਈ ਗੱਲ ਨਹੀਂ! ਬੇਝਿਜਕ ਜਾਰੀ ਰੱਖੋ। ਤੁਸੀਂ ਕੀ ਜਾਣਨਾ ਚਾਹੁੰਦੇ ਹੋ?"
      };
      return messages[lang] || messages[LANGUAGES.HINGLISH];
    },
    ctas: [
      { id: 'home', label: '🏠 Back to Home', next: 'home' },
      { id: 'goal_planning', label: '🎯 Goal Planning', next: 'goal_entry_l1' },
      { id: 'calculator', label: '🧮 Calculator', next: 'sip_calc_entry' }
    ]
  })
];

/**
 * SCENARIO 2: "What is Mutual Fund?" Flow (10 Levels)
 */
export const mutualFundInfoFlow = [
  // Level 1: Introduction
  new CTANode({
    id: 'mf_intro_l1',
    intent: INTENTS.BEGINNER_QUERY,
    level: 1,
    requiresLLM: true,
    message: (state) => {
      const lang = state.userProfile.language;
      const messages = {
        [LANGUAGES.ENGLISH]: "**Mutual Funds** are investment vehicles that pool money from multiple investors to invest in stocks, bonds, and other securities, managed by professional fund managers.",
        [LANGUAGES.HINDI]: "**म्यूचुअल फंड** निवेश के साधन हैं जो कई निवेशकों से पैसा जमा करके शेयर, बॉन्ड और अन्य प्रतिभूतियों में निवेश करते हैं, जिन्हें पेशेवर फंड मैनेजर प्रबंधित करते हैं।",
        [LANGUAGES.HINGLISH]: "**Mutual Funds** ek investment vehicle hai jo multiple investors se paisa pool karke stocks, bonds aur other securities mein invest karta hai, jo professional fund managers manage karte hain.",
        [LANGUAGES.PUNJABI]: "**ਮਿਊਚੁਅਲ ਫੰਡ** ਨਿਵੇਸ਼ ਦੇ ਸਾਧਨ ਹਨ ਜੋ ਕਈ ਨਿਵੇਸ਼ਕਾਂ ਤੋਂ ਪੈਸਾ ਜਮ੍ਹਾ ਕਰਕੇ ਸ਼ੇਅਰ, ਬਾਂਡ ਅਤੇ ਹੋਰ ਪ੍ਰਤਿਭੂਤੀਆਂ ਵਿੱਚ ਨਿਵੇਸ਼ ਕਰਦੇ ਹਨ, ਜਿਨ੍ਹਾਂ ਨੂੰ ਪੇਸ਼ੇਵਰ ਫੰਡ ਮੈਨੇਜਰ ਪ੍ਰਬੰਧਿਤ ਕਰਦੇ ਹਨ।"
      };
      return messages[lang] || messages[LANGUAGES.HINGLISH];
    },
    ctas: [
      { id: 'types', label: '📦 Types of Mutual Funds', next: 'mf_types_l2' },
      { id: 'equity_vs_debt', label: '⚖️ Equity vs Debt vs Hybrid', next: 'mf_comparison_l2' },
      { id: 'risk', label: '⚠️ Risk Comparison', next: 'mf_risk_l2' },
      { id: 'goal_fit', label: '🎯 How to choose for my goal?', next: 'goal_entry_l1' },
      { id: 'back', label: '🔙 Back to Menu', next: 'home' }
    ]
  }),

  // Level 2: Types of Mutual Funds
  new CTANode({
    id: 'mf_types_l2',
    intent: INTENTS.PRODUCT_EXPLORATION,
    level: 2,
    requiresLLM: true,
    message: (state) => {
      return "Let me explain the different types of mutual funds and their characteristics...";
    },
    ctas: [
      { id: 'equity_details', label: '📈 Equity Funds Details', next: 'mf_equity_l3' },
      { id: 'debt_details', label: '🛡️ Debt Funds Details', next: 'mf_debt_l3' },
      { id: 'hybrid_details', label: '⚖️ Hybrid Funds Details', next: 'mf_hybrid_l3' },
      { id: 'which_suitable', label: '🎯 Which is suitable for me?', next: 'risk_profiling_l4' },
      { id: 'back', label: '🔙 Back', next: 'mf_intro_l1' }
    ]
  }),

  // Level 3: Equity Funds
  new CTANode({
    id: 'mf_equity_l3',
    intent: INTENTS.PRODUCT_EXPLORATION,
    level: 3,
    requiresLLM: true,
    message: (state) => {
      return "Equity funds invest primarily in stocks. Let me explain their features, benefits, and risks...";
    },
    ctas: [
      { id: 'equity_benefits', label: '✅ Benefits of Equity Funds', next: 'mf_equity_benefits_l4' },
      { id: 'equity_risks', label: '⚠️ Risks to Consider', next: 'mf_equity_risks_l4' },
      { id: 'equity_suitable', label: '👤 Who Should Invest?', next: 'mf_equity_suitable_l4' },
      { id: 'plan_equity', label: '🎯 Plan Equity Investment', next: 'goal_entry_l1' },
      { id: 'back', label: '🔙 Back', next: 'mf_types_l2' }
    ]
  }),

  // Level 4: Equity Benefits
  new CTANode({
    id: 'mf_equity_benefits_l4',
    intent: INTENTS.PRODUCT_EXPLORATION,
    level: 4,
    requiresLLM: true,
    message: (state) => {
      return "Equity funds offer several benefits for long-term wealth creation...";
    },
    ctas: [
      { id: 'equity_example', label: '💡 See Example', next: 'mf_equity_example_l5' },
      { id: 'calculate_equity', label: '🧮 Calculate Returns', next: 'sip_calc_entry' },
      { id: 'risk_profiling', label: '🛡️ Check My Risk Profile', next: 'risk_profiling_l4' },
      { id: 'back', label: '🔙 Back', next: 'mf_equity_l3' }
    ]
  }),

  // Level 5: Equity Example
  new CTANode({
    id: 'mf_equity_example_l5',
    intent: INTENTS.PRODUCT_EXPLORATION,
    level: 5,
    requiresLLM: true,
    message: (state) => {
      return "Here's a realistic example of how equity funds can help build wealth over time...";
    },
    ctas: [
      { id: 'calculate_sip', label: '🧮 Calculate SIP for Equity', next: 'sip_calc_entry' },
      { id: 'goal_planning', label: '🎯 Start Goal Planning', next: 'goal_entry_l1' },
      { id: 'advisor', label: '👩‍💼 Talk to Advisor', next: 'advisor_entry' },
      { id: 'back', label: '🔙 Back', next: 'mf_equity_benefits_l4' }
    ]
  }),

  // Level 2: Comparison
  new CTANode({
    id: 'mf_comparison_l2',
    intent: INTENTS.PRODUCT_EXPLORATION,
    level: 2,
    requiresLLM: true,
    message: (state) => {
      return "Let me compare Equity, Debt, and Hybrid funds to help you understand the differences...";
    },
    ctas: [
      { id: 'comparison_table', label: '📊 See Comparison Table', next: 'mf_comparison_table_l3' },
      { id: 'which_for_goal', label: '🎯 Which for My Goal?', next: 'goal_entry_l1' },
      { id: 'risk_profiling', label: '🛡️ Check Risk Profile', next: 'risk_profiling_l4' },
      { id: 'back', label: '🔙 Back', next: 'mf_intro_l1' }
    ]
  }),

  // Level 3: Comparison Table
  new CTANode({
    id: 'mf_comparison_table_l3',
    intent: INTENTS.PRODUCT_EXPLORATION,
    level: 3,
    message: (state) => {
      return "**Comparison:**\n\n**Equity Funds:**\n• Higher returns potential (12-15% long-term)\n• Higher risk\n• Best for: Long-term goals (5+ years)\n\n**Debt Funds:**\n• Moderate returns (7-9%)\n• Lower risk\n• Best for: Short-term goals (<3 years)\n\n**Hybrid Funds:**\n• Balanced returns (9-12%)\n• Moderate risk\n• Best for: Medium-term goals (3-7 years)";
    },
    ctas: [
      { id: 'choose_for_goal', label: '🎯 Choose for My Goal', next: 'goal_entry_l1' },
      { id: 'risk_profiling', label: '🛡️ Risk Profiling', next: 'risk_profiling_l4' },
      { id: 'calculate', label: '🧮 Calculate Investment', next: 'sip_calc_entry' },
      { id: 'back', label: '🔙 Back', next: 'mf_comparison_l2' }
    ]
  }),

  // Level 2: Risk Comparison
  new CTANode({
    id: 'mf_risk_l2',
    intent: INTENTS.FEAR_OR_RISK_CONCERN,
    level: 2,
    requiresLLM: true,
    message: (state) => {
      return "Understanding risk in mutual funds is crucial. Let me explain the risk levels...";
    },
    ctas: [
      { id: 'risk_equity', label: '📈 Equity Fund Risks', next: 'mf_risk_equity_l3' },
      { id: 'risk_debt', label: '🛡️ Debt Fund Risks', next: 'mf_risk_debt_l3' },
      { id: 'manage_risk', label: '🛡️ How to Manage Risk?', next: 'mf_risk_manage_l3' },
      { id: 'risk_profiling', label: '📊 My Risk Profile', next: 'risk_profiling_l4' },
      { id: 'back', label: '🔙 Back', next: 'mf_intro_l1' }
    ]
  }),

  // Level 3: Risk Management
  new CTANode({
    id: 'mf_risk_manage_l3',
    intent: INTENTS.FEAR_OR_RISK_CONCERN,
    level: 3,
    requiresLLM: true,
    message: (state) => {
      return "Here are strategies to manage risk in mutual fund investments...";
    },
    ctas: [
      { id: 'diversification', label: '📊 Diversification Strategy', next: 'mf_diversification_l4' },
      { id: 'asset_allocation', label: '⚖️ Asset Allocation', next: 'allocation_l7' },
      { id: 'sip_benefit', label: '💡 SIP Benefits for Risk', next: 'sip_intro_l1' },
      { id: 'advisor', label: '👩‍💼 Advisor Guidance', next: 'advisor_entry' },
      { id: 'back', label: '🔙 Back', next: 'mf_risk_l2' }
    ]
  }),

  // Level 4: Diversification
  new CTANode({
    id: 'mf_diversification_l4',
    intent: INTENTS.PRODUCT_EXPLORATION,
    level: 4,
    requiresLLM: true,
    message: (state) => {
      return "Diversification is key to managing risk. Let me explain how it works...";
    },
    ctas: [
      { id: 'portfolio_example', label: '📊 Example Portfolio', next: 'portfolio_example_l8' },
      { id: 'calculate', label: '🧮 Calculate Diversified SIP', next: 'sip_calc_entry' },
      { id: 'advisor', label: '👩‍💼 Get Personal Advice', next: 'advisor_entry' },
      { id: 'back', label: '🔙 Back', next: 'mf_risk_manage_l3' }
    ]
  })
];

/**
 * SCENARIO 3: Goal Planning Flow
 */
export const goalPlanningFlow = [
  // Level 1: Goal Selection
  new CTANode({
    id: 'goal_entry_l1',
    intent: INTENTS.GOAL_PLANNING,
    level: 1,
    message: (state) => {
      return "**Goal Planning** 🎯\n\nWhat financial goal would you like to plan for?";
    },
    ctas: [
      { id: 'retirement', label: '🏖️ Retirement', next: 'goal_retirement_l2', condition: (state) => { state.updateProfile('goalFocus', 'retirement'); return true; } },
      { id: 'education', label: '🎓 Child Education', next: 'goal_education_l2', condition: (state) => { state.updateProfile('goalFocus', 'child_education'); return true; } },
      { id: 'marriage', label: '💒 Child Marriage', next: 'goal_marriage_l2', condition: (state) => { state.updateProfile('goalFocus', 'child_marriage'); return true; } },
      { id: 'wealth', label: '💰 Wealth Creation', next: 'goal_wealth_l2', condition: (state) => { state.updateProfile('goalFocus', 'wealth_creation'); return true; } },
      { id: 'first_crore', label: '💎 First Crore', next: 'goal_crore_l2', condition: (state) => { state.updateProfile('goalFocus', 'first_crore'); return true; } },
      { id: 'back', label: '🔙 Back', next: 'home' }
    ]
  }),

  // Level 2: Retirement Planning
  new CTANode({
    id: 'goal_retirement_l2',
    intent: INTENTS.GOAL_PLANNING,
    level: 2,
    requiresLLM: true,
    message: (state) => {
      return "Let me help you plan for retirement...";
    },
    ctas: [
      { id: 'time_horizon', label: '⏰ Time Horizon', next: 'goal_time_l3' },
      { id: 'amount', label: '💰 Amount Needed', next: 'goal_amount_l3' },
      { id: 'monthly_invest', label: '📊 Monthly Investment', next: 'goal_monthly_l3' },
      { id: 'back', label: '🔙 Back', next: 'goal_entry_l1' }
    ]
  })
  // Add more levels for each goal type...
];

/**
 * Home/Menu Node
 */
export const homeNode = new CTANode({
  id: 'home',
  intent: 'home',
  level: 0,
  message: (state) => {
    const lang = state.userProfile.language;
    const messages = {
      [LANGUAGES.ENGLISH]: "Hello! 👋 I help you understand investments, SIPs, mutual funds, and plan your financial goals — in simple language.",
      [LANGUAGES.HINDI]: "नमस्ते! 👋 मैं आपको निवेश, SIP, म्यूचुअल फंड समझने और अपने वित्तीय लक्ष्यों की योजना बनाने में मदद करता हूं — सरल भाषा में।",
      [LANGUAGES.HINGLISH]: "Hello! 👋 Main aapko investments, SIPs, mutual funds samajhne aur apne financial goals plan karne mein madad karta hoon — simple language mein.",
      [LANGUAGES.PUNJABI]: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! 👋 ਮੈਂ ਤੁਹਾਡੀ ਨਿਵੇਸ਼, SIP, ਮਿਊਚੁਅਲ ਫੰਡ ਸਮਝਣ ਅਤੇ ਆਪਣੇ ਵਿੱਤੀ ਟੀਚਿਆਂ ਦੀ ਯੋਜਨਾ ਬਣਾਉਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹਾਂ — ਸਧਾਰਨ ਭਾਸ਼ਾ ਵਿੱਚ।"
    };
    return messages[lang] || messages[LANGUAGES.HINGLISH];
  },
  ctas: [
    { id: 'what_is_sip', label: 'What is SIP?', next: 'sip_intro_l1' },
    { id: 'what_is_mf', label: 'What is Mutual Fund?', next: 'mf_intro_l1' },
    { id: 'what_is_equity', label: 'What is Equity Investment?', next: 'equity_intro_l1' },
    { id: 'goal_planning', label: 'Goal Planning', next: 'goal_entry_l1' },
    { id: 'sip_calculator', label: 'SIP Calculator', next: 'sip_calc_entry' },
    { id: 'lumpsum_calculator', label: 'Lumpsum Calculator', next: 'lumpsum_calc_entry' },
    { id: 'talk_to_advisor', label: 'Talk to an Advisor', next: 'advisor_entry' },
    { id: 'visit_website', label: 'Visit Website / Download App', next: 'external_link' }
  ]
});

/**
 * Equity Investment Flow (10 Levels)
 */
export const equityInvestmentFlow = [
  // Level 1: Introduction
  new CTANode({
    id: 'equity_intro_l1',
    intent: INTENTS.BEGINNER_QUERY,
    level: 1,
    requiresLLM: true,
    message: (state) => {
      return "Equity investment means buying shares of companies. Let me explain how it works...";
    },
    ctas: [
      { id: 'equity_benefits', label: '✅ Benefits of Equity', next: 'equity_benefits_l2' },
      { id: 'equity_risks', label: '⚠️ Risks & Volatility', next: 'equity_risks_l2' },
      { id: 'equity_vs_mf', label: '📊 Equity vs Mutual Funds', next: 'equity_vs_mf_l2' },
      { id: 'equity_strategy', label: '📈 Investment Strategy', next: 'equity_strategy_l2' },
      { id: 'back', label: '🔙 Back to Menu', next: 'home' }
    ]
  }),

  // Level 2: Equity Benefits
  new CTANode({
    id: 'equity_benefits_l2',
    intent: INTENTS.PRODUCT_EXPLORATION,
    level: 2,
    requiresLLM: true,
    message: (state) => {
      return "Equity investments offer long-term wealth creation potential through capital appreciation...";
    },
    ctas: [
      { id: 'equity_compounding', label: '💡 Power of Compounding', next: 'equity_compounding_l3' },
      { id: 'equity_example', label: '📊 Real Example', next: 'equity_example_l3' },
      { id: 'equity_suitable', label: '👤 Who Should Invest?', next: 'equity_suitable_l3' },
      { id: 'back', label: '🔙 Back', next: 'equity_intro_l1' }
    ]
  }),

  // Level 3: Compounding
  new CTANode({
    id: 'equity_compounding_l3',
    intent: INTENTS.PRODUCT_EXPLORATION,
    level: 3,
    requiresLLM: true,
    message: (state) => {
      return "Compounding is the key to wealth creation. Let me explain how it works with equity...";
    },
    ctas: [
      { id: 'equity_calc', label: '🧮 Calculate Returns', next: 'sip_calc_entry' },
      { id: 'equity_portfolio', label: '📊 Portfolio Role', next: 'portfolio_example_l8' },
      { id: 'equity_strategy', label: '📈 Investment Strategy', next: 'equity_strategy_l2' },
      { id: 'back', label: '🔙 Back', next: 'equity_benefits_l2' }
    ]
  }),

  // Level 2: Equity Risks
  new CTANode({
    id: 'equity_risks_l2',
    intent: INTENTS.FEAR_OR_RISK_CONCERN,
    level: 2,
    requiresLLM: true,
    message: (state) => {
      return "Equity investments come with volatility. Understanding and managing risk is crucial...";
    },
    ctas: [
      { id: 'equity_volatility', label: '📉 Understanding Volatility', next: 'equity_volatility_l3' },
      { id: 'equity_manage_risk', label: '🛡️ Managing Risk', next: 'equity_manage_risk_l3' },
      { id: 'equity_time', label: '⏰ Time Horizon Matters', next: 'equity_time_l3' },
      { id: 'back', label: '🔙 Back', next: 'equity_intro_l1' }
    ]
  }),

  // Level 3: Volatility
  new CTANode({
    id: 'equity_volatility_l3',
    intent: INTENTS.FEAR_OR_RISK_CONCERN,
    level: 3,
    requiresLLM: true,
    message: (state) => {
      return "Volatility is normal in equity markets. Short-term fluctuations don't affect long-term returns...";
    },
    ctas: [
      { id: 'equity_sip_benefit', label: '💡 SIP Reduces Risk', next: 'sip_intro_l1' },
      { id: 'equity_allocation', label: '⚖️ Asset Allocation', next: 'allocation_l7' },
      { id: 'equity_advisor', label: '👩‍💼 Advisor Guidance', next: 'advisor_entry' },
      { id: 'back', label: '🔙 Back', next: 'equity_risks_l2' }
    ]
  }),

  // Level 2: Equity Strategy
  new CTANode({
    id: 'equity_strategy_l2',
    intent: INTENTS.PRODUCT_EXPLORATION,
    level: 2,
    requiresLLM: true,
    message: (state) => {
      return "A good equity investment strategy involves SIP, diversification, and long-term focus...";
    },
    ctas: [
      { id: 'equity_sip', label: '📊 SIP Strategy', next: 'sip_intro_l1' },
      { id: 'equity_allocation', label: '⚖️ Asset Allocation', next: 'allocation_l7' },
      { id: 'equity_portfolio', label: '📊 Portfolio Example', next: 'portfolio_example_l8' },
      { id: 'back', label: '🔙 Back', next: 'equity_intro_l1' }
    ]
  })
];

/**
 * Register all flows
 */
export function registerAllFlows(flowController) {
  flowController.registerFlow('sip_info', sipInfoFlow);
  flowController.registerFlow('mutual_fund_info', mutualFundInfoFlow);
  flowController.registerFlow('goal_planning', goalPlanningFlow);
  flowController.registerFlow('equity_investment', equityInvestmentFlow);
  flowController.registerFlow('home', [homeNode]);
}

