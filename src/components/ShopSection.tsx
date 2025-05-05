import React, { useState } from 'react';
import { ShoppingBag, Filter, ChevronRight, Flame, TrendingUp, Star, Tag } from 'lucide-react';
import ProductCard from './ProductCard';
import { Product } from './ProductCard';
import ProductCategories from './ProductCategories';
import ProductDetailModal from './ProductDetailModal';

// Example product data
const demoProducts: Product[] = [
  {
    id: 'prod1',
    title: 'Premium CBD Oil Tincture',
    price: 49.99,
    compareAtPrice: 59.99,
    description: 'Our premium CBD oil tincture is made with high-quality hemp extract and MCT oil.',
    images: [
      {
        id: 'img1',
        src: 'https://images.unsplash.com/photo-1579091337137-13eeb896cf1c',
        alt: 'CBD Oil Tincture'
      },
      {
        id: 'img2',
        src: 'https://images.unsplash.com/photo-1590318681094-6bfa42f8f47b',
        alt: 'CBD Oil Dropper'
      }
    ],
    category: 'CBD',
    tags: ['CBD', 'Oil', 'Tincture', 'Full Spectrum'],
    vendor: 'HempWorx',
    inStock: true,
    rating: 4.8,
    reviewCount: 124,
    labReports: [
      {
        id: 'lab1',
        title: 'Certificate of Analysis',
        fileUrl: 'https://example.com/lab-reports/cbd-oil-coa.pdf',
        date: '2023-05-15',
        testType: 'Potency & Contaminants'
      }
    ],
    cbdContent: '1000mg',
    terpenes: {
      Myrcene: '0.15%',
      Limonene: '0.10%',
      Caryophyllene: '0.20%'
    }
  },
  {
    id: 'prod2',
    title: 'Delta 8 THC Gummies - Mixed Fruit',
    price: 29.99,
    description: 'Our Delta 8 THC gummies offer a delicious way to enjoy the benefits of hemp-derived cannabinoids.',
    images: [
      {
        id: 'img3',
        src: 'https://images.unsplash.com/photo-1615845522188-d940828fa9a4',
        alt: 'Delta 8 Gummies'
      }
    ],
    category: 'Delta 8',
    tags: ['Delta 8', 'Gummies', 'Edibles'],
    vendor: 'Delta Extrax',
    inStock: true,
    rating: 4.5,
    reviewCount: 86,
    labReports: [
      {
        id: 'lab2',
        title: 'Delta 8 Potency Report',
        fileUrl: 'https://example.com/lab-reports/delta8-coa.pdf',
        date: '2023-06-10',
        testType: 'Potency'
      }
    ],
    thcContent: '25mg per gummy'
  },
  {
    id: 'prod3',
    title: 'THCA Flower - Sour Diesel Strain',
    price: 39.99,
    description: 'Premium THCA flower, Sour Diesel strain. Lab tested for potency and purity.',
    images: [
      {
        id: 'img4',
        src: 'https://images.unsplash.com/photo-1603909223429-69bb7101f96e',
        alt: 'THCA Flower'
      }
    ],
    category: 'Flower',
    tags: ['THCA', 'Flower', 'Sour Diesel', 'Hemp'],
    vendor: 'Botany Farms',
    inStock: true,
    rating: 4.7,
    reviewCount: 52,
    labReports: [
      {
        id: 'lab3',
        title: 'Flower Analysis',
        fileUrl: 'https://example.com/lab-reports/thca-flower-coa.pdf',
        date: '2023-07-05',
        testType: 'Cannabinoid Profile'
      }
    ],
    thcContent: '0.3% Delta 9 THC',
    terpenes: {
      Myrcene: '0.35%',
      Limonene: '0.40%',
      Caryophyllene: '0.25%',
      Pinene: '0.15%'
    }
  },
  {
    id: 'prod4',
    title: 'Premium Glass Water Pipe',
    price: 89.99,
    compareAtPrice: 120.00,
    description: 'Handcrafted borosilicate glass water pipe with percolator for smooth hits.',
    images: [
      {
        id: 'img5',
        src: 'https://images.unsplash.com/photo-1560999448-1ca4320ab516',
        alt: 'Glass Water Pipe'
      }
    ],
    category: 'Accessories',
    tags: ['Glass', 'Water Pipe', 'Bong', 'Percolator'],
    vendor: 'Pulsar',
    inStock: true,
    rating: 4.9,
    reviewCount: 75
  }
];

