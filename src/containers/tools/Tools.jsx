import React, { useState } from 'react';
import './tools.css'; // Import the CSS file for Tools styling
import { Link } from 'react-router-dom';
import emailjs from 'emailjs-com';

const toolsData = [
  {
    name: 'FIDOK',
    description: 'Assess our premium tool - Financial Information and Document Organizer Kit.',
    key: 'fidok', // Link to your existing risk profile form
  },
  {
    name: 'Equity Basket Builder',
    description: 'Create a diversified equity portfolio tailored to your needs.',
    link: '/offerings/equityBasket', // Placeholder link
  },
  {
    name: 'Loan Assessment Tool',
    description: 'Evaluate loan options and manage your financial needs.',
    link: '/offerings/loanAgainstSecurities', // Placeholder link
  },
  {
    name: 'Mutual Fund Selector',
    description: 'Find the best mutual fund options for your portfolio.',
    link: '/offerings/mutualFund', // Placeholder link
  },

];

const Tools = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
  });

  // Add state variables for form inputs
const [clientName, setClientName] = useState('');
const [clientEmail, setClientEmail] = useState('');
const [mobile, setMobile] = useState('');
//const [showModal, setShowModal] = useState(false); // To control the modal visibility

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
  
    // Construct formData using state variables
    const formData = {
      name: clientName, // Use the state variable for name
      email: clientEmail, // Use the state variable for email
      mobile: mobile, // Use the state variable for mobile number
    };
  
    // Removed console.log for production security
  
    try {
      // Save form data to Google Sheets
      await saveToGoogleSheet(formData);
  
      // Notify the user about the successful submission
      alert('Thank you! The FIDOK Tool has been sent to your email.');
  
      // Clear the form and close the modal
      setClientName('');
      setClientEmail('');
      setMobile('');
      setShowModal(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an issue submitting your request. Please try again.');
    }
  };
  
  

  

  const saveToGoogleSheet = async (data) => {
    const sheetId = '1f8znptWwqldOXeY5w3_Qo9a1ky0AAAFzt_4oHJEbZq8'; // Replace with your Google Sheet ID
    const apiKey = 'AIzaSyAN6b7Ce_khLDghjzmvIoylQqGhfWwt5Ro'; // Replace with your Google API key
    const range = 'FIDOK!A1'; // Replace with your Google Sheet range
  
    const body = {
      values: [[data.name, data.mobile, data.email]],
    };
  
    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}:append?valueInputOption=USER_ENTERED&key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      );
  
      const result = await response.json();
  
      if (response.ok) {
        console.log('Data saved to Google Sheet:', result);
      } else {
        console.error('Error saving to Google Sheet:', result);
      }
    } catch (error) {
      console.error('Error occurred while saving to Google Sheet:', error);
    }
  };

  const sendEmailWithAttachment = async (data) => {
    const emailParams = {
      user_name: data.name,
      user_email: data.email,
      message: 'Please find attached the FIDOK tool.',
      attachment_url: 'URL_TO_YOUR_EXCEL_DOCUMENT', // Replace with actual file URL
    };
  
    emailjs
      .send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', emailParams, 'YOUR_USER_ID')
      .then((response) => console.log('Email sent:', response))
      .catch((error) => console.error('Error sending email:', error));
  };
  

  return (
    <div className="tools-container">
      <h1 className="tools-header">Our Tools</h1>
      <div className="tools-list">
        {toolsData.map((tool) => (
          <div key={tool.key} className="tool-item">
            <h2>{tool.name}</h2>
            <p>{tool.description}</p>
            <button onClick={() => setShowModal(true)} className="tool-link">
              Access Tool
            </button>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showModal && (
        <div className="form-modal">
          <div className="form-container">
            <h2>Access FIDOK Tool</h2>
            <form onSubmit={handleFormSubmit}>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                />
              </label>
              <label>
                Mobile Number:
                <input
                  type="tel"
                  name="mobile"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  required
                />
              </label>
              <button type="submit">Submit</button>
              <button type="button" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tools;
