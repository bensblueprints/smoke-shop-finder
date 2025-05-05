import React from 'react';
import { Mail, Phone, Instagram, Facebook, Twitter, Store, MapPin, Info, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShops } from '../context/ShopContext';
import CannabisNewsFeed from './CannabisNewsFeed';

const Footer: React.FC = () => {
  // Get current year for copyright
  const currentYear = new Date().getFullYear();
  
  // Complete list of US states with their abbreviations
  const allStates = [
    { name: 'Alabama', abbr: 'AL' },
    { name: 'Alaska', abbr: 'AK' },
    { name: 'Arizona', abbr: 'AZ' },
    { name: 'Arkansas', abbr: 'AR' },
    { name: 'California', abbr: 'CA' },
    { name: 'Colorado', abbr: 'CO' },
    { name: 'Connecticut', abbr: 'CT' },
    { name: 'Delaware', abbr: 'DE' },
    { name: 'Florida', abbr: 'FL' },
    { name: 'Georgia', abbr: 'GA' },
    { name: 'Hawaii', abbr: 'HI' },
    { name: 'Idaho', abbr: 'ID' },
    { name: 'Illinois', abbr: 'IL' },
    { name: 'Indiana', abbr: 'IN' },
    { name: 'Iowa', abbr: 'IA' },
    { name: 'Kansas', abbr: 'KS' },
    { name: 'Kentucky', abbr: 'KY' },
    { name: 'Louisiana', abbr: 'LA' },
    { name: 'Maine', abbr: 'ME' },
    { name: 'Maryland', abbr: 'MD' },
    { name: 'Massachusetts', abbr: 'MA' },
    { name: 'Michigan', abbr: 'MI' },
    { name: 'Minnesota', abbr: 'MN' },
    { name: 'Mississippi', abbr: 'MS' },
    { name: 'Missouri', abbr: 'MO' },
    { name: 'Montana', abbr: 'MT' },
    { name: 'Nebraska', abbr: 'NE' },
    { name: 'Nevada', abbr: 'NV' },
    { name: 'New Hampshire', abbr: 'NH' },
    { name: 'New Jersey', abbr: 'NJ' },
    { name: 'New Mexico', abbr: 'NM' },
    { name: 'New York', abbr: 'NY' },
    { name: 'North Carolina', abbr: 'NC' },
    { name: 'North Dakota', abbr: 'ND' },
    { name: 'Ohio', abbr: 'OH' },
    { name: 'Oklahoma', abbr: 'OK' },
    { name: 'Oregon', abbr: 'OR' },
    { name: 'Pennsylvania', abbr: 'PA' },
    { name: 'Rhode Island', abbr: 'RI' },
    { name: 'South Carolina', abbr: 'SC' },
    { name: 'South Dakota', abbr: 'SD' },
    { name: 'Tennessee', abbr: 'TN' },
    { name: 'Texas', abbr: 'TX' },
    { name: 'Utah', abbr: 'UT' },
    { name: 'Vermont', abbr: 'VT' },
    { name: 'Virginia', abbr: 'VA' },
    { name: 'Washington', abbr: 'WA' },
    { name: 'West Virginia', abbr: 'WV' },
    { name: 'Wisconsin', abbr: 'WI' },
    { name: 'Wyoming', abbr: 'WY' },
    { name: 'District of Columbia', abbr: 'DC' }
  ];
  
  // Group states for the footer columns
  const statesGroups = [
    allStates.slice(0, 10),
    allStates.slice(10, 20),
    allStates.slice(20, 30),
    allStates.slice(30, 40),
    allStates.slice(40)
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter section */}
      <div className="bg-amber-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-white">Stay Updated</h3>
              <p className="text-amber-100">Subscribe to our newsletter for the latest shop updates</p>
            </div>
            <div className="w-full md:w-auto">
              <form className="flex">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="px-4 py-2 rounded-l-md w-full md:w-64 focus:outline-none text-gray-800"
                />
                <button 
                  type="submit" 
                  className="bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded-r-md font-medium transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Cannabis News Feed */}
      <CannabisNewsFeed maxItems={6} />
      
      {/* All states section */}
      <div className="bg-gray-800 py-8">
        <div className="container mx-auto px-4">
          <h3 className="text-xl font-bold mb-6 flex items-center">
            <MapPin className="h-5 w-5 text-amber-500 mr-2" />
            Browse Shops by State
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {statesGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="space-y-2">
                {group.map(state => (
                  <div key={state.abbr}>
                    <Link 
                      to={`/?state=${state.abbr}`} 
                      className="text-gray-300 hover:text-amber-500 transition-colors text-sm flex items-center"
                    >
                      <span className="w-8 text-gray-500">{state.abbr}</span>
                      <span>{state.name}</span>
                    </Link>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Store className="h-6 w-6 text-amber-500 mr-2" />
              <h3 className="text-xl font-bold">Smoke Shop Finder</h3>
            </div>
            <p className="text-gray-300 mb-4">
              The premier directory for tobacco, vape, and CBD shops across the United States.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-amber-500 transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-amber-500 transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-amber-500 transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4 flex items-center">
              <Info className="h-4 w-4 text-amber-500 mr-2" />
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-amber-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-amber-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/add-listing" className="text-gray-300 hover:text-amber-500 transition-colors">
                  Add Your Business
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-amber-500 transition-colors">
                  Industry News
                </Link>
              </li>
              <li>
                <Link to="/advertising" className="text-gray-300 hover:text-amber-500 transition-colors">
                  Advertising
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4 flex items-center">
              <Heart className="h-4 w-4 text-amber-500 mr-2" />
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-amber-500 mr-2" />
                <a href="mailto:contact@shopfinder.com" className="text-gray-300 hover:text-amber-500 transition-colors">
                  contact@shopfinder.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-amber-500 mr-2" />
                <a href="tel:+18005551234" className="text-gray-300 hover:text-amber-500 transition-colors">
                  (800) 555-1234
                </a>
              </li>
              <li className="mt-4 text-gray-400 text-sm">
                Business Hours:<br />
                Monday-Friday: 9AM - 5PM EST
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-gray-400">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {currentYear} Smoke Shop Finder. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="hover:text-amber-500 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-amber-500 transition-colors">Terms of Service</Link>
              <Link to="/sitemap" className="hover:text-amber-500 transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;