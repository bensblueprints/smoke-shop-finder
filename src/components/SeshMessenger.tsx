import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, MapPin, Paperclip, Smile, Search, MoreVertical, User, Shield } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  isCurrentUser: boolean;
  isAiModerator?: boolean;
}

interface City {
  name: string;
  state: string;
}

const SeshMessenger: React.FC = () => {
  // Sample cities
  const popularCities: City[] = [
    { name: 'Los Angeles', state: 'CA' },
    { name: 'New York', state: 'NY' },
    { name: 'Chicago', state: 'IL' },
    { name: 'Miami', state: 'FL' },
    { name: 'Denver', state: 'CO' },
    { name: 'Seattle', state: 'WA' },
    { name: 'Portland', state: 'OR' },
    { name: 'Austin', state: 'TX' },
    { name: 'Boston', state: 'MA' },
    { name: 'Las Vegas', state: 'NV' }
  ];
  
  const [selectedCity, setSelectedCity] = useState<City>(popularCities[0]);
  const [showCitySelector, setShowCitySelector] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  
  // Filter cities based on search
  const filteredCities = citySearch.trim() === '' 
    ? popularCities 
    : popularCities.filter(city => 
        city.name.toLowerCase().includes(citySearch.toLowerCase()) || 
        city.state.toLowerCase().includes(citySearch.toLowerCase())
      );
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Sample messages for different cities
  useEffect(() => {
    // Clear messages when city changes
    const cityMessages: Message[] = [
      {
        id: '1',
        text: `Welcome to the ${selectedCity.name}, ${selectedCity.state} Sesh Messenger! Connect with other enthusiasts in your area.`,
        sender: 'SeshBot',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        isCurrentUser: false,
        isAiModerator: true
      },
      {
        id: '2',
        text: `Hey everyone! Any recommendations for good shops in ${selectedCity.name}?`,
        sender: `${selectedCity.name}Local`,
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        isCurrentUser: false
      },
      {
        id: '3',
        text: `I'm new to the area, looking to connect with fellow enthusiasts!`,
        sender: 'NewInTown',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        isCurrentUser: false
      },
      {
        id: '4',
        text: 'Remember to follow community guidelines. Be respectful and supportive.',
        sender: 'SeshBot',
        timestamp: new Date(Date.now() - 1000 * 60 * 10),
        isCurrentUser: false,
        isAiModerator: true
      }
    ];
    
    setMessages(cityMessages);
  }, [selectedCity]);
  
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
      sender: 'You',
      timestamp: new Date(),
      isCurrentUser: true
    };
    
    setMessages([...messages, newMessage]);
    setInputText('');
    
    // Simulate AI moderation response for inappropriate content
    if (inputText.toLowerCase().includes('spam') || 
        inputText.toLowerCase().includes('bot') || 
        inputText.toLowerCase().includes('scam')) {
      setTimeout(() => {
        const moderationMessage: Message = {
          id: Date.now().toString() + '-mod',
          text: 'Please refrain from discussing spam, bots, or scams. This helps keep our community safe and enjoyable for everyone.',
          sender: 'SeshBot',
          timestamp: new Date(),
          isCurrentUser: false,
          isAiModerator: true
        };
        setMessages(prevMessages => [...prevMessages, moderationMessage]);
      }, 1000);
    }
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
          <button 
            className="flex items-center p-2 hover:bg-brand-dark rounded-lg transition-colors text-sm"
            onClick={() => setShowCitySelector(!showCitySelector)}
          >
            <MapPin size={16} className="mr-1" />
            {selectedCity.name}, {selectedCity.state}
          </button>
          <button className="p-2 hover:bg-brand-dark rounded-full transition-colors">
            <Users size={20} />
          </button>
          <button className="p-2 hover:bg-brand-dark rounded-full transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>
      
      {/* City selector dropdown */}
      {showCitySelector && (
        <div className="border-b border-gray-200 bg-white p-3">
          <div className="flex items-center mb-2">
            <Search size={16} className="text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search for a city..."
              className="flex-1 border-none outline-none text-sm"
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
            />
          </div>
          <div className="max-h-40 overflow-y-auto">
            {filteredCities.map((city, index) => (
              <div 
                key={index}
                className={`px-2 py-1.5 rounded cursor-pointer text-sm ${
                  selectedCity.name === city.name && selectedCity.state === city.state
                    ? 'bg-brand-100 text-brand-800'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => {
                  setSelectedCity(city);
                  setShowCitySelector(false);
                  setCitySearch('');
                }}
              >
                {city.name}, {city.state}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Community announcement */}
      <div className="px-4 py-2 bg-amber-50 border-b border-amber-100">
        <p className="text-sm text-amber-800 flex items-center">
          <Shield size={14} className="mr-1 text-amber-600" /> 
          Chat with people in your area. Our AI moderators help maintain a safe environment.
        </p>
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
                <div className={`h-10 w-10 rounded-full flex-shrink-0 mr-3 flex items-center justify-center ${
                  message.isAiModerator ? 'bg-amber-100' : 'bg-gray-300'
                }`}>
                  {message.isAiModerator ? (
                    <Shield size={20} className="text-amber-600" />
                  ) : (
                    <User size={20} className="text-gray-600" />
                  )}
                </div>
              )}
              <div className="max-w-[70%]">
                {!message.isCurrentUser && (
                  <div className={`text-xs mb-1 ${
                    message.isAiModerator ? 'text-amber-600 font-medium' : 'text-gray-500'
                  }`}>
                    {message.sender}
                  </div>
                )}
                <div 
                  className={`rounded-2xl px-4 py-2 inline-block ${
                    message.isCurrentUser 
                      ? 'bg-brand text-white rounded-tr-none' 
                      : message.isAiModerator
                        ? 'bg-amber-50 border border-amber-200 rounded-tl-none'
                        : 'bg-white border border-gray-200 rounded-tl-none'
                  }`}
                >
                  <div>{message.text}</div>
                  <div 
                    className={`text-xs mt-1 ${
                      message.isCurrentUser 
                        ? 'text-brand-100' 
                        : message.isAiModerator
                          ? 'text-amber-400'
                          : 'text-gray-500'
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