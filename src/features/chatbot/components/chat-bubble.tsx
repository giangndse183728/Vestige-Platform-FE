import React from 'react';
import { User } from 'lucide-react';
import { Message } from '../types';

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message  }) => {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex w-full mb-4 justify-end">
        <div className="flex gap-2 items-start">
          <div className="max-w-[85%] bg-[#f0ece0] border border-gray-280 p-3 shadow-sm text-gray-800 font-serif leading-relaxed">
            
            <div className="text-sm">{message.content}</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#600] flex items-center justify-center text-white shrink-0">
            <User size={16} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full mb-6 justify-start">
      <div className="max-w-[85%] bg-transparent text-gray-900">
        <div className="text-xs text-[#600] mb-1 font-bold font-cinzel border-b border-[#600]/30 pb-1">VES-AI Response:</div>
        <div className="text-sm font-serif leading-relaxed whitespace-pre-line p-2">
          {message.content.split('\n').map((paragraph, i) => (
            paragraph.trim() ? (
              <p key={i} className="mb-2 first-letter:text-lg first-letter:font-bold">
                {paragraph}
              </p>
            ) : null
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble; 