// ============================================
// ANALYTICS SERVICE - Event Tracking & Insights
// ============================================
// Tracks user behavior, conversion funnels, and provides insights

import logger from '../../utils/logger';

class AnalyticsService {
  constructor() {
    this.events = [];
    this.maxEvents = 1000; // Store last 1000 events
    this.sessionStartTime = Date.now();
  }

  /**
   * Track analytics event
   */
  track(eventType, data = {}) {
    const event = {
      type: eventType,
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId(),
      data,
      metadata: {
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
        timestamp: Date.now()
      }
    };

    this.events.push(event);

    // Keep only recent events
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }

    // Log in development only
    logger.debug('Analytics Event', event);

    // In production, you might send to analytics service
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
      // Send to analytics endpoint if configured
      this.sendToAnalytics(event);
    }
  }

  /**
   * Track intent detection
   */
  trackIntent(intent, confidence, userMessage) {
    this.track('intent_detected', {
      intent,
      confidence,
      messageLength: userMessage?.length || 0,
      messagePreview: userMessage?.substring(0, 50) || ''
    });
  }

  /**
   * Track CTA click
   */
  trackCTAClick(ctaId, flowId, nodeId, context = {}) {
    this.track('cta_clicked', {
      ctaId,
      flowId,
      nodeId,
      conversationDepth: context.depth || 0,
      maturityLevel: context.maturity || 'unknown',
      language: context.language || 'unknown'
    });
  }

  /**
   * Track language switch
   */
  trackLanguageSwitch(fromLang, toLang) {
    this.track('language_changed', {
      from: fromLang,
      to: toLang
    });
  }

  /**
   * Track goal path selection
   */
  trackGoalPath(goal, path, level) {
    this.track('goal_path_selected', {
      goal,
      path,
      level
    });
  }

  /**
   * Track risk profiling completion
   */
  trackRiskProfiling(profile, timeHorizon, goal) {
    this.track('risk_profile_completed', {
      riskProfile: profile,
      timeHorizon,
      goal
    });
  }

  /**
   * Track lead interest
   */
  trackLeadInterest(score, triggers) {
    this.track('lead_interest_detected', {
      intentScore: score,
      triggers
    });
  }

  /**
   * Track contact submission
   */
  trackContactSubmission(method, hasGoal, hasRiskProfile) {
    this.track('contact_submitted', {
      method, // 'phone' | 'email' | 'whatsapp'
      hasGoal,
      hasRiskProfile,
      timeToConversion: Date.now() - this.sessionStartTime
    });
  }

  /**
   * Track dropoff point
   */
  trackDropoff(nodeId, flowId, reason) {
    this.track('dropoff_detected', {
      nodeId,
      flowId,
      reason
    });
  }

  /**
   * Get analytics summary
   */
  getSummary() {
    const summary = {
      totalEvents: this.events.length,
      sessionDuration: Date.now() - this.sessionStartTime,
      eventsByType: {},
      popularIntents: {},
      ctaClickRate: {},
      languageDistribution: {},
      conversionRate: 0
    };

    // Analyze events
    this.events.forEach(event => {
      // Count by type
      summary.eventsByType[event.type] = (summary.eventsByType[event.type] || 0) + 1;

      // Track intents
      if (event.type === 'intent_detected') {
        const intent = event.data.intent;
        summary.popularIntents[intent] = (summary.popularIntents[intent] || 0) + 1;
      }

      // Track CTAs
      if (event.type === 'cta_clicked') {
        const ctaId = event.data.ctaId;
        summary.ctaClickRate[ctaId] = (summary.ctaClickRate[ctaId] || 0) + 1;
      }

      // Track languages
      if (event.type === 'language_changed') {
        const lang = event.data.to;
        summary.languageDistribution[lang] = (summary.languageDistribution[lang] || 0) + 1;
      }
    });

    // Calculate conversion rate
    const leadInterests = summary.eventsByType['lead_interest_detected'] || 0;
    const contacts = summary.eventsByType['contact_submitted'] || 0;
    summary.conversionRate = leadInterests > 0 ? (contacts / leadInterests) * 100 : 0;

    return summary;
  }

  /**
   * Export events for analysis
   */
  exportEvents() {
    return JSON.stringify(this.events, null, 2);
  }

  /**
   * Get session ID
   */
  getSessionId() {
    if (typeof window !== 'undefined') {
      if (!window.analyticsSessionId) {
        window.analyticsSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      }
      return window.analyticsSessionId;
    }
    return 'server_session';
  }

  /**
   * Send to analytics service (production)
   */
  sendToAnalytics(event) {
    // Implement your analytics service integration here
    // e.g., Google Analytics, Mixpanel, custom endpoint
    if (process.env.REACT_APP_ANALYTICS_ENDPOINT) {
      // Send to custom endpoint
      fetch(process.env.REACT_APP_ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      }).catch(err => {
        logger.error('Analytics send failed', err);
      });
    }
  }

  /**
   * Clear events (for testing)
   */
  clear() {
    this.events = [];
    this.sessionStartTime = Date.now();
  }
}

// Export singleton
export const analytics = new AnalyticsService();
export default analytics;

