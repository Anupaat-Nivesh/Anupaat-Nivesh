// Compliance & Trust Framework
// Ensures chatbot responses are regulator-safe and trustworthy

/**
 * Compliance Rules - Mandatory Behavior Checks
 */
export const COMPLIANCE_RULES = {
    // Prohibited phrases (must be filtered/replaced)
    prohibitedPhrases: [
        'guaranteed return',
        'guaranteed profit',
        'sure return',
        'fixed return',
        '100% return',
        'double your money',
        'guarantee',
        'zaroor milega',
        'pakka',
        'nishchit',
        'ਗਾਰੰਟੀ',
        'ਜ਼ਰੂਰ'
    ],

    // Trading-style guidance (not allowed)
    tradingPhrases: [
        'buy now',
        'sell now',
        'market timing',
        'quick profit',
        'day trading',
        'intraday',
        'buy this stock',
        'sell this fund'
    ],

    // Tax/legal advice (only generic allowed)
    taxLegalPhrases: [
        'tax saving guaranteed',
        'legal advice',
        'tax exemption guaranteed'
    ],

    // Misleading statements
    misleadingPhrases: [
        'risk-free',
        'no risk',
        'safe guaranteed',
        'monthly 10%',
        'monthly return',
        'har mahine return'
    ]
};

/**
 * Check response for compliance violations
 */
export function checkCompliance(responseText, language = 'en') {
    const violations = [];
    const responseLower = responseText.toLowerCase();

    // Check for prohibited phrases
    COMPLIANCE_RULES.prohibitedPhrases.forEach(phrase => {
        if (responseLower.includes(phrase.toLowerCase())) {
            violations.push({
                type: 'prohibited_phrase',
                phrase,
                severity: 'high',
                message: `Prohibited phrase detected: "${phrase}"`
            });
        }
    });

    // Check for trading-style guidance
    COMPLIANCE_RULES.tradingPhrases.forEach(phrase => {
        if (responseLower.includes(phrase.toLowerCase())) {
            violations.push({
                type: 'trading_guidance',
                phrase,
                severity: 'high',
                message: `Trading-style guidance detected: "${phrase}"`
            });
        }
    });

    // Check for misleading statements
    COMPLIANCE_RULES.misleadingPhrases.forEach(phrase => {
        if (responseLower.includes(phrase.toLowerCase())) {
            violations.push({
                type: 'misleading_statement',
                phrase,
                severity: 'medium',
                message: `Misleading statement detected: "${phrase}"`
            });
        }
    });

    // Check for specific fund recommendations
    const fundRecommendationPattern = /(invest in|buy|recommend).*(fund|scheme|mutual fund)/i;
    if (fundRecommendationPattern.test(responseText)) {
        violations.push({
            type: 'fund_recommendation',
            severity: 'high',
            message: 'Specific fund recommendation detected'
        });
    }

    return {
        compliant: violations.length === 0,
        violations,
        needsReview: violations.some(v => v.severity === 'high')
    };
}

/**
 * Sanitize response to remove compliance violations
 */
export function sanitizeResponse(responseText, language = 'en') {
    let sanitized = responseText;
    const responseLower = sanitized.toLowerCase();

    // Replace prohibited phrases
    COMPLIANCE_RULES.prohibitedPhrases.forEach(phrase => {
        const regex = new RegExp(phrase, 'gi');
        if (regex.test(sanitized)) {
            // Replace with compliant alternative
            const replacements = {
                'guaranteed': 'expected',
                'guarantee': 'expectation',
                'sure': 'likely',
                'zaroor': 'expected',
                'pakka': 'likely',
                'nishchit': 'expected'
            };

            const replacement = replacements[phrase.toLowerCase()] || 'expected';
            sanitized = sanitized.replace(regex, replacement);

            console.warn(`⚠️ Compliance: Replaced "${phrase}" with "${replacement}"`);
        }
    });

    // Add market-linked disclaimer if return-related
    if (responseLower.match(/(return|profit|growth|maturity|corpus|amount)/i) &&
        !responseLower.includes('market-linked') &&
        !responseLower.includes('not guaranteed')) {

        const disclaimers = {
            'en': ' (market-linked, not guaranteed)',
            'hi': ' (बाजार-लिंक्ड, गारंटी नहीं)',
            'hinglish': ' (market-linked, not guaranteed)',
            'pa': ' (ਮਾਰਕੀਟ-ਲਿੰਕਡ, ਗਾਰੰਟੀ ਨਹੀਂ)'
        };

        const disclaimer = disclaimers[language] || disclaimers['en'];

        // Add at end of first sentence
        const firstPeriod = sanitized.indexOf('.');
        if (firstPeriod > 0) {
            sanitized = sanitized.slice(0, firstPeriod) + disclaimer + sanitized.slice(firstPeriod);
        } else {
            sanitized += disclaimer;
        }
    }

    return sanitized;
}

