// Voice Mode Service (STT/TTS)
// Future-ready voice interface for the chatbot

/**
 * Speech-to-Text (STT) Service
 * Supports multiple providers: Google Speech API, Whisper, etc.
 */

class VoiceService {
    constructor() {
        this.isListening = false;
        this.recognition = null;
        this.synthesis = null;
        this.currentLanguage = 'en';
        this.isVoiceModeEnabled = false;
    }

    /**
     * Initialize STT (Speech-to-Text)
     */
    initializeSTT(language = 'en') {
        this.currentLanguage = language;

        // Check if browser supports Web Speech API
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();

            // Configure recognition
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = this.getLanguageCode(language);

            // Event handlers
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                return transcript;
            };

            this.recognition.onerror = (event) => {
                console.error('STT Error:', event.error);
                return null;
            };

            return true;
        }

        return false; // Browser doesn't support STT
    }

    /**
     * Start listening for voice input
     */
    async startListening() {
        if (!this.recognition) {
            const initialized = this.initializeSTT(this.currentLanguage);
            if (!initialized) {
                throw new Error('Speech recognition not supported in this browser');
            }
        }

        return new Promise((resolve, reject) => {
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                resolve(transcript);
            };

            this.recognition.onerror = (event) => {
                reject(new Error(`Speech recognition error: ${event.error}`));
            };

            this.recognition.onend = () => {
                this.isListening = false;
            };

            this.isListening = true;
            this.recognition.start();
        });
    }

    /**
     * Stop listening
     */
    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
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
     * Speak text (TTS)
     */
    speak(text, language = 'en') {
        if (!this.synthesis) {
            const initialized = this.initializeTTS(language);
            if (!initialized) {
                console.warn('TTS not supported in this browser');
                return false;
            }
        }

        // Stop any ongoing speech
        this.synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = this.getLanguageCode(language);
        utterance.rate = 0.9; // Slightly slower for clarity
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Voice-friendly formatting: shorter sentences, natural pauses
        const voiceFormattedText = this.formatForVoice(text);
        utterance.text = voiceFormattedText;

        this.synthesis.speak(utterance);

        return true;
    }

    /**
     * Format text for voice (shorter, clearer)
     */
    formatForVoice(text) {
        // Remove markdown
        let formatted = text.replace(/\*\*(.*?)\*\*/g, '$1');
        formatted = formatted.replace(/\*(.*?)\*/g, '$1');

        // Break long sentences into shorter ones
        formatted = formatted.replace(/\. /g, '. ');

        // Remove complex numbers/calculations (voice safety)
        formatted = formatted.replace(/\d+[,\d]*\s*(lakh|cr|crore|rupee|₹)/gi, 'amount');

        // Limit length for voice (max 3-4 sentences)
        const sentences = formatted.split(/[.!?]+/).filter(s => s.trim().length > 0);
        if (sentences.length > 4) {
            formatted = sentences.slice(0, 4).join('. ') + '.';
        }

        return formatted;
    }

    /**
     * Get language code for STT/TTS
     */
    getLanguageCode(language) {
        const languageMap = {
            'en': 'en-IN',
            'hi': 'hi-IN',
            'hinglish': 'hi-IN', // Use Hindi for Hinglish
            'pa': 'pa-IN'
        };

        return languageMap[language] || 'en-IN';
    }

    /**
     * Check STT confidence and suggest fallback if low
     */
    checkSTTConfidence(transcript, confidence) {
        if (confidence < 0.7) {
            return {
                lowConfidence: true,
                message: "I may not have heard that clearly — shall we switch to text mode?"
            };
        }
        return { lowConfidence: false };
    }
}

// Export singleton instance
export const voiceService = new VoiceService();

// Voice mode configuration
export const VOICE_CONFIG = {
    enabled: false, // Enable when ready
    sttProvider: 'browser', // 'browser' | 'google' | 'whisper'
    ttsProvider: 'browser', // 'browser' | 'playht' | 'elevenlabs'
    maxResponseLength: 200, // characters for voice responses
    pauseBetweenSentences: 0.5, // seconds
    language: 'en'
};

