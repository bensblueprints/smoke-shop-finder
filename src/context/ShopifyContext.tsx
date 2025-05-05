import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, ProductVariant } from '../components/ProductCard';

// Mock Shopify API client
// In production, this would be replaced with the actual Shopify Storefront API client
class ShopifyClient {
  private apiKey: string;
  private domain: string;
  
  constructor(apiKey: string, domain: string) {
    this.apiKey = apiKey;
    this.domain = domain;
  }
  
  // Fetch products from a shop
  async getProducts(shopId: string, options?: any): Promise<Product[]> {
    // In a real implementation, this would call the Shopify Storefront API
    console.log(`Fetching products for shop ${shopId} with options:`, options);
    
    // Return mock data for now
    return mockProducts;
  }
  
  // Fetch a single product
  async getProduct(productId: string): Promise<Product | null> {
    // In a real implementation, this would call the Shopify Storefront API
    console.log(`Fetching product ${productId}`);
    
    return mockProducts.find(p => p.id === productId) || null;
  }
  
  // Add item to cart
  async addToCart(productId: string, quantity: number, variantId?: string): Promise<void> {
    // In a real implementation, this would call the Shopify Storefront API
    console.log(`Adding product ${productId} to cart, quantity: ${quantity}, variant: ${variantId || 'default'}`);
  }
  
  // Create checkout
  async createCheckout(items: {productId: string, quantity: number, variantId?: string}[]): Promise<string> {
    // In a real implementation, this would call the Shopify Storefront API to create a checkout
    console.log('Creating checkout with items:', items);
    
    // Return a mock checkout URL
    return `https://${this.domain}/checkout/mock-checkout-id`;
  }
}

// Cart item type
interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  product: Product;
  variant?: ProductVariant;
  quantity: number;
}

// Context interfaces
interface ShopifyContextValue {
  isLoading: boolean;
  products: Product[];
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  shopifyClient: ShopifyClient | null;
  fetchProducts: (shopId: string, options?: any) => Promise<void>;
  getProduct: (productId: string) => Promise<Product | null>;
  addToCart: (product: Product, quantity: number, variant?: ProductVariant) => void;
  updateCartItemQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  checkout: () => Promise<string>;
  setShopifyConnection: (apiKey: string, domain: string) => void;
}

interface ShopifyProviderProps {
  children: ReactNode;
}

// Create context
const ShopifyContext = createContext<ShopifyContextValue | undefined>(undefined);

// Create provider
export const ShopifyProvider: React.FC<ShopifyProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [shopifyClient, setShopifyClient] = useState<ShopifyClient | null>(null);
  
  // Calculate cart count and total
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => {
    const price = item.variant ? item.variant.price : item.product.price;
    return total + (price * item.quantity);
  }, 0);
  
  // Initialize with demo data
  useEffect(() => {
    // For demo purposes, initialize with mock data
    setProducts(mockProducts);
  }, []);
  
  // Set Shopify connection
  const setShopifyConnection = (apiKey: string, domain: string) => {
    setShopifyClient(new ShopifyClient(apiKey, domain));
  };
  
  // Fetch products
  const fetchProducts = async (shopId: string, options?: any) => {
    if (!shopifyClient) {
      console.error('Shopify client not initialized');
      return;
    }
    
    setIsLoading(true);
    try {
      const fetchedProducts = await shopifyClient.getProducts(shopId, options);
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get a single product
  const getProduct = async (productId: string): Promise<Product | null> => {
    if (!shopifyClient) {
      console.error('Shopify client not initialized');
      return null;
    }
    
    try {
      return await shopifyClient.getProduct(productId);
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  };
  
  // Add to cart
  const addToCart = (product: Product, quantity: number, variant?: ProductVariant) => {
    setCart(prevCart => {
      // Check if the item is already in the cart
      const existingItemIndex = prevCart.findIndex(item => 
        item.productId === product.id && 
        (!variant ? !item.variantId : item.variantId === variant.id)
      );
      
      if (existingItemIndex !== -1) {
        // Update quantity if already in cart
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        // Add new item to cart
        return [
          ...prevCart,
          {
            id: `${product.id}${variant ? `-${variant.id}` : ''}-${Date.now()}`,
            productId: product.id,
            variantId: variant?.id,
            product,
            variant,
            quantity
          }
        ];
      }
    });
    
    // If we had a real Shopify client, we'd also call it here
    if (shopifyClient) {
      shopifyClient.addToCart(product.id, quantity, variant?.id);
    }
  };
  
  // Update cart item quantity
  const updateCartItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };
  
  // Remove from cart
  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };
  
  // Clear cart
  const clearCart = () => {
    setCart([]);
  };
  
  // Checkout
  const checkout = async (): Promise<string> => {
    if (!shopifyClient) {
      console.error('Shopify client not initialized');
      return '';
    }
    
    try {
      const items = cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        variantId: item.variantId
      }));
      
      return await shopifyClient.createCheckout(items);
    } catch (error) {
      console.error('Error creating checkout:', error);
      return '';
    }
  };
  
  const contextValue: ShopifyContextValue = {
    isLoading,
    products,
    cart,
    cartCount,
    cartTotal,
    shopifyClient,
    fetchProducts,
    getProduct,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    checkout,
    setShopifyConnection
  };
  
  return (
    <ShopifyContext.Provider value={contextValue}>
      {children}
    </ShopifyContext.Provider>
  );
};

