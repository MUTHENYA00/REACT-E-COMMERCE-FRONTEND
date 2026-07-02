import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import { useCurrency } from '../../hooks/useCurrency';

// 1. STATE BINDING HOOK: Connects this detail view spoke directly to the store engine hub
import { useCartStore } from '../../store/useCartStore';

export default function ProductDetails() {
  const { id } = useParams(); 
  const { formatPrice } = useCurrency();

  // LIVE DATA PIPELINE STATE
  const [rawProduct, setRawProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // COMMERCE AND MOUSE-DRIFT STATE HOOKS
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState(new Set());
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // EXTRACTION LIFELINE: Extracts the global cart add action directly into local scope
  const addItem = useCartStore((state) => state.addItem);

  // FETCH SPECIFIC PRODUCT ON MOUNT / ID CHANGE
  useEffect(() => {
    setLoading(true);
    // Fetch directly from your backend data machine pipeline
    fetch(`http://localhost:5000/api/products/homepage`)
      .then((response) => {
        if (!response.ok) throw new Error("Product data unavailable");
        return response.json();
      })
      .then((data) => {
        const productsArray = Array.isArray(data) ? data : [];
        // Find the specific item matching the URL route parameter
        const found = productsArray.find((item) => String(item.id) === String(id));
        setRawProduct(found || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Pipeline failure fetching product details:", err);
        setRawProduct(null);
        setLoading(false);
      });
  }, [id]);

  const product = useMemo(() => {
    if (!rawProduct) return null;

    // Stable stock generator matched with your management system
    const stableStock = ((rawProduct.id * 7) % 12) + 1; 
    
    // Data normalization
    const safePrice = rawProduct.price ? parseFloat(String(rawProduct.price).replace(/[^0-9.]/g, '')) : 0;
    
    // Fixed: changed 'found' to 'rawProduct' to resolve ReferenceError and resolved variable definition
    const correctedImagePath = rawProduct.imageName 
      ? `http://localhost:5000${rawProduct.imageName.replace('/uploads/', '/Uploads/')}` 
      : null;

    return {
      ...rawProduct,
      title: rawProduct.name || rawProduct.title || "Unnamed Product",
      price: safePrice,
      stockCount: stableStock,
      imageUrl: correctedImagePath
    };
  }, [rawProduct]);

  // 3. UNIVERSAL AUTOMATED MENU LIST
  const automatedAddons = useMemo(() => {
    if (!product) return [];
    return [
      { id: 'care', label: `Premium Care Protection for ${product.title}`, price: Math.round(product.price * 0.12) },
      { id: 'companion', label: 'Official Store Companion Bundle', price: Math.round(product.price * 0.08) }
    ];
  }, [product]);

  // 4. ACTIVE LIVE SUB-TOTAL COUNTER MATH
  const totalCalculatedPrice = useMemo(() => {
    if (!product) return 0;
    let addonSum = 0;
    automatedAddons.forEach((addon) => {
      if (selectedAddons.has(addon.id)) addonSum += addon.price;
    });
    return (product.price + addonSum) * quantity;
  }, [product, automatedAddons, selectedAddons, quantity]);

  // 5. INTERACTIVE IMAGE MOUSE EVENT HANDLERS
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x: (x - 50) * -0.4, y: (y - 50) * -0.4 });
  };

  const handleCheckboxToggle = (addonId) => {
    setSelectedAddons((prev) => {
      const next = new Set(prev);
      if (next.has(addonId)) next.delete(addonId);
      else next.add(addonId);
      return next;
    });
  };

  // 6. TRUE STORE TRANSMISSION EVENT GATEWAY
  const handleAddToOrder = () => {
    if (!product) return;
    addItem(product.id, quantity);
    console.log(`Dispatched ${quantity} units of product ID ${product.id} to your basket.`);
  };

  if (loading) {
    return <div className="text-center py-24 text-gray-500">Syncing with data machine...</div>;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-5 py-24 text-center bg-gray-50">
        <h2 className="text-xl font-bold text-gray-800">Product Profile Not Found</h2>
        <Link to="/" className="text-teal-600 font-semibold hover:underline">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-5 py-12 select-none bg-gray-50">
      <div className="mb-6">
        <Link to="/" className="text-xs font-bold text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-1">
          ← Back to Shop Dashboard
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-10 items-start w-full">
        {/* LEFT COLUMN: INTERACTIVE DRIFT IMAGE FRAME */}
        <div className="w-full md:w-1/2 bg-white rounded-3xl border border-gray-200 shadow-xs p-8 flex items-center justify-center min-h-[350px] md:min-h-[480px] relative overflow-hidden">
          <div 
            className="w-full h-full cursor-zoom-in overflow-hidden relative flex items-center justify-center min-h-[300px] md:min-h-[400px]"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
              setIsHovered(false);
              setMousePos({ x: 0, y: 0 }); 
            }}
          >
            <img 
              src={product.imageUrl || undefined} 
              alt={product.title} 
              style={{
                transform: isHovered 
                  ? `scale(1.22) translate(${mousePos.x}px, ${mousePos.y}px)` 
                  : 'scale(1) translate(0px, 0px)',
                transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
              }}
              className="max-h-[380px] w-full object-contain origin-center pointer-events-none"
            />
          </div>
        </div>

        {/* RIGHT COLUMN: TITLES, SUB-OPTIONS AND TRANSACTION BOX */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight m-0">
              {product.title}
            </h1>
            <div className="flex items-center gap-1.5 pt-0.5">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, idx) => (
                  <svg key={idx} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-bold text-gray-700">4.9</span>
              <span className="text-xs text-gray-400">(142 verified orders)</span>
            </div>
          </div>

          <div className="border-t border-b border-gray-200 py-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Detailed Overview</h3>
            <p className="text-[14px] font-medium text-gray-700 leading-relaxed tracking-wide m-0">
              {product.description || "Detailed specifications overview not populated for this specific device inventory entry."}
            </p>
          </div>

          {/* INTEGRATED ADDON CHECKBOX MENU AREA */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Optional Enhancements</h4>
            {automatedAddons.map((addon) => (
              <label 
                key={addon.id}
                onClick={() => handleCheckboxToggle(addon.id)}
                className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-all cursor-pointer ${selectedAddons.has(addon.id) ? 'border-teal-600 bg-teal-50/30 shadow-xs' : 'border-gray-100 hover:border-gray-200 bg-gray-50/50'}`}
              >
                <div className="flex gap-2.5 items-center">
                  <input 
                    type="checkbox"
                    checked={selectedAddons.has(addon.id)}
                    onChange={() => {}} 
                    className="accent-teal-600 cursor-pointer w-3.5 h-3.5 shrink-0"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-800 tracking-tight leading-tight">{addon.label}</span>
                    <span className="text-[10px] text-gray-400 leading-normal pt-0.5">{addon.sub}</span>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-teal-700 shrink-0">
                  +{formatPrice(addon.price)}
                </span>
              </label>
            ))}
          </div>

          {/* TRANSACTION SUB-TOTAL AND STEP SELECTOR CONTAINER */}
          <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-xs space-y-4 mt-2">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Subtotal</span>
              <span className="text-xl font-black text-gray-900">
                {formatPrice(totalCalculatedPrice)}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-gray-100">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Availability</span>
              <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${product.stockCount <= 3 ? 'bg-rose-100 text-rose-600 animate-pulse' : 'bg-teal-100 text-teal-700'}`}>
                {product.stockCount <= 3 ? `Only ${product.stockCount} Left` : 'In Stock'}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Select Quantity</span>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50/50">
                <button 
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2.5 py-1 text-sm font-bold text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors cursor-pointer"
                >
                  -
                </button>
                <span className="px-3 text-xs font-extrabold text-gray-800 min-w-[24px] text-center">
                  {quantity}
                </span>
                <button 
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                  className="px-2.5 py-1 text-sm font-bold text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            <button 
              type="button"
              onClick={handleAddToOrder}
              className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-xs transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              Add Selected Units to Shopping Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}