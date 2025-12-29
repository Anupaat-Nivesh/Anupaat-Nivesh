// ============================================
// LOGGING SERVICE - Store all logs for assessment
// ============================================

const MAX_LOGS = 1000; // Store last 1000 log entries
const LOG_STORAGE_KEY = 'chatbot_logs';

class Logger {
  constructor() {
    this.logs = this.loadLogs();
  }

  loadLogs() {
    try {
      const stored = localStorage.getItem(LOG_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to load logs:', e);
      return [];
    }
  }

  saveLogs() {
    try {
      // Keep only last MAX_LOGS entries
      if (this.logs.length > MAX_LOGS) {
        this.logs = this.logs.slice(-MAX_LOGS);
      }
      localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(this.logs));
    } catch (e) {
      console.error('Failed to save logs:', e);
    }
  }

  log(level, category, message, data = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level, // 'info', 'warn', 'error', 'debug'
      category, // 'api', 'ui', 'agent', 'error'
      message,
      data: this.sanitizeData(data)
    };

    this.logs.push(logEntry);
    this.saveLogs();

    // Also log to console for immediate debugging
    const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
    console[consoleMethod](`[${level.toUpperCase()}] [${category}] ${message}`, data);
  }

  sanitizeData(data) {
    // Remove sensitive data and limit size
    const sanitized = { ...data };
    
    // Remove API keys
    if (sanitized.apiKey) sanitized.apiKey = '[REDACTED]';
    if (sanitized.requestBody?.apiKey) sanitized.requestBody.apiKey = '[REDACTED]';
    
    // Limit large strings
    Object.keys(sanitized).forEach(key => {
      if (typeof sanitized[key] === 'string' && sanitized[key].length > 1000) {
        sanitized[key] = sanitized[key].substring(0, 1000) + '...[truncated]';
      }
    });

    return sanitized;
  }

  info(category, message, data) {
    this.log('info', category, message, data);
  }

  warn(category, message, data) {
    this.log('warn', category, message, data);
  }

  error(category, message, data) {
    this.log('error', category, message, data);
  }

  debug(category, message, data) {
    this.log('debug', category, message, data);
  }

  getLogs(filter = {}) {
    let filtered = [...this.logs];

    if (filter.level) {
      filtered = filtered.filter(log => log.level === filter.level);
    }
    if (filter.category) {
      filtered = filtered.filter(log => log.category === filter.category);
    }
    if (filter.since) {
      const sinceDate = new Date(filter.since);
      filtered = filtered.filter(log => new Date(log.timestamp) >= sinceDate);
    }

    return filtered;
  }

  exportLogs() {
    return JSON.stringify(this.logs, null, 2);
  }

  clearLogs() {
    this.logs = [];
    this.saveLogs();
  }

  getRecentErrors(count = 10) {
    return this.logs
      .filter(log => log.level === 'error')
      .slice(-count);
  }
}

export const logger = new Logger();

