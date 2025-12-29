// ============================================
// CTA FLOW DEFINITIONS - JSON-Based Enterprise Architecture
// ============================================
// Complete coverage of all flows with structured intents and CTAs
// Maps JSON structure to CTANode instances for conversation engine

import { INTENTS, LANGUAGES } from './arthAI';
import { CTANode } from './conversationEngine';

/**
 * Intent Mapping: Maps flow intents to system intents
 * This allows the LLM agent to understand the specific context
 */
const INTENT_MAP = {
  // Mutual Fund Flow Intents
  'mutual_fund_intro_level_1': INTENTS.PRODUCT_EXPLORATION,
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
  'equity_intro_level_1': INTENTS.PRODUCT_EXPLORATION,
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

  // SIP Calculator Intents
  'sip_amount_choice_instruction': INTENTS.CALCULATOR,
  'sip_return_expectation_instruction': INTENTS.CALCULATOR,
  'sip_tenure_selection_instruction': INTENTS.CALCULATOR,
  'sip_calc_result_explanation': INTENTS.CALCULATOR,
  'sip_increase_effect_explanation': INTENTS.CALCULATOR,

  // Lumpsum Calculator Intents
  'lumpsum_result_explanation': INTENTS.CALCULATOR,

  // First Crore Intents
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

  // Wealth Learning Path Intents
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
  'advisor_support_option_message': INTENTS.LEAD_CAPTURE_OPPORTUNITY,
};

/**
 * Get system intent from flow intent
 */
function getSystemIntent(flowIntent) {
  return INTENT_MAP[flowIntent] || INTENTS.GENERAL_FINANCE_QUESTION;
}

/**
 * Generate multilingual message based on intent
 */
function generateMessage(intent, language) {
  const lang = language || LANGUAGES.HINGLISH;
  
  // Base messages for each intent type
  const messages = {
    [LANGUAGES.HINGLISH]: {
      'mutual_fund_intro_level_1': "Main aapko mutual funds ke baare mein explain karta hoon...",
      'mutual_fund_simple_explanation_level_2': "Simple terms mein, mutual fund ek professional manager ke through investment hai...",
      'equity_intro_level_1': "Equity investment ke baare mein detail mein batata hoon...",
      'goal_planning_intro': "Aapke financial goals ke liye planning karte hain...",
      'sip_amount_choice_instruction': "SIP calculator mein monthly amount select karein...",
    },
    [LANGUAGES.ENGLISH]: {
      'mutual_fund_intro_level_1': "Let me explain mutual funds to you...",
      'mutual_fund_simple_explanation_level_2': "In simple terms, a mutual fund is an investment through a professional manager...",
      'equity_intro_level_1': "Let me explain equity investment in detail...",
      'goal_planning_intro': "Let's plan for your financial goals...",
      'sip_amount_choice_instruction': "Select monthly amount in SIP calculator...",
    },
    [LANGUAGES.HINDI]: {
      'mutual_fund_intro_level_1': "मैं आपको म्यूचुअल फंड के बारे में समझाता हूं...",
      'mutual_fund_simple_explanation_level_2': "सरल शब्दों में, म्यूचुअल फंड एक पेशेवर प्रबंधक के माध्यम से निवेश है...",
      'equity_intro_level_1': "मैं इक्विटी निवेश के बारे में विस्तार से बताता हूं...",
      'goal_planning_intro': "आइए आपके वित्तीय लक्ष्यों के लिए योजना बनाएं...",
      'sip_amount_choice_instruction': "SIP कैलकुलेटर में मासिक राशि चुनें...",
    },
    [LANGUAGES.PUNJABI]: {
      'mutual_fund_intro_level_1': "ਮੈਂ ਤੁਹਾਨੂੰ ਮਿਊਚੁਅਲ ਫੰਡਾਂ ਬਾਰੇ ਸਮਝਾਉਂਦਾ ਹਾਂ...",
      'mutual_fund_simple_explanation_level_2': "ਸਧਾਰਨ ਸ਼ਬਦਾਂ ਵਿੱਚ, ਮਿਊਚੁਅਲ ਫੰਡ ਇੱਕ ਪੇਸ਼ੇਵਰ ਪ੍ਰਬੰਧਕ ਦੁਆਰਾ ਨਿਵੇਸ਼ ਹੈ...",
      'equity_intro_level_1': "ਮੈਂ ਇਕੁਇਟੀ ਨਿਵੇਸ਼ ਬਾਰੇ ਵਿਸਤਾਰ ਨਾਲ ਦੱਸਦਾ ਹਾਂ...",
      'goal_planning_intro': "ਆਓ ਤੁਹਾਡੇ ਵਿੱਤੀ ਟੀਚਿਆਂ ਲਈ ਯੋਜਨਾ ਬਣਾਈਏ...",
      'sip_amount_choice_instruction': "SIP ਕੈਲਕੁਲੇਟਰ ਵਿੱਚ ਮਹੀਨਾਵਾਰ ਰਾਸ਼ੀ ਚੁਣੋ...",
    }
  };

  return messages[lang]?.[intent] || messages[LANGUAGES.HINGLISH][intent] || "Let me help you with that...";
}

/**
 * Create CTA node from JSON definition
 */
function createCTANode(flowId, levelKey, levelData, nextCTAs) {
  const nodeId = `${flowId}_${levelKey}`;
  const intent = levelData.intent;
  const systemIntent = getSystemIntent(intent);
  
  // CTA to next node mapping based on flow structure
  // This maps CTA IDs to their corresponding level keys in the flow
  const ctaToNodeMap = {
    // what_is_mutual_fund flow mappings
    'explain_simple': 'level_2_explain_simple',
    'mf_types': 'level_3_types',
    'mf_safety': 'level_3_types', // Could map to a safety-specific node if exists
    'money_invested': 'level_3_types',
    'sip_vs_mf': 'level_2_explain_simple',
    'returns_generated': 'level_2_explain_simple',
    'risk_in_mf': 'level_4_risk_time',
    'should_i_start': 'level_8_readiness',
    'which_is_right': 'level_4_risk_time',
    'simple_comparison': 'level_3_types',
    'risk_vs_time': 'level_4_risk_time',
    'goal_use_cases': 'level_5_allocation',
    'long_term': 'level_5_allocation',
    'short_term': 'level_4_risk_time',
    'balanced_approach': 'level_5_allocation',
    'asset_allocation_intro': 'level_5_allocation',
    'example_allocation': 'level_6_example_allocation',
    'why_allocation_matters': 'level_5_allocation',
    'calculate_sip_for_plan': 'level_6_example_allocation',
    'sip_simulation': 'level_6_example_allocation',
    'goal_planning': 'level_6_example_allocation',
    'risk_profile': 'level_6_example_allocation',
    'continue_learning': 'level_7_behaviour',
    'why_timing_fails': 'level_7_behaviour',
    'how_compounding_works': 'level_7_behaviour',
    'investor_mistakes': 'level_7_behaviour',
    'continue': 'level_8_readiness',
    'ready_to_invest': 'level_9_soft_lead',
    'still_exploring': 'level_8_readiness',
    'already_investing': 'level_9_soft_lead',
    'share_contact': 'level_9_soft_lead',
    'continue_exploring': 'level_10_close',
    'explore_goals': 'level_10_close',
    'use_calculator': 'level_10_close',
    'back_menu': 'level_1', // Return to start
    
    // equity_investment flow mappings
    'equity_risk': 'level_2_simple',
    'why_equity': 'level_2_simple',
    'sip_vs_lumpsum_equity': 'level_7_sip_vs_lumpsum',
    'high_returns_question': 'level_3_expectation',
    'value_fluctuation': 'level_2_simple',
    'is_it_suitable': 'level_5_use_cases',
    'how_much_equity': 'level_6_allocation_conceptual',
    'role_of_allocation': 'level_6_allocation_conceptual',
    'show_example_mix': 'level_6_allocation_conceptual',
    'avoid_emotional_investing': 'level_4_psychology',
    'discipline_habit': 'level_4_psychology',
    'equity_mistakes': 'level_4_psychology',
    'wealth_creation': 'level_5_use_cases',
    'retirement_planning': 'level_5_use_cases',
    'child_future_planning': 'level_5_use_cases',
    'short_term_warning': 'level_5_use_cases',
    'show_sip_example': 'level_6_allocation_conceptual',
    'hybrid_allocation': 'level_6_allocation_conceptual',
    'which_is_right': 'level_7_sip_vs_lumpsum',
    'sip_benefits': 'level_7_sip_vs_lumpsum',
    'lumpsum_behavior': 'level_7_sip_vs_lumpsum',
    'plan_wealth_goal': 'level_8_reality',
    'start_sip_journey': 'level_8_reality',
    'explore_more_topics': 'level_10_close',
    
    // goal_planning flow mappings
    'retirement': 'step_1_time_horizon',
    'child_education': 'step_1_time_horizon',
    'child_marriage': 'step_1_time_horizon',
    'wealth_creation': 'step_1_time_horizon',
    'first_crore': 'step_1_time_horizon',
    
    // calculator mappings
    'step_up_sip': 'step_up_explanation',
    'link_goal_planning': 'result_explanation',
    'compare_with_sip': 'result_explanation',
    'allocation_guidance': 'result_explanation',
    
    // talk_to_advisor mappings
    'step_2_contact': 'step_2_contact',
    'step_3_city': 'step_3_city',
    'step_4_goal_reason': 'step_4_goal_reason',
    'step_5_time_preference': 'step_5_time_preference',
    'step_9_continue_learning': 'step_9_continue_learning',
  };
  
  // Build CTAs from next_cta array
  // Note: nextCTAs parameter contains all flow nodes for pattern matching
  const ctas = (levelData.next_cta || []).map(ctaId => {
    // Map CTA IDs to next node IDs using the mapping
    // If mapping exists, use it; otherwise try to find by pattern
    let nextLevelKey = ctaToNodeMap[ctaId];
    
    // If no direct mapping, try pattern matching with all flow nodes
    if (!nextLevelKey && nextCTAs && Array.isArray(nextCTAs)) {
      nextLevelKey = findNextNodeForCTA(flowId, ctaId, nextCTAs);
    }
    
    // Final fallback
    if (!nextLevelKey) {
      nextLevelKey = `level_${ctaId}`;
    }
    
    const nextNodeId = `${flowId}_${nextLevelKey}`;
    return {
      id: ctaId,
      label: formatCTALabel(ctaId),
      next: nextNodeId
    };
  });

  return new CTANode({
    id: nodeId,
    intent: systemIntent,
    level: extractLevel(levelKey),
    requiresLLM: levelData.ai_mode === 'generate_explanation' || !levelData.ai_mode,
    message: (state) => {
      // Use LLM-generated message if requiresLLM is true
      // Otherwise use predefined message
      return generateMessage(intent, state.userProfile.language);
    },
    ctas: ctas,
    requiresContactForm: intent.includes('lead_capture') || intent.includes('advisor'),
    flowIntent: intent // Store original flow intent for LLM agent
  });
}

