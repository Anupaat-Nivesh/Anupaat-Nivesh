# Chatbot Testing Guide

## How to Test the Chatbot

1. **Start the development server:**
   ```bash
   npm start
   ```

2. **Open the browser console** (F12 or Cmd+Option+I) to see debug logs

3. **Test the chatbot:**
   - Open the chatbot on your website
   - Try asking: "What is SIP?"
   - Check the browser console for debug messages

## Expected Console Output

When working correctly, you should see:
- 🤖 AI Service Call: { provider: 'openai', hasApiKey: true, ... }
- 📤 Calling OpenAI API: { model: 'gpt-3.5-turbo', ... }
- ✅ OpenAI Response received: { hasContent: true, ... }
- ✅ LLM Agent received response: { hasText: true, ... }

## Common Issues

### Issue 1: "AI not configured"
- **Check:** `.env` file exists and has `REACT_APP_OPENAI_API_KEY`
- **Fix:** Restart the dev server after adding `.env` file

### Issue 2: "OpenAI API error: 401"
- **Check:** API key is valid and not expired
- **Fix:** Verify the API key in OpenAI dashboard

### Issue 3: "No response from AI service"
- **Check:** Network tab in browser DevTools
- **Fix:** Check if API calls are being blocked (CORS, network issues)

### Issue 4: Chatbot shows fallback responses
- **Check:** Console logs to see why AI is not being used
- **Fix:** Check API key, network, and error messages

## Debug Checklist

- [ ] `.env` file exists in project root
- [ ] `REACT_APP_AI_PROVIDER=openai` in `.env`
- [ ] `REACT_APP_OPENAI_API_KEY=sk-...` in `.env`
- [ ] Dev server restarted after adding `.env`
- [ ] Browser console shows debug logs
- [ ] Network tab shows API calls to OpenAI
- [ ] No CORS errors in console

