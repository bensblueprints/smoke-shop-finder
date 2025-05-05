import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useShops } from '../context/ShopContext';
import { BusinessType, businessTypeLabels } from '../types/shop';
import { Filter, RefreshCw, MapPin, Leaf, Activity, ChevronDown, ChevronUp, X, Ruler, ShoppingBag } from 'lucide-react';
import CityFilter from './CityFilter';
import { useNavigate, useLocation } from 'react-router-dom';

// Debounce helper function
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

interface Filters {
  state: string;
  zipCode: string;
  businessTypes: BusinessType[];
  hasCBD: boolean | null;
  hasKratom: boolean | null;
  city?: string;
  searchRadius?: number;
  productCategories?: string[];
}

interface FiltersPanelProps {
  onFilterChange: (filters: Filters) => void;
  currentFilters?: Filters;
}

// Complete list of US states with their abbreviations
const allStates = [
  { name: 'Alabama', abbr: 'AL' },
  { name: 'Alaska', abbr: 'AK' },
  { name: 'Arizona', abbr: 'AZ' },
  { name: 'Arkansas', abbr: 'AR' },
  { name: 'California', abbr: 'CA' },
  { name: 'Colorado', abbr: 'CO' },
  { name: 'Connecticut', abbr: 'CT' },
  { name: 'Delaware', abbr: 'DE' },
  { name: 'Florida', abbr: 'FL' },
  { name: 'Georgia', abbr: 'GA' },
  { name: 'Hawaii', abbr: 'HI' },
  { name: 'Idaho', abbr: 'ID' },
  { name: 'Illinois', abbr: 'IL' },
  { name: 'Indiana', abbr: 'IN' },
  { name: 'Iowa', abbr: 'IA' },
  { name: 'Kansas', abbr: 'KS' },
  { name: 'Kentucky', abbr: 'KY' },
  { name: 'Louisiana', abbr: 'LA' },
  { name: 'Maine', abbr: 'ME' },
  { name: 'Maryland', abbr: 'MD' },
  { name: 'Massachusetts', abbr: 'MA' },
  { name: 'Michigan', abbr: 'MI' },
  { name: 'Minnesota', abbr: 'MN' },
  { name: 'Mississippi', abbr: 'MS' },
  { name: 'Missouri', abbr: 'MO' },
  { name: 'Montana', abbr: 'MT' },
  { name: 'Nebraska', abbr: 'NE' },
  { name: 'Nevada', abbr: 'NV' },
  { name: 'New Hampshire', abbr: 'NH' },
  { name: 'New Jersey', abbr: 'NJ' },
  { name: 'New Mexico', abbr: 'NM' },
  { name: 'New York', abbr: 'NY' },
  { name: 'North Carolina', abbr: 'NC' },
  { name: 'North Dakota', abbr: 'ND' },
  { name: 'Ohio', abbr: 'OH' },
  { name: 'Oklahoma', abbr: 'OK' },
  { name: 'Oregon', abbr: 'OR' },
  { name: 'Pennsylvania', abbr: 'PA' },
  { name: 'Rhode Island', abbr: 'RI' },
  { name: 'South Carolina', abbr: 'SC' },
  { name: 'South Dakota', abbr: 'SD' },
  { name: 'Tennessee', abbr: 'TN' },
  { name: 'Texas', abbr: 'TX' },
  { name: 'Utah', abbr: 'UT' },
  { name: 'Vermont', abbr: 'VT' },
  { name: 'Virginia', abbr: 'VA' },
  { name: 'Washington', abbr: 'WA' },
  { name: 'West Virginia', abbr: 'WV' },
  { name: 'Wisconsin', abbr: 'WI' },
  { name: 'Wyoming', abbr: 'WY' },
  { name: 'District of Columbia', abbr: 'DC' }
];

// Product category groups
const productCategories = {
  cannabinoids: [
    { id: 'delta8', label: 'Delta 8' },
    { id: 'delta9', label: 'Delta 9' },
    { id: 'thca', label: 'THCA' },
    { id: 'thcp', label: 'THCP' },
    { id: 'hhc', label: 'HHC' },
    { id: 'cbd', label: 'CBD' },
    { id: 'cbg', label: 'CBG' },
    { id: 'cbn', label: 'CBN' },
  ],
  formats: [
    { id: 'flower', label: 'Flower' },
    { id: 'vapes', label: 'Vapes' },
    { id: 'edibles', label: 'Edibles' },
    { id: 'concentrates', label: 'Concentrates' },
    { id: 'tinctures', label: 'Tinctures' },
    { id: 'topicals', label: 'Topicals' },
    { id: 'prerolls', label: 'Pre-Rolls' },
  ],
  alternatives: [
    { id: 'kratom', label: 'Kratom' },
    { id: 'kava', label: 'Kava' },
    { id: 'mushrooms', label: 'Mushrooms' },
    { id: 'supplements', label: 'Supplements' },
    { id: 'herbal', label: 'Herbal Blends' },
  ],
  accessories: [
    { id: 'papers', label: 'Rolling Papers' },
    { id: 'bongs', label: 'Bongs & Water Pipes' },
    { id: 'pipes', label: 'Pipes' },
    { id: 'grinders', label: 'Grinders' },
    { id: 'lighters', label: 'Lighters' },
    { id: 'dabRigs', label: 'Dab Rigs' },
    { id: 'storage', label: 'Storage' },
    { id: 'rolling', label: 'Rolling Accessories' },
  ],
  tobacco: [
    { id: 'cigarettes', label: 'Cigarettes' },
    { id: 'cigars', label: 'Cigars' },
    { id: 'hookah', label: 'Hookah' },
    { id: 'pipe', label: 'Pipe Tobacco' },
    { id: 'chewing', label: 'Chewing Tobacco' },
  ]
};

