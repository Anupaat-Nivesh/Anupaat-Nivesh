import { google } from 'googleapis';

/**
 * Append row to Google Sheet
 * @param {Object} data - Payment data
 */
export async function appendPaymentToSheet(data) {
  try {
    console.log('📊 Google Sheets logging attempt:', {
      hasCredentials: !!process.env.GOOGLE_SHEETS_CREDENTIALS,
      hasSheetId: !!process.env.GOOGLE_SHEET_ID,
      sheetId: process.env.GOOGLE_SHEET_ID ? 'Set' : 'Missing'
    });
    
    if (!process.env.GOOGLE_SHEETS_CREDENTIALS || !process.env.GOOGLE_SHEET_ID) {
      console.error('❌ Google Sheets credentials not found. Missing:', {
        credentials: !process.env.GOOGLE_SHEETS_CREDENTIALS ? 'GOOGLE_SHEETS_CREDENTIALS' : '',
        sheetId: !process.env.GOOGLE_SHEET_ID ? 'GOOGLE_SHEET_ID' : ''
      });
      throw new Error('Google Sheets credentials not configured. Please set GOOGLE_SHEETS_CREDENTIALS and GOOGLE_SHEET_ID in Vercel environment variables.');
    }

    const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    const {
      paymentId,
      orderId,
      amount,
      currency,
      userData,
      bookingData,
      status,
      bookingReference,
      source
    } = data;

    // Enhanced row with all required fields:
    // Timestamp | Payment ID | Order ID | Amount | Currency | Name | Email | Phone | Booking Reference | Status | Notes | Source
    const row = [
      new Date().toISOString(), // Timestamp
      paymentId || 'N/A',
      orderId || 'N/A',
      amount || 'N/A',
      currency || 'INR',
      userData ? `${userData.firstName || ''} ${userData.lastName || ''}`.trim() : 'N/A', // Name
      userData?.email || 'N/A',
      userData?.phone || 'N/A',
      bookingReference || bookingData?.bookingReference || 'N/A', // Booking Reference
      status || 'Paid',
      bookingData?.eventName || 'Consulting Session', // Notes/Event Name
      source || userData?.source || bookingData?.source || 'N/A' // Source (mobile-consulting-funnel, etc.)
    ];

    console.log('📝 Appending row to sheet:', {
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Payments!A:K',
      rowData: row
    });

    const result = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Payments!A:L', // Updated to include Source column (L)
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [row],
      },
    });

    console.log('✅ Payment logged to Google Sheet successfully:', {
      updatedCells: result.data.updates?.updatedCells,
      updatedRange: result.data.updates?.updatedRange
    });
  } catch (error) {
    console.error('❌ Error logging to Google Sheet:', {
      message: error.message,
      code: error.code,
      details: error.response?.data || error.stack
    });
    // Re-throw to allow caller to handle
    throw error;
  }
}
