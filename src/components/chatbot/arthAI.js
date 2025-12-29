// ArthAI - Intelligent Multilingual Personal Finance Chatbot
// Designed for Anupaat Nivesh - Tier-2/Tier-3 Indian Users

// ============================================
// LANGUAGE DETECTION & SUPPORT
// ============================================

export const LANGUAGES = {
    HINGLISH: 'hinglish',
    HINDI: 'hi',
    ENGLISH: 'en',
    PUNJABI: 'pa'
};

// Auto-detect language from user input (enhanced for natural language switching)
export const detectLanguage = (message) => {
    const msg = message.toLowerCase();

    // Hinglish indicators (mix of Hindi and English) - most common for Indian users
    const hinglishPatterns = [
        /(kya|kaise|kab|kyun|hai|hain|ho|sakte|chahte|karte|hoga|hoga|kar|karne|karna)/i,
        /(investment|mutual|fund|sip|return|paisa|rupee|invest|planning|goal)/i,
        /(aur|ya|bhi|se|mein|ke|ki|ka|ko)/i // Common Hinglish connectors
    ];

    // Hindi indicators (pure Devanagari)
    const hindiPatterns = [
        /(क्या|कैसे|कब|क्यों|है|हैं|हो|सकते|चाहते|करते|होगा|होगी|कर|करने|करना)/,
        /(निवेश|म्यूचुअल|फंड|सिप|रिटर्न|पैसा|रुपए|निवेश|योजना|लक्ष्य)/,
        /(और|या|भी|से|में|के|की|का|को)/ // Common Hindi connectors
    ];

    // Punjabi indicators (Gurmukhi script)
    const punjabiPatterns = [
        /(ਕੀ|ਕਿਵੇਂ|ਕਦੋਂ|ਕਿਉਂ|ਹੈ|ਹਨ|ਹੋ|ਸਕਦੇ|ਚਾਹੁੰਦੇ|ਕਰਦੇ|ਹੋਗਾ|ਹੋਗੀ|ਕਰ|ਕਰਨੇ|ਕਰਨਾ)/,
        /(ਨਿਵੇਸ਼|ਮਿਊਚੁਅਲ|ਫੰਡ|ਸਿਪ|ਰਿਟਰਨ|ਪੈਸਾ|ਰੁਪਏ|ਨਿਵੇਸ਼|ਯੋਜਨਾ|ਲਕਸ਼)/,
        /(ਅਤੇ|ਜਾਂ|ਵੀ|ਤੋਂ|ਵਿੱਚ|ਦੇ|ਦੀ|ਦਾ|ਨੂੰ)/ // Common Punjabi connectors
    ];

    // English indicators (pure English, no Hindi/Punjabi words)
    const englishPatterns = [
        /^(what|how|when|why|where|which|who|can|could|should|would|will|is|are|am|do|does|did)/i,
        /(investment|mutual|fund|sip|return|money|planning|goal|retirement|education)/i
    ];

    // Count matches for each language
    const hasHinglish = hinglishPatterns.some(pattern => pattern.test(msg));
    const hasHindi = hindiPatterns.some(pattern => pattern.test(msg));
    const hasPunjabi = punjabiPatterns.some(pattern => pattern.test(msg));
    const hasEnglish = englishPatterns.some(pattern => pattern.test(msg)) && !hasHindi && !hasPunjabi;

    // Determine language with priority
    // If mixed Hindi + English words → Hinglish
    if (hasHindi && hasHinglish) return LANGUAGES.HINGLISH;
    // If pure Hindi script → Hindi
    if (hasHindi && !hasHinglish) return LANGUAGES.HINDI;
    // If Punjabi script → Punjabi
    if (hasPunjabi) return LANGUAGES.PUNJABI;
    // If pure English (no Indian language) → English
    if (hasEnglish) return LANGUAGES.ENGLISH;
    // If Hinglish patterns → Hinglish
    if (hasHinglish) return LANGUAGES.HINGLISH;

    // Default to Hinglish for Indian users (most natural)
    return LANGUAGES.HINGLISH;
};

// ============================================
// INTENT CATEGORIES
// ============================================

export const INTENTS = {
    BEGINNER_QUERY: 'beginner_query',
    GOAL_PLANNING: 'goal_planning',
    HOW_TO_START_INVESTING: 'how_to_start_investing',
    PRODUCT_EXPLORATION: 'product_exploration',
    UNREALISTIC_RETURN_EXPECTATION: 'unrealistic_return_expectation',
    FEAR_OR_RISK_CONCERN: 'fear_or_risk_concern',
    LEAD_CAPTURE_OPPORTUNITY: 'lead_capture_opportunity',
    GENERAL_FINANCE_QUESTION: 'general_finance_question',
    CALCULATOR: 'calculator',
    CONTACT_INFO: 'contact_info',
    // Legacy support (for backward compatibility)
    BEGINNER_EDUCATION: 'beginner_query',
    UNREALISTIC_EXPECTATION: 'unrealistic_return_expectation',
    FEAR_RISK: 'fear_or_risk_concern',
    HOW_TO_START: 'how_to_start_investing',
    ADVISOR_CONNECT: 'lead_capture_opportunity',
    GENERAL: 'general_finance_question',
    LIFE_STAGE: 'goal_planning' // Life stage queries map to goal planning
};