/**
 * Extract level number from level key
 */
function extractLevel(levelKey) {
  const match = levelKey.match(/level[_\s]?(\d+)/i);
  return match ? parseInt(match[1]) : 1;
}

/**
 * Format CTA label from CTA ID
 */
function formatCTALabel(ctaId) {
  // Convert snake_case to Title Case with emojis
  // Comprehensive mapping for all CTAs in the JSON structure
  const emojiMap = {
    // Mutual Fund Flow CTAs
    'explain_simple': '💡',
    'mf_types': '📊',
    'mf_safety': '🛡️',
    'money_invested': '💰',
    'back_menu': '🔙',
    'sip_vs_mf': '⚖️',
    'returns_generated': '📈',
    'risk_in_mf': '⚠️',
    'should_i_start': '🎯',
    'which_is_right': '✅',
    'simple_comparison': '📋',
    'risk_vs_time': '⏰',
    'goal_use_cases': '🎯',
    'long_term': '📅',
    'short_term': '⏱️',
    'balanced_approach': '⚖️',
    'asset_allocation_intro': '📊',
    'example_allocation': '💡',
    'why_allocation_matters': '🤔',
    'calculate_sip_for_plan': '🧮',
    'talk_to_advisor': '👩‍💼',
    'sip_simulation': '📊',
    'goal_planning': '🎯',
    'risk_profile': '🛡️',
    'continue_learning': '📚',
    'why_timing_fails': '❌',
    'how_compounding_works': '📈',
    'investor_mistakes': '⚠️',
    'continue': '➡️',
    'ready_to_invest': '✅',
    'still_exploring': '🔍',
    'already_investing': '💼',
    'share_contact': '📞',
    'continue_exploring': '🔍',
    'explore_goals': '🎯',
    'use_calculator': '🧮',
    
    // Equity Investment Flow CTAs
    'equity_risk': '⚠️',
    'why_equity': '💡',
    'sip_vs_lumpsum_equity': '⚖️',
    'high_returns_question': '📈',
    'value_fluctuation': '📉',
    'is_it_suitable': '❓',
    'how_much_equity': '📊',
    'role_of_allocation': '⚖️',
    'show_example_mix': '💡',
    'avoid_emotional_investing': '🧘',
    'discipline_habit': '💪',
    'equity_mistakes': '⚠️',
    'wealth_creation': '💰',
    'retirement_planning': '🏖️',
    'child_future_planning': '👶',
    'short_term_warning': '⚠️',
    'show_sip_example': '💡',
    'hybrid_allocation': '⚖️',
    'which_is_right': '✅',
    'sip_benefits': '✅',
    'lumpsum_behavior': '💼',
    'plan_wealth_goal': '🎯',
    'start_sip_journey': '🚀',
    'explore_more_topics': '🔍',
    
    // Goal Planning CTAs
    'retirement': '🏖️',
    'child_education': '📚',
    'child_marriage': '💒',
    'wealth_creation': '💰',
    'first_crore': '💎',
    
    // Calculator CTAs
    'step_up_sip': '📈',
    'link_goal_planning': '🎯',
    'compare_with_sip': '⚖️',
    'allocation_guidance': '📊',
    
    // Risk Profiling CTAs
    'allocation_example': '💡',
    
    // Learning Path CTAs
    'timing_warning': '⚠️',
    'saving_vs_investing': '💰',
    'behavior_mistakes': '⚠️',
    'portfolio_thinking': '🧠',
    'goal_based_motivation': '🎯',
    
    // Market Fear Support CTAs
    'why_markets_fall': '📉',
    'stay_calm_message': '🧘',
    'sip_continuation_explanation': '💪',
    'risk_alignment_message': '🛡️',
    'advisor_help_option': '👩‍💼',
  };

  const emoji = emojiMap[ctaId] || '•';
  const label = ctaId
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return `${emoji} ${label}`;
}

/**
 * Helper function to find next node for a CTA by searching through flow nodes
 * This ensures CTAs map to the correct next nodes based on level key patterns
 */
function findNextNodeForCTA(flowId, ctaId, allFlowNodes) {
  // Direct mappings for common patterns
  const directMappings = {
    'explain_simple': 'level_2_explain_simple',
    'mf_types': 'level_3_types',
    'mf_safety': 'level_3_types',
    'money_invested': 'level_3_types',
    'back_menu': 'level_1',
    'sip_vs_mf': 'level_2_explain_simple',
    'returns_generated': 'level_2_explain_simple',
    'risk_in_mf': 'level_4_risk_time',
    'should_i_start': 'level_8_readiness',
    'which_is_right': 'level_4_risk_time',
    'simple_comparison': 'level_3_types',
    'risk_vs_time': 'level_4_risk_time',
    'goal_use_cases': 'level_5_allocation',
    'long_term': 'level_5_allocation',
    'short_term': 'level_4_risk_time',
    'balanced_approach': 'level_5_allocation',
    'asset_allocation_intro': 'level_5_allocation',
    'example_allocation': 'level_6_example_allocation',
    'why_allocation_matters': 'level_5_allocation',
    'calculate_sip_for_plan': 'level_6_example_allocation',
    'talk_to_advisor': 'talk_to_advisor_step_1_name',
    'sip_simulation': 'level_6_example_allocation',
    'goal_planning': 'goal_planning_select_goal',
    'risk_profile': 'risk_profiling_questionnaire_flow',
    'continue_learning': 'level_7_behaviour',
    'why_timing_fails': 'level_7_behaviour',
    'how_compounding_works': 'level_7_behaviour',
    'investor_mistakes': 'level_7_behaviour',
    'continue': 'level_8_readiness',
    'ready_to_invest': 'level_9_soft_lead',
    'still_exploring': 'level_8_readiness',
    'already_investing': 'level_9_soft_lead',
    'share_contact': 'level_9_soft_lead',
    'continue_exploring': 'level_10_close',
    'explore_goals': 'level_10_close',
    'use_calculator': 'sip_calculator_step_1_amount_select',
  };
  
  // Check direct mappings first
  if (directMappings[ctaId]) {
    return directMappings[ctaId];
  }
  
  // Try to find by pattern matching: remove prefixes like "mf_", "equity_", etc.
  const cleanCtaId = ctaId.replace(/^(mf_|equity_|sip_|goal_)/, '');
  
  // Search through all flow nodes to find matching level key
  for (const node of allFlowNodes) {
    // Handle both node objects with levelKey and CTANode instances
    let levelKey;
    if (node.levelKey) {
      levelKey = node.levelKey;
    } else if (node.id) {
      levelKey = node.id.replace(`${flowId}_`, '');
    } else {
      continue;
    }
    
    // Check if level key contains the CTA ID (with or without prefix)
    if (levelKey.includes(ctaId) || levelKey.includes(cleanCtaId)) {
      return levelKey;
    }
  }
  
  // Fallback: return a generic level based on CTA ID
  return `level_${ctaId}`;
}

