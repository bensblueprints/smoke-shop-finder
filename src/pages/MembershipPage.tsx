import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DiscountCard from '../components/DiscountCard';
import { Mail, Check, Gift } from 'lucide-react';

const MembershipPage: React.FC = () => {
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
          
          {/* Card and Benefits */}
          <div className="grid md:grid-cols-2 gap-10 mb-12">
            <div>
              <DiscountCard className="sticky top-6" />
            </div>
            
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-purple-800 mb-4">Why Join Our Membership?</h2>
                <p className="text-gray-700 mb-6">
                  For just $4.20 per year, you'll get lifetime access to our exclusive discount network,
                  connecting you with the best smoke shops across the nation. Our members save an average 
                  of $120 annually with the 10% discount at participating locations.
                </p>
                
                <div className="bg-purple-100 p-6 rounded-xl">
                  <h3 className="font-bold text-purple-800 mb-3 flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-purple-600" />
                    Daily Deals at 4:20 PM
                  </h3>
                  <p className="text-gray-700">
                    Every day at 4:20 PM, we'll send exclusive deals directly to your inbox. 
                    From discounted glass and accessories to special promotions on your favorite products,
                    you'll always be first to know about the best offers.
                  </p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="font-bold text-purple-800 mb-4">Member Testimonials</h3>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-purple-400 pl-4 py-2">
                    <p className="italic text-gray-700 mb-2">
                      "I've saved over $200 this year alone with my discount card. The daily deals are always on point!"
                    </p>
                    <p className="text-sm text-purple-700 font-medium">- Mike D., Denver CO</p>
                  </div>
                  
                  <div className="border-l-4 border-purple-400 pl-4 py-2">
                    <p className="italic text-gray-700 mb-2">
                      "The membership pays for itself after just one or two visits. Plus the online deals are amazing."
                    </p>
                    <p className="text-sm text-purple-700 font-medium">- Sarah T., Austin TX</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* How It Works */}
          <div className="bg-gradient-to-r from-purple-100 to-purple-200 p-8 rounded-xl mb-12">
            <h2 className="text-2xl font-bold text-purple-900 mb-6 text-center">How It Works</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-lg shadow-md">
                <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <h3 className="font-bold text-purple-800 mb-2 text-center">Subscribe</h3>
                <p className="text-gray-700 text-center">
                  Pay just $4.20 for your annual membership using our secure PayPal checkout
                </p>
              </div>
              
              <div className="bg-white p-5 rounded-lg shadow-md">
                <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <h3 className="font-bold text-purple-800 mb-2 text-center">Receive</h3>
                <p className="text-gray-700 text-center">
                  Get your digital membership card instantly via email with your personal member ID
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
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-purple-900 mb-6 text-center">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-lg shadow-md">
                <h3 className="font-bold text-purple-800 mb-2">How much does membership cost?</h3>
                <p className="text-gray-700">
                  Membership costs just $4.20 per year. It's a lifetime membership that you renew annually.
                </p>
              </div>
              
              <div className="bg-white p-5 rounded-lg shadow-md">
                <h3 className="font-bold text-purple-800 mb-2">How do I use my discount card?</h3>
                <p className="text-gray-700">
                  Simply show your digital membership card (sent via email) at any participating smoke shop to receive your 10% discount.
                </p>
              </div>
              
              <div className="bg-white p-5 rounded-lg shadow-md">
                <h3 className="font-bold text-purple-800 mb-2">How many shops participate in the program?</h3>
                <p className="text-gray-700">
                  We have over 5,000 participating shops nationwide, with new locations joining every week. Check our directory for shops near you.
                </p>
              </div>
              
              <div className="bg-white p-5 rounded-lg shadow-md">
                <h3 className="font-bold text-purple-800 mb-2">When will I get my daily deals?</h3>
                <p className="text-gray-700">
                  Daily deals are sent to your email inbox every day at 4:20 PM in your local time zone.
                </p>
              </div>
            </div>
          </div>
          
          {/* CTA */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-purple-900 mb-4">
              Ready to start saving?
            </h2>
            <p className="text-xl text-purple-700 mb-6">
              Join our discount program today for just $4.20
            </p>
            
            <div className="max-w-md mx-auto">
              <DiscountCard />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MembershipPage; 