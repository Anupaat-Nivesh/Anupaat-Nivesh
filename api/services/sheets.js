import { google } from 'googleapis';

/**
 * Append row to Google Sheet
 * @param {Object} data - Payment data
 */
export async function appendPaymentToSheet(data) {
  try {
    if (!process.env.GOOGLE_SHEETS_CREDENTIALS || !process.env.GOOGLE_SHEET_ID) {
      console.warn('⚠️ Google Sheets credentials not found. Skipping sheet update.');
      return;
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
      status
    } = data;

    const row = [
      new Date().toISOString(), // Timestamp
      paymentId,
      orderId,
      amount || 'N/A',
      currency || 'INR',
      status || 'Success',
      userData ? `${userData.firstName} ${userData.lastName}` : 'N/A', // Name
      userData?.email || 'N/A',
      userData?.phone || 'N/A',
      bookingData?.eventName || 'Consulting Session',
      bookingData?.startTime || 'N/A'
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Sheet1!A:K', // Adjust sheet name if needed
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [row],
      },
    });

    console.log('✅ Payment logged to Google Sheet');
  } catch (error) {
    console.error('❌ Error logging to Google Sheet:', error);
    // Don't throw error to prevent failing the payment response
  }
}
