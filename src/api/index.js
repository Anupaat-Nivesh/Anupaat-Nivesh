/**
 * API Module
 * Centralized export for all API functionality
 */

export * from './config';
export * from './client';
export * from './paymentApi';
export * from './bookingApi';
export * from './mediaApi';

import { healthCheck } from './client';
import * as paymentApi from './paymentApi';
import * as bookingApi from './bookingApi';
import * as mediaApi from './mediaApi';

export default {
  healthCheck,
  payment: paymentApi,
  booking: bookingApi,
  media: mediaApi
};

