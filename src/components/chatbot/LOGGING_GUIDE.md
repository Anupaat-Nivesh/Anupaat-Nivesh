# Chatbot Logging System

## Overview
All chatbot logs are now stored in localStorage for assessment and debugging. The logging system captures:
- API requests and responses
- Agent processing steps
- Errors and warnings
- User interactions
- Response extraction details

## Accessing Logs

### In Browser Console
```javascript
// Import the logger
import { logger } from './components/chatbot/logger';

// Get all logs
const allLogs = logger.getLogs();

// Get recent errors
const errors = logger.getRecentErrors(20);

// Get logs by category
const apiLogs = logger.getLogs({ category: 'api' });
const agentLogs = logger.getLogs({ category: 'agent' });

// Get logs by level
const errorLogs = logger.getLogs({ level: 'error' });
const warnLogs = logger.getLogs({ level: 'warn' });

// Get logs since a specific time
const recentLogs = logger.getLogs({ 
  since: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
});

// Export logs as JSON
const logJSON = logger.exportLogs();
console.log(logJSON);

// Clear all logs
logger.clearLogs();
```

### In localStorage
Logs are stored under the key `chatbot_logs`:
```javascript
// View raw logs
const logs = JSON.parse(localStorage.getItem('chatbot_logs'));
console.table(logs);

// Export logs
const logsJSON = localStorage.getItem('chatbot_logs');
// Copy and save to file
```

## Log Categories

- **`api`**: OpenAI API calls, responses, errors
- **`agent`**: LLM Agent processing, intent detection, response generation
- **`ui`**: User interface interactions, message rendering
- **`error`**: All error-level logs

## Log Levels

- **`info`**: Normal operation logs
- **`warn`**: Warnings (fallbacks, missing data)
- **`error`**: Errors (API failures, empty responses)
- **`debug`**: Detailed debugging information

## Log Structure

Each log entry contains:
```javascript
{
  timestamp: "2024-01-15T10:30:00.000Z",
  level: "error",
  category: "api",
  message: "OpenAI Responses API response has empty or null content",
  data: {
    // Context-specific data
    model: "gpt-5.2",
    fullResponse: {...},
    attemptedPaths: {...}
  }
}
```

## Troubleshooting Empty Responses

When you see "empty or null content" errors, check the logs for:

1. **Response Structure**: Look for `responseStructure` in API logs
   - Check what fields the API actually returned
   - Verify `output_text`, `output`, `choices`, etc.

2. **Extraction Paths**: Look for `attemptedPaths` in error logs
   - Shows which paths were tried
   - Helps identify the correct field name

3. **Model Issues**: Check if the model name is correct
   - Verify `gpt-5.2` vs `gpt-4o-mini`
   - Check API compatibility

## Example: Debugging Empty Response

```javascript
// Get the most recent API error
const recentError = logger.getRecentErrors(1)[0];

// Check the response structure
console.log('Response structure:', recentError.data.responseStructure);

// Check attempted extraction paths
console.log('Attempted paths:', recentError.data.attemptedPaths);

// Check the full response
console.log('Full response:', recentError.data.fullResponse);
```

## Log Retention

- Maximum logs stored: **1000 entries**
- Oldest logs are automatically removed when limit is reached
- Logs persist across browser sessions (localStorage)

## Security

- API keys are automatically redacted in logs
- Large strings are truncated to 1000 characters
- Sensitive data is sanitized before storage

