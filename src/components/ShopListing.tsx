import React, { useState, useEffect } from 'react';
import { useShops } from '../context/ShopContext';
import { Shop } from '../types/shop';
import ShopListItem from './ShopListItem';
import FiltersPanel from './FiltersPanel';
import MapView from './MapView';
import ShopDetailView from './ShopDetailView';
import { Search, MapPin, List, Grid3x3, Filter, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface Filters {
  state: string;
  zipCode: string;
  businessTypes: string[];
  hasCBD: boolean | null;
  hasKratom: boolean | null;
}

// View mode options
type ViewMode = 'list' | 'grid';

const ShopListing: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { shops, searchTerm, setSearchTerm } = useShops();
  const [filteredShops, setFilteredShops] = useState<Shop[]>(shops);
  const [displayedShops, setDisplayedShops] = useState<Shop[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [page, setPage] = useState(1);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const shopsPerPage = 20;
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationStatus, setLocationStatus] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    state: '',
    zipCode: '',
    businessTypes: [],
    hasCBD: null,
    hasKratom: null
  });

  // Parse query parameters from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const stateParam = params.get('state');
    const zipParam = params.get('zip');
    const searchParam = params.get('q');
    
    // Set filter values based on URL parameters
    if (stateParam) {
      setFilters(prev => ({ ...prev, state: stateParam }));
    }
    
    if (zipParam) {
      setFilters(prev => ({ ...prev, zipCode: zipParam }));
    }
    
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [location.search, setSearchTerm]);

  // Request user location when component mounts
  useEffect(() => {
    if ('geolocation' in navigator) {
      setLocationStatus('Detecting your location...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ 
            lat: position.coords.latitude, 
            lng: position.coords.longitude 
          });
          setLocationStatus('Location detected!');
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationStatus('Could not get your location.');
        }
      );
    } else {
      setLocationStatus('Geolocation is not supported by your browser.');
    }
  }, []);

  // Calculate distance between two coordinates
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 3958.8; // Radius of the Earth in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in miles
    return distance;
  };

  // Get shops within a radius of a ZIP code
  const getShopsWithinRadiusOfZip = (zipCode: string, shops: Shop[], radiusInMiles: number = 50): Shop[] => {
    // First, find a shop with this exact ZIP code to use as a center point
    const centerShop = shops.find(shop => shop.zipCode === zipCode);
    
    if (centerShop && centerShop.latitude && centerShop.longitude) {
      // Use the found shop's coordinates as the center
      const centerLat = centerShop.latitude;
      const centerLng = centerShop.longitude;
      
      // Filter shops within the radius
      return shops.filter(shop => {
        if (!shop.latitude || !shop.longitude) return false;
        
        const distance = calculateDistance(
          centerLat, centerLng,
          shop.latitude, shop.longitude
        );
        
        return distance <= radiusInMiles;
      });
    } else {
      // If no center shop found, just return shops that start with the ZIP code
      // (this is a fallback and less accurate)
      return shops.filter(shop => shop.zipCode.startsWith(zipCode));
    }
  };

  // Filter shops based on search term and other filters
  useEffect(() => {
    let filtered = [...shops];

    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(shop => 
        shop.name.toLowerCase().includes(term) || 
        shop.city.toLowerCase().includes(term) || 
        shop.state.toLowerCase().includes(term) || 
        shop.zipCode.includes(term)
      );
    }

    // Apply state filter
    if (filters.state) {
      filtered = filtered.filter(shop => shop.state === filters.state);
    }

    // Apply zip code filter with radius
    if (filters.zipCode) {
      filtered = getShopsWithinRadiusOfZip(filters.zipCode, filtered);
    }

    // Apply business type filter
    if (filters.businessTypes.length > 0) {
      filtered = filtered.filter(shop => 
        filters.businessTypes.includes(shop.businessType)
      );
    }

    // Apply CBD filter
    if (filters.hasCBD !== null) {
      filtered = filtered.filter(shop => shop.hasCBD === filters.hasCBD);
    }

    // Apply Kratom filter
    if (filters.hasKratom !== null) {
      filtered = filtered.filter(shop => shop.hasKratom === filters.hasKratom);
    }

    setFilteredShops(filtered);
    setPage(1); // Reset to first page when filters change
  }, [filters, shops, searchTerm]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.state) {
      params.set('state', filters.state);
    }
    
    if (filters.zipCode) {
      params.set('zip', filters.zipCode);
    }
    
    if (searchTerm) {
      params.set('q', searchTerm);
    }
    
    const queryString = params.toString();
    if (queryString) {
      navigate(`/?${queryString}`, { replace: true });
    } else if (location.search) {
      navigate('/', { replace: true });
    }
  }, [filters.state, filters.zipCode, searchTerm, navigate, location.search]);

  // Paginate shops
  useEffect(() => {
    const startIndex = (page - 1) * shopsPerPage;
    const endIndex = startIndex + shopsPerPage;
    setDisplayedShops(filteredShops.slice(startIndex, endIndex));
  }, [filteredShops, page]);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is automatically applied via the useEffect
  };

  const handleShopClick = (shop: Shop) => {
    setSelectedShop(shop);
  };

  const closeShopDetail = () => {
    setSelectedShop(null);
  };

  const totalPages = Math.ceil(filteredShops.length / shopsPerPage);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Main search bar */}
      <div className="mb-6 max-w-4xl mx-auto">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search by name, city, state, or zip code..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full py-3 px-4 pr-12 rounded-full border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-opacity-30 text-lg shadow-sm transition-all duration-200"
            />
            <button type="submit" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search size={20} />
            </button>
          </div>
          
          <button 
            type="button"
            className="md:hidden flex items-center px-4 py-2 bg-amber-500 text-white rounded-full shadow-sm hover:bg-amber-600 transition-colors"
            onClick={() => setShowMobileFilters(true)}
          >
            <Filter size={18} className="mr-2" />
            Filters
          </button>
        </form>
      </div>

      {/* Map view - always visible */}
      <div className="mb-6">
        <MapView 
          filteredShops={filteredShops.slice(0, 500)} // Limit to 500 for performance
          userLocation={userLocation}
          onShopClick={handleShopClick}
        />
      </div>

      {userLocation && (
        <div className="mb-4 text-center text-sm text-green-600">
          <MapPin className="inline-block w-4 h-4 mr-1" /> {locationStatus}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobile filters overlay */}
        {showMobileFilters && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
            <div className="bg-white h-full w-5/6 max-w-md p-4 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Filters</h3>
                <button 
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
              <FiltersPanel onFilterChange={handleFilterChange} />
              <div className="mt-4">
                <button 
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Desktop filters sidebar */}
        <div className="hidden lg:block lg:w-1/4">
          <div className="sticky top-4">
            <FiltersPanel onFilterChange={handleFilterChange} />
          </div>
        </div>
        
        <div className="lg:w-3/4">
          <div className="bg-white rounded-lg shadow-md p-6 mb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {filteredShops.length} Shops Found
                </h2>
                {(filters.state || filters.zipCode) && (
                  <p className="text-gray-600 mt-1">
                    {filters.state && `Showing results in ${filters.state}`}
                    {filters.zipCode && (filters.state ? ' near ' : 'Near ') + filters.zipCode}
                    {filters.zipCode && ' (50 mile radius)'}
                  </p>
                )}
              </div>
              
              <div className="mt-2 sm:mt-0 flex items-center">
                <span className="mr-2 text-sm text-gray-500">View:</span>
                <div className="flex border border-gray-200 rounded-md overflow-hidden">
                  <button 
                    onClick={() => setViewMode('list')} 
                    className={`p-2 ${viewMode === 'list' ? 'bg-amber-500 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                    title="List view"
                  >
                    <List size={18} />
                  </button>
                  <button 
                    onClick={() => setViewMode('grid')} 
                    className={`p-2 ${viewMode === 'grid' ? 'bg-amber-500 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                    title="Grid view"
                  >
                    <Grid3x3 size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Banner ad slot */}
            <div className="mb-6 bg-amber-50 p-4 border border-amber-100 rounded-lg text-center">
              <p className="text-amber-800 font-medium">Premium Ad Space</p>
              <p className="text-gray-600 text-sm">Promote your business here. Contact us for details.</p>
            </div>
            
            {filteredShops.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 gap-4" 
                : "space-y-4"
              }>
                {displayedShops.map(shop => (
                  <ShopListItem 
                    key={shop.id} 
                    shop={shop} 
                    gridView={viewMode === 'grid'}
                    userLocation={userLocation}
                    onClick={() => handleShopClick(shop)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No shops found matching your criteria.</p>
                <button 
                  onClick={() => {
                    setFilters({
                      state: '',
                      zipCode: '',
                      businessTypes: [],
                      hasCBD: null,
                      hasKratom: null
                    });
                    setSearchTerm('');
                  }}
                  className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="inline-flex rounded-md shadow">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                      page === 1 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    } border border-gray-300`}
                  >
                    Previous
                  </button>
                  
                  <div className="px-4 py-2 bg-amber-500 text-white text-sm font-medium border border-amber-600">
                    {page} of {totalPages}
                  </div>
                  
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                      page === totalPages 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    } border border-gray-300`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Shop Detail Modal */}
      {selectedShop && (
        <ShopDetailView 
          shop={selectedShop} 
          onClose={closeShopDetail}
          userLocation={userLocation}
        />
      )}
    </div>
  );
};

export default ShopListing;