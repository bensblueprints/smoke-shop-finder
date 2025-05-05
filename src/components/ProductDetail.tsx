import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Heart, 
  Share2, 
  Star, 
  X,
  Download,
  Check
} from 'lucide-react';
import { Product, ProductVariant, LabReport } from './ProductCard';

interface ProductDetailProps {
  product: Product;
  shopId: string;
  shopName: string;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, variant?: ProductVariant) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  shopId,
  shopName,
  onClose,
  onAddToCart
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'lab-reports' | 'reviews'>('details');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [selectedLabReport, setSelectedLabReport] = useState<LabReport | null>(
    product.labReports && product.labReports.length > 0 ? product.labReports[0] : null
  );
  
  // Group variants by option types
  const variantOptions: Record<string, Set<string>> = {};
  if (product.variants) {
    product.variants.forEach(variant => {
      Object.entries(variant.options).forEach(([key, value]) => {
        if (!variantOptions[key]) {
          variantOptions[key] = new Set();
        }
        variantOptions[key].add(value);
      });
    });
  }

  // Create a map of selected options
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  
  // Initialize selected options from the first variant
  useState(() => {
    if (selectedVariant) {
      setSelectedOptions(selectedVariant.options);
    }
  });
  
  // Find the variant that matches the selected options
  const findMatchingVariant = (options: Record<string, string>): ProductVariant | null => {
    if (!product.variants) return null;
    
    return product.variants.find(variant => {
      return Object.entries(options).every(([key, value]) => 
        variant.options[key] === value
      );
    }) || null;
  };
  
  // Handle option selection
  const handleOptionSelect = (optionName: string, optionValue: string) => {
    const newOptions = {
      ...selectedOptions,
      [optionName]: optionValue
    };
    
    setSelectedOptions(newOptions);
    const variant = findMatchingVariant(newOptions);
    if (variant) {
      setSelectedVariant(variant);
    }
  };
  
  // Handle quantity changes
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedVariant || undefined);
  };
  
  // Handle image navigation
  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev < product.images.length - 1 ? prev + 1 : 0
    );
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev > 0 ? prev - 1 : product.images.length - 1
    );
  };
  
  // Current price based on selected variant
  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentCompareAtPrice = selectedVariant ? selectedVariant.compareAtPrice : product.compareAtPrice;
  const hasDiscount = currentCompareAtPrice && currentCompareAtPrice > currentPrice;
  const discountPercentage = hasDiscount 
    ? Math.round(((currentCompareAtPrice! - currentPrice) / currentCompareAtPrice!) * 100) 
    : 0;
  
  // Check if current combination is available
  const isCurrentCombinationAvailable = selectedVariant ? selectedVariant.inStock : product.inStock;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">{product.title}</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        
        <div className="overflow-y-auto p-4 flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Images */}
            <div>
              {/* Main Image */}
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                {product.images.length > 0 ? (
                  <img 
                    src={product.images[currentImageIndex].src} 
                    alt={product.images[currentImageIndex].alt || product.title} 
                    className="object-contain w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
                
                {/* Image Navigation */}
                {product.images.length > 1 && (
                  <>
                    <button 
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow-md"
                    >
                      <ChevronLeft className="h-6 w-6 text-gray-700" />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow-md"
                    >
                      <ChevronRight className="h-6 w-6 text-gray-700" />
                    </button>
                  </>
                )}
                
                {/* Discount Badge */}
                {hasDiscount && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                    {discountPercentage}% OFF
                  </div>
                )}
              </div>
              
              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 ${
                        index === currentImageIndex ? 'ring-2 ring-purple-600' : 'ring-1 ring-gray-200'
                      }`}
                    >
                      <img 
                        src={image.src} 
                        alt={image.alt || `Product ${index + 1}`} 
                        className="object-cover w-full h-full"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Info */}
            <div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-500">{product.vendor}</div>
                  
                  <div className="flex gap-2">
                    <button className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200">
                      <Heart className="h-4 w-4 text-gray-700" />
                    </button>
                    <button className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200">
                      <Share2 className="h-4 w-4 text-gray-700" />
                    </button>
                  </div>
                </div>
                
                <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.title}</h1>
                
                <div className="flex items-center mb-3">
                  {product.rating && (
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating!) 
                              ? 'text-yellow-500 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">{product.rating}</span>
                      {product.reviewCount && (
                        <span className="text-sm text-gray-500 ml-1">({product.reviewCount} reviews)</span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-purple-700">${currentPrice.toFixed(2)}</span>
                    {hasDiscount && (
                      <span className="text-base text-gray-500 line-through ml-2">
                        ${currentCompareAtPrice!.toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-1 text-sm text-green-700">
                    {isCurrentCombinationAvailable ? 'In Stock' : 'Out of Stock'}
                  </div>
                </div>
                
                {/* Product Variants */}
                {Object.entries(variantOptions).length > 0 && (
                  <div className="mb-4 space-y-3">
                    {Object.entries(variantOptions).map(([optionName, valuesSet]) => {
                      const values = Array.from(valuesSet);
                      return (
                        <div key={optionName}>
                          <div className="text-sm font-medium text-gray-700 mb-1 capitalize">
                            {optionName}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {values.map(value => (
                              <button
                                key={value}
                                onClick={() => handleOptionSelect(optionName, value)}
                                className={`px-3 py-1 rounded border ${
                                  selectedOptions[optionName] === value
                                    ? 'border-purple-600 bg-purple-50 text-purple-800'
                                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                }`}
                              >
                                {value}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {/* Quantity */}
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-1">Quantity</div>
                  <div className="flex items-center">
                    <button
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="p-1.5 border border-gray-300 rounded-l-md disabled:opacity-50"
                    >
                      <Minus className="h-4 w-4 text-gray-700" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-12 text-center py-1.5 border-t border-b border-gray-300 focus:outline-none"
                    />
                    <button
                      onClick={increaseQuantity}
                      className="p-1.5 border border-gray-300 rounded-r-md"
                    >
                      <Plus className="h-4 w-4 text-gray-700" />
                    </button>
                  </div>
                </div>
                
                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={!isCurrentCombinationAvailable}
                  className={`w-full flex items-center justify-center py-3 px-4 rounded-md ${
                    isCurrentCombinationAvailable
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {isCurrentCombinationAvailable ? 'Add to Cart' : 'Out of Stock'}
                </button>
                
                {/* Shop Info */}
                <div className="mt-4 bg-purple-50 p-3 rounded-md">
                  <div className="text-sm font-medium text-purple-800 mb-1">Sold by</div>
                  <div className="text-gray-700">{shopName}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="mt-8 border-t pt-6">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('details')}
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === 'details'
                    ? 'text-purple-700 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                Product Details
              </button>
              
              {product.labReports && product.labReports.length > 0 && (
                <button
                  onClick={() => setActiveTab('lab-reports')}
                  className={`px-4 py-2 font-medium text-sm flex items-center ${
                    activeTab === 'lab-reports'
                      ? 'text-purple-700 border-b-2 border-purple-600'
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Lab Reports
                </button>
              )}
              
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-4 py-2 font-medium text-sm flex items-center ${
                  activeTab === 'reviews'
                    ? 'text-purple-700 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                <Star className="h-4 w-4 mr-1" />
                Reviews {product.reviewCount ? `(${product.reviewCount})` : ''}
              </button>
            </div>
            
            <div className="py-4">
              {activeTab === 'details' && (
                <div>
                  <h3 className="font-medium text-lg text-gray-800 mb-3">Description</h3>
                  <div className="prose prose-sm max-w-none text-gray-700">
                    <p>{product.description}</p>
                  </div>
                  
                  {(product.thcContent || product.cbdContent || product.terpenes) && (
                    <div className="mt-6">
                      <h3 className="font-medium text-lg text-gray-800 mb-3">Cannabinoid Profile</h3>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {product.thcContent && (
                          <div className="bg-black/5 p-3 rounded-md">
                            <div className="text-sm text-gray-500">THC Content</div>
                            <div className="font-medium">{product.thcContent}</div>
                          </div>
                        )}
                        
                        {product.cbdContent && (
                          <div className="bg-green-50 p-3 rounded-md">
                            <div className="text-sm text-gray-500">CBD Content</div>
                            <div className="font-medium">{product.cbdContent}</div>
                          </div>
                        )}
                        
                        {product.terpenes && Object.entries(product.terpenes).map(([name, value]) => (
                          <div key={name} className="bg-purple-50 p-3 rounded-md">
                            <div className="text-sm text-gray-500 capitalize">{name}</div>
                            <div className="font-medium">{value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Product Tags */}
                  {product.tags.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-medium text-lg text-gray-800 mb-3">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'lab-reports' && product.labReports && (
                <div>
                  <h3 className="font-medium text-lg text-gray-800 mb-3">Laboratory Test Results</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 border-r pr-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Available Reports</h4>
                      
                      <div className="space-y-2">
                        {product.labReports.map(report => (
                          <button
                            key={report.id}
                            onClick={() => setSelectedLabReport(report)}
                            className={`w-full text-left p-3 rounded-md transition-colors ${
                              selectedLabReport?.id === report.id
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                            }`}
                          >
                            <div className="font-medium">{report.title}</div>
                            <div className="text-xs text-gray-500 flex justify-between">
                              <span>{report.testType}</span>
                              <span>{report.date}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      {selectedLabReport ? (
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-medium text-gray-800">{selectedLabReport.title}</h4>
                            <a
                              href={selectedLabReport.fileUrl}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-sm text-purple-600 hover:text-purple-800"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download PDF
                            </a>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-md">
                            {/* Placeholder for lab report preview */}
                            <div className="aspect-[3/4] bg-white rounded border flex items-center justify-center">
                              <iframe 
                                src={selectedLabReport.fileUrl} 
                                title={selectedLabReport.title}
                                className="w-full h-full"
                                style={{ minHeight: '400px' }}
                              >
                                This browser does not support PDFs. Please download the PDF to view it.
                              </iframe>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          Select a lab report to view details
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'reviews' && (
                <div>
                  <h3 className="font-medium text-lg text-gray-800 mb-3">Customer Reviews</h3>
                  
                  {product.reviewCount && product.reviewCount > 0 ? (
                    <div>
                      {/* Review summary would go here */}
                      <div className="text-gray-500 italic">Reviews feature is coming soon.</div>
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      This product has no reviews yet. Be the first to leave a review!
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 