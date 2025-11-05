import React, { useState, useRef, useEffect } from 'react';
import { getChatResponse } from '../services/geminiService';
import type { ChatMessage } from '../types';
import Loader from './Loader';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';
import { PaperAirplaneIcon } from './icons/PaperAirplaneIcon';
import { XMarkIcon } from './icons/XMarkIcon';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 'initial',
        text: "Hello! I'm your marketing assistant. Ask me anything about your campaign or marketing in general!",
        sender: 'bot'
      }]);
    }
  }, [isOpen, messages.length]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const botResponseText = await getChatResponse(inputValue);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        sender: 'bot',
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting. Please try again later.",
        sender: 'bot',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={`fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-30 transition-transform duration-300 ${isOpen ? 'scale-0' : 'scale-100'}`}>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-full p-4 shadow-lg hover:scale-110 transition-transform"
          aria-label="Open chat"
        >
          <ChatBubbleIcon />
        </button>
      </div>
      
      <div className={`fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-40 w-[calc(100vw-2.5rem)] max-w-sm h-[70vh] max-h-[500px] bg-gray-800 rounded-xl shadow-2xl border border-gray-700 flex flex-col transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Marketing Assistant</h3>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white" aria-label="Close chat">
            <XMarkIcon />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-sm rounded-2xl px-4 py-2 ${msg.sender === 'user' ? 'bg-purple-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
                 <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="bg-gray-700 rounded-2xl rounded-bl-none px-4 py-3">
                 <Loader size="sm" />
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
          <div className="flex items-center bg-gray-900 rounded-full border border-gray-600 focus-within:ring-2 focus-within:ring-cyan-400">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a question..."
              className="w-full bg-transparent px-4 py-2 text-gray-200 focus:outline-none"
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !inputValue.trim()} className="p-2 text-cyan-400 disabled:text-gray-500 disabled:cursor-not-allowed m-1">
              <PaperAirplaneIcon />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ChatBot;
