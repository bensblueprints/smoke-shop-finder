import React, { useState, useEffect } from 'react';
import { 
  Building2, Search, MapPin, ShoppingBag, ExternalLink, 
  Filter, ChevronDown, Tag, Globe, Truck, Package, Star, 
  Coffee
} from 'lucide-react';

// Define types for Brand data
interface BrandShop {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone?: string;
  products?: string[];
  rating?: number;
}

interface Brand {
  id: string;
  name: string;
  logo: string;
  website: string;
  description: string;
  category: string[];
  featuredProduct?: string;
  distributionShops: BrandShop[];
  isFeatured?: boolean;
  isVerified?: boolean;
  foundedYear?: number;
}

interface BrandDirectoryProps {
  initialCategory?: string;
}

const BrandDirectory: React.FC<BrandDirectoryProps> = ({ initialCategory }) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Categories for filter
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'glass', name: 'Glass & Accessories' },
    { id: 'vape', name: 'Vaporizers' },
    { id: 'cbd', name: 'CBD Products' },
    { id: 'delta8', name: 'Delta 8' },
    { id: 'tobacco', name: 'Tobacco' },
    { id: 'papers', name: 'Papers & Wraps' },
    { id: 'grinders', name: 'Grinders' },
    { id: 'storage', name: 'Storage Solutions' }
  ];
  
  // Dummy data for mock brands
  useEffect(() => {
    // This would normally be fetched from an API
    const mockBrands: Brand[] = [
      {
        id: '1',
        name: 'GlassWorks',
        logo: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80',
        website: 'https://glassworks.example.com',
        description: 'Premium handblown glass pieces crafted by master artisans. Known for durability and artistic designs.',
        category: ['glass'],
        featuredProduct: 'Helix Percolator Water Pipe',
        distributionShops: [
          {
            id: 'shop1',
            name: 'Smoke Haven',
            address: '123 Main St',
            city: 'Portland',
            state: 'OR',
            rating: 4.8,
            products: ['Helix Percolator', 'Mini Bubbler']
          },
          {
            id: 'shop2',
            name: 'Glass Gallery',
            address: '456 Oak Ave',
            city: 'Seattle',
            state: 'WA',
            rating: 4.5,
            products: ['Full Collection']
          },
          {
            id: 'shop3',
            name: 'Puff Palace',
            address: '789 Pine Blvd',
            city: 'Denver',
            state: 'CO',
            rating: 4.2,
            products: ['Helix Percolator', 'Recycler Rig']
          }
        ],
        isFeatured: true,
        isVerified: true,
        foundedYear: 2010
      },
      {
        id: '2',
        name: 'VaporTech',
        logo: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80',
        website: 'https://vaportech.example.com',
        description: 'Cutting-edge vaporizer technology with industry-leading battery life and temperature control.',
        category: ['vape'],
        featuredProduct: 'AirCloud Pro',
        distributionShops: [
          {
            id: 'shop4',
            name: 'Vape City',
            address: '101 Electric Dr',
            city: 'Austin',
            state: 'TX',
            rating: 4.7,
            products: ['AirCloud Pro', 'AirCloud Mini']
          },
          {
            id: 'shop5',
            name: 'Vapor Lounge',
            address: '202 Cloud St',
            city: 'Miami',
            state: 'FL',
            rating: 4.3,
            products: ['Full Collection']
          }
        ],
        isFeatured: true,
        isVerified: true,
        foundedYear: 2015
      },
      {
        id: '3',
        name: 'Wellness CBD',
        logo: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80',
        website: 'https://wellnesscbd.example.com',
        description: 'Organic, full-spectrum CBD products made from hemp grown in Colorado. Lab tested for purity.',
        category: ['cbd'],
        featuredProduct: 'Full Spectrum Tincture 1000mg',
        distributionShops: [
          {
            id: 'shop6',
            name: 'Green Health',
            address: '303 Hemp Rd',
            city: 'Boulder',
            state: 'CO',
            rating: 4.9,
            products: ['Tinctures', 'Gummies', 'Topicals']
          },
          {
            id: 'shop7',
            name: 'CBD Life',
            address: '404 Wellness Way',
            city: 'Portland',
            state: 'OR',
            rating: 4.6,
            products: ['Full Collection']
          }
        ],
        isVerified: true,
        foundedYear: 2018
      },
      {
        id: '4',
        name: 'RollingPapers Co.',
        logo: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80',
        website: 'https://rollingpapers.example.com',
        description: 'Eco-friendly rolling papers and cones made from organic hemp and rice paper.',
        category: ['papers'],
        featuredProduct: 'Organic Hemp King Size Papers',
        distributionShops: [
          {
            id: 'shop8',
            name: 'Smoke Shop',
            address: '505 Paper St',
            city: 'Los Angeles',
            state: 'CA',
            rating: 4.4,
            products: ['Papers', 'Cones', 'Tips']
          },
          {
            id: 'shop9',
            name: 'Tobacco Corner',
            address: '606 Roll Ave',
            city: 'Chicago',
            state: 'IL',
            rating: 4.1,
            products: ['Full Collection']
          }
        ],
        foundedYear: 2012
      },
      {
        id: '5',
        name: 'Delta8 Naturals',
        logo: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80',
        website: 'https://delta8naturals.example.com',
        description: 'Premium Delta 8 products with thorough lab testing and organic ingredients.',
        category: ['delta8'],
        featuredProduct: 'Delta 8 Gummies Mixed Fruit',
        distributionShops: [
          {
            id: 'shop10',
            name: 'Delta Dispensary',
            address: '707 Hemp St',
            city: 'Miami',
            state: 'FL',
            rating: 4.5,
            products: ['Gummies', 'Vapes', 'Tinctures']
          },
          {
            id: 'shop11',
            name: 'Green Leaf',
            address: '808 Natural Rd',
            city: 'Austin',
            state: 'TX',
            rating: 4.3,
            products: ['Full Collection']
          }
        ],
        isFeatured: true,
        foundedYear: 2019
      }
    ];
    
    setBrands(mockBrands);
    setFilteredBrands(mockBrands);
    setLoading(false);
  }, []);
  
  // Filter brands based on search term and category
  useEffect(() => {
    let filtered = brands;
    
    // Filter by search term
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(brand => 
        brand.name.toLowerCase().includes(searchLower) ||
        brand.description.toLowerCase().includes(searchLower) ||
        brand.distributionShops.some(shop => shop.name.toLowerCase().includes(searchLower))
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(brand => 
        brand.category.includes(selectedCategory)
      );
    }
    
    setFilteredBrands(filtered);
  }, [searchTerm, selectedCategory, brands]);
  
  // Open a brand's website
  const openWebsite = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-pulse space-y-4 text-center">
          <Coffee className="h-12 w-12 text-amber-400 mx-auto" />
          <p className="text-gray-500">Loading brands...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-neutral flex items-center">
          <Building2 className="mr-2 h-6 w-6 text-brand" />
          Brand Directory
        </h2>
        
        <button 
          className="flex items-center text-sm text-gray-600 hover:text-brand transition-colors"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4 mr-1" />
          Filters
          <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>
      
      {/* Search and filters section */}
      <div className={`${showFilters ? 'mb-6' : 'mb-2'}`}>
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search brands, products or shops..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        
        {showFilters && (
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map(category => (
              <button
                key={category.id}
                className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                  selectedCategory === category.id
                    ? 'bg-brand text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Brands list */}
      {filteredBrands.length === 0 ? (
        <div className="text-center py-8">
          <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No brands found matching your search criteria.</p>
          <button 
            className="mt-2 text-brand hover:underline"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBrands.map(brand => (
            <div 
              key={brand.id} 
              className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center">
                <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden mr-3 flex-shrink-0">
                  <img 
                    src={brand.logo} 
                    alt={`${brand.name} logo`} 
                    className="max-h-12 max-w-12 object-contain"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="font-bold text-lg text-neutral">{brand.name}</h3>
                    {brand.isVerified && (
                      <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">Verified</span>
                    )}
                    {brand.isFeatured && (
                      <span className="ml-2 bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">Featured</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {brand.category.map((cat, idx) => (
                      <span key={idx} className="inline-flex items-center text-xs text-gray-500">
                        <Tag className="h-3 w-3 mr-1" />
                        {categories.find(c => c.id === cat)?.name || cat}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => openWebsite(brand.website)}
                  className="ml-auto text-brand hover:text-brand-dark flex items-center text-sm font-medium p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Globe className="h-4 w-4 mr-1" />
                  Website
                </button>
              </div>
              <div className="p-4">
                <p className="text-gray-600 text-sm mb-4">{brand.description}</p>
                {brand.featuredProduct && (
                  <div className="bg-brand-50 border border-brand-100 rounded-lg p-2 mb-4 text-sm">
                    <p className="font-medium text-brand-800">Featured Product:</p>
                    <p className="text-brand-600">{brand.featuredProduct}</p>
                  </div>
                )}
                <div>
                  <h4 className="font-medium text-neutral mb-2 flex items-center">
                    <Truck className="h-4 w-4 mr-1 text-gray-500" />
                    Distribution Locations
                  </h4>
                  <div className="space-y-3">
                    {brand.distributionShops.map((shop, idx) => (
                      <div key={idx} className="flex items-start border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-sm">{shop.name}</p>
                          <p className="text-xs text-gray-500">{shop.address}, {shop.city}, {shop.state}</p>
                          {shop.products && shop.products.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {shop.products.map((product, pidx) => (
                                <span key={pidx} className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-700">
                                  {product}
                                </span>
                              ))}
                            </div>
                          )}
                          {shop.rating && (
                            <div className="flex items-center mt-1">
                              <Star className="h-3 w-3 text-amber-400" />
                              <span className="text-xs text-gray-600 ml-1">{shop.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-100 px-4 py-2 bg-gray-50 text-xs text-gray-500 flex justify-between">
                <span>Listed since: {brand.foundedYear || 'N/A'}</span>
                <a href={`/brands/${brand.id}`} className="text-brand hover:underline flex items-center">
                  View details
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrandDirectory; 