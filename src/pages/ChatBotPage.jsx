import React from 'react';
import ChatBot from '../components/chatbot/ChatBot';
import './ChatBotPage.css';

const ChatBotPage = () => {
  return (
    <div className="chatbot-page">
      <ChatBot standalone={true} />
    </div>
  );
};

export default ChatBotPage;

