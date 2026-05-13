/**
 * API Client
 * Centralized HTTP client for backend API communication
 * Handles request/response, error handling, and authentication
 */

import { apiConfig, buildApiUrl, isBackendAvailable } from './config';

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Make API request
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Request options
 * @param {string} options.method - HTTP method (GET, POST, PUT, DELETE)
 * @param {Object} options.body - Request body
 * @param {Object} options.params - URL parameters
 * @param {Object} options.headers - Additional headers
 * @returns {Promise<Object>} Response data
 */
export const apiRequest = async (endpoint, options = {}) => {
  const {
    method = 'GET',
    body = null,
    params = {},
    headers = {}
  } = options;

  // Check if backend is available
  if (!isBackendAvailable()) {
    throw new ApiError(
      'Backend API is not configured. Set REACT_APP_API_BASE_URL in .env',
      503
    );
  }

  // Build full URL
  const url = buildApiUrl(endpoint, params);

  // Prepare request options
  const requestOptions = {
    method,
    credentials: 'include',
    headers: {
      ...apiConfig.headers,
      ...headers
    }
  };

  // Add timeout support (AbortSignal.timeout may not be available in all browsers)
  let timeoutId;
  if (typeof AbortSignal !== 'undefined' && AbortSignal.timeout) {
    requestOptions.signal = AbortSignal.timeout(apiConfig.timeout);
  } else {
    // Fallback: Create AbortController for timeout
    const controller = new AbortController();
    timeoutId = setTimeout(() => controller.abort(), apiConfig.timeout);
    requestOptions.signal = controller.signal;
  }

  // Add body for POST/PUT requests
  if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    if (isFormData) {
      requestOptions.body = body;
      if (requestOptions.headers && requestOptions.headers['Content-Type']) {
        delete requestOptions.headers['Content-Type'];
      }
    } else {
      requestOptions.body = JSON.stringify(body);
    }
  }

  try {
    const response = await fetch(url, requestOptions);

    // Parse response
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Handle error responses
    if (!response.ok) {
      throw new ApiError(
        data.message || data.error || `API request failed: ${response.statusText}`,
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    // Clear timeout if it was set
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Handle network errors
    if (error.name === 'AbortError') {
      throw new ApiError('Request timeout. Please try again.', 408);
    }
    
    if (error instanceof ApiError) {
      throw error;
    }

    // Network or other errors
    throw new ApiError(
      error.message || 'Network error. Please check your connection.',
      0,
      error
    );
  }
};

/**
 * GET request
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Request options
 * @returns {Promise<Object>} Response data
 */
export const apiGet = (endpoint, options = {}) => {
  return apiRequest(endpoint, { ...options, method: 'GET' });
};

/**
 * POST request
 * @param {string} endpoint - API endpoint
 * @param {Object} body - Request body
 * @param {Object} options - Additional request options
 * @returns {Promise<Object>} Response data
 */
export const apiPost = (endpoint, body, options = {}) => {
  return apiRequest(endpoint, { ...options, method: 'POST', body });
};

/**
 * PUT request
 * @param {string} endpoint - API endpoint
 * @param {Object} body - Request body
 * @param {Object} options - Additional request options
 * @returns {Promise<Object>} Response data
 */
export const apiPut = (endpoint, body, options = {}) => {
  return apiRequest(endpoint, { ...options, method: 'PUT', body });
};

/**
 * DELETE request
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Request options
 * @returns {Promise<Object>} Response data
 */
export const apiDelete = (endpoint, options = {}) => {
  return apiRequest(endpoint, { ...options, method: 'DELETE' });
};

/**
 * Health check - Test backend connectivity
 * @returns {Promise<Object>} Health check response
 */
export const healthCheck = async () => {
  try {
    return await apiGet('/api/health');
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message
    };
  }
};

export default {
  request: apiRequest,
  get: apiGet,
  post: apiPost,
  put: apiPut,
  delete: apiDelete,
  healthCheck
};

