// In a real application, this would be a server-side API endpoint
// For this demo, we're implementing it as a client-side API route

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Clock, AlertCircle } from 'lucide-react';

// Mock database for verification - in a real app, this would query a database
const verifyCardInDatabase = (cardId: string) => {
  // For demo purposes, we're just checking if the card ID exists in localStorage
  // to simulate a basic verification
  const storedCardId = localStorage.getItem('membershipCardId');
  
  if (!cardId) {
    return { 
      isValid: false, 
      status: 'invalid',
      message: 'No card ID provided.',
      timestamp: new Date().toISOString()
    };
  }
  
  if (cardId === storedCardId) {
    return { 
      isValid: true, 
      status: 'active',
      message: 'Membership card is valid and active.',
      timestamp: new Date().toISOString(),
      memberSince: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Mock date 30 days ago
      expirationDate: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000).toISOString() // Mock date 335 days from now
    };
  }
  
  // An expired card would have a different status
  if (cardId === 'expired-test-card') {
    return { 
      isValid: false, 
      status: 'expired',
      message: 'This membership card has expired.',
      timestamp: new Date().toISOString(),
      memberSince: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString(),
      expirationDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    };
  }
  
  // Card not found
  return { 
    isValid: false, 
    status: 'not_found',
    message: 'This membership card was not found in our system.',
    timestamp: new Date().toISOString()
  };
};

const VerifyCard: React.FC = () => {
  const navigate = useNavigate();
  const [verificationResult, setVerificationResult] = React.useState<any>(null);
  const [isVerifying, setIsVerifying] = React.useState(false);
  
  React.useEffect(() => {
    // Get the card ID from the URL
    const params = new URLSearchParams(window.location.search);
    const cardId = params.get('id');
    
    if (cardId) {
      setIsVerifying(true);
      
      // Simulate API call delay
      setTimeout(() => {
        const result = verifyCardInDatabase(cardId);
        setVerificationResult(result);
        setIsVerifying(false);
      }, 1500);
    }
  }, []);
  
  // Format dates for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className="min-h-screen bg-purple-50 flex flex-col">
      <header className="bg-purple-800 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Smoke Shop Discount Card</h1>
          <p>Membership Verification System</p>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-10">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-purple-600 p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">Card Verification</h2>
            <p>Verify the authenticity and status of a membership card</p>
          </div>
          
          <div className="p-6">
            {isVerifying ? (
              <div className="text-center py-12">
                <div className="animate-pulse mb-4">
                  <div className="w-16 h-16 rounded-full bg-purple-100 mx-auto flex items-center justify-center">
                    <Clock className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
                <p className="text-lg text-gray-700 font-medium">Verifying membership card...</p>
                <p className="text-gray-500">Please wait while we check our database.</p>
              </div>
            ) : verificationResult ? (
              <div>
                <div className={`p-4 rounded-lg mb-6 ${
                  verificationResult.isValid 
                    ? 'bg-green-50 border border-green-200' 
                    : verificationResult.status === 'expired'
                      ? 'bg-yellow-50 border border-yellow-200'
                      : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-start">
                    <div className={`p-2 rounded-full mr-4 ${
                      verificationResult.isValid 
                        ? 'bg-green-100' 
                        : verificationResult.status === 'expired'
                          ? 'bg-yellow-100'
                          : 'bg-red-100'
                    }`}>
                      {verificationResult.isValid ? (
                        <Check className={`h-6 w-6 text-green-600`} />
                      ) : verificationResult.status === 'expired' ? (
                        <Clock className="h-6 w-6 text-yellow-600" />
                      ) : (
                        <X className="h-6 w-6 text-red-600" />
                      )}
                    </div>
                    <div>
                      <h3 className={`font-bold text-lg ${
                        verificationResult.isValid 
                          ? 'text-green-800' 
                          : verificationResult.status === 'expired'
                            ? 'text-yellow-800'
                            : 'text-red-800'
                      }`}>
                        {verificationResult.isValid 
                          ? 'Valid Membership' 
                          : verificationResult.status === 'expired'
                            ? 'Expired Membership'
                            : 'Invalid Membership'}
                      </h3>
                      <p className={`${
                        verificationResult.isValid 
                          ? 'text-green-700' 
                          : verificationResult.status === 'expired'
                            ? 'text-yellow-700'
                            : 'text-red-700'
                      }`}>
                        {verificationResult.message}
                      </p>
                    </div>
                  </div>
                </div>
                
                {(verificationResult.isValid || verificationResult.status === 'expired') && (
                  <div className="space-y-4">
                    <div className="border-b border-gray-200 pb-4">
                      <h3 className="font-medium text-gray-700 mb-2">Membership Details</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <p className="font-medium text-gray-800">
                            {verificationResult.status === 'active' ? 'Active' : 'Expired'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Member Since</p>
                          <p className="font-medium text-gray-800">
                            {formatDate(verificationResult.memberSince)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Expiration Date</p>
                          <p className="font-medium text-gray-800">
                            {formatDate(verificationResult.expirationDate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Last Verified</p>
                          <p className="font-medium text-gray-800">
                            {new Date().toLocaleTimeString()} today
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {verificationResult.status === 'expired' && (
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="flex items-start">
                          <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-yellow-800">Renewal Required</h4>
                            <p className="text-yellow-700 text-sm">
                              This membership needs to be renewed to continue receiving benefits.
                              Please visit the membership page to renew for just $4.20/year.
                            </p>
                            <button
                              onClick={() => navigate('/membership')}
                              className="mt-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm"
                            >
                              Renew Membership
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="mt-8 text-center">
                  <button
                    onClick={() => window.location.href = '/'}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    Return to Homepage
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-lg text-gray-700 mb-4">No card ID provided for verification.</p>
                <p className="text-gray-600 mb-6">
                  To verify a membership card, scan the QR code on the card or enter the card ID manually.
                </p>
                
                <form className="max-w-sm mx-auto">
                  <div className="mb-4">
                    <label htmlFor="cardId" className="block text-sm font-medium text-gray-700 mb-1">
                      Card ID
                    </label>
                    <input
                      type="text"
                      id="cardId"
                      placeholder="Enter card ID"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    Verify Card
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="bg-purple-900 text-purple-200 p-4 text-center text-sm">
        <p>© {new Date().getFullYear()} Smoke Shop Discount Card. All rights reserved.</p>
        <p>For shop verification purposes only.</p>
      </footer>
    </div>
  );
};

export default VerifyCard; 