// ============================================
// INTELLIGENT INTENT DETECTION
// ============================================

export const detectIntent = (message, language = LANGUAGES.HINGLISH) => {
    const msg = message.toLowerCase();

    // Beginner Query
    if (msg.match(/(sip|systematic investment|monthly investment)/i) &&
        msg.match(/(kya|what|kaise|how|kya hai|what is)/i)) {
        return INTENTS.BEGINNER_QUERY;
    }

    // How to Start Investing (direct intent - works even without "mutual fund" keyword)
    // Examples: "how to start investment", "how to start investing", "how to invest", "start investing"
    if (msg.match(/(how\s+to\s+start\s+(investment|investing)|how\s+to\s+invest|start\s+(investment|investing)|begin\s+(investment|investing))/i) ||
        msg.match(/(invest\s+kaise\s+start|investment\s+kaise\s+start|kaise\s+invest\s+karein|mutual\s+fund\s+mein\s+investment\s+kaise\s+karein)/i)) {
        return INTENTS.HOW_TO_START_INVESTING;
    }

    // SIP Education queries (understand, explain, samjhao, start, kaise) - HIGH PRIORITY
    // This should catch ALL SIP-related queries first before other patterns
    if (msg.match(/(sip|systematic investment)/i)) {
        // SIP education/understanding queries
        if (msg.match(/(understand|explain|samjhao|samj|kya hai|what is|क्या|समझाओ|ਕੀ|ਸਮਝਾਓ|kaise|how|start|shuru|शुरू|ਸ਼ੁਰੂ)/i)) {
            return INTENTS.HOW_TO_START_INVESTING;
        }
        // SIP calculation queries
        if (msg.match(/(calculate|calculator|calc|गणना|ਗਣਨਾ)/i)) {
            return INTENTS.CALCULATOR;
        }
        // General SIP queries (default to education)
        return INTENTS.HOW_TO_START_INVESTING;
    }
    
    // How to Start Investing (mutual fund queries without SIP)
    if (msg.match(/(mutual fund|mf|mutual)/i) &&
        msg.match(/(kaise|how|invest|start|karna|karne)/i)) {
        return INTENTS.HOW_TO_START_INVESTING;
    }

    // Life Stage (maps to goal planning) - Higher priority for "just started" + investment queries
    if (msg.match(/(just started|new job|earning|started my job|new career)/i) &&
        msg.match(/(invest|sip|mutual fund|planning|suggest|advice)/i)) {
        return INTENTS.HOW_TO_START_INVESTING;
    }
    // Age-based goal planning (if no explicit investment query, might be general)
    if (msg.match(/(25|30|35|40|young|saal|year|age|old)/i) &&
        msg.match(/(invest|sip|planning|goal|suggest|advice|want)/i)) {
        return INTENTS.GOAL_PLANNING;
    }

    // Unrealistic Return Expectation
    if (msg.match(/(double|dubna|2x|do gunna|fast|jaldi|quick|monthly|har mahine)/i) &&
        msg.match(/(paisa|money|amount|invest|return|profit|percent|%)/i)) {
        return INTENTS.UNREALISTIC_RETURN_EXPECTATION;
    }

    // Fear or Risk Concern
    if (msg.match(/(fear|dar|risk|safe|gir|crash|loss|down|volatile|unsafe)/i)) {
        return INTENTS.FEAR_OR_RISK_CONCERN;
    }

    // Product Exploration
    if (msg.match(/(product|service|offer|basket|equity|debt|gold|portfolio)/i)) {
        return INTENTS.PRODUCT_EXPLORATION;
    }

    // Goal Planning
    if (msg.match(/(retirement|retire|budhapa|old age|child|children|baccha|education|padhai|marriage|shaadi|goal|target|wealth|wealth creation|corpus|crore|\bcr\b)/i)) {
        return INTENTS.GOAL_PLANNING;
    }

    // Calculator - Only if explicitly requested (more specific patterns to avoid false positives)
    // Don't trigger on general questions like "kitna return milega" - those are general finance questions
    if (msg.match(/(calculate|calculator|calc|ganna|kitna.*calculate|how much.*calculate|kya hoga.*calculate)/i) ||
        msg.match(/^(calculate|calculator|calc)/i)) {
        return INTENTS.CALCULATOR;
    }

    // Contact Information Query
    if (msg.match(/(contact|email|phone|number|customer care|reach|address|details|sampark|sampark karein|contact details|contact information|how to contact|kaise contact|phone number|email address|what.*your.*contact|your.*contact|your.*email|your.*phone)/i)) {
        return INTENTS.CONTACT_INFO;
    }

    // Lead Capture Opportunity
    if (msg.match(/(advisor|expert|help|consult|plan|best|recommend|kya karein|what should)/i)) {
        return INTENTS.LEAD_CAPTURE_OPPORTUNITY;
    }

    return INTENTS.GENERAL_FINANCE_QUESTION;
};

// ============================================
// RESPONSE DATABASE (MULTILINGUAL)
// ============================================

export const responses = {
    [LANGUAGES.HINGLISH]: {
        greeting: {
            text: "Namaste! 👋\n\nMain **ArthAI** hoon — Anupaat Nivesh ka AI finance assistant.\n\nMain aapki madad karta hoon:\n• Mutual funds samajhne mein\n• SIP aur investment planning mein\n• Apne financial goals set karne mein\n\n**Bina kisi pressure ke, bas simple baat-cheet.**\n\nAap kya janna chahte hain?",
            quickReplies: ['SIP kya hai?', 'Kaise start karein?', 'Goal planning', 'Calculator']
        },

        whatIsSIP: {
            text: "**SIP — Simple Explanation** 💡\n\n**SIP matlab:** Systematic Investment Plan\n\n**Aasan bhasha mein:**\nJaise aap har mahine mobile recharge karte ho, waise hi SIP mein har mahine ek fixed amount invest karte ho.\n\n**Kyun SIP?**\n✓ **Discipline:** Har mahine automatically invest hota hai\n✓ **Small start:** ₹500 se bhi shuru kar sakte hain\n✓ **Market timing ki tension nahi:** Regular invest karke average price milta hai\n✓ **Long-term wealth:** Time ke saath paisa grow hota hai\n\n**Example:**\nAgar aap ₹5,000/month SIP start karte ho 20 saal ke liye (12% return maan kar):\n• Invest: ₹12 lakh\n• Maturity: ~₹50 lakh\n• Return: ~₹38 lakh\n\n**Important:** SIP ek habit hai, lottery nahi. Patience chahiye. 💪",
            quickReplies: ['Kaise start karein?', 'Calculator use karein', 'Goal planning']
        },

        howToStart: {
            text: "**How to start investing (simple)**\n\n- **Goal choose karein:** retirement / child education / wealth creation\n- **KYC complete:** PAN + Aadhaar (one-time)\n- **Small SIP start:** ₹500–₹2,000/month se bhi start ho sakta hai\n- **Auto-debit set:** salary date ke aas-paas\n- **Disciplined rehna:** 12+ months habit banayein (market-linked, not guaranteed)\n\nAap kis goal ke liye start karna chahte hain?",
            quickReplies: ['Goal planning', 'SIP calculation', 'Talk to advisor']
        },

        youngEarner: {
            text: "**25 saal — Yehi Perfect Time Hai! 🎯**\n\n**Aapke paas sabse badi cheez hai:**\n⏰ **TIME** — Compounding ka magic time ke saath hi kaam karta hai\n\n**Simple example:**\n• **25 saal se start:** ₹10,000/month × 35 saal = ~₹6.5 Cr\n• **35 saal se start:** ₹10,000/month × 25 saal = ~₹1.8 Cr\n• **45 saal se start:** ₹10,000/month × 15 saal = ~₹50 Lakh\n\n**Dekhiye, 10 saal ka difference kitna bada hai!**\n\n**Kya karein?**\n✓ **Chhote se shuru karein:** ₹2,000-5,000/month bhi kaafi hai\n✓ **Goal set karein:** Retirement? House? Child education?\n✓ **SIP start karein:** Discipline se, har mahine\n✓ **Patience rakhein:** 10-15 saal ka soch kar invest karein\n\n**Anupaat Nivesh mein hum aapke saath hain — planning se tracking tak.**",
            quickReplies: ['Goal planning', 'SIP calculator', 'Advisor se baat']
        },

        unrealisticExpectation: {
            text: "**Return Expectations — Realistic Approach** 💰\n\n**Sach bataun?**\nLong-term equity investing mein **~12% per year** ek reasonable expectation hai — par yeh **guaranteed nahi hai**, market-linked hai.\n\n**Important:**\n• **Monthly return** ki baat nahi karte — market up-down hota rehta hai\n• **Annual return** (saal ka) realistic hai — 10-15% long-term\n• **No shortcuts:** Fast money = high risk = possible loss\n\n**Anupaat Nivesh ka approach:**\n✓ **Honest advice:** Koi fake promise nahi\n✓ **Long-term focus:** 10-15 saal ka soch kar invest\n✓ **Goal-based:** Kya chahiye, kab chahiye — uske hisaab se plan\n✓ **Risk management:** Right balance of equity + debt\n\n**Example:**\n₹5 lakh invest karein 10 saal ke liye (12% return maan kar):\n• Maturity: ~₹15.5 lakh (3x ho jayega!)\n\n**Agar aap serious hain long-term planning ke liye, toh humare advisor se baat kar sakte hain — free consultation.**",
            quickReplies: ['Calculator', 'Advisor se baat', 'Goal planning']
        },

        fearRisk: {
            text: "**Market Risk — Samjhein, Daro Mat** 😌\n\n**Main samajh sakta hoon — market girne par dar lagta hai.**\n\n**Sachai yeh hai:**\n• Market up-down hota rehta hai — **yeh normal hai**\n• Short-term mein volatility hoti hai\n• **Long-term mein (10+ saal) market upar hi jata hai**\n\n**Kya karein?**\n✓ **SIP continue rakhein:** Market down ho toh zyada units milte hain\n✓ **Long-term soch kar invest:** 10-15 saal ka horizon\n✓ **Diversify:** Equity + Debt balance\n✓ **Panic mat karein:** Market recover hota hai\n\n**Example:**\n2008 crash ke baad bhi market recover hua — jo log SIP continue rakhe, unko fayda hua.\n\n**Anupaat Nivesh mein:**\n✓ Regular portfolio review\n✓ Rebalancing when needed\n✓ Advisor support hamesha available\n\n**Agar aap confused hain, toh humare advisor se baat karein — free consultation.**",
            quickReplies: ['SIP samjhein', 'Portfolio review', 'Advisor se baat']
        },

        goalRetirement: {
            text: "**Retirement Planning — Abhi Start Karein** 🏖️\n\n**Kyun zaroori hai?**\n• Inflation: Aaj ₹1 lakh, 20 saal baad ₹3-4 lakh ki value hogi\n• Life expectancy badh rahi hai — zyada paisa chahiye\n• Pension se kaam nahi chalega\n\n**Kya karein?**\n✓ **Age calculate karein:** Retirement tak kitne saal hain?\n✓ **Expense estimate:** Monthly kitna chahiye?\n✓ **SIP start karein:** Har mahine invest karein\n✓ **Long-term focus:** 20-25 saal ka soch kar\n\n**Example (Anupaat Nivesh style):**\nAgar aap 35 saal ke hain aur 60 saal mein retire karna chahte hain:\n• ₹20,000/month SIP × 25 saal (12% return maan kar)\n• Maturity: ~₹4.5 Cr\n• Monthly income: ~₹3-4 lakh (SWP se)\n\n**Hum aapko right plan choose karne, discipline maintain karne aur tracking mein help karte hain.**\n\n**Agar aap chahein, hum aapke liye ek simple plan bana sakte hain — free consultation.**",
            quickReplies: ['Calculator', 'Advisor se baat', 'SWP samjhein']
        },

        goalChildEducation: {
            text: "**Child Education Planning — Abhi Start Karein** 🎓\n\n**Kyun zaroori hai?**\n• Education cost har saal 8-10% badh raha hai\n• Aaj ₹10 lakh, 15 saal baad ₹30-40 lakh ho jayega\n• Last moment mein paisa nahi jama hoga\n\n**Kya karein?**\n✓ **Age calculate:** Bacche ki age se college tak kitne saal?\n✓ **Amount estimate:** Kitna chahiye hoga?\n✓ **SIP start:** Har mahine invest karein\n✓ **Step-up SIP:** Salary badhne par SIP bhi badhayen\n\n**Example (Anupaat Nivesh style):**\nBaccha 2 saal ka hai, 18 saal mein college jayega:\n• ₹15,000/month SIP × 16 saal (12% return maan kar)\n• Maturity: ~₹1 Cr\n• Education ke liye kaafi hai!\n\n**Hum aapko right plan choose karne, discipline maintain karne aur tracking mein help karte hain.**\n\n**Agar aap chahein, hum aapke liye ek simple plan bana sakte hain — free consultation.**",
            quickReplies: ['Calculator', 'Advisor se baat', 'Step-up SIP']
        },

        leadCapture: {
            text: "**Expert Help — Free Consultation** 🤝\n\n**Agar aap chahein, hum aapke liye ek simple personalised plan bana sakte hain — bina koi pressure ke.**\n\n**Kya milega?**\n✓ Personalized investment plan\n✓ Goal-based SIP recommendation\n✓ Portfolio review\n✓ Regular support\n\n**Bas yeh details chahiye:**\n• Mobile number ya Email ID\n\n**Humara advisor aapko call karega — free consultation, koi charge nahi.**\n\n**Aap ready hain details share karne ke liye?**",
            quickReplies: ['Haan, details share karta hoon', 'Baad mein', 'Calculator pehle']
        },

        calculator: {
            text: "**Calculator — Apne Investment Calculate Karein** 🧮\n\n**Available calculators:**\n• SIP Calculator\n• Lumpsum Calculator\n• Step-up SIP\n\n**Neeche calculator use karein ya type karein:**\n\"Calculate SIP 10000 15 years\"",
            quickReplies: ['SIP Calculator', 'Lumpsum Calculator', 'Step-up SIP']
        },

        contactInfo: {
            text: "**Anupaat Nivesh Contact Information** 📞\n\n**Aap humse is tarah connect kar sakte hain:**\n\n📧 **Email:** contact@anupaatnivesh.com\n📱 **Customer Care:** 9501195200\n\n**Hum aapki madad karte hain:**\n• Investment planning\n• SIP guidance\n• Portfolio review\n• Goal-based planning\n\n**Agar aap chahein, humare advisor se baat kar sakte hain — free consultation.**",
            quickReplies: ['Talk to advisor', 'Goal planning', 'Calculator']
        }
    },

    // Add other languages (Hindi, English, Punjabi) with similar structure
    [LANGUAGES.HINDI]: {
        greeting: {
            text: "नमस्ते! 👋\n\nमैं **ArthAI** हूं — Anupaat Nivesh का AI वित्त सहायक।\n\nमैं आपकी मदद करता हूं:\n• म्यूचुअल फंड समझने में\n• SIP और निवेश योजना में\n• अपने वित्तीय लक्ष्य निर्धारित करने में\n\n**बिना किसी दबाव के, बस सरल बात-चीत।**\n\nआप क्या जानना चाहते हैं?",
            quickReplies: ['SIP क्या है?', 'कैसे शुरू करें?', 'लक्ष्य योजना', 'कैलकुलेटर']
        },

        contactInfo: {
            text: "**Anupaat Nivesh संपर्क जानकारी** 📞\n\n**आप हमसे इस तरह जुड़ सकते हैं:**\n\n📧 **ईमेल:** contact@anupaatnivesh.com\n📱 **ग्राहक सेवा:** 9501195200\n\n**हम आपकी मदद करते हैं:**\n• निवेश योजना\n• SIP मार्गदर्शन\n• पोर्टफोलियो समीक्षा\n• लक्ष्य-आधारित योजना\n\n**अगर आप चाहें, तो आप हमारे सलाहकार से बात कर सकते हैं — मुफ्त परामर्श।**",
            quickReplies: ['सलाहकार से बात करें', 'लक्ष्य योजना', 'कैलकुलेटर']
        }
    },

    [LANGUAGES.ENGLISH]: {
        greeting: {
            text: "Hello! 👋\n\nI'm **ArthAI** — Anupaat Nivesh's AI finance assistant.\n\nI help you with:\n• Understanding mutual funds\n• SIP and investment planning\n• Setting your financial goals\n\n**No pressure, just simple conversation.**\n\nWhat would you like to know?",
            quickReplies: ['What is SIP?', 'How to start?', 'Goal planning', 'Calculator']
        }
        ,
        howToStart: {
            text: "**How to start investing (simple)**\n\n- Pick 1 goal (retirement / child education / wealth creation)\n- Complete KYC (PAN + Aadhaar, one-time)\n- Start a small SIP (₹500–₹2,000/month is fine)\n- Set auto-debit and stay consistent (market-linked, not guaranteed)\n- Track in the Anupaat Nivesh app; our team can guide you if needed\n\nWhich goal are you starting for?",
            quickReplies: ['Goal planning', 'SIP Calculation', 'Talk to advisor']
        }
        ,
        goalRetirement: {
            text: "**Retirement goal (quick plan)**\n\n- Retirement needs a long horizon (15–30 years) and inflation matters\n- Start with a SIP + increase it as income grows\n- Keep it disciplined and diversified (market-linked, not guaranteed)\n\nWhich target feels closer for you?",
            quickReplies: ['1 Cr for Retirement', '5 Cr for Retirement', 'Talk to advisor']
        },
        goalChildEducation: {
            text: "**Child education goal (quick plan)**\n\n- Education costs rise fast, so starting early helps\n- SIP + step-up SIP works well if you can increase yearly\n- Keep it disciplined (market-linked, not guaranteed)\n\nWhat target are you aiming for?",
            quickReplies: ['1 Cr for Children', '2 Cr for Children', 'Talk to advisor']
        },
        goalFirstCrore: {
            text: "**Make your 1st Crore (wealth creation)**\n\n- This works best with a 10–20 year horizon\n- Start a SIP, increase yearly, and avoid stopping in market ups/downs\n- Track progress in the Anupaat Nivesh app (market-linked, not guaranteed)\n\nChoose a target to start planning:",
            quickReplies: ['My first 1 Cr', 'My first 5 Cr', 'SIP Calculation']
        },

        contactInfo: {
            text: "**Anupaat Nivesh Contact Information** 📞\n\n**You can reach us at:**\n\n📧 **Email:** contact@anupaatnivesh.com\n📱 **Customer Care:** 9501195200\n\n**We help you with:**\n• Investment planning\n• SIP guidance\n• Portfolio review\n• Goal-based planning\n\n**If you'd like, you can talk to our advisor — free consultation.**",
            quickReplies: ['Talk to advisor', 'Goal planning', 'Calculator']
        }
    },

    [LANGUAGES.PUNJABI]: {
        greeting: {
            text: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! 👋\n\nਮੈਂ **ArthAI** ਹਾਂ — Anupaat Nivesh ਦਾ AI ਵਿੱਤ ਸਹਾਇਕ।\n\nਮੈਂ ਤੁਹਾਡੀ ਮਦਦ ਕਰਦਾ ਹਾਂ:\n• ਮਿਊਚੁਅਲ ਫੰਡ ਸਮਝਣ ਵਿੱਚ\n• SIP ਅਤੇ ਨਿਵੇਸ਼ ਯੋਜਨਾ ਵਿੱਚ\n• ਆਪਣੇ ਵਿੱਤੀ ਟੀਚੇ ਨਿਰਧਾਰਤ ਕਰਨ ਵਿੱਚ\n\n**ਕੋਈ ਦਬਾਅ ਨਹੀਂ, ਬਸ ਸਧਾਰਨ ਗੱਲਬਾਤ।**\n\nਤੁਸੀਂ ਕੀ ਜਾਣਨਾ ਚਾਹੁੰਦੇ ਹੋ?",
            quickReplies: ['SIP ਕੀ ਹੈ?', 'ਕਿਵੇਂ ਸ਼ੁਰੂ ਕਰੀਏ?', 'ਟੀਚਾ ਯੋਜਨਾ', 'ਕੈਲਕੁਲੇਟਰ']
        },

        contactInfo: {
            text: "**Anupaat Nivesh ਸੰਪਰਕ ਜਾਣਕਾਰੀ** 📞\n\n**ਤੁਸੀਂ ਸਾਡੇ ਨਾਲ ਇਸ ਤਰ੍ਹਾਂ ਜੁੜ ਸਕਦੇ ਹੋ:**\n\n📧 **ਈਮੇਲ:** contact@anupaatnivesh.com\n📱 **ਗ੍ਰਾਹਕ ਸੇਵਾ:** 9501195200\n\n**ਅਸੀਂ ਤੁਹਾਡੀ ਮਦਦ ਕਰਦੇ ਹਾਂ:**\n• ਨਿਵੇਸ਼ ਯੋਜਨਾ\n• SIP ਮਾਰਗਦਰਸ਼ਨ\n• ਪੋਰਟਫੋਲੀਓ ਸਮੀਖਿਆ\n• ਟੀਚਾ-ਅਧਾਰਿਤ ਯੋਜਨਾ\n\n**ਜੇ ਤੁਸੀਂ ਚਾਹੋ, ਤਾਂ ਤੁਸੀਂ ਸਾਡੇ ਸਲਾਹਕਾਰ ਨਾਲ ਗੱਲ ਕਰ ਸਕਦੇ ਹੋ — ਮੁਫ਼ਤ ਸਲਾਹ।**",
            quickReplies: ['ਸਲਾਹਕਾਰ ਨਾਲ ਗੱਲ ਕਰੋ', 'ਟੀਚਾ ਯੋਜਨਾ', 'ਕੈਲਕੁਲੇਟਰ']
        }
    }
};