/**
 * WHAT IS MUTUAL FUND FLOW (10 Levels)
 */
const whatIsMutualFundFlowNodes = [
  { levelKey: 'level_1', data: { intent: 'mutual_fund_intro_level_1', ai_mode: 'generate_explanation', next_cta: ['explain_simple', 'mf_types', 'mf_safety', 'money_invested', 'back_menu'] } },
  { levelKey: 'level_2_explain_simple', data: { intent: 'mutual_fund_simple_explanation_level_2', next_cta: ['sip_vs_mf', 'returns_generated', 'risk_in_mf', 'should_i_start'] } },
  { levelKey: 'level_3_types', data: { intent: 'mutual_fund_types_level_3', next_cta: ['which_is_right', 'simple_comparison', 'risk_vs_time', 'goal_use_cases'] } },
  { levelKey: 'level_4_risk_time', data: { intent: 'mutual_fund_time_risk_alignment_level_4', next_cta: ['long_term', 'short_term', 'balanced_approach', 'asset_allocation_intro'] } },
  { levelKey: 'level_5_allocation', data: { intent: 'asset_allocation_concept_level_5', next_cta: ['example_allocation', 'why_allocation_matters', 'calculate_sip_for_plan', 'talk_to_advisor'] } },
  { levelKey: 'level_6_example_allocation', data: { intent: 'sample_allocation_education_level_6', next_cta: ['sip_simulation', 'goal_planning', 'risk_profile', 'continue_learning'] } },
  { levelKey: 'level_7_behaviour', data: { intent: 'investor_behaviour_guidance_level_7', next_cta: ['why_timing_fails', 'how_compounding_works', 'investor_mistakes', 'continue'] } },
  { levelKey: 'level_8_readiness', data: { intent: 'readiness_check_explanation_level_8', next_cta: ['ready_to_invest', 'still_exploring', 'already_investing'] } },
  { levelKey: 'level_9_soft_lead', data: { intent: 'advisory_support_value_level_9', next_cta: ['share_contact', 'continue_exploring'] } },
  { levelKey: 'level_10_close', data: { intent: 'conversion_reassurance_close_level_10', next_cta: ['explore_goals', 'use_calculator', 'back_menu'] } }
];

