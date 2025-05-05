import React, { useState } from 'react';
import { Shop, businessTypeLabels, BusinessType } from '../types/shop';
import { MapPin, Phone, Globe, Clock, Check, ArrowRight, Mail, Navigation, ShoppingBag, Truck } from 'lucide-react';
import { useShops } from '../context/ShopContext';
import ShopImage from './ShopImage';

interface ShopListItemProps {
  shop: Shop;
  onClick?: () => void;
  gridView?: boolean;
  userLocation?: { lat: number, lng: number } | null;
}

const ShopListItem: React.FC<ShopListItemProps> = ({ 
  shop, 
  onClick, 
  gridView = false,
  userLocation = null
}) => {
  const { claimShop } = useShops();
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [showMoreDetails, setShowMoreDetails] = useState(false);

  const handleClaimClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsClaimModalOpen(true);
  };

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    claimShop(shop.id);
    setIsClaimModalOpen(false);
  };

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

  const getGoogleMapsUrl = () => {
    const address = encodeURIComponent(
      `${shop.address1}, ${shop.city}, ${shop.state} ${shop.zipCode}`
    );
    
    if (userLocation) {
      return `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${address}`;
    }
    
    return `https://www.google.com/maps/search/?api=1&query=${address}`;
  };

  const getWebsiteUrl = () => {
    if (!shop.website) return '';
    return shop.website.startsWith('http') ? shop.website : `https://${shop.website}`;
  };

  return (
    <>
      <div 
        onClick={() => {
          if (onClick) onClick();
          else setShowMoreDetails(!showMoreDetails);
        }}
        className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer border border-gray-100 ${
          gridView ? 'h-full flex flex-col' : ''
        }`}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
      >
        <div className={`p-4 ${gridView ? 'flex-grow' : ''}`}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-1 hover:text-amber-600 transition-colors">{shop.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{getBusinessTypeLabel()}</p>
            </div>
            {shop.claimed ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <Check className="w-3 h-3 mr-1" />
                Claimed
              </span>
            ) : (
              <button
                onClick={handleClaimClick}
                className="px-3 py-1 text-sm bg-amber-500 hover:bg-amber-600 text-white rounded-md transition-colors duration-200"
              >
                Claim
              </button>
            )}
          </div>
          
          <div className="mt-3 space-y-2">
            <div className="flex items-start">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-gray-600">
                {shop.address1}
                {shop.address2 && `, ${shop.address2}`}
                <br />
                {shop.city}, {shop.state} {shop.zipCode}
              </p>
            </div>
            
            {shop.phone && (
              <div className="flex items-center">
                <Phone className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                <p className="text-sm text-gray-600">{formatPhoneNumber(shop.phone)}</p>
              </div>
            )}
            
            {shop.website && !gridView && (
              <div className="flex items-center">
                <Globe className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                <a 
                  href={getWebsiteUrl()} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                >
                  {shop.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
            
            {shop.email && !gridView && (
              <div className="flex items-center text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                <a 
                  href={`mailto:${shop.email}`} 
                  className="text-sm hover:text-amber-600"
                  onClick={(e) => e.stopPropagation()}
                >
                  {shop.email}
                </a>
              </div>
            )}
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {shop.hasCBD && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                CBD Products
              </span>
            )}
            {shop.hasKratom && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Kratom
              </span>
            )}
            {shop.dateAdded && !gridView && (
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="w-3 h-3 mr-1" />
                Listed: {new Date(shop.dateAdded).toLocaleDateString()}
              </div>
            )}
          </div>

          {/* Additional details that show when expanded */}
          {showMoreDetails && !gridView && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="font-medium text-gray-800 mb-2">Shop Details</h4>
              {shop.website && (
                <p className="text-sm mb-2">
                  <strong>Website:</strong>{' '}
                  <a 
                    href={getWebsiteUrl()} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-blue-600 hover:underline"
                  >
                    {shop.website}
                  </a>
                </p>
              )}
              {shop.dateAdded && (
                <p className="text-sm">
                  <strong>Listed since:</strong> {new Date(shop.dateAdded).toLocaleDateString()}
                </p>
              )}
              {shop.dateUpdated && (
                <p className="text-sm">
                  <strong>Last updated:</strong> {new Date(shop.dateUpdated).toLocaleDateString()}
                </p>
              )}
            </div>
          )}
        </div>
        
        {/* Action buttons */}
        <div className={`px-4 py-3 ${gridView ? 'bg-gray-50 border-t border-gray-100' : 'border-t border-gray-100 bg-gray-50'}`}>
          {/* Shop Image */}
          <div className="mb-4">
            <ShopImage 
              shopName={shop.name} 
              shopAddress={`${shop.address1}, ${shop.city}, ${shop.state} ${shop.zipCode}`}
              fallbackType={
                shop.businessType === BusinessType.Tobacco ? 'tobacco' : 
                shop.businessType === BusinessType.Vape ? 'vape' :
                shop.businessType === BusinessType.CBD ? 'cbd' :
                shop.businessType === BusinessType.Hookah ? 'hookah' : 'default'
              }
            />
          </div>
          
          <div className="flex flex-wrap gap-2 justify-between">
            <a 
              href={getGoogleMapsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 flex items-center justify-center px-2 py-1.5 text-xs sm:text-sm bg-amber-500 hover:bg-amber-600 text-white rounded transition-colors"
            >
              <Navigation className="w-3 h-3 mr-1" />
              Directions
            </a>
            
            {shop.phone && (
              <a 
                href={`tel:${shop.phone.replace(/\D/g, '')}`}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 flex items-center justify-center px-2 py-1.5 text-xs sm:text-sm bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
              >
                <Phone className="w-3 h-3 mr-1" />
                Call
              </a>
            )}
            
            {shop.email && (
              <a 
                href={`mailto:${shop.email}`}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 flex items-center justify-center px-2 py-1.5 text-xs sm:text-sm bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
              >
                <Mail className="w-3 h-3 mr-1" />
                Email
              </a>
            )}

            {shop.website && (
              <a 
                href={getWebsiteUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex-1 flex items-center justify-center px-2 py-1.5 text-xs sm:text-sm bg-purple-500 hover:bg-purple-600 text-white rounded transition-colors"
              >
                <ShoppingBag className="w-3 h-3 mr-1" />
                Shop
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Claim Modal */}
      {isClaimModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Claim {shop.name}</h3>
            <p className="text-gray-600 mb-6">
              By claiming this listing, you're indicating that you're the owner or an authorized representative of this business.
            </p>
            
            <form onSubmit={handleClaimSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="fullName">
                  Full Name
                </label>
                <input 
                  type="text" 
                  id="fullName" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                  Business Email
                </label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="phone">
                  Phone Number
                </label>
                <input 
                  type="tel" 
                  id="phone" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsClaimModalOpen(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
                >
                  Submit Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ShopListItem;