// ============================================
// RESPONSE GENERATOR
// ============================================

export const generateResponse = (intent, message, language, context = {}) => {
    const langResponses = responses[language] || responses[LANGUAGES.HINGLISH];
    const msg = (message || '').toLowerCase();

    let response;

    switch (intent) {
        case INTENTS.BEGINNER_EDUCATION:
            if (msg.includes('sip')) {
                response = langResponses.whatIsSIP || langResponses.greeting;
            } else {
                response = langResponses.greeting;
            }
            break;

        case INTENTS.HOW_TO_START:
        case INTENTS.HOW_TO_START_INVESTING:
            response = langResponses.howToStart || langResponses.greeting;
            break;

        case INTENTS.LIFE_STAGE:
            response = langResponses.youngEarner || langResponses.greeting;
            break;

        case INTENTS.UNREALISTIC_EXPECTATION:
            response = langResponses.unrealisticExpectation || langResponses.greeting;
            break;

        case INTENTS.FEAR_RISK:
            response = langResponses.fearRisk || langResponses.greeting;
            break;

        case INTENTS.GOAL_PLANNING:
            if (msg.match(/(retirement|retire|budhapa)/i)) {
                response = langResponses.goalRetirement || langResponses.greeting;
            } else if (msg.match(/(child|baccha|education|padhai)/i)) {
                response = langResponses.goalChildEducation || langResponses.greeting;
            } else if (msg.match(/(wealth|wealth creation|1st|first|crore|\bcr\b|corpus)/i)) {
                response = langResponses.goalFirstCrore || langResponses.goalRetirement || langResponses.greeting;
            } else {
                response = langResponses.goalRetirement || langResponses.greeting;
            }
            break;

        case INTENTS.ADVISOR_CONNECT:
            response = langResponses.leadCapture || langResponses.greeting;
            break;

        case INTENTS.CALCULATOR:
            response = langResponses.calculator || langResponses.greeting;
            break;

        case INTENTS.CONTACT_INFO:
            response = langResponses.contactInfo || langResponses.greeting;
            break;

        default:
            response = langResponses.greeting;
    }

    // Ensure response always has text property
    if (!response || !response.text) {
        response = langResponses.greeting || {
            text: language === LANGUAGES.HINGLISH
                ? 'Maaf kijiye, kuch samajh nahi aaya. Kya aap phir se puch sakte hain?'
                : 'Sorry, I did not understand. Can you please ask again?',
            quickReplies: []
        };
    }

    // Ensure response has all required properties
    return {
        text: response.text || '',
        quickReplies: response.quickReplies || [],
        showCTAs: response.showCTAs !== undefined ? response.showCTAs : true,
        ctaType: response.ctaType || 'general'
    };
};