export const whatIsMutualFundFlow = whatIsMutualFundFlowNodes.map(node => 
  createCTANode('what_is_mutual_fund', node.levelKey, node.data, whatIsMutualFundFlowNodes)
);

/**
 * EQUITY INVESTMENT FLOW (10 Levels)
 */
const equityInvestmentFlowNodes = [
  { levelKey: 'level_1_intro', data: { intent: 'equity_intro_level_1', next_cta: ['explain_simple', 'equity_risk', 'why_equity', 'sip_vs_lumpsum_equity'] } },
  { levelKey: 'level_2_simple', data: { intent: 'equity_simple_explanation_level_2', next_cta: ['high_returns_question', 'value_fluctuation', 'is_it_suitable'] } },
  { levelKey: 'level_3_expectation', data: { intent: 'equity_return_expectation_level_3', next_cta: ['how_much_equity', 'role_of_allocation', 'show_example_mix'] } },
  { levelKey: 'level_4_psychology', data: { intent: 'equity_psychology_guidance_level_4', next_cta: ['avoid_emotional_investing', 'discipline_habit', 'equity_mistakes'] } },
  { levelKey: 'level_5_use_cases', data: { intent: 'equity_use_case_mapping_level_5', next_cta: ['wealth_creation', 'retirement_planning', 'child_future_planning', 'short_term_warning'] } },
  { levelKey: 'level_6_allocation_conceptual', data: { intent: 'equity_allocation_concept_level_6', next_cta: ['show_sip_example', 'hybrid_allocation', 'risk_profiling'] } },
  { levelKey: 'level_7_sip_vs_lumpsum', data: { intent: 'equity_sip_vs_lumpsum_level_7', next_cta: ['which_is_right', 'sip_benefits', 'lumpsum_behavior'] } },
  { levelKey: 'level_8_reality', data: { intent: 'equity_reality_reminder_level_8', next_cta: ['plan_wealth_goal', 'start_sip_journey', 'talk_to_advisor'] } },
  { levelKey: 'level_9_lead_capture', data: { intent: 'equity_soft_lead_engagement_level_9', next_cta: ['share_contact', 'continue_learning'] } },
  { levelKey: 'level_10_close', data: { intent: 'equity_conversation_close_level_10', next_cta: ['explore_more_topics', 'back_menu'] } }
];

export const equityInvestmentFlow = equityInvestmentFlowNodes.map((node, index, allNodes) => 
  createCTANode('equity_investment', node.levelKey, node.data, allNodes)
);

/**
 * GOAL PLANNING FLOW
 */
export const goalPlanningFlow = [
  createCTANode('goal_planning', 'select_goal', {
    intent: 'goal_planning_intro',
    next_cta: ['retirement', 'child_education', 'child_marriage', 'wealth_creation', 'first_crore']
  }),

  // Generic goal flow steps
  createCTANode('goal_planning', 'step_1_time_horizon', {
    intent: 'goal_time_horizon_prompt',
    next_cta: ['step_2_target_amount']
  }),

  createCTANode('goal_planning', 'step_2_target_amount', {
    intent: 'goal_target_amount_prompt',
    next_cta: ['step_3_affordability_check']
  }),

  createCTANode('goal_planning', 'step_3_affordability_check', {
    intent: 'affordability_explanation',
    next_cta: ['step_4_sip_vs_lumpsum']
  }),

  createCTANode('goal_planning', 'step_4_sip_vs_lumpsum', {
    intent: 'goal_sip_lumpsum_explanation',
    next_cta: ['step_5_allocation_concept']
  }),

  createCTANode('goal_planning', 'step_5_allocation_concept', {
    intent: 'goal_allocation_guidance',
    next_cta: ['step_6_projection_example']
  }),

  createCTANode('goal_planning', 'step_6_projection_example', {
    intent: 'projection_example_explanation',
    next_cta: ['step_7_risk_awareness']
  }),

  createCTANode('goal_planning', 'step_7_risk_awareness', {
    intent: 'goal_risk_explanation',
    next_cta: ['step_8_soft_lead_capture']
  }),

  createCTANode('goal_planning', 'step_8_soft_lead_capture', {
    intent: 'goal_soft_lead_prompt',
    next_cta: ['share_contact', 'step_9_continue_learning']
  }),

  createCTANode('goal_planning', 'step_9_continue_learning', {
    intent: 'goal_continue_learning',
    next_cta: ['explore_more_topics', 'back_menu']
  })
];

