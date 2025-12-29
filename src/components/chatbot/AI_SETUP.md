# ArthAI - AI Model Setup Guide

## 🚀 Quick Setup

### Option 1: OpenAI (Recommended for Best Results)

1. Get your OpenAI API key from https://platform.openai.com/api-keys
2. Create a `.env` file in the project root:
```env
REACT_APP_AI_PROVIDER=openai
REACT_APP_OPENAI_API_KEY=sk-your-api-key-here
```

3. Restart your development server

### Option 2: Anthropic Claude

1. Get your Anthropic API key from https://console.anthropic.com/
2. Create a `.env` file:
```env
REACT_APP_AI_PROVIDER=anthropic
REACT_APP_ANTHROPIC_API_KEY=sk-ant-your-api-key-here
```

3. Restart your development server

### Option 3: Local/Backend API

1. Set up your backend API endpoint
2. Create a `.env` file:
```env
REACT_APP_AI_PROVIDER=local
REACT_APP_AI_ENDPOINT=http://localhost:3001/api/chat
```

3. Your backend should accept POST requests with:
```json
{
  "message": "user question",
  "language": "hinglish",
  "context": {...},
  "intent": "beginner_education"
}
```

And return:
```json
{
  "response": "AI generated response",
  "text": "AI generated response"
}
```

### Option 4: Rule-Based Only (No AI)

If you don't want to use an AI model, the chatbot will use intelligent rule-based responses:

```env
REACT_APP_AI_PROVIDER=none
```

## 🧠 How It Works

### Education-First Approach

The chatbot now:
1. **Assesses** the user's question
2. **Determines** if they need education first
3. **Provides** education before calculators
4. **Learns** from interactions to improve

### Learning System

The chatbot automatically:
- Saves conversation patterns
- Analyzes user behavior
- Improves responses over time
- Stores data in browser localStorage

### Knowledge Levels

The system detects three knowledge levels:
- **Beginner**: Asks "what is", "how does" questions
- **Intermediate**: Has some knowledge, asks specific questions
- **Advanced**: Ready for calculators and detailed planning

## 📊 Features

### ✅ Smart Question Assessment
- Detects if user needs education before calculator
- Provides context-aware responses
- Adapts to user's knowledge level

### ✅ AI Model Integration
- Supports OpenAI GPT-3.5/GPT-4
- Supports Anthropic Claude
- Supports custom backend APIs
- Falls back to rule-based if AI unavailable

### ✅ Learning & Memory
- Tracks conversation patterns
- Remembers user preferences
- Improves over time
- No external database needed (localStorage)

## 🔒 Security Notes

- **Never commit** `.env` file to git
- API keys are client-side (consider backend proxy for production)
- For production, use environment variables on your hosting platform

## 🎯 Best Practices

1. **Start with OpenAI** for best results
2. **Monitor API usage** to control costs
3. **Use GPT-3.5-turbo** for cost efficiency (or GPT-4 for better quality)
4. **Set up backend proxy** for production to hide API keys

## 📝 Example .env File

```env
# AI Provider: openai, anthropic, local, or none
REACT_APP_AI_PROVIDER=openai

# OpenAI Configuration
REACT_APP_OPENAI_API_KEY=sk-your-key-here

# Anthropic Configuration (if using Anthropic)
# REACT_APP_ANTHROPIC_API_KEY=sk-ant-your-key-here

# Local API Configuration (if using custom backend)
# REACT_APP_AI_ENDPOINT=http://localhost:3001/api/chat
```

## 🐛 Troubleshooting

### AI not responding?
- Check API key is correct
- Check `.env` file is in project root
- Restart development server after adding `.env`
- Check browser console for errors

### Fallback to rule-based?
- This is normal if AI is unavailable
- Rule-based responses are still intelligent
- Check API quota/limits

### Want to disable AI?
- Set `REACT_APP_AI_PROVIDER=none`
- Chatbot will use rule-based responses only

