import React, { useState, useEffect } from 'react';
import { Store, Image as ImageIcon } from 'lucide-react';

interface ShopImageProps {
  shopName: string;
  shopAddress?: string;
  className?: string;
  fallbackType?: 'tobacco' | 'vape' | 'cbd' | 'hookah' | 'default';
}

const ShopImage: React.FC<ShopImageProps> = ({ 
  shopName, 
  shopAddress, 
  className = '',
  fallbackType = 'default' 
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // In a real application, you would connect to a proper image search API
  // For now, we'll simulate this with placeholder images
  useEffect(() => {
    // Simulate API delay
    setIsLoading(true);
    setError(false);

    const simulateFetch = async () => {
      try {
        // In a real implementation, this would be an actual API call to Google Places or similar
        // For now, we'll randomly select from placeholder images based on shop type
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
        
        // Generate a random number to simulate different images
        const randomId = Math.floor(Math.random() * 100);
        
        // In a real app this would be from Google Places or a similar API
        // For now we'll use placeholder images
        let placeholderUrl;
        
        switch (fallbackType) {
          case 'tobacco':
            placeholderUrl = `https://source.unsplash.com/random/400x300/?tobacco,shop`;
            break;
          case 'vape':
            placeholderUrl = `https://source.unsplash.com/random/400x300/?vape,shop`;
            break;
          case 'cbd':
            placeholderUrl = `https://source.unsplash.com/random/400x300/?cbd,shop`;
            break;
          case 'hookah':
            placeholderUrl = `https://source.unsplash.com/random/400x300/?hookah,lounge`;
            break;
          default:
            placeholderUrl = `https://source.unsplash.com/random/400x300/?smoke,shop`;
        }
        
        setImageUrl(placeholderUrl);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching shop image:', err);
        setError(true);
        setIsLoading(false);
      }
    };

    simulateFetch();
  }, [shopName, shopAddress, fallbackType]);

  // Generate a background color based on shop name for fallback
  const getFallbackColor = () => {
    if (!shopName) return 'bg-purple-700';
    
    // Simple hash function to generate a consistent color for the same shop name
    const hash = shopName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = hash % 360;
    
    return `bg-gradient-to-r from-purple-700 to-purple-900`;
  };

  if (isLoading) {
    return (
      <div className={`w-full relative rounded-lg overflow-hidden bg-gray-200 animate-pulse ${className}`} style={{ height: '200px' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <ImageIcon className="h-12 w-12 text-gray-400" />
        </div>
      </div>
    );
  }

  if (error || !imageUrl) {
    return (
      <div className={`w-full relative rounded-lg overflow-hidden ${getFallbackColor()} ${className}`} style={{ height: '200px' }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
          <Store className="h-12 w-12 mb-2" />
          <div className="text-center">
            <p className="font-medium">{shopName}</p>
            {shopAddress && <p className="text-sm opacity-80">{shopAddress}</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full relative rounded-lg overflow-hidden ${className}`} style={{ height: '200px' }}>
      <img 
        src={imageUrl} 
        alt={`${shopName} shop front`} 
        className="w-full h-full object-cover"
        onError={() => setError(true)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
        <div className="p-3 text-white">
          <h3 className="font-medium">{shopName}</h3>
          {shopAddress && <p className="text-sm opacity-80">{shopAddress}</p>}
        </div>
      </div>
    </div>
  );
};

export default ShopImage; 