// RAG (Retrieval Augmented Generation) Service
// Grounds chatbot responses in Anupaat Nivesh website content

/**
 * Knowledge Base - Website Content Chunks
 * In production, this would be stored in a vector database (Pinecone, Qdrant, etc.)
 * For now, we use a structured knowledge base with semantic search
 */

// Website content chunks (structured for RAG)
const WEBSITE_KNOWLEDGE_BASE = {
    // About Anupaat Nivesh
    about: {
        chunks: [
            {
                id: 'about_1',
                content: 'Anupaat Nivesh is a trusted financial advisory firm focused on long-term wealth creation through disciplined investing. We help individuals and families plan for their financial goals with transparency and personalized guidance.',
                section: 'About Us',
                page_url: '/about',
                language: 'en'
            },
            {
                id: 'about_2',
                content: 'Anupaat Nivesh mein hum sirf invest nahi karwate, hum saath chalte hain — planning se tracking tak. Hum trust-driven, tech-enabled, long-term focused approach ke saath kaam karte hain.',
                section: 'About Us',
                page_url: '/about',
                language: 'hinglish'
            }
        ]
    },

    // Services & Offerings
    services: {
        chunks: [
            {
                id: 'service_1',
                content: 'Mutual Fund Investment: We help you invest in mutual funds through SIP (Systematic Investment Plan) or lumpsum investments. Our app-based platform makes it easy to start, track, and manage your investments.',
                section: 'Mutual Funds',
                page_url: '/mutual-funds',
                language: 'en'
            },
            {
                id: 'service_2',
                content: 'Equity Basket: Diversified equity portfolios designed for long-term wealth creation. Managed by experienced advisors with focus on quality stocks and disciplined allocation. Our equity baskets combine multiple equity mutual funds to create a balanced, risk-managed portfolio that aligns with your financial goals.',
                section: 'Equity Basket',
                page_url: '/equity-basket',
                language: 'en'
            },
            {
                id: 'service_2_hinglish',
                content: 'Equity Basket: Ek diversified portfolio jo different equity mutual funds ko combine karta hai. Long-term wealth creation ke liye designed, experienced advisors ke saath managed. Quality stocks aur disciplined allocation par focus.',
                section: 'Equity Basket',
                page_url: '/equity-basket',
                language: 'hinglish'
            },
            {
                id: 'service_3',
                content: 'Loan Against Securities: Use your existing investments as collateral to get loans at competitive rates. Quick processing, flexible repayment options.',
                section: 'Loan Against Securities',
                page_url: '/loan-against-securities',
                language: 'en'
            }
        ]
    },

    // Philosophy & Approach
    philosophy: {
        chunks: [
            {
                id: 'philosophy_1',
                content: 'Our investment philosophy emphasizes: Long-term thinking, Discipline over timing, Goal-based planning, Risk awareness, Transparency in all dealings. We do not guarantee returns or recommend specific schemes.',
                section: 'Investment Philosophy',
                page_url: '/whyanupaat',
                language: 'en'
            },
            {
                id: 'philosophy_2',
                content: 'Anupaat Nivesh ka approach: Honest advice, Long-term focus, Goal-based investing, Risk management, No commission pushing, App-based portfolio tracking, Human advisor support.',
                section: 'Investment Philosophy',
                page_url: '/whyanupaat',
                language: 'hinglish'
            }
        ]
    },

    // Process & How It Works
    process: {
        chunks: [
            {
                id: 'process_1',
                content: 'Getting started is simple: 1) Download our mobile app or visit website, 2) Complete KYC (one-time, digital), 3) Choose your investment amount and start SIP, 4) Track your portfolio 24x7 through the app. Our team provides support at every step.',
                section: 'How It Works',
                page_url: '/ourApp',
                language: 'en'
            },
            {
                id: 'process_2',
                content: 'SIP start karna bahut simple hai: App download karein, KYC complete karein (ek baar), Amount choose karein, Auto-debit setup karein. Bas! Humara team hamesha ready hai madad ke liye.',
                section: 'How It Works',
                page_url: '/ourApp',
                language: 'hinglish'
            }
        ]
    },

    // FAQs
    faqs: {
        chunks: [
            {
                id: 'faq_1',
                content: 'What is SIP? SIP (Systematic Investment Plan) means investing a fixed amount every month in mutual funds. It builds discipline and helps average out market volatility over time.',
                section: 'FAQs',
                page_url: '/faqs',
                language: 'en'
            },
            {
                id: 'faq_2',
                content: 'Is mutual fund safe? Mutual funds are regulated by SEBI and managed by professional fund managers. While returns are market-linked and not guaranteed, long-term equity investing has historically shown good returns.',
                section: 'FAQs',
                page_url: '/faqs',
                language: 'en'
            },
            {
                id: 'faq_3',
                content: 'Minimum investment amount? You can start SIP with as little as ₹500 per month. There is no maximum limit. Start small, increase gradually as your income grows.',
                section: 'FAQs',
                page_url: '/faqs',
                language: 'en'
            }
        ]
    }
};

