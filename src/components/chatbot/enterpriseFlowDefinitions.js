// ============================================
// ENTERPRISE FLOW DEFINITIONS
// ============================================
// Comprehensive CTA → AI Instruction → Next CTA JSON Map
// Structured for enterprise-grade conversational design

import { INTENTS, LANGUAGES } from './arthAI';
import { CTANode } from './conversationEngine';

/**
 * Intent Mapping: Maps flow intents to system intents
 */
const INTENT_MAP = {
  // Mutual Fund Flow Intents
  'mutual_fund_intro_level_1': INTENTS.BEGINNER_QUERY,
  'mutual_fund_simple_explanation_level_2': INTENTS.BEGINNER_QUERY,
  'mutual_fund_types_level_3': INTENTS.PRODUCT_EXPLORATION,
  'mutual_fund_time_risk_alignment_level_4': INTENTS.PRODUCT_EXPLORATION,
  'asset_allocation_concept_level_5': INTENTS.PRODUCT_EXPLORATION,
  'sample_allocation_education_level_6': INTENTS.PRODUCT_EXPLORATION,
  'investor_behaviour_guidance_level_7': INTENTS.GENERAL_FINANCE_QUESTION,
  'readiness_check_explanation_level_8': INTENTS.LEAD_CAPTURE_OPPORTUNITY,
  'advisory_support_value_level_9': INTENTS.LEAD_CAPTURE_OPPORTUNITY,
  'conversion_reassurance_close_level_10': INTENTS.LEAD_CAPTURE_OPPORTUNITY,

  // Equity Investment Flow Intents
  'equity_intro_level_1': INTENTS.BEGINNER_QUERY,
  'equity_simple_explanation_level_2': INTENTS.BEGINNER_QUERY,
  'equity_return_expectation_level_3': INTENTS.PRODUCT_EXPLORATION,
  'equity_psychology_guidance_level_4': INTENTS.FEAR_OR_RISK_CONCERN,
  'equity_use_case_mapping_level_5': INTENTS.GOAL_PLANNING,
  'equity_allocation_concept_level_6': INTENTS.PRODUCT_EXPLORATION,
  'equity_sip_vs_lumpsum_level_7': INTENTS.PRODUCT_EXPLORATION,
  'equity_reality_reminder_level_8': INTENTS.GENERAL_FINANCE_QUESTION,
  'equity_soft_lead_engagement_level_9': INTENTS.LEAD_CAPTURE_OPPORTUNITY,
  'equity_conversation_close_level_10': INTENTS.LEAD_CAPTURE_OPPORTUNITY,

  // Goal Planning Intents
  'goal_planning_intro': INTENTS.GOAL_PLANNING,
  'goal_time_horizon_prompt': INTENTS.GOAL_PLANNING,
  'goal_target_amount_prompt': INTENTS.GOAL_PLANNING,
  'affordability_explanation': INTENTS.GOAL_PLANNING,
  'goal_sip_lumpsum_explanation': INTENTS.GOAL_PLANNING,
  'goal_allocation_guidance': INTENTS.GOAL_PLANNING,
  'projection_example_explanation': INTENTS.GOAL_PLANNING,
  'goal_risk_explanation': INTENTS.FEAR_OR_RISK_CONCERN,
  'goal_soft_lead_prompt': INTENTS.LEAD_CAPTURE_OPPORTUNITY,
  'goal_continue_learning': INTENTS.GENERAL_FINANCE_QUESTION,

  // Calculator Intents
  'sip_amount_choice_instruction': INTENTS.CALCULATOR,
  'sip_return_expectation_instruction': INTENTS.CALCULATOR,
  'sip_tenure_selection_instruction': INTENTS.CALCULATOR,
  'sip_calc_result_explanation': INTENTS.CALCULATOR,
  'sip_increase_effect_explanation': INTENTS.CALCULATOR,
  'lumpsum_result_explanation': INTENTS.CALCULATOR,

  // Wealth Creation Intents
  'first_crore_reality_check': INTENTS.GOAL_PLANNING,
  'wealth_discipline_framework_explanation': INTENTS.GOAL_PLANNING,
  'equity_allocation_role_explanation': INTENTS.PRODUCT_EXPLORATION,
  'sip_roadmap_example_explanation': INTENTS.GOAL_PLANNING,
  'inflation_awareness_message': INTENTS.GENERAL_FINANCE_QUESTION,
  'wealth_conversion_bridge_message': INTENTS.LEAD_CAPTURE_OPPORTUNITY,

  // Risk Profiling Intents
  'risk_question_flow_explanation': INTENTS.FEAR_OR_RISK_CONCERN,
  'risk_profile_awareness_message': INTENTS.FEAR_OR_RISK_CONCERN,

  // Lead Capture Intents
  'lead_capture_name': INTENTS.LEAD_CAPTURE_OPPORTUNITY,
  'lead_capture_contact': INTENTS.LEAD_CAPTURE_OPPORTUNITY,
  'lead_capture_city': INTENTS.LEAD_CAPTURE_OPPORTUNITY,
  'lead_capture_goal': INTENTS.LEAD_CAPTURE_OPPORTUNITY,
  'lead_capture_time': INTENTS.LEAD_CAPTURE_OPPORTUNITY,
  'lead_confirmation_acknowledgement': INTENTS.LEAD_CAPTURE_OPPORTUNITY,
  'advisor_trust_reassurance_message': INTENTS.LEAD_CAPTURE_OPPORTUNITY,

  // Learning Path Intents
  'compounding_concept_explanation': INTENTS.BEGINNER_QUERY,
  'market_timing_warning_message': INTENTS.FEAR_OR_RISK_CONCERN,
  'saving_investing_difference_explanation': INTENTS.BEGINNER_QUERY,
  'behavioural_mistakes_explanation': INTENTS.GENERAL_FINANCE_QUESTION,
  'portfolio_mindset_explanation': INTENTS.PRODUCT_EXPLORATION,
  'goal_based_investing_benefit_message': INTENTS.GOAL_PLANNING,

  // Market Fear Support Intents
  'market_emotion_support_coach': INTENTS.FEAR_OR_RISK_CONCERN,
  'market_fluctuation_explanation': INTENTS.FEAR_OR_RISK_CONCERN,
  'discipline_patience_support_message': INTENTS.FEAR_OR_RISK_CONCERN,
  'continue_sip_awareness_message': INTENTS.FEAR_OR_RISK_CONCERN,
  'risk_alignment_reassurance_message': INTENTS.FEAR_OR_RISK_CONCERN,
  'advisor_support_option_message': INTENTS.LEAD_CAPTURE_OPPORTUNITY
};

