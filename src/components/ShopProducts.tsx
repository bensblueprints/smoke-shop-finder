import React, { useState, useEffect } from 'react';
import { useShopify } from '../context/ShopifyContext';
import ProductCard from './ProductCard';
import ProductDetail from './ProductDetail';
import ProductCategories from './ProductCategories';
import NearbyDeals from './NearbyDeals';
import { Product } from './ProductCard';
import { ShoppingBag, Filter, Search, Tag, X } from 'lucide-react';

// Demo categories data
const demoCategories = [
  {
    id: 'cat1',
    name: 'CBD',
    imageUrl: 'https://images.unsplash.com/photo-1585232352617-a8ee9f33e3b9',
    count: 42
  },
  {
    id: 'cat2',
    name: 'Delta 8',
    imageUrl: 'https://images.unsplash.com/photo-1616538318945-e558bf3ec730',
    count: 28
  },
  {
    id: 'cat3',
    name: 'THCA Flower',
    imageUrl: 'https://images.unsplash.com/photo-1603909223429-69bb7101f96e',
    count: 35
  },
  {
    id: 'cat4',
    name: 'Vapes',
    imageUrl: 'https://images.unsplash.com/photo-1560024802-9acdf56be24b',
    count: 19
  },
  {
    id: 'cat5',
    name: 'Concentrates',
    imageUrl: 'https://images.unsplash.com/photo-1599781269493-9edefa91d236',
    count: 14
  },
  {
    id: 'cat6',
    name: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1560999448-1ca4320ab516',
    count: 56
  },
  {
    id: 'cat7',
    name: 'Edibles',
    imageUrl: 'https://images.unsplash.com/photo-1621152144243-77a6c0376aca',
    count: 31
  },
  {
    id: 'cat8',
    name: 'THCP',
    imageUrl: 'https://images.unsplash.com/photo-1616577782675-c6aa557a6fc3',
    count: 8
  }
];

// Demo deals data
const demoDeals = [
  {
    id: 'deal1',
    title: 'Buy One Get One 50% OFF',
    description: 'Get a second item half price on all Delta 8 products through the weekend.',
    discount: '50% OFF',
    expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    shop: {
      id: 'shop1',
      name: 'Green Leaf CBD',
      distance: 0.8,
      address: '123 Main St',
      logo: 'https://via.placeholder.com/100x100?text=GL'
    },
    products: demoCategories.slice(0, 3).map(cat => ({
      id: `prod-${cat.id}`,
      title: `${cat.name} Special Item`,
      price: 29.99,
      compareAtPrice: 49.99,
      description: 'Lorem ipsum dolor sit amet',
      images: [{ id: `img-${cat.id}`, src: cat.imageUrl, alt: cat.name }],
      category: cat.name,
      tags: [cat.name, 'Sale'],
      vendor: 'Green Leaf',
      inStock: true
    })),
    imageUrl: 'https://images.unsplash.com/photo-1585232352617-a8ee9f33e3b9'
  },
  {
    id: 'deal2',
    title: 'Memorial Day Blowout',
    description: 'Save 30% on all premium glass and accessories this holiday weekend.',
    discount: '30% OFF',
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    shop: {
      id: 'shop2',
      name: 'Smoker\'s Paradise',
      distance: 1.3,
      address: '456 High St',
      logo: 'https://via.placeholder.com/100x100?text=SP'
    },
    products: demoCategories.slice(5, 7).map(cat => ({
      id: `prod-${cat.id}`,
      title: `${cat.name} Special Item`,
      price: 39.99,
      compareAtPrice: 59.99,
      description: 'Lorem ipsum dolor sit amet',
      images: [{ id: `img-${cat.id}`, src: cat.imageUrl, alt: cat.name }],
      category: cat.name,
      tags: [cat.name, 'Sale'],
      vendor: 'Smoker\'s Paradise',
      inStock: true
    })),
    imageUrl: 'https://images.unsplash.com/photo-1603909223429-69bb7101f96e'
  },
  {
    id: 'deal3',
    title: 'Flash Sale: THCP',
    description: 'For the next 24 hours, get 40% off all THCP products - our biggest discount ever!',
    discount: '40% OFF',
    expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
    shop: {
      id: 'shop3',
      name: 'Cannabist',
      distance: 2.1,
      address: '789 Hemp Way',
      logo: 'https://via.placeholder.com/100x100?text=CB'
    },
    products: demoCategories.slice(7, 8).map(cat => ({
      id: `prod-${cat.id}`,
      title: `${cat.name} Special Item`,
      price: 59.99,
      compareAtPrice: 99.99,
      description: 'Lorem ipsum dolor sit amet',
      images: [{ id: `img-${cat.id}`, src: cat.imageUrl, alt: cat.name }],
      category: cat.name,
      tags: [cat.name, 'Sale'],
      vendor: 'Cannabist',
      inStock: true
    })),
    imageUrl: 'https://images.unsplash.com/photo-1616577782675-c6aa557a6fc3'
  }
];

