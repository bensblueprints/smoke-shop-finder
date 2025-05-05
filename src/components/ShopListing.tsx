import React, { useState, useEffect } from 'react';
import { useShops } from '../context/ShopContext';
import { Shop, BusinessType } from '../types/shop';
import ShopListItem from './ShopListItem';
import FiltersPanel from './FiltersPanel';
import MapView from './MapView';
import ShopDetailView from './ShopDetailView';
import { Search, MapPin, List, Grid3x3, Filter, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface Filters {
  state: string;
  zipCode: string;
  businessTypes: BusinessType[];
  hasCBD: boolean | null;
  hasKratom: boolean | null;
  city?: string;
  searchRadius?: number;
}

// View mode options
type ViewMode = 'list' | 'grid';

// Props interface for ShopListing
interface ShopListingProps {
  showFilters?: boolean;
  initialShopId?: string;
}

const ShopListing: React.FC<ShopListingProps> = ({ 
  showFilters = true,
  initialShopId
}) => {
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

  // Show the specific shop if initialShopId is provided
  useEffect(() => {
    if (initialShopId) {
      const shopToShow = shops.find(shop => shop.id === initialShopId);
      if (shopToShow) {
        setSelectedShop(shopToShow);
      }
    }
  }, [initialShopId, shops]);

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

    // Apply city filter if a city is selected
    if (filters.city && filters.city.trim() !== '') {
      filtered = filtered.filter(shop => 
        shop.city.toLowerCase() === filters.city!.toLowerCase()
      );
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
    <div className="relative min-h-[500px]">
      {/* Search bar */}
      <div className="mb-6 relative">
        <form onSubmit={handleSearchSubmit}>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by shop name, city, state, or ZIP code..."
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search className="h-5 w-5" />
            </div>
            
            {/* Only show mobile filters toggle when filters should be displayed */}
            {showFilters && (
              <button
                type="button"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="md:hidden absolute right-3 top-1/2 transform -translate-y-1/2 bg-indigo-100 text-indigo-700 p-2 rounded-lg"
              >
                {showMobileFilters ? <X className="h-5 w-5" /> : <Filter className="h-5 w-5" />}
              </button>
            )}
          </div>
        </form>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters panel - only displayed if showFilters is true */}
        {showFilters && (
          <div className={`md:w-64 flex-shrink-0 ${showMobileFilters ? 'block' : 'hidden md:block'}`}>
            <FiltersPanel currentFilters={filters} onFilterChange={handleFilterChange} />
          </div>
        )}
        
        {/* Shop listings */}
        <div className="flex-grow">
          {/* View mode toggle */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-gray-700">
                Showing {displayedShops.length > 0 ? ((page - 1) * shopsPerPage) + 1 : 0} - {Math.min(page * shopsPerPage, filteredShops.length)} of {filteredShops.length} shops
              </p>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}
              >
                <List className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}
              >
                <Grid3x3 className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Shop list/grid view */}
          {displayedShops.length > 0 ? (
            <>
              <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}`}>
                {displayedShops.map((shop) => (
                  <ShopListItem 
                    key={shop.id} 
                    shop={shop} 
                    viewMode={viewMode} 
                    onClick={() => handleShopClick(shop)}
                    userLocation={userLocation}
                  />
                ))}
              </div>
              
              {/* Pagination */}
              <div className="mt-8 flex justify-center">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className={`px-4 py-2 rounded-md ${page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md">
                    {page}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(Math.ceil(filteredShops.length / shopsPerPage), p + 1))}
                    disabled={page >= Math.ceil(filteredShops.length / shopsPerPage)}
                    className={`px-4 py-2 rounded-md ${page >= Math.ceil(filteredShops.length / shopsPerPage) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500 text-lg mb-2">No shops found</p>
              <p className="text-gray-400">Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Shop detail modal */}
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