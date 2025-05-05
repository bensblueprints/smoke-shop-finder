import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, Camera, Paperclip, Smile, Search, MoreVertical, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  isCurrentUser: boolean;
}

const SeshMessenger: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hey, did you check out the new Delta 8 gummies at Green Leaf?',
      sender: 'JaneSmoke',
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      isCurrentUser: false
    },
    {
      id: '2',
      text: 'Yes! They\'re amazing. The mixed fruit flavor is 🔥',
      sender: 'CurrentUser',
      timestamp: new Date(Date.now() - 1000 * 60 * 22),
      isCurrentUser: true
    },
    {
      id: '3',
      text: 'I\'m thinking of organizing a sesh this weekend. Anyone interested?',
      sender: 'BlazeRunner',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      isCurrentUser: false
    },
    {
      id: '4',
      text: 'Count me in! Should we bring our own glassware?',
      sender: 'CurrentUser',
      timestamp: new Date(Date.now() - 1000 * 60 * 12),
      isCurrentUser: true
    },
    {
      id: '5',
      text: 'I just ordered that new premium water pipe they have on sale. It should arrive by Friday!',
      sender: 'CurrentUser',
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
      isCurrentUser: true
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'CurrentUser',
      timestamp: new Date(),
      isCurrentUser: true
    };
    
    setMessages([...messages, newMessage]);
    setInputText('');
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-brand text-white flex justify-between items-center">
        <div className="flex items-center">
          <h2 className="font-bold text-xl">Sesh Messenger</h2>
          <div className="ml-2 bg-accent text-xs rounded-full px-2 py-0.5">LIVE</div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-2 hover:bg-brand-dark rounded-full transition-colors">
            <Users size={20} />
          </button>
          <button className="p-2 hover:bg-brand-dark rounded-full transition-colors">
            <Search size={20} />
          </button>
          <button className="p-2 hover:bg-brand-dark rounded-full transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>
      
      {/* Message list */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              {!message.isCurrentUser && (
                <div className="h-10 w-10 rounded-full bg-gray-300 flex-shrink-0 mr-3 flex items-center justify-center">
                  <User size={20} className="text-gray-600" />
                </div>
              )}
              <div className="max-w-[70%]">
                {!message.isCurrentUser && (
                  <div className="text-xs text-gray-500 mb-1">{message.sender}</div>
                )}
                <div 
                  className={`rounded-2xl px-4 py-2 inline-block ${
                    message.isCurrentUser 
                      ? 'bg-brand text-white rounded-tr-none' 
                      : 'bg-white border border-gray-200 rounded-tl-none'
                  }`}
                >
                  <div>{message.text}</div>
                  <div 
                    className={`text-xs mt-1 ${
                      message.isCurrentUser ? 'text-brand-100' : 'text-gray-500'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input area */}
      <div className="px-4 py-3 border-t border-gray-200 bg-white">
        <div className="flex items-center">
          <div className="flex space-x-2 mr-3">
            <button className="p-2 text-gray-500 hover:text-brand rounded-full transition-colors">
              <Paperclip size={20} />
            </button>
            <button className="p-2 text-gray-500 hover:text-brand rounded-full transition-colors">
              <Camera size={20} />
            </button>
            <button className="p-2 text-gray-500 hover:text-brand rounded-full transition-colors">
              <Smile size={20} />
            </button>
          </div>
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            className="ml-3 p-2 bg-brand text-white rounded-full hover:bg-brand-dark transition-colors"
            onClick={handleSendMessage}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeshMessenger; 