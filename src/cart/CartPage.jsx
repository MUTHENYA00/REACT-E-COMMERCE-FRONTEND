import React, { useMemo, useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';

import CartItemCard from '../cart/CartItemCard';
import CartNavbar from '../cart/CartNavbar';
import Footer from '../components/layouts/footer';
// 1. INJECT THE SYSTEM PRICING HOOK
import { CurrencyContext } from '../contexts/CurrencyContextInstance';

// PREMIUM ROW DESIGNS: Glass effect borders, hover transformations, and crisp typography
function CartItemRow({ item, updateQuantity, removeItem }) {
  // Extract currency context formatter locally
  const { formatPrice } = useContext(CurrencyContext);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 first:pt-0 last:pb-0 select-none group transition-all duration-300">
      
      {/* Visual Image Media Slot */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-18 h-18 sm:w-22 sm:h-22 bg-gray-50 rounded-2xl border border-gray-100/80 overflow-hidden shrink-0 shadow-2xs relative group-hover:shadow-md transition-all duration-300">
          <img 
            src={item.imageUrl || undefined} 
            alt={item.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-black/2 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        
        {/* Description typography block */}
        <div className="flex-1 min-w-0 space-y-1">
          <h3 className="text-sm font-black text-gray-800 tracking-tight leading-snug truncate m-0 group-hover:text-[#05445e] transition-colors">
            {item.title}
          </h3>
          <p className="text-[11px] font-medium text-gray-400 line-clamp-1 leading-normal m-0">
            {item.description}
          </p>
          <span className="inline-flex items-center text-[10px] font-extrabold text-teal-600/90 tracking-wider uppercase bg-teal-50 px-2 py-0.5 rounded-md mt-1">
            {/* DYNAMIC PRICE TAG CONVERSION */}
            {formatPrice(item.price)} each
          </span>
        </div>
      </div>

      {/* Interactive Controls Column */}
      <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0 pt-2 sm:pt-0 border-t border-gray-50 sm:border-0">
        
        {/* Sleek Stepper Container */}
        <div className="flex items-center border border-gray-200/80 bg-linear-to-b from-gray-50/50 to-gray-50 rounded-xl p-1 shadow-3xs hover:border-gray-300 transition-colors">
          <button 
            onClick={() => updateQuantity(item.id, item.quantity - 1)} 
            className="w-7 h-7 rounded-lg font-black text-xs text-gray-400 hover:text-rose-500 hover:bg-white hover:shadow-2xs transition-all cursor-pointer flex items-center justify-center active:scale-90"
          >
            −
          </button>
          <span className="w-7 text-center text-xs font-black text-gray-800 tracking-tight">
            {item.quantity}
          </span>
          <button 
            onClick={() => updateQuantity(item.id, item.quantity + 1)} 
            className="w-7 h-7 rounded-lg font-black text-xs text-gray-400 hover:text-teal-600 hover:bg-white hover:shadow-2xs transition-all cursor-pointer flex items-center justify-center active:scale-90"
          >
            +
          </button>
        </div>

        {/* Dynamic Price Calculations Tally Column */}
        <div className="flex items-center gap-3.5 min-w-[110px] justify-end">
          <span className="text-sm font-black text-gray-900 tracking-tight">
            {/* DYNAMIC LINE SUBTOTAL CONVERSION */}
            {formatPrice(item.price * item.quantity)}
          </span>
          
          {/* Micro-Eviction Button */}
          <button 
            onClick={() => removeItem(item.id)} 
            className="text-gray-300 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-xl transition-all cursor-pointer active:scale-90 flex items-center justify-center"
            aria-label="Remove item"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}

// LUXURY PROGRESS BAR INDICATOR CARD
function DeliveryStatus({ subtotal, progressPercent, isUnlocked, neededForFreeShipping }) {
  const { formatPrice } = useContext(CurrencyContext);

  return (
    <div className="bg-linear-to-b from-white to-gray-50/40 border border-gray-200/80 rounded-3xl p-5 shadow-2xs select-none space-y-3.5">
      <div className="flex items-start gap-3">
        <span className="text-lg bg-teal-50 p-2 rounded-xl shadow-3xs border border-teal-100 flex items-center justify-center">
          {isUnlocked ? "" : ""}
        </span>
        <div className="space-y-0.5">
          <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider m-0">
            {isUnlocked ? "Free Express Shipping Unlocked" : "Unlock Free Delivery Bonus"}
          </h4>
          <p className="text-[11px] font-medium text-gray-400 leading-normal m-0">
            {isUnlocked 
              ? "Your premium order qualifies for complimentary priority express cargo shipping service." 
              : `Add items worth ${formatPrice(neededForFreeShipping)} more to save on local freight logistics fees.`}
          </p>
        </div>
      </div>

      {/* Fluid Dynamic Progress Track Component Layout */}
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200/30 relative">
        <div 
          style={{ width: `${progressPercent}%` }}
          className={`h-full rounded-full transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) ${isUnlocked ? 'bg-linear-to-r from-teal-500 to-emerald-400 shadow-[0_0_10px_rgba(20,184,166,0.3)]' : 'bg-linear-to-r from-[#05445e] to-teal-500'}`}
        />
      </div>
    </div>
  );
}

// SLICK GLASS INVOICE INVENTORY MODULE WIDGET CARD
function OrderSummary({ subtotal, discountAmount, grandTotal, activeCouponCode, handleApplyCoupon, promoInput, setPromoInput, couponError }) {
  const { formatPrice } = useContext(CurrencyContext);

  return (
    <div className="bg-linear-to-b from-white to-gray-50/50 rounded-3xl border border-gray-200/80 p-6 shadow-2xs hover:shadow-xs transition-shadow duration-300 space-y-6 select-none relative overflow-hidden">
      
      {/* Decorative Branding Mesh */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-teal-500/5 to-[#05445e]/0 rounded-bl-full pointer-events-none" />

      <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest pb-2.5 border-b border-gray-100 m-0 flex items-center gap-1.5">
         Order Summary
      </h2>

      {/* Transaction Figures Display Layers Column */}
      <div className="space-y-3.5 pt-1">
        <div className="flex justify-between items-center text-xs font-bold text-gray-400 tracking-wide">
          <span>Subtotal</span>
          <span className="text-gray-800 font-extrabold text-sm">{formatPrice(subtotal)}</span>
        </div>
        
        {discountAmount > 0 && (
          <div className="flex justify-between items-center text-xs font-black text-rose-500 bg-rose-50/50 px-3 py-2 rounded-xl border border-rose-100/50">
            <span className="flex items-center gap-1"> Code: {activeCouponCode}</span>
            <span>-{formatPrice(discountAmount)}</span>
          </div>
        )}
        
        <div className="flex justify-between items-center text-xs font-bold text-gray-400 tracking-wide">
          <span>Shipping Fee</span>
          <span className="text-teal-600 font-black uppercase text-[10px] tracking-widest bg-teal-50 border border-teal-100/50 px-2 py-0.5 rounded-md shadow-3xs">
            Free
          </span>
        </div>
      </div>

      {/* DYNAMIC LIVE VOUCHER CODE FORM ENTRY INTERFACE BLOCK */}
      <form onSubmit={handleApplyCoupon} className="border-t border-b border-gray-100/80 py-4 space-y-2">
        <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">Have a promo coupon?</span>
        <div className="flex gap-2">
          <input 
            type="text"
            placeholder="e.g. BMDAY10"
            value={promoInput}
            onChange={(e) => setPromoInput(e.target.value)}
            className="flex-1 min-w-0 px-3.5 h-9 bg-gray-50/50 rounded-xl border border-gray-200 outline-hidden text-xs text-gray-800 font-bold focus:bg-white focus:border-teal-500 transition-colors uppercase placeholder-gray-400"
          />
          <button 
            type="submit"
            className="h-9 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer active:scale-95 flex items-center justify-center shrink-0"
          >
            Apply
          </button>
        </div>
        {couponError && <p className="text-[10px] font-bold text-rose-500 m-0 pt-0.5 leading-normal">⚠️ {couponError}</p>}
        {discountAmount > 0 && <p className="text-[10px] font-bold text-teal-600 m-0 pt-0.5 leading-normal">✓ 10% voucher code successfully applied!</p>}
      </form>

      {/* Grand Net Tabulated Totals Section */}
      <div className="flex justify-between items-center pt-2">
        <span className="text-xs font-black text-gray-800 uppercase tracking-widest">Grand Total</span>
        <div className="text-right">
          <span className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-none block">
            {formatPrice(grandTotal)}
          </span>
          <span className="text-[9px] font-medium text-gray-400 block mt-1">VAT & Customs Included</span>
        </div>
      </div>

      {/* ACTION TRANSACTIONAL BUTTON INTERFACES STRIP */}
      <div className="space-y-3 pt-2">
        <button 
          type="button"
          onClick={() => console.log("Directing transactional vectors to processor endpoint")}
          className="w-full h-12 rounded-xl bg-linear-to-r from-[#05445e] to-[#043d54] hover:from-[#043449] hover:to-[#032a3b] text-white text-xs font-black uppercase tracking-widest shadow-md shadow-sky-950/10 hover:shadow-lg hover:shadow-sky-950/15 transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 outline-hidden focus:ring-2 focus:ring-[#05445e]/20"
        >
          Complete Secure Checkout
        </button>

        <Link 
          to="/" 
          className="text-[11px] font-black text-[#05445e] hover:text-[#043449] transition-all flex items-center justify-center gap-1.5 hover:underline group cursor-pointer"
        >
          <span className="transition-transform group-hover:-translate-x-0.5">←</span> Continue Shopping Catalog
        </Link>
      </div>

    </div>
  );
}

// MAIN CORE LAYOUT ORCHESTRATOR VIEW
export default function CartPage() {
  // GLOBAL STATE SUBSCRIPTIONS
  let cart = useCartStore((state) => state.cart || []); 
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  // INTERACTIVE PROMO STATES
  const [promoInput, setPromoInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [activeCouponCode, setActiveCouponCode] = useState('');

  // LIVE INVENTORY BACKEND DATA ENGINE STATE
  const [products, setProducts] = useState([]);

  // FETCH LIVE INVENTORY ON MOUNT
  useEffect(() => {
    fetch('http://localhost:5000/api/products/homepage')
      .then((res) => {
        if (!res.ok) throw new Error("Inventory transmission failure");
        return res.json();
      })
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Pipeline failure syncing cart inventory:", err));
  }, []);

  // STABLE DATA RECONSTRUCTION PIPELINE
  const detailedCartItems = useMemo(() => {
    const rawProducts = Array.isArray(products) ? products : [];
    
    return cart.map((cartItem) => {
      const product = rawProducts.find((p) => String(p.id) === String(cartItem.id));
      const cleanDigits = product?.price ? String(product.price).replace(/[^0-9.]/g, '') : '0';
      const basePrice = parseFloat(cleanDigits) || 0;
      
      const finalPath = product?.imageName 
        ? `http://localhost:5000${product.imageName.replace('/uploads/', '/Uploads/')}` 
        : null;

      return {
        id: cartItem.id,
        quantity: cartItem.quantity,
        title: product?.name || product?.title || "Unnamed Product",
        description: product?.description || "Product item selected.",
        price: basePrice,
        imageUrl: finalPath
      };
    });
  }, [cart, products]);

  // COMPLETE MULTI-CURRENCY Tabulation Engine Math
  const totals = useMemo(() => {
    const subtotal = detailedCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingThreshold = 15000;
    const isUnlocked = subtotal >= shippingThreshold;
    
    const discountAmount = Math.round(subtotal * appliedDiscount);
    const grandTotal = Math.max(0, subtotal - discountAmount);
    
    const progressPercent = Math.min(100, (subtotal / shippingThreshold) * 100);
    const neededForFreeShipping = Math.max(0, shippingThreshold - subtotal);

    return { subtotal, discountAmount, grandTotal, progressPercent, isUnlocked, neededForFreeShipping };
  }, [detailedCartItems, appliedDiscount]);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    if (promoInput.toUpperCase() === 'BMDAY10') {
      setAppliedDiscount(0.10);
      setActiveCouponCode('BMDAY10');
      setPromoInput('');
    } else {
      setCouponError('Invalid coupon code identifier.');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="bg-gradient-to-b from-gray-50/50 via-gray-50 to-gray-100/40 min-h-screen flex flex-col justify-between">
        {/* Distraction-free Checkout Header */}
        <CartNavbar />
        
        {/* Elegant Empty State Card Container */}
        <div className="max-w-3xl mx-auto px-6 py-20 text-center select-none bg-white border border-gray-200/60 mt-16 rounded-3xl shadow-xs flex flex-col justify-center items-center gap-2 max-h-[450px]">
          <div className="w-16 h-16 bg-gray-50 rounded-full border border-gray-100 flex items-center justify-center mx-auto mb-3 text-lg shadow-2xs">
            🛒
          </div>
          <h2 className="text-lg font-black text-gray-800 tracking-tight mb-1 uppercase">Your Cart is Empty</h2>
          <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed mb-6">
            Looks like you haven't added any products to your selection yet. Go back to our dashboard to browse our latest releases.
          </p>
          <Link 
            to="/" 
            className="inline-flex h-11 items-center justify-center px-6 rounded-xl bg-[#05445e] hover:bg-[#043449] text-white text-xs font-black uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-xs"
          >
            Return to Shop Dashboard
          </Link>
        </div>

        {/* Persistent Page Base Layout */}
        <Footer />
      </div>
    );
  }
  return (
    <div className="bg-linear-to-b from-gray-50/50 via-gray-50 to-gray-100/40 min-h-screen">
      <CartNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 select-none">
        
        {/* Title Heading Area */}
        <div className="mb-8 space-y-1">
          <h1 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tight m-0">
            Review Your Order
          </h1>
          <p className="text-xs font-medium text-gray-400 m-0">
            Please inspect your items, applied vouchers, and shipping thresholds carefully before executing checkout functions.
          </p>
        </div>

        <main className="flex flex-col lg:flex-row gap-8 items-start w-full">
          
          {/* LEFT CONTENT STREAM GRID */}
          <div className="w-full lg:w-2/3 flex flex-col gap-5">
            <section className="bg-white rounded-3xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest pb-3.5 border-b border-gray-100 mb-5 m-0 flex items-center gap-1.5">
                <span>🛒</span> Shopping Cart Basket
              </h2>
              
              <div id="cart-items-container" className="divide-y divide-gray-100/70">
                {detailedCartItems.map((item) => (
                  <CartItemRow 
                    key={item.id} 
                    item={item} 
                    updateQuantity={updateQuantity}
                    removeItem={removeItem}
                  />
                ))}
              </div>
            </section>

            <DeliveryStatus 
              subtotal={totals.subtotal} 
              progressPercent={totals.progressPercent}
              isUnlocked={totals.isUnlocked}
              neededForFreeShipping={totals.neededForFreeShipping}
            />
          </div>

          {/* RIGHT FIXED FRAME ASIDE: Floating Invoice Summary Box */}
          <aside className="w-full lg:w-1/3 lg:sticky lg:top-24">
            <OrderSummary 
              subtotal={totals.subtotal} 
              discountAmount={totals.discountAmount} 
              grandTotal={totals.grandTotal} 
              activeCouponCode={activeCouponCode}
              handleApplyCoupon={handleApplyCoupon}
              promoInput={promoInput}
              setPromoInput={setPromoInput}
              couponError={couponError}
            />
          </aside>

        </main>
      </div>

      {/* GLOBAL SHOP ACCESSIBILITY FOOTER */}
      <Footer />

    </div>
  );
}