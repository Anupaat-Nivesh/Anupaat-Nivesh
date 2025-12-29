# Enterprise-Grade Chatbot Architecture

## Overview
This document describes the complete production-grade personal finance assistant architecture with multi-level conversation flows, CTA trees, risk profiling, and analytics.

## 🏗️ System Architecture

### Core Components

1. **Conversation Engine** (`conversationEngine.js`)
   - State management (user profile, session flags, intent tracking)
   - Navigation stack for back navigation
   - Lead scoring and conversion tracking
   - Maturity level assessment

2. **Flow Definitions** (`flowDefinitions.js`)
   - CTA tree configurations (up to 10 levels)
   - Scenario-based flows (SIP, Mutual Fund, Goal Planning, etc.)
   - Node-based navigation system

3. **Analytics Service** (`analyticsService.js`)
   - Event tracking (intents, CTAs, conversions)
   - Session analytics
   - Conversion funnel analysis

4. **LLM Agent** (`llmAgent.js`)
   - Enhanced with enterprise-grade prompts
   - Behavioral adaptation
   - Risk-aware responses

## 📊 Conversation State Model

```javascript
ConversationState {
  userProfile: {
    language: "en" | "hi" | "hinglish" | "pa",
    maturityLevel: "beginner" | "intermediate" | "advanced",
    goalFocus: string,
    riskProfile: "low" | "moderate" | "high",
    timeHorizon: string,
    monthlyInvestable: number,
    age: number,
    city: string,
    profession: string
  },
  sessionFlags: {
    exploring: boolean,
    riskProfilingActive: boolean,
    goalPlanningActive: boolean,
    calculatorActive: boolean,
    leadCaptureActive: boolean
  },
  intent: {
    current: string,
    last: string,
    confidence: number
  },
  navigationStack: string[],
  conversationDepth: number,
  currentFlowNode: string,
  leadStatus: {
    intentScore: number,
    contactCaptured: boolean,
    contactMethod: string,
    contactValue: string
  }
}
```

## 🎯 Flow Scenarios

### Scenario 1: "What is SIP?" (10 Levels)

**Level 1:** Introduction → CTAs: Explain, Returns, Plan, Calculator
**Level 2:** Simple Explanation → CTAs: Safety, Amount, Investment, Calculate
**Level 3:** Safety Discussion → CTAs: Risk Profiling, Goal SIP, Simulation
**Level 4:** Risk Profiling Entry → CTAs: Retirement, Education, Wealth, Short-term
**Level 5:** Time Horizon → CTAs: <3 years, 3-5, 5-10, 10+
**Level 6:** Risk Capacity → CTAs: Low, Moderate, High
**Level 7:** Asset Allocation → CTAs: Portfolio Example, Calculate, Advisor
**Level 8:** Portfolio Example → CTAs: Calculate, Goal Planning, Share Details
**Level 9:** Lead Capture → CTAs: Submit, Skip
**Level 10:** Thank You → CTAs: Continue, Goal Planning, Calculator

### Scenario 2: "What is Mutual Fund?"

Similar 10-level structure focusing on:
- Types of mutual funds
- Equity vs Debt vs Hybrid
- Risk comparison
- Goal alignment
- Asset allocation

### Scenario 3: Goal Planning

Multiple branches:
- Retirement (10 levels)
- Child Education (10 levels)
- Child Marriage (10 levels)
- Wealth Creation (10 levels)
- First Crore (10 levels)

## 🧠 User Maturity Assessment

The system automatically assesses user maturity based on:

1. **Keywords**: Advanced (CAGR, NAV, rebalancing) vs Intermediate (SIP, mutual fund) vs Beginner
2. **Conversation Depth**: Deeper conversations indicate higher maturity
3. **Question Type**: Allocation/strategy questions vs basic questions

**Three Levels:**
- **Beginner**: Unaware, confused, low exposure
- **Intermediate**: Knows SIP/MF, needs guidance
- **Advanced**: Seeks allocation & strategy clarity

## 📈 Analytics Tracking

### Events Tracked:
- `session_started` - Session initiation
- `intent_detected` - Intent classification
- `cta_clicked` - CTA interaction
- `language_changed` - Language switch
- `goal_path_selected` - Goal planning path
- `risk_profile_completed` - Risk assessment done
- `lead_interest_detected` - High intent score
- `contact_submitted` - Lead capture
- `dropoff_detected` - User abandonment

### Metrics Calculated:
- Conversion rate (contacts / lead interests)
- Popular intents
- CTA click rates
- Language distribution
- Average conversation depth
- Time to conversion

## 🎨 UI/UX Components

### Reusable Blocks:
- MessageText - Text responses
- BulletList - Structured lists
- CardOptions - CTA cards
- GoalSelectionBlock - Goal picker
- RiskSlider - Risk assessment
- TimeHorizonSelector - Time period picker
- SIPInputSelector - Amount input
- AmountChips - Quick amount selection
- CTAButtons - Action buttons
- LanguageSwitcher - Language toggle
- ContactCaptureForm - Lead form

## 🔄 Flow Controller Logic

```javascript
processUserAction(action) {
  1. Detect intent
  2. Update conversation state
  3. Load flow node
  4. Render UI block
  5. Trigger LLM (if needed)
  6. Track analytics
}
```

**Key Principle:** LLM is NOT used for navigation — only for:
- Explanations
- Guidance
- Behavioral understanding
- Human-style reasoning

## 🌍 Multi-Language Handling

**Rules:**
- Language switch does NOT reset flow
- Bot rewrites only future responses
- Provides small confirmation
- Maintains conversation context

**Example:**
```
User switches: English → Hindi
Bot: "Language updated to Hindi. चलिए आगे बढ़ते हैं 👍"
[Continues from same flow node]
```

## 🛡️ Financial Safety Rules

**Hard-coded (Non-negotiable):**
- ❌ Never guarantee returns
- ❌ No scheme recommendation
- ❌ No stock advice
- ❌ No speculation tone
- ✅ Always asset-allocation-anchored
- ✅ Always disclaim market-linked nature

## 📞 Lead Funnel Logic

**Triggers:**
- User asks for strategy help
- Enters goal planning deeper than level-3
- Shows high buying intent language
- Completes risk profiling

**Scoring:**
```javascript
leadStatus.intentScore += signals.weight
if (intentScore >= threshold && !contactCaptured)
  promptLeadCapture()
```

**Soft Ask:**
"If you'd like personal guidance, share your phone or email — we'll help you set up the right plan."

## 🧮 Calculator Integration

**Rules:**
- Appears ONLY on intent request
- Default SIP return: 12% (adjustable)
- Logic layer separate from LLM
- LLM explains meaning — NOT math

## 🎯 Intent Map

Primary paths:
- `home` - Home screen
- `sip_info` - SIP education flow
- `mutual_fund_info` - Mutual fund education
- `equity_investment_info` - Equity education
- `goal_planning` - Goal-based planning
- `sip_calculator` - SIP calculator
- `lumpsum_calculator` - Lumpsum calculator
- `risk_profiling` - Risk assessment
- `portfolio_allocation_education` - Allocation guidance
- `talk_to_advisor` - Advisor connect
- `lead_capture` - Contact form
- `language_switch` - Language change
- `fallback_safety` - Error handling

## 🔧 Implementation Status

### ✅ Completed:
- Conversation state management
- CTA tree framework
- Flow definitions (SIP flow - 10 levels)
- Analytics service
- Enhanced LLM prompts
- Risk profiling structure
- Goal planning structure

### 🚧 In Progress:
- Full integration with ChatBot.jsx
- Complete all flow definitions
- UI component implementation
- Back navigation handling

### 📋 Next Steps:
1. Integrate flow controller into ChatBot.jsx message processing
2. Add CTA click handlers that navigate through flows
3. Implement risk profiling UI components
4. Complete all 10-level flows for each scenario
5. Add back navigation support
6. Implement analytics dashboard (optional)

## 📚 Usage Example

```javascript
// Initialize
registerAllFlows(conversationEngine);
const state = conversationEngine.getState();

// Process user action
const result = conversationEngine.processUserAction({
  flowId: 'sip_info',
  nodeId: 'sip_intro_l1',
  ctaId: 'explain_simple'
});

// Get next node
const nextNode = result.node;
const message = nextNode.getMessage(state);
const ctas = nextNode.getCTAs(state);

// Track analytics
analytics.trackCTAClick('explain_simple', 'sip_info', 'sip_intro_l1', {
  depth: state.conversationDepth,
  maturity: state.userProfile.maturityLevel
});
```

## 🎯 Key Features

1. **State-Driven**: Not free-flow, structured navigation
2. **CTA-Guided**: Clear next steps at every level
3. **Multi-Language**: Seamless language switching
4. **Risk-Aware**: Financial safety built-in
5. **Lead Capture**: Natural, non-pushy
6. **Context Continuity**: Maintains conversation flow
7. **Analytics**: Comprehensive tracking
8. **Scalable**: Easy to add new flows

This architecture provides a solid foundation for a production-grade financial advisory chatbot.