/**
 * Get system intent from flow intent
 */
export function getSystemIntent(flowIntent) {
  return INTENT_MAP[flowIntent] || INTENTS.GENERAL_FINANCE_QUESTION;
}

/**
 * WHAT IS MUTUAL FUND Flow (10 Levels)
 */
export const whatIsMutualFundFlow = [
  // Level 1: Introduction
  new CTANode({
    id: 'what_is_mf_level_1',
    intent: getSystemIntent('mutual_fund_intro_level_1'),
    level: 1,
    requiresLLM: true,
    message: (state) => {
      const lang = state.userProfile.language;
      const messages = {
        [LANGUAGES.ENGLISH]: "Let me explain what mutual funds are and how they work...",
        [LANGUAGES.HINGLISH]: "Main aapko batata hoon mutual funds kya hain aur kaise kaam karte hain...",
        [LANGUAGES.HINDI]: "मैं आपको बताता हूं कि म्यूचुअल फंड क्या हैं और वे कैसे काम करते हैं...",
        [LANGUAGES.PUNJABI]: "ਮੈਂ ਤੁਹਾਨੂੰ ਦੱਸਦਾ ਹਾਂ ਕਿ ਮਿਊਚੁਅਲ ਫੰਡ ਕੀ ਹਨ ਅਤੇ ਉਹ ਕਿਵੇਂ ਕੰਮ ਕਰਦੇ ਹਨ..."
      };
      return messages[lang] || messages[LANGUAGES.HINGLISH];
    },
    ctas: [
      { id: 'explain_simple', label: '💡 Explain in Simple Terms', next: 'what_is_mf_level_2_explain_simple' },
      { id: 'mf_types', label: '📦 Types of Mutual Funds', next: 'what_is_mf_level_3_types' },
      { id: 'mf_safety', label: '🛡️ Is Mutual Fund Safe?', next: 'what_is_mf_level_2_explain_simple' },
      { id: 'money_invested', label: '💰 Where is Money Invested?', next: 'what_is_mf_level_2_explain_simple' },
      { id: 'back_menu', label: '🔙 Back to Menu', next: 'home' }
    ]
  }),

  // Level 2: Simple Explanation
  new CTANode({
    id: 'what_is_mf_level_2_explain_simple',
    intent: getSystemIntent('mutual_fund_simple_explanation_level_2'),
    level: 2,
    requiresLLM: true,
    message: (state) => {
      return "Let me explain mutual funds in simple, relatable terms...";
    },
    ctas: [
      { id: 'sip_vs_mf', label: '📊 SIP vs Mutual Fund', next: 'what_is_mf_level_2_explain_simple' },
      { id: 'returns_generated', label: '📈 How Returns are Generated', next: 'what_is_mf_level_3_types' },
      { id: 'risk_in_mf', label: '⚠️ Risk in Mutual Funds', next: 'what_is_mf_level_4_risk_time' },
      { id: 'should_i_start', label: '🎯 Should I Start?', next: 'what_is_mf_level_8_readiness' }
    ]
  }),

  // Level 3: Types
  new CTANode({
    id: 'what_is_mf_level_3_types',
    intent: getSystemIntent('mutual_fund_types_level_3'),
    level: 3,
    requiresLLM: true,
    message: (state) => {
      return "There are different types of mutual funds. Let me explain...";
    },
    ctas: [
      { id: 'which_is_right', label: '🎯 Which is Right for Me?', next: 'what_is_mf_level_4_risk_time' },
      { id: 'simple_comparison', label: '⚖️ Simple Comparison', next: 'what_is_mf_level_3_types' },
      { id: 'risk_vs_time', label: '⏰ Risk vs Time Horizon', next: 'what_is_mf_level_4_risk_time' },
      { id: 'goal_use_cases', label: '🎯 Goal-Based Use Cases', next: 'what_is_mf_level_5_allocation' }
    ]
  }),

  // Level 4: Risk & Time Alignment
  new CTANode({
    id: 'what_is_mf_level_4_risk_time',
    intent: getSystemIntent('mutual_fund_time_risk_alignment_level_4'),
    level: 4,
    requiresLLM: true,
    message: (state) => {
      return "Understanding the relationship between risk, time horizon, and mutual fund selection...";
    },
    ctas: [
      { id: 'long_term', label: '📅 Long-term Strategy', next: 'what_is_mf_level_5_allocation' },
      { id: 'short_term', label: '⏱️ Short-term Strategy', next: 'what_is_mf_level_5_allocation' },
      { id: 'balanced_approach', label: '⚖️ Balanced Approach', next: 'what_is_mf_level_5_allocation' },
      { id: 'asset_allocation_intro', label: '📊 Asset Allocation Intro', next: 'what_is_mf_level_5_allocation' }
    ]
  }),

  // Level 5: Asset Allocation Concept
  new CTANode({
    id: 'what_is_mf_level_5_allocation',
    intent: getSystemIntent('asset_allocation_concept_level_5'),
    level: 5,
    requiresLLM: true,
    message: (state) => {
      return "Asset allocation is key to managing risk and returns. Let me explain...";
    },
    ctas: [
      { id: 'example_allocation', label: '💡 Example Allocation', next: 'what_is_mf_level_6_example_allocation' },
      { id: 'why_allocation_matters', label: '❓ Why Allocation Matters', next: 'what_is_mf_level_6_example_allocation' },
      { id: 'calculate_sip_for_plan', label: '🧮 Calculate SIP for Plan', next: 'sip_calc_entry' },
      { id: 'talk_to_advisor', label: '👩‍💼 Talk to Advisor', next: 'talk_to_advisor_step_1_name' }
    ]
  }),

  // Level 6: Example Allocation
  new CTANode({
    id: 'what_is_mf_level_6_example_allocation',
    intent: getSystemIntent('sample_allocation_education_level_6'),
    level: 6,
    requiresLLM: true,
    message: (state) => {
      return "Here's an example allocation based on different risk profiles...";
    },
    ctas: [
      { id: 'sip_simulation', label: '🧮 SIP Simulation', next: 'sip_calc_entry' },
      { id: 'goal_planning', label: '🎯 Goal Planning', next: 'goal_planning_select_goal' },
      { id: 'risk_profile', label: '🛡️ Risk Profiling', next: 'risk_profiling_questionnaire_flow' },
      { id: 'continue_learning', label: '📚 Continue Learning', next: 'what_is_mf_level_7_behaviour' }
    ]
  }),

  // Level 7: Investor Behaviour Guidance
  new CTANode({
    id: 'what_is_mf_level_7_behaviour',
    intent: getSystemIntent('investor_behaviour_guidance_level_7'),
    level: 7,
    requiresLLM: true,
    message: (state) => {
      return "Understanding investor behavior and common mistakes...";
    },
    ctas: [
      { id: 'why_timing_fails', label: '⏰ Why Timing Fails', next: 'what_is_mf_level_7_behaviour' },
      { id: 'how_compounding_works', label: '💡 How Compounding Works', next: 'what_is_mf_level_7_behaviour' },
      { id: 'investor_mistakes', label: '⚠️ Common Mistakes', next: 'what_is_mf_level_7_behaviour' },
      { id: 'continue', label: '➡️ Continue', next: 'what_is_mf_level_8_readiness' }
    ]
  }),

  // Level 8: Readiness Check
  new CTANode({
    id: 'what_is_mf_level_8_readiness',
    intent: getSystemIntent('readiness_check_explanation_level_8'),
    level: 8,
    requiresLLM: true,
    message: (state) => {
      return "Let's check if you're ready to start investing...";
    },
    ctas: [
      { id: 'ready_to_invest', label: '✅ Ready to Invest', next: 'what_is_mf_level_9_soft_lead' },
      { id: 'still_exploring', label: '🔍 Still Exploring', next: 'what_is_mf_level_7_behaviour' },
      { id: 'already_investing', label: '💰 Already Investing', next: 'what_is_mf_level_9_soft_lead' }
    ]
  }),

  // Level 9: Soft Lead Capture
  new CTANode({
    id: 'what_is_mf_level_9_soft_lead',
    intent: getSystemIntent('advisory_support_value_level_9'),
    level: 9,
    requiresLLM: true,
    requiresContactForm: true,
    message: (state) => {
      return "Our advisors can help you create a personalized investment plan. Would you like to connect?";
    },
    ctas: [
      { id: 'share_contact', label: '📞 Share Contact', next: 'talk_to_advisor_step_1_name' },
      { id: 'continue_exploring', label: '🔍 Continue Exploring', next: 'what_is_mf_level_10_close' }
    ]
  }),

  // Level 10: Close
  new CTANode({
    id: 'what_is_mf_level_10_close',
    intent: getSystemIntent('conversion_reassurance_close_level_10'),
    level: 10,
    requiresLLM: true,
    message: (state) => {
      return "Thank you for exploring mutual funds with me. How can I help you further?";
    },
    ctas: [
      { id: 'explore_goals', label: '🎯 Explore Goals', next: 'goal_planning_select_goal' },
      { id: 'use_calculator', label: '🧮 Use Calculator', next: 'sip_calc_entry' },
      { id: 'back_menu', label: '🔙 Back to Menu', next: 'home' }
    ]
  })
];