// Custom hook to use the Shopify context
export const useShopify = () => {
  const context = useContext(ShopifyContext);
  
  if (context === undefined) {
    throw new Error('useShopify must be used within a ShopifyProvider');
  }
  
  return context;
};

// Mock data for demo purposes
const mockProducts: Product[] = [
  {
    id: 'prod1',
    title: 'Premium CBD Oil Tincture',
    price: 49.99,
    compareAtPrice: 59.99,
    description: 'Our premium CBD oil tincture is made with high-quality hemp extract and MCT oil. Each 30ml bottle contains 1000mg of CBD, offering a potent dose for maximum benefits.',
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
    subcategory: 'Tinctures',
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
    description: 'Our Delta 8 THC gummies offer a delicious way to enjoy the benefits of hemp-derived cannabinoids. Each gummy contains 25mg of Delta 8 THC, perfect for relaxation.',
    images: [
      {
        id: 'img3',
        src: 'https://images.unsplash.com/photo-1615845522188-d940828fa9a4',
        alt: 'Delta 8 Gummies'
      }
    ],
    category: 'Delta 8',
    subcategory: 'Edibles',
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
    description: 'Premium THCA flower, Sour Diesel strain. Lab tested for potency and purity. This high-quality hemp flower is rich in cannabinoids and terpenes for a full entourage effect.',
    images: [
      {
        id: 'img4',
        src: 'https://images.unsplash.com/photo-1603909223429-69bb7101f96e',
        alt: 'THCA Flower'
      }
    ],
    category: 'Flower',
    subcategory: 'THCA',
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
    description: 'Handcrafted borosilicate glass water pipe with percolator for smooth hits. Features a sturdy base and ice catcher for enhanced filtration and cooling.',
    images: [
      {
        id: 'img5',
        src: 'https://images.unsplash.com/photo-1560999448-1ca4320ab516',
        alt: 'Glass Water Pipe'
      }
    ],
    category: 'Accessories',
    subcategory: 'Water Pipes',
    tags: ['Glass', 'Water Pipe', 'Bong', 'Percolator'],
    vendor: 'Pulsar',
    inStock: true,
    rating: 4.9,
    reviewCount: 75
  },
  {
    id: 'prod5',
    title: 'THCP Vape Cartridge - Blueberry',
    price: 54.99,
    description: 'Experience the powerful effects of THCP with our premium vape cartridge. This 1ml cartridge features THCP distillate with natural blueberry terpenes.',
    images: [
      {
        id: 'img6',
        src: 'https://images.unsplash.com/photo-1563124392-42f9c01e5e4c',
        alt: 'THCP Vape Cartridge'
      }
    ],
    category: 'Vapes',
    subcategory: 'THCP',
    tags: ['THCP', 'Vape', 'Cartridge', 'Blueberry'],
    vendor: 'Binoid',
    inStock: true,
    rating: 4.6,
    reviewCount: 32,
    labReports: [
      {
        id: 'lab4',
        title: 'THCP Analysis Report',
        fileUrl: 'https://example.com/lab-reports/thcp-vape-coa.pdf',
        date: '2023-06-23',
        testType: 'Potency & Terpenes'
      }
    ],
    thcContent: '1000mg THCP'
  }
];

export default ShopifyProvider; 