const FiltersPanel: React.FC<FiltersPanelProps> = ({ onFilterChange, currentFilters }) => {
  const { shops } = useShops();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedState, setSelectedState] = useState<string>(currentFilters?.state || '');
  const [selectedCity, setSelectedCity] = useState<string>(currentFilters?.city || '');
  const [zipCode, setZipCode] = useState<string>(currentFilters?.zipCode || '');
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>(currentFilters?.businessTypes || []);
  const [hasCBD, setHasCBD] = useState<boolean | null>(currentFilters?.hasCBD !== undefined ? currentFilters.hasCBD : null);
  const [hasKratom, setHasKratom] = useState<boolean | null>(currentFilters?.hasKratom !== undefined ? currentFilters.hasKratom : null);
  const [isOpen, setIsOpen] = useState(true);
  const [showCityFilter, setShowCityFilter] = useState(false);
  const [searchRadius, setSearchRadius] = useState<number>(currentFilters?.searchRadius || 50);
  
  // Product filters
  const [selectedProductCategories, setSelectedProductCategories] = useState<string[]>(currentFilters?.productCategories || []);
  
  // UI section toggles - all expanded by default
  const [stateOpen, setStateOpen] = useState(true);
  const [productOpen, setProductOpen] = useState(true);
  const [businessOpen, setBusinessOpen] = useState(true);
  const [radiusOpen, setRadiusOpen] = useState(true);
  
  // Product category section toggles
  const [cannabinoidsOpen, setCannabinoidsOpen] = useState(false);
  const [formatsOpen, setFormatsOpen] = useState(false);
  const [alternativesOpen, setAlternativesOpen] = useState(false);
  const [accessoriesOpen, setAccessoriesOpen] = useState(false);
  const [tobaccoOpen, setTobaccoOpen] = useState(false);

  // Debounce filter changes to prevent excessive updates
  const debouncedZipCode = useDebounce(zipCode, 500);
  const debouncedSearchRadius = useDebounce(searchRadius, 300);

  // Get unique states from shops with shop counts - memoized
  const statesWithCounts = useMemo(() => {
    const stateCounts: Record<string, number> = {};
    shops.forEach(shop => {
      if (shop.state) {
        stateCounts[shop.state] = (stateCounts[shop.state] || 0) + 1;
      }
    });
    
    return allStates.map(state => ({
      ...state,
      count: stateCounts[state.abbr] || 0
    }));
  }, [shops]);

  // Create a memoized filters object to prevent redundant updates
  const filtersObject = useMemo(() => ({
    state: selectedState,
    city: selectedCity,
    zipCode: debouncedZipCode,
    searchRadius: debouncedSearchRadius,
    businessTypes,
    hasCBD,
    hasKratom,
    productCategories: selectedProductCategories
  }), [
    selectedState, 
    selectedCity, 
    debouncedZipCode, 
    debouncedSearchRadius, 
    businessTypes, 
    hasCBD, 
    hasKratom, 
    selectedProductCategories
  ]);

  // Async filter processing
  useEffect(() => {
    const processFilters = async () => {
      // Simulate asynchronous processing
      await new Promise(resolve => setTimeout(resolve, 0));
      onFilterChange(filtersObject);
    };
    
    processFilters();
  }, [filtersObject, onFilterChange]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filtersObject.state) {
      params.set('state', filtersObject.state);
    }
    
    if (filtersObject.city) {
      params.set('city', filtersObject.city);
    }
    
    if (filtersObject.zipCode) {
      params.set('zip', filtersObject.zipCode);
    }
    
    const queryString = params.toString();
    if (queryString) {
      navigate(`/?${queryString}`, { replace: true });
    } else if (location.search) {
      navigate('/', { replace: true });
    }
  }, [filtersObject.state, filtersObject.city, filtersObject.zipCode, navigate, location.search]);

  // Parse URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const stateParam = params.get('state');
    const cityParam = params.get('city');
    const zipParam = params.get('zip');
    
    if (stateParam && stateParam !== selectedState) {
      setSelectedState(stateParam);
    }
    
    if (cityParam && cityParam !== selectedCity) {
      setSelectedCity(cityParam);
    }
    
    if (zipParam && zipParam !== zipCode) {
      setZipCode(zipParam);
    }
  }, [location.search, selectedState, selectedCity, zipCode]);

  const toggleFilters = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleStateChange = useCallback((stateCode: string) => {
    // Run this asynchronously
    setTimeout(() => {
      setSelectedState(stateCode);
      setSelectedCity(''); // Clear city when state changes
      setZipCode(''); // Clear zip code when state changes
      if (stateCode) {
        setShowCityFilter(true);
      }
    }, 0);
  }, []);

  const handleCitySelect = useCallback((city: string) => {
    // Update the city filter and ensure it's properly applied
    setSelectedCity(city);
    setShowCityFilter(false);
    
    // Make sure the parent component knows about the city change immediately
    // This ensures city filtering gets applied properly
    onFilterChange({
      ...filtersObject,
      city
    });
  }, [filtersObject, onFilterChange]);

  const handleZipCodeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setZipCode(value);
    
    // Asynchronously clear other filters
    if (value) {
      setTimeout(() => {
        setSelectedState('');
        setSelectedCity('');
      }, 0);
    }
  }, []);

  const handleRadiusChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchRadius(parseInt(e.target.value));
  }, []);

  const handleBusinessTypeToggle = useCallback((type: BusinessType) => {
    setBusinessTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  }, []);

  const handleCBDChange = useCallback((hasCBD: boolean | null) => {
    setHasCBD(hasCBD);
  }, []);

  const handleKratomChange = useCallback((hasKratom: boolean | null) => {
    setHasKratom(hasKratom);
  }, []);

  const handleProductCategoryToggle = useCallback((categoryId: string) => {
    setSelectedProductCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  }, []);

  const resetFilters = useCallback(() => {
    // Reset all filter states
    setSelectedState('');
    setSelectedCity('');
    setZipCode('');
    setSearchRadius(50);
    setBusinessTypes([]);
    setHasCBD(null);
    setHasKratom(null);
    setSelectedProductCategories([]);
    
    // Immediately notify the parent component of the reset
    onFilterChange({
      state: '',
      city: '',
      zipCode: '',
      searchRadius: 50,
      businessTypes: [],
      hasCBD: null,
      hasKratom: null,
      productCategories: []
    });
    
    // Clear URL parameters
    navigate('/', { replace: true });
  }, [onFilterChange, navigate]);

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (businessTypes.length > 0) count++;
    if (hasCBD !== null) count++;
    if (hasKratom !== null) count++;
    if (selectedState !== '') count++;
    if (selectedCity !== '') count++;
    if (zipCode !== '') count++;
    if (searchRadius !== 50) count++;
    if (selectedProductCategories.length > 0) count++;
    return count;
  }, [
    businessTypes.length,
    hasCBD,
    hasKratom,
    selectedState,
    selectedCity,
    zipCode,
    searchRadius,
    selectedProductCategories.length
  ]);

  // Function to clear the selected city
  const clearCityFilter = useCallback(() => {
    setSelectedCity('');
  }, []);

  return (
    <div className="my-4 bg-white rounded-lg shadow-lg border border-purple-100">
      <button
        onClick={toggleFilters}
        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-t-lg hover:from-purple-700 hover:to-purple-900 transition-colors duration-200"
      >
        <div className="flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          <span className="font-medium">Filter Shops</span>
          {activeFiltersCount > 0 && (
            <span className="ml-2 bg-white text-purple-800 text-xs px-2 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <span>{isOpen ? "Hide" : "Show"}</span>
      </button>

      {isOpen && (
        <div className="p-5 border-t border-purple-100">
          <div className="space-y-6">
            {/* States and Location */}
            <div className="border-b border-purple-100 pb-4">
              <div 
                onClick={() => setStateOpen(!stateOpen)}
                className="flex justify-between items-center cursor-pointer mb-3"
              >
                <h3 className="font-medium text-purple-900 flex items-center">
                  <MapPin className="h-4 w-4 text-purple-600 mr-2" />
                  Location
                </h3>
                {stateOpen ? <ChevronUp className="h-4 w-4 text-purple-600" /> : <ChevronDown className="h-4 w-4 text-purple-600" />}
              </div>
              
              {stateOpen && (
                <div className="space-y-4">
                  <div>
                    {/* Selected State & City Display */}
                    {selectedState && (
                      <div className="bg-purple-50 p-3 rounded-lg mb-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-sm text-purple-800 font-medium">
                              {allStates.find(s => s.abbr === selectedState)?.name || selectedState}
                            </span>
                            {selectedCity && (
                              <span className="text-sm text-purple-800 font-medium ml-2">
                                &gt; {selectedCity}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStateChange('');
                            }}
                            className="text-purple-600 hover:text-purple-800"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* States Grid */}
                    {!selectedState && (
                      <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto p-1">
                        {statesWithCounts
                          .sort((a, b) => b.count - a.count) // Sort by shop count
                          .map(state => (
                          <button
                            key={state.abbr}
                            onClick={() => handleStateChange(state.abbr)}
                            className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 
                                     p-2 rounded-md text-left transition-colors text-sm"
                          >
                            <span className="text-purple-700">{state.abbr}</span>
                            {state.count > 0 && (
                              <span className="bg-purple-600 text-white text-xs rounded-full px-1.5 py-0.5">
                                {state.count}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Zip Code */}
                  <div>
                    <label className="block text-sm text-purple-700 mb-1">ZIP Code Search</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={zipCode}
                        onChange={handleZipCodeChange}
                        placeholder="Enter zip code"
                        className="w-full px-3 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
                        disabled={!!selectedState}
                      />
                      {zipCode && (
                        <button
                          onClick={() => setZipCode('')}
                          className="p-2 bg-purple-100 text-purple-600 rounded-md hover:bg-purple-200"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mileage Radius Slider */}
            <div className="border-b border-purple-100 pb-4">
              <div 
                onClick={() => setRadiusOpen(!radiusOpen)}
                className="flex justify-between items-center cursor-pointer mb-3"
              >
                <h3 className="font-medium text-purple-900 flex items-center">
                  <Ruler className="h-4 w-4 text-purple-600 mr-2" />
                  Mileage Radius
                </h3>
                {radiusOpen ? <ChevronUp className="h-4 w-4 text-purple-600" /> : <ChevronDown className="h-4 w-4 text-purple-600" />}
              </div>
              
              {radiusOpen && (
                <div className="px-1">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs text-purple-700">5 miles</span>
                    <span className="text-xs text-purple-700">100 miles</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={searchRadius}
                    onChange={handleRadiusChange}
                    className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <div className="text-center mt-2">
                    <span className="bg-purple-600 text-white text-sm px-2 py-1 rounded-md">
                      {searchRadius} mile{searchRadius !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    {zipCode ? `Searching ${searchRadius} miles around ${zipCode}` : 'Enter a ZIP code above to use radius search'}
                  </p>
                </div>
              )}
            </div>

            {/* Product Filters - Enhanced with more categories */}
            <div className="border-b border-purple-100 pb-4">
              <div 
                onClick={() => setProductOpen(!productOpen)}
                className="flex justify-between items-center cursor-pointer mb-3"
              >
                <h3 className="font-medium text-purple-900 flex items-center">
                  <ShoppingBag className="h-4 w-4 text-purple-600 mr-2" />
                  Product Categories
                </h3>
                {productOpen ? <ChevronUp className="h-4 w-4 text-purple-600" /> : <ChevronDown className="h-4 w-4 text-purple-600" />}
              </div>
              
              {productOpen && (
                <div className="space-y-4">
                  {/* Product category sections */}
                  <div className="bg-purple-50 rounded-md overflow-hidden">
                    <div 
                      onClick={() => setCannabinoidsOpen(!cannabinoidsOpen)}
                      className="flex justify-between items-center p-3 cursor-pointer bg-purple-100 hover:bg-purple-200 transition-colors"
                    >
                      <h4 className="text-sm font-medium text-purple-800">Cannabinoids</h4>
                      {cannabinoidsOpen ? 
                        <ChevronUp className="h-3 w-3 text-purple-600" /> : 
                        <ChevronDown className="h-3 w-3 text-purple-600" />
                      }
                    </div>
                    
                    {cannabinoidsOpen && (
                      <div className="p-3 grid grid-cols-2 gap-1">
                        {productCategories.cannabinoids.map(category => (
                          <label key={category.id} className="flex items-center cursor-pointer hover:bg-purple-100 p-1 rounded-md transition-colors">
                            <input
                              type="checkbox"
                              checked={selectedProductCategories.includes(category.id)}
                              onChange={() => handleProductCategoryToggle(category.id)}
                              className="h-4 w-4 text-purple-500 border-gray-300 rounded focus:ring-purple-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{category.label}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-green-50 rounded-md overflow-hidden">
                    <div 
                      onClick={() => setFormatsOpen(!formatsOpen)}
                      className="flex justify-between items-center p-3 cursor-pointer bg-green-100 hover:bg-green-200 transition-colors"
                    >
                      <h4 className="text-sm font-medium text-green-800">Product Formats</h4>
                      {formatsOpen ? 
                        <ChevronUp className="h-3 w-3 text-green-600" /> : 
                        <ChevronDown className="h-3 w-3 text-green-600" />
                      }
                    </div>
                    
                    {formatsOpen && (
                      <div className="p-3 grid grid-cols-2 gap-1">
                        {productCategories.formats.map(category => (
                          <label key={category.id} className="flex items-center cursor-pointer hover:bg-green-100 p-1 rounded-md transition-colors">
                            <input
                              type="checkbox"
                              checked={selectedProductCategories.includes(category.id)}
                              onChange={() => handleProductCategoryToggle(category.id)}
                              className="h-4 w-4 text-green-500 border-gray-300 rounded focus:ring-green-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{category.label}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-blue-50 rounded-md overflow-hidden">
                    <div 
                      onClick={() => setAlternativesOpen(!alternativesOpen)}
                      className="flex justify-between items-center p-3 cursor-pointer bg-blue-100 hover:bg-blue-200 transition-colors"
                    >
                      <h4 className="text-sm font-medium text-blue-800">Alternative Products</h4>
                      {alternativesOpen ? 
                        <ChevronUp className="h-3 w-3 text-blue-600" /> : 
                        <ChevronDown className="h-3 w-3 text-blue-600" />
                      }
                    </div>
                    
                    {alternativesOpen && (
                      <div className="p-3 grid grid-cols-2 gap-1">
                        {productCategories.alternatives.map(category => (
                          <label key={category.id} className="flex items-center cursor-pointer hover:bg-blue-100 p-1 rounded-md transition-colors">
                            <input
                              type="checkbox"
                              checked={selectedProductCategories.includes(category.id)}
                              onChange={() => handleProductCategoryToggle(category.id)}
                              className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{category.label}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-amber-50 rounded-md overflow-hidden">
                    <div 
                      onClick={() => setAccessoriesOpen(!accessoriesOpen)}
                      className="flex justify-between items-center p-3 cursor-pointer bg-amber-100 hover:bg-amber-200 transition-colors"
                    >
                      <h4 className="text-sm font-medium text-amber-800">Accessories</h4>
                      {accessoriesOpen ? 
                        <ChevronUp className="h-3 w-3 text-amber-600" /> : 
                        <ChevronDown className="h-3 w-3 text-amber-600" />
                      }
                    </div>
                    
                    {accessoriesOpen && (
                      <div className="p-3 grid grid-cols-2 gap-1">
                        {productCategories.accessories.map(category => (
                          <label key={category.id} className="flex items-center cursor-pointer hover:bg-amber-100 p-1 rounded-md transition-colors">
                            <input
                              type="checkbox"
                              checked={selectedProductCategories.includes(category.id)}
                              onChange={() => handleProductCategoryToggle(category.id)}
                              className="h-4 w-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{category.label}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 rounded-md overflow-hidden">
                    <div 
                      onClick={() => setTobaccoOpen(!tobaccoOpen)}
                      className="flex justify-between items-center p-3 cursor-pointer bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <h4 className="text-sm font-medium text-gray-800">Tobacco Products</h4>
                      {tobaccoOpen ? 
                        <ChevronUp className="h-3 w-3 text-gray-600" /> : 
                        <ChevronDown className="h-3 w-3 text-gray-600" />
                      }
                    </div>
                    
                    {tobaccoOpen && (
                      <div className="p-3 grid grid-cols-2 gap-1">
                        {productCategories.tobacco.map(category => (
                          <label key={category.id} className="flex items-center cursor-pointer hover:bg-gray-100 p-1 rounded-md transition-colors">
                            <input
                              type="checkbox"
                              checked={selectedProductCategories.includes(category.id)}
                              onChange={() => handleProductCategoryToggle(category.id)}
                              className="h-4 w-4 text-gray-500 border-gray-300 rounded focus:ring-gray-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{category.label}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Legacy CBD/Kratom filters kept for backward compatibility */}
                  <div className="bg-green-50 p-3 rounded-md">
                    <h4 className="text-sm font-medium text-green-800 mb-2">CBD Products</h4>
                    <div className="space-y-2">
                      <label className="flex items-center cursor-pointer hover:bg-green-100 p-1 rounded-md transition-colors">
                        <input
                          type="radio"
                          name="hasCBD"
                          checked={hasCBD === true}
                          onChange={() => handleCBDChange(true)}
                          className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Has CBD</span>
                      </label>
                      <label className="flex items-center cursor-pointer hover:bg-green-100 p-1 rounded-md transition-colors">
                        <input
                          type="radio"
                          name="hasCBD"
                          checked={hasCBD === false}
                          onChange={() => handleCBDChange(false)}
                          className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">No CBD</span>
                      </label>
                      <label className="flex items-center cursor-pointer hover:bg-green-100 p-1 rounded-md transition-colors">
                        <input
                          type="radio"
                          name="hasCBD"
                          checked={hasCBD === null}
                          onChange={() => handleCBDChange(null)}
                          className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">All Shops</span>
                      </label>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-3 rounded-md">
                    <h4 className="text-sm font-medium text-purple-800 mb-2">Kratom Products</h4>
                    <div className="space-y-2">
                      <label className="flex items-center cursor-pointer hover:bg-purple-100 p-1 rounded-md transition-colors">
                        <input
                          type="radio"
                          name="hasKratom"
                          checked={hasKratom === true}
                          onChange={() => handleKratomChange(true)}
                          className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Has Kratom</span>
                      </label>
                      <label className="flex items-center cursor-pointer hover:bg-purple-100 p-1 rounded-md transition-colors">
                        <input
                          type="radio"
                          name="hasKratom"
                          checked={hasKratom === false}
                          onChange={() => handleKratomChange(false)}
                          className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">No Kratom</span>
                      </label>
                      <label className="flex items-center cursor-pointer hover:bg-purple-100 p-1 rounded-md transition-colors">
                        <input
                          type="radio"
                          name="hasKratom"
                          checked={hasKratom === null}
                          onChange={() => handleKratomChange(null)}
                          className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">All Shops</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Business Types */}
            <div>
              <div 
                onClick={() => setBusinessOpen(!businessOpen)}
                className="flex justify-between items-center cursor-pointer mb-3"
              >
                <h3 className="font-medium text-purple-900 flex items-center">
                  <Activity className="h-4 w-4 text-purple-600 mr-2" />
                  Business Type
                </h3>
                {businessOpen ? <ChevronUp className="h-4 w-4 text-purple-600" /> : <ChevronDown className="h-4 w-4 text-purple-600" />}
              </div>
              
              {businessOpen && (
                <div className="space-y-2">
                  {Object.values(BusinessType).map(type => (
                    <label key={type} className="flex items-center cursor-pointer hover:bg-purple-50 p-1 rounded-md transition-colors">
                      <input
                        type="checkbox"
                        checked={businessTypes.includes(type)}
                        onChange={() => handleBusinessTypeToggle(type)}
                        className="h-4 w-4 text-purple-500 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{businessTypeLabels[type]}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* $4.20 Membership Banner Ad */}
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-4 rounded-lg text-center">
              <div className="flex justify-center mb-2">
                <Leaf className="h-8 w-8 text-purple-600" />
              </div>
              <p className="font-medium text-purple-800 mb-1">$4.20 Discount Card</p>
              <p className="text-purple-700 text-sm mb-2">Get 10% OFF at participating shops!</p>
              <a 
                href="/membership" 
                className="block bg-purple-600 text-white px-3 py-2 rounded-md text-sm hover:bg-purple-700 transition-colors"
              >
                Get Your Card
              </a>
            </div>

            {/* Reset Button */}
            <div className="pt-3 border-t border-purple-100">
              <button
                onClick={resetFilters}
                className="w-full flex items-center justify-center px-4 py-2 bg-purple-100 text-purple-800 rounded-md hover:bg-purple-200 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset All Filters
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* City Filter Modal */}
      {showCityFilter && selectedState && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <CityFilter 
            state={selectedState}
            onSelectCity={handleCitySelect}
            onClose={() => setShowCityFilter(false)}
          />
        </div>
      )}
    </div>
  );
};

export default FiltersPanel;