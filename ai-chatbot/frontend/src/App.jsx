import './App.css'
import ChatScreen from './components/chatscreen';

function App() {
  const handleSendMessage = async (message) => {
    const response = await fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    return data.reply;
  };
  
  return (
    <ChatScreen onSendMessage={handleSendMessage} />
  )
}

export default App
