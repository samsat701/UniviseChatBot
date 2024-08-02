// pages/index.js
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');
  const [responses, setResponses] = useState([]);
  const chatContainerRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userMessage = message;
    setResponses((prevResponses) => [...prevResponses, { role: 'user', content: userMessage }]);
    setMessage('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      setResponses((prevResponses) => [...prevResponses, { role: 'system', content: data.response }]);
    } catch (error) {
      setResponses((prevResponses) => [...prevResponses, { role: 'system', content: 'Error processing request.' }]);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [responses]);

  return (
    <div className="container">
      <div className="header">
        <h1>Univise<span className="dot">.</span></h1>
      </div>
      <div className="chat-container" ref={chatContainerRef}>
        {responses.map((response, index) => (
          <div key={index} className={`message ${response.role}`}>
            <p>{response.content}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="chat-form">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Talk to AI Counselor Beta"
          className="message-input"
        />
        <button type="submit" className="send-button">Send</button>
      </form>
      <style jsx global>{`
        body, html, #__next {
          margin: 0;
          padding: 0;
          height: 100%;
          overflow: hidden; /* Prevent scrolling on the base site */
          background-color: #000;
          color: #fff;
          font-family: Arial, sans-serif;
        }
      `}</style>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          padding: 20px;
          overflow: hidden; /* Prevent scrolling on the main container */
        }

        .header {
          text-align: center;
          margin-bottom: 20px;
        }

        .header h1 {
          margin: 0;
          font-size: 5em;  /* Adjust this line to make the text larger */
        }

        .header .dot {
          color: #ff0;
        }

        .chat-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          padding: 10px;
          background-color: #111;
          border-radius: 10px;
          margin-bottom: 20px;
        }

        .message {
          margin: 10px;
          padding: 10px;
          border-radius: 10px;
          max-width: 80%;
        }

        .user {
          align-self: flex-end;
          background-color: #007bff;
          color: #fff;
        }

        .system {
          align-self: flex-start;
          background-color: #333;
          color: #fff;
        }

        .chat-form {
          display: flex;
          align-items: center;
          padding: 10px;
          background-color: #333;
          border-radius: 25px;
          width: calc(100% - 40px); /* Ensure it fits within the container */
          max-width: 600px; /* Set a max width */
          margin: 0 auto 20px auto; /* Center the chat bar */
        }

        .message-input {
          flex: 1;
          height: 50px;
          padding: 10px;
          font-size: 1em;
          border: none;
          border-radius: 25px;
          background-color: #444;
          color: #fff;
          margin-right: 10px;
        }

        .message-input::placeholder {
          color: #aaa;
        }

        .send-button {
          padding: 10px 20px;
          font-size: 1em;
          cursor: pointer;
          border: none;
          border-radius: 25px;
          background-color: #007bff;
          color: #fff;
        }
      `}</style>
    </div>
  );
}