interface ShopProductsProps {
  shopId: string;
  shopName: string;
  className?: string;
}

const ShopProducts: React.FC<ShopProductsProps> = ({
  shopId,
  shopName,
  className = ''
}) => {
  const { products, addToCart } = useShopify();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  const handleViewProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };
  
  const handleCloseProductDetails = () => {
    setIsDetailOpen(false);
  };
  
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };
  
  const handleViewDeal = (deal: any) => {
    // Handle viewing a deal (could show a modal with deal details)
    console.log('Viewing deal:', deal);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Apply search filter
  };
  
  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };
  
  // Filter products based on selected category and search query
  const filteredProducts = products.filter(product => {
    // Category filter
    if (selectedCategory && demoCategories.find(cat => cat.id === selectedCategory)?.name !== product.category) {
      return false;
    }
    
    // Search filter
    if (searchQuery && !product.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Tag filters
    if (activeFilters.length > 0 && !activeFilters.some(filter => product.tags.includes(filter))) {
      return false;
    }
    
    return true;
  });
  
  return (
    <div className={`animate-fadeIn ${className}`}>
      {/* Header with search and filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold text-neutral flex items-center">
          <ShoppingBag className="h-8 w-8 mr-3 text-brand" />
          {shopName} Products
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </form>
          
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="px-4 py-3 rounded-xl bg-brand text-white font-medium flex items-center justify-center"
          >
            <Filter className="h-5 w-5 mr-2" />
            Filters {activeFilters.length > 0 && `(${activeFilters.length})`}
          </button>
        </div>
      </div>
      
      {/* Filters area */}
      {isFiltersOpen && (
        <div className="bg-gray-50 p-5 rounded-xl mb-8 animate-slideUp">
          <h3 className="font-medium text-lg text-neutral mb-4">Filter by Tags</h3>
          <div className="flex flex-wrap gap-2">
            {['CBD', 'Delta 8', 'THCA', 'THCP', 'Edibles', 'Vapes', 'Flower', 'Concentrates', 'Accessories'].map(tag => (
              <button
                key={tag}
                onClick={() => toggleFilter(tag)}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilters.includes(tag)
                    ? 'bg-brand text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-brand hover:text-brand'
                }`}
              >
                <Tag className="h-3.5 w-3.5 inline-block mr-1.5" />
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Product Categories */}
      <ProductCategories 
        categories={demoCategories}
        onSelectCategory={handleCategorySelect}
        className="mb-12"
      />
      
      {/* Nearby Deals */}
      <NearbyDeals 
        deals={demoDeals}
        onViewDeal={handleViewDeal}
        className="mb-12"
      />
      
      {/* Products Grid */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-neutral mb-6">
          {selectedCategory 
            ? `${demoCategories.find(cat => cat.id === selectedCategory)?.name} Products` 
            : 'All Products'}
          {searchQuery && ` matching "${searchQuery}"`}
        </h3>
        
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                shopId={shopId}
                onAddToCart={addToCart}
                onViewDetails={handleViewProductDetails}
                animationDelay={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <ShoppingBag className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <h3 className="text-xl font-medium text-gray-700 mb-1">No products found</h3>
            <p className="text-gray-500">
              Try adjusting your filters or search criteria.
            </p>
            {(selectedCategory || searchQuery || activeFilters.length > 0) && (
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery('');
                  setActiveFilters([]);
                }}
                className="mt-4 px-4 py-2 bg-brand text-white rounded-lg font-medium"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Product Detail Modal */}
      {isDetailOpen && selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          shopId={shopId}
          shopName={shopName}
          onClose={handleCloseProductDetails}
          onAddToCart={addToCart}
        />
      )}
    </div>
  );
};

export default ShopProducts; 