/**
 * EQUITY INVESTMENT Flow (10 Levels)
 */
export const equityInvestmentFlow = [
  // Level 1: Introduction
  new CTANode({
    id: 'equity_investment_level_1_intro',
    intent: getSystemIntent('equity_intro_level_1'),
    level: 1,
    requiresLLM: true,
    message: (state) => {
      return "Let me explain equity investment and how it works...";
    },
    ctas: [
      { id: 'explain_simple', label: '💡 Explain Simply', next: 'equity_investment_level_2_simple' },
      { id: 'equity_risk', label: '⚠️ Equity Risk', next: 'equity_investment_level_2_simple' },
      { id: 'why_equity', label: '❓ Why Equity?', next: 'equity_investment_level_3_expectation' },
      { id: 'sip_vs_lumpsum_equity', label: '📊 SIP vs Lumpsum', next: 'equity_investment_level_7_sip_vs_lumpsum' }
    ]
  }),

  // Level 2: Simple Explanation
  new CTANode({
    id: 'equity_investment_level_2_simple',
    intent: getSystemIntent('equity_simple_explanation_level_2'),
    level: 2,
    requiresLLM: true,
    message: (state) => {
      return "Equity investment in simple terms...";
    },
    ctas: [
      { id: 'high_returns_question', label: '📈 High Returns?', next: 'equity_investment_level_3_expectation' },
      { id: 'value_fluctuation', label: '📉 Value Fluctuation', next: 'equity_investment_level_4_psychology' },
      { id: 'is_it_suitable', label: '👤 Is it Suitable?', next: 'equity_investment_level_5_use_cases' }
    ]
  }),

  // Level 3: Return Expectation
  new CTANode({
    id: 'equity_investment_level_3_expectation',
    intent: getSystemIntent('equity_return_expectation_level_3'),
    level: 3,
    requiresLLM: true,
    message: (state) => {
      return "Understanding realistic return expectations from equity...";
    },
    ctas: [
      { id: 'how_much_equity', label: '💰 How Much Equity?', next: 'equity_investment_level_6_allocation_conceptual' },
      { id: 'role_of_allocation', label: '⚖️ Role of Allocation', next: 'equity_investment_level_6_allocation_conceptual' },
      { id: 'show_example_mix', label: '💡 Show Example Mix', next: 'equity_investment_level_6_allocation_conceptual' }
    ]
  }),

  // Level 4: Psychology Guidance
  new CTANode({
    id: 'equity_investment_level_4_psychology',
    intent: getSystemIntent('equity_psychology_guidance_level_4'),
    level: 4,
    requiresLLM: true,
    message: (state) => {
      return "Understanding the psychology of equity investing...";
    },
    ctas: [
      { id: 'avoid_emotional_investing', label: '🧠 Avoid Emotional Investing', next: 'equity_investment_level_4_psychology' },
      { id: 'discipline_habit', label: '💪 Discipline & Habit', next: 'equity_investment_level_5_use_cases' },
      { id: 'equity_mistakes', label: '⚠️ Common Mistakes', next: 'equity_investment_level_4_psychology' }
    ]
  }),

  // Level 5: Use Cases
  new CTANode({
    id: 'equity_investment_level_5_use_cases',
    intent: getSystemIntent('equity_use_case_mapping_level_5'),
    level: 5,
    requiresLLM: true,
    message: (state) => {
      return "Equity investment use cases for different goals...";
    },
    ctas: [
      { id: 'wealth_creation', label: '💰 Wealth Creation', next: 'equity_investment_level_6_allocation_conceptual' },
      { id: 'retirement_planning', label: '🏖️ Retirement Planning', next: 'equity_investment_level_6_allocation_conceptual' },
      { id: 'child_future_planning', label: '🎓 Child Future Planning', next: 'equity_investment_level_6_allocation_conceptual' },
      { id: 'short_term_warning', label: '⚠️ Short-term Warning', next: 'equity_investment_level_4_psychology' }
    ]
  }),

  // Level 6: Allocation Concept
  new CTANode({
    id: 'equity_investment_level_6_allocation_conceptual',
    intent: getSystemIntent('equity_allocation_concept_level_6'),
    level: 6,
    requiresLLM: true,
    message: (state) => {
      return "Understanding equity allocation in a portfolio...";
    },
    ctas: [
      { id: 'show_sip_example', label: '💡 Show SIP Example', next: 'sip_calc_entry' },
      { id: 'hybrid_allocation', label: '⚖️ Hybrid Allocation', next: 'equity_investment_level_7_sip_vs_lumpsum' },
      { id: 'risk_profiling', label: '🛡️ Risk Profiling', next: 'risk_profiling_questionnaire_flow' }
    ]
  }),

  // Level 7: SIP vs Lumpsum
  new CTANode({
    id: 'equity_investment_level_7_sip_vs_lumpsum',
    intent: getSystemIntent('equity_sip_vs_lumpsum_level_7'),
    level: 7,
    requiresLLM: true,
    message: (state) => {
      return "SIP vs Lumpsum for equity investment...";
    },
    ctas: [
      { id: 'which_is_right', label: '🎯 Which is Right?', next: 'equity_investment_level_7_sip_vs_lumpsum' },
      { id: 'sip_benefits', label: '✅ SIP Benefits', next: 'equity_investment_level_8_reality' },
      { id: 'lumpsum_behavior', label: '💰 Lumpsum Behavior', next: 'equity_investment_level_8_reality' }
    ]
  }),

  // Level 8: Reality Reminder
  new CTANode({
    id: 'equity_investment_level_8_reality',
    intent: getSystemIntent('equity_reality_reminder_level_8'),
    level: 8,
    requiresLLM: true,
    message: (state) => {
      return "Important reminders about equity investment reality...";
    },
    ctas: [
      { id: 'plan_wealth_goal', label: '🎯 Plan Wealth Goal', next: 'goal_planning_select_goal' },
      { id: 'start_sip_journey', label: '🚀 Start SIP Journey', next: 'sip_calc_entry' },
      { id: 'talk_to_advisor', label: '👩‍💼 Talk to Advisor', next: 'talk_to_advisor_step_1_name' }
    ]
  }),

  // Level 9: Soft Lead Capture
  new CTANode({
    id: 'equity_investment_level_9_lead_capture',
    intent: getSystemIntent('equity_soft_lead_engagement_level_9'),
    level: 9,
    requiresLLM: true,
    requiresContactForm: true,
    message: (state) => {
      return "Would you like personalized guidance for your equity investment journey?";
    },
    ctas: [
      { id: 'share_contact', label: '📞 Share Contact', next: 'talk_to_advisor_step_1_name' },
      { id: 'continue_learning', label: '📚 Continue Learning', next: 'equity_investment_level_10_close' }
    ]
  }),

  // Level 10: Close
  new CTANode({
    id: 'equity_investment_level_10_close',
    intent: getSystemIntent('equity_conversation_close_level_10'),
    level: 10,
    requiresLLM: true,
    message: (state) => {
      return "Thank you for learning about equity investment. What would you like to explore next?";
    },
    ctas: [
      { id: 'explore_more_topics', label: '🔍 Explore More Topics', next: 'home' },
      { id: 'back_menu', label: '🔙 Back to Menu', next: 'home' }
    ]
  })
];

