// src/components/ChatbotPage.js
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useNavigate } from 'react-router-dom';

const API_KEY = 'AIzaSyDjfxGgrb8gJcMNPVGHDvc27BIuS17nZhs'; // Replace with your full API key or use process.env.REACT_APP_GEMINI_API_KEY

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hello Dear Customer! I\'m your AI assistant powered by BrightBuy. Ask me anything of any products🤠' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const genAI = useRef(null);

  useEffect(() => {
    console.log('ChatbotPage: Mounting component');
    if (!localStorage.getItem('token')) {
      console.log('ChatbotPage: No token found, redirecting to /');
      navigate('/');
      return;
    }

    console.log('ChatbotPage: Attempting to initialize Gemini API');
    try {
      genAI.current = new GoogleGenerativeAI(API_KEY);
      setIsInitialized(true);
      console.log('ChatbotPage: Gemini API initialized successfully');
    } catch (err) {
      console.error('ChatbotPage: Gemini initialization error:', err);
      setError('Failed to initialize AI model. Please check your API key or try again later.');
      setIsInitialized(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (messages.length) {
      console.log('ChatbotPage: Messages updated, scrolling to bottom');
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !genAI.current || !isInitialized) {
      console.log('ChatbotPage: Cannot send message', {
        hasInput: !!input.trim(),
        hasGenAI: !!genAI.current,
        isInitialized
      });
      setError('Chatbot not initialized or input is empty');
      return;
    }

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError('');
    console.log('ChatbotPage: Sending message:', input);

    try {
      const model = genAI.current.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const result = await model.generateContent(input);
      const aiResponse = await result.response.text();
      console.log('ChatbotPage: AI response received:', aiResponse);
      setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
    } catch (err) {
      console.error('ChatbotPage: AI response error:', err);
      setError(`Failed to get AI response: ${err.message}`);
      setMessages(prev => [...prev, { role: 'ai', content: 'Error: Could not generate response.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      console.log('ChatbotPage: Enter key pressed, triggering send');
      handleSend();
    }
  };

  console.log('ChatbotPage: Rendering', {
    messages: messages.length,
    error,
    isLoading,
    isInitialized
  });

  if (!isInitialized && !error) {
    return (
      <div className="chatbot-container">
        <div className="chatbot-header">
          <h2>AI Chatbot (Gemini)</h2>
          <button onClick={() => navigate('/home')}>Back to Home</button>
        </div>
        <div className="chatbot-messages">Loading chatbot...</div>
      </div>
    );
  }

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h2>AI Chatbot (Gemini)</h2>
        <button onClick={() => navigate('/home')}>Back to Home</button>
      </div>
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <div className="message-content">{msg.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="message ai">
            <div className="loading">Typing...</div>
          </div>
        )}
        {error && (
          <div className="message ai error">{error}</div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chatbot-input">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
          rows={1}
          disabled={isLoading || !isInitialized}
        />
        <button onClick={handleSend} disabled={isLoading || !input.trim() || !isInitialized}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatbotPage;