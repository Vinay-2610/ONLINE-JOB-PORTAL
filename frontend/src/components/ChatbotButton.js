import React, { useState } from 'react';
import ChatWindow from './ChatWindow';

const ChatbotButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <ChatWindow 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)} 
        />
      )}
      
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleChat}
          className={`
            group relative w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 
            hover:from-blue-600 hover:to-purple-700 text-white rounded-full 
            shadow-lg hover:shadow-xl transform hover:scale-105 transition-all 
            duration-300 flex items-center justify-center focus:outline-none 
            focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50
            ${isOpen ? 'rotate-45' : ''}
          `}
          aria-label={isOpen ? 'Close chat' : 'Open chat'}
        >
          {/* Chat Icon */}
          <svg 
            className={`w-7 h-7 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
              />
            )}
          </svg>
          
          {/* Pulse Animation Dot */}
          {!isOpen && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-white">
              <span className="absolute inset-0 w-4 h-4 bg-red-500 rounded-full animate-ping"></span>
            </span>
          )}
        </button>
        
        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="bg-gray-800 text-white text-sm py-1 px-3 rounded-lg whitespace-nowrap">
              Chat with SkillMate Assistant
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatbotButton;