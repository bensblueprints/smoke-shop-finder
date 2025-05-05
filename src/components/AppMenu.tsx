import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Store, Search, ShoppingBag, Calendar, MessageCircle, 
  Users, Map, Zap, Star, Settings, Menu, X, Home
} from 'lucide-react';

interface AppMenuItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: number | string;
}

const menuItems: AppMenuItem[] = [
  {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: <Home className="h-5 w-5" />
  },
  {
    id: 'shops',
    label: 'Shops',
    path: '/shops',
    icon: <Store className="h-5 w-5" />,
    badge: '17K+'
  },
  {
    id: 'products',
    label: 'Shop',
    path: '/products',
    icon: <ShoppingBag className="h-5 w-5" />
  },
  {
    id: 'events',
    label: 'Events',
    path: '/events',
    icon: <Calendar className="h-5 w-5" />,
    badge: 'New'
  },
  {
    id: 'chat',
    label: 'Connect',
    path: '/chat',
    icon: <MessageCircle className="h-5 w-5" />
  },
  {
    id: 'community',
    label: 'Community',
    path: '/community',
    icon: <Users className="h-5 w-5" />
  },
  {
    id: 'map',
    label: 'Map View',
    path: '/map',
    icon: <Map className="h-5 w-5" />
  },
  {
    id: 'deals',
    label: 'Deals',
    path: '/deals',
    icon: <Zap className="h-5 w-5" />,
    badge: 4
  },
  {
    id: 'membership',
    label: 'Membership',
    path: '/membership',
    icon: <Star className="h-5 w-5" />
  }
];

interface AppMenuProps {
  activePath?: string;
}

const AppMenu: React.FC<AppMenuProps> = ({ activePath = '/' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <>
      {/* Desktop Menu */}
      <div className="hidden md:block bg-white shadow-md rounded-xl p-3 sticky top-4">
        <div className="space-y-2">
          {menuItems.map(item => (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                activePath === item.path
                  ? 'bg-brand text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </div>
              
              {item.badge && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activePath === item.path
                    ? 'bg-white text-brand'
                    : 'bg-brand text-white'
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
      
      {/* Mobile Menu Button */}
      <div className="fixed bottom-6 right-6 md:hidden z-40">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-4 bg-brand text-white rounded-full shadow-lg"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>
      
      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-30 md:hidden transition-transform duration-300 transform ${
        mobileMenuOpen ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl max-h-[80vh] overflow-y-auto">
          <div className="p-5">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-xl text-neutral">Menu</h3>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {menuItems.map(item => (
                <Link
                  key={item.id}
                  to={item.path}
                  className="flex flex-col items-center justify-center p-4 rounded-xl transition-colors relative"
                  style={{
                    backgroundColor: activePath === item.path ? '#f0f4ff' : 'white',
                    color: activePath === item.path ? '#6366f1' : '#4b5563'
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="text-center">
                    <div className={`p-2.5 rounded-full mb-2 mx-auto ${
                      activePath === item.path ? 'bg-brand text-white' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {item.icon}
                    </div>
                    <span className="text-xs font-medium">{item.label}</span>
                    
                    {item.badge && (
                      <span className="absolute top-1 right-1 text-xs px-1.5 py-0.5 rounded-full bg-accent text-white text-[10px]">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppMenu; 