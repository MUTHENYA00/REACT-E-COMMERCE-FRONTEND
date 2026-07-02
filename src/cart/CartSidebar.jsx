import React from 'react';

export default function CartSidebar() {
 
const isOpen = false; 


  // Temporary placeholders to build and refine the UI layout structure before data sync
  const mockCartItems = [
    { id: 1, title: "Premium Wireless Headphones", variant: "Matte Black", price: 12900, quantity: 1, imageUrl: "https://unsplash.com" },
    { id: 2, title: "Ergonomic Mechanical Keyboard", variant: "RGB / Blue Switches", price: 8500, quantity: 2, imageUrl: "https://unsplash.com" }
  ];

  // If the layout is flagged as closed, it returns an empty node to keep your screen unburdened
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      
   
      {/* Dims and blurs the underlying product grids to focus user attention */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-500 ease-out"
        onClick={() => console.log("Close sidebar trigger clicked")}
      />

   
      {/* Standardized fixed column anchored to the right side of the viewport browser */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between transform transition-transform duration-500 ease-out translate-x-0">
          
          {/* 1. HEADER CONTROL STRIP */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-tight m-0">
                Shopping Cart
              </h2>
              <span className="text-[11px] font-bold bg-[#05445e]/10 text-[#05445e] px-2 py-0.5 rounded-full">
                {mockCartItems.length} Items
              </span>
            </div>
            
            {/* Close Cross Trigger Button */}
            <button 
              onClick={() => console.log("Close sidebar trigger clicked")}
              className="p-2 -mr-2 rounded-xl hover:bg-gray-200/60 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer outline-hidden flex items-center justify-center"
            >
              <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/*  THE SCROLLABLE CONTENT AREA (MIDDLE ENGINE) */}
          {/* Houses layout list; configures independent vertical scrolling */}
          <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-none divide-y divide-gray-100">
            
            {mockCartItems.map((item) => (
              <div key={item.id} className="flex py-4 gap-4 first:pt-0 last:pb-0 group">
                
                {/* Product Thumbnail Slot */}
                <div className="w-20 h-20 bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center relative">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                </div>

                {/* Info and Quantity Adjustment Layouts */}
                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-bold text-gray-800 leading-snug line-clamp-1 m-0">
                      {item.title}
                    </h3>
                    <p className="text-[10px] font-medium text-gray-400 m-0">
                      {item.variant}
                    </p>
                  </div>

                  {/* Quantity Actions Stepper Line */}
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center border border-gray-200 bg-gray-50 rounded-lg p-0.5 shadow-2xs">
                      <button className="w-6 h-6 rounded-md text-gray-500 hover:text-gray-800 hover:bg-white transition-all flex items-center justify-center font-bold text-xs cursor-pointer active:scale-90">
                        −
                      </button>
                      <span className="w-7 text-center text-xs font-extrabold text-gray-800">
                        {item.quantity}
                      </span>
                      <button className="w-6 h-6 rounded-md text-gray-500 hover:text-gray-800 hover:bg-white transition-all flex items-center justify-center font-bold text-xs cursor-pointer active:scale-90">
                        +
                      </button>
                    </div>

                    {/* Inline Product Unit Calculations */}
                    <span className="text-xs font-extrabold text-gray-900">
                      Ksh {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>

              </div>
            ))}

          </div>

          {/* 3 THE ANCHORED TRANSACTIONAL FOOTER */}
       
          <div className="border-t border-gray-100 bg-gray-50/80 backdrop-blur-md p-6 space-y-4">
            
            {/* Price Calculations Output Line */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Estimated Subtotal
              </span>
              <span className="text-lg font-black text-gray-900 tracking-tight">
                Ksh 29,900
              </span>
            </div>

            <p className="text-[10px] text-gray-400 leading-normal m-0">
              Shipping calculations, regional retail taxes, and promotional coupons are finalized during secure order verification.
            </p>

            {/* Action Buttons Action Stack */}
            <div className="space-y-2.5 pt-1">
              <button 
                onClick={() => console.log("Route to checkout page fired")}
                className="w-full h-11 rounded-xl bg-[#05445e] hover:bg-[#043449] text-white text-xs font-bold shadow-sm hover:shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center tracking-wide"
              >
                Proceed to Checkout
              </button>
              
              <button 
                onClick={() => console.log("Dismiss panel layout")}
                className="w-full h-11 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-bold transition-all active:scale-98 cursor-pointer flex items-center justify-center"
              >
                Continue Shopping
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
