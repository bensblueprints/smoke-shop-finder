import React, { createContext, useContext, useState, useEffect } from 'react';
import { Shop } from '../types/shop';
import { loadFullShopData } from '../data/shopData';
import { parseCSVData } from '../utils/dataParser';

interface ShopContextType {
  shops: Shop[];
  loading: boolean;
  error: string | null;
  claimShop: (shopId: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

// Create context with default values
const ShopContext = createContext<ShopContextType>({
  shops: [],
  loading: true,
  error: null,
  claimShop: () => {},
  searchTerm: '',
  setSearchTerm: () => {}
});

// Export useShops hook as a named export to fix HMR issues
export const useShops = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShops must be used within a ShopProvider');
  }
  return context;
};

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadShops = async () => {
      try {
        setLoading(true);
        const csvData = await loadFullShopData();
        if (csvData) {
          console.log('Loading CSV data...');
          const parsedShops = parseCSVData(csvData);
          console.log(`Parsed ${parsedShops.length} shops`);
          setShops(parsedShops);
          setError(null);
        } else {
          throw new Error('No data received');
        }
      } catch (err) {
        setError('Failed to load shops');
        console.error('Error loading shops:', err);
      } finally {
        setLoading(false);
      }
    };

    loadShops();
  }, []);

  const claimShop = (shopId: string) => {
    setShops(prevShops =>
      prevShops.map(shop =>
        shop.id === shopId ? { ...shop, claimed: true } : shop
      )
    );
  };

  return (
    <ShopContext.Provider 
      value={{
        shops,
        loading,
        error,
        claimShop,
        searchTerm,
        setSearchTerm
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};