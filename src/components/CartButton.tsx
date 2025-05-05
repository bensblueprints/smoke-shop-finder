import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartButton: React.FC = () => {
  const { cartCount, openCart } = useCart();
  
  return (
    <button 
      className="relative p-2 rounded-full bg-brand text-white hover:bg-brand-dark transition-colors"
      onClick={openCart}
      aria-label="Open cart"
    >
      <ShoppingBag className="h-5 w-5" />
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-accent text-white text-xs font-bold">
          {cartCount}
        </span>
      )}
    </button>
  );
};

export default CartButton; 