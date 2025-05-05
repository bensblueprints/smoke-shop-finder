import React, { useState, useEffect } from 'react';
import { Globe, Lock, Check, X } from 'lucide-react';

// The single password for all users
const SITE_PASSWORD = 'globaltravel2024'; // You can change this to any password

const GlobalCitizenTravelsPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showContent, setShowContent] = useState(false);

  // Check if user is already authenticated via localStorage
  useEffect(() => {
    const authStatus = localStorage.getItem('globalCitizenAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      setShowContent(true);
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === SITE_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('globalCitizenAuth', 'true');
      
      // Add a slight delay to show the success animation
      setTimeout(() => {
        setShowContent(true);
      }, 800);
    } else {
      setError('Incorrect password. Please try again.');
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      {!showContent ? (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
          <div className="text-center mb-6">
            <div className="inline-block p-3 rounded-full bg-brand text-white mb-4">
              <Globe className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-neutral mb-2">
              Global Citizen Travels
            </h1>
            <p className="text-gray-600">
              Enter the password to access exclusive travel content.
            </p>
          </div>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none ${
                    error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-brand-200 focus:border-brand'
                  }`}
                  placeholder="Enter password"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              {error && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <X className="h-4 w-4 mr-1" />
                  {error}
                </p>
              )}
            </div>
            
            <button
              type="submit"
              className="w-full py-3 px-4 bg-brand hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-opacity-50 text-white font-medium rounded-lg transition-colors"
            >
              Access Site
            </button>
          </form>
          
          {isAuthenticated && (
            <div className="mt-4 flex justify-center">
              <div className="animate-bounce bg-green-100 text-green-800 rounded-full p-2">
                <Check className="h-6 w-6" />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-neutral flex items-center">
              <Globe className="h-7 w-7 mr-3 text-brand" />
              Global Citizen Travels
            </h1>
          </div>
          
          {/* Main content section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-neutral mb-4">Welcome to Global Citizen Travels</h2>
              <p className="text-gray-700 mb-6">
                Your exclusive access to global travel resources, community discussions, and special offers.
              </p>
              
              {/* Content sections would go here - replace this with actual content */}
              <div className="space-y-8">
                <section>
                  <h3 className="text-xl font-semibold text-brand mb-3">Upcoming Group Trips</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">
                      Find and join our upcoming global adventures with like-minded travelers.
                    </p>
                    {/* Trip listings would go here */}
                  </div>
                </section>
                
                <section>
                  <h3 className="text-xl font-semibold text-brand mb-3">Travel Resources</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">
                      Access our curated collection of travel guides, tips, and exclusive discounts.
                    </p>
                    {/* Resource listings would go here */}
                  </div>
                </section>
                
                <section>
                  <h3 className="text-xl font-semibold text-brand mb-3">Community Forum</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">
                      Connect with fellow travelers, share experiences, and get advice for your next journey.
                    </p>
                    {/* Forum content would go here */}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalCitizenTravelsPage; 