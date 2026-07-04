'use client';

import { useState } from 'react';
import { ShoppingCart, Plus, Minus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  price: number;
  site_id: string;
  description?: string;
  image_url?: string;
  stock?: number;
  is_active?: boolean;
}

export function StorefrontBlock({ products, storeName }: { products: Product[], storeName?: string }) {
  const [cart, setCart] = useState<{product: Product, quantity: number}[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const activeProducts = products.filter(p => p.is_active !== false);

  const addToCart = (product: Product) => {
    // If out of stock, do nothing
    if (product.stock === 0) return;

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        // Enforce stock limit
        if (product.stock !== undefined && product.stock !== -1 && existing.quantity >= product.stock) {
          alert(`Sorry! Only ${product.stock} units are currently available.`);
          return prev;
        }
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQuantity = item.quantity + delta;
        // Enforce stock limit on increase
        if (delta > 0 && item.product.stock !== undefined && item.product.stock !== -1 && newQuantity > item.product.stock) {
          alert(`Sorry! Only ${item.product.stock} units are currently available.`);
          return item;
        }
        return { ...item, quantity: Math.max(0, newQuantity) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(c => ({ name: c.product.name, price: c.product.price, quantity: c.quantity })),
          successUrl: window.location.origin + '/checkout/success?session_id={CHECKOUT_SESSION_ID}',
          cancelUrl: window.location.href,
        }),
      });
      
      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      } else {
        alert('Checkout failed: No URL returned');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout failed. Please try again.');
    }
  };

  return (
    <section className="py-16 bg-white relative text-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
              {storeName || 'Our Products'}
            </h2>
            <p className="text-gray-500 mt-2 text-lg">Shop our latest collection</p>
          </div>
          
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ShoppingCart className="w-6 h-6 text-gray-900" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {activeProducts.length > 0 ? activeProducts.map((product) => {
            const isOutOfStock = product.stock === 0;
            const isLowStock = product.stock !== undefined && product.stock > 0 && product.stock <= 5;
            
            return (
              <div key={product.id} className="group flex flex-col relative">
                <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-4 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                      isOutOfStock ? 'opacity-40 grayscale' : ''
                    }`}
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=No+Image' }}
                  />
                  
                  {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                      <span className="bg-rose-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-md">
                        Out of Stock
                      </span>
                    </div>
                  )}

                  {!isOutOfStock && (
                    <button 
                      onClick={() => addToCart(product)}
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-gray-900 font-bold px-6 py-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-105"
                    >
                      Add to Cart
                    </button>
                  )}
                  
                  {isLowStock && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-sm">
                        Only {product.stock} left!
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{product.name}</h3>
                <p className="text-gray-500 text-sm mb-2 line-clamp-2 flex-grow">{product.description}</p>
                <div className="font-bold text-gray-900">${product.price.toFixed(2)}</div>
              </div>
            );
          }) : (
            <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              No products available in this store yet.
            </div>
          )}
        </div>
      </div>

      {/* Slide-over Cart */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                <h2 className="text-2xl font-bold text-gray-900">Your Cart</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-6 h-6 text-gray-900" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="text-center text-gray-500 mt-20">
                    <ShoppingCart className="w-16 h-16 mx-auto text-gray-200 mb-4" />
                    <p>Your cart is empty.</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.product.id} className="flex gap-4">
                      <div className="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between font-bold text-gray-900">
                            <h3 className="truncate max-w-[200px]">{item.product.name}</h3>
                            <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">${item.product.price.toFixed(2)} each</p>
                        </div>
                        
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                            <button 
                              onClick={() => updateQuantity(item.product.id, -1)}
                              className="p-1.5 hover:bg-gray-50 transition-colors text-gray-500 hover:text-gray-900"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-3 text-sm font-semibold text-gray-800">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.product.id, 1)}
                              className="p-1.5 hover:bg-gray-50 transition-colors text-gray-500 hover:text-gray-900"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-gray-100 space-y-4 bg-white">
                  <div className="flex justify-between font-bold text-lg text-gray-900">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-gray-200"
                  >
                    Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