/**
 * Simple semantic search (keyword-based matching)
 * In production, replace with vector similarity search using embeddings
 */
function semanticSearch(query, language = 'en', limit = 3) {
    const queryLower = query.toLowerCase();
    const allChunks = [];

    // Collect all chunks matching language
    Object.values(WEBSITE_KNOWLEDGE_BASE).forEach(category => {
        category.chunks.forEach(chunk => {
            if (chunk.language === language || chunk.language === 'en') {
                allChunks.push(chunk);
            }
        });
    });

    // Score chunks based on keyword matches
    const scoredChunks = allChunks.map(chunk => {
        const contentLower = chunk.content.toLowerCase();
        let score = 0;

        // Extract keywords from query
        const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);

        queryWords.forEach(word => {
            if (contentLower.includes(word)) {
                score += 1;
            }
        });

        // Boost score for exact phrase matches
        if (contentLower.includes(queryLower)) {
            score += 5;
        }

        // Boost score for section relevance
        const relevantSections = ['sip', 'mutual fund', 'investment', 'goal', 'retirement', 'education'];
        relevantSections.forEach(section => {
            if (queryLower.includes(section) && contentLower.includes(section)) {
                score += 2;
            }
        });

        return { ...chunk, score };
    });

    // Sort by score and return top results
    return scoredChunks
        .filter(chunk => chunk.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
}

/**
 * Retrieve relevant content for a query
 */
export function retrieveRelevantContent(userQuery, intent, language = 'en') {
    // Determine if query relates to services, offerings, process, or company positioning
    const queryLower = userQuery.toLowerCase();

    const isServiceQuery = queryLower.includes('service') ||
        queryLower.includes('offer') ||
        queryLower.includes('product') ||
        intent === 'product_exploration';

    const isProcessQuery = queryLower.includes('how') ||
        queryLower.includes('kaise') ||
        queryLower.includes('process') ||
        queryLower.includes('start') ||
        intent === 'how_to_start_investing';

    const isAboutQuery = queryLower.includes('about') ||
        queryLower.includes('company') ||
        queryLower.includes('anupaat');

    // Retrieve relevant chunks
    const relevantChunks = semanticSearch(userQuery, language, 3);

    // If no relevant chunks found, return empty
    if (relevantChunks.length === 0) {
        return null;
    }

    // Format retrieved content for LLM context
    const contextText = relevantChunks.map((chunk, index) => {
        return `[Source ${index + 1}: ${chunk.section}]\n${chunk.content}`;
    }).join('\n\n');

    return {
        chunks: relevantChunks,
        contextText,
        confidence: relevantChunks[0]?.score > 3 ? 'high' :
            relevantChunks[0]?.score > 1 ? 'medium' : 'low'
    };
}

/**
 * Build RAG-enhanced prompt
 */
export function buildRAGPrompt(userQuery, intent, language, retrievedContent) {
    if (!retrievedContent || retrievedContent.confidence === 'low') {
        return null; // Don't use RAG if confidence is low
    }

    const ragContext = `
RELEVANT WEBSITE CONTENT:
${retrievedContent.contextText}

INSTRUCTIONS:
- Use the above content as your primary factual base.
- Add conversational explanation on top.
- If information is missing, answer generically and offer advisor connect.
- Maintain the same language and tone as the user.
- Never contradict the website content.
`;

    return ragContext;
}

/**
 * Check if query needs RAG grounding
 */
export function needsRAGGrounding(userQuery, intent) {
    const queryLower = userQuery.toLowerCase();

    // Queries that need grounding
    const groundingKeywords = [
        'service', 'offering', 'product', 'process', 'how', 'kaise',
        'about', 'company', 'anupaat', 'what is', 'kya hai',
        'mutual fund', 'sip', 'equity', 'loan'
    ];

    const needsGrounding = groundingKeywords.some(keyword => queryLower.includes(keyword)) ||
        ['product_exploration', 'how_to_start_investing', 'beginner_query'].includes(intent);

    return needsGrounding;
}

// Export for future vector DB integration
export const RAG_CONFIG = {
    vectorDB: null, // Will be initialized with Pinecone/Qdrant/etc
    embeddingModel: 'text-embedding-3-small',
    chunkSize: 600, // tokens
    topK: 3, // number of chunks to retrieve
    minScore: 0.7 // minimum similarity score
};

