import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import { Icon, LatLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Shop } from '../types/shop';
import { useShops } from '../context/ShopContext';
import { MapPin, Navigation, Phone, Mail, ShoppingBag } from 'lucide-react';

// Fix for default marker icons not displaying in leaflet
let defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface MapViewProps {
  filteredShops: Shop[];
  userLocation: { lat: number, lng: number } | null;
  onShopClick?: (shop: Shop) => void;
}

// Component to set the map view to bounds containing all markers
const SetMapBounds = ({ shops, userLocation }: { shops: Shop[], userLocation: { lat: number, lng: number } | null }) => {
  const map = useMap();

  useEffect(() => {
    if (shops.length === 0) return;

    // Create bounds containing all shop locations
    const bounds = new LatLngBounds([]);
    
    // Add all shop locations to bounds
    shops.forEach(shop => {
      if (shop.latitude && shop.longitude) {
        bounds.extend([shop.latitude, shop.longitude]);
      }
    });

    // Add user location to bounds if available
    if (userLocation) {
      bounds.extend([userLocation.lat, userLocation.lng]);
    }

    // Only adjust bounds if there are points
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, shops, userLocation]);

  return null;
};

const MapView: React.FC<MapViewProps> = ({ filteredShops, userLocation, onShopClick }) => {
  const [defaultCenter, setDefaultCenter] = useState<[number, number]>([39.8283, -98.5795]); // Center of US
  const [defaultZoom, setDefaultZoom] = useState(4);
  const { claimShop } = useShops();
  
  // Format shop phone number
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
  const getGoogleMapsUrl = (shop: Shop) => {
    const address = encodeURIComponent(
      `${shop.address1}, ${shop.city}, ${shop.state} ${shop.zipCode}`
    );
    
    if (userLocation) {
      return `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${address}`;
    }
    
    return `https://www.google.com/maps/search/?api=1&query=${address}`;
  };

  // Get website URL with proper protocol
  const getWebsiteUrl = (website: string) => {
    if (!website) return '';
    return website.startsWith('http') ? website : `https://${website}`;
  };
  
  // Determine center point and zoom if we have user location or shops with coordinates
  useEffect(() => {
    if (userLocation) {
      setDefaultCenter([userLocation.lat, userLocation.lng]);
      setDefaultZoom(11);
    } else if (filteredShops.length > 0 && filteredShops[0].latitude && filteredShops[0].longitude) {
      setDefaultCenter([filteredShops[0].latitude, filteredShops[0].longitude]);
      setDefaultZoom(8);
    }
  }, [userLocation, filteredShops]);

  // Custom marker for user location
  const userIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  // Function to handle the marker click if onShopClick is provided
  const handleMarkerClick = (shop: Shop) => {
    if (onShopClick) {
      onShopClick(shop);
    }
  };

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden shadow-lg border border-gray-200">
      <div className="absolute top-4 left-4 z-10 bg-white px-4 py-2 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
          <MapPin className="w-5 h-5 text-amber-500 mr-2" />
          {filteredShops.length} Shops Found
        </h3>
        {userLocation && (
          <p className="text-sm text-gray-600">
            Showing shops near your location
          </p>
        )}
      </div>
      
      <MapContainer 
        center={defaultCenter} 
        zoom={defaultZoom} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* User location marker with radius */}
        {userLocation && (
          <>
            <Marker 
              position={[userLocation.lat, userLocation.lng]}
              icon={userIcon}
            >
              <Popup>
                <div className="text-center">
                  <p className="font-bold">Your Location</p>
                </div>
              </Popup>
            </Marker>
            <Circle 
              center={[userLocation.lat, userLocation.lng]} 
              radius={5000} 
              pathOptions={{ fillColor: 'blue', fillOpacity: 0.1, color: 'blue', weight: 1 }}
            />
          </>
        )}
        
        {/* Shop markers */}
        {filteredShops.map(shop => {
          // Only create markers for shops with latitude and longitude
          if (!shop.latitude || !shop.longitude) return null;
          
          return (
            <Marker 
              key={shop.id}
              position={[shop.latitude, shop.longitude]}
              icon={defaultIcon}
              eventHandlers={{
                click: () => handleMarkerClick(shop)
              }}
            >
              <Popup>
                <div className="shop-popup" style={{ minWidth: '200px' }}>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{shop.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {shop.address1}<br />
                    {shop.city}, {shop.state} {shop.zipCode}
                  </p>
                  
                  {shop.phone && (
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Phone:</span> {formatPhoneNumber(shop.phone)}
                    </p>
                  )}
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    {shop.hasCBD && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        CBD
                      </span>
                    )}
                    {shop.hasKratom && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Kratom
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <a 
                      href={getGoogleMapsUrl(shop)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center px-2 py-1.5 text-xs bg-amber-500 hover:bg-amber-600 text-white rounded transition-colors"
                    >
                      <Navigation className="w-3 h-3 mr-1" />
                      Directions
                    </a>
                    
                    {shop.phone && (
                      <a 
                        href={`tel:${shop.phone.replace(/\D/g, '')}`}
                        className="flex items-center justify-center px-2 py-1.5 text-xs bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
                      >
                        <Phone className="w-3 h-3 mr-1" />
                        Call
                      </a>
                    )}
                    
                    {shop.email && (
                      <a 
                        href={`mailto:${shop.email}`}
                        className="flex items-center justify-center px-2 py-1.5 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                      >
                        <Mail className="w-3 h-3 mr-1" />
                        Email
                      </a>
                    )}

                    {shop.website && (
                      <a 
                        href={getWebsiteUrl(shop.website)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center px-2 py-1.5 text-xs bg-purple-500 hover:bg-purple-600 text-white rounded transition-colors"
                      >
                        <ShoppingBag className="w-3 h-3 mr-1" />
                        Shop
                      </a>
                    )}
                  </div>
                  
                  {onShopClick && (
                    <div className="mt-3 text-center">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkerClick(shop);
                        }}
                        className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors text-sm font-medium"
                      >
                        View Details
                      </button>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
        
        {/* Component to adjust map view to include all markers */}
        <SetMapBounds shops={filteredShops} userLocation={userLocation} />
      </MapContainer>
    </div>
  );
};

export default MapView; 