/**
 * GOAL PLANNING Flow
 */
export const goalPlanningFlow = [
  // Select Goal
  new CTANode({
    id: 'goal_planning_select_goal',
    intent: getSystemIntent('goal_planning_intro'),
    level: 1,
    requiresLLM: true,
    message: (state) => {
      return "What financial goal would you like to plan for?";
    },
    ctas: [
      { id: 'retirement', label: '🏖️ Retirement', next: 'goal_planning_generic_flow' },
      { id: 'child_education', label: '🎓 Child Education', next: 'goal_planning_generic_flow' },
      { id: 'child_marriage', label: '💒 Child Marriage', next: 'goal_planning_generic_flow' },
      { id: 'wealth_creation', label: '💰 Wealth Creation', next: 'goal_planning_generic_flow' },
      { id: 'first_crore', label: '💎 First Crore', next: 'start_investing_first_crore_aspiration_validation' }
    ]
  }),

  // Generic Goal Flow
  new CTANode({
    id: 'goal_planning_generic_flow',
    intent: getSystemIntent('goal_time_horizon_prompt'),
    level: 2,
    requiresLLM: true,
    message: (state) => {
      return "Let's plan your goal step by step. First, what's your time horizon?";
    },
    ctas: [
      { id: 'time_horizon', label: '⏰ Time Horizon', next: 'goal_planning_generic_flow' },
      { id: 'target_amount', label: '💰 Target Amount', next: 'goal_planning_generic_flow' },
      { id: 'affordability', label: '💵 Affordability Check', next: 'goal_planning_generic_flow' },
      { id: 'sip_vs_lumpsum', label: '📊 SIP vs Lumpsum', next: 'goal_planning_generic_flow' },
      { id: 'allocation', label: '⚖️ Allocation Concept', next: 'goal_planning_generic_flow' },
      { id: 'projection', label: '📈 Projection Example', next: 'goal_planning_generic_flow' },
      { id: 'risk_awareness', label: '⚠️ Risk Awareness', next: 'goal_planning_generic_flow' },
      { id: 'soft_lead', label: '📞 Soft Lead Capture', next: 'talk_to_advisor_step_1_name' },
      { id: 'continue_learning', label: '📚 Continue Learning', next: 'home' }
    ]
  })
];

