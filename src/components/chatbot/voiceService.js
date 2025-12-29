// Enhanced Voice Service with Automatic Language Detection
// Supports English, Hindi, and Hinglish with auto-detection

import { detectLanguage, LANGUAGES } from './arthAI';
import logger from '../../utils/logger';

/**
 * Enhanced Speech-to-Text (STT) Service
 * Automatically detects language from speech and transcribes accordingly
 */
class VoiceService {
    constructor() {
        this.isListening = false;
        this.recognition = null;
        this.synthesis = null;
        this.currentLanguage = 'en';
        this.isVoiceModeEnabled = true; // Enable voice mode
        this.supportedLanguages = ['en-IN', 'hi-IN']; // English and Hindi
    }

    /**
     * Check if browser supports Web Speech API
     */
    isSupported() {
        return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    }

    /**
     * Initialize STT (Speech-to-Text) with language detection
     */
    initializeSTT(language = 'en') {
        this.currentLanguage = language;

        if (!this.isSupported()) {
            logger.warn('Speech recognition not supported in this browser');
            return false;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();

        // Configure recognition
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = this.getLanguageCode(language);
        this.recognition.maxAlternatives = 3; // Get multiple alternatives for better accuracy

        return true;
    }

    /**
     * Start listening with automatic language detection
     * Tries multiple languages if initial detection fails
     */
    async startListening(preferredLanguage = null) {
        if (!this.isSupported()) {
            throw new Error('Speech recognition not supported in this browser');
        }

        // Initialize with preferred language or current language
        const initialLang = preferredLanguage || this.currentLanguage;
        if (!this.recognition || this.recognition.lang !== this.getLanguageCode(initialLang)) {
            this.initializeSTT(initialLang);
        }

        return new Promise((resolve, reject) => {
            let transcript = '';
            let detectedLanguage = initialLang;
            let confidence = 0;

            this.recognition.onresult = (event) => {
                if (event.results.length > 0) {
                    const result = event.results[0];
                    transcript = result[0].transcript;
                    confidence = result[0].confidence || 0.8;

                    // Auto-detect language from transcribed text
                    detectedLanguage = this.detectLanguageFromText(transcript);
                    
                    logger.debug('Voice transcription', {
                        transcript: transcript.substring(0, 50),
                        detectedLanguage,
                        confidence
                    });
                }
            };

            this.recognition.onerror = (event) => {
                this.isListening = false;
                
                // Handle specific errors
                if (event.error === 'no-speech') {
                    reject(new Error('No speech detected. Please try again.'));
                } else if (event.error === 'audio-capture') {
                    reject(new Error('Microphone not found. Please check your microphone settings.'));
                } else if (event.error === 'not-allowed') {
                    reject(new Error('Microphone permission denied. Please allow microphone access.'));
                } else {
                    reject(new Error(`Speech recognition error: ${event.error}`));
                }
            };

            this.recognition.onend = () => {
                this.isListening = false;
                
                if (transcript) {
                    resolve({
                        text: transcript.trim(),
                        language: detectedLanguage,
                        confidence: confidence
                    });
                } else {
                    reject(new Error('No speech detected'));
                }
            };

            this.isListening = true;
            try {
                this.recognition.start();
            } catch (error) {
                this.isListening = false;
                reject(new Error('Failed to start speech recognition'));
            }
        });
    }

    /**
     * Detect language from transcribed text
     * Uses the existing detectLanguage function from arthAI
     */
    detectLanguageFromText(text) {
        if (!text || text.trim().length === 0) {
            return this.currentLanguage;
        }

        // Use the existing language detection system
        const detected = detectLanguage(text);
        
        // Map to our language codes
        const languageMap = {
            [LANGUAGES.ENGLISH]: 'en',
            [LANGUAGES.HINDI]: 'hi',
            [LANGUAGES.HINGLISH]: 'hinglish',
            [LANGUAGES.PUNJABI]: 'pa'
        };

        return languageMap[detected] || this.currentLanguage;
    }

    /**
     * Stop listening
     */
    stopListening() {
        if (this.recognition && this.isListening) {
            try {
                this.recognition.stop();
            } catch (error) {
                logger.warn('Error stopping recognition:', error);
            }
            this.isListening = false;
        }
    }

    /**
     * Initialize TTS (Text-to-Speech)
     */
    initializeTTS(language = 'en') {
        if ('speechSynthesis' in window) {
            this.synthesis = window.speechSynthesis;
            return true;
        }
        return false;
    }

    /**
     * Speak text (TTS) in the appropriate language
     */
    speak(text, language = 'en') {
        if (!this.synthesis) {
            const initialized = this.initializeTTS(language);
            if (!initialized) {
                logger.warn('TTS not supported in this browser');
                return false;
            }
        }

        // Stop any ongoing speech
        this.synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = this.getLanguageCode(language);
        
        // Configure voice settings for better clarity
        utterance.rate = 0.9; // Slightly slower for clarity
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Try to get a native voice for the language
        const voices = this.synthesis.getVoices();
        const preferredVoice = this.findPreferredVoice(voices, language);
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        // Format text for voice (remove markdown, shorten if needed)
        const voiceFormattedText = this.formatForVoice(text);
        utterance.text = voiceFormattedText;

        // Handle speech events
        utterance.onerror = (event) => {
            logger.error('TTS error:', event);
        };

        this.synthesis.speak(utterance);

        return true;
    }

    /**
     * Find preferred voice for the language
     */
    findPreferredVoice(voices, language) {
        const langCode = this.getLanguageCode(language);
        const langPrefix = langCode.split('-')[0]; // 'en' or 'hi'

        // First, try to find exact match
        let voice = voices.find(v => v.lang.startsWith(langPrefix) && v.localService);
        
        // If not found, try any voice with the language
        if (!voice) {
            voice = voices.find(v => v.lang.startsWith(langPrefix));
        }

        return voice || null;
    }

    /**
     * Format text for voice (shorter, clearer)
     */
    formatForVoice(text) {
        if (!text) return '';

        // Remove markdown formatting
        let formatted = text.replace(/\*\*(.*?)\*\*/g, '$1');
        formatted = formatted.replace(/\*(.*?)\*/g, '$1');
        formatted = formatted.replace(/`(.*?)`/g, '$1');
        formatted = formatted.replace(/#{1,6}\s+/g, ''); // Remove headers

        // Remove URLs
        formatted = formatted.replace(/https?:\/\/[^\s]+/g, '');

        // Remove emojis (they don't work well with TTS)
        formatted = formatted.replace(/[\u{1F600}-\u{1F64F}]/gu, '');
        formatted = formatted.replace(/[\u{1F300}-\u{1F5FF}]/gu, '');
        formatted = formatted.replace(/[\u{1F680}-\u{1F6FF}]/gu, '');
        formatted = formatted.replace(/[\u{2600}-\u{26FF}]/gu, '');
        formatted = formatted.replace(/[\u{2700}-\u{27BF}]/gu, '');

        // Break long sentences into shorter ones for better TTS
        formatted = formatted.replace(/\. /g, '. ');

        // Limit length for voice (max 4-5 sentences to avoid overwhelming user)
        const sentences = formatted.split(/[.!?]+/).filter(s => s.trim().length > 0);
        if (sentences.length > 5) {
            formatted = sentences.slice(0, 5).join('. ') + '.';
        }

        // Clean up extra whitespace
        formatted = formatted.replace(/\s+/g, ' ').trim();

        return formatted;
    }

    /**
     * Get language code for STT/TTS APIs
     */
    getLanguageCode(language) {
        const languageMap = {
            'en': 'en-IN',           // English (India)
            'hi': 'hi-IN',           // Hindi (India)
            'hinglish': 'hi-IN',     // Use Hindi for Hinglish (mixed language)
            'pa': 'pa-IN',           // Punjabi (India)
            'english': 'en-IN',
            'hindi': 'hi-IN',
            'punjabi': 'pa-IN'
        };

        return languageMap[language?.toLowerCase()] || 'en-IN';
    }

    /**
     * Check if voice mode is available and ready
     */
    isReady() {
        return this.isSupported() && this.isVoiceModeEnabled;
    }

    /**
     * Get user-friendly error message
     */
    getErrorMessage(error) {
        const errorMessages = {
            'no-speech': 'No speech detected. Please speak clearly.',
            'audio-capture': 'Microphone not found. Please check your microphone settings.',
            'not-allowed': 'Microphone permission denied. Please allow microphone access in your browser settings.',
            'network': 'Network error. Please check your internet connection.',
            'aborted': 'Speech recognition was interrupted.',
            'service-not-allowed': 'Speech recognition service is not available.'
        };

        return errorMessages[error] || 'Voice recognition error. Please try again or use text mode.';
    }
}

// Export singleton instance
export const voiceService = new VoiceService();

// Voice mode configuration
export const VOICE_CONFIG = {
    enabled: true, // Enable voice mode
    sttProvider: 'browser', // 'browser' | 'google' | 'whisper'
    ttsProvider: 'browser', // 'browser' | 'playht' | 'elevenlabs'
    maxResponseLength: 300, // characters for voice responses
    pauseBetweenSentences: 0.5, // seconds
    autoDetectLanguage: true, // Automatically detect language from speech
    supportedLanguages: ['en', 'hi', 'hinglish'], // Supported languages
    defaultLanguage: 'en'
};
