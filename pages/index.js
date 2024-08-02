import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

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
      <div className="footer">
        <Link href="https://univiseuiuc.web.illinois.edu" passHref>
          <img src="/assets/home.png" alt="Home" className="home" />
        </Link>
        <Link href="https://www.linkedin.com/company/univise-ai" passHref>
          <img src="/assets/linkedin.png" alt="LinkedIn" className="icon" />
        </Link>
        <img src="/assets/loading-arrow.png" alt="Reset" className="icon" onClick={() => window.location.reload()} />
      </div>
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

        .footer {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          position: absolute;
          bottom: 20px;
          left: 20px;
        }

        .icon {
          width: 40px;
          height: 40px;
          margin-right: 10px;
          cursor: pointer;
        }

        .home {
          width: 42px;
          height: 42px;
          margin-right: 8px;
          cursor: pointer;
        }

        @media (max-width: 600px) {
          .header h1 {
            font-size: 2em;
          }

          .chat-form {
            flex-direction: column;
            align-items: stretch;
            width: 100%;
            padding: 10px;
          }

          .message-input {
            height: 40px;
            margin-bottom: 10px;
          }

          .send-button {
            width: 100%;
            padding: 10px;
          }

          .footer {
            flex-direction: column;
            position: static;
            margin-top: 20px;
          }

          .icon, .home {
            width: 30px;
            height: 30px;
            margin-right: 0;
            margin-bottom: 10px;
          }
        }
      `}</style>
    </div>
  );
}
