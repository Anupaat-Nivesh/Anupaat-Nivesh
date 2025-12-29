# Voice Features Guide

## Overview
The chatbot now supports voice input with automatic language detection. Users can speak in English, Hindi, or Hinglish, and the system will automatically detect the language, transcribe the speech, and respond in the appropriate language.

## Features

### 1. Automatic Language Detection
- **Speech-to-Text**: Transcribes speech to text using Web Speech API
- **Language Detection**: Automatically detects language from transcribed text using pattern matching
- **Multi-language Support**: Supports English, Hindi, and Hinglish
- **Language Switching**: Automatically switches chatbot language based on detected speech language

### 2. Voice Input Flow
1. User clicks microphone button to enable voice mode
2. User clicks voice input button to start recording
3. System listens and transcribes speech
4. Language is automatically detected from transcribed text
5. Chatbot language is updated to match detected language
6. Transcribed text is sent as message
7. Bot responds in the detected language

### 3. Visual Feedback
- **Listening Indicator**: Shows "Listening..." or "सुन रहा हूं..." when recording
- **Pulse Animation**: Visual indicator that microphone is active
- **Language Detection Message**: Shows confirmation when language is detected
- **Voice Mode Toggle**: Button to enable/disable voice mode

## Technical Implementation

### Voice Service (`voiceService.js`)
- Uses Web Speech API for speech recognition
- Supports multiple language codes (en-IN, hi-IN)
- Automatic language detection from transcribed text
- Error handling for microphone permissions and network issues
- Text-to-Speech support for voice responses

### Language Detection
- Uses existing `detectLanguage()` function from `arthAI.js`
- Pattern matching for Hindi, English, and Hinglish
- Confidence scoring for language detection
- Automatic language switching when confidence > 0.7

### Integration
- Seamlessly integrated with existing chatbot flow
- Works with all existing features (SIP calculator, goal planning, etc.)
- Maintains conversation context across language switches
- Production-safe logging (no sensitive data in logs)

## Usage

### For Users

1. **Enable Voice Mode**:
   - Click the microphone icon in the chatbot header
   - Voice mode will be enabled

2. **Start Voice Input**:
   - Click the microphone button in the input area
   - Speak clearly in your preferred language (English, Hindi, or Hinglish)
   - Wait for transcription to complete

3. **Language Detection**:
   - System automatically detects your language
   - Chatbot switches to your language
   - You'll see a confirmation message

4. **Continue Conversation**:
   - Chatbot responds in your detected language
   - You can continue speaking or switch to text input
   - Language persists throughout the conversation

### Browser Requirements

- **Chrome/Edge**: Full support (Web Speech API)
- **Safari**: Limited support (may require additional setup)
- **Firefox**: Limited support
- **Mobile**: Works on Chrome mobile, limited on Safari mobile

### Microphone Permissions

- Browser will request microphone permission on first use
- Permission must be granted for voice input to work
- If denied, user will see a helpful error message

## Error Handling

### Common Errors

1. **"No speech detected"**
   - User didn't speak or spoke too quietly
   - Solution: Speak clearly and louder

2. **"Microphone not found"**
   - No microphone connected or detected
   - Solution: Check microphone connection

3. **"Microphone permission denied"**
   - Browser blocked microphone access
   - Solution: Allow microphone in browser settings

4. **"Speech recognition not supported"**
   - Browser doesn't support Web Speech API
   - Solution: Use a supported browser (Chrome/Edge)

## Configuration

### Voice Service Configuration (`VOICE_CONFIG`)

```javascript
export const VOICE_CONFIG = {
    enabled: true,                    // Enable/disable voice mode
    sttProvider: 'browser',           // Speech-to-Text provider
    ttsProvider: 'browser',           // Text-to-Speech provider
    maxResponseLength: 300,            // Max characters for voice responses
    pauseBetweenSentences: 0.5,       // Pause between sentences (seconds)
    autoDetectLanguage: true,         // Auto-detect language from speech
    supportedLanguages: ['en', 'hi', 'hinglish'], // Supported languages
    defaultLanguage: 'en'             // Default language
};
```

## Language Detection Logic

1. **Speech Recognition**: Uses Web Speech API with language code (en-IN or hi-IN)
2. **Transcription**: Gets transcribed text from speech
3. **Language Detection**: Uses pattern matching to detect language:
   - Hindi patterns: Devanagari script, Hindi words
   - English patterns: English words, no Hindi/Punjabi
   - Hinglish patterns: Mix of Hindi and English words
4. **Confidence Check**: Only switches language if confidence > 0.7
5. **Language Update**: Updates chatbot language state

## Future Enhancements

1. **Offline Support**: Use local speech recognition models
2. **More Languages**: Add Punjabi and other regional languages
3. **Voice Responses**: Text-to-Speech for bot responses
4. **Continuous Listening**: Keep listening for multiple commands
5. **Voice Commands**: Special voice commands for quick actions
6. **Noise Cancellation**: Better handling of background noise
7. **Accent Recognition**: Better support for regional accents

## Testing

### Test Cases

1. **English Speech**:
   - Speak: "What is SIP?"
   - Expected: Detects English, responds in English

2. **Hindi Speech**:
   - Speak: "SIP क्या है?"
   - Expected: Detects Hindi, responds in Hindi

3. **Hinglish Speech**:
   - Speak: "SIP kya hai?"
   - Expected: Detects Hinglish, responds in Hinglish

4. **Language Switching**:
   - Start in English, switch to Hindi mid-conversation
   - Expected: Language updates, conversation continues

5. **Error Handling**:
   - Deny microphone permission
   - Expected: Clear error message with instructions

## Security & Privacy

- **No Data Storage**: Voice recordings are not stored
- **Client-Side Processing**: Speech recognition happens in browser
- **Privacy**: No voice data sent to external servers (using Web Speech API)
- **Permissions**: Requires explicit user permission for microphone

## Troubleshooting

### Voice Not Working

1. Check browser compatibility (Chrome/Edge recommended)
2. Grant microphone permissions
3. Check microphone is connected and working
4. Try speaking louder and clearer
5. Check internet connection (Web Speech API may require connection)

### Language Not Detected Correctly

1. Speak clearly in one language
2. Avoid mixing languages too much
3. Use common words/phrases
4. System will learn from context over time

### Transcription Errors

1. Speak slowly and clearly
2. Reduce background noise
3. Use a good quality microphone
4. Check microphone volume settings

## Support

For issues or questions:
- Check browser console for error messages
- Verify microphone permissions
- Test with different browsers
- Check network connection

