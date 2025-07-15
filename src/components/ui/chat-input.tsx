import React, { useState, KeyboardEvent } from 'react';
import { Send, PenTool } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSendMessage, disabled = false }: ChatInputProps) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex items-center p-3 gap-2">
      <div className="flex-1 relative">
        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[#600]">
          <PenTool size={18} />
        </div>
        <Input
          className="bg-[#f8f4e8] border-[#600]/30 focus-visible:ring-[#600]/30 rounded-none pl-9 font-serif placeholder:text-gray-500 text-sm"
          placeholder="Write your query to Vestige..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
      </div>
      <Button
        variant="default"
        size="sm"
        onClick={handleSendMessage}
        disabled={disabled || !message.trim()}
        className="bg-[#600] hover:bg-[#800] rounded-none border border-[#600] shadow-sm"
      >
        <Send size={16} className="mr-1" /> Submit
      </Button>
    </div>
  );
};

export default ChatInput; 