// ============================================
// CONVERSATION FLOW MANAGER
// ============================================

export class ConversationFlow {
    constructor() {
        this.state = 'greeting';
        this.context = {
            language: LANGUAGES.HINGLISH,
            age: null,
            income: null,
            goal: null,
            riskComfort: null,
            questionsAsked: [],
            intentHistory: []
        };
    }

    updateState(newState) {
        this.state = newState;
    }

    updateContext(updates) {
        this.context = { ...this.context, ...updates };
    }

    shouldCaptureLead(message, intent) {
        const msg = message.toLowerCase();

        // High-intent triggers (soft, trust-oriented)
        const highIntentTriggers = [
            'what should i do', 'kya karein', 'suggest plan', 'recommend',
            'help me', 'guide me', 'personalised', 'personalized',
            'kitna invest', 'how much', 'corpus', 'goal',
            'child education', 'retirement', 'marriage', 'baccha', 'budhapa',
            'advisor', 'expert', 'team', 'consultation', 'consult',
            'best fund', 'plan', 'what should'
        ];

        // Check for high-intent keywords
        const hasHighIntentKeyword = highIntentTriggers.some(trigger => msg.includes(trigger));

        // Check for specific investment amounts or time horizons
        const hasSpecificQuery = msg.match(/(\d+.*(month|year|rupee|lakh|cr|corpus))/i);

        // Check for goal-related queries
        const hasGoal = this.context.goal !== null ||
            msg.includes('goal') ||
            msg.includes('planning') ||
            msg.includes('child') ||
            msg.includes('retirement');

        // Meaningful engagement (user has asked multiple questions)
        const meaningfulEngagement = this.context.questionsAsked.length >= 3;

        return hasHighIntentKeyword ||
            hasSpecificQuery ||
            hasGoal ||
            intent === INTENTS.LEAD_CAPTURE_OPPORTUNITY ||
            intent === INTENTS.GOAL_PLANNING ||
            (meaningfulEngagement && (intent === INTENTS.PRODUCT_EXPLORATION || intent === INTENTS.HOW_TO_START_INVESTING));
    }