// Sample categories
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
    name: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1560999448-1ca4320ab516',
    count: 56
  },
  {
    id: 'cat6',
    name: 'Edibles',
    imageUrl: 'https://images.unsplash.com/photo-1621152144243-77a6c0376aca',
    count: 31
  },
  {
    id: 'cat7',
    name: 'THCP',
    imageUrl: 'https://images.unsplash.com/photo-1616577782675-c6aa557a6fc3',
    count: 8
  },
  {
    id: 'cat8',
    name: 'Delta 9',
    imageUrl: 'https://images.unsplash.com/photo-1585232351767-9d9722423000',
    count: 23
  },
  {
    id: 'cat9',
    name: 'Glass Pipes',
    imageUrl: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a',
    count: 44
  },
  {
    id: 'cat10',
    name: 'Rolling Papers',
    imageUrl: 'https://images.unsplash.com/photo-1579119806468-923de081688a',
    count: 17
  }
];

const ShopSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewAll, setViewAll] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  
  const handleAddToCart = (product: Product, quantity: number) => {
    console.log(`Adding ${quantity} of ${product.title} to cart`);
    // Implement cart functionality here
  };
  
  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };
  
  const handleCloseProductModal = () => {
    setIsProductModalOpen(false);
    // Don't reset selected product immediately for a smoother transition
    setTimeout(() => setSelectedProduct(null), 300);
  };
  
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };
  
  // Filter products based on selected category
  const filteredProducts = demoProducts.filter(product => {
    if (selectedCategory) {
      const category = demoCategories.find(cat => cat.id === selectedCategory);
      if (category && product.category !== category.name) {
        return false;
      }
    }
    return true;
  });
  
  // Show all products or limit to 4
  const displayProducts = viewAll ? filteredProducts : filteredProducts.slice(0, 4);
  
  return (
    <>
      <div className="py-10 bg-gray-50 rounded-xl shadow-sm animate-fadeIn">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-neutral flex items-center">
                <ShoppingBag className="h-8 w-8 mr-3 text-brand" />
                Shop Top Products
              </h2>
              <p className="text-gray-600 mt-2">
                Browse our carefully curated selection of premium smoke shop products
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                className="px-4 py-2 rounded-lg bg-white text-brand border border-brand font-medium hover:bg-brand hover:text-white transition-colors"
                onClick={() => setViewAll(!viewAll)}
              >
                {viewAll ? 'Show Less' : 'View All'}
              </button>
              
              <button className="px-4 py-2 rounded-lg bg-brand text-white font-medium hover:bg-brand-dark transition-colors flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
            </div>
          </div>
          
          {/* Featured Categories */}
          <div className="mb-10">
            <ProductCategories 
              categories={demoCategories}
              onSelectCategory={handleCategorySelect}
            />
          </div>
          
          {/* Featured Collections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-r from-brand-700 to-brand-500 rounded-xl p-6 text-white shadow-lg transform transition-transform hover:scale-105">
              <div className="flex items-center mb-3">
                <Flame className="h-6 w-6 mr-2" />
                <h3 className="text-xl font-bold">Hot Deals</h3>
              </div>
              <p className="mb-4">Save up to 40% on our most popular items</p>
              <button className="flex items-center text-sm font-medium">
                Shop Hot Deals
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            
            <div className="bg-gradient-to-r from-accent-dark to-accent rounded-xl p-6 text-white shadow-lg transform transition-transform hover:scale-105">
              <div className="flex items-center mb-3">
                <TrendingUp className="h-6 w-6 mr-2" />
                <h3 className="text-xl font-bold">New Arrivals</h3>
              </div>
              <p className="mb-4">Check out the latest products added to our store</p>
              <button className="flex items-center text-sm font-medium">
                Explore New Items
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-xl p-6 text-white shadow-lg transform transition-transform hover:scale-105">
              <div className="flex items-center mb-3">
                <Tag className="h-6 w-6 mr-2" />
                <h3 className="text-xl font-bold">Member Deals</h3>
              </div>
              <p className="mb-4">Exclusive discounts for $4.20 card members</p>
              <button className="flex items-center text-sm font-medium">
                View Member Offers
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
          
          {/* Products Grid */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-neutral mb-6 flex items-center">
              <Star className="h-6 w-6 mr-2 text-amber-400" />
              {selectedCategory 
                ? `${demoCategories.find(cat => cat.id === selectedCategory)?.name} Products` 
                : 'Featured Products'}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onViewDetails={handleViewDetails}
                  animationDelay={index}
                />
              ))}
            </div>
            
            {!viewAll && filteredProducts.length > 4 && (
              <div className="flex justify-center mt-8">
                <button 
                  className="px-6 py-3 rounded-full bg-brand text-white font-medium hover:bg-brand-dark transition-colors shadow-md"
                  onClick={() => setViewAll(true)}
                >
                  View All Products
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={isProductModalOpen}
          onClose={handleCloseProductModal}
          onAddToCart={handleAddToCart}
        />
      )}
    </>
  );
};

export default ShopSection; 