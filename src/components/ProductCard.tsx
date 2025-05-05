import React, { useState } from 'react';
import { ShoppingCart, Heart, FileText, Star, Info } from 'lucide-react';

export interface ProductImage {
  id: string;
  src: string;
  alt: string;
}

export interface LabReport {
  id: string;
  title: string;
  fileUrl: string;
  date: string;
  testType: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  images: ProductImage[];
  category: string;
  subcategory?: string;
  tags: string[];
  vendor: string;
  variants?: ProductVariant[];
  inStock: boolean;
  rating?: number;
  reviewCount?: number;
  labReports?: LabReport[];
  thcContent?: string;
  cbdContent?: string;
  terpenes?: Record<string, string>;
}

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  inStock: boolean;
  options: Record<string, string>;
}

interface ProductCardProps {
  product: Product;
  shopId?: string;
  onAddToCart: (product: Product, quantity: number, variant?: ProductVariant) => void;
  onViewDetails: (product: Product) => void;
  className?: string;
  showVendor?: boolean;
  showLabReportsBadge?: boolean;
  animationDelay?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  shopId,
  onAddToCart,
  onViewDetails,
  className = '',
  showVendor = true,
  showLabReportsBadge = true,
  animationDelay = 0
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100) 
    : 0;
  
  const mainImage = product.images.length > 0 ? product.images[0].src : 'https://via.placeholder.com/240x320';
  const secondaryImage = product.images.length > 1 ? product.images[1].src : mainImage;
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, 1);
  };
  
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };
  
  return (
    <div 
      className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 animate-slideUp ${
        isHovered ? 'shadow-xl transform -translate-y-2' : ''
      } ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewDetails(product)}
      style={{ animationDelay: `${animationDelay * 0.1}s` }}
    >
      {/* Product Image */}
      <div className="relative w-full aspect-[3/4] bg-gray-100 overflow-hidden">
        <img 
          src={isHovered && product.images.length > 1 ? secondaryImage : mainImage} 
          alt={product.title} 
          className="object-cover w-full h-full transition-all duration-500 transform hover:scale-105"
        />
        
        {/* Tags */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {hasDiscount && (
            <span className="bg-accent text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-sm">
              {discountPercentage}% OFF
            </span>
          )}
          
          {!product.inStock && (
            <span className="bg-neutral text-white text-sm px-3 py-1.5 rounded-full shadow-sm">
              Out of Stock
            </span>
          )}
          
          {product.labReports && product.labReports.length > 0 && showLabReportsBadge && (
            <span className="bg-green-500 text-white text-sm px-3 py-1.5 rounded-full shadow-sm flex items-center">
              <FileText className="h-3.5 w-3.5 mr-1" />
              Lab Tested
            </span>
          )}
        </div>
        
        {/* Favorite Button */}
        <button
          className={`absolute top-3 right-3 p-2.5 rounded-full shadow-md transition-colors ${
            isFavorite ? 'bg-accent text-white' : 'bg-white/90 text-neutral hover:bg-white'
          }`}
          onClick={handleFavoriteToggle}
        >
          <Heart className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} />
        </button>
        
        {/* Category Tag */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-brand/80 backdrop-blur-sm text-white text-sm font-medium px-3 py-1.5 rounded-full shadow-sm">
            {product.category}
          </span>
        </div>
        
        {/* THC/CBD Content */}
        {(product.thcContent || product.cbdContent) && (
          <div className="absolute bottom-3 right-3 flex gap-1.5">
            {product.thcContent && (
              <span className="bg-neutral/80 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-full shadow-sm">
                THC: {product.thcContent}
              </span>
            )}
            {product.cbdContent && (
              <span className="bg-green-600/80 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-full shadow-sm">
                CBD: {product.cbdContent}
              </span>
            )}
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        {showVendor && (
          <div className="text-sm text-gray-500 mb-1.5">{product.vendor}</div>
        )}
        
        <h3 className="font-semibold text-lg text-neutral mb-2 line-clamp-2">{product.title}</h3>
        
        <div className="flex items-center mb-3">
          {product.rating && (
            <div className="flex items-center mr-2">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm text-gray-600 ml-1 font-medium">{product.rating}</span>
              {product.reviewCount && (
                <span className="text-sm text-gray-400 ml-1">({product.reviewCount})</span>
              )}
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="font-bold text-xl text-brand-dark">${product.price.toFixed(2)}</span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through ml-2">
                ${product.compareAtPrice!.toFixed(2)}
              </span>
            )}
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`p-3 rounded-full shadow-md transition-all ${
              product.inStock
                ? 'bg-brand text-white hover:bg-brand-dark'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 