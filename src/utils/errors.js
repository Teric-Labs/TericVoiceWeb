/**
 * Unified error message mapper.
 * Maps API/network errors to user-friendly messages.
 */

const API_ERROR_MESSAGES = {
  400: 'Invalid request. Please check your input and try again.',
  401: 'Your session has expired. Please log in again.',
  403: 'You have reached your usage limit. Please upgrade your plan to continue.',
  404: 'The requested resource was not found.',
  408: 'The request timed out. Please check your connection and try again.',
  413: 'The file is too large. Please upload a smaller file.',
  422: 'The file format is not supported.',
  429: 'Too many requests. Please wait a moment and try again.',
  500: 'A server error occurred. Please try again in a few moments.',
  502: 'The service is temporarily unavailable. Please try again shortly.',
  503: 'The service is currently down for maintenance. Please try again later.',
};

const NETWORK_MESSAGES = {
  'Network Error': 'No internet connection. Please check your network and try again.',
  'timeout': 'The request took too long. This may be a large file — please try again.',
  'ECONNABORTED': 'Connection timed out. Please try again.',
};

/**
 * Returns a user-friendly error message from any error object.
 * @param {Error|object} error
 * @param {string} [fallback] — fallback message
 * @returns {{ message: string, shouldUpgrade: boolean, isNetwork: boolean }}
 */
export function parseError(error, fallback = 'Something went wrong. Please try again.') {
  const status = error?.response?.status;
  const serverMsg = error?.response?.data?.message || error?.response?.data?.detail;
  const isUpgrade = status === 403 ||
    (serverMsg && (serverMsg.includes('limit') || serverMsg.includes('subscription')));

  // Network errors
  if (!error.response) {
    for (const [key, msg] of Object.entries(NETWORK_MESSAGES)) {
      if (error.message?.includes(key) || error.code?.includes(key)) {
        return { message: msg, shouldUpgrade: false, isNetwork: true };
      }
    }
  }

  // HTTP status errors
  if (status && API_ERROR_MESSAGES[status]) {
    return {
      message: API_ERROR_MESSAGES[status],
      shouldUpgrade: isUpgrade,
      isNetwork: false,
    };
  }

  // Server-provided message (sanitised)
  if (serverMsg && serverMsg.length < 200) {
    return { message: serverMsg, shouldUpgrade: isUpgrade, isNetwork: false };
  }

  // Client-provided message
  if (error?.message && error.message.length < 200 && !error.message.includes('Error:')) {
    return { message: error.message, shouldUpgrade: false, isNetwork: false };
  }

  return { message: fallback, shouldUpgrade: false, isNetwork: false };
}
