"use client";
import React, { useState } from 'react';
import { Message } from '../types';
import { sendMessage } from '../services';
import ChatBubble from '@/features/chatbot/components/chat-bubble';
import ChatInput from '@/components/ui/chat-input';
import {  X, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ChatSpeedDial: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Welcome to vestige assistant! How may I help you today?' },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (message: string) => {
    // Add user message to chat
    const userMessage: Message = { role: 'user', content: message };
    setMessages((prev) => [...prev, userMessage]);
    
    setIsLoading(true);
    
    try {
      // Send message to API
      const response = await sendMessage(message);
      const assistantMessage: Message = { 
        role: 'assistant', 
        content: response.response.content 
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      // Handle error
      console.error('Failed to get response:', error);
      
      const errorMessage: Message = { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again later.' 
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-cinzel">
      {isOpen ? (
        <div className="flex flex-col bg-[url('/background.jpg')] bg-cover bg-center rounded-none shadow-xl w-[300px] sm:w-[450px] h-[500px] overflow-hidden border-2 border-[#600]">
          {/* Newspaper header */}
          <div className="bg-[rgba(0,0,0,0.8)] text-white p-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Newspaper className="h-5 w-5 text-red-700" />
                <h3 className="font-cinzel font-bold text-xl">THE VES-AI</h3>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleChat} 
                className="h-8 w-8 text-white hover:bg-[rgba(190,0,0,0.4)] rounded-sm"
              >
                <X size={18} />
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-1 italic">Vol. 1 • Interactive Assistant Edition</p>
          
            
          </div>
          
          {/* Chat content in newspaper style */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col space-y-4 bg-[rgba(255,255,255,0.92)]">
            {messages.map((message, index) => (
              <ChatBubble key={index} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-2">
                <div className="bg-[#f8f4e8] border border-gray-300 rounded-none p-3 shadow-sm max-w-[85%]">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-[#600] animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-[#600] animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 rounded-full bg-[#600] animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Input area with newspaper style border */}
          <div className="border-t-2 border-[#600] bg-[#f8f4e8]">
            <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
          </div>
        </div>
      ) : (
        <Button 
          onClick={toggleChat}
          variant="default"
          size="icon"
          className="bg-[#600] hover:bg-[#800] text-white rounded-none h-12 w-12 shadow-lg transition-all duration-300 border border-[#800]"
        >
          <Newspaper size={24} />
        </Button>
      )}
    </div>
  );
};

export default ChatSpeedDial; 