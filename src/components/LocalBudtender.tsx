import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Leaf, Zap, Braces, Database, Store } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface Product {
  name: string;
  shop: string;
  price: number;
  inStock: boolean;
  category: string;
}

// Mock database of local products
const localProductsDB: Product[] = [
  { name: 'Premium CBD Oil 1000mg', shop: 'Green Leaf Dispensary', price: 49.99, inStock: true, category: 'CBD' },
  { name: 'Delta 8 Gummies 25mg', shop: 'Cloud 9 Smoke Shop', price: 29.99, inStock: true, category: 'Delta 8' },
  { name: 'THCA Flower - Sour Diesel', shop: 'Herbal Solutions', price: 39.99, inStock: true, category: 'Flower' },
  { name: 'Glass Water Pipe 12"', shop: 'Smoke City', price: 89.99, inStock: true, category: 'Accessories' },
  { name: 'Vape Cartridge - Blueberry', shop: 'Green Leaf Dispensary', price: 54.99, inStock: true, category: 'Vapes' },
  { name: 'CBD Topical Cream 500mg', shop: 'Herbal Solutions', price: 34.99, inStock: false, category: 'CBD' },
  { name: 'Rolling Papers - Hemp', shop: 'Smoke City', price: 3.99, inStock: true, category: 'Accessories' },
  { name: 'Delta 9 THC Tincture', shop: 'Cloud 9 Smoke Shop', price: 64.99, inStock: true, category: 'Delta 9' },
  { name: 'CBD Pet Treats', shop: 'Green Leaf Dispensary', price: 24.99, inStock: true, category: 'CBD' },
  { name: 'THCP Vape Pen', shop: 'Herbal Solutions', price: 59.99, inStock: false, category: 'THCP' },
];

const LocalBudtender: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi there! I'm your local AI Budtender. I can help you find products available at shops in your area. What are you looking for today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Process user query and generate response
  const processQuery = (query: string): string => {
    const queryLower = query.toLowerCase();
    
    // Check for category mentions
    const categoryMentions = {
      'cbd': queryLower.includes('cbd'),
      'delta 8': queryLower.includes('delta 8') || queryLower.includes('delta8'),
      'delta 9': queryLower.includes('delta 9') || queryLower.includes('delta9'),
      'thcp': queryLower.includes('thcp'),
      'thca': queryLower.includes('thca') || queryLower.includes('flower'),
      'vape': queryLower.includes('vape') || queryLower.includes('cartridge'),
      'accessories': queryLower.includes('accessory') || queryLower.includes('accessories') || 
                    queryLower.includes('pipe') || queryLower.includes('papers'),
    };
    
    // Check for specific product mentions
    const productKeywords = queryLower.split(' ').filter(word => word.length > 3);
    
    // Filter products based on query
    let matchedProducts = localProductsDB.filter(product => {
      // Match by category
      const categoryMatch = Object.entries(categoryMentions).some(([category, mentioned]) => 
        mentioned && product.category.toLowerCase().includes(category)
      );
      
      // Match by product name
      const nameMatch = productKeywords.some(keyword => 
        product.name.toLowerCase().includes(keyword)
      );
      
      return categoryMatch || nameMatch;
    });
    
    // If asking about stock/availability
    if (queryLower.includes('stock') || queryLower.includes('available') || queryLower.includes('have')) {
      matchedProducts = matchedProducts.filter(product => product.inStock);
    }
    
    // If asking about specific shop
    const shops = ['green leaf', 'cloud 9', 'herbal', 'smoke city'];
    for (const shop of shops) {
      if (queryLower.includes(shop)) {
        matchedProducts = matchedProducts.filter(product => 
          product.shop.toLowerCase().includes(shop)
        );
      }
    }
    
    // Generate response
    if (matchedProducts.length > 0) {
      let response = `I found ${matchedProducts.length} products that match your search:\n\n`;
      
      matchedProducts.forEach((product, index) => {
        response += `${index + 1}. ${product.name} - $${product.price.toFixed(2)} at ${product.shop} `;
        response += product.inStock ? '(In Stock)' : '(Out of Stock)';
        response += '\n';
      });
      
      response += '\nWould you like more details about any of these products?';
      return response;
    } else if (
      queryLower.includes('hello') || 
      queryLower.includes('hi') || 
      queryLower.includes('hey')
    ) {
      return "Hi there! I'm your local AI Budtender. How can I help you today? You can ask me about CBD, Delta 8, vapes, accessories, or what's available at specific shops.";
    } else if (queryLower.includes('thank')) {
      return "You're welcome! Let me know if you need help finding anything else.";
    } else {
      return "I couldn't find any products matching your search. Try asking about specific categories like CBD, Delta 8, vapes, or accessories. You can also ask what's available at shops like Green Leaf Dispensary or Smoke City.";
    }
  };
  
  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    
    // Process and generate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: processQuery(inputText),
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
    }, 500);
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="flex flex-col h-[520px] bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-green-600 text-white flex justify-between items-center">
        <div className="flex items-center">
          <Bot className="h-5 w-5 mr-2" />
          <h2 className="font-bold text-lg">Local Budtender</h2>
          <div className="ml-2 bg-green-800 text-xs rounded-full px-2 py-0.5">AI</div>
        </div>
        <div className="flex items-center">
          <Database className="h-4 w-4 mr-1" />
          <span className="text-xs">Local Shops Data</span>
        </div>
      </div>
      
      {/* Message list */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!message.isUser && (
                <div className="h-8 w-8 rounded-full bg-green-100 flex-shrink-0 mr-3 flex items-center justify-center">
                  <Leaf className="h-4 w-4 text-green-600" />
                </div>
              )}
              <div className="max-w-[75%]">
                <div 
                  className={`rounded-2xl px-4 py-2 inline-block ${
                    message.isUser 
                      ? 'bg-brand text-white rounded-tr-none' 
                      : 'bg-white border border-gray-200 rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.text}</div>
                  <div 
                    className={`text-xs mt-1 ${
                      message.isUser ? 'text-brand-100' : 'text-gray-500'
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
          <div className="flex items-center mr-2 text-xs text-green-700">
            <Store className="h-3 w-3 mr-1" />
            <span>4 Local Shops</span>
          </div>
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Ask about local products..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            className="ml-3 p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
            onClick={handleSendMessage}
          >
            <Send size={20} />
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500 flex items-center justify-center">
          <Zap className="h-3 w-3 mr-1 text-green-600" />
          <span>AI-powered product finder for local smoke shops</span>
        </div>
      </div>
    </div>
  );
};

export default LocalBudtender; 