    /**
     * Assess if user needs education before calculator
     */
    needsEducationBeforeCalculator(intent, message, context) {
        const msg = message.toLowerCase();

        // If user explicitly asks for calculator with numbers, they're ready
        if (msg.match(/(calculate|calc|ganna|kitna).*\d+/i)) {
            return false;
        }

        // If user asks "what is", "how does", "explain" - needs education
        if (msg.match(/(what is|kya hai|how does|kaise|explain|samjhao)/i)) {
            return true;
        }

        // If this is first time asking about this topic - needs education
        const isFirstTime = !context.questionsAsked.some(q =>
            q.toLowerCase().includes('sip') ||
            q.toLowerCase().includes('mutual fund') ||
            q.toLowerCase().includes('investment')
        );

        if (isFirstTime && intent === INTENTS.CALCULATOR) {
            return true;
        }

        // If user has asked less than 2 questions - needs education
        if (context.questionsAsked.length < 2 && intent === INTENTS.CALCULATOR) {
            return true;
        }

        return false;
    }

    /**
     * Get user's knowledge level based on conversation
     */
    getUserKnowledgeLevel(context) {
        const questions = context.questionsAsked || [];

        // Count educational keywords
        const educationalKeywords = ['what', 'how', 'why', 'kya', 'kaise', 'kyun', 'explain', 'samjhao'];
        const educationalQuestions = questions.filter(q =>
            educationalKeywords.some(keyword => q.toLowerCase().includes(keyword))
        ).length;

        if (educationalQuestions === 0 && questions.length > 0) {
            return 'advanced'; // User is asking specific questions, not basics
        } else if (educationalQuestions > 2) {
            return 'beginner'; // User is still learning basics
        } else {
            return 'intermediate'; // User has some knowledge
        }
    }

