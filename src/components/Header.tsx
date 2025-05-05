import React, { useState, useEffect } from 'react';
import { Search, MapPin, Store, LogIn, Gift } from 'lucide-react';
import { useShops } from '../context/ShopContext';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

const Header: React.FC = () => {
  const { setSearchTerm, searchTerm } = useShops();
  const [inputValue, setInputValue] = useState(searchTerm);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(inputValue);
  };

  return (
    <header 
      className={`sticky top-0 z-10 w-full transition-all duration-300 ${
        isScrolled ? 'bg-black shadow-md py-2' : 'bg-gradient-to-r from-black to-amber-900 py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <Link to="/" className="flex items-center">
              <Store className={`h-6 w-6 mr-2 transition-colors duration-300 ${
                isScrolled ? 'text-amber-500' : 'text-amber-400'
              }`} />
              <h1 
                className={`text-2xl font-bold mr-2 transition-colors duration-300 ${
                  isScrolled ? 'text-amber-500' : 'text-amber-400'
                }`}
              >
                ShopFinder
              </h1>
            </Link>
            <span 
              className={`text-sm font-medium transition-colors duration-300 ${
                isScrolled ? 'text-amber-600' : 'text-amber-300'
              }`}
            >
              Tobacco, Vape & CBD Directory
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <form 
              onSubmit={handleSearch} 
              className="relative flex items-center"
            >
              <div className="relative">
                <MapPin 
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${
                    isScrolled ? 'text-amber-700' : 'text-amber-200'
                  }`} 
                />
                <input
                  type="text"
                  placeholder="City, state, or zip code"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full md:w-64 rounded-l-lg border border-amber-700 bg-black/50 text-amber-100 placeholder-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-black font-medium p-2 rounded-r-lg transition-colors duration-200 flex items-center"
              >
                <Search className="h-5 w-5" />
                <span className="ml-1 hidden sm:inline">Search</span>
              </button>
            </form>

            <div className="flex items-center space-x-2">
              <Link
                to="/membership"
                className="px-4 py-2 text-sm font-medium text-black bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors duration-200 hidden md:flex items-center"
              >
                <Gift className="h-4 w-4 mr-2" />
                $4.20 Card
              </Link>

              <Link
                to="/add-listing"
                className="px-4 py-2 text-sm font-medium text-black bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors duration-200 hidden md:flex items-center"
              >
                <Store className="h-4 w-4 mr-2" />
                Add Your Listing
              </Link>
              
              {user ? (
                <Link
                  to="/dashboard"
                  className="px-4 py-2 text-sm font-medium text-amber-500 border border-amber-500 hover:bg-amber-500 hover:text-black rounded-lg transition-colors duration-200 flex items-center"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-amber-500 border border-amber-500 hover:bg-amber-500 hover:text-black rounded-lg transition-colors duration-200 flex items-center"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;