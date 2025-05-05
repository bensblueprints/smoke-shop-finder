// Remove invalid module declarations
// declare module 'react';
// declare module 'react/jsx-runtime';

import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import ShopListing from './components/ShopListing';
import Footer from './components/Footer';
import { ShopProvider } from './context/ShopContext';
import ImportPage from './pages/admin/ImportPage';
import LoginPage from './pages/auth/LoginPage';
import AddListingPage from './pages/listings/AddListingPage';
import ListingSubmittedPage from './pages/listings/ListingSubmittedPage';
import DashboardPage from './pages/admin/DashboardPage';
import MembershipPage from './pages/MembershipPage';
import ShopSection from './components/ShopSection';
import SeshMessenger from './components/SeshMessenger';
import LocalBudtender from './components/LocalBudtender';
import FlowerFriendlyEvents from './components/FlowerFriendlyEvents';
import AppMenu from './components/AppMenu';
import Cart from './components/Cart';
import CartButton from './components/CartButton';
import { CartProvider } from './context/CartContext';
import ShopifyProvider from './context/ShopifyContext';
import GlobalCitizenTravelsPage from './pages/GlobalCitizenTravelsPage';
import VerifyCard from './pages/api/verify-card';

import { Store, Search, Map, Clock, Check, TrendingUp, Gift, Sparkles, ShoppingBag, Package, FireExtinguisher, Leaf, MessageCircle } from 'lucide-react';

// Main layout component with menu
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="flex-grow flex">
        <div className="hidden md:block w-64 p-4">
          <AppMenu activePath={location.pathname} />
        </div>
        <main className="flex-grow">
          {children}
        </main>
      </div>
      <Footer />
      <AppMenu activePath={location.pathname} />
      <Cart />
    </div>
  );
};

