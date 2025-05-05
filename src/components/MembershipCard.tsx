import React, { useState, useEffect } from 'react';
import { Leaf, Gift, CreditCard, Sparkles, ShoppingBag, Clock, Mail, Smartphone, Printer, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { v4 as uuidv4 } from 'uuid';

interface MembershipCardProps {
  className?: string;
  memberInfo?: {
    name: string;
    email: string;
    userId: string;
    issuedDate?: string;
    expirationDate?: string;
  };
  isPrinting?: boolean;
}

const MembershipCard: React.FC<MembershipCardProps> = ({ 
  className, 
  memberInfo = {
    name: 'Guest User',
    email: 'guest@example.com',
    userId: 'guest',
    issuedDate: new Date().toISOString(),
    expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
  },
  isPrinting = false
}) => {
  // Generate a unique card ID if one doesn't exist in localStorage
  const [cardId, setCardId] = useState<string>('');
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  
  // Format dates for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };
  
  // Generate card ID on component mount
  useEffect(() => {
    const storedCardId = localStorage.getItem('membershipCardId');
    if (storedCardId) {
      setCardId(storedCardId);
    } else {
      const newCardId = uuidv4();
      localStorage.setItem('membershipCardId', newCardId);
      setCardId(newCardId);
      
      // In a real application, this would make an API call to save the card to a database
      // saveMembershipCardToDatabase(newCardId, memberInfo);
    }
  }, [memberInfo]);
  
  // QR code data contains all membership information
  const qrCodeData = JSON.stringify({
    cardId,
    memberName: memberInfo.name,
    memberEmail: memberInfo.email,
    userId: memberInfo.userId,
    issuedDate: memberInfo.issuedDate,
    expirationDate: memberInfo.expirationDate,
    verificationUrl: `https://your-domain.com/verify-card/${cardId}`
  });
  
  // Function to handle adding to Apple Wallet
  const addToAppleWallet = () => {
    // In a real application, this would generate a .pkpass file
    // For demo purposes, we're just showing how it would work
    alert('This would generate an Apple Wallet pass (.pkpass) file with your membership information.');
    
    // Mock API call
    // const response = await fetch('/api/create-apple-wallet-pass', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ cardId, memberInfo })
    // });
    // const passData = await response.blob();
    // const url = window.URL.createObjectURL(passData);
    // window.location.href = url;
  };
  
  // Function to handle adding to Google Wallet
  const addToGoogleWallet = () => {
    // In a real application, this would redirect to a Google Pay API link
    // For demo purposes, we're just showing how it would work
    alert('This would open Google Wallet with your membership information.');
    
    // Mock redirect
    // window.location.href = `https://pay.google.com/gp/v/save/${saveToGooglePayJwt}`;
  };
  
  // Function to handle printing card
  const printCard = () => {
    window.print();
  };
  
  return (
    <div className={`${className} ${isPrinting ? 'print:max-w-full' : 'max-w-md'}`}>
      {/* Card container with print styles */}
      <div className="bg-gradient-to-br from-purple-800 to-purple-900 rounded-xl shadow-xl overflow-hidden print:shadow-none print:border print:border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-purple-600 p-4 flex justify-between items-center">
          <h2 className="text-white font-bold text-2xl flex items-center">
            <Leaf className="h-6 w-6 mr-2 print:text-black" />
            Smoke Shop Discount Card
          </h2>
          <div className="bg-yellow-300 text-purple-900 font-bold rounded-full px-3 py-1 flex items-center">
            <span className="text-lg">$4.20</span>
            <span className="text-xs ml-1">/year</span>
          </div>
        </div>
        
        {/* Card content */}
        <div className="p-5 text-white">
          {/* Member information */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-lg">{memberInfo.name}</h3>
              <p className="text-purple-200 text-sm">{memberInfo.email}</p>
              <div className="mt-2 flex flex-col text-xs text-purple-200">
                <span>Issued: {formatDate(memberInfo.issuedDate || new Date().toISOString())}</span>
                <span>Expires: {formatDate(memberInfo.expirationDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString())}</span>
                <span>Card ID: {cardId.substring(0, 8)}...</span>
              </div>
            </div>
            
            {/* QR Code */}
            <div className="bg-white p-2 rounded-lg">
              <QRCodeSVG 
                value={qrCodeData} 
                size={100} 
                level="H" 
                includeMargin={true}
              />
            </div>
          </div>
          
          {/* Discount info */}
          <div className="border-t border-purple-700 pt-4 mb-4">
            <p className="text-xl font-medium mb-2">10% OFF at ALL participating shops!</p>
            <div className="flex items-center">
              <Gift className="h-5 w-5 text-green-400 mr-2" />
              <p>Valid at 5,000+ stores nationwide</p>
            </div>
          </div>
          
          {/* Actions - hidden when printing */}
          {!isPrinting && (
            <div className="mt-6 space-y-3 print:hidden">
              <button 
                onClick={() => setShowWalletOptions(!showWalletOptions)}
                className="w-full bg-white hover:bg-gray-100 text-purple-800 font-bold py-2 px-4 rounded-lg flex items-center justify-center transition-colors duration-200"
              >
                <Smartphone className="h-5 w-5 mr-2" />
                Add to Digital Wallet
              </button>
              
              {showWalletOptions && (
                <div className="flex space-x-2">
                  <button 
                    onClick={addToAppleWallet}
                    className="flex-1 bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center transition-colors duration-200"
                  >
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 8.42 7.31c1.33.07 2.25.79 3.13.84.95-.17 2.02-.9 3.3-.84 4.03.34 5.65 5.35 4.2 8.98ZM14.47 6.26c.67-.83 1.2-2 1.01-3.26-1.05.16-2.26.97-2.97 2.04-.64.79-1.16 1.98-.96 3.12 1.08.09 2.2-.67 2.92-1.9Z" />
                    </svg>
                    Apple Wallet
                  </button>
                  <button 
                    onClick={addToGoogleWallet}
                    className="flex-1 bg-white border border-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
                  >
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <path d="M12 11h8.64l-4.02 4.02c-1.1 1.1-2.88 1.1-3.98 0L8.38 11H12z" fill="#4285F4" />
                      <path d="M3.34 9.05l4.04-4.04c1.1-1.1 2.88-1.1 3.98 0L15.3 9.05H3.34z" fill="#EA4335" />
                      <path d="M12 13.14v7.59c-1.13 0-2.25-.43-3.32-1.05-.59-.59-.98-1.26-1.06-1.99L3.34 9.05H12v4.09z" fill="#FBBC04" />
                      <path d="M12 13.14v7.59c1.13 0 2.25-.43 3.32-1.05.59-.59.98-1.26 1.06-1.99L20.66 9.05H12v4.09z" fill="#34A853" />
                    </svg>
                    Google Wallet
                  </button>
                </div>
              )}
              
              <button 
                onClick={printCard}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center transition-colors duration-200"
              >
                <Printer className="h-5 w-5 mr-2" />
                Print Card
              </button>
            </div>
          )}
          
          {/* Only show this information on physical cards (when printing) */}
          <div className="hidden print:block pt-4 text-center text-sm">
            <p>Show this card at participating shops for 10% off your purchase.</p>
            <p>Card ID: {cardId}</p>
            <p>Verify this card at: https://your-domain.com/verify-card</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipCard; 