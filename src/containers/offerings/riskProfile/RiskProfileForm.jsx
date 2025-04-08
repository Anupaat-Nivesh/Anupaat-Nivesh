import React, { useState } from 'react';
import { gapi } from 'gapi-script'; // Import Google API client

const RiskProfileForm = () => {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [responseData, setResponseData] = useState({
    riskLevel: '',
    // Add other form fields related to your risk profile here
  });

  const submitToGoogleSheet = async (formData) => {
    const sheetId = 'YOUR_GOOGLE_SHEET_ID'; // Add your Google Sheet ID here
    const apiKey = 'YOUR_GOOGLE_API_KEY';  // Add your Google API key here
    const range = 'Form responses 1!A1'; // Adjust this range according to your sheet structure

    const values = [
      [
        formData.clientName,
        formData.clientEmail,
        formData.riskLevel,
      ],
    ];

    const body = {
      values: values,
    };

    gapi.load('client', () => {
      gapi.client.init({
        apiKey: apiKey,
        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
      }).then(() => {
        return gapi.client.sheets.spreadsheets.values.append({
          spreadsheetId: sheetId,
          range: range,
          valueInputOption: 'USER_ENTERED',
          resource: body,
        });
      }).then((response) => {
        console.log('Data submitted successfully:', response);
      }).catch((error) => {
        console.error('Error submitting to Google Sheets:', error);
      });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      clientName,
      clientEmail,
      ...responseData,
    };

    try {
      await submitToGoogleSheet(formData); // Send to Google Sheet
      alert('Form Submitted Successfully!');
    } catch (error) {
      console.error('Error submitting form: ', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} required />
      </label>
      <label>
        Email:
        <input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} required />
      </label>
      {/* Add other fields here */}
      <label>
        Risk Level:
        <input
          type="text"
          value={responseData.riskLevel}
          onChange={(e) => setResponseData({ ...responseData, riskLevel: e.target.value })}
          required
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default RiskProfileForm;