/**
 * SIP CALCULATOR Flow
 */
export const sipCalculatorFlow = [
  new CTANode({
    id: 'sip_calc_entry',
    intent: getSystemIntent('sip_amount_choice_instruction'),
    level: 1,
    action: 'open_calculator',
    message: (state) => {
      return "Let's calculate your SIP. First, choose your monthly investment amount.";
    },
    ctas: [
      { id: 'amount_select', label: '💰 Amount Selection', next: 'sip_calc_step_2_return_select' },
      { id: 'return_select', label: '📈 Return Selection', next: 'sip_calc_step_3_tenure_select' },
      { id: 'tenure_select', label: '⏰ Tenure Selection', next: 'sip_calc_result_explanation' }
    ]
  }),

  new CTANode({
    id: 'sip_calc_result_explanation',
    intent: getSystemIntent('sip_calc_result_explanation'),
    level: 2,
    requiresLLM: true,
    message: (state) => {
      return "Here's your SIP calculation result with detailed explanation...";
    },
    ctas: [
      { id: 'step_up_sip', label: '📈 Step-up SIP', next: 'sip_calc_step_up_explanation' },
      { id: 'link_goal_planning', label: '🎯 Link to Goal Planning', next: 'goal_planning_select_goal' },
      { id: 'talk_to_advisor', label: '👩‍💼 Talk to Advisor', next: 'talk_to_advisor_step_1_name' }
    ]
  }),

  new CTANode({
    id: 'sip_calc_step_up_explanation',
    intent: getSystemIntent('sip_increase_effect_explanation'),
    level: 3,
    requiresLLM: true,
    message: (state) => {
      return "Step-up SIP can significantly increase your returns. Let me explain...";
    },
    ctas: [
      { id: 'calculate_stepup', label: '🧮 Calculate Step-up', next: 'sip_calc_entry' },
      { id: 'back', label: '🔙 Back', next: 'sip_calc_result_explanation' }
    ]
  })
];

