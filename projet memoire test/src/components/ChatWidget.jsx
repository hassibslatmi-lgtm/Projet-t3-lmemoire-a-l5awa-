import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { X, Send, User, ChevronDown } from 'lucide-react';

const FarmerBotIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Robot Face */}
    <rect x="5" y="10" width="14" height="10" rx="2" fill="none" stroke="currentColor" />
    <circle cx="9" cy="14" r="1.5" fill="currentColor" stroke="none"/>
    <circle cx="15" cy="14" r="1.5" fill="currentColor" stroke="none" />
    <path d="M9 18h6" />
    {/* Straw Hat base */}
    <path d="M2 10h20" stroke="#d97706" />
    <path d="M4 10h16M7 10l1-5h8l1 5" stroke="#d97706" fill="#fcd34d" />
  </svg>
);

const ChatWidget = ({ role = "BUYER" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `Hello! I am AgriBot, your smart assistant. How can I help you today?`,
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: inputMessage.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('agrigov_token');
      const response = await axios.post(
        'http://127.0.0.1:8000/api/chat/',
        { message: userMsg.text },
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: response.data.response,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: 'Sorry, I am having trouble connecting to the network right now.',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-80 sm:w-96 h-[500px] max-h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4 border border-green-100 transition-all duration-300 transform origin-bottom-right">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-500 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <FarmerBotIcon size={24} className="text-white" />
                </div>
                {/* Online Indicator */}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-green-600 rounded-full"></div>
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">AgriBot</h3>
                <p className="text-green-100 text-xs">AI Assistant</p>
              </div>
            </div>
            <button onClick={toggleChat} className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-full transition-colors">
              <ChevronDown size={24} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.sender === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {msg.sender === 'user' ? <User size={16} /> : <FarmerBotIcon size={16} />}
                  </div>
                  
                  {/* Bubble */}
                  <div className={`p-3 rounded-2xl text-sm shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-green-600 text-white rounded-tr-sm' 
                      : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'
                  }`}>
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-2 max-w-[85%] flex-row">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                    <FarmerBotIcon size={16} />
                  </div>
                  <div className="p-4 bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-tl-sm flex items-center gap-1 shadow-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100">
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask AgriBot something..."
                className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all text-sm"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className={`absolute right-1 w-10 h-10 flex items-center justify-center rounded-full transition-all ${
                  inputMessage.trim() && !isLoading 
                    ? 'bg-green-600 text-white hover:bg-green-700 shadow-md transform hover:scale-105' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send size={18} className={inputMessage.trim() && !isLoading ? 'ml-1' : ''} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={toggleChat}
        className={`w-14 h-14 bg-gradient-to-tr from-green-600 to-green-500 rounded-full text-white shadow-lg shadow-green-600/30 flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-xl hover:shadow-green-600/40 focus:outline-none focus:ring-4 focus:ring-green-300 ${isOpen ? 'scale-0 opacity-0 absolute' : 'scale-100 opacity-100 relative'}`}
      >
        <FarmerBotIcon size={32} />
        {/* Unread Badge (Optional) */}
        {!isOpen && (
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full"></span>
        )}
      </button>
    </div>
  );
};

export default ChatWidget;
