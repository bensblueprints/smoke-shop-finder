import React from 'react';
import { X, Star, ShoppingCart, Heart, Info, FileText, Share2, ChevronRight, Check } from 'lucide-react';
import { Product, ProductVariant } from './ProductCard';

interface ProductDetailModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, variant?: ProductVariant) => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart
}) => {
  const [selectedImage, setSelectedImage] = React.useState(product.images[0]?.src || '');
  const [quantity, setQuantity] = React.useState(1);
  const [selectedVariant, setSelectedVariant] = React.useState<ProductVariant | undefined>(
    product.variants?.[0]
  );

  if (!isOpen) return null;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > 10) return;
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedVariant);
    // Don't close the modal to allow adding more
  };

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100) 
    : 0;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full z-10 transition-colors"
          onClick={onClose}
        >
          <X size={20} className="text-gray-700" />
        </button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Product Images */}
          <div>
            <div className="bg-gray-100 rounded-xl overflow-hidden aspect-square mb-4">
              <img 
                src={selectedImage} 
                alt={product.title} 
                className="w-full h-full object-contain"
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image) => (
                  <button 
                    key={image.id}
                    className={`border-2 rounded-lg overflow-hidden aspect-square ${
                      selectedImage === image.src ? 'border-brand' : 'border-transparent'
                    }`}
                    onClick={() => setSelectedImage(image.src)}
                  >
                    <img 
                      src={image.src} 
                      alt={image.alt} 
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Details */}
          <div>
            <div className="mb-2 flex items-center">
              <span className="text-sm text-gray-600">{product.vendor}</span>
              {product.inStock ? (
                <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">In Stock</span>
              ) : (
                <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">Out of Stock</span>
              )}
            </div>
            
            <h1 className="text-2xl font-bold text-neutral mb-2">{product.title}</h1>
            
            {product.rating && (
              <div className="flex items-center mb-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className={i < Math.floor(product.rating!) ? 'text-yellow-400 fill-current' : 'text-gray-300'} 
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2 font-medium">{product.rating}</span>
                {product.reviewCount && (
                  <span className="text-sm text-gray-500 ml-1">({product.reviewCount} reviews)</span>
                )}
              </div>
            )}
            
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-brand">${product.price.toFixed(2)}</span>
              {hasDiscount && (
                <>
                  <span className="text-gray-500 line-through ml-2">
                    ${product.compareAtPrice!.toFixed(2)}
                  </span>
                  <span className="ml-2 bg-accent text-white text-sm font-bold px-2 py-0.5 rounded-full">
                    {discountPercentage}% OFF
                  </span>
                </>
              )}
            </div>
            
            <p className="text-gray-700 mb-6">{product.description}</p>
            
            {/* THC/CBD Content */}
            {(product.thcContent || product.cbdContent) && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-neutral mb-2 flex items-center">
                  <Info size={16} className="mr-2 text-brand" />
                  Content Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {product.thcContent && (
                    <div className="bg-white p-3 rounded border border-gray-200">
                      <span className="block text-sm text-gray-500">THC Content</span>
                      <span className="font-medium">{product.thcContent}</span>
                    </div>
                  )}
                  {product.cbdContent && (
                    <div className="bg-white p-3 rounded border border-gray-200">
                      <span className="block text-sm text-gray-500">CBD Content</span>
                      <span className="font-medium">{product.cbdContent}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <div className="flex items-center">
                <button 
                  className="w-10 h-10 rounded-l-lg border border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <span className="text-xl font-bold">-</span>
                </button>
                <input 
                  type="number" 
                  className="w-16 h-10 border-t border-b border-gray-300 text-center"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  min={1}
                  max={10}
                />
                <button 
                  className="w-10 h-10 rounded-r-lg border border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= 10}
                >
                  <span className="text-xl font-bold">+</span>
                </button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`w-full py-3 rounded-lg flex items-center justify-center font-medium ${
                  product.inStock
                    ? 'bg-brand text-white hover:bg-brand-dark'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button className="py-2 border border-gray-300 rounded-lg flex items-center justify-center text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <Heart className="h-4 w-4 mr-2" />
                  Add to Wishlist
                </button>
                <button className="py-2 border border-gray-300 rounded-lg flex items-center justify-center text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </button>
              </div>
            </div>
            
            {/* Lab Reports */}
            {product.labReports && product.labReports.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-medium text-neutral mb-3 flex items-center">
                  <FileText size={16} className="mr-2 text-brand" />
                  Lab Reports
                </h3>
                <div className="space-y-2">
                  {product.labReports.map(report => (
                    <a 
                      key={report.id}
                      href={report.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-neutral">{report.title}</span>
                          <div className="text-sm text-gray-500">
                            <span>{report.testType}</span>
                            <span className="mx-2">•</span>
                            <span>{new Date(report.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <ChevronRight size={18} className="text-gray-400" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
            
            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-medium text-neutral mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map(tag => (
                    <span 
                      key={tag}
                      className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal; 