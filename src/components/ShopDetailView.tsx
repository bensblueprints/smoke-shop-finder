import React, { useState } from 'react';
import { Shop, businessTypeLabels } from '../types/shop';
import { 
  MapPin, Phone, Globe, Clock, X, Navigation, Mail, 
  ShoppingBag, Star, Facebook, Instagram, Twitter, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface ShopDetailViewProps {
  shop: Shop;
  onClose: () => void;
  userLocation: { lat: number, lng: number } | null;
}

// Sample shop photos (in real app these would come from the shop data)
const samplePhotos = [
  'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
  'https://images.unsplash.com/photo-1582225773146-8a0aed28b5c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1769&q=80',
  'https://images.unsplash.com/photo-1613908614131-c88f0b03992e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
  'https://images.unsplash.com/photo-1563766182214-5727557ee2a3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
];

// Custom marker icon
const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const ShopDetailView: React.FC<ShopDetailViewProps> = ({ shop, onClose, userLocation }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'details' | 'photos' | 'map'>('details');
  
  // Format phone number
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

  // Get Google Maps directions URL
  const getGoogleMapsUrl = () => {
    const address = encodeURIComponent(
      `${shop.address1}, ${shop.city}, ${shop.state} ${shop.zipCode}`
    );
    
    if (userLocation) {
      return `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${address}`;
    }
    
    return `https://www.google.com/maps/search/?api=1&query=${address}`;
  };

  // Get website URL with proper protocol
  const getWebsiteUrl = () => {
    if (!shop.website) return '';
    return shop.website.startsWith('http') ? shop.website : `https://${shop.website}`;
  };

  // Next photo
  const showNextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev === samplePhotos.length - 1 ? 0 : prev + 1));
  };

  // Previous photo
  const showPrevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev === 0 ? samplePhotos.length - 1 : prev - 1));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">{shop.name}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Tab navigation */}
        <div className="flex border-b border-gray-200">
          <button 
            className={`px-4 py-2 font-medium ${activeTab === 'details' ? 'border-b-2 border-amber-500 text-amber-500' : 'text-gray-600'}`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          <button 
            className={`px-4 py-2 font-medium ${activeTab === 'photos' ? 'border-b-2 border-amber-500 text-amber-500' : 'text-gray-600'}`}
            onClick={() => setActiveTab('photos')}
          >
            Photos
          </button>
          <button 
            className={`px-4 py-2 font-medium ${activeTab === 'map' ? 'border-b-2 border-amber-500 text-amber-500' : 'text-gray-600'}`}
            onClick={() => setActiveTab('map')}
          >
            Map
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-grow overflow-y-auto">
          {/* Details tab */}
          {activeTab === 'details' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left column */}
                <div>
                  {/* Basic info */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">About {shop.name}</h3>
                    <p className="text-gray-600 mb-4">
                      {shop.name} is a {businessTypeLabels[shop.businessType]} located in {shop.city}, {shop.state}.
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
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
                    </div>
                  </div>
                  
                  {/* Contact info */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Contact Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                        <p className="text-gray-600">
                          {shop.address1}<br />
                          {shop.address2 && `${shop.address2}`}
                          {shop.address2 && <br />}
                          {shop.city}, {shop.state} {shop.zipCode}
                        </p>
                      </div>
                      
                      {shop.phone && (
                        <div className="flex items-center">
                          <Phone className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                          <p className="text-gray-600">{formatPhoneNumber(shop.phone)}</p>
                        </div>
                      )}
                      
                      {shop.email && (
                        <div className="flex items-center">
                          <Mail className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                          <a 
                            href={`mailto:${shop.email}`}
                            className="text-blue-600 hover:underline"
                          >
                            {shop.email}
                          </a>
                        </div>
                      )}
                      
                      {shop.website && (
                        <div className="flex items-center">
                          <Globe className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                          <a 
                            href={getWebsiteUrl()}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {shop.website.replace(/^https?:\/\//, '')}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Right column */}
                <div>
                  {/* Hours (sample) */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Business Hours</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monday - Friday</span>
                        <span className="text-gray-800 font-medium">9:00 AM - 8:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Saturday</span>
                        <span className="text-gray-800 font-medium">10:00 AM - 6:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sunday</span>
                        <span className="text-gray-800 font-medium">12:00 PM - 5:00 PM</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Social media (sample) */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Follow Us</h3>
                    <div className="flex space-x-4">
                      <a href="#" className="text-gray-600 hover:text-blue-600">
                        <Facebook size={24} />
                      </a>
                      <a href="#" className="text-gray-600 hover:text-pink-600">
                        <Instagram size={24} />
                      </a>
                      <a href="#" className="text-gray-600 hover:text-blue-400">
                        <Twitter size={24} />
                      </a>
                    </div>
                  </div>
                  
                  {/* Reviews (sample) */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Customer Reviews</h3>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={18} 
                          className={i < 4 ? "text-amber-500 fill-amber-500" : "text-gray-300"} 
                        />
                      ))}
                      <span className="ml-2 text-gray-600">4.0 out of 5</span>
                    </div>
                    <p className="text-gray-600 text-sm">Based on 16 reviews</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Photos tab */}
          {activeTab === 'photos' && (
            <div className="p-6">
              <div className="relative h-[400px] overflow-hidden rounded-lg mb-4">
                <img 
                  src={samplePhotos[currentPhotoIndex]} 
                  alt={`${shop.name} - Photo ${currentPhotoIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Photo navigation controls */}
                <button
                  onClick={showPrevPhoto}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-70"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={showNextPhoto}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-70"
                >
                  <ChevronRight size={24} />
                </button>
                
                {/* Photo indicator */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 px-2 py-1 rounded-full text-white text-xs">
                  {currentPhotoIndex + 1} / {samplePhotos.length}
                </div>
              </div>
              
              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-2">
                {samplePhotos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPhotoIndex(index)}
                    className={`rounded-lg overflow-hidden border-2 ${
                      currentPhotoIndex === index ? 'border-amber-500' : 'border-transparent'
                    }`}
                  >
                    <img 
                      src={photo} 
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Map tab */}
          {activeTab === 'map' && (
            <div className="h-[500px]">
              {shop.latitude && shop.longitude && (
                <MapContainer 
                  center={[shop.latitude, shop.longitude]} 
                  zoom={15} 
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker 
                    position={[shop.latitude, shop.longitude]}
                    icon={defaultIcon}
                  >
                    <Popup>
                      <div className="text-center">
                        <p className="font-bold">{shop.name}</p>
                        <p className="text-sm">{shop.address1}</p>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              )}
            </div>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="border-t border-gray-200 p-4 flex flex-wrap gap-2">
          <a 
            href={getGoogleMapsUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded transition-colors"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Directions
          </a>
          
          {shop.phone && (
            <a 
              href={`tel:${shop.phone.replace(/\D/g, '')}`}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call
            </a>
          )}
          
          {shop.email && (
            <a 
              href={`mailto:${shop.email}`}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </a>
          )}
          
          {shop.website && (
            <a 
              href={getWebsiteUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded transition-colors"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Shop
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopDetailView; 