import React from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import logoImg from '../assets/Bmday_logo.png';

export default function CartNavbar() {
  // 1. STATE ENGAGEMENT FOR SYSTEM MONITORING
  const cart = useCartStore((state) => state.cart || []);
  
  // Dynamically aggregates your live checkout numbers for the header subtext
  const totalItemCount = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

  return (
    <nav className="flex items-center justify-between gap-5 py-[14px] px-5 bg-[#05445e] text-white sticky top-0 z-[1000] select-none shadow-md">
      
      {/* LEFT AREA: PURE BRAND LOGO RETURN PATH */}
      {/* Menu icon and Country Selector have been completely stripped from this zone */}
      <div className="flex items-center">
        <Link 
          to="/" 
          className="cursor-pointer transition-transform active:scale-98 block"
          aria-label="Return to homepage"
        >
          <img 
            src={logoImg} 
            alt="bmday Logo" 
            className="w-[60px] h-10 bg-transparent object-contain brightness-100 contrast-125 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.85)]" 
          />
        </Link>
      </div>

      {/* MIDDLE AREA: DISTRACTION-FREE VISUAL ZONE */}
      {/* The entire Search Container, input field, and dropdown boxes are removed to clear screen clutter */}
      <div className="hidden sm:flex flex-1 justify-center">
        <span className="text-xs font-black uppercase tracking-widest text-teal-200/50 flex items-center gap-1.5">
         
        </span>
      </div>

      {/* RIGHT AREA: SEGREGATED CHECKOUT STATUS AND TRUST METRICS */}
      <div className="flex items-center gap-[18px] ml-auto font-semibold text-sm">
        
        {/* Dynamic checkout total header summary description */}
        <div className="text-right hidden xs:block">
          <p className="text-[10px] text-teal-200 font-bold uppercase tracking-wider p-0 m-0">Your Progress</p>
          <p className="text-xs font-black text-white p-0 m-0">
            {totalItemCount === 0 ? "Empty Basket" : `Reviewing ${totalItemCount} ${totalItemCount === 1 ? 'Item' : 'Items'}`}
          </p>
        </div>

        {/* Minimalist Shopping Bag Identity Badge Indicator */}
        <div className="relative p-1 select-none text-[18px] opacity-90">
          🛒
          {totalItemCount > 0 && (
            <span className="absolute top-[-8px] right-[-10px] bg-[#e63946] text-white text-[11px] font-bold py-[2px] px-[6px] rounded-full min-w-[18px] text-center shadow-xs">
              {totalItemCount}
            </span>
          )}
        </div>

      </div>
    </nav>
  );
}
