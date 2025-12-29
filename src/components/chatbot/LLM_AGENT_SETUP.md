# LLM Agent Setup Guide

## Overview

The chatbot now uses an advanced **LLM Agent System** that makes it more intelligent and human-like. The agent maintains conversation context, understands user sentiment, and provides natural, contextual responses.

## Features

### 1. **Conversation Memory**
- Maintains full conversation history (last 20 messages)
- Tracks user profile (age, goals, experience)
- Remembers previous topics and questions

### 2. **Context Awareness**
- Understands conversation flow across multiple turns
- Detects user sentiment (confused, positive, frustrated)
- Assesses user knowledge level (beginner, intermediate, advanced)
- Tracks conversation depth and topics

### 3. **Intelligent Responses**
- Uses full conversation context for better understanding
- Provides natural, human-like responses
- Adapts tone based on user sentiment
- Offers contextual quick replies

### 4. **User Profile Building**
- Automatically extracts user information (age, goals, experience)
- Builds profile over time from conversations
- Uses profile to personalize responses

## Configuration

### Environment Variables

Add these to your `.env` file:

```env
# AI Provider (openai, anthropic, local, none)
REACT_APP_AI_PROVIDER=openai

# OpenAI Configuration
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here

# Or Anthropic Configuration
REACT_APP_ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Or Local/Backend API
REACT_APP_AI_ENDPOINT=http://localhost:3001/api/chat
```

### AI Provider Options

1. **OpenAI** (Recommended)
   - Models: `gpt-3.5-turbo` or `gpt-4`
   - Fast and reliable
   - Good for production

2. **Anthropic Claude**
   - Models: `claude-3-haiku-20240307` or `claude-3-sonnet-20240229`
   - Excellent for nuanced conversations
   - Better context understanding

3. **Local/Backend API**
   - Use your own LLM backend
   - Full control over model and responses
   - Good for privacy-sensitive deployments

4. **None** (Fallback)
   - Uses rule-based responses only
   - No API calls
   - Good for testing or when API is unavailable

## How It Works

### 1. Message Processing Flow

```
User Message
    ↓
LLM Agent (with full context)
    ↓
    ├─→ Extract user info
    ├─→ Update conversation state
    ├─→ Build LLM context
    ├─→ Generate intelligent response
    └─→ Post-process for naturalness
    ↓
Response to User
```

### 2. Context Building

The agent builds comprehensive context including:
- Recent conversation history (last 10 messages)
- User profile (age, goals, experience)
- Conversation state (topic, sentiment, depth)
- Detected intent
- User knowledge level

### 3. Response Generation

1. **Enhanced System Prompt**: Includes full conversation context
2. **LLM Call**: Sends context + user message to LLM
3. **Post-Processing**: Makes response more natural
4. **Quick Replies**: Generates contextual quick replies
5. **CTA Selection**: Chooses appropriate call-to-action

## Benefits

### For Users
- **More Natural**: Responses feel like talking to a human
- **Context Aware**: Remembers previous conversation
- **Personalized**: Adapts to user's knowledge and goals
- **Empathetic**: Understands user sentiment

### For Business
- **Better Engagement**: Users stay longer
- **Higher Conversion**: Better lead qualification
- **Reduced Support**: Handles more queries autonomously
- **Learning**: Improves over time

## Testing

### Test Scenarios

1. **Multi-turn Conversation**
   ```
   User: "What is SIP?"
   Bot: [Explains SIP]
   User: "How much should I invest?"
   Bot: [Remembers SIP context, provides personalized advice]
   ```

2. **Sentiment Detection**
   ```
   User: "I'm confused about mutual funds"
   Bot: [Detects confusion, provides extra reassurance]
   ```

3. **Profile Building**
   ```
   User: "I'm 25 years old and want to plan for retirement"
   Bot: [Extracts age and goal, personalizes response]
   ```

## Monitoring

### Conversation Analytics

The agent provides conversation summaries:

```javascript
const summary = llmAgent.getConversationSummary();
// Returns:
// {
//   messageCount: 10,
//   userProfile: { age: 25, goals: ['retirement'], ... },
//   conversationState: { currentTopic: 'SIP', sentiment: 'positive', ... },
//   topics: ['BEGINNER_EDUCATION', 'GOAL_PLANNING', ...]
// }
```

## Troubleshooting

### LLM Not Responding

1. Check API key is set correctly
2. Verify API provider is correct
3. Check network connectivity
4. Review browser console for errors

### Responses Not Natural

1. Check system prompt includes conversation context
2. Verify LLM model supports good context understanding
3. Ensure conversation history is being passed correctly

### Memory Issues

1. Conversation history is limited to last 20 messages
2. Profile data is stored in memory (not persisted)
3. For persistence, integrate with backend storage

## Future Enhancements

- [ ] Persistent user profiles (database)
- [ ] Multi-session memory
- [ ] Advanced sentiment analysis
- [ ] Intent prediction
- [ ] Proactive suggestions
- [ ] Voice integration
- [ ] Multi-modal support (images, documents)

## Support

For issues or questions, check:
- `llmAgent.js` - Main agent implementation
- `aiService.js` - AI model integration
- `ChatBot.jsx` - Component integration

