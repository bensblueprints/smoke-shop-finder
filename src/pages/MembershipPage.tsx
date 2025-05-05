import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DiscountCard from '../components/DiscountCard';
import MembershipCard from '../components/MembershipCard';
import { Mail, Check, Gift, CreditCard, Globe, Download, Smartphone, AlertCircle } from 'lucide-react';

const MembershipPage: React.FC = () => {
  const [memberInfo, setMemberInfo] = useState({
    name: '',
    email: '',
    userId: '',
    issuedDate: new Date().toISOString(),
    expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
  });
  
  const [isPurchaseComplete, setIsPurchaseComplete] = useState(false);
  const [userInfoComplete, setUserInfoComplete] = useState(false);
  const [showPurchaseSection, setShowPurchaseSection] = useState(true);
  
  // Handle purchase completion (simulated)
  const handlePurchaseComplete = () => {
    // In a real app, this would be triggered after payment success
    setIsPurchaseComplete(true);
    setShowPurchaseSection(false);
    
    // Generate a user ID if it doesn't exist
    if (!memberInfo.userId) {
      const newUserId = 'user_' + Math.random().toString(36).substr(2, 9);
      setMemberInfo({...memberInfo, userId: newUserId});
    }
  };
  
  // Handle member info form submission
  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserInfoComplete(true);
  };
  
  // Mock payment handler
  const handlePayment = () => {
    // Simulate a successful payment
    setTimeout(() => {
      handlePurchaseComplete();
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-white">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-purple-900 mb-4">
              Smoke Shop Discount Card
            </h1>
            <p className="text-xl text-purple-700 mb-2">
              Exclusive deals and discounts for smoke shop enthusiasts
            </p>
            <p className="text-purple-600">
              Join thousands of members saving money at shops nationwide
            </p>
          </div>
          
          {/* Membership Card and Registration Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Left column: Card preview */}
            <div>
              {isPurchaseComplete && userInfoComplete ? (
                <MembershipCard 
                  className="sticky top-6" 
                  memberInfo={memberInfo}
                />
              ) : (
                <div className="sticky top-6 space-y-4">
                  <DiscountCard />
                  
                  {/* Quick instructions */}
                  {!isPurchaseComplete && (
                    <div className="bg-purple-100 p-4 rounded-lg">
                      <h3 className="font-bold text-purple-800 mb-2 flex items-center">
                        <AlertCircle className="h-5 w-5 mr-2 text-purple-600" />
                        Get Your Card in 2 Easy Steps
                      </h3>
                      <ol className="list-decimal ml-5 text-purple-700">
                        <li className="mb-1">Purchase your membership below</li>
                        <li>Enter your information to generate your card</li>
                      </ol>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Right column: Purchase or Registration */}
            <div className="space-y-6">
              {showPurchaseSection && (
                <div className="bg-white p-6 rounded-xl shadow-md border border-purple-100">
                  <h2 className="text-2xl font-bold text-purple-800 mb-4 flex items-center">
                    <CreditCard className="h-6 w-6 mr-2 text-purple-600" />
                    Get Your Membership Card
                  </h2>
                  
                  <div className="mb-6">
                    <p className="text-gray-700 mb-4">
                      Join our discount program today for just $4.20 per year and start saving immediately.
                      Your digital membership card will be generated instantly after purchase.
                    </p>
                    
                    <div className="bg-green-50 p-4 rounded-lg mb-4">
                      <h3 className="font-bold text-green-800 mb-2 flex items-center">
                        <Check className="h-5 w-5 mr-2 text-green-600" />
                        What's Included:
                      </h3>
                      <ul className="list-disc ml-5 text-green-700 space-y-1">
                        <li>Printable membership card with unique QR code</li>
                        <li>Digital card for Apple Wallet and Google Wallet</li>
                        <li>10% discount at all participating shops</li>
                        <li>Daily deals sent to your email at 4:20 PM</li>
                        <li>1 year membership with option to renew</li>
                      </ul>
                    </div>
                  </div>
                  
                  {/* Payment Button */}
                  <div className="mt-6">
                    <button 
                      onClick={handlePayment}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
                    >
                      Purchase Membership - $4.20/year
                    </button>
                    
                    <p className="text-center text-sm text-gray-500 mt-3">
                      Secure payment powered by Stripe. Cancel anytime.
                    </p>
                  </div>
                </div>
              )}
              
              {/* Member Information Form - Show after purchase */}
              {isPurchaseComplete && !userInfoComplete && (
                <div className="bg-white p-6 rounded-xl shadow-md border border-purple-100 animate-fadeIn">
                  <h2 className="text-2xl font-bold text-purple-800 mb-4">
                    Complete Your Membership
                  </h2>
                  
                  <p className="text-gray-700 mb-6">
                    Enter your information below to generate your personalized membership card.
                  </p>
                  
                  <form onSubmit={handleInfoSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={memberInfo.name}
                        onChange={(e) => setMemberInfo({...memberInfo, name: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="John Doe"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={memberInfo.email}
                        onChange={(e) => setMemberInfo({...memberInfo, email: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="john@example.com"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        We'll send daily deals to this email at 4:20 PM daily.
                      </p>
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                      Generate My Card
                    </button>
                  </form>
                </div>
              )}
              
              {/* Digital Wallet Instructions - Show after card generation */}
              {isPurchaseComplete && userInfoComplete && (
                <div className="bg-white p-6 rounded-xl shadow-md border border-purple-100 animate-fadeIn">
                  <h2 className="text-2xl font-bold text-purple-800 mb-4 flex items-center">
                    <Smartphone className="h-6 w-6 mr-2 text-purple-600" />
                    Your Card is Ready!
                  </h2>
                  
                  <p className="text-gray-700 mb-6">
                    Your membership card has been created and is ready to use. 
                    You can print it, add it to your digital wallet, or simply show the QR code in shops.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="border-l-4 border-purple-400 pl-4 py-2">
                      <h3 className="font-bold text-purple-800">How to use your card:</h3>
                      <ol className="list-decimal ml-5 text-gray-700 space-y-1 mt-2">
                        <li>Show your digital or printed card at any participating shop</li>
                        <li>The shop will scan your unique QR code to verify membership</li>
                        <li>Enjoy your 10% discount on eligible purchases</li>
                      </ol>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-bold text-purple-800 mb-2">Card Management:</h3>
                      <p className="text-gray-700 mb-2">
                        You can access your card anytime by returning to this page.
                        We've also sent a copy to your email for safekeeping.
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mt-4">
                        <button className="flex items-center bg-purple-100 hover:bg-purple-200 text-purple-800 px-3 py-2 rounded transition-colors">
                          <Mail className="h-4 w-4 mr-2" />
                          Email Card
                        </button>
                        <button className="flex items-center bg-purple-100 hover:bg-purple-200 text-purple-800 px-3 py-2 rounded transition-colors">
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </button>
                        <button className="flex items-center bg-purple-100 hover:bg-purple-200 text-purple-800 px-3 py-2 rounded transition-colors">
                          <Globe className="h-4 w-4 mr-2" />
                          Find Shops
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* How It Works */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-purple-900 mb-6 text-center">How It Works</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-lg shadow-md">
                <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <h3 className="font-bold text-purple-800 mb-2 text-center">Subscribe</h3>
                <p className="text-gray-700 text-center">
                  Pay just $4.20 for your annual membership using our secure checkout
                </p>
              </div>
              
              <div className="bg-white p-5 rounded-lg shadow-md">
                <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <h3 className="font-bold text-purple-800 mb-2 text-center">Receive</h3>
                <p className="text-gray-700 text-center">
                  Get your digital membership card instantly with your unique QR code
                </p>
              </div>
              
              <div className="bg-white p-5 rounded-lg shadow-md">
                <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <h3 className="font-bold text-purple-800 mb-2 text-center">Save</h3>
                <p className="text-gray-700 text-center">
                  Show your card at participating shops to receive 10% off and access exclusive deals
                </p>
              </div>
            </div>
          </div>
          
          {/* FAQ */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-purple-900 mb-6 text-center">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-lg shadow-md">
                <h3 className="font-bold text-purple-800 mb-2">Where can I use my membership card?</h3>
                <p className="text-gray-700">
                  Your card is accepted at over 5,000 participating smoke shops nationwide. Use our shop locator to find locations near you.
                </p>
              </div>
              
              <div className="bg-white p-5 rounded-lg shadow-md">
                <h3 className="font-bold text-purple-800 mb-2">Do I need to print my card?</h3>
                <p className="text-gray-700">
                  No, you can use the digital version on your phone. You can add it to Apple Wallet or Google Wallet, or simply show the QR code from your account.
                </p>
              </div>
              
              <div className="bg-white p-5 rounded-lg shadow-md">
                <h3 className="font-bold text-purple-800 mb-2">When does my membership expire?</h3>
                <p className="text-gray-700">
                  Your membership is valid for one year from the date of purchase. You'll receive a renewal notice 30 days before expiration.
                </p>
              </div>
              
              <div className="bg-white p-5 rounded-lg shadow-md">
                <h3 className="font-bold text-purple-800 mb-2">Can I share my card with friends?</h3>
                <p className="text-gray-700">
                  No, each card has a unique QR code tied to your account. Shops may verify the card owner against ID for large purchases.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MembershipPage; 