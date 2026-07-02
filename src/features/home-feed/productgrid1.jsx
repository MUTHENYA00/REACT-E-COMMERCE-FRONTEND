import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 

import { useCurrency } from '../../hooks/useCurrency';
// 1. STATE BINDING IMPORT: Connects this grid layout spoke directly to the store hub
import { useCartStore } from '../../store/useCartStore';

export default function ProductGrid1({ products = [] }) {
  const { formatPrice, loading } = useCurrency();
  const [wishlistedIds, setWishlistedIds] = useState(new Set());

  // 2. STATE HUB METHOD EXTRACTION: Pulls the reactive action right into the file
  const addItem = useCartStore((state) => state.addItem);

  const toggleWishlist = (e, id) => {
    e.stopPropagation(); 
    e.preventDefault();
    
    setWishlistedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // 3. COMPLETE ACTION WIRING UPDATE
  const handleCartClick = (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Transmits the clicked item's numerical identifier straight to the cart vault
    addItem(id, 1);
    console.log(`Added product ${id} to global state store ledger.`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-5 py-12 text-center text-sm font-medium text-gray-500 bg-gray-50 rounded-2xl border border-gray-100">
        Detecting location and updating local currency rates...
      </div>
    );
  }

  if (!products || products.length === 0) {
    return <div className="p-5 text-xs text-gray-400">Loading products...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-5 py-8 space-y-4 bg-gray-50">
      
      {/* Header Info */}
      <div className="border-b border-gray-200 pb-3">
        <h2 className="text-xl font-bold text-gray-800 tracking-tight">Today's Picks For You</h2>
        <p className="text-xs text-gray-400">Scroll sideways manually to explore our latest items.</p>
      </div>

      {/* STATIC HORIZONTAL SCROLL TRACK */}
      <div className="flex items-center gap-5 overflow-x-auto scrollbar-none pb-4 pt-1 snap-x snap-mandatory select-none">

        {products.map((product) => (
          
          /* THE PRODUCT PLACARD AS A BLOCK LINK */
          <Link 
            to={`/product/${product.id}`} 
            key={product.id} 
            className="group w-[210px] sm:w-[230px] shrink-0 bg-white rounded-2xl border border-gray-200 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden snap-start flex flex-col justify-between relative block object-contain"
          >
            {/* 1. UPPER VISUAL LAYOUT */}
            <div className="w-full h-44 bg-gray-100 overflow-hidden relative">
              
              <img 
                src={product.imageUrl || null} 
                alt={product.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy" 
              />

              {/* AUTOMATED STOCK BADGE */}
              {product.stockCount <= 3 && (
                <span className="absolute top-2.5 left-2.5 z-10 text-[9px] font-bold uppercase tracking-wider bg-rose-500 text-white px-1.5 py-0.5 rounded-md shadow-xs">
                  Only {product.stockCount} Left
                </span>
              )}

              {/* HEART WISHLIST BUTTON */}
              <button 
                onClick={(e) => toggleWishlist(e, product.id)}
                className="absolute top-2.5 right-2.5 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-xs transition-all active:scale-90 cursor-pointer flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`w-3.5 h-3.5 transition-colors ${wishlistedIds.has(product.id) ? 'fill-rose-500 stroke-rose-500' : 'fill-transparent stroke-gray-400 group-hover:stroke-gray-600'}`} strokeWidth="2">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </button>
            </div>

            {/* 2. LOWER DATA DETAILS LAYER */}
            <div className="p-4 flex flex-col gap-1 bg-white">
              <h3 className="text-xs font-bold text-gray-800 tracking-tight truncate m-0">
                {product.title}
              </h3>

              <p className="text-[11px] font-normal text-gray-400 leading-normal line-clamp-2 min-h-[32px] m-0">
                {product.description}
              </p>

              {/* Pricing & Cart Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-1">
                <span className="text-sm font-extrabold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                
                {/* CONNECTED INTERACTIVE GATEWAY TRIGGER BUTTON */}
                <button 
                  onClick={(e) => handleCartClick(e, product.id)}
                  className="p-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center w-7 h-7"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                    <path d="M19 7h-3c0-2.21-1.79-4-4-4S8 4.79 8 7H5c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-7-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm0 10c-1.66 0-3-1.34-3-3H7c0 2.76 2.24 5 5 5s5-2.24 5-5h-2c0 1.66-1.34 3-3 3z"/>
                  </svg>
                </button>
              </div>
            </div>

          </Link>
        ))}

      </div>
    </div>
  );
}