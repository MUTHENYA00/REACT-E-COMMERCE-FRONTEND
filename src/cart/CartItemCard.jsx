import React from 'react';

export default function CartItemCard({ item, onIncrement, onDecrement, onRemove }) {
  
  const itemRowSubtotal = (item.price || 0) * (item.quantity || 1);

  return (
    <div className="flex py-4 gap-4 items-center justify-between group bg-white border-b border-gray-100 last:border-b-0 animate-fade-in select-none">
      
      {/* 1. THE MEDIA CONTENT BLOCK (LEFT BLOCK) */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center relative">
        <img 
          src={item.imageUrl} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* 2. TEXT DESCRIPTION PANEL (MIDDLE PANEL) */}
      <div className="flex-1 min-w-0 px-1 flex flex-col gap-1">
        <h3 className="text-xs font-bold text-gray-800 tracking-tight leading-snug line-clamp-1 m-0">
          {item.title}
        </h3>
        {item.description && (
          <p className="text-[10px] font-normal text-gray-400 leading-normal line-clamp-1 m-0">
            {item.description}
          </p>
        )}
        
        {/* Unit Price Subtext Indicator */}
        <span className="text-[10px] font-extrabold text-teal-600 tracking-wide">
          Ksh {item.price?.toLocaleString()} each
        </span>
      </div>

      {/* 3. INTERACTIVE STEPPER CONTROL BOX (QUANTITY ROW) */}
      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 shrink-0">
        
        <div className="flex items-center border border-gray-200 bg-gray-50/70 rounded-xl p-0.5 shadow-2xs">
          {/* Decrement Button */}
          <button 
            onClick={() => onDecrement(item.id)}
            className="w-7 h-7 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-white transition-all flex items-center justify-center font-bold text-xs cursor-pointer active:scale-90 select-none outline-hidden"
            aria-label="Decrease quantity"
          >
            −
          </button>
          
          {/* Active Quantity Indicator Display */}
          <span className="w-6 text-center text-xs font-black text-gray-800">
            {item.quantity}
          </span>
          
          {/* Increment Button */}
          <button 
            onClick={() => onIncrement(item.id)}
            className="w-7 h-7 rounded-lg text-gray-500 hover:text-teal-600 hover:bg-white transition-all flex items-center justify-center font-bold text-xs cursor-pointer active:scale-90 select-none outline-hidden"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        {/* 4. LINE TOTAL PRICING & EVICTION COLUMN (RIGHT PANEL) */}
        <div className="flex items-center gap-2.5 min-w-[90px] justify-end">
          <span className="text-xs font-black text-gray-900 tracking-tight">
            Ksh {itemRowSubtotal.toLocaleString()}
          </span>
          
          {/* Quick Eviction / Trash Trigger Button */}
          <button 
            onClick={() => onRemove(item.id)}
            className="p-1.5 rounded-lg text-gray-300 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer outline-hidden flex items-center justify-center"
            aria-label="Remove item from cart"
          >
            <svg 
              xmlns="http://w3.org" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth="2" 
              stroke="currentColor" 
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.34 9m-4.72 0l-.34-9m9.49-3h-14a1 1 0 000 2h14a1 1 0 000-2zM4.118 4L4 4.059V13a1 1 0 001 1h6a1 1 0 001-1V4.059L11.882 4H4.118zM4.25 4h11.5M16.5 4a1.5 1.5 0 00-1-1h-7a1.5 1.5 0 00-1 1" />
            </svg>
          </button>
        </div>

      </div>

    </div>
  );
}