/**
 * TALK TO ADVISOR Flow (Lead Capture)
 */
export const talkToAdvisorFlow = [
  new CTANode({
    id: 'talk_to_advisor_step_1_name',
    intent: getSystemIntent('lead_capture_name'),
    level: 1,
    requiresContactForm: true,
    message: (state) => {
      return "I'd love to connect you with our expert advisors. Please share your name.";
    },
    ctas: [
      { id: 'next', label: '➡️ Next', next: 'talk_to_advisor_step_2_contact' }
    ]
  }),

  new CTANode({
    id: 'talk_to_advisor_step_2_contact',
    intent: getSystemIntent('lead_capture_contact'),
    level: 2,
    requiresContactForm: true,
    message: (state) => {
      return "Please share your phone number or email.";
    },
    ctas: [
      { id: 'next', label: '➡️ Next', next: 'talk_to_advisor_step_3_city' }
    ]
  }),

  new CTANode({
    id: 'talk_to_advisor_step_3_city',
    intent: getSystemIntent('lead_capture_city'),
    level: 3,
    requiresContactForm: true,
    message: (state) => {
      return "Which city are you from?";
    },
    ctas: [
      { id: 'next', label: '➡️ Next', next: 'talk_to_advisor_step_4_goal_reason' }
    ]
  }),

  new CTANode({
    id: 'talk_to_advisor_step_4_goal_reason',
    intent: getSystemIntent('lead_capture_goal'),
    level: 4,
    requiresContactForm: true,
    message: (state) => {
      return "What's your primary investment goal?";
    },
    ctas: [
      { id: 'next', label: '➡️ Next', next: 'talk_to_advisor_step_5_time_preference' }
    ]
  }),

  new CTANode({
    id: 'talk_to_advisor_step_5_time_preference',
    intent: getSystemIntent('lead_capture_time'),
    level: 5,
    requiresContactForm: true,
    message: (state) => {
      return "When would you prefer to be contacted?";
    },
    ctas: [
      { id: 'submit', label: '✅ Submit', next: 'talk_to_advisor_confirmation_message' }
    ]
  }),

  new CTANode({
    id: 'talk_to_advisor_confirmation_message',
    intent: getSystemIntent('lead_confirmation_acknowledgement'),
    level: 6,
    message: (state) => {
      return "Thank you! Our advisor will connect with you soon.";
    },
    ctas: [
      { id: 'continue', label: '➡️ Continue Exploring', next: 'home' }
    ]
  }),

  new CTANode({
    id: 'talk_to_advisor_trust_message',
    intent: getSystemIntent('advisor_trust_reassurance_message'),
    level: 7,
    requiresLLM: true,
    message: (state) => {
      return "Our advisors are here to help you make informed investment decisions.";
    },
    ctas: [
      { id: 'back', label: '🔙 Back', next: 'home' }
    ]
  })
];

/**
 * Register all enterprise flows
 */
export function registerEnterpriseFlows(flowController) {
  flowController.registerFlow('what_is_mutual_fund', whatIsMutualFundFlow);
  flowController.registerFlow('equity_investment', equityInvestmentFlow);
  flowController.registerFlow('goal_planning', goalPlanningFlow);
  flowController.registerFlow('sip_calculator', sipCalculatorFlow);
  flowController.registerFlow('talk_to_advisor', talkToAdvisorFlow);
}

/**
 * Export intent map for LLM agent
 */
export { INTENT_MAP };

