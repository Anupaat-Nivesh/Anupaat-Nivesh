import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaTimes, FaPaperPlane, FaUser, FaPhone, FaEnvelope, FaGlobe, FaMobileAlt, FaLanguage, FaMicrophone, FaMicrophoneSlash, FaChartLine, FaBrain, FaCoins } from 'react-icons/fa';
import arthAILogo from '../../assets/ArthAI.png';
import { Link } from 'react-router-dom';
import { translations } from './translations';
import {
  detectLanguage,
  detectIntent,
  generateResponse,
  ConversationFlow,
  INTENTS,
  LANGUAGES,
  responses
} from './arthAI';
import {
  callAIModel,
  saveLearningPattern
} from './aiService';
import { llmAgent } from './llmAgent';
import { saveLead, generateConversationSummary, extractIntentType } from './crmService';
import { sendContactEmails } from './emailService';
import { voiceService, VOICE_CONFIG } from './voiceService';
import logger from '../../utils/logger';
import { createResponse, extractTextFromAIResponse, validateResponse } from './responseHandler';
import { conversationEngine } from './conversationEngine';
import { registerAllFlows } from './flowDefinitions';
import { registerCTAFlows } from './ctaFlowDefinitions';
import analytics from './analyticsService';
import './ChatBot.css';

// Helper function to get default quick replies based on language
// Excludes "Talk to advisor" if it has already been shown
const getDefaultQuickReplies = (lang, includeAdvisor = true) => {
  const t = translations[lang] || translations.en;
  const defaultReplies = [
    t.sipKyaHai,
    t.mutualFundKyaHai,
    t.equityInvestmentKyaHai,
    t.goalPlanning,
    ...(includeAdvisor ? [t.talkToAdvisor] : []), // Only include if not already shown
    t.sipCalculation
  ];
  return defaultReplies;
};

const ChatBot = ({ standalone = false }) => {
  // Use a ref to track message IDs to ensure uniqueness
  // Initialize with timestamp to avoid collisions across sessions
  const messageIdCounter = useRef(Date.now());

  // Helper function to generate truly unique message IDs
  const generateUniqueMessageId = () => {
    return `msg-${Date.now()}-${++messageIdCounter.current}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Unified response handler - replaces all normalization functions
  // This is the single source of truth for creating response objects

  const [language, setLanguage] = useState(() => {
    // Check if language is stored in localStorage
    const savedLang = localStorage.getItem('chatbot_language');
    return savedLang || LANGUAGES.HINGLISH; // Default to Hinglish
  });
  const [isOpen, setIsOpen] = useState(standalone); // Auto-open if standalone
  const [showContactForm, setShowContactForm] = useState(false);
  const [hasShownAdvisorCTA, setHasShownAdvisorCTA] = useState(false); // Track if "Talk to advisor" has been shown
  const [contactInfo, setContactInfo] = useState({ email: '', phone: '' });
  const [conversationStage, setConversationStage] = useState('greeting'); // greeting, exploring, contact, engaged
  const [goalContext, setGoalContext] = useState(null); // Track selected goal to prevent repetition
  const [userContext, setUserContext] = useState({ interest: '', goal: '', experience: '' });
  const [conversationFlow] = useState(() => new ConversationFlow());

  // Initialize LLM Agent (persists across renders)
  const agentRef = useRef(null);
  if (!agentRef.current) {
    agentRef.current = llmAgent;
  }
  const llmAgentInstance = agentRef.current;
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorType, setCalculatorType] = useState('sip'); // sip, lumpsum, stepup
  const [calculatorInputs, setCalculatorInputs] = useState({
    sip: { amount: 10000, years: 15, rate: 12 },
    lumpsum: { amount: 1000000, years: 10, rate: 12 },
    stepup: { amount: 10000, years: 15, rate: 12, stepPercent: 10 }
  });

  const t = translations[language] || translations.en;

  const [messages, setMessages] = useState([]);

  // Initialize messages when language is selected or changed
  // We intentionally run this effect on `language` changes only (not on every messages update),
  // because it resets the conversation + agent memory for a new language session.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (language) {
      // New language context = treat as fresh chat UX (show advisor CTA again)
      setShowContactForm(false);
      setHasShownAdvisorCTA(false);
      // Reset LLM Agent for new conversation when language changes
      if (messages.length > 0) {
        // Language changed - update greeting message
        llmAgentInstance.reset();
        const t = translations[language] || translations.en;
        const greetingResponse = generateResponse(INTENTS.GENERAL_FINANCE_QUESTION, '', language, {});
        const updatedGreeting = {
          id: generateUniqueMessageId(),
          text: greetingResponse.text || t.greeting,
          sender: 'bot',
          timestamp: new Date(),
          quickReplies: getDefaultQuickReplies(language, true),
          showCTAs: true,
          ctaType: 'advisor'
        };
        setMessages([updatedGreeting]);
        llmAgentInstance.memory.addMessage('assistant', updatedGreeting.text, {
          intent: INTENTS.GENERAL_FINANCE_QUESTION,
          language
        });
      } else if (messages.length === 0) {
        // Initial load - create greeting
        llmAgentInstance.reset();
        const greetingResponse = generateResponse(INTENTS.GENERAL_FINANCE_QUESTION, '', language, {});
        const t = translations[language] || translations.en;
        const greetingMessage = {
          id: generateUniqueMessageId(),
          text: greetingResponse.text || t.greeting,
          sender: 'bot',
          timestamp: new Date(),
          quickReplies: getDefaultQuickReplies(language, true),
          showCTAs: true,
          ctaType: 'advisor'
        };
        setMessages([greetingMessage]);
        llmAgentInstance.memory.addMessage('assistant', greetingMessage.text, {
          intent: INTENTS.GENERAL_FINANCE_QUESTION,
          language
        });
      }
    }
  }, [language]);

  // Initialize conversation engine and flows
  useEffect(() => {
    // Register all flow definitions (legacy flows)
    registerAllFlows(conversationEngine);

    // Register enterprise CTA flows (JSON-based structure)
    registerCTAFlows(conversationEngine);

    // Initialize conversation state with current language
    const state = conversationEngine.getState();
    state.userProfile.language = language;

    // Track session start
    analytics.track('session_started', {
      language,
      timestamp: new Date().toISOString()
    });
  }, []);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showLanguageMenu && !event.target.closest('.language-switcher-container')) {
        setShowLanguageMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLanguageMenu]);

  // Enhanced voice mode handlers with automatic language detection
  const handleVoiceInput = async () => {
    if (!isVoiceMode || !voiceService.isReady()) {
      if (!voiceService.isSupported()) {
        const errorMsg = {
          id: `msg-${++messageIdCounter.current}`,
          text: language === LANGUAGES.HINGLISH
            ? "Aapke browser mein voice support nahi hai. Kya aap text mode use kar sakte hain?"
            : "Your browser doesn't support voice input. Can you use text mode?",
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMsg]);
      }
      return;
    }

    try {
      setIsListening(true);

      // Start listening with current language as preference, but will auto-detect
      const result = await voiceService.startListening(language);
      setIsListening(false);

      if (result && result.text) {
        const { text: transcript, language: detectedLanguage, confidence } = result;

        // Update language if detected language is different and confidence is high
        if (detectedLanguage && detectedLanguage !== language && confidence > 0.7) {
          logger.debug('Language detected from voice', {
            detected: detectedLanguage,
            current: language,
            confidence
          });

          // Update language state to match detected language
          setLanguage(detectedLanguage);

          // Show language detection message
          const langMsg = {
            id: `msg-${++messageIdCounter.current}`,
            text: detectedLanguage === 'hi' || detectedLanguage === 'hinglish'
              ? `मैंने ${detectedLanguage === 'hi' ? 'हिंदी' : 'Hinglish'} में आपकी बात समझी।`
              : `I detected you're speaking in ${detectedLanguage === 'en' ? 'English' : detectedLanguage}.`,
            sender: 'bot',
            timestamp: new Date(),
            isSystemMessage: true
          };
          setMessages(prev => [...prev, langMsg]);
        }

        // Set transcript in input field
        setInputMessage(transcript);

        // Auto-send voice input with detected language
        setTimeout(() => {
          const syntheticEvent = { preventDefault: () => { } };
          // Pass detected language to handleSendMessage
          handleSendMessage(syntheticEvent, transcript, detectedLanguage || language);
        }, 100);
      }
    } catch (error) {
      setIsListening(false);
      logger.error('Voice input error:', error);

      // Get user-friendly error message
      const errorMessage = voiceService.getErrorMessage(error.message || error.error || 'unknown');

      const errorMsg = {
        id: `msg-${++messageIdCounter.current}`,
        text: language === LANGUAGES.HINGLISH
          ? errorMessage.includes('Microphone')
            ? "Microphone access nahi mila. Kya aap browser settings mein microphone permission de sakte hain?"
            : "Voice samajh nahi aaya. Kya aap phir se try kar sakte hain ya text mode use kar sakte hain?"
          : errorMessage,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  const handleSendMessage = async (e, voiceText = null) => {
    e.preventDefault();
    const messageText = voiceText || inputMessage;
    if (!messageText.trim()) return;

    // Auto-detect language ONLY on first message (when no language is set or conversation just started)
    // Once language is set, maintain it throughout the conversation unless user explicitly changes it
    let currentLanguage = language;
    if (!language || messages.length === 0) {
      const detectedLang = detectLanguage(messageText);
      if (detectedLang) {
        currentLanguage = detectedLang;
        setLanguage(detectedLang);
        localStorage.setItem('chatbot_language', detectedLang);
      }
    }

    const userMessage = {
      id: `msg-${++messageIdCounter.current}`,
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Extract user info and add to agent's memory (will be added again in processMessage, but this ensures it's captured)
    llmAgentInstance.extractUserInfo(messageText);

    const currentInput = messageText;
    setInputMessage('');
    setIsTyping(true);

    // Process response based on conversation stage (async for AI)
    // Always use the persisted language, not the detected language from individual messages
    setIsTyping(true);
    processUserMessage(currentInput, currentLanguage).then(response => {
      // Only add response if it exists and hasn't been added already
      if (response && response.id) {
        // Check if message with this ID already exists to prevent duplicates
        setMessages(prev => {
          const exists = prev.some(msg => msg.id === response.id);
          if (exists) {
            logger.warn('Duplicate message ID detected, skipping:', response.id);
            return prev;
          }
          return [...prev, response];
        });
      }
      setIsTyping(false);
    }).catch(error => {
      logger.error('Error processing message:', error);
      // Fallback response
      const fallbackResponse = {
        id: `msg-${++messageIdCounter.current}`,
        text: language === LANGUAGES.HINGLISH
          ? "Maaf kijiye, kuch technical issue ho raha hai. Kya aap phir se try kar sakte hain?"
          : "Sorry, there's a technical issue. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: getDefaultQuickReplies(language),
        showCTAs: true,
        ctaType: 'general'
      };
      setMessages(prev => [...prev, fallbackResponse]);
      setIsTyping(false);
    });
  };

  const handleQuickReply = async (reply, ctaData = null) => {
    // CRITICAL: Validate and normalize reply to prevent empty object dispatch
    // This prevents double-dispatch bugs where empty objects are passed
    let replyText;
    if (typeof reply === 'string') {
      replyText = reply;
    } else if (reply && typeof reply === 'object') {
      // If it's an object, try to extract text property or stringify
      replyText = reply.text || reply.label || reply.toString() || JSON.stringify(reply);
      logger.warn('Quick reply was an object, converted to:', replyText);
    } else {
      replyText = String(reply || '');
    }

    // Normalize common quick reply texts to handle language variations
    const normalizedReply = replyText.trim();

    // CRITICAL: Validate that we have a valid text string before proceeding
    if (!normalizedReply || normalizedReply.length === 0) {
      logger.warn('Blocked invalid quick reply - empty or invalid');
      return;
    }

    // Check if this is a flow-based CTA (has flow navigation data)
    if (ctaData && ctaData.flowId && ctaData.nodeId && ctaData.ctaId) {
      // Handle flow-based navigation
      const state = conversationEngine.getState();
      state.userProfile.language = language;

      const result = conversationEngine.processUserAction({
        flowId: ctaData.flowId,
        nodeId: ctaData.nodeId,
        ctaId: ctaData.ctaId
      }, normalizedReply, {
        language,
        conversationDepth: state.conversationDepth
      });

      if (result && result.node) {
        const nextNode = result.node;
        const nodeMessage = nextNode.getMessage(state);
        const nodeCTAs = nextNode.getCTAs(state);

        // Create user message
        const userMessage = {
          id: `msg-${++messageIdCounter.current}`,
          text: normalizedReply,
          sender: 'user',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);

        setIsTyping(true);

        // Track CTA click
        analytics.trackCTAClick(ctaData.ctaId, ctaData.flowId, ctaData.nodeId, {
          depth: state.conversationDepth,
          maturity: state.userProfile.maturityLevel,
          language: state.userProfile.language
        });

        // If node requires LLM, get AI response
        if (nextNode.requiresLLM) {
          try {
            const llmResponse = await llmAgentInstance.processMessage(
              normalizedReply,
              language,
              nextNode.intent,
              {
                ...userContext,
                goal: goalContext || userContext.goal,
                goalContext: goalContext,
                conversationHistory: messages.slice(-4).map(m => ({
                  role: m.sender === 'user' ? 'user' : 'assistant',
                  content: m.text
                })),
                stateSummary: state.getStateSummary()
              }
            );

            if (llmResponse && llmResponse.text) {
              const botResponse = {
                id: `msg-${++messageIdCounter.current}`,
                text: llmResponse.text,
                sender: 'bot',
                timestamp: new Date(),
                quickReplies: nodeCTAs.map(cta => cta.label),
                showCTAs: true,
                ctaType: 'flow',
                flowData: {
                  flowId: ctaData.flowId,
                  nodeId: nextNode.id,
                  ctas: nodeCTAs.map(cta => ({
                    id: cta.id,
                    label: cta.label,
                    next: cta.next,
                    flowId: ctaData.flowId
                  }))
                }
              };
              setMessages(prev => [...prev, botResponse]);
            } else {
              // Fallback to node message if LLM fails
              const botResponse = {
                id: `msg-${++messageIdCounter.current}`,
                text: nodeMessage,
                sender: 'bot',
                timestamp: new Date(),
                quickReplies: nodeCTAs.map(cta => cta.label),
                showCTAs: true,
                ctaType: 'flow',
                flowData: {
                  flowId: ctaData.flowId,
                  nodeId: nextNode.id,
                  ctas: nodeCTAs.map(cta => ({
                    id: cta.id,
                    label: cta.label,
                    next: cta.next,
                    flowId: ctaData.flowId
                  }))
                }
              };
              setMessages(prev => [...prev, botResponse]);
            }
          } catch (error) {
            logger.error('LLM error in flow node:', error);
            // Fallback to node message
            const botResponse = {
              id: `msg-${++messageIdCounter.current}`,
              text: nodeMessage,
              sender: 'bot',
              timestamp: new Date(),
              quickReplies: nodeCTAs.map(cta => cta.label),
              showCTAs: true,
              ctaType: 'flow',
              flowData: {
                flowId: ctaData.flowId,
                nodeId: nextNode.id,
                ctas: nodeCTAs.map(cta => ({
                  id: cta.id,
                  label: cta.label,
                  next: cta.next,
                  flowId: ctaData.flowId
                }))
              }
            };
            setMessages(prev => [...prev, botResponse]);
          }
        } else {
          // Use node message directly
          const botResponse = {
            id: `msg-${++messageIdCounter.current}`,
            text: nodeMessage,
            sender: 'bot',
            timestamp: new Date(),
            quickReplies: nodeCTAs.map(cta => cta.label),
            showCTAs: true,
            ctaType: 'flow',
            showContactForm: nextNode.requiresContactForm || false, // Show contact form if required
            flowData: {
              flowId: ctaData.flowId,
              nodeId: nextNode.id,
              ctas: nodeCTAs.map(cta => ({
                id: cta.id,
                label: cta.label,
                next: cta.next,
                flowId: ctaData.flowId,
                action: cta.action || null
              }))
            }
          };
          setMessages(prev => [...prev, botResponse]);
        }

        // Show contact form if node requires it
        if (nextNode.requiresContactForm) {
          setShowContactForm(true);
        }

        setIsTyping(false);
        return;
      }
    }

    // Fallback to regular quick reply handling (existing logic)
    // Create user message
    const userMessage = {
      id: `msg-${++messageIdCounter.current}`,
      text: normalizedReply,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Process response (async) - ONLY call processUserMessage with the text string
    // DO NOT pass objects or empty payloads - this prevents double-dispatch bugs
    setTimeout(async () => {
      try {
        // CRITICAL: Only pass the text string, never objects or empty payloads
        // The safety lock in processUserMessage will catch any invalid inputs
        const response = await processUserMessage(normalizedReply, language);
        if (response && response.text) {
          setMessages(prev => [...prev, response]);
        } else {
          logger.error('No response from processUserMessage');
        }
        setIsTyping(false);
      } catch (error) {
        logger.error('Error processing quick reply:', error);
        setIsTyping(false);
      }
    }, 100);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();

    // Soft validation - ask for EITHER email OR phone (not both required)
    if (!contactInfo.email && !contactInfo.phone) {
      const errorMessages = {
        [LANGUAGES.HINGLISH]: "Aap apna email ya phone number share kar sakte hain — jo bhi aapko comfortable ho.",
        [LANGUAGES.HINDI]: "आप अपना ईमेल या फोन नंबर साझा कर सकते हैं — जो भी आपको सुविधाजनक हो।",
        [LANGUAGES.ENGLISH]: "You may share your email or phone number — whichever you're comfortable with.",
        [LANGUAGES.PUNJABI]: "ਤੁਸੀਂ ਆਪਣਾ ਈਮੇਲ ਜਾਂ ਫੋਨ ਨੰਬਰ ਸਾਂਝਾ ਕਰ ਸਕਦੇ ਹੋ — ਜੋ ਵੀ ਤੁਹਾਨੂੰ ਸੁਵਿਧਾਜਨਕ ਹੋਵੇ।"
      };

      const errorMsg = {
        id: `msg-${++messageIdCounter.current}`,
        text: errorMessages[language] || errorMessages[LANGUAGES.HINGLISH],
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
      return;
    }

    // Validate email format if provided
    if (contactInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email)) {
      const errorMsg = {
        id: `msg-${++messageIdCounter.current}`,
        text: "Please enter a valid email address.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
      return;
    }

    setIsTyping(true);

    try {
      // Generate conversation summary for CRM
      const conversationSummary = generateConversationSummary(messages, language);
      const intentType = extractIntentType(messages, null);

      // Save lead to CRM service
      const leadData = {
        name: null, // Can be extracted from conversation if mentioned
        phone: contactInfo.phone || null,
        email: contactInfo.email || null,
        city: null, // Can be asked separately if needed
        intent_type: intentType,
        conversation_summary: conversationSummary,
        language: language,
        conversation_length: messages.length,
        status: 'new'
      };

      const leadResult = await saveLead(leadData);

      // Also save to localStorage for backward compatibility
      localStorage.setItem('chatbot_contact', JSON.stringify({
        ...contactInfo,
        timestamp: new Date().toISOString(),
        interest: userContext.interest || 'general',
        lead_id: leadResult.lead_id,
        lead_confidence: leadResult.confidence
      }));

      // Send emails to user and ops team
      try {
        const emailResult = await sendContactEmails(
          {
            email: contactInfo.email,
            phone: contactInfo.phone,
            name: null // Can be extracted from conversation if mentioned
          },
          {
            conversationSummary,
            intentType,
            language,
            messagesLength: messages.length
          }
        );

        if (emailResult.success) {
          logger.email('Contact emails sent successfully', {
            userEmailSent: emailResult.userEmailSent,
            opsEmailSent: emailResult.opsEmailSent,
            method: emailResult.method
          });
        } else if (emailResult.skipped) {
          logger.info('Email sending skipped (not configured)');
        } else {
          logger.warn('Email sending failed (non-blocking):', emailResult.error);
        }
      } catch (emailError) {
        // Don't block form submission if email fails
        logger.error('Email sending error (non-blocking):', emailError);
      }

      setIsTyping(false);
      setShowContactForm(false);
      setConversationStage('engaged');

      // Thank you message in user's language
      const thankYouMessages = {
        [LANGUAGES.HINGLISH]: `Dhanyavad! ✅\n\nAapne apna contact share kiya hai. Humare expert advisors jald hi aapse connect karenge aur personalized investment plan ke saath aayenge.\n\nIs beech, main aapki investment journey mein kaise madad kar sakta hoon?`,
        [LANGUAGES.HINDI]: `धन्यवाद! ✅\n\nआपने अपना संपर्क साझा किया है। हमारे विशेषज्ञ सलाहकार जल्द ही आपसे संपर्क करेंगे और व्यक्तिगत निवेश योजना के साथ आएंगे।\n\nइस बीच, मैं आपकी निवेश यात्रा में कैसे मदद कर सकता हूं?`,
        [LANGUAGES.ENGLISH]: `Thank you! ✅\n\nWe've noted your contact details. Our expert advisors will connect with you shortly with a personalized investment plan.\n\nMeanwhile, how can I help you with your investment journey?`,
        [LANGUAGES.PUNJABI]: `ਧੰਨਵਾਦ! ✅\n\nਤੁਸੀਂ ਆਪਣਾ ਸੰਪਰਕ ਸਾਂਝਾ ਕੀਤਾ ਹੈ। ਸਾਡੇ ਮਾਹਿਰ ਸਲਾਹਕਾਰ ਜਲਦੀ ਹੀ ਤੁਹਾਡੇ ਨਾਲ ਜੁੜਣਗੇ ਅਤੇ ਨਿੱਜੀ ਨਿਵੇਸ਼ ਯੋਜਨਾ ਦੇ ਨਾਲ ਆਉਣਗੇ।\n\nਇਸ ਦੌਰਾਨ, ਮੈਂ ਤੁਹਾਡੀ ਨਿਵੇਸ਼ ਯਾਤਰਾ ਵਿੱਚ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?`
      };

      const quickRepliesByLang = {
        [LANGUAGES.HINGLISH]: ['SIP start karein', 'Goal planning', 'Calculator', 'Aur samjhao'],
        [LANGUAGES.HINDI]: ['SIP शुरू करें', 'Goal planning', 'Calculator', 'और समझाएं'],
        [LANGUAGES.ENGLISH]: ['Start SIP', 'Goal planning', 'Calculator', 'Tell me more'],
        [LANGUAGES.PUNJABI]: ['SIP ਸ਼ੁਰੂ ਕਰੋ', 'Goal planning', 'Calculator', 'ਹੋਰ ਸਮਝਾਓ']
      };

      const thankYouMessage = {
        id: `msg-${++messageIdCounter.current}`,
        text: thankYouMessages[language] || thankYouMessages[LANGUAGES.HINGLISH],
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: quickRepliesByLang[language] || quickRepliesByLang[LANGUAGES.HINGLISH]
      };

      setMessages(prev => [...prev, thankYouMessage]);

      // Clear contact form
      setContactInfo({ email: '', phone: '' });
    } catch (error) {
      setIsTyping(false);
      const errorMsg = {
        id: `msg-${++messageIdCounter.current}`,
        text: "There was an error saving your contact. Please try again or contact us directly at contact@anupaatnivesh.com",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  // Calculate SIP example
  const calculateSIPExample = (monthly, years, rate = 12) => {
    const n = years * 12;
    const r = rate / 12 / 100;
    let maturity;
    if (r === 0) {
      maturity = monthly * n;
    } else {
      maturity = monthly * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    }
    const invested = monthly * n;
    const returns = maturity - invested;
    return { maturity, invested, returns };
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Calculator functions
  const calculateSIP = (monthly, years, rate = 12) => {
    const n = years * 12;
    const r = rate / 12 / 100;
    let maturity;
    if (r === 0) {
      maturity = monthly * n;
    } else {
      maturity = monthly * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    }
    const invested = monthly * n;
    const returns = maturity - invested;
    return { maturity, invested, returns };
  };

  const calculateLumpsum = (principal, years, rate = 12) => {
    const r = rate / 100;
    const maturity = principal * Math.pow(1 + r, years);
    return {
      maturity,
      invested: principal,
      returns: maturity - principal
    };
  };

  const calculateStepUpSIP = (monthly, years, rate = 12, stepPercent = 10) => {
    const n = years * 12;
    const r = rate / 12 / 100;
    const step = stepPercent / 100;
    let maturity = 0;
    let invested = 0;

    for (let m = 0; m < n; m++) {
      const yearIndex = Math.floor(m / 12);
      const contribution = monthly * Math.pow(1 + step, yearIndex);
      const monthsLeft = n - m - 1;
      invested += contribution;
      if (r === 0) {
        maturity += contribution;
      } else {
        maturity += contribution * Math.pow(1 + r, monthsLeft + 1);
      }
    }

    return { maturity, invested, returns: maturity - invested };
  };

  // Parse calculator request from user message
  const parseCalculatorRequest = (message) => {
    const lowerMessage = message.toLowerCase();

    // Only parse if user explicitly asks for calculation, not just mentions SIP/invest
    const explicitCalcMatch = lowerMessage.match(/(?:calculate|calc|kitna.*hoga|how much.*will|kya.*hoga|show.*calculation)/i);
    if (!explicitCalcMatch) return null;

    // Also check that it's not just a general investment query
    // If user is asking for advice/suggestions, don't parse as calculator
    const isGeneralQuery = lowerMessage.match(/(?:want to invest|suggest|advice|help|guide|how to|kaise|please suggest|recommend)/i) &&
      !lowerMessage.match(/(?:calculate|calc|kitna|how much|kya hoga)/i);
    if (isGeneralQuery) return null;

    // Don't parse if user mentions age (e.g., "25 years old") - this is not an investment amount
    if (lowerMessage.match(/(?:years old|age|aged|i am \d+|i'm \d+)/i)) {
      // Only proceed if there's a clear investment amount mentioned separately
      const hasExplicitAmount = lowerMessage.match(/(?:₹|rs|rupee|invest|sip|monthly)\s*\d+\s*(?:thousand|k|000|per month|monthly)/i);
      if (!hasExplicitAmount) return null;
    }

    // Extract numbers from message, but exclude age mentions
    // Look for investment amounts explicitly (with currency/investment keywords)
    let amount = null;
    let years = null;
    let rate = 12;

    // Look for explicit investment amounts (not age)
    const amountMatch = lowerMessage.match(/(?:₹|rs|rupee|invest|sip|monthly|per month|pm)\s*(\d+(?:,\d{3})*(?:\.\d+)?)\s*(?:thousand|k|000|per month|monthly|pm)?/i);
    if (amountMatch) {
      amount = parseFloat(amountMatch[1].replace(/,/g, ''));
      if (amount < 100) amount = amount * 1000; // If small number, assume thousands
    }

    // Look for time period (not age)
    const yearsMatch = lowerMessage.match(/(?:for|over|period|duration|time|invest|sip)\s*(\d+)\s*(?:year|years|yr|yrs)/i);
    if (yearsMatch) {
      years = parseInt(yearsMatch[1]);
    }

    // Look for return rate
    const rateMatch = lowerMessage.match(/(\d+)\s*(?:%|percent|rate|return)/i);
    if (rateMatch) {
      rate = parseInt(rateMatch[1]);
    }

    // Only return calculator request if we have explicit amounts
    // Don't use defaults - user must provide clear numbers
    // Only treat as calculator request when user explicitly asks to calculate
    if (lowerMessage.includes('calculate sip') || lowerMessage.includes('sip calculation')) {
      if (amount && amount > 100 && years) {
        return {
          type: 'sip',
          amount: amount,
          years: years,
          rate: rate
        };
      }
    } else if (lowerMessage.includes('lumpsum') || lowerMessage.includes('one time')) {
      if (amount && amount > 1000 && years) {
        return {
          type: 'lumpsum',
          amount: amount,
          years: years,
          rate: rate
        };
      }
    } else if (lowerMessage.includes('step') || lowerMessage.includes('stepup')) {
      if (amount && amount > 100 && years) {
        return {
          type: 'stepup',
          amount: amount,
          years: years,
          rate: rate,
          stepPercent: 10
        };
      }
    }
    return null;
  };

  const processUserMessage = async (userMessage, conversationLanguage = language) => {
    // CRITICAL: Safety lock - prevent processing empty objects or invalid payloads
    // This prevents double-dispatch bugs where button handlers pass {} instead of text
    if (!userMessage || (typeof userMessage === 'object' && userMessage !== null && Object.keys(userMessage).length === 0)) {
      logger.warn("Blocked empty payload dispatch", {
        type: typeof userMessage
      });
      return null;
    }

    // If userMessage is an object, extract text from it
    let messageText = userMessage;
    if (typeof userMessage === 'object' && userMessage !== null) {
      messageText = userMessage.text || userMessage.message || userMessage.content || "";
      if (!messageText || messageText.trim().length === 0) {
        logger.warn("Blocked object payload without text field");
        return null;
      }
    }

    // Ensure messageText is a string
    if (typeof messageText !== 'string') {
      messageText = String(messageText || "");
    }

    const message = messageText.toLowerCase();
    let response = null; // Initialize as null, not empty object - ensures proper fallback detection

    // Check for explicit restart commands - only reset if user explicitly requests
    const isRestartRequest = message.match(/\b(restart|home|start again|reset|new conversation|shuru se)\b/i);
    if (isRestartRequest) {
      setConversationStage('greeting');
      setGoalContext(null);
      setShowContactForm(false);
      setHasShownAdvisorCTA(false);
      // Continue to show welcome menu below
    } else {
      // Update conversation stage and context - DO NOT reset during active conversation
      if (conversationStage === 'greeting') {
        setConversationStage('exploring');
      }
    }

    // Always use the conversation language (persisted), not detected from individual messages
    // This ensures language consistency throughout the conversation
    const currentLang = conversationLanguage || language;
    const t = translations[currentLang] || translations.en;
    const lowerUserMessage = messageText.toLowerCase();

    // Get conversation state and update language
    const state = conversationEngine.getState();
    state.userProfile.language = currentLang;

    // Assess user maturity based on conversation signals
    state.assessMaturityLevel({
      keywords: userMessage.split(/\s+/),
      questionType: detectIntent(userMessage, currentLang) === INTENTS.BEGINNER_QUERY ? 'basic' : 'strategy',
      conversationDepth: state.conversationDepth
    });

    // Use ArthAI System for intent detection and response generation
    const intent = detectIntent(userMessage, currentLang);
    // We may override intent for certain UI-driven flows (e.g., Goal Planning sub-options, SIP queries)
    let effectiveIntent = intent;

    // Update conversation state intent
    state.updateIntent(effectiveIntent);

    // CRITICAL: Check for "investment in mutual fund" queries FIRST (before other routers)
    // These should NOT default to HOW_TO_START_INVESTING
    const isInvestmentInMFQuery = lowerUserMessage.match(/(investment in mutual fund|invest in mutual fund|mutual fund investment|mutual fund mein invest|start investment in mutual fund)/i);

    if (isInvestmentInMFQuery) {
      // If asking about USP, help, services, or how company can help
      if (lowerUserMessage.match(/(how.*help|usp|unique|service|anupaat|company|can help|tell me|batao|samjhao)/i)) {
        effectiveIntent = INTENTS.PRODUCT_EXPLORATION;
        setUserContext(prev => ({ ...prev, interest: 'mutual_funds' }));
        state.updateIntent(INTENTS.PRODUCT_EXPLORATION);
        // Skip SIP router - go directly to LLM Agent with PRODUCT_EXPLORATION intent
      }
      // If it's a "why" question
      else if (lowerUserMessage.match(/(why|kyun|kya fayda|reason|benefit|advantage)/i)) {
        effectiveIntent = INTENTS.PRODUCT_EXPLORATION;
        setUserContext(prev => ({ ...prev, interest: 'mutual_funds' }));
        state.updateIntent(INTENTS.PRODUCT_EXPLORATION);
      }
      // If explicitly asking "how to start", then allow HOW_TO_START_INVESTING
      else if (lowerUserMessage.match(/(how to start|kaise start|how to begin|kaise shuru)/i)) {
        // Keep HOW_TO_START_INVESTING intent
      }
      // Otherwise, default to PRODUCT_EXPLORATION for informational queries
      else {
        effectiveIntent = INTENTS.PRODUCT_EXPLORATION;
        setUserContext(prev => ({ ...prev, interest: 'mutual_funds' }));
        state.updateIntent(INTENTS.PRODUCT_EXPLORATION);
      }
    }

    // CRITICAL: Check for benefits/advantages/features questions (before SIP router)
    // These should go to PRODUCT_EXPLORATION, not HOW_TO_START_INVESTING
    const isBenefitsQuestion = lowerUserMessage.match(/(benefit|advantage|feature|pros?|cons?|why|kyun|kya fayda|kya labh|merit|demerit|good|bad|positive|negative|reason|reasons|what are|what are the)/i);
    const isMutualFundOrSipMention = lowerUserMessage.includes('mutual fund') ||
      lowerUserMessage.includes('mutual funds') ||
      lowerUserMessage.includes('mf') ||
      lowerUserMessage.includes('mutual') ||
      lowerUserMessage.includes('sip') ||
      lowerUserMessage.includes('systematic investment');

    // If asking about benefits/advantages of mutual funds/SIP, route to PRODUCT_EXPLORATION
    if (isBenefitsQuestion && isMutualFundOrSipMention && !isInvestmentInMFQuery) {
      effectiveIntent = INTENTS.PRODUCT_EXPLORATION;
      setUserContext(prev => ({ ...prev, interest: 'mutual_funds' }));
      state.updateIntent(INTENTS.PRODUCT_EXPLORATION);
      // Skip SIP router - go directly to LLM Agent with PRODUCT_EXPLORATION intent
    }

    // ------------------------------------------------------------
    // SIP ROUTER (FUNCTIONAL, ALWAYS CONSISTENT)
    // Goal: Any SIP/systematic-investment-plan input (incl. CTAs) should:
    // 1) Explain SIP in relatable terms
    // 2) Ask if user wants calculation
    // SIP ROUTER: Route SIP queries to LLM Agent for contextual, interactive responses
    // Only handle explicit calculator confirmations here (keep UX flow)
    // ------------------------------------------------------------
    const isSipCalcConfirm =
      lowerUserMessage.includes('yes, calculate sip') ||
      lowerUserMessage.includes('yes calculate sip') ||
      lowerUserMessage.includes('calculate my sip') ||
      lowerUserMessage.includes('start sip calculation') ||
      lowerUserMessage.includes('open sip calculator') ||
      lowerUserMessage.includes('हाँ, sip calculate') ||
      lowerUserMessage.includes('haan, sip calculate') ||
      lowerUserMessage.includes('haan sip calculate') ||
      lowerUserMessage.includes('ਹਾਂ, sip calculate');

    // Explicit confirmation to open calculator (user explicitly requested)
    if (isSipCalcConfirm) {
      setShowCalculator(true);
      setCalculatorType('sip');
      const calculatorMessages = {
        [LANGUAGES.ENGLISH]: '**SIP Calculator** 📊\n\nUse the calculator below to plan your SIP. Enter monthly amount, years, and expected return.\n\n**Adjust values below!**',
        [LANGUAGES.HINDI]: '**SIP कैलकुलेटर** 📊\n\nनीचे कैलकुलेटर में मासिक राशि, अवधि (years) और अपेक्षित रिटर्न भरें।\n\n**नीचे मान समायोजित करें!**',
        [LANGUAGES.PUNJABI]: '**SIP ਕੈਲਕੁਲੇਟਰ** 📊\n\nਹੇਠਾਂ ਕੈਲਕੁਲੇਟਰ ਵਿੱਚ monthly amount, years ਅਤੇ expected return ਭਰੋ।\n\n**ਹੇਠਾਂ ਮੁੱਲ ਸਮਾਯੋਜਿਤ ਕਰੋ!**',
        [LANGUAGES.HINGLISH]: '**SIP Calculator** 📊\n\nNeeche calculator mein monthly amount, years aur expected return daal dijiye.\n\n**Neeche values adjust karein!**'
      };
      response = {
        id: `msg-${++messageIdCounter.current}`,
        text: calculatorMessages[currentLang] || calculatorMessages[LANGUAGES.HINGLISH],
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: [],
        showCTAs: false
      };
      setIsTyping(false);
      return response;
    }

    // Detect SIP-related queries (including "sip", "systematic investment plan", SIP CTAs)
    // Route to LLM Agent with appropriate intent for contextual, interactive responses
    // BUT: Skip this if it's a benefits question (already handled above)
    if (effectiveIntent !== INTENTS.PRODUCT_EXPLORATION) {
      const isSipMention = /\b(sip|systematic\s+investment\s+plan|systemeatic\s+investment\s+plan)\b/i.test(messageText);
      const isSipCalcCTA =
        lowerUserMessage.includes((t.sipCalculation || '').toLowerCase()) ||
        lowerUserMessage.includes('sip calculation') ||
        lowerUserMessage.includes('sip calculator') ||
        lowerUserMessage.includes('calculate sip') ||
        lowerUserMessage.includes('sip गणना') ||
        lowerUserMessage.includes('sip ਗਣਨਾ');

      // If SIP-related query detected, route ALL SIP queries to LLM Agent (OpenAI API)
      // This ensures all SIP responses use AI capabilities for contextual, interactive responses
      if (isSipMention || isSipCalcCTA) {
        setUserContext(prev => ({ ...prev, interest: 'sip' }));

        // CRITICAL: Check for informational SIP queries BEFORE defaulting to HOW_TO_START_INVESTING
        // If asking "why SIP" or about benefits/advantages
        if (lowerUserMessage.match(/(why|kyun|kya fayda|kya labh|reason|benefit|advantage|fayde|merit)/i)) {
          effectiveIntent = INTENTS.PRODUCT_EXPLORATION;
          state.updateIntent(INTENTS.PRODUCT_EXPLORATION);
        }
        // If asking "what is SIP" or general information (including "samjhao", "batao", "explain", "kya hai")
        // CRITICAL: This pattern must be comprehensive to catch ALL informational queries
        // Including: "SIP kya hai", "sip kya hai", "SIP samjhao", "sip samjhao", "is it same thing as SIP", etc.
        if (lowerUserMessage.match(/(what is|kya hai|kya|about|information|details|samjhao|explain|batao|tell me about|same thing|same as|what|is it|samj|bata)/i)) {
          effectiveIntent = INTENTS.BEGINNER_QUERY;
          state.updateIntent(INTENTS.BEGINNER_QUERY);
        }
        // If explicitly asking "how to start" or "how to invest"
        else if (lowerUserMessage.match(/(how to start|kaise start|how to begin|kaise shuru|how to invest|kaise invest|kaise karein)/i)) {
          effectiveIntent = INTENTS.HOW_TO_START_INVESTING;
          state.updateIntent(INTENTS.HOW_TO_START_INVESTING);
        }
        // For calculation requests
        else if (isSipCalcCTA) {
          effectiveIntent = INTENTS.CALCULATOR;
          state.updateIntent(INTENTS.CALCULATOR);
        }
        // Default to BEGINNER_QUERY for general SIP queries (more appropriate for informational queries)
        else {
          effectiveIntent = INTENTS.BEGINNER_QUERY;
          state.updateIntent(INTENTS.BEGINNER_QUERY);
        }
        // Continue to LLM Agent flow below - ALL SIP queries will use OpenAI API
        // The LLM Agent will provide contextual, interactive responses with follow-up questions
      }
    }

    // Track intent for conversation continuity (stored in LLM agent + conversationFlow)

    // Handle default quick reply options FIRST

    // SIP calculation flow is handled by the SIP ROUTER above (education → confirmation → calculator).

    // Check for "Goal planning" - show sub-options (only if not already in goal context)
    if ((lowerUserMessage.includes(t.goalPlanning.toLowerCase()) ||
      lowerUserMessage.includes('goal planning') ||
      lowerUserMessage.includes('लक्ष्य योजना') ||
      lowerUserMessage.includes('ਲਕਸ਼ ਯੋਜਨਾ')) && !goalContext) {
      // Set goal context to prevent repetition
      setGoalContext('planning');
      // Get goal planning message in current language
      const goalPlanningMessages = {
        'en': '**Goal Planning** 🎯\n\nLet\'s plan for your financial goals! Choose a goal below:',
        'hi': '**लक्ष्य योजना** 🎯\n\nआइए अपने वित्तीय लक्ष्यों की योजना बनाएं! नीचे एक लक्ष्य चुनें:',
        'pa': '**ਲਕਸ਼ ਯੋਜਨਾ** 🎯\n\nਆਓ ਆਪਣੇ ਵਿੱਤੀ ਲਕਸ਼ਾਂ ਦੀ ਯੋਜਨਾ ਬਣਾਈਏ! ਹੇਠਾਂ ਇੱਕ ਲਕਸ਼ ਚੁਣੋ:',
        'hinglish': '**Goal Planning** 🎯\n\nAapke financial goals ki planning karte hain! Neeche ek goal choose karein:'
      };
      response = {
        id: `msg-${++messageIdCounter.current}`,
        text: goalPlanningMessages[currentLang] || goalPlanningMessages['hinglish'],
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: [
          t.retirement,
          t.childEducation,
          t.childMarriage,
          t.wealthCreation,
          t.startInvesting,
          t.makeFirstCrore
        ],
        showCTAs: true,
        ctaType: 'general'
      };
      // Don't add to messages here - it will be added in handleSendMessage
      setIsTyping(false);
      return response;
    }

    // Handle goal planning sub-options
    const goalSubOptions = [t.retirement, t.childEducation, t.childMarriage, t.wealthCreation, t.startInvesting, t.makeFirstCrore];
    const isGoalSubOption = goalSubOptions.some(option => lowerUserMessage.includes(option.toLowerCase()));

    // SIP education is handled by the SIP ROUTER above (covers all SIP variants consistently).
    if (lowerUserMessage.includes(t.mutualFundKyaHai.toLowerCase()) ||
      lowerUserMessage.includes('mutual fund kya hai') ||
      lowerUserMessage.includes('what is mutual fund') ||
      lowerUserMessage.includes('म्यूचुअल फंड क्या है')) {
      // This will be handled by LLM Agent with BEGINNER_QUERY intent
      // Continue to main flow
    } else if (lowerUserMessage.includes(t.equityInvestmentKyaHai.toLowerCase()) ||
      lowerUserMessage.includes('equity investment kya hai') ||
      lowerUserMessage.includes('what is equity investment') ||
      lowerUserMessage.includes('इक्विटी निवेश क्या है')) {
      // This will be handled by LLM Agent with BEGINNER_QUERY intent
      // Continue to main flow
    } else if (lowerUserMessage.includes(t.talkToAdvisor.toLowerCase()) ||
      lowerUserMessage.includes('talk to advisor') ||
      lowerUserMessage.includes('advisor') ||
      lowerUserMessage.includes('सलाहकार')) {
      // Show contact form
      if (!showContactForm && conversationStage !== 'engaged') {
        setShowContactForm(true);
        setHasShownAdvisorCTA(true); // Mark as shown - will not appear again
      }
      // Continue to main flow for advisor response
    }

    // Handle goal amount CTAs (1 Cr, 5 Cr for Retirement/Children/Wealth)
    if (lowerUserMessage.includes('1 cr for retirement') || lowerUserMessage.includes('1 crore for retirement') ||
      lowerUserMessage.includes(t.oneCrForRetirement?.toLowerCase() || '1 cr for retirement')) {
      setGoalContext('retirement_1cr');
      setUserContext(prev => ({ ...prev, goal: 'retirement', goalAmount: '1cr' }));
      effectiveIntent = INTENTS.GOAL_PLANNING;
    } else if (lowerUserMessage.includes('5 cr for retirement') || lowerUserMessage.includes('5 crore for retirement') ||
      lowerUserMessage.includes(t.fiveCrForRetirement?.toLowerCase() || '5 cr for retirement')) {
      setGoalContext('retirement_5cr');
      setUserContext(prev => ({ ...prev, goal: 'retirement', goalAmount: '5cr' }));
      effectiveIntent = INTENTS.GOAL_PLANNING;
    } else if (lowerUserMessage.includes('1 cr for children') || lowerUserMessage.includes('1 crore for children') ||
      lowerUserMessage.includes(t.oneCrForChildren?.toLowerCase() || '1 cr for children')) {
      setGoalContext('children_1cr');
      setUserContext(prev => ({ ...prev, goal: goalContext === 'child_education' ? 'child_education' : 'child_marriage', goalAmount: '1cr' }));
      effectiveIntent = INTENTS.GOAL_PLANNING;
    } else if (lowerUserMessage.includes('my first 1 cr') || lowerUserMessage.includes('my first 1 crore') ||
      lowerUserMessage.includes(t.myFirst1Cr?.toLowerCase() || 'my first 1 cr')) {
      setGoalContext('wealth_1cr');
      setUserContext(prev => ({ ...prev, goal: 'first_crore', goalAmount: '1cr' }));
      effectiveIntent = INTENTS.GOAL_PLANNING;
    } else if (lowerUserMessage.includes('my first 5 cr') || lowerUserMessage.includes('my first 5 crore') ||
      lowerUserMessage.includes(t.myFirst5Cr?.toLowerCase() || 'my first 5 cr')) {
      setGoalContext('wealth_5cr');
      setUserContext(prev => ({ ...prev, goal: 'first_crore', goalAmount: '5cr' }));
      effectiveIntent = INTENTS.GOAL_PLANNING;
    } else if (isGoalSubOption) {
      // Process goal planning sub-option through LLM Agent
      // Set goal context to track which goal user selected
      if (lowerUserMessage.includes(t.retirement.toLowerCase()) || lowerUserMessage.includes('retirement')) {
        setGoalContext('retirement');
        setUserContext(prev => ({ ...prev, goal: 'retirement' }));
      } else if (lowerUserMessage.includes(t.childEducation.toLowerCase()) || lowerUserMessage.includes('child education')) {
        setGoalContext('child_education');
        setUserContext(prev => ({ ...prev, goal: 'child_education' }));
      } else if (lowerUserMessage.includes(t.childMarriage.toLowerCase()) || lowerUserMessage.includes('child marriage')) {
        setGoalContext('child_marriage');
        setUserContext(prev => ({ ...prev, goal: 'child_marriage' }));
      } else if (lowerUserMessage.includes(t.wealthCreation.toLowerCase()) || lowerUserMessage.includes('wealth creation')) {
        setGoalContext('wealth_creation');
        setUserContext(prev => ({ ...prev, goal: 'wealth_creation' }));
      } else if (lowerUserMessage.includes(t.makeFirstCrore.toLowerCase()) || lowerUserMessage.includes('1st crore') || lowerUserMessage.includes('first crore') || lowerUserMessage.includes('crore')) {
        setGoalContext('first_crore');
        setUserContext(prev => ({ ...prev, goal: 'first_crore' }));
      }
      // Force GOAL_PLANNING intent so the model always uses the goal-planning playbook
      effectiveIntent = INTENTS.GOAL_PLANNING;
      // Continue to LLM Agent flow - it will provide background info and CTAs
    }

    // Check for calculator requests (only if explicitly requested)
    const calcRequest = parseCalculatorRequest(userMessage);
    if (calcRequest) {
      setShowCalculator(true);
      setCalculatorType(calcRequest.type);
      setCalculatorInputs(prev => ({
        ...prev,
        [calcRequest.type]: {
          amount: calcRequest.amount,
          years: calcRequest.years,
          rate: calcRequest.rate,
          ...(calcRequest.stepPercent && { stepPercent: calcRequest.stepPercent })
        }
      }));

      let result;
      if (calcRequest.type === 'sip') {
        result = calculateSIP(calcRequest.amount, calcRequest.years, calcRequest.rate);
        response = {
          id: `msg-${++messageIdCounter.current}`,
          text: `**SIP Calculation** 📊\n\n**Input:** ₹${calcRequest.amount.toLocaleString('en-IN')}/month × ${calcRequest.years} years (${calcRequest.rate}%)\n\n**Results:**\n• Invested: ${formatCurrency(result.invested)}\n• Maturity: ${formatCurrency(result.maturity)}\n• Returns: ${formatCurrency(result.returns)} (${((result.returns / result.invested) * 100).toFixed(1)}%)\n\n**Adjust values below!**`,
          sender: 'bot',
          timestamp: new Date(),
          quickReplies: ['Lumpsum', 'Step-up SIP'],
          showCTAs: false
        };
      } else if (calcRequest.type === 'lumpsum') {
        result = calculateLumpsum(calcRequest.amount, calcRequest.years, calcRequest.rate);
        response = {
          id: `msg-${++messageIdCounter.current}`,
          text: `**Lumpsum Calculation** 💰\n\n**Input:** ₹${calcRequest.amount.toLocaleString('en-IN')} × ${calcRequest.years} years (${calcRequest.rate}%)\n\n**Results:**\n• Invested: ${formatCurrency(result.invested)}\n• Maturity: ${formatCurrency(result.maturity)}\n• Returns: ${formatCurrency(result.returns)} (${((result.returns / result.invested) * 100).toFixed(1)}%)\n\n**Adjust values below!**`,
          sender: 'bot',
          timestamp: new Date(),
          quickReplies: ['SIP', 'Step-up SIP'],
          showCTAs: false
        };
      } else if (calcRequest.type === 'stepup') {
        result = calculateStepUpSIP(calcRequest.amount, calcRequest.years, calcRequest.rate, calcRequest.stepPercent);
        response = {
          id: `msg-${++messageIdCounter.current}`,
          text: `**Step-up SIP Calculation** 📈\n\n**Input:** ₹${calcRequest.amount.toLocaleString('en-IN')}/month × ${calcRequest.years} years (${calcRequest.rate}%, +${calcRequest.stepPercent}% yearly)\n\n**Results:**\n• Invested: ${formatCurrency(result.invested)}\n• Maturity: ${formatCurrency(result.maturity)}\n• Returns: ${formatCurrency(result.returns)} (${((result.returns / result.invested) * 100).toFixed(1)}%)\n\n**Adjust values below!**`,
          sender: 'bot',
          timestamp: new Date(),
          quickReplies: ['SIP', 'Lumpsum'],
          showCTAs: false
        };
      }
      return response;
    }

    // Calculator trigger keywords
    if (message.includes('calculate') || message.includes('calculator') || message.includes('calc')) {
      setShowCalculator(true);
      response = {
        id: `msg-${++messageIdCounter.current}`,
        text: "**Financial Calculators** 🧮\n\n**Available:**\n• SIP Calculator\n• Lumpsum Calculator\n• Step-up SIP\n\n**Use calculator below or type:**\n\"Calculate SIP 10000 15 years\"",
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: ['Calculate SIP', 'Calculate Lumpsum', 'Step-up SIP'],
        showCTAs: false
      };
      setShowCalculator(true);
      return response;
    }

    // Use conversation language for all queries
    // Check specific intents and use language-specific responses
    if (intent === INTENTS.HOW_TO_START_INVESTING ||
      (message.includes('mutual fund') && (message.includes('kaise') || message.includes('how to start') || message.includes('start investment')))) {
      const aiResponse = generateResponse(INTENTS.HOW_TO_START_INVESTING, userMessage, currentLang, userContext);
      response = createResponse(aiResponse.text, {
        quickReplies: aiResponse.quickReplies || [
          currentLang === LANGUAGES.HINGLISH ? 'App download' :
            currentLang === LANGUAGES.HINDI ? 'ऐप डाउनलोड' :
              currentLang === LANGUAGES.PUNJABI ? 'ਐਪ ਡਾਉਨਲੋਡ' :
                'App download',
          ...(!hasShownAdvisorCTA ? [t.talkToAdvisor] : []),
          t.sipCalculation
        ],
        language: currentLang
      });
      setUserContext(prev => ({ ...prev, interest: 'mutual_funds' }));
      // Don't add to messages here - it will be added in handleSendMessage
      setIsTyping(false);
      return response; // Return immediately to prevent LLM Agent from overriding
    }
    // Equity Investment / Equity Basket
    // NOTE: We do not auto-open calculators for education queries. Let the LLM Agent educate first.
    else if (message.toLowerCase().includes('equity investment') ||
      (message.toLowerCase().includes('equity') && message.toLowerCase().includes('investment'))) {
      // Route to LLM Agent with PRODUCT_EXPLORATION intent for equity investment
      effectiveIntent = INTENTS.PRODUCT_EXPLORATION;
      setUserContext(prev => ({ ...prev, interest: 'equity' }));
      // Continue to LLM Agent flow below
    }
    else if (message.includes('equity') || message.includes('stock') || message.includes('share')) {
      setUserContext(prev => ({ ...prev, interest: 'equity' }));
      // Continue to LLM Agent flow
    }
    // SIP Education (do NOT auto-open calculator) - Route to LLM Agent instead of rule-based
    // CRITICAL: Only handle SIP queries that haven't been caught by the SIP router above
    // The SIP router (lines 1006-1053) already handles all SIP queries with proper intent routing
    // This section should NOT override the intent for informational SIP queries
    // REMOVED: This was causing all SIP queries to default to HOW_TO_START_INVESTING
    // Now all SIP queries are handled by the SIP router above with correct intent detection
    // Loan Against Securities
    else if (message.includes('loan') || message.includes('liquidity') || message.includes('borrow')) {
      setUserContext(prev => ({ ...prev, interest: 'loan' }));
      response = {
        id: `msg-${++messageIdCounter.current}`,
        text: "**Loan Against Securities** 💰\n\n**Example:** Portfolio ₹10L → Loan ₹7-8L (70-80%)\n\n**Benefits:**\n• Get funds without selling investments\n• Portfolio continues to grow\n• Quick processing\n\n**Contact us for details!**",
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: ['Calculate SIP', 'Calculate Lumpsum', 'Contact'],
        showCTAs: false
      };
    }
    // Equity Basket / Product Exploration
    else if (message.toLowerCase().includes('equity basket') ||
      (message.toLowerCase().includes('equity') && message.toLowerCase().includes('basket'))) {
      // Route to LLM Agent with PRODUCT_EXPLORATION intent
      effectiveIntent = INTENTS.PRODUCT_EXPLORATION;
      // Continue to LLM Agent flow below
    }
    // SIP Planning
    else if (message.toLowerCase().includes('sip planning') ||
      (message.toLowerCase().includes('sip') && message.toLowerCase().includes('planning'))) {
      // Route to LLM Agent with GOAL_PLANNING or HOW_TO_START_INVESTING intent
      effectiveIntent = INTENTS.HOW_TO_START_INVESTING;
      // Continue to LLM Agent flow below
    }
    // Calculators (explicit only)
    else if (message.includes('calculator') || message.includes('calculate')) {
      response = {
        id: `msg-${++messageIdCounter.current}`,
        text: "We have comprehensive calculators:\n\n📊 **Available Calculators:**\n• SIP Calculator - Plan monthly investments\n• Step-up SIP Calculator - Increase SIP annually\n• Lumpsum Calculator - One-time investment planning\n• Time Value of Money (PV) - Calculate present value for future goals\n\n**Features:**\n✓ Real-time calculations\n✓ Visual bar charts (invested vs returns)\n✓ Indian currency formatting\n✓ Percentage breakdowns\n\n**Example Use Cases:**\n• Plan for child's education (15-20 years)\n• Retirement corpus (20-30 years)\n• Dream home down payment (5-10 years)\n• Tax-saving investments\n\n**Visit our Calculators page to try them out!**",
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: ['SIP Calculator', 'Lumpsum Calculator', 'View All', 'Help me choose'],
        showCTAs: true,
        ctaType: 'calculators'
      };
    }
    // Contact Information Query - Use rule-based response with phone number
    else if (intent === INTENTS.CONTACT_INFO ||
      (message.toLowerCase().includes('contact') &&
        (message.toLowerCase().includes('information') ||
          message.toLowerCase().includes('details') ||
          message.toLowerCase().includes('number') ||
          message.toLowerCase().includes('email') ||
          message.toLowerCase().includes('phone')))) {
      // Use rule-based response that includes phone number
      const contactResponse = generateResponse(INTENTS.CONTACT_INFO, userMessage, currentLang, userContext);
      response = {
        id: `msg-${++messageIdCounter.current}`,
        text: contactResponse.text,
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: contactResponse.quickReplies || getDefaultQuickReplies(language, !hasShownAdvisorCTA),
        showCTAs: contactResponse.showCTAs !== undefined ? contactResponse.showCTAs : true,
        ctaType: contactResponse.ctaType || 'general'
      };
    }
    // Advisor/Help Query - Show contact form for advisor connection
    else if ((intent === INTENTS.LEAD_CAPTURE_OPPORTUNITY ||
      message.includes('advisor') ||
      message.includes('help') ||
      message.includes('consult')) &&
      !message.toLowerCase().includes('contact information') &&
      !message.toLowerCase().includes('contact details')) {
      if (!showContactForm && conversationStage !== 'engaged') {
        setShowContactForm(true);
        setHasShownAdvisorCTA(true); // Mark as shown - will not appear again
        response = {
          id: `msg-${++messageIdCounter.current}`,
          text: "I'd love to connect you with our expert advisors! Please share your contact details so we can reach out to you.",
          sender: 'bot',
          timestamp: new Date()
        };
      } else {
        const advisorResponse = generateResponse(INTENTS.LEAD_CAPTURE_OPPORTUNITY, userMessage, currentLang, userContext);
        response = {
          id: `msg-${++messageIdCounter.current}`,
          text: advisorResponse.text,
          sender: 'bot',
          timestamp: new Date(),
          quickReplies: advisorResponse.quickReplies || ['Mutual Funds', 'Equity Basket', 'SIP Planning', 'Calculators']
        };
      }
    }
    // NOTE: Goal-specific auto-calculation branches removed.
    // All goal / education prompts should be handled by the LLM Agent:
    // educate first → then offer example / optional calculator.
    // Default response - Use LLM Agent for intelligent, human-like responses
    else {
      // Update conversation stage to 'exploring' if still in 'greeting' (user has engaged)
      if (conversationStage === 'greeting' && messages.length > 1) {
        setConversationStage('exploring');
      }

      try {
        logger.debug('Processing message with LLM Agent', {
          message: userMessage.substring(0, 50),
          intent,
          language: currentLang
        });

        // Extract user information from message
        llmAgentInstance.extractUserInfo(userMessage);

        // CRITICAL: Check if this query should trigger a flow-based response
        // This ensures flow-based CTAs are shown instead of default quick replies
        let flowNode = null;
        let flowId = null;
        let flowNodeId = null;

        // Detect flow entry points based on user query
        const lowerMsg = userMessage.toLowerCase().trim();

        // "What is Mutual Fund?" → what_is_mutual_fund flow level_1
        // Match patterns: "what is mutual fund", "mutual fund kya hai", "mutual fund", etc.
        if (lowerMsg.match(/(what is mutual fund|mutual fund kya hai|mutual fund.*what|mutual fund.*kya|mutual fund|mutual funds)/i) &&
          !lowerMsg.match(/(how to|kaise|start|begin|invest)/i)) {
          flowId = 'what_is_mutual_fund';
          flowNodeId = 'what_is_mutual_fund_level_1';
          flowNode = conversationEngine.getCurrentNode(flowId, flowNodeId);
          logger.debug('Flow detected: what_is_mutual_fund', { flowId, flowNodeId, found: !!flowNode });
        }
        // "What is Equity Investment?" → equity_investment flow level_1_intro
        else if (lowerMsg.match(/(what is equity|equity investment kya hai|equity.*what|equity.*kya|equity investment)/i) &&
          !lowerMsg.match(/(how to|kaise|start|begin)/i)) {
          flowId = 'equity_investment';
          flowNodeId = 'equity_investment_level_1_intro';
          flowNode = conversationEngine.getCurrentNode(flowId, flowNodeId);
          logger.debug('Flow detected: equity_investment', { flowId, flowNodeId, found: !!flowNode });
        }
        // "What is SIP?" → Could add SIP flow here, but currently handled by SIP router
        // Goal Planning → goal_planning flow select_goal
        else if (lowerMsg.match(/(goal planning|goal.*plan|financial goal)/i)) {
          flowId = 'goal_planning';
          flowNodeId = 'goal_planning_select_goal';
          flowNode = conversationEngine.getCurrentNode(flowId, flowNodeId);
          logger.debug('Flow detected: goal_planning', { flowId, flowNodeId, found: !!flowNode });
        }

        // If flow node found, use it for CTAs
        if (flowNode) {
          const state = conversationEngine.getState();
          state.userProfile.language = currentLang;
          state.currentFlowNode = flowNodeId;

          // Update navigation stack
          state.pushNavigation(flowNodeId);

          // Get CTAs from flow node
          const flowCTAs = flowNode.getCTAs(state);

          // Use LLM Agent for intelligent, context-aware response
          // Always use currentLang (persisted conversation language)
          // CRITICAL: Pass goal context explicitly so LLM Agent knows which goal user selected
          let agentResponse = null;
          try {
            agentResponse = await llmAgentInstance.processMessage(
              userMessage,
              currentLang,
              flowNode.intent || effectiveIntent, // Use flow node intent if available
              {
                ...userContext,
                questionsAsked: messages.filter(m => m.sender === 'user').map(m => m.text),
                goal: goalContext || userContext.goal, // Pass goalContext explicitly
                goalContext: goalContext, // Also pass as goalContext for clarity
                goalAmount: userContext.goalAmount, // Pass goal amount if selected
                interest: userContext.interest,
                flowIntent: flowNode.flowIntent // Pass flow intent for better context
              }
            );
          } catch (error) {
            logger.error('LLM error in flow node:', error);
          }

          // Extract response text
          let responseText = null;
          if (agentResponse && agentResponse.text) {
            responseText = extractTextFromAIResponse(agentResponse);
            if (responseText && typeof responseText === 'string' && responseText.trim().length > 0) {
              responseText = responseText.trim();
            } else {
              responseText = null;
            }
          }

          // If LLM response is available, use it; otherwise use node message
          const finalResponseText = responseText || flowNode.getMessage(state);

          // Always use flow CTAs instead of default quick replies
          logger.debug('Using flow CTAs', {
            flowId,
            flowNodeId,
            ctaCount: flowCTAs.length,
            ctas: flowCTAs.map(cta => cta.label)
          });

          response = createResponse(finalResponseText, {
            quickReplies: flowCTAs.map(cta => cta.label),
            showCTAs: true,
            ctaType: 'flow',
            flowData: {
              flowId: flowId,
              nodeId: flowNodeId,
              ctas: flowCTAs.map(cta => ({
                id: cta.id,
                label: cta.label,
                next: cta.next,
                flowId: flowId
              }))
            },
            language: currentLang
          });
          setIsTyping(false);
          return response;
        }

        // Use LLM Agent for intelligent, context-aware response
        // Always use currentLang (persisted conversation language)
        // CRITICAL: Pass goal context explicitly so LLM Agent knows which goal user selected
        const agentResponse = await llmAgentInstance.processMessage(
          userMessage,
          currentLang,
          effectiveIntent,
          {
            ...userContext,
            questionsAsked: messages.filter(m => m.sender === 'user').map(m => m.text),
            goal: goalContext || userContext.goal, // Pass goalContext explicitly
            goalContext: goalContext, // Also pass as goalContext for clarity
            goalAmount: userContext.goalAmount, // Pass goal amount if selected
            interest: userContext.interest
          }
        );

        // CRITICAL: Normalize empty objects to null to prevent validation errors
        // If agentResponse is an empty object {}, set it to null to trigger fallback
        if (agentResponse && typeof agentResponse === 'object' && Object.keys(agentResponse).length === 0) {
          logger.warn('LLM Agent returned empty object, normalizing to null');
          agentResponse = null;
        }

        logger.debug('LLM Agent response received', {
          hasResponse: !!agentResponse,
          hasText: !!agentResponse?.text,
          textLength: agentResponse?.text?.length || 0
        });

        // If agentResponse is null, skip extraction and go straight to fallback
        if (!agentResponse) {
          logger.warn('LLM Agent returned null, triggering fallback');
          response = null;
        } else {
          // Extract text from AI response using unified handler
          const responseText = extractTextFromAIResponse(agentResponse);

          // If LLM Agent provided a response, use it
          if (responseText && responseText.trim().length > 0) {
            // Process and normalize the extracted text
            let finalText = responseText;
            if (typeof responseText !== 'string') {
              if (Array.isArray(responseText)) {
                finalText = responseText
                  .map(v => typeof v === 'string' ? v : (v?.text || v?.content || String(v || '')))
                  .filter(v => v.length > 0)
                  .join(' ');
              } else if (typeof responseText === 'object' && responseText !== null) {
                finalText = responseText.text || responseText.content || responseText.message || JSON.stringify(responseText);
              } else {
                finalText = String(responseText || '');
              }
            }
            finalText = finalText.trim();

            // Validate that finalText is not empty after normalization
            if (!finalText || finalText.length === 0) {
              console.warn('⚠️ LLM Agent response text is empty after normalization', {
                originalResponse: agentResponse
              });
              // Explicitly set response to null to trigger fallback - don't leave it as empty object
              response = null;
            } else {
              // Determine quick replies based on conversation state
              // DO NOT show full menu during active conversation - only show contextual options
              let contextualQuickReplies = [];
              if (agentResponse.quickReplies && agentResponse.quickReplies.length > 0) {
                contextualQuickReplies = agentResponse.quickReplies;
              } else if (conversationStage === 'greeting' || isRestartRequest) {
                // Only show full menu on greeting or explicit restart
                contextualQuickReplies = getDefaultQuickReplies(language, !hasShownAdvisorCTA);
              } else {
                // During active conversation, show minimal contextual options
                contextualQuickReplies = [
                  currentLang === LANGUAGES.HINGLISH ? 'Aur samjhao' :
                    currentLang === LANGUAGES.HINDI ? 'और समझाएं' :
                      currentLang === LANGUAGES.PUNJABI ? 'ਹੋਰ ਸਮਝਾਓ' :
                        'Tell me more',
                  ...(goalContext ? [] : [t.goalPlanning]),
                  ...(!hasShownAdvisorCTA ? [t.talkToAdvisor] : [])
                ];
              }

              // Use unified response handler
              response = createResponse(finalText, {
                quickReplies: contextualQuickReplies,
                showCTAs: agentResponse.showCTAs !== undefined ? agentResponse.showCTAs : (conversationStage !== 'greeting'),
                ctaType: agentResponse.ctaType || 'general',
                language: currentLang
              });
            }

            // Follow-through is handled via the LLM agent memory + contextual quick replies

            // Update user context from agent's memory
            const profile = llmAgentInstance.memory.userProfile;
            if (profile.age) setUserContext(prev => ({ ...prev, age: profile.age }));
            if (profile.goals && profile.goals.length > 0) {
              setUserContext(prev => ({ ...prev, goal: profile.goals[0] }));
            }
            if (profile.experience) {
              setUserContext(prev => ({ ...prev, experience: profile.experience }));
            }

            // Handle calculator display based on agent's intelligent assessment
            if (agentResponse.showCalculator) {
              setShowCalculator(true);
            }

            // Handle advisor connect - only show contact form if high-intent detected
            // Use soft, trust-oriented approach - don't show immediately, let AI suggest it first
            if (agentResponse.ctaType === 'advisor' && agentResponse.text) {
              // Check if response already mentions contact/advisor help
              const mentionsContact = agentResponse.text.toLowerCase().includes('contact') ||
                agentResponse.text.toLowerCase().includes('advisor') ||
                agentResponse.text.toLowerCase().includes('team') ||
                agentResponse.text.toLowerCase().includes('connect');

              // Only show form if AI explicitly suggests it or user shows high intent
              if (mentionsContact || intent === INTENTS.LEAD_CAPTURE_OPPORTUNITY) {
                setTimeout(() => {
                  setShowContactForm(true);
                  setHasShownAdvisorCTA(true); // Mark as shown - will not appear again
                }, 3000); // Give user time to read the response first
              }
            }

            // Save learning pattern
            saveLearningPattern(userMessage, intent, agentResponse, currentLang);

            logger.debug('Using LLM Agent response');
          } else {
            // LLM Agent returned null or empty - try one more extraction attempt
            const extractedText = extractTextFromAIResponse(agentResponse);

            logger.warn('agent', 'LLM Agent returned no response or empty text, using fallback', {
              intent,
              language: currentLang,
              userMessage: userMessage.substring(0, 200),
              hasAgentResponse: !!agentResponse,
              extractedText: extractedText ? extractedText.substring(0, 100) : null
            });

            // If extraction found text, use it
            if (extractedText && extractedText.trim().length > 0) {
              console.log('✅ Found text in extraction, using it');
              response = createResponse(extractedText, {
                quickReplies: getDefaultQuickReplies(currentLang, !hasShownAdvisorCTA),
                language: currentLang
              });
            } else {
              // Set response to null to trigger fallback
              response = null;
            }
          }
        }
      } catch (error) {
        console.error('❌ ChatBot: LLM Agent Error, using fallback:', error);

        // Check if it's a quota/rate limit error
        const isQuotaError = error.message?.includes('quota') || error.message?.includes('429') ||
          error.message?.includes('insufficient_quota');

        if (isQuotaError) {
          console.warn('⚠️ OpenAI quota exceeded - using rule-based responses only');
        }

        // CRITICAL: Ensure response is null (not empty object) after error
        if (!response || (typeof response === 'object' && response !== null && Object.keys(response).length === 0)) {
          response = null;
        }
      }

      // CRITICAL: Before fallback check, ensure response is not an empty object
      // If response is an empty object {}, set it to null to trigger fallback
      if (response && typeof response === 'object' && response !== null && Object.keys(response).length === 0) {
        console.warn('⚠️ Response is empty object, setting to null to trigger fallback');
        response = null;
      }

      // If we don't have a response yet (LLM Agent returned null, error, or empty text), use fallback
      // Check for null, undefined, empty object, or missing/invalid text property
      // Use unified validation function
      if (!validateResponse(response)) {
        console.log('🔄 ChatBot: Using fallback response system (LLM Agent unavailable)', {
          hasResponse: !!response,
          responseType: typeof response,
          responseText: response?.text,
          responseMessage: response?.message,
          responseContent: response?.content,
          responseTextType: typeof response?.text,
          effectiveIntent: effectiveIntent || intent,
          detectedIntent: intent,
          userMessage: userMessage.substring(0, 100),
          conversationStage,
          messagesLength: messages.length,
          responseKeys: response ? Object.keys(response) : []
        });

        // Check for PRODUCT_EXPLORATION first (Equity Basket/Investment) before calling conversationFlow
        const finalIntent = effectiveIntent || intent;
        const langResponses = responses[currentLang] || responses[LANGUAGES.HINGLISH];
        let intentResponse = null;
        let fallbackResponse = null;

        console.log('🔍 Fallback: Checking intent', { finalIntent, isProductExploration: finalIntent === INTENTS.PRODUCT_EXPLORATION });

        if (finalIntent === INTENTS.PRODUCT_EXPLORATION) {
          // For product exploration (like Equity Basket), provide informative response using website content
          let equityBasketText;
          let equityBasketReplies;

          if (currentLang === LANGUAGES.HINGLISH) {
            equityBasketText = "**Equity Basket** 📊\n\nEquity basket ek diversified portfolio hai jo different equity mutual funds ko combine karta hai. Long-term wealth creation ke liye designed, experienced advisors ke saath managed.\n\n**Benefits:**\n• Diversification across multiple funds\n• Risk management through allocation\n• Quality stocks aur disciplined allocation par focus\n• Long-term wealth creation potential\n\n**Anupaat Nivesh mein hum aapko right equity basket design karne mein help karte hain — balanced, risk-managed portfolio jo aapke financial goals ke saath align hota hai.**\n\nAap kis goal ke liye equity basket consider kar rahe hain?";
            equityBasketReplies = ['Goal planning', 'SIP Calculation', 'Talk to advisor'];
          } else if (currentLang === LANGUAGES.HINDI) {
            equityBasketText = "**इक्विटी बास्केट** 📊\n\nइक्विटी बास्केट एक विविध पोर्टफोलियो है जो विभिन्न इक्विटी म्यूचुअल फंड को जोड़ता है। दीर्घकालिक धन सृजन के लिए डिज़ाइन किया गया, अनुभवी सलाहकारों के साथ प्रबंधित।\n\n**लाभ:**\n• कई फंडों में विविधीकरण\n• आवंटन के माध्यम से जोखिम प्रबंधन\n• गुणवत्तापूर्ण स्टॉक और अनुशासित आवंटन पर फोकस\n• दीर्घकालिक धन सृजन की क्षमता\n\n**Anupaat Nivesh में हम आपको सही इक्विटी बास्केट डिजाइन करने में मदद करते हैं — संतुलित, जोखिम-प्रबंधित पोर्टफोलियो जो आपके वित्तीय लक्ष्यों के साथ संरेखित होता है।**\n\nआप किस लक्ष्य के लिए इक्विटी बास्केट पर विचार कर रहे हैं?";
            equityBasketReplies = ['लक्ष्य योजना', 'SIP गणना', 'सलाहकार से बात करें'];
          } else if (currentLang === LANGUAGES.PUNJABI) {
            equityBasketText = "**ਇਕੁਇਟੀ ਬਾਸਕਟ** 📊\n\nਇਕੁਇਟੀ ਬਾਸਕਟ ਇੱਕ ਵਿਭਿੰਨ ਪੋਰਟਫੋਲੀਓ ਹੈ ਜੋ ਵੱਖ-ਵੱਖ ਇਕੁਇਟੀ ਮਿਊਚੁਅਲ ਫੰਡਾਂ ਨੂੰ ਜੋੜਦਾ ਹੈ। ਲੰਬੇ ਸਮੇਂ ਦੀ ਦੌਲਤ ਸਿਰਜਣ ਲਈ ਡਿਜ਼ਾਈਨ ਕੀਤਾ, ਅਨੁਭਵੀ ਸਲਾਹਕਾਰਾਂ ਦੇ ਨਾਲ ਪ੍ਰਬੰਧਿਤ।\n\n**ਫਾਇਦੇ:**\n• ਕਈ ਫੰਡਾਂ ਵਿੱਚ ਵਿਭਿੰਨਤਾ\n• ਆਵੰਟਨ ਦੁਆਰਾ ਜੋਖਮ ਪ੍ਰਬੰਧਨ\n• ਗੁਣਵੱਤਾਪੂਰਨ ਸਟਾਕ ਅਤੇ ਅਨੁਸ਼ਾਸਿਤ ਆਵੰਟਨ 'ਤੇ ਫੋਕਸ\n• ਲੰਬੇ ਸਮੇਂ ਦੀ ਦੌਲਤ ਸਿਰਜਣ ਦੀ ਸੰਭਾਵਨਾ\n\n**Anupaat Nivesh ਵਿੱਚ ਅਸੀਂ ਤੁਹਾਨੂੰ ਸਹੀ ਇਕੁਇਟੀ ਬਾਸਕਟ ਡਿਜ਼ਾਈਨ ਕਰਨ ਵਿੱਚ ਮਦਦ ਕਰਦੇ ਹਾਂ — ਸੰਤੁਲਿਤ, ਜੋਖਮ-ਪ੍ਰਬੰਧਿਤ ਪੋਰਟਫੋਲੀਓ ਜੋ ਤੁਹਾਡੇ ਵਿੱਤੀ ਟੀਚਿਆਂ ਨਾਲ ਸੰਬੰਧਿਤ ਹੁੰਦਾ ਹੈ।**\n\nਤੁਸੀਂ ਕਿਸ ਟੀਚੇ ਲਈ ਇਕੁਇਟੀ ਬਾਸਕਟ 'ਤੇ ਵਿਚਾਰ ਕਰ ਰਹੇ ਹੋ?";
            equityBasketReplies = ['ਟੀਚਾ ਯੋਜਨਾ', 'SIP ਗਣਨਾ', 'ਸਲਾਹਕਾਰ ਨਾਲ ਗੱਲ ਕਰੋ'];
          } else {
            equityBasketText = "**Equity Basket** 📊\n\nAn equity basket is a diversified portfolio that combines different equity mutual funds. Designed for long-term wealth creation, managed by experienced advisors with focus on quality stocks and disciplined allocation.\n\n**Benefits:**\n• Diversification across multiple funds\n• Risk management through allocation\n• Focus on quality stocks and disciplined allocation\n• Long-term wealth creation potential\n\n**At Anupaat Nivesh, we help you design the right equity basket — a balanced, risk-managed portfolio that aligns with your financial goals.**\n\nWhat goal are you considering an equity basket for?";
            equityBasketReplies = ['Goal planning', 'SIP Calculation', 'Talk to advisor'];
          }

          intentResponse = {
            text: equityBasketText,
            quickReplies: equityBasketReplies
          };
        } else if (finalIntent === INTENTS.HOW_TO_START_INVESTING) {
          // FUNCTIONAL FIX: For SIP-related queries, provide SIP-specific response
          if (lowerUserMessage.includes('sip') || lowerUserMessage.includes('systematic investment')) {
            // Use SIP-specific response if available, otherwise use general howToStart
            intentResponse = langResponses.whatIsSIP || langResponses.howToStart;
          } else {
            intentResponse = langResponses.howToStart;
          }
        } else if (finalIntent === INTENTS.BEGINNER_QUERY) {
          // FUNCTIONAL FIX: For beginner queries about SIP, use SIP-specific response
          if (lowerUserMessage.includes('sip') || lowerUserMessage.includes('systematic investment')) {
            intentResponse = langResponses.whatIsSIP;
          } else {
            // For other beginner queries, use whatIsSIP as fallback
            intentResponse = langResponses.whatIsSIP || langResponses.howToStart;
          }
        } else if (finalIntent === INTENTS.GOAL_PLANNING) {
          // CRITICAL: Use goal-specific response based on goalContext
          if (goalContext === 'child_education' || goalContext === 'children_1cr') {
            intentResponse = langResponses.goalChildEducation || langResponses.goalRetirement;
          } else if (goalContext === 'child_marriage') {
            intentResponse = langResponses.goalChildEducation || langResponses.goalRetirement; // Use child education template
          } else if (goalContext === 'first_crore' || goalContext === 'wealth_1cr' || goalContext === 'wealth_5cr') {
            intentResponse = langResponses.goalFirstCrore || langResponses.goalRetirement;
          } else {
            // Default to retirement for other goal contexts
            intentResponse = langResponses.goalRetirement;
          }
        } else if (finalIntent === INTENTS.UNREALISTIC_RETURN_EXPECTATION) {
          intentResponse = langResponses.unrealisticExpectation;
        } else if (finalIntent === INTENTS.FEAR_OR_RISK_CONCERN) {
          intentResponse = langResponses.fearRisk;
        }

        // If we have an intent-specific response, use it directly (don't call conversationFlow)
        if (intentResponse) {
          console.log('✅ Fallback: Using intent-specific response', { intent: finalIntent, hasText: !!intentResponse.text });
          // Use unified response handler
          response = createResponse(intentResponse.text, {
            quickReplies: intentResponse.quickReplies || getDefaultQuickReplies(currentLang, !hasShownAdvisorCTA),
            language: currentLang
          });
          // Set fallbackResponse for use in the code below
          fallbackResponse = intentResponse;
        } else {
          console.log('⚠️ Fallback: No intent-specific response, calling conversationFlow', { finalIntent });
          // Fallback to Enhanced ArthAI with education-first approach
          // Always use currentLang (persisted conversation language)
          const aiResponse = await conversationFlow.getNextStep(
            intent,
            userMessage,
            currentLang,
            { callAIModel } // Pass AI service function
          );

          // Save learning pattern
          saveLearningPattern(userMessage, intent, aiResponse, currentLang);

          // Ensure aiResponse has text property
          fallbackResponse = aiResponse;
          if (!fallbackResponse || !fallbackResponse.text) {
            // Use intent-specific responses instead of defaulting to greeting
            let intentResponse2 = null;
            if (finalIntent === INTENTS.HOW_TO_START_INVESTING) {
              intentResponse2 = langResponses.howToStart;
            } else if (finalIntent === INTENTS.BEGINNER_QUERY) {
              // CRITICAL: For BEGINNER_QUERY (especially SIP queries), always use whatIsSIP
              // Never fall back to greeting for SIP queries
              intentResponse2 = langResponses.whatIsSIP || langResponses.howToStart;
            } else if (finalIntent === INTENTS.GOAL_PLANNING) {
              intentResponse2 = langResponses.goalRetirement;
            } else if (finalIntent === INTENTS.UNREALISTIC_RETURN_EXPECTATION) {
              intentResponse2 = langResponses.unrealisticExpectation;
            } else if (finalIntent === INTENTS.FEAR_OR_RISK_CONCERN) {
              intentResponse2 = langResponses.fearRisk;
            } else if (finalIntent === INTENTS.PRODUCT_EXPLORATION) {
              // For product exploration (like Equity Basket), provide informative response
              let equityBasketText;
              let equityBasketReplies;

              if (currentLang === LANGUAGES.HINGLISH) {
                equityBasketText = "**Equity Basket** 📊\n\nEquity basket ek diversified portfolio hai jo different equity mutual funds ko combine karta hai.\n\n**Benefits:**\n• Diversification across multiple funds\n• Risk management through allocation\n• Long-term wealth creation potential\n\n**Anupaat Nivesh mein hum aapko right equity basket design karne mein help karte hain.**\n\nAap kis goal ke liye equity basket consider kar rahe hain?";
                equityBasketReplies = ['Goal planning', 'SIP Calculation', 'Talk to advisor'];
              } else if (currentLang === LANGUAGES.HINDI) {
                equityBasketText = "**इक्विटी बास्केट** 📊\n\nइक्विटी बास्केट एक विविध पोर्टफोलियो है जो विभिन्न इक्विटी म्यूचुअल फंड को जोड़ता है।\n\n**लाभ:**\n• कई फंडों में विविधीकरण\n• आवंटन के माध्यम से जोखिम प्रबंधन\n• दीर्घकालिक धन सृजन की क्षमता\n\n**Anupaat Nivesh में हम आपको सही इक्विटी बास्केट डिजाइन करने में मदद करते हैं।**\n\nआप किस लक्ष्य के लिए इक्विटी बास्केट पर विचार कर रहे हैं?";
                equityBasketReplies = ['लक्ष्य योजना', 'SIP गणना', 'सलाहकार से बात करें'];
              } else if (currentLang === LANGUAGES.PUNJABI) {
                equityBasketText = "**ਇਕੁਇਟੀ ਬਾਸਕਟ** 📊\n\nਇਕੁਇਟੀ ਬਾਸਕਟ ਇੱਕ ਵਿਭਿੰਨ ਪੋਰਟਫੋਲੀਓ ਹੈ ਜੋ ਵੱਖ-ਵੱਖ ਇਕੁਇਟੀ ਮਿਊਚੁਅਲ ਫੰਡਾਂ ਨੂੰ ਜੋੜਦਾ ਹੈ।\n\n**ਫਾਇਦੇ:**\n• ਕਈ ਫੰਡਾਂ ਵਿੱਚ ਵਿਭਿੰਨਤਾ\n• ਆਵੰਟਨ ਦੁਆਰਾ ਜੋਖਮ ਪ੍ਰਬੰਧਨ\n• ਲੰਬੇ ਸਮੇਂ ਦੀ ਦੌਲਤ ਸਿਰਜਣ ਦੀ ਸੰਭਾਵਨਾ\n\n**Anupaat Nivesh ਵਿੱਚ ਅਸੀਂ ਤੁਹਾਨੂੰ ਸਹੀ ਇਕੁਇਟੀ ਬਾਸਕਟ ਡਿਜ਼ਾਈਨ ਕਰਨ ਵਿੱਚ ਮਦਦ ਕਰਦੇ ਹਾਂ।**\n\nਤੁਸੀਂ ਕਿਸ ਟੀਚੇ ਲਈ ਇਕੁਇਟੀ ਬਾਸਕਟ 'ਤੇ ਵਿਚਾਰ ਕਰ ਰਹੇ ਹੋ?";
                equityBasketReplies = ['ਟੀਚਾ ਯੋਜਨਾ', 'SIP ਗਣਨਾ', 'ਸਲਾਹਕਾਰ ਨਾਲ ਗੱਲ ਕਰੋ'];
              } else {
                equityBasketText = "**Equity Basket** 📊\n\nAn equity basket is a diversified portfolio that combines different equity mutual funds.\n\n**Benefits:**\n• Diversification across multiple funds\n• Risk management through allocation\n• Long-term wealth creation potential\n\n**At Anupaat Nivesh, we help you design the right equity basket.**\n\nWhat goal are you considering an equity basket for?";
                equityBasketReplies = ['Goal planning', 'SIP Calculation', 'Talk to advisor'];
              }

              intentResponse2 = {
                text: equityBasketText,
                quickReplies: equityBasketReplies
              };
            }

            // Only use greeting as absolute last resort (when conversation is truly new)
            if (intentResponse2) {
              fallbackResponse = intentResponse2;
            } else if (conversationStage === 'greeting' && messages.length <= 2) {
              // Only show greeting if this is truly the first interaction (2 messages = greeting + user's first message)
              fallbackResponse = langResponses.greeting || {
                text: currentLang === LANGUAGES.HINGLISH
                  ? 'Maaf kijiye, kuch samajh nahi aaya. Kya aap phir se puch sakte hain?'
                  : 'Sorry, I did not understand. Can you please ask again?',
                quickReplies: []
              };
            } else {
              // During active conversation, ask clarifying question instead of greeting
              fallbackResponse = {
                text: currentLang === LANGUAGES.HINGLISH
                  ? 'Maaf kijiye, kuch samajh nahi aaya. Kya aap phir se puch sakte hain?'
                  : currentLang === LANGUAGES.HINDI
                    ? 'माफ करें, कुछ समझ नहीं आया। क्या आप फिर से पूछ सकते हैं?'
                    : currentLang === LANGUAGES.PUNJABI
                      ? 'ਮਾਫ ਕਰੋ, ਕੁਝ ਸਮਝ ਨਹੀਂ ਆਇਆ। ਕੀ ਤੁਸੀਂ ਫਿਰ ਪੁੱਛ ਸਕਦੇ ਹੋ?'
                      : 'Sorry, I did not understand. Can you please ask again?',
                quickReplies: getDefaultQuickReplies(currentLang, !hasShownAdvisorCTA)
              };
            }
          }
        }

        // Fallback behavior: Ask clarifying question, DO NOT reset to welcome menu
        const fallbackQuickReplies = fallbackResponse.quickReplies || (
          conversationStage === 'greeting' || isRestartRequest
            ? getDefaultQuickReplies(language, !hasShownAdvisorCTA)
            : [
              currentLang === LANGUAGES.HINGLISH ? 'Phir se samjhao' :
                currentLang === LANGUAGES.HINDI ? 'फिर से समझाएं' :
                  currentLang === LANGUAGES.PUNJABI ? 'ਫਿਰ ਸਮਝਾਓ' :
                    'Please explain again',
              ...(!hasShownAdvisorCTA ? [t.talkToAdvisor] : [])
            ]
        );

        // CRITICAL: Use ensureValidResponse to guarantee text property exists
        const fallbackTextValue = fallbackResponse.text || (currentLang === LANGUAGES.HINGLISH
          ? 'Maaf kijiye, kuch samajh nahi aaya. Kya aap phir se puch sakte hain?'
          : currentLang === LANGUAGES.HINDI
            ? 'माफ करें, कुछ समझ नहीं आया। क्या आप फिर से पूछ सकते हैं?'
            : currentLang === LANGUAGES.PUNJABI
              ? 'ਮਾਫ ਕਰੋ, ਕੁਝ ਸਮਝ ਨਹੀਂ ਆਇਆ। ਕੀ ਤੁਸੀਂ ਫਿਰ ਪੁੱਛ ਸਕਦੇ ਹੋ?'
              : 'Sorry, I did not understand. Can you please ask again?');

        response = createResponse(fallbackTextValue, {
          quickReplies: fallbackQuickReplies,
          showCTAs: fallbackResponse?.showCTAs !== undefined ? fallbackResponse.showCTAs : (conversationStage !== 'greeting'),
          ctaType: fallbackResponse?.ctaType || 'general',
          language: currentLang
        });

        // Show calculator only if explicitly allowed (after education)
        if (fallbackResponse?.showCalculator !== false && (intent === INTENTS.CALCULATOR || message.includes('calculate') || message.includes('calc'))) {
          setShowCalculator(true);
        }

        // If advisor connect intent, prepare for lead capture (soft approach)
        // Only show if user has shown high intent or explicitly asked for advisor
        const userAskedForAdvisor = message.includes('advisor') ||
          message.includes('expert') ||
          message.includes('team') ||
          message.includes('consult') ||
          message.includes('help me') ||
          message.includes('guide me');

        if ((intent === INTENTS.LEAD_CAPTURE_OPPORTUNITY || conversationFlow.state === 'lead_capture') &&
          (userAskedForAdvisor || messages.length >= 4)) {
          setTimeout(() => {
            setShowContactForm(true);
            setHasShownAdvisorCTA(true); // Mark as shown - will not appear again
          }, 3000); // Give user time to read the response first
        }
      }
    }

    // Simplified responses focused on calculations
    // NOTE: This check happens AFTER main flow, so it can override if needed
    if ((message.includes('step-up') || message.includes('increase sip')) && (!response || !response.text || response.text.trim().length === 0)) {
      const example1 = calculateSIPExample(10000, 15, 12);
      const stepUpExample = calculateStepUpSIPExample(10000, 15, 12, 10);
      response = {
        id: `msg-${++messageIdCounter.current}`,
        text: "**Step-up SIP Comparison** 📈\n\n**Regular SIP:** ₹10k/month × 15 years\n• Invested: " + formatCurrency(example1.invested) + " | Maturity: " + formatCurrency(example1.maturity) + "\n\n**Step-up SIP:** Start ₹10k, +10% yearly\n• Invested: " + formatCurrency(stepUpExample.invested) + " | Maturity: " + formatCurrency(stepUpExample.maturity) + "\n• Extra: " + formatCurrency(stepUpExample.returns - example1.returns) + "\n\n**Use calculator below!**",
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: ['Calculate Step-up SIP', 'SIP', 'Lumpsum'],
        showCTAs: false
      };
      setShowCalculator(true);
      setCalculatorType('stepup');
    }

    // Soft lead capture - only after meaningful engagement and high-intent signals
    // Removed automatic contact form trigger - let AI decide when to suggest it
    // This ensures trust-first, no-pressure approach

    // Final validation - use unified validation function
    if (!validateResponse(response)) {
      console.error('❌ processUserMessage: Invalid or empty response, creating fallback', {
        hasResponse: !!response,
        responseType: typeof response,
        responseText: response?.text,
        responseMessage: response?.message,
        responseContent: response?.content,
        responseTextType: typeof response?.text,
        effectiveIntent: effectiveIntent || intent,
        userMessage: userMessage.substring(0, 100),
        conversationStage,
        messagesLength: messages.length,
        responseKeys: response ? Object.keys(response) : []
      });

      // Try to provide a context-specific fallback based on intent
      const finalIntent = effectiveIntent || intent;
      const langResponses = responses[currentLang] || responses[LANGUAGES.HINGLISH];
      let fallbackText = null;
      const lowerFallbackMessage = userMessage.toLowerCase();

      // SIP-specific fallback (most common query)
      if (finalIntent === INTENTS.BEGINNER_QUERY &&
        (lowerFallbackMessage.includes('sip') || lowerFallbackMessage.includes('systematic investment'))) {
        if (currentLang === LANGUAGES.HINGLISH) {
          fallbackText = "**SIP (Systematic Investment Plan) — Simple Explanation** 💡\n\n**SIP matlab:** Har mahine ek fixed amount invest karna — jaise mobile recharge, waise hi disciplined investing.\n\n**Kyun SIP?**\n✓ Discipline banta hai (auto-invest)\n✓ Small start (₹500 se bhi)\n✓ Market ups/downs ka impact average ho jata hai\n✓ Long-term mein compounding help karta hai\n\n**Example:** ₹5,000/month × 20 years (12% return) = ~₹50 lakh (invested ₹12 lakh)\n\nReturns **market-linked** hote hain — guaranteed nahi.\n\n**Kya aap SIP ke baare mein aur janna chahte hain?**";
        } else if (currentLang === LANGUAGES.HINDI) {
          fallbackText = "**SIP (Systematic Investment Plan) — सरल व्याख्या** 💡\n\n**SIP का मतलब:** हर महीने एक तय राशि निवेश करना — जैसे मोबाइल रिचार्ज, वैसे ही अनुशासित निवेश।\n\n**क्यों SIP?**\n✓ अनुशासन बनता है (ऑटो-इन्वेस्ट)\n✓ छोटी शुरुआत (₹500 से भी)\n✓ मार्केट के उतार-चढ़ाव का असर औसत हो जाता है\n✓ लंबे समय में कंपाउंडिंग मदद करती है\n\n**उदाहरण:** ₹5,000/महीना × 20 साल (12% रिटर्न) = ~₹50 लाख (निवेश ₹12 लाख)\n\nरिटर्न **मार्केट-लिंक्ड** होते हैं — गारंटी नहीं।\n\n**क्या आप SIP के बारे में और जानना चाहेंगे?**";
        } else if (currentLang === LANGUAGES.PUNJABI) {
          fallbackText = "**SIP (Systematic Investment Plan) — ਸਰਲ ਵਿਆਖਿਆ** 💡\n\n**SIP ਦਾ ਮਤਲਬ:** ਹਰ ਮਹੀਨੇ ਇੱਕ ਨਿਸ਼ਚਿਤ ਰਕਮ ਨਿਵੇਸ਼ ਕਰਨਾ — ਜਿਵੇਂ ਮੋਬਾਈਲ ਰੀਚਾਰਜ, ਓਸੇ ਤਰ੍ਹਾਂ ਅਨੁਸ਼ਾਸਿਤ ਨਿਵੇਸ਼।\n\n**ਕਿਉਂ SIP?**\n✓ Discipline ਬਣਦੀ ਹੈ (ਆਟੋ-ਇਨਵੇਸਟ)\n✓ ਛੋਟੀ ਸ਼ੁਰੂਆਤ (₹500 ਤੋਂ ਵੀ)\n✓ ਮਾਰਕੀਟ ਦੇ ਉਤਾਰ-ਚੜ੍ਹਾਅ ਦਾ ਅਸਰ ਔਸਤ ਹੋ ਜਾਂਦਾ ਹੈ\n✓ ਲੰਬੇ ਸਮੇਂ ਵਿੱਚ compounding ਮਦਦ ਕਰਦੀ ਹੈ\n\n**ਉਦਾਹਰਣ:** ₹5,000/ਮਹੀਨਾ × 20 ਸਾਲ (12% return) = ~₹50 ਲੱਖ (ਨਿਵੇਸ਼ ₹12 ਲੱਖ)\n\nReturns **market-linked** ਹੁੰਦੇ ਹਨ — guaranteed ਨਹੀਂ।\n\n**ਕੀ ਤੁਸੀਂ SIP ਬਾਰੇ ਹੋਰ ਜਾਣਨਾ ਚਾਹੋਗੇ?**";
        } else {
          fallbackText = "**SIP (Systematic Investment Plan) — Simple Explanation** 💡\n\n**SIP means:** Investing a fixed amount every month — like a mobile recharge, disciplined investing.\n\n**Why SIP?**\n✓ Builds discipline (auto-invest)\n✓ Easy to start small (even ₹500)\n✓ Smooths market ups/downs (rupee-cost averaging)\n✓ Compounding helps over the long term\n\n**Example:** ₹5,000/month × 20 years (12% return) = ~₹50 lakh (invested ₹12 lakh)\n\nReturns are **market-linked** — not guaranteed.\n\n**Would you like to know more about SIP?**";
        }
      } else if (finalIntent === INTENTS.PRODUCT_EXPLORATION ||
        lowerFallbackMessage.includes('equity investment') ||
        lowerFallbackMessage.includes('what is equity')) {
        // Provide equity investment explanation
        if (currentLang === LANGUAGES.HINGLISH) {
          fallbackText = "**Equity Investment** 📈\n\nEquity investment matlab stocks ya shares mein invest karna. Ye long-term wealth creation ke liye ek powerful tool hai.\n\n**Key Points:**\n• Stocks company ownership represent karte hain\n• Long-term mein potential for good returns\n• Diversification zaroori hai risk manage karne ke liye\n\n**Anupaat Nivesh mein hum aapko equity investment strategies mein help karte hain.**";
        } else if (currentLang === LANGUAGES.HINDI) {
          fallbackText = "**इक्विटी निवेश** 📈\n\nइक्विटी निवेश का मतलब है स्टॉक या शेयर में निवेश करना। यह दीर्घकालिक धन सृजन के लिए एक शक्तिशाली उपकरण है।\n\n**मुख्य बिंदु:**\n• स्टॉक कंपनी के स्वामित्व का प्रतिनिधित्व करते हैं\n• दीर्घकाल में अच्छे रिटर्न की संभावना\n• जोखिम प्रबंधन के लिए विविधीकरण जरूरी है\n\n**Anupaat Nivesh में हम आपको इक्विटी निवेश रणनीतियों में मदद करते हैं।**";
        } else {
          fallbackText = "**Equity Investment** 📈\n\nEquity investment means investing in stocks or shares. It's a powerful tool for long-term wealth creation.\n\n**Key Points:**\n• Stocks represent company ownership\n• Potential for good returns in the long term\n• Diversification is important to manage risk\n\n**At Anupaat Nivesh, we help you with equity investment strategies.**";
        }
      }

      // Use unified response handler
      const fallbackResponseText = fallbackText || langResponses.greeting?.text || (currentLang === LANGUAGES.HINGLISH
        ? 'Maaf kijiye, kuch technical issue ho raha hai. Kya aap phir se try kar sakte hain?'
        : 'Sorry, there\'s a technical issue. Please try again.');

      // Determine quick replies based on fallback type
      let fallbackQuickReplies = [];
      if (fallbackText && (lowerFallbackMessage.includes('sip') || lowerFallbackMessage.includes('systematic investment'))) {
        // SIP-specific quick replies
        fallbackQuickReplies = currentLang === LANGUAGES.HINGLISH
          ? ['SIP kaise start karein?', 'SIP Calculation', 'Goal planning']
          : currentLang === LANGUAGES.HINDI
            ? ['SIP कैसे शुरू करें?', 'SIP Calculation', 'लक्ष्य योजना']
            : currentLang === LANGUAGES.PUNJABI
              ? ['SIP ਕਿਵੇਂ ਸ਼ੁਰੂ ਕਰੀਏ?', 'SIP Calculation', 'ਟੀਚਾ ਯੋਜਨਾ']
              : ['How to start SIP?', 'SIP Calculation', 'Goal planning'];
      } else if (fallbackText) {
        fallbackQuickReplies = ['Goal planning', 'SIP Calculation', 'Talk to advisor'];
      } else {
        fallbackQuickReplies = langResponses.greeting?.quickReplies || getDefaultQuickReplies(language, !hasShownAdvisorCTA);
      }

      response = createResponse(fallbackResponseText, {
        quickReplies: fallbackQuickReplies,
        language: currentLang
      });

      console.log('✅ Final fallback: Response set', {
        hasResponse: !!response,
        hasText: !!response.text,
        textLength: response.text?.length || 0
      });
    }

    // Final validation - ensure response is valid
    if (!validateResponse(response)) {
      // Create fallback response
      const fallbackText = currentLang === LANGUAGES.HINGLISH
        ? 'Maaf kijiye, kuch technical issue ho raha hai. Kya aap phir se try kar sakte hain?'
        : 'Sorry, there\'s a technical issue. Please try again.';

      response = createResponse(fallbackText, {
        quickReplies: getDefaultQuickReplies(currentLang, !hasShownAdvisorCTA),
        language: currentLang
      });
    }

    // Ensure response has a unique ID before returning
    if (response && !response.id) {
      response.id = generateUniqueMessageId();
    } else if (response && response.id && response.id.startsWith('msg-') && !response.id.includes('-')) {
      // If it's a simple counter-based ID, make it more unique
      response.id = generateUniqueMessageId();
    }

    // Final check - if still invalid, create emergency fallback
    // CRITICAL: Check multiple field names to handle schema mismatches
    const finalEffectiveText =
      response?.text ??
      response?.message ??
      response?.content ??
      response?.output_text ??
      "";

    if (!response || !finalEffectiveText || typeof finalEffectiveText !== 'string' || finalEffectiveText.trim().length === 0) {
      console.error('❌ CRITICAL: Response still invalid after ensureValidResponse', {
        response,
        responseType: typeof response,
        responseText: response?.text,
        responseMessage: response?.message,
        responseContent: response?.content,
        responseKeys: response ? Object.keys(response) : []
      });
      response = createResponse(
        currentLang === LANGUAGES.HINGLISH
          ? 'Maaf kijiye, kuch technical issue ho raha hai. Kya aap phir se try kar sakte hain?'
          : 'Sorry, there was a technical error. Please try again.',
        { language: currentLang }
      );
    }

    console.log('✅ FINAL RESPONSE BEFORE RETURN =', {
      hasResponse: !!response,
      hasText: !!response?.text,
      textLength: response?.text?.length || 0,
      responseKeys: response ? Object.keys(response) : []
    });

    return response;
  };

  const calculateStepUpSIPExample = (monthly, years, rate, stepPercent) => {
    const n = years * 12;
    const r = rate / 12 / 100;
    const step = stepPercent / 100;
    let maturity = 0;
    let invested = 0;

    for (let m = 0; m < n; m++) {
      const yearIndex = Math.floor(m / 12);
      const contribution = monthly * Math.pow(1 + step, yearIndex);
      const monthsLeft = n - m - 1;
      invested += contribution;
      if (r === 0) {
        maturity += contribution;
      } else {
        maturity += contribution * Math.pow(1 + r, monthsLeft + 1);
      }
    }

    return { maturity, invested, returns: maturity - invested };
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const formatTime = (date) => {
    if (!date) return '';
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) return '';
      return dateObj.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return '';
    }
  };

  const calculateLumpsumExample = (principal, years, rate) => {
    const r = rate / 100;
    const maturity = principal * Math.pow(1 + r, years);
    return {
      maturity,
      invested: principal,
      returns: maturity - principal
    };
  };

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    localStorage.setItem('chatbot_language', lang);
    setIsOpen(true);
  };

  return (
    <>
      {/* Floating Chat Button - Only show when chatbot is closed */}
      {!standalone && !isOpen && (
        <button
          className="chatbot-toggle"
          onClick={() => {
            if (!language) {
              setIsOpen(true);
            } else {
              toggleChat();
            }
          }}
          aria-label="Open AI Chatbot"
        >
          <img
            src={arthAILogo}
            alt="ArthAI"
            onError={(e) => {
              e.target.style.display = 'none';
              const fallback = document.createElement('div');
              fallback.innerHTML = '<svg><use xlink:href="#robot-icon"></use></svg>';
              e.target.parentElement?.appendChild(fallback);
            }}
          />
        </button>
      )}

      {/* Language Selection */}
      {isOpen && !language && (
        <div className={`chatbot-container ${standalone ? 'standalone' : ''}`}>
          <div className="language-selection">
            <div className="language-selection-header">
              <FaRobot className="language-icon" />
              <h3>{translations.en.selectLanguage}</h3>
            </div>
            <div className="language-options">
              <button
                className="language-option"
                onClick={() => handleLanguageSelect(LANGUAGES.HINGLISH)}
              >
                <span className="language-name">Hinglish</span>
                <span className="language-native">Hinglish (Default)</span>
              </button>
              <button
                className="language-option"
                onClick={() => handleLanguageSelect(LANGUAGES.HINDI)}
              >
                <span className="language-name">हिंदी</span>
                <span className="language-native">Hindi</span>
              </button>
              <button
                className="language-option"
                onClick={() => handleLanguageSelect(LANGUAGES.ENGLISH)}
              >
                <span className="language-name">English</span>
                <span className="language-native">English</span>
              </button>
              <button
                className="language-option"
                onClick={() => handleLanguageSelect(LANGUAGES.PUNJABI)}
              >
                <span className="language-name">ਪੰਜਾਬੀ</span>
                <span className="language-native">Punjabi</span>
              </button>
            </div>
            {!standalone && (
              <button
                className="language-close"
                onClick={toggleChat}
                aria-label="Close"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && language && (
        <div className={`chatbot-container ${standalone ? 'standalone' : ''}`}>
          <div className="chatbot-header">
            <div className="chatbot-header-content">
              <div className="arthai-icon-wrapper">
                <img
                  src={arthAILogo}
                  alt="ArthAI"
                  className="arthai-logo-img"
                  onError={(e) => {
                    // Fallback to icon if image fails to load
                    e.target.style.display = 'none';
                    const fallback = e.target.parentElement?.querySelector('.arthai-icon-fallback');
                    if (fallback) fallback.classList.remove('arthai-fallback-hidden');
                  }}
                />
                <div className="arthai-icon-fallback arthai-fallback-hidden">
                  <FaChartLine className="arthai-icon-primary" />
                  <FaBrain className="arthai-icon-overlay" />
                  <FaCoins className="arthai-icon-accent" />
                </div>
              </div>
              <div>
                <h3>ArthAI</h3>
              </div>
            </div>
            <div className="chatbot-header-actions">
              {/* Close Button - Moved to Header (Top Right) */}
              {!standalone && (
                <button
                  className="chatbot-close-header"
                  onClick={toggleChat}
                  aria-label="Close chat"
                  title="Close"
                >
                  <FaTimes />
                </button>
              )}

              {/* Voice Mode Toggle */}
              {VOICE_CONFIG.enabled && (
                <button
                  className={`voice-toggle-btn ${isVoiceMode ? 'active' : ''}`}
                  onClick={() => {
                    setIsVoiceMode(!isVoiceMode);
                    if (!isVoiceMode) {
                      // Initialize voice service with current language
                      voiceService.initializeSTT(language);
                      voiceService.initializeTTS(language);
                      // Show voice mode enabled message
                      const voiceMsg = {
                        id: `msg-${++messageIdCounter.current}`,
                        text: language === LANGUAGES.HINGLISH || language === LANGUAGES.HINDI
                          ? "🎤 Voice mode enable ho gaya hai! Ab aap bol kar baat kar sakte hain. Microphone button par click karein."
                          : "🎤 Voice mode enabled! You can now speak. Click the microphone button.",
                        sender: 'bot',
                        timestamp: new Date(),
                        isSystemMessage: true
                      };
                      setMessages(prev => [...prev, voiceMsg]);
                    } else {
                      voiceService.stopListening();
                    }
                  }}
                  aria-label="Toggle voice mode"
                  title={isVoiceMode ? 'Disable voice mode' : 'Enable voice mode'}
                >
                  {isVoiceMode ? <FaMicrophoneSlash /> : <FaMicrophone />}
                </button>
              )}

              {/* Always-available Language Switcher */}
              <div className="language-switcher-container">
                <button
                  className="language-switcher-btn"
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  aria-label="Change language"
                  title="Change Language"
                >
                  <FaLanguage />
                </button>
                {showLanguageMenu && (
                  <div className="language-menu">
                    <button
                      className={`language-menu-item ${language === 'en' ? 'active' : ''}`}
                      onClick={() => {
                        const newLang = 'en';
                        setLanguage(newLang);
                        localStorage.setItem('chatbot_language', newLang);
                        setShowLanguageMenu(false);
                        const t = translations[newLang];
                        setMessages([
                          {
                            id: `msg-${++messageIdCounter.current}`,
                            text: t.greeting,
                            sender: 'bot',
                            timestamp: new Date(),
                            quickReplies: getDefaultQuickReplies(newLang, !hasShownAdvisorCTA),
                            showCTAs: true,
                            ctaType: 'general'
                          }
                        ]);
                      }}
                    >
                      <span>English</span>
                    </button>
                    <button
                      className={`language-menu-item ${language === 'hi' ? 'active' : ''}`}
                      onClick={() => {
                        const newLang = 'hi';
                        setLanguage(newLang);
                        localStorage.setItem('chatbot_language', newLang);
                        setShowLanguageMenu(false);
                        const t = translations[newLang];
                        setMessages([
                          {
                            id: `msg-${++messageIdCounter.current}`,
                            text: t.greeting,
                            sender: 'bot',
                            timestamp: new Date(),
                            quickReplies: getDefaultQuickReplies(newLang, !hasShownAdvisorCTA),
                            showCTAs: true,
                            ctaType: 'general'
                          }
                        ]);
                      }}
                    >
                      <span>हिंदी</span>
                    </button>
                    <button
                      className={`language-menu-item ${language === 'pa' ? 'active' : ''}`}
                      onClick={() => {
                        const newLang = 'pa';
                        setLanguage(newLang);
                        localStorage.setItem('chatbot_language', newLang);
                        setShowLanguageMenu(false);
                        const t = translations[newLang];
                        setMessages([
                          {
                            id: `msg-${++messageIdCounter.current}`,
                            text: t.greeting,
                            sender: 'bot',
                            timestamp: new Date(),
                            quickReplies: getDefaultQuickReplies(newLang, !hasShownAdvisorCTA),
                            showCTAs: true,
                            ctaType: 'general'
                          }
                        ]);
                      }}
                    >
                      <span>ਪੰਜਾਬੀ</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="chatbot-messages">
            {messages.map((message) => (
              <div key={message.id}>
                <div
                  className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
                >
                  <div className="message-avatar">
                    {message.sender === 'user' ? (
                      <FaUser />
                    ) : (
                      <img
                        src={arthAILogo}
                        alt="ArthAI"
                        className="arthai-avatar-img"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const fallback = document.createElement('div');
                          fallback.innerHTML = '<svg><use xlink:href="#robot-icon"></use></svg>';
                          e.target.parentElement?.appendChild(fallback);
                        }}
                      />
                    )}
                  </div>
                  <div className="message-content">
                    <p>
                      {(() => {
                        // Ensure message.text is always a string (fix [object Object] issue)
                        const text = typeof message.text === 'string'
                          ? message.text
                          : (message.text?.toString() || String(message.text) || '');

                        return text.split('\n').map((line, i, arr) => (
                          <React.Fragment key={i}>
                            {line}
                            {i < arr.length - 1 && <br />}
                          </React.Fragment>
                        ));
                      })()}
                    </p>
                    {formatTime(message.timestamp) && (
                      <span className="message-time">{formatTime(message.timestamp)}</span>
                    )}
                  </div>
                </div>

                {/* Quick Reply Buttons */}
                {message.quickReplies && message.sender === 'bot' && (
                  <div className="quick-replies">
                    {message.quickReplies.map((reply, index) => {
                      // Check if this message has flow data for CTA navigation
                      const flowData = message.flowData;
                      const ctaData = flowData?.ctas?.[index];

                      return (
                        <button
                          key={index}
                          className="quick-reply-btn"
                          onClick={() => {
                            if (ctaData && flowData) {
                              // Flow-based CTA navigation
                              handleQuickReply(reply, {
                                flowId: flowData.flowId,
                                nodeId: flowData.nodeId,
                                ctaId: ctaData.id
                              });
                            } else {
                              // Regular quick reply
                              handleQuickReply(reply);
                            }
                          }}
                        >
                          {reply}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Dynamic CTA Buttons - AI-Driven Based on Conversation Context */}
                {message.showCTAs && message.sender === 'bot' && (
                  <div className="chatbot-ctas">
                    {/* App Download CTA - Show prominently for app_download type or how_to_start intent */}
                    {(message.ctaType === 'app_download' || message.ctaType === 'general' || !message.ctaType) && (
                      <a
                        href="https://play.google.com/store/apps/details?id=com.dwt.AnupaatNivesh"
                        className={`cta-button app-cta ${message.ctaType === 'app_download' ? 'primary-cta' : ''}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          // Track app download click for analytics
                          if (window.gtag) {
                            window.gtag('event', 'app_download_click', {
                              'event_category': 'chatbot',
                              'event_label': message.ctaType || 'general'
                            });
                          }
                        }}
                      >
                        <FaMobileAlt />
                        <span>{language === LANGUAGES.HINGLISH ? 'App download karein' : language === LANGUAGES.HINDI ? 'ऐप डाउनलोड करें' : language === LANGUAGES.PUNJABI ? 'ਐਪ ਡਾਉਨਲੋਡ ਕਰੋ' : 'Download App'}</span>
                      </a>
                    )}

                    {/* Advisor CTA - Show prominently for advisor type or high-intent conversations */}
                    {(message.ctaType === 'advisor' || message.ctaType === 'general' || !message.ctaType) && !hasShownAdvisorCTA && (
                      <button
                        className={`cta-button advisor-cta ${message.ctaType === 'advisor' ? 'primary-cta' : ''}`}
                        onClick={() => {
                          setShowContactForm(true);
                          setHasShownAdvisorCTA(true); // Mark as shown - will not appear again
                          conversationFlow.updateState('lead_capture');
                          // Track advisor click for analytics
                          if (window.gtag) {
                            window.gtag('event', 'advisor_click', {
                              'event_category': 'chatbot',
                              'event_label': message.ctaType || 'general'
                            });
                          }
                        }}
                      >
                        <FaUser />
                        <span>{language === LANGUAGES.HINGLISH ? 'Advisor se baat' : language === LANGUAGES.HINDI ? 'सलाहकार से बात करें' : language === LANGUAGES.PUNJABI ? 'ਸਲਾਹਕਾਰ ਨਾਲ ਗੱਲ ਕਰੋ' : 'Talk to Advisor'}</span>
                      </button>
                    )}

                    {/* Website CTA - Show for general type or when user might want more info */}
                    {(message.ctaType === 'general' || !message.ctaType || message.ctaType === 'planning') && (
                      <Link
                        to={message.ctaType === 'calculators' ? '/calculators' : message.ctaType === 'mutual_funds' ? '/mutual-funds' : message.ctaType === 'equity' ? '/equity-basket' : message.ctaType === 'loan' ? '/loan-against-securities' : '/'}
                        className="cta-button website-cta"
                        onClick={() => {
                          setIsOpen(false);
                          // Track website visit for analytics
                          if (window.gtag) {
                            window.gtag('event', 'website_visit', {
                              'event_category': 'chatbot',
                              'event_label': message.ctaType || 'general'
                            });
                          }
                        }}
                      >
                        <FaGlobe />
                        <span>{language === LANGUAGES.HINGLISH ? 'Website visit karein' : language === LANGUAGES.HINDI ? 'वेबसाइट देखें' : language === LANGUAGES.PUNJABI ? 'ਵੈਬਸਾਈਟ ਵੇਖੋ' : 'Visit Website'}</span>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="message bot-message typing">
                <div className="message-avatar">
                  <img
                    src={arthAILogo}
                    alt="ArthAI"
                    className="arthai-avatar-img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const fallback = document.createElement('div');
                      fallback.innerHTML = '<svg><use xlink:href="#robot-icon"></use></svg>';
                      e.target.parentElement?.appendChild(fallback);
                    }}
                  />
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Form - Soft, Trust-Oriented Lead Capture */}
            {showContactForm && (
              <div className="contact-form-container">
                <form className="contact-form" onSubmit={handleContactSubmit}>
                  <h4>
                    {language === LANGUAGES.HINGLISH ? 'Aapka Contact Share Karein' :
                      language === LANGUAGES.HINDI ? 'अपना संपर्क साझा करें' :
                        language === LANGUAGES.PUNJABI ? 'ਆਪਣਾ ਸੰਪਰਕ ਸਾਂਝਾ ਕਰੋ' :
                          'Share Your Contact'}
                  </h4>
                  <p className="contact-form-subtitle">
                    {language === LANGUAGES.HINGLISH ? 'Agar aap chahein, hum aapke liye ek simple personalised plan bana sakte hain. Aap apna email ya phone number share kar sakte hain — jo bhi aapko comfortable ho.' :
                      language === LANGUAGES.HINDI ? 'अगर आप चाहें, हम आपके लिए एक सरल व्यक्तिगत योजना बना सकते हैं। आप अपना ईमेल या फोन नंबर साझा कर सकते हैं — जो भी आपको सुविधाजनक हो।' :
                        language === LANGUAGES.PUNJABI ? 'ਜੇ ਤੁਸੀਂ ਚਾਹੋ, ਅਸੀਂ ਤੁਹਾਡੇ ਲਈ ਇੱਕ ਸਧਾਰਨ ਨਿੱਜੀ ਯੋਜਨਾ ਬਣਾ ਸਕਦੇ ਹਾਂ। ਤੁਸੀਂ ਆਪਣਾ ਈਮੇਲ ਜਾਂ ਫੋਨ ਨੰਬਰ ਸਾਂਝਾ ਕਰ ਸਕਦੇ ਹੋ — ਜੋ ਵੀ ਤੁਹਾਨੂੰ ਸੁਵਿਧਾਜਨਕ ਹੋਵੇ।' :
                          'If you\'d like, we can help you create a simple personalised plan. You may share your email or phone number — whichever you\'re comfortable with.'}
                  </p>
                  <div className="contact-input-group">
                    <FaEnvelope className="contact-icon" />
                    <input
                      type="email"
                      placeholder={language === LANGUAGES.HINGLISH ? 'Email address (optional)' :
                        language === LANGUAGES.HINDI ? 'ईमेल पता (वैकल्पिक)' :
                          language === LANGUAGES.PUNJABI ? 'ਈਮੇਲ ਪਤਾ (ਵਿਕਲਪਿਕ)' :
                            'Email address (optional)'}
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                      className="contact-input"
                    />
                  </div>
                  <div className="contact-input-group">
                    <span className="contact-or-divider">
                      {language === LANGUAGES.HINGLISH ? 'या' :
                        language === LANGUAGES.HINDI ? 'या' :
                          language === LANGUAGES.PUNJABI ? 'ਜਾਂ' :
                            'OR'}
                    </span>
                  </div>
                  <div className="contact-input-group">
                    <FaPhone className="contact-icon" />
                    <input
                      type="tel"
                      placeholder={language === LANGUAGES.HINGLISH ? 'Phone number (optional)' :
                        language === LANGUAGES.HINDI ? 'फोन नंबर (वैकल्पिक)' :
                          language === LANGUAGES.PUNJABI ? 'ਫੋਨ ਨੰਬਰ (ਵਿਕਲਪਿਕ)' :
                            'Phone number (optional)'}
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                      className="contact-input"
                    />
                  </div>
                  <div className="contact-form-actions">
                    <button type="submit" className="contact-submit-btn">
                      {language === LANGUAGES.HINGLISH ? 'Share Karein' :
                        language === LANGUAGES.HINDI ? 'साझा करें' :
                          language === LANGUAGES.PUNJABI ? 'ਸਾਂਝਾ ਕਰੋ' :
                            'Share'}
                    </button>
                    <button
                      type="button"
                      className="contact-skip-btn"
                      onClick={() => {
                        setShowContactForm(false);
                        setConversationStage('engaged');
                        // Send a no-pressure message
                        const noPressureMessages = {
                          [LANGUAGES.HINGLISH]: 'Koi baat nahi! Hum yahan bhi aapki madad karte rahenge. Aap kya janna chahte hain?',
                          [LANGUAGES.HINDI]: 'कोई बात नहीं! हम यहां भी आपकी मदद करते रहेंगे। आप क्या जानना चाहते हैं?',
                          [LANGUAGES.ENGLISH]: 'No pressure! We\'re here to help at your pace. What would you like to know?',
                          [LANGUAGES.PUNJABI]: 'ਕੋਈ ਗੱਲ ਨਹੀਂ! ਅਸੀਂ ਇੱਥੇ ਵੀ ਤੁਹਾਡੀ ਮਦਦ ਕਰਦੇ ਰਹਾਂਗੇ। ਤੁਸੀਂ ਕੀ ਜਾਣਨਾ ਚਾਹੁੰਦੇ ਹੋ?'
                        };
                        const noPressureMsg = {
                          id: `msg-${++messageIdCounter.current}`,
                          text: noPressureMessages[language] || noPressureMessages[LANGUAGES.HINGLISH],
                          sender: 'bot',
                          timestamp: new Date(),
                          quickReplies: ['Calculator', 'Goal planning', 'SIP samjhao']
                        };
                        setMessages(prev => [...prev, noPressureMsg]);
                      }}
                    >
                      {language === LANGUAGES.HINGLISH ? 'Abhi nahi' :
                        language === LANGUAGES.HINDI ? 'अभी नहीं' :
                          language === LANGUAGES.PUNJABI ? 'ਹੁਣ ਨਹੀਂ' :
                            'Not now'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Calculator Component */}
          {showCalculator && (
            <div className="chatbot-calculator">
              <div className="calculator-header">
                <h4>{t.financialCalculator}</h4>
                <button
                  className="calculator-close"
                  onClick={() => setShowCalculator(false)}
                  aria-label="Close calculator"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="calculator-tabs">
                <button
                  className={`calc-tab ${calculatorType === 'sip' ? 'active' : ''}`}
                  onClick={() => setCalculatorType('sip')}
                >
                  {t.sip}
                </button>
                <button
                  className={`calc-tab ${calculatorType === 'lumpsum' ? 'active' : ''}`}
                  onClick={() => setCalculatorType('lumpsum')}
                >
                  {t.lumpsum}
                </button>
                <button
                  className={`calc-tab ${calculatorType === 'stepup' ? 'active' : ''}`}
                  onClick={() => setCalculatorType('stepup')}
                >
                  {t.stepUpSIP}
                </button>
              </div>

              <div className="calculator-content">
                {calculatorType === 'sip' && (
                  <div className="calc-form">
                    <div className="calc-input-group">
                      <label>{t.monthlyInvestment}</label>
                      <input
                        type="number"
                        value={calculatorInputs.sip.amount}
                        onChange={(e) => setCalculatorInputs(prev => ({
                          ...prev,
                          sip: { ...prev.sip, amount: parseFloat(e.target.value) || 0 }
                        }))}
                        min="0"
                        step="1000"
                      />
                    </div>
                    <div className="calc-input-group">
                      <label>{t.investmentPeriod}</label>
                      <input
                        type="number"
                        value={calculatorInputs.sip.years}
                        onChange={(e) => setCalculatorInputs(prev => ({
                          ...prev,
                          sip: { ...prev.sip, years: parseFloat(e.target.value) || 0 }
                        }))}
                        min="1"
                        max="50"
                      />
                    </div>
                    <div className="calc-input-group">
                      <label>{t.expectedReturns}</label>
                      <input
                        type="number"
                        value={calculatorInputs.sip.rate}
                        onChange={(e) => setCalculatorInputs(prev => ({
                          ...prev,
                          sip: { ...prev.sip, rate: parseFloat(e.target.value) || 0 }
                        }))}
                        min="0"
                        max="30"
                        step="0.1"
                      />
                    </div>
                    {(() => {
                      const result = calculateSIP(
                        calculatorInputs.sip.amount,
                        calculatorInputs.sip.years,
                        calculatorInputs.sip.rate
                      );
                      return (
                        <div className="calc-results">
                          <div className="calc-result-item">
                            <span>{t.totalInvested}</span>
                            <strong>{formatCurrency(result.invested)}</strong>
                          </div>
                          <div className="calc-result-item">
                            <span>{t.maturityValue}</span>
                            <strong className="highlight">{formatCurrency(result.maturity)}</strong>
                          </div>
                          <div className="calc-result-item">
                            <span>{t.estimatedReturns}</span>
                            <strong className="returns">{formatCurrency(result.returns)}</strong>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {calculatorType === 'lumpsum' && (
                  <div className="calc-form">
                    <div className="calc-input-group">
                      <label>{t.investmentAmount}</label>
                      <input
                        type="number"
                        value={calculatorInputs.lumpsum.amount}
                        onChange={(e) => setCalculatorInputs(prev => ({
                          ...prev,
                          lumpsum: { ...prev.lumpsum, amount: parseFloat(e.target.value) || 0 }
                        }))}
                        min="0"
                        step="10000"
                      />
                    </div>
                    <div className="calc-input-group">
                      <label>{t.investmentPeriod}</label>
                      <input
                        type="number"
                        value={calculatorInputs.lumpsum.years}
                        onChange={(e) => setCalculatorInputs(prev => ({
                          ...prev,
                          lumpsum: { ...prev.lumpsum, years: parseFloat(e.target.value) || 0 }
                        }))}
                        min="1"
                        max="50"
                      />
                    </div>
                    <div className="calc-input-group">
                      <label>{t.expectedReturns}</label>
                      <input
                        type="number"
                        value={calculatorInputs.lumpsum.rate}
                        onChange={(e) => setCalculatorInputs(prev => ({
                          ...prev,
                          lumpsum: { ...prev.lumpsum, rate: parseFloat(e.target.value) || 0 }
                        }))}
                        min="0"
                        max="30"
                        step="0.1"
                      />
                    </div>
                    {(() => {
                      const result = calculateLumpsum(
                        calculatorInputs.lumpsum.amount,
                        calculatorInputs.lumpsum.years,
                        calculatorInputs.lumpsum.rate
                      );
                      return (
                        <div className="calc-results">
                          <div className="calc-result-item">
                            <span>{t.investedAmount}</span>
                            <strong>{formatCurrency(result.invested)}</strong>
                          </div>
                          <div className="calc-result-item">
                            <span>{t.maturityValue}</span>
                            <strong className="highlight">{formatCurrency(result.maturity)}</strong>
                          </div>
                          <div className="calc-result-item">
                            <span>{t.estimatedReturns}</span>
                            <strong className="returns">{formatCurrency(result.returns)}</strong>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {calculatorType === 'stepup' && (
                  <div className="calc-form">
                    <div className="calc-input-group">
                      <label>{t.startingSIP}</label>
                      <input
                        type="number"
                        value={calculatorInputs.stepup.amount}
                        onChange={(e) => setCalculatorInputs(prev => ({
                          ...prev,
                          stepup: { ...prev.stepup, amount: parseFloat(e.target.value) || 0 }
                        }))}
                        min="0"
                        step="1000"
                      />
                    </div>
                    <div className="calc-input-group">
                      <label>{t.investmentPeriod}</label>
                      <input
                        type="number"
                        value={calculatorInputs.stepup.years}
                        onChange={(e) => setCalculatorInputs(prev => ({
                          ...prev,
                          stepup: { ...prev.stepup, years: parseFloat(e.target.value) || 0 }
                        }))}
                        min="1"
                        max="50"
                      />
                    </div>
                    <div className="calc-input-group">
                      <label>{t.expectedReturns}</label>
                      <input
                        type="number"
                        value={calculatorInputs.stepup.rate}
                        onChange={(e) => setCalculatorInputs(prev => ({
                          ...prev,
                          stepup: { ...prev.stepup, rate: parseFloat(e.target.value) || 0 }
                        }))}
                        min="0"
                        max="30"
                        step="0.1"
                      />
                    </div>
                    <div className="calc-input-group">
                      <label>{t.annualStepUp}</label>
                      <input
                        type="number"
                        value={calculatorInputs.stepup.stepPercent}
                        onChange={(e) => setCalculatorInputs(prev => ({
                          ...prev,
                          stepup: { ...prev.stepup, stepPercent: parseFloat(e.target.value) || 0 }
                        }))}
                        min="0"
                        max="50"
                        step="1"
                      />
                    </div>
                    {(() => {
                      const result = calculateStepUpSIP(
                        calculatorInputs.stepup.amount,
                        calculatorInputs.stepup.years,
                        calculatorInputs.stepup.rate,
                        calculatorInputs.stepup.stepPercent
                      );
                      return (
                        <div className="calc-results">
                          <div className="calc-result-item">
                            <span>{t.totalInvested}</span>
                            <strong>{formatCurrency(result.invested)}</strong>
                          </div>
                          <div className="calc-result-item">
                            <span>{t.maturityValue}</span>
                            <strong className="highlight">{formatCurrency(result.maturity)}</strong>
                          </div>
                          <div className="calc-result-item">
                            <span>{t.estimatedReturns}</span>
                            <strong className="returns">{formatCurrency(result.returns)}</strong>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* Back to Menu Button - Show after calculator */}
              <div className="calculator-back-menu">
                <button
                  className="back-to-menu-btn"
                  onClick={() => {
                    setShowCalculator(false);
                    // Show default menu options again
                    const backToMenuMessage = {
                      id: `msg-${++messageIdCounter.current}`,
                      text: language === LANGUAGES.HINGLISH
                        ? 'Aap kya janna chahte hain? Neeche se choose karein:'
                        : language === LANGUAGES.HINDI
                          ? 'आप क्या जानना चाहते हैं? नीचे से चुनें:'
                          : language === LANGUAGES.PUNJABI
                            ? 'ਤੁਸੀਂ ਕੀ ਜਾਣਨਾ ਚਾਹੁੰਦੇ ਹੋ? ਹੇਠਾਂ ਤੋਂ ਚੁਣੋ:'
                            : 'What would you like to know? Choose from below:',
                      sender: 'bot',
                      timestamp: new Date(),
                      quickReplies: getDefaultQuickReplies(language, !hasShownAdvisorCTA),
                      showCTAs: true,
                      ctaType: 'general'
                    };
                    setMessages(prev => [...prev, backToMenuMessage]);
                  }}
                >
                  {language === LANGUAGES.HINGLISH ? 'Other questions'
                    : language === LANGUAGES.HINDI ? 'अन्य प्रश्न'
                      : language === LANGUAGES.PUNJABI ? 'ਹੋਰ ਸਵਾਲ'
                        : 'Other questions'}
                </button>
              </div>
            </div>
          )}

          <form className="chatbot-input-form" onSubmit={handleSendMessage}>
            {/* Voice Listening Indicator */}
            {VOICE_CONFIG.enabled && isVoiceMode && isListening && (
              <div className="voice-listening-indicator">
                <div className="pulse-animation"></div>
                <span>{language === LANGUAGES.HINGLISH || language === LANGUAGES.HINDI
                  ? "सुन रहा हूं... (Listening...)"
                  : "Listening..."}</span>
              </div>
            )}

            {/* Voice Input Button */}
            {VOICE_CONFIG.enabled && isVoiceMode && (
              <button
                type="button"
                className={`voice-input-btn ${isListening ? 'listening' : ''}`}
                onClick={handleVoiceInput}
                disabled={isListening}
                aria-label="Voice input"
                title={isListening ? 'Listening...' : 'Click to speak'}
              >
                {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
              </button>
            )}

            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={language ? (language === 'hi' ? 'निवेश, SIP, म्यूचुअल फंड के बारे में पूछें...' : language === 'pa' ? 'ਨਿਵੇਸ਼, SIP, ਮਿਊਚੁਅਲ ਫੰਡ ਬਾਰੇ ਪੁੱਛੋ...' : 'Ask me about investments, SIPs, mutual funds...') : 'Select language first...'}
              className="chatbot-input"
              disabled={isVoiceMode && isListening}
            />
            <button
              type="submit"
              className="chatbot-send"
              disabled={!inputMessage.trim() || isTyping}
              aria-label="Send message"
            >
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;