/**
 * SIP CALCULATOR FLOW
 */
export const sipCalculatorFlow = [
  createCTANode('sip_calculator', 'step_1_amount_select', {
    intent: 'sip_amount_choice_instruction',
    action: 'open_calculator',
    next_cta: ['step_2_return_select']
  }),

  createCTANode('sip_calculator', 'step_2_return_select', {
    intent: 'sip_return_expectation_instruction',
    action: 'open_calculator',
    next_cta: ['step_3_tenure_select']
  }),

  createCTANode('sip_calculator', 'step_3_tenure_select', {
    intent: 'sip_tenure_selection_instruction',
    action: 'open_calculator',
    next_cta: ['result_explanation']
  }),

  createCTANode('sip_calculator', 'result_explanation', {
    intent: 'sip_calc_result_explanation',
    next_cta: ['step_up_sip', 'link_goal_planning', 'talk_to_advisor']
  }),

  createCTANode('sip_calculator', 'step_up_explanation', {
    intent: 'sip_increase_effect_explanation',
    next_cta: ['link_goal_planning', 'talk_to_advisor', 'back_menu']
  })
];

/**
 * LUMPSUM CALCULATOR FLOW
 */
export const lumpsumCalculatorFlow = [
  createCTANode('lumpsum_calculator', 'result_explanation', {
    intent: 'lumpsum_result_explanation',
    action: 'open_calculator',
    next_cta: ['compare_with_sip', 'allocation_guidance', 'talk_to_advisor']
  })
];

/**
 * FIRST CRORE FLOW
 */
export const firstCroreFlow = [
  createCTANode('start_investing_first_crore', 'aspiration_validation', {
    intent: 'first_crore_reality_check',
    next_cta: ['discipline_explanation']
  }),

  createCTANode('start_investing_first_crore', 'discipline_explanation', {
    intent: 'wealth_discipline_framework_explanation',
    next_cta: ['equity_role_explanation']
  }),

  createCTANode('start_investing_first_crore', 'equity_role_explanation', {
    intent: 'equity_allocation_role_explanation',
    next_cta: ['sip_roadmap_example']
  }),

  createCTANode('start_investing_first_crore', 'sip_roadmap_example', {
    intent: 'sip_roadmap_example_explanation',
    next_cta: ['inflation_awareness']
  }),

  createCTANode('start_investing_first_crore', 'inflation_awareness', {
    intent: 'inflation_awareness_message',
    next_cta: ['conversion_bridge']
  }),

  createCTANode('start_investing_first_crore', 'conversion_bridge', {
    intent: 'wealth_conversion_bridge_message',
    next_cta: ['share_contact', 'continue_exploring']
  })
];

/**
 * RISK PROFILING FLOW
 */
export const riskProfilingFlow = [
  createCTANode('risk_profiling', 'questionnaire_flow', {
    intent: 'risk_question_flow_explanation',
    next_cta: ['result_message']
  }),

  createCTANode('risk_profiling', 'result_message', {
    intent: 'risk_profile_awareness_message',
    next_cta: ['allocation_example', 'talk_to_advisor']
  })
];

/**
 * TALK TO ADVISOR FLOW
 */
