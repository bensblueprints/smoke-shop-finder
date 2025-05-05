import React, { useState, useEffect } from 'react';
import { Tag, Store, Clock, MapPin, ExternalLink, Zap, Filter } from 'lucide-react';

// Types for the deals
interface Shop {
  id: string;
  name: string;
  distance?: number;
  address?: string;
  logo?: string;
  isLocal: boolean;
}

interface Deal {
  id: string;
  title: string;
  description: string;
  discount: string;
  expiresAt: string; 
  shop: Shop;
  imageUrl: string;
  couponCode?: string;
  url?: string;
  featured?: boolean;
}

const DealsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'local' | 'online'>('all');
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulated data fetch - in a real app this would come from an API
  useEffect(() => {
    // Simulate API call
    const fetchDeals = async () => {
      setIsLoading(true);
      
      // Local deals (4)
      const localDeals: Deal[] = [
        {
          id: 'local1',
          title: 'Buy One Get One 50% OFF',
          description: 'Get a second item half price on all Delta 8 products through the weekend.',
          discount: '50% OFF',
          expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
          shop: {
            id: 'shop1',
            name: 'Green Leaf CBD',
            distance: 0.8,
            address: '123 Main St',
            logo: 'https://via.placeholder.com/100x100?text=GL',
            isLocal: true
          },
          imageUrl: 'https://images.unsplash.com/photo-1585232352617-a8ee9f33e3b9',
          featured: true
        },
        {
          id: 'local2',
          title: 'Memorial Day Blowout',
          description: 'Save 30% on all premium glass and accessories this holiday weekend.',
          discount: '30% OFF',
          expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
          shop: {
            id: 'shop2',
            name: 'Smoker\'s Paradise',
            distance: 1.3,
            address: '456 High St',
            logo: 'https://via.placeholder.com/100x100?text=SP',
            isLocal: true
          },
          imageUrl: 'https://images.unsplash.com/photo-1603909223429-69bb7101f96e'
        },
        {
          id: 'local3',
          title: 'Flash Sale: THCP',
          description: 'For the next 24 hours, get 40% off all THCP products - our biggest discount ever!',
          discount: '40% OFF',
          expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
          shop: {
            id: 'shop3',
            name: 'Cannabist',
            distance: 2.1,
            address: '789 Hemp Way',
            logo: 'https://via.placeholder.com/100x100?text=CB',
            isLocal: true
          },
          imageUrl: 'https://images.unsplash.com/photo-1616577782675-c6aa557a6fc3'
        },
        {
          id: 'local4',
          title: 'CBD Bundle Special',
          description: 'Purchase any CBD tincture and get a topical cream at half price.',
          discount: 'BUNDLE',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          shop: {
            id: 'shop4',
            name: 'Hemp Heaven',
            distance: 3.4,
            address: '101 CBD Blvd',
            logo: 'https://via.placeholder.com/100x100?text=HH',
            isLocal: true
          },
          imageUrl: 'https://images.unsplash.com/photo-1584303491885-d9a8c1b5c304'
        }
      ];
      
      // Online/brand partner deals (12)
      const onlineDeals: Deal[] = [
        {
          id: 'online1',
          title: 'Exclusive Online Offer: 25% OFF',
          description: 'First-time customers save 25% on our premium Delta 8 THC collection. Free shipping on orders over $75.',
          discount: '25% OFF',
          expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
          shop: {
            id: 'brand1',
            name: 'Delta Extrax',
            logo: 'https://via.placeholder.com/100x100?text=DE',
            isLocal: false
          },
          imageUrl: 'https://images.unsplash.com/photo-1616538318945-e558bf3ec730',
          couponCode: 'FIRST25',
          url: 'https://example.com/delta-extrax',
          featured: true
        },
        {
          id: 'online2',
          title: 'Premium Glass Clearance',
          description: 'Shop our clearance sale on designer glass pieces. Up to 45% off select items while supplies last.',
          discount: '45% OFF',
          expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
          shop: {
            id: 'brand2',
            name: 'Smoke Cartel',
            logo: 'https://via.placeholder.com/100x100?text=SC',
            isLocal: false
          },
          imageUrl: 'https://images.unsplash.com/photo-1560999448-1ca4320ab516',
          couponCode: 'GLASSSALE',
          url: 'https://example.com/smoke-cartel'
        },
        {
          id: 'online3',
          title: 'CBD Oil BOGO',
          description: 'Buy one full-spectrum CBD oil, get one 50% off. Lab-tested products with 30-day satisfaction guarantee.',
          discount: 'BOGO 50%',
          expiresAt: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days from now
          shop: {
            id: 'brand3',
            name: 'CBDistillery',
            logo: 'https://via.placeholder.com/100x100?text=CBD',
            isLocal: false
          },
          imageUrl: 'https://images.unsplash.com/photo-1579091337137-13eeb896cf1c',
          couponCode: 'BOGOCBD',
          url: 'https://example.com/cbdistillery'
        },
        {
          id: 'online4',
          title: 'Vape Starter Kit Sale',
          description: 'Complete vape starter kits now 30% off. Perfect for beginners or those looking to upgrade.',
          discount: '30% OFF',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          shop: {
            id: 'brand4',
            name: 'Vape World',
            logo: 'https://via.placeholder.com/100x100?text=VW',
            isLocal: false
          },
          imageUrl: 'https://images.unsplash.com/photo-1560024802-9acdf56be24b',
          couponCode: 'VAPESAVE30',
          url: 'https://example.com/vape-world'
        },
        {
          id: 'online5',
          title: 'HHC Gummies Flash Sale',
          description: 'Our most popular HHC gummies now 35% off for the next 48 hours. Natural flavors, vegan-friendly.',
          discount: '35% OFF',
          expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
          shop: {
            id: 'brand5',
            name: 'Botany Farms',
            logo: 'https://via.placeholder.com/100x100?text=BF',
            isLocal: false
          },
          imageUrl: 'https://images.unsplash.com/photo-1621152144243-77a6c0376aca',
          couponCode: 'HHC35NOW',
          url: 'https://example.com/botany-farms',
          featured: true
        },
        {
          id: 'online6',
          title: 'Free Shipping Weekend',
          description: 'Free shipping on all orders this weekend, no minimum purchase. Domestic orders only.',
          discount: 'FREE SHIP',
          expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
          shop: {
            id: 'brand6',
            name: '3Chi',
            logo: 'https://via.placeholder.com/100x100?text=3C',
            isLocal: false
          },
          imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7',
          couponCode: 'FREESHIP',
          url: 'https://example.com/3chi'
        },
        {
          id: 'online7',
          title: 'Delta 9 Monthly Special',
          description: 'This month\'s special: 20% off all Delta 9 products. Limited time offer.',
          discount: '20% OFF',
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          shop: {
            id: 'brand7',
            name: 'Delta Munchies',
            logo: 'https://via.placeholder.com/100x100?text=DM',
            isLocal: false
          },
          imageUrl: 'https://images.unsplash.com/photo-1585232352617-a8ee9f33e3b9',
          couponCode: 'DELTA9SAVE',
          url: 'https://example.com/delta-munchies'
        },
        {
          id: 'online8',
          title: 'Rolling Papers Clearance',
          description: 'All rolling papers and blunt wraps on clearance. Mix and match for additional savings.',
          discount: 'UP TO 50%',
          expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
          shop: {
            id: 'brand8',
            name: 'Raw Papers',
            logo: 'https://via.placeholder.com/100x100?text=RP',
            isLocal: false
          },
          imageUrl: 'https://images.unsplash.com/photo-1579119806468-923de081688a',
          couponCode: 'ROLLSAVE',
          url: 'https://example.com/raw-papers'
        },
        {
          id: 'online9',
          title: 'Kratom Premium Selection',
          description: 'Premium kratom products now 25% off. Lab-tested for purity and potency.',
          discount: '25% OFF',
          expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
          shop: {
            id: 'brand9',
            name: 'Kratom Spot',
            logo: 'https://via.placeholder.com/100x100?text=KS',
            isLocal: false
          },
          imageUrl: 'https://images.unsplash.com/photo-1616538318945-e558bf3ec730',
          couponCode: 'KSPOT25',
          url: 'https://example.com/kratom-spot'
        },
        {
          id: 'online10',
          title: 'THCA Flower Special',
          description: 'New THCA flower strains now available. Pre-order now for 15% off plus free grinder.',
          discount: '15% OFF',
          expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
          shop: {
            id: 'brand10',
            name: 'Exhale Wellness',
            logo: 'https://via.placeholder.com/100x100?text=EW',
            isLocal: false
          },
          imageUrl: 'https://images.unsplash.com/photo-1603909223429-69bb7101f96e',
          couponCode: 'THCAFLOWER',
          url: 'https://example.com/exhale-wellness'
        },
        {
          id: 'online11',
          title: 'Summer CBD Bundle',
          description: 'Get ready for summer with our CBD bundle: sunscreen, cooling gel, and tincture at 30% off.',
          discount: '30% OFF',
          expiresAt: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days from now
          shop: {
            id: 'brand11',
            name: 'Joy Organics',
            logo: 'https://via.placeholder.com/100x100?text=JO',
            isLocal: false
          },
          imageUrl: 'https://images.unsplash.com/photo-1585232352617-a8ee9f33e3b9',
          couponCode: 'SUMMER30',
          url: 'https://example.com/joy-organics'
        },
        {
          id: 'online12',
          title: 'Disposable Vape Deal',
          description: 'Buy any 2 disposable vapes and get the 3rd free. Multiple flavors available.',
          discount: 'BUY 2 GET 1',
          expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
          shop: {
            id: 'brand12',
            name: 'Diamond CBD',
            logo: 'https://via.placeholder.com/100x100?text=DC',
            isLocal: false
          },
          imageUrl: 'https://images.unsplash.com/photo-1560024802-9acdf56be24b',
          couponCode: 'VAPE3PACK',
          url: 'https://example.com/diamond-cbd'
        }
      ];
      
      // Combine all deals
      setDeals([...localDeals, ...onlineDeals]);
      setIsLoading(false);
    };
    
    fetchDeals();
  }, []);

  // Filter deals based on selection
  const filteredDeals = deals.filter(deal => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'local') return deal.shop.isLocal;
    if (activeFilter === 'online') return !deal.shop.isLocal;
    return true;
  });

  // Featured deals to show at the top
  const featuredDeals = filteredDeals.filter(deal => deal.featured);
  // Non-featured deals
  const regularDeals = filteredDeals.filter(deal => !deal.featured);

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

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-neutral mb-4 flex items-center">
          <Zap className="h-8 w-8 mr-3 text-amber-500" />
          Hot Deals
        </h1>
        <p className="text-gray-600 max-w-3xl">
          Discover the best deals from local shops and our brand partners. From exclusive online discounts to in-store specials, save big on your favorite products.
        </p>
      </div>
      
      {/* Filter tabs */}
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-white p-1 rounded-lg shadow-md border border-gray-100 flex">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeFilter === 'all'
                ? 'bg-brand text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Deals
          </button>
          <button
            onClick={() => setActiveFilter('local')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeFilter === 'local'
                ? 'bg-brand text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Local Shops
          </button>
          <button
            onClick={() => setActiveFilter('online')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeFilter === 'online'
                ? 'bg-brand text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Brand Partners
          </button>
        </div>
        <div className="text-sm text-gray-500">
          Showing {filteredDeals.length} deals
        </div>
      </div>
      
      {isLoading ? (
        // Loading skeleton
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-5 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-10 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-10">
          {/* Featured deals */}
          {featuredDeals.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-neutral mb-6 flex items-center">
                <Tag className="h-6 w-6 mr-2 text-amber-500" />
                Featured Deals
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredDeals.map(deal => (
                  <DealCard key={deal.id} deal={deal} formatExpiry={formatExpiry} />
                ))}
              </div>
            </div>
          )}
          
          {/* All deals grid */}
          <div>
            <h2 className="text-2xl font-bold text-neutral mb-6 flex items-center">
              <Tag className="h-6 w-6 mr-2 text-brand" />
              {activeFilter === 'local' ? 'Local Shop Deals' : 
               activeFilter === 'online' ? 'Online Deals' : 'All Available Deals'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {regularDeals.map(deal => (
                <DealCard key={deal.id} deal={deal} formatExpiry={formatExpiry} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Deal card component 
const DealCard: React.FC<{ deal: Deal, formatExpiry: (date: string) => string }> = ({ deal, formatExpiry }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 animate-fadeIn">
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
      
      <div className="p-5">
        <h3 className="font-bold text-xl text-neutral mb-2">{deal.title}</h3>
        <p className="text-gray-600 mb-3 line-clamp-2">{deal.description}</p>
        
        <div className="flex items-center text-gray-500 mb-3">
          <Store className="h-4 w-4 mr-1" />
          <span className="text-sm font-medium">{deal.shop.name}</span>
          {deal.shop.isLocal && deal.shop.distance && (
            <>
              <div className="mx-2 w-1 h-1 rounded-full bg-gray-300"></div>
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{deal.shop.distance} miles</span>
            </>
          )}
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center text-amber-600 text-sm">
            <Clock className="h-4 w-4 mr-1" />
            Expires in: {formatExpiry(deal.expiresAt)}
          </div>
          
          {deal.couponCode && (
            <div className="text-brand font-mono text-sm font-medium">
              {deal.couponCode}
            </div>
          )}
        </div>
        
        {/* Call to action button */}
        {deal.shop.isLocal ? (
          <a 
            href="#" 
            className="block w-full py-3 bg-brand hover:bg-brand-600 text-white text-center rounded-lg transition-colors font-medium"
          >
            View Local Deal
          </a>
        ) : (
          <a 
            href={deal.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full py-3 bg-accent hover:bg-accent-600 text-white text-center rounded-lg transition-colors font-medium flex items-center justify-center"
          >
            Shop Online <ExternalLink className="h-4 w-4 ml-2" />
          </a>
        )}
      </div>
    </div>
  );
};

export default DealsPage; 