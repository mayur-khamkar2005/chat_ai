import React from 'react';
import ChatScreen from './components/chatscreen';
import './index.css';

function App() {
  const handleSendMessage = async (text) => {
    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text })
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data.reply;
      }
      
      return "Error: Could not get a proper reply from the brain.";
    } catch (error) {
      console.error(error);
      return "Network Error: Could not reach the AI brain. Make sure the backend server is running.";
    }
  };

  return (
    <ChatScreen onSendMessage={handleSendMessage} />
  );
}

export default App;