/**
 * Check for user distress or risk dependency
 */
export function checkUserDistress(userMessage) {
    const messageLower = userMessage.toLowerCase();

    const distressIndicators = [
        'worried', 'anxious', 'scared', 'fear', 'dar',
        'loss', 'gir gaya', 'crash', 'tension',
        'problem', 'issue', 'help urgently', 'emergency'
    ];

    const hasDistress = distressIndicators.some(indicator =>
        messageLower.includes(indicator)
    );

    return {
        hasDistress,
        shouldOfferAdvisor: hasDistress,
        responseTone: hasDistress ? 'calming' : 'normal'
    };
}

/**
 * Check for aggressive return expectations
 */
export function checkAggressiveExpectations(userMessage) {
    const messageLower = userMessage.toLowerCase();

    const aggressivePatterns = [
        /monthly\s+\d+%/i,
        /har\s+mahine\s+\d+%/i,
        /quick\s+profit/i,
        /fast\s+money/i,
        /jaldi\s+paisa/i,
        /double\s+.*\s+month/i,
        /dubna\s+.*\s+mahine/i
    ];

    const hasAggressiveExpectation = aggressivePatterns.some(pattern =>
        pattern.test(userMessage)
    );

    return {
        hasAggressiveExpectation,
        needsCorrection: hasAggressiveExpectation,
        correctionTone: 'polite_but_firm'
    };
}

/**
 * Generate compliance-safe response template
 */
export function getComplianceDisclaimer(language = 'en') {
    const disclaimers = {
        'en': 'Please note: This is for educational purposes only. Returns are market-linked and not guaranteed. For personalized advice, please consult with our human advisors.',
        'hi': 'कृपया ध्यान दें: यह केवल शैक्षिक उद्देश्यों के लिए है। रिटर्न बाजार-लिंक्ड हैं और गारंटीशुदा नहीं हैं। व्यक्तिगत सलाह के लिए, कृपया हमारे मानव सलाहकारों से परामर्श करें।',
        'hinglish': 'Please note: Yeh educational purposes ke liye hai. Returns market-linked hain aur guaranteed nahi hain. Personalized advice ke liye, humare human advisors se consult karein.',
        'pa': 'ਕਿਰਪਾ ਕਰਕੇ ਨੋਟ ਕਰੋ: ਇਹ ਸਿਰਫ਼ ਸਿੱਖਿਆਤਮਕ ਉਦੇਸ਼ਾਂ ਲਈ ਹੈ। ਰਿਟਰਨ ਮਾਰਕੀਟ-ਲਿੰਕਡ ਹਨ ਅਤੇ ਗਾਰੰਟੀਸ਼ੁਦਾ ਨਹੀਂ ਹਨ। ਨਿੱਜੀ ਸਲਾਹ ਲਈ, ਕਿਰਪਾ ਕਰਕੇ ਸਾਡੇ ਮਨੁੱਖੀ ਸਲਾਹਕਾਰਾਂ ਨਾਲ ਸਲਾਹ-ਮਸ਼ਵਰਾ ਕਰੋ।'
    };

    return disclaimers[language] || disclaimers['en'];
}

/**
 * Audit log entry for compliance review
 */
export function logComplianceEvent(eventType, details) {
    const auditLog = {
        timestamp: new Date().toISOString(),
        event_type: eventType, // 'response_generated' | 'violation_detected' | 'user_distress' | 'aggressive_expectation'
        details,
        action_taken: null
    };

    // Store in localStorage (in production, send to secure audit log)
    const existingLogs = JSON.parse(localStorage.getItem('compliance_audit_log') || '[]');
    existingLogs.push(auditLog);

    // Keep only last 100 entries
    if (existingLogs.length > 100) {
        existingLogs.shift();
    }

    localStorage.setItem('compliance_audit_log', JSON.stringify(existingLogs));

    return auditLog;
}