    async getNextStep(intent, message, language, aiServiceObj = null) {
        // Track questions and intents
        this.context.questionsAsked.push(message);
        this.context.intentHistory.push(intent);
        this.context.language = language;

        // Assess if user needs education before calculator
        const needsEducation = this.needsEducationBeforeCalculator(intent, message, this.context);
        const knowledgeLevel = this.getUserKnowledgeLevel(this.context);

        // If calculator intent but needs education, redirect to education
        if (intent === INTENTS.CALCULATOR && needsEducation) {
            // Provide education first
            const educationIntent = this.context.questionsAsked.some(q =>
                q.toLowerCase().includes('sip')
            ) ? INTENTS.BEGINNER_EDUCATION : INTENTS.HOW_TO_START;

            let response = generateResponse(educationIntent, message, language, this.context);

            // Ensure response has text property
            if (!response || !response.text) {
                const langResponses = responses[language] || responses[LANGUAGES.HINGLISH];
                response = langResponses.greeting || { text: 'Maaf kijiye, kuch samajh nahi aaya. Kya aap phir se puch sakte hain?', quickReplies: [] };
            }

            // Add calculator offer after education
            response.text = (response.text || '') + `\n\nAgar aap calculations karna chahte hain, toh main aapko calculator dikha sakta hoon. Calculator use karein?`;
            response.quickReplies = response.quickReplies || ['Haan, calculator dikhao', 'Aur samjhao', 'Goal planning'];
            response.showCalculator = false; // Don't show calculator yet

            return response;
        }

        // Try AI model first if available
        if (aiServiceObj && typeof aiServiceObj.callAIModel === 'function' && knowledgeLevel !== 'advanced') {
            try {
                const aiResponse = await aiServiceObj.callAIModel(message, language, this.context, intent);
                if (aiResponse && aiResponse.text) {
                    // Enhance AI response with quick replies
                    return {
                        text: aiResponse.text,
                        quickReplies: this.getQuickRepliesForIntent(intent, language),
                        showCTAs: true,
                        ctaType: 'general',
                        showCalculator: intent === INTENTS.CALCULATOR && !needsEducation,
                        usedAI: true,
                        aiModel: aiResponse.model
                    };
                }
            } catch (error) {
                console.error('AI service error, falling back to rule-based:', error);
            }
        }

        // Lead capture logic
        if (this.shouldCaptureLead(message, intent)) {
            this.updateState('lead_capture');
            let leadResponse = generateResponse(INTENTS.ADVISOR_CONNECT, message, language, this.context);
            // Ensure response has text
            if (!leadResponse || !leadResponse.text) {
                const langResponses = responses[language] || responses[LANGUAGES.HINGLISH];
                leadResponse = langResponses.leadCapture || langResponses.greeting || {
                    text: language === LANGUAGES.HINGLISH
                        ? 'Agar aap chahein, hum aapke liye ek simple plan bana sakte hain. Aap apna mobile number ya email share karna chahenge?'
                        : 'If you would like, we can create a simple plan for you. Would you like to share your mobile number or email?',
                    quickReplies: []
                };
            }
            return {
                text: leadResponse.text || '',
                quickReplies: leadResponse.quickReplies || ['Haan, details share karta hoon', 'Baad mein'],
                showCTAs: true,
                ctaType: 'general'
            };
        }

        // Goal discovery
        if (intent === INTENTS.GOAL_PLANNING) {
            this.updateState('goal_discovery');
        }

        // Generate rule-based response
        const response = generateResponse(intent, message, language, this.context);

        // Add calculator option if appropriate
        if (intent === INTENTS.CALCULATOR && !needsEducation) {
            response.showCalculator = true;
        } else {
            response.showCalculator = false;
        }

        return response;
    }

    /**
     * Get appropriate quick replies based on intent
     */
    getQuickRepliesForIntent(intent, language) {
        switch (intent) {
            case INTENTS.BEGINNER_EDUCATION:
                return ['Calculator', 'Kaise start karein?', 'Goal planning'];
            case INTENTS.HOW_TO_START:
                return ['SIP samjhao', 'Calculator', 'Advisor se baat'];
            case INTENTS.CALCULATOR:
                return ['SIP Calculator', 'Lumpsum Calculator', 'Aur samjhao'];
            case INTENTS.GOAL_PLANNING:
                return ['Calculator', 'Advisor se baat', 'Website visit'];
            default:
                return ['Calculator', 'Goal planning', 'Advisor se baat'];
        }
    }
}

const arthAIModule = {
    LANGUAGES,
    INTENTS,
    detectLanguage,
    detectIntent,
    generateResponse,
    ConversationFlow,
    responses
};

export default arthAIModule;

