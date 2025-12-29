// ============================================
// CONVERSATION ENGINE - Production-Grade Architecture
// ============================================
// State-driven conversation management with CTA trees, risk profiling,
// goal planning, and multi-level navigation support

import { INTENTS, LANGUAGES } from './arthAI';
import logger from '../../utils/logger';

/**
 * Conversation State Model
 * Tracks user profile, session flags, intent, navigation, and lead status
 */
export class ConversationState {
  constructor() {
    this.userProfile = {
      language: LANGUAGES.HINGLISH,
      maturityLevel: 'beginner', // 'beginner' | 'intermediate' | 'advanced'
      goalFocus: null,
      riskProfile: null, // 'low' | 'moderate' | 'high'
      timeHorizon: null,
      monthlyInvestable: null,
      age: null,
      city: null,
      profession: null
    };

    this.sessionFlags = {
      exploring: false,
      riskProfilingActive: false,
      goalPlanningActive: false,
      calculatorActive: false,
      leadCaptureActive: false
    };

    this.intent = {
      current: null,
      last: null,
      confidence: 0.8
    };

    this.navigationStack = []; // Tracks flow path for back navigation
    this.conversationDepth = 0;
    this.currentFlowNode = null; // Current CTA tree node ID

    this.leadStatus = {
      intentScore: 0,
      contactCaptured: false,
      contactMethod: null, // 'phone' | 'email' | 'whatsapp'
      contactValue: null
    };

    this.analytics = {
      ctaClicks: [],
      languageSwitches: [],
      goalPaths: [],
      dropoffPoints: [],
      timeToCTA: null
    };
  }

  /**
   * Update user profile
   */
  updateProfile(key, value) {
    if (key === 'goals' && Array.isArray(this.userProfile.goals)) {
      if (!this.userProfile.goals.includes(value)) {
        this.userProfile.goals.push(value);
      }
    } else {
      this.userProfile[key] = value;
    }
    this.logAnalytics('profile_updated', { key, value });
  }

  /**
   * Assess user maturity level based on conversation signals
   */
  assessMaturityLevel(signals) {
    let score = 0;

    // Keywords indicating maturity
    if (signals.keywords) {
      const advancedKeywords = ['cagr', 'nav', 'expense ratio', 'rebalancing', 'asset allocation', 'portfolio'];
      const intermediateKeywords = ['sip', 'mutual fund', 'equity', 'debt', 'returns', 'risk'];
      
      if (signals.keywords.some(k => advancedKeywords.includes(k.toLowerCase()))) {
        score += 3;
      } else if (signals.keywords.some(k => intermediateKeywords.includes(k.toLowerCase()))) {
        score += 1;
      }
    }

    // Conversation depth
    score += Math.min(this.conversationDepth / 5, 2);

    // Question sophistication
    if (signals.questionType === 'allocation' || signals.questionType === 'strategy') {
      score += 2;
    } else if (signals.questionType === 'basic') {
      score += 0;
    }

    // Determine level
    if (score >= 5) {
      this.userProfile.maturityLevel = 'advanced';
    } else if (score >= 2) {
      this.userProfile.maturityLevel = 'intermediate';
    } else {
      this.userProfile.maturityLevel = 'beginner';
    }

    this.logAnalytics('maturity_assessed', { level: this.userProfile.maturityLevel, score });
  }

  /**
   * Update intent
   */
  updateIntent(newIntent, confidence = 0.8) {
    this.intent.last = this.intent.current;
    this.intent.current = newIntent;
    this.intent.confidence = confidence;
    this.logAnalytics('intent_detected', { intent: newIntent, confidence });
  }

  /**
   * Push to navigation stack
   */
  pushNavigation(nodeId) {
    this.navigationStack.push(nodeId);
    this.conversationDepth++;
    this.currentFlowNode = nodeId;
  }

  /**
   * Pop from navigation stack (back navigation)
   */
  popNavigation() {
    if (this.navigationStack.length > 0) {
      this.navigationStack.pop();
      this.currentFlowNode = this.navigationStack[this.navigationStack.length - 1] || null;
      this.conversationDepth = Math.max(0, this.conversationDepth - 1);
    }
  }

  /**
   * Update lead intent score
   */
  updateLeadScore(signals) {
    // Signals that indicate buying intent
    const intentSignals = {
      goal_planning_deep: 3, // Level 3+ in goal planning
      risk_profiling_complete: 2,
      calculator_used: 1,
      strategy_help_requested: 2,
      advisor_mentioned: 2,
      contact_interest: 3
    };

    signals.forEach(signal => {
      if (intentSignals[signal]) {
        this.leadStatus.intentScore += intentSignals[signal];
      }
    });

    // Check if threshold reached for lead capture
    const threshold = 5;
    if (this.leadStatus.intentScore >= threshold && !this.leadStatus.contactCaptured) {
      this.sessionFlags.leadCaptureActive = true;
      this.logAnalytics('lead_interest_detected', { score: this.leadStatus.intentScore });
    }
  }