// Home page content
const HomePage: React.FC = () => {
  return (
    <>
      <div className="bg-gradient-to-r from-indigo-900 to-brand-900 py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Find Tobacco, Vape & CBD Shops Near You
          </h1>
          <p className="text-indigo-200 text-lg max-w-2xl mx-auto mb-8">
            Browse our comprehensive directory of local shops. Claim your business listing today to enhance your online presence.
          </p>
          
          {/* MEGA DEAL BANNER - $420 FREE MERCHANDISE */}
          <div className="my-8 px-4 py-6 bg-gradient-to-r from-brand-700 to-accent rounded-xl border-2 border-brand-200 shadow-2xl mx-auto max-w-5xl relative overflow-hidden">
            {/* Floating cannabis leaves animation */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute animate-float"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.5}s`,
                    transform: `rotate(${Math.random() * 360}deg)`
                  }}
                >
                  <Leaf className="h-8 w-8 text-brand-200" />
                </div>
              ))}
            </div>
            
            {/* Banner content */}
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start">
                    <span className="inline-block p-2 bg-yellow-400 text-brand-900 font-black text-2xl md:text-4xl rounded-md mr-3 transform -rotate-3 shadow-md">
                      $420
                    </span>
                    <div>
                      <h2 className="text-xl md:text-3xl font-bold text-white">
                        FREE MERCHANDISE
                      </h2>
                      <p className="text-brand-200 font-medium">
                        INSTANTLY WHEN YOU SIGN UP!
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="text-center md:text-left md:mx-4 mb-4 md:mb-0">
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    <div className="flex items-center bg-white/20 px-2 py-1 rounded text-white text-xs">
                      <Package className="h-3 w-3 mr-1" /> Glass
                    </div>
                    <div className="flex items-center bg-white/20 px-2 py-1 rounded text-white text-xs">
                      <Package className="h-3 w-3 mr-1" /> Vapes
                    </div>
                    <div className="flex items-center bg-white/20 px-2 py-1 rounded text-white text-xs">
                      <Package className="h-3 w-3 mr-1" /> CBD
                    </div>
                    <div className="flex items-center bg-white/20 px-2 py-1 rounded text-white text-xs">
                      <Package className="h-3 w-3 mr-1" /> Delta 8
                    </div>
                    <div className="flex items-center bg-white/20 px-2 py-1 rounded text-white text-xs">
                      <Package className="h-3 w-3 mr-1" /> + More!
                    </div>
                  </div>
                  <p className="text-brand-100 text-xs md:text-sm mt-2">
                    From premium brands in 50+ participating companies nationwide!
                  </p>
                </div>
                
                <a 
                  href="/membership" 
                  className="px-5 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-brand-900 font-bold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg text-lg relative"
                >
                  <span className="absolute -top-2 -right-2 bg-accent text-white text-xs px-2 py-1 rounded-full">
                    TODAY
                  </span>
                  GET YOUR CARD NOW
                  <span className="block text-xs font-normal">Only $4.20/year</span>
                </a>
              </div>
              
              <p className="text-white/70 text-xs mt-4 max-w-4xl mx-auto">
                Sign up for our $4.20 membership card and receive $420 worth of products and exclusive deals from our partner companies. 
                New merchandise delivered to your inbox daily at 4:20 PM. Limited time offer!
              </p>
            </div>
          </div>
          
          {/* Featured stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-10">
            <div className="bg-brand-800/30 border border-brand-700/50 rounded-lg p-4 backdrop-blur-sm">
              <Store className="h-8 w-8 text-brand-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">17,900+</p>
              <p className="text-brand-300/70 text-sm">Shops Listed</p>
            </div>
            <div className="bg-brand-800/30 border border-brand-700/50 rounded-lg p-4 backdrop-blur-sm">
              <Map className="h-8 w-8 text-brand-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">50</p>
              <p className="text-brand-300/70 text-sm">States Covered</p>
            </div>
            <div className="bg-brand-800/30 border border-brand-700/50 rounded-lg p-4 backdrop-blur-sm">
              <Check className="h-8 w-8 text-brand-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">100%</p>
              <p className="text-brand-300/70 text-sm">Free to Use</p>
            </div>
            <div className="bg-brand-800/30 border border-brand-700/50 rounded-lg p-4 backdrop-blur-sm">
              <TrendingUp className="h-8 w-8 text-brand-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">Daily</p>
              <p className="text-brand-300/70 text-sm">Updates</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Shop Section */}
      <div className="py-10">
        <div className="container mx-auto px-4">
          <ShopSection />
        </div>
      </div>
      
      {/* Events Section */}
      <div className="py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <FlowerFriendlyEvents />
        </div>
      </div>
      
      {/* Premium Banner */}
      <div className="bg-indigo-50 border-y border-indigo-100">
        <div className="container mx-auto py-4 px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <Store className="h-5 w-5 mr-2 text-brand-600" />
              <span className="text-brand-800 font-medium">Are you a shop owner?</span>
            </div>
            <p className="text-brand-700 text-sm mr-4">
              Claim your listing to increase visibility and attract more customers!
            </p>
            <a 
              href="/add-listing" 
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-md transition-colors text-sm font-medium"
            >
              Claim Your Shop
            </a>
          </div>
        </div>
      </div>
      
      {/* Discount Card Banner */}
      <div className="bg-gradient-to-r from-accent-dark to-accent border-y border-accent">
        <div className="container mx-auto py-4 px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <Gift className="h-5 w-5 mr-2 text-white" />
              <span className="text-white font-medium">Save 10% at participating shops!</span>
            </div>
            <p className="text-white/80 text-sm mr-4">
              Get our discount card for just $4.20/year and receive daily deals at 4:20 PM!
            </p>
            <a 
              href="/membership" 
              className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-neutral rounded-md transition-colors text-sm font-medium"
            >
              Get Your Card
            </a>
          </div>
        </div>
      </div>
      
      {/* Shop Listings and Chat Section */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ShopListing />
          </div>
          <div>
            <div className="sticky top-20 space-y-8">
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center text-neutral">
                  <MessageCircle className="h-5 w-5 mr-2 text-accent" />
                  Sesh Messenger
                </h2>
                
                {/* Vape Girl Image */}
                <div className="mb-4 rounded-xl overflow-hidden shadow-md bg-gradient-to-r from-indigo-50 to-pink-50 p-2">
                  <img 
                    src="https://images.unsplash.com/photo-1574039334535-8792cb28eb6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Girl with vape" 
                    className="w-full h-auto rounded-lg object-cover"
                  />
                  <p className="text-xs text-center text-gray-500 mt-1 italic">Enjoy responsibly</p>
                </div>
                
                <p className="text-gray-600 mb-4">
                  Connect with other enthusiasts about products, deals, and meetups!
                </p>
                <SeshMessenger />
              </div>
              
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center text-neutral">
                  <Leaf className="h-5 w-5 mr-2 text-green-600" />
                  Local Budtender
                </h2>
                <p className="text-gray-600 mb-4">
                  Find products available at local shops in your area!
                </p>
                <LocalBudtender />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Product Page content
const ProductsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <ShopSection />
    </div>
  );
};

