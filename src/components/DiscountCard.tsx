import React from 'react';
import { Leaf, Gift, CreditCard, Sparkles, ShoppingBag, Clock, Mail } from 'lucide-react';

interface DiscountCardProps {
  className?: string;
}

const DiscountCard: React.FC<DiscountCardProps> = ({ className }) => {
  return (
    <div className={`bg-gradient-to-br from-purple-800 to-purple-900 rounded-xl shadow-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-purple-600 p-4 flex justify-between items-center">
        <h2 className="text-white font-bold text-2xl flex items-center">
          <Leaf className="h-6 w-6 mr-2" />
          Smoke Shop Discount Card
        </h2>
        <div className="bg-yellow-300 text-purple-900 font-bold rounded-full px-3 py-1 flex items-center">
          <span className="text-lg">$4.20</span>
          <span className="text-xs ml-1">/year</span>
        </div>
      </div>
      
      {/* Card content */}
      <div className="p-5 text-white">
        <div className="mb-6">
          <p className="text-xl font-medium mb-2">Get 10% OFF at ALL participating smoke shops!</p>
          <p className="text-purple-200">Lifetime membership with annual renewal of just $4.20!</p>
        </div>
        
        {/* Benefits */}
        <div className="space-y-3 mb-6">
          <div className="flex items-start">
            <Gift className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
            <p>10% OFF at participating smoke shops nationwide</p>
          </div>
          <div className="flex items-start">
            <Mail className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
            <p>Daily deals sent to your inbox at 4:20 PM</p>
          </div>
          <div className="flex items-start">
            <ShoppingBag className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
            <p>Verified online deals delivered to your door</p>
          </div>
          <div className="flex items-start">
            <CreditCard className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
            <p>Exclusive member-only discounts for your area</p>
          </div>
          <div className="flex items-start">
            <Gift className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
            <p>Special birthday coupons and gifts</p>
          </div>
          <div className="flex items-start">
            <Clock className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
            <p>Daily deals on what you love at 4:20 every day</p>
          </div>
          <div className="flex items-start">
            <Sparkles className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
            <p>Early access to new products and promotions</p>
          </div>
        </div>
        
        {/* PayPal button */}
        <div className="mt-6">
          <p className="text-center text-purple-200 mb-3">Lifetime Membership - Just $4.20/year!</p>
          
          <div className="flex justify-center">
            <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
              <input type="hidden" name="cmd" value="_donations" />
              <input type="hidden" name="business" value="YOUR_PAYPAL_EMAIL" />
              <input type="hidden" name="item_name" value="Smoke Shop Discount Card (Lifetime Membership)" />
              <input type="hidden" name="amount" value="4.20" />
              <input type="hidden" name="currency_code" value="USD" />
              <input type="hidden" name="return" value={typeof window !== 'undefined' ? window.location.href : ''} />
              <input type="hidden" name="cancel_return" value={typeof window !== 'undefined' ? window.location.href : ''} />
              
              <button 
                type="submit" 
                className="bg-[#0070ba] hover:bg-[#003087] text-white font-bold py-3 px-6 rounded-lg flex items-center transition-colors duration-200"
              >
                <span className="mr-2">Subscribe with</span>
                <span className="font-bold text-xl">PayPal</span>
              </button>
            </form>
          </div>
          
          <p className="text-center text-purple-300 mt-4 text-sm">
            We know what you want and we're here to give it to you!
          </p>
        </div>
      </div>
    </div>
  );
};

export default DiscountCard; 