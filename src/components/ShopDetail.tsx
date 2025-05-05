import React from 'react';
import { Shop, businessTypeLabels } from '../types/shop';
import { 
  MapPin, 
  Phone, 
  Globe, 
  Mail, 
  Calendar, 
  ArrowLeft, 
  Clock, 
  Check,
  MapIcon,
  ExternalLink,
  Share2
} from 'lucide-react';

interface ShopDetailProps {
  shop: Shop;
  onBack: () => void;
}

const ShopDetail: React.FC<ShopDetailProps> = ({ shop, onBack }) => {
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return '';
    
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Format: (XXX) XXX-XXXX
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    
    return phone;
  };

  const getBusinessTypeLabel = () => {
    return businessTypeLabels[shop.businessType] || 'Shop';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
      <div className="bg-gradient-to-r from-green-900 to-green-700 p-6">
        <button 
          onClick={onBack}
          className="flex items-center text-white mb-4 hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to results
        </button>
        
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-white">{shop.name}</h2>
            <p className="text-green-100 mt-1">{getBusinessTypeLabel()}</p>
          </div>
          {shop.claimed && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <Check className="w-4 h-4 mr-1" />
              Claimed
            </span>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Business Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-gray-700">
                    {shop.address1}
                    {shop.address2 && <><br />{shop.address2}</>}
                    <br />
                    {shop.city}, {shop.state} {shop.zipCode}
                  </p>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${shop.name} ${shop.address1} ${shop.city} ${shop.state} ${shop.zipCode}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mt-2"
                  >
                    <MapIcon className="w-4 h-4 mr-1" />
                    View on map
                  </a>
                </div>
              </div>
              
              {shop.phone && (
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" />
                  <a 
                    href={`tel:${shop.phone}`}
                    className="text-gray-700 hover:text-blue-600"
                  >
                    {formatPhoneNumber(shop.phone)}
                  </a>
                </div>
              )}
              
              {shop.website && (
                <div className="flex items-center">
                  <Globe className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" />
                  <a 
                    href={shop.website.startsWith('http') ? shop.website : `https://${shop.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                  >
                    {shop.website.replace(/^https?:\/\//, '')}
                    <ExternalLink className="w-3 h-3 ml-1 inline-block" />
                  </a>
                </div>
              )}
              
              {shop.email && (
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" />
                  <a 
                    href={`mailto:${shop.email}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {shop.email}
                  </a>
                </div>
              )}
              
              {shop.dateAdded && (
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-gray-700">
                      Listed: {new Date(shop.dateAdded).toLocaleDateString()}
                    </p>
                    {shop.dateUpdated && (
                      <p className="text-sm text-gray-500">
                        Last updated: {new Date(shop.dateUpdated).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Products & Services</h3>
              
              <div className="flex flex-wrap gap-2">
                {shop.hasCBD && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    CBD Products
                  </span>
                )}
                {shop.hasKratom && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    Kratom
                  </span>
                )}
                {shop.hasMarijuana && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                    Marijuana Products
                  </span>
                )}
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {getBusinessTypeLabel()}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Business Hours</h3>
            
            <div className="space-y-2 text-gray-600">
              <p className="flex justify-between">
                <span>Monday</span>
                <span>9:00 AM - 8:00 PM</span>
              </p>
              <p className="flex justify-between">
                <span>Tuesday</span>
                <span>9:00 AM - 8:00 PM</span>
              </p>
              <p className="flex justify-between">
                <span>Wednesday</span>
                <span>9:00 AM - 8:00 PM</span>
              </p>
              <p className="flex justify-between">
                <span>Thursday</span>
                <span>9:00 AM - 8:00 PM</span>
              </p>
              <p className="flex justify-between">
                <span>Friday</span>
                <span>9:00 AM - 9:00 PM</span>
              </p>
              <p className="flex justify-between">
                <span>Saturday</span>
                <span>10:00 AM - 9:00 PM</span>
              </p>
              <p className="flex justify-between">
                <span>Sunday</span>
                <span>11:00 AM - 6:00 PM</span>
              </p>
            </div>
            
            <div className="mt-6">
              <p className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                Hours may vary
              </p>
            </div>
            
            {!shop.claimed && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-800 mb-2">Own this business?</h4>
                <button 
                  className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md transition-colors duration-200 text-sm font-medium"
                >
                  Claim This Listing
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Claiming allows you to update business information and respond to reviews
                </p>
              </div>
            )}
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-800 mb-2">Share</h4>
              <button 
                className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors duration-200 text-sm font-medium flex items-center justify-center"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share this business
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetail;