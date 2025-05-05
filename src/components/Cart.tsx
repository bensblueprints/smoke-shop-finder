import React from 'react';
import { X, Minus, Plus, ShoppingBag, AlertCircle, Trash2, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart: React.FC = () => {
  const { 
    cartItems, 
    cartTotal, 
    isCartOpen, 
    closeCart, 
    removeFromCart, 
    updateQuantity,
    clearCart 
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/50 transition-opacity" 
        onClick={closeCart}
      />
      
      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md transform transition-transform ease-in-out duration-300">
          <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-5 sm:px-6 bg-brand text-white">
              <h2 className="text-lg font-medium flex items-center">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Your Cart
                <span className="ml-2 text-sm bg-white text-brand rounded-full px-2 py-0.5">
                  {cartItems.length} items
                </span>
              </h2>
              <button 
                className="rounded-md text-white hover:text-gray-200 focus:outline-none"
                onClick={closeCart}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Cart contents */}
            <div className="flex-1 py-6 px-4 sm:px-6 overflow-auto">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="h-12 w-12 mx-auto text-gray-300" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Your cart is empty</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Looks like you haven't added any items to your cart yet
                  </p>
                  <div className="mt-6">
                    <button
                      className="px-4 py-2 bg-brand text-white rounded-md hover:bg-brand-dark transition-colors"
                      onClick={closeCart}
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {cartItems.map(item => {
                    const { product, variant, quantity, id } = item;
                    const price = variant ? variant.price : product.price;
                    const mainImage = product.images.length > 0 ? product.images[0].src : '';
                    
                    return (
                      <div key={id} className="flex py-5 border-b border-gray-200">
                        {/* Image */}
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <img
                            src={mainImage}
                            alt={product.title}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        
                        {/* Details */}
                        <div className="ml-4 flex flex-1 flex-col">
                          <div>
                            <div className="flex justify-between text-base font-medium text-gray-900">
                              <h3>{product.title}</h3>
                              <p className="ml-4">${(price * quantity).toFixed(2)}</p>
                            </div>
                            {variant && (
                              <p className="mt-1 text-sm text-gray-500">{variant.title}</p>
                            )}
                            <p className="mt-1 text-sm text-gray-500">{product.vendor}</p>
                          </div>
                          
                          <div className="flex flex-1 items-end justify-between text-sm">
                            {/* Quantity selector */}
                            <div className="flex items-center border rounded-md">
                              <button
                                onClick={() => updateQuantity(id, quantity - 1)}
                                className="p-1.5 text-gray-500 hover:text-brand transition-colors"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="px-2 text-gray-900">{quantity}</span>
                              <button
                                onClick={() => updateQuantity(id, quantity + 1)}
                                className="p-1.5 text-gray-500 hover:text-brand transition-colors"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            
                            {/* Remove button */}
                            <button
                              type="button"
                              className="font-medium text-red-600 hover:text-red-500 flex items-center"
                              onClick={() => removeFromCart(id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Clear cart button */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-sm text-red-600 hover:text-red-500 flex items-center"
                      onClick={clearCart}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Clear Cart
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-200 py-5 px-4 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                  <p>Subtotal</p>
                  <p>${cartTotal.toFixed(2)}</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500 mb-6">
                  Shipping and taxes calculated at checkout.
                </p>
                <div className="mt-6">
                  <button
                    className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-brand hover:bg-brand-dark transition-colors"
                  >
                    <CreditCard className="mr-2 h-5 w-5" />
                    Checkout
                  </button>
                </div>
                <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                  <p>
                    or{' '}
                    <button
                      type="button"
                      className="text-brand font-medium hover:text-brand-dark"
                      onClick={closeCart}
                    >
                      Continue Shopping<span aria-hidden="true"> &rarr;</span>
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 