  /**
   * Log analytics event
   */
  logAnalytics(eventType, data = {}) {
    const event = {
      type: eventType,
      timestamp: new Date().toISOString(),
      data,
      context: {
        intent: this.intent.current,
        depth: this.conversationDepth,
        maturity: this.userProfile.maturityLevel,
        language: this.userProfile.language
      }
    };

    // Store in appropriate analytics array
    if (eventType === 'cta_clicked') {
      this.analytics.ctaClicks.push(event);
    } else if (eventType === 'language_changed') {
      this.analytics.languageSwitches.push(event);
    } else if (eventType.includes('goal')) {
      this.analytics.goalPaths.push(event);
    }

    // Log for debugging (production-safe)
    logger.debug('Analytics', event);
  }

  /**
   * Get state summary for LLM context
   */
  getStateSummary() {
    return {
      maturity: this.userProfile.maturityLevel,
      goal: this.userProfile.goalFocus,
      riskProfile: this.userProfile.riskProfile,
      timeHorizon: this.userProfile.timeHorizon,
      depth: this.conversationDepth,
      currentIntent: this.intent.current,
      leadScore: this.leadStatus.intentScore
    };
  }

  /**
   * Reset conversation (soft reset - keeps profile)
   */
  resetConversation() {
    this.sessionFlags = {
      exploring: false,
      riskProfilingActive: false,
      goalPlanningActive: false,
      calculatorActive: false,
      leadCaptureActive: false
    };
    this.navigationStack = [];
    this.conversationDepth = 0;
    this.currentFlowNode = null;
    this.intent.current = null;
    this.intent.last = null;
  }
}

/**
 * CTA Tree Node Structure
 * Supports up to 10 levels of navigation
 */
export class CTANode {
  constructor(config) {
    this.id = config.id; // e.g., "sip_intro_l1"
    this.intent = config.intent;
    this.level = config.level || 1;
    this.message = config.message; // Can be function for dynamic content
    this.ctas = config.ctas || []; // Array of CTA objects
    this.requiresLLM = config.requiresLLM || false; // Whether to use LLM for response
    this.requiresContactForm = config.requiresContactForm || false; // Whether to show contact form
    this.conditions = config.conditions || {}; // Conditions for showing this node
    this.action = config.action; // Special action (e.g., 'show_contact_form', 'open_calculator')
    this.flowIntent = config.flowIntent; // Original flow intent for LLM agent context
  }

  /**
   * Get message (supports functions)
   */
  getMessage(state) {
    if (typeof this.message === 'function') {
      return this.message(state);
    }
    return this.message;
  }

  /**
   * Get CTAs filtered by conditions
   */
  getCTAs(state) {
    return this.ctas.filter(cta => {
      if (cta.condition) {
        return cta.condition(state);
      }
      return true;
    });
  }
}

/**
 * Flow Controller
 * Manages conversation flow through CTA trees
 */
export class FlowController {
  constructor() {
    this.flows = new Map(); // Store all flow trees
    this.state = new ConversationState();
  }

  /**
   * Register a flow tree
   */
  registerFlow(flowId, nodes) {
    this.flows.set(flowId, nodes);
  }

  /**
   * Get current flow node
   */
  getCurrentNode(flowId, nodeId) {
    const flow = this.flows.get(flowId);
    if (!flow) return null;
    return flow.find(node => node.id === nodeId) || null;
  }

  /**
   * Process user action and navigate to next node
   */
  processUserAction(action, userMessage, context = {}) {
    const { flowId, nodeId, ctaId } = action;

    // Log CTA click
    this.state.logAnalytics('cta_clicked', { flowId, nodeId, ctaId });

    // Get current node
    const currentNode = this.getCurrentNode(flowId, nodeId);
    if (!currentNode) {
      logger.warn('Flow node not found', { flowId, nodeId });
      return null;
    }

    // Find selected CTA
    const selectedCTA = currentNode.ctas.find(cta => cta.id === ctaId);
    if (!selectedCTA) {
      logger.warn('CTA not found', { ctaId });
      return null;
    }

    // Navigate to next node
    const nextNodeId = selectedCTA.next;
    if (!nextNodeId) {
      logger.warn('Next node not specified', { ctaId });
      return null;
    }

    // Update navigation stack
    this.state.pushNavigation(nextNodeId);

    // Get next node
    const nextNode = this.getCurrentNode(flowId, nextNodeId);
    if (!nextNode) {
      logger.warn('Next node not found', { nextNodeId });
      return null;
    }

    // Update lead score if needed
    if (nextNode.level >= 3) {
      this.state.updateLeadScore(['goal_planning_deep']);
    }

    return {
      node: nextNode,
      state: this.state,
      requiresLLM: nextNode.requiresLLM
    };
  }

  /**
   * Get state
   */
  getState() {
    return this.state;
  }

  /**
   * Update state
   */
  updateState(updates) {
    Object.assign(this.state, updates);
  }
}

// Export singleton instance
export const conversationEngine = new FlowController();