// Events Page content
const EventsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <FlowerFriendlyEvents />
    </div>
  );
};

// Shop page for individual shop display
const Shop: React.FC = () => {
  const location = useLocation();
  const shopId = location.pathname.split('/shop/')[1];
  
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-neutral">Shop Details</h1>
      <p className="text-gray-600 mb-8">Viewing shop with ID: {shopId}</p>
      
      <div className="bg-white rounded-xl shadow-md p-6">
        <ShopListing showFilters={false} initialShopId={shopId} />
      </div>
    </div>
  );
};

// Shops listing page
const ShopsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-neutral">Find Shops Near You</h1>
      <ShopListing showFilters={true} />
    </div>
  );
};

// Chat page with Sesh Messenger
const ChatPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-neutral">Sesh Messenger</h1>
        
        {/* Vape Girl Image */}
        <div className="mb-8 rounded-xl overflow-hidden shadow-md bg-gradient-to-r from-indigo-50 to-pink-50 p-2">
          <img 
            src="https://images.unsplash.com/photo-1574039334535-8792cb28eb6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
            alt="Girl with vape" 
            className="w-full h-auto rounded-lg object-cover"
          />
          <p className="text-xs text-center text-gray-500 mt-1 italic">Enjoy responsibly</p>
        </div>
        
        <SeshMessenger />
      </div>
    </div>
  );
};

function App() {
  return (
    <ShopProvider>
      <CartProvider>
        <ShopifyProvider>
          <BrowserRouter>
            <CartButton />
            <Routes>
              <Route path="/admin">
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="import" element={<ImportPage />} />
              </Route>
              
              <Route path="/auth">
                <Route path="login" element={<LoginPage />} />
              </Route>
              
              <Route path="/listings">
                <Route path="add" element={<AddListingPage />} />
                <Route path="submitted" element={<ListingSubmittedPage />} />
              </Route>
              
              {/* Shop paths */}
              <Route path="/shop/:id" element={<MainLayout><Shop /></MainLayout>} />
              <Route path="/shops" element={<MainLayout><ShopsPage /></MainLayout>} />
              
              {/* Membership and verification */}
              <Route path="/membership" element={<MembershipPage />} />
              <Route path="/verify-card" element={<VerifyCard />} />
              
              {/* Other main routes */}
              <Route path="/global-travels" element={<MainLayout><GlobalCitizenTravelsPage /></MainLayout>} />
              <Route path="/products" element={<MainLayout><ProductsPage /></MainLayout>} />
              <Route path="/events" element={<MainLayout><EventsPage /></MainLayout>} />
              <Route path="/chat" element={<MainLayout><ChatPage /></MainLayout>} />
              
              <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
            </Routes>
          </BrowserRouter>
        </ShopifyProvider>
      </CartProvider>
    </ShopProvider>
  );
}

export default App;