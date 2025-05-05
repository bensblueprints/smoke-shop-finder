import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  imageUrl: string;
  count: number;
}

interface ProductCategoriesProps {
  categories: Category[];
  onSelectCategory: (categoryId: string) => void;
  className?: string;
}

const ProductCategories: React.FC<ProductCategoriesProps> = ({
  categories,
  onSelectCategory,
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
        <h2 className="text-2xl font-bold text-neutral">Shop by Category</h2>
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
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category, index) => (
          <div 
            key={category.id}
            className="flex-shrink-0 animate-slideUp"
            style={{ 
              width: '220px', 
              scrollSnapAlign: 'start',
              animationDelay: `${index * 0.1}s`
            }}
          >
            <button
              onClick={() => onSelectCategory(category.id)}
              className="w-full h-full"
            >
              <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                  <img 
                    src={category.imageUrl} 
                    alt={category.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                    <div>
                      <h3 className="text-white font-semibold text-lg">{category.name}</h3>
                      <p className="text-white/80 text-sm">{category.count} products</p>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCategories; 