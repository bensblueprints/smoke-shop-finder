import React, { useRef } from 'react';
import { MapPin, ChevronLeft, ChevronRight, Tag, Store, Timer } from 'lucide-react';
import { Product } from './ProductCard';

interface Shop {
  id: string;
  name: string;
  distance: number;
  address: string;
  logo?: string;
}

interface Deal {
  id: string;
  title: string;
  description: string;
  discount: string;
  expiresAt: string;
  shop: Shop;
  products: Product[];
  imageUrl: string;
}

interface NearbyDealsProps {
  deals: Deal[];
  onViewDeal: (deal: Deal) => void;
  className?: string;
}

const NearbyDeals: React.FC<NearbyDealsProps> = ({
  deals,
  onViewDeal,
  className = ''
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.75;
    
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  
  return (
    <div className={`relative ${className}`}>
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-2xl font-bold text-neutral flex items-center">
            <MapPin className="h-6 w-6 mr-2 text-accent" />
            Deals Near You
          </h2>
          <p className="text-gray-500 mt-1">Special offers from shops in your area</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-3 rounded-full bg-white border border-gray-200 text-neutral hover:bg-brand hover:text-white hover:border-brand transition-colors shadow-sm"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-3 rounded-full bg-white border border-gray-200 text-neutral hover:bg-brand hover:text-white hover:border-brand transition-colors shadow-sm"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div 
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {deals.map((deal, index) => (
          <div 
            key={deal.id}
            className="flex-shrink-0 animate-slideUp"
            style={{ 
              width: '380px', 
              scrollSnapAlign: 'start',
              animationDelay: `${index * 0.1}s`
            }}
          >
            <div 
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
              onClick={() => onViewDeal(deal)}
            >
              <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
                <img 
                  src={deal.imageUrl} 
                  alt={deal.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-accent text-white text-lg font-bold px-4 py-2 rounded-full shadow-md">
                    {deal.discount}
                  </span>
                </div>
                
                {deal.shop.logo && (
                  <div className="absolute top-4 right-4">
                    <div className="w-10 h-10 rounded-full bg-white shadow-md overflow-hidden">
                      <img 
                        src={deal.shop.logo} 
                        alt={deal.shop.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-bold text-xl text-neutral mb-2">{deal.title}</h3>
                <p className="text-gray-600 mb-3 line-clamp-2">{deal.description}</p>
                
                <div className="flex items-center text-gray-500 mb-3">
                  <Store className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">{deal.shop.name}</span>
                  <div className="mx-2 w-1 h-1 rounded-full bg-gray-300"></div>
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{deal.shop.distance} miles</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-brand text-sm font-medium">
                    <Tag className="h-4 w-4 mr-1" />
                    {deal.products.length} products on sale
                  </div>
                  
                  <div className="flex items-center text-amber-600 text-sm">
                    <Timer className="h-4 w-4 mr-1" />
                    Expires: {formatExpiry(deal.expiresAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to format expiry time
const formatExpiry = (dateString: string): string => {
  const expiryDate = new Date(dateString);
  const now = new Date();
  
  const diffHours = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60));
  
  if (diffHours < 24) {
    return `${diffHours} hours`;
  } else {
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days`;
  }
};

export default NearbyDeals; 