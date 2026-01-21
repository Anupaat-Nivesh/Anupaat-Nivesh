/**
 * API Module
 * Centralized export for all API functionality
 */

export * from './config';
export * from './client';
export * from './paymentApi';
export * from './bookingApi';

import { healthCheck } from './client';
import * as paymentApi from './paymentApi';
import * as bookingApi from './bookingApi';

export default {
  healthCheck,
  payment: paymentApi,
  booking: bookingApi
};

