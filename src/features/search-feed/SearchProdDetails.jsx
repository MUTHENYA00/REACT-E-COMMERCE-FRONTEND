import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { RecommendationsCarousel } from './RecommendationsCarousel'; // Adjust path if needed
import { useCartStore } from '../../store/useCartStore';

export function SearchProdDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // --- CORE DATA MACHINE STATES ---
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- NEW UI LAYOUT STATES ---
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState(new Set());

  // --- CONFIGURABLE AUTOMATED ADDONS ---
  const automatedAddons = [
    { id: 'warranty', label: 'Extended Trade Warranty', sub: '12 Months full equipment coverage replacement guarantee', price: 3500 },
    { id: 'insurance', label: 'Transit Loss Insurance', sub: 'Protects logistics pathways against localized courier incidents', price: 1500 }
  ];

  // --- HOOK DATA PIPELINE SYNCRONIZER ---
  useEffect(() => {
    window.scrollTo(0, 0); 
    if (location.state?.product) {
      const activeProduct = location.state.product;
      setProduct(activeProduct);
      setIsLoading(false);
      fetchLiveRecommendations(activeProduct.category, activeProduct.id || activeProduct._id);
    } else {
      fetchSingleItemFromServer(id);
    }
  }, [id, location.state]);
// the cart
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToOrder = () => {
  if (!product) return;
  const activeId = product.id || product._id;
  addItem(activeId, quantity);
  console.log(`[Zustand Success] Dispatched ${quantity} units of product ID ${activeId} directly to global transaction states.`);
};


  const fetchSingleItemFromServer = async (productId) => {
    try {
      setIsLoading(true);
      const targetUrl = `http://localhost:5000/api/products/${productId}`;
      const response = await fetch(targetUrl);
      if (!response.ok) throw new Error(`Network engine fetch failure: ${response.status}`);
      const targetItemData = await response.json();
      setProduct(targetItemData);
      fetchLiveRecommendations(targetItemData.category, targetItemData.id || targetItemData._id);
    } catch (error) {
      console.error("Single product lookup crashed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLiveRecommendations = async (categoryName, currentId) => {
    try {
      const targetUrl = `http://localhost:5000/api/products/recommendations?category=${encodeURIComponent(categoryName)}&exclude=${currentId}`;
      const response = await fetch(targetUrl);
      if (!response.ok) throw new Error(`Recommendations request pipeline failure: ${response.status}`);
      const targetedDiscoveryArray = await response.json();
      setRecommendations(targetedDiscoveryArray);
    } catch (error) {
      console.error("Discovery recommendation map feed crashed:", error);
      setRecommendations([]);
    }
  };

  // --- INTERACTIVE DRIFT IMAGE FRAME LOGIC ---
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    
    // Calculates displacement vector relative to frame center coordinates
    const moveX = (width / 2 - x) * 0.4;
    const moveY = (height / 2 - y) * 0.4;
    
    setMousePos({ x: moveX, y: moveY });
  };

  // --- INTERACTION MUTATION HANDLERS ---
  const handleCheckboxToggle = (addonId) => {
    const nextSet = new Set(selectedAddons);
    if (nextSet.has(addonId)) {
      nextSet.delete(addonId);
    } else {
      nextSet.add(addonId);
    }
    setSelectedAddons(nextSet);
  };

  // --- DATA FORMATTING MACHINES ---
  const formatPrice = (val) => {
    return `KES ${Number(val || 0).toLocaleString()}`;
  };

  // Compute operational costs based on active selections
  const baseProductPrice = Number(product?.price || 0);
  const addonsTotalCost = automatedAddons
    .filter(addon => selectedAddons.has(addon.id))
    .reduce((sum, item) => sum + item.price, 0);
  const totalCalculatedPrice = (baseProductPrice * quantity) + addonsTotalCost;

  // --- SHIMMER SHIELD RENDER PROTECTIONS ---
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-5 py-12 animate-pulse flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-1/2 aspect-[4/3] bg-neutral-200 rounded-3xl min-h-[350px] md:min-h-[480px]"></div>
        <div className="w-full md:w-1/2 space-y-6 pt-4">
          <div className="h-8 bg-neutral-200 rounded w-3/4"></div>
          <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
          <div className="h-24 bg-neutral-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="p-12 text-center text-red-500 font-bold">Catalog inventory ledger unreachable.</div>;
  }

  const resolutionImageSrc = product.imageName 
    ? `http://localhost:5000${product.imageName}` 
    : (product.imageUrl || product.image);
  return (
    <div className="max-w-7xl mx-auto px-5 py-12 select-none bg-gray-50">
      <div className="mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="text-xs font-bold text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-1 cursor-pointer bg-transparent border-none p-0"
        >
          Back to Shop Dashboard
        </button>
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
              src={resolutionImageSrc} 
              alt={product.title || product.name} 
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
              {product.title || product.name}
            </h1>
            <div className="flex items-center gap-1.5 pt-0.5">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, idx) => (
                  <svg key={idx} xmlns="http://w3.org" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-bold text-gray-700">{product.rating || '4.9'}</span>
              <span className="text-xs text-gray-400">(Asset Cluster Layer)</span>
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
              <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${(!product.stockCount || product.stockCount <= 3) ? 'bg-rose-100 text-rose-600 animate-pulse' : 'bg-teal-100 text-teal-700'}`}>
                {(!product.stockCount || product.stockCount <= 3) ? `Limited Units Left` : 'In Stock'}
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
                  onClick={() => setQuantity(quantity + 1)}
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
              Add to Shopping Cart
            </button>
          </div>
        </div>
      </div>
      
     
       <RecommendationsCarousel 
        recommendations={recommendations} 
        formatPrice={formatPrice} 
      />
          </div>
       

  );
}