export const talkToAdvisorFlow = [
  createCTANode('talk_to_advisor', 'step_1_name', {
    intent: 'lead_capture_name',
    requiresContactForm: true,
    next_cta: ['step_2_contact']
  }),

  createCTANode('talk_to_advisor', 'step_2_contact', {
    intent: 'lead_capture_contact',
    requiresContactForm: true,
    next_cta: ['step_3_city']
  }),

  createCTANode('talk_to_advisor', 'step_3_city', {
    intent: 'lead_capture_city',
    requiresContactForm: true,
    next_cta: ['step_4_goal_reason']
  }),

  createCTANode('talk_to_advisor', 'step_4_goal_reason', {
    intent: 'lead_capture_goal',
    requiresContactForm: true,
    next_cta: ['step_5_time_preference']
  }),

  createCTANode('talk_to_advisor', 'step_5_time_preference', {
    intent: 'lead_capture_time',
    requiresContactForm: true,
    next_cta: ['confirmation_message']
  }),

  createCTANode('talk_to_advisor', 'confirmation_message', {
    intent: 'lead_confirmation_acknowledgement',
    next_cta: ['trust_message']
  }),

  createCTANode('talk_to_advisor', 'trust_message', {
    intent: 'advisor_trust_reassurance_message',
    next_cta: ['back_menu']
  })
];

/**
 * WEALTH LEARNING PATH FLOW
 */
export const wealthLearningPathFlow = [
  createCTANode('wealth_learning_path', 'compounding_lesson', {
    intent: 'compounding_concept_explanation',
    next_cta: ['timing_warning']
  }),

  createCTANode('wealth_learning_path', 'timing_warning', {
    intent: 'market_timing_warning_message',
    next_cta: ['saving_vs_investing']
  }),

  createCTANode('wealth_learning_path', 'saving_vs_investing', {
    intent: 'saving_investing_difference_explanation',
    next_cta: ['behavior_mistakes']
  }),

  createCTANode('wealth_learning_path', 'behavior_mistakes', {
    intent: 'behavioural_mistakes_explanation',
    next_cta: ['portfolio_thinking']
  }),

  createCTANode('wealth_learning_path', 'portfolio_thinking', {
    intent: 'portfolio_mindset_explanation',
    next_cta: ['goal_based_motivation']
  }),

  createCTANode('wealth_learning_path', 'goal_based_motivation', {
    intent: 'goal_based_investing_benefit_message',
    next_cta: ['explore_goals', 'back_menu']
  })
];

/**
 * MARKET FEAR SUPPORT FLOW
 */
export const marketFearSupportFlow = [
  createCTANode('market_fear_support', 'emotion_acknowledge', {
    intent: 'market_emotion_support_coach',
    next_cta: ['why_markets_fall']
  }),

  createCTANode('market_fear_support', 'why_markets_fall', {
    intent: 'market_fluctuation_explanation',
    next_cta: ['stay_calm_message']
  }),

  createCTANode('market_fear_support', 'stay_calm_message', {
    intent: 'discipline_patience_support_message',
    next_cta: ['sip_continuation_explanation']
  }),

  createCTANode('market_fear_support', 'sip_continuation_explanation', {
    intent: 'continue_sip_awareness_message',
    next_cta: ['risk_alignment_message']
  }),

  createCTANode('market_fear_support', 'risk_alignment_message', {
    intent: 'risk_alignment_reassurance_message',
    next_cta: ['advisor_help_option']
  }),

  createCTANode('market_fear_support', 'advisor_help_option', {
    intent: 'advisor_support_option_message',
    next_cta: ['share_contact', 'continue_exploring']
  })
];

/**
 * Register all CTA flows
 */
export function registerCTAFlows(flowController) {
  flowController.registerFlow('what_is_mutual_fund', whatIsMutualFundFlow);
  flowController.registerFlow('equity_investment', equityInvestmentFlow);
  flowController.registerFlow('goal_planning', goalPlanningFlow);
  flowController.registerFlow('sip_calculator', sipCalculatorFlow);
  flowController.registerFlow('lumpsum_calculator', lumpsumCalculatorFlow);
  flowController.registerFlow('start_investing_first_crore', firstCroreFlow);
  flowController.registerFlow('risk_profiling', riskProfilingFlow);
  flowController.registerFlow('talk_to_advisor', talkToAdvisorFlow);
  flowController.registerFlow('wealth_learning_path', wealthLearningPathFlow);
  flowController.registerFlow('market_fear_support', marketFearSupportFlow);
}

/**
 * Export intent map for LLM agent
 * This allows the LLM agent to understand which flow intent is being used
 */
export { INTENT_MAP, getSystemIntent };

