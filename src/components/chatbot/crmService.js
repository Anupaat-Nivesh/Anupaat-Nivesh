// CRM & Lead Management Service
// Handles lead storage, tagging, and pipeline automation

/**
 * Lead Data Structure
 */
export const LEAD_SCHEMA = {
    // Contact Information
    name: null, // Optional
    phone: null, // OR email (minimum one required)
    email: null, // OR phone (minimum one required)
    city: null, // Optional

    // Intent & Context
    intent_type: null, // 'retirement' | 'child_education' | 'sip_start' | 'wealth_creation' | 'general'
    conversation_summary: null, // Brief summary of conversation
    language: null, // 'hinglish' | 'hi' | 'en' | 'pa'

    // Lead Qualification
    lead_confidence: 'low', // 'low' | 'medium' | 'high'
    lead_score: 0, // 0-100

    // Metadata
    timestamp: null,
    source: 'chatbot',
    conversation_id: null,
    user_agent: null,

    // Status
    status: 'new', // 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
    assigned_to: null,
    notes: []
};

/**
 * Calculate lead confidence score
 */
function calculateLeadScore(leadData) {
    let score = 0;

    // Contact completeness (30 points)
    if (leadData.phone) score += 15;
    if (leadData.email) score += 15;
    if (leadData.name) score += 5;
    if (leadData.city) score += 5;

    // Intent clarity (30 points)
    if (leadData.intent_type && leadData.intent_type !== 'general') score += 20;
    if (leadData.conversation_summary && leadData.conversation_summary.length > 50) score += 10;

    // Engagement depth (20 points)
    if (leadData.conversation_length >= 5) score += 10;
    if (leadData.conversation_length >= 10) score += 10;

    // Goal specificity (20 points)
    const goalKeywords = ['retirement', 'education', 'marriage', 'corpus', 'amount'];
    if (goalKeywords.some(keyword =>
        leadData.conversation_summary?.toLowerCase().includes(keyword)
    )) {
        score += 20;
    }

    // Determine confidence level
    let confidence = 'low';
    if (score >= 70) confidence = 'high';
    else if (score >= 40) confidence = 'medium';

    return { score, confidence };
}

/**
 * Save lead to storage (localStorage for now, CRM API in production)
 */
export async function saveLead(leadData) {
    try {
        // Validate minimum requirements
        if (!leadData.phone && !leadData.email) {
            throw new Error('Phone or email is required');
        }

        // Calculate lead score
        const { score, confidence } = calculateLeadScore(leadData);
        leadData.lead_score = score;
        leadData.lead_confidence = confidence;

        // Add timestamp
        leadData.timestamp = new Date().toISOString();

        // Add user agent
        leadData.user_agent = navigator.userAgent;

        // Generate conversation ID if not provided
        if (!leadData.conversation_id) {
            leadData.conversation_id = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }

        // Save to localStorage (Phase-1)
        const existingLeads = JSON.parse(localStorage.getItem('chatbot_leads') || '[]');
        existingLeads.push(leadData);
        localStorage.setItem('chatbot_leads', JSON.stringify(existingLeads));

        // In production, send to CRM API
        // await sendToCRM(leadData);

        // Log for debugging
        console.log('✅ Lead saved:', {
            id: leadData.conversation_id,
            confidence,
            score,
            intent: leadData.intent_type
        });

        return {
            success: true,
            lead_id: leadData.conversation_id,
            confidence,
            score
        };
    } catch (error) {
        console.error('❌ Error saving lead:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Generate conversation summary for lead
 */
export function generateConversationSummary(messages, language = 'en') {
    if (!messages || messages.length === 0) {
        return 'No conversation history';
    }

    // Extract key information
    const userMessages = messages.filter(m => m.sender === 'user');
    const botMessages = messages.filter(m => m.sender === 'bot');

    // Identify topics discussed
    const topics = [];
    const allText = messages.map(m => m.text).join(' ').toLowerCase();

    if (allText.includes('sip') || allText.includes('systematic')) topics.push('SIP');
    if (allText.includes('mutual fund')) topics.push('Mutual Funds');
    if (allText.includes('retirement') || allText.includes('budhapa')) topics.push('Retirement Planning');
    if (allText.includes('child') || allText.includes('education')) topics.push('Child Education');
    if (allText.includes('goal')) topics.push('Goal Planning');
    if (allText.includes('calculator') || allText.includes('calculate')) topics.push('Calculations');

    // Build summary
    const summary = {
        message_count: messages.length,
        user_messages: userMessages.length,
        topics_discussed: topics.join(', ') || 'General inquiry',
        last_intent: null, // Will be set by caller
        language
    };

    return JSON.stringify(summary);
}

/**
 * Extract intent type from conversation
 */
export function extractIntentType(messages, detectedIntent) {
    const allText = messages.map(m => m.text).join(' ').toLowerCase();

    if (allText.includes('retirement') || allText.includes('budhapa')) {
        return 'retirement';
    }
    if (allText.includes('child') && (allText.includes('education') || allText.includes('padhai'))) {
        return 'child_education';
    }
    if (allText.includes('marriage') || allText.includes('shaadi')) {
        return 'child_marriage';
    }
    if (allText.includes('sip') && (allText.includes('start') || allText.includes('shuru'))) {
        return 'sip_start';
    }
    if (allText.includes('wealth') || allText.includes('corpus') || allText.includes('crore')) {
        return 'wealth_creation';
    }

    return 'general';
}

/**
 * Send to CRM API (production implementation)
 */
async function sendToCRM(leadData) {
    // Example implementation - replace with your CRM endpoint
    /*
    try {
        const response = await fetch('YOUR_CRM_API_ENDPOINT', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.REACT_APP_CRM_API_KEY}`
            },
            body: JSON.stringify({
                ...leadData,
                source: 'chatbot',
                timestamp: new Date().toISOString()
            })
        });
        
        if (!response.ok) {
            throw new Error(`CRM API error: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('CRM API Error:', error);
        throw error;
    }
    */
}

/**
 * Get all leads (for admin/testing)
 */
export function getAllLeads() {
    try {
        return JSON.parse(localStorage.getItem('chatbot_leads') || '[]');
    } catch (error) {
        console.error('Error retrieving leads:', error);
        return [];
    }
}

/**
 * Export leads to CSV (for Google Sheets integration)
 */
export function exportLeadsToCSV() {
    const leads = getAllLeads();

    if (leads.length === 0) {
        return null;
    }

    // CSV headers
    const headers = ['Timestamp', 'Name', 'Phone', 'Email', 'City', 'Intent', 'Confidence', 'Score', 'Language', 'Status'];

    // CSV rows
    const rows = leads.map(lead => [
        lead.timestamp || '',
        lead.name || '',
        lead.phone || '',
        lead.email || '',
        lead.city || '',
        lead.intent_type || '',
        lead.lead_confidence || '',
        lead.lead_score || 0,
        lead.language || '',
        lead.status || 'new'
    ]);

    // Combine headers and rows
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csvContent;
}

