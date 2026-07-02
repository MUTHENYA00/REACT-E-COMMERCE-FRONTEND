import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';

export function SearchProdDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // --- COMPONENT STATES ---
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // UI Interactive States
  const [zoomStyle, setZoomStyle] = useState({ transformOrigin: 'center center', transform: 'scale(1)' });
  const containerRef = useRef(null);

  // Extract the original active search query parameter from the location history stack
  const queryParams = new URLSearchParams(location.search);
  const activeSearchQuery = location.state?.searchQuery || '';

  // ==========================================
  // DYNAMIC TEXT KEYWORD HIGHLIGHTER ENGINE
  // Scans un-truncated blocks and safely highlights active queries
  // ==========================================
  const highlightSearchKeyword = (text, keyword) => {
    if (!keyword.trim()) return text;
    
    // Escapes special regex flags safely to avoid execution console crashes
    const escapedKeyword = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(${escapedKeyword})`, 'gi');
    
    const parts = text.split(regex);
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-amber-100 text-amber-950 px-0.5 rounded font-medium">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };
  useEffect(() => {
    window.scrollTo(0, 0); // Always snap layout viewport back up to the absolute top horizon

    // 1. MEMORY-FIRST HYDRATION CHECK
    // If the card payload was passed safely through the router carriage state, load it in 0ms
    if (location.state?.product) {
      const activeProduct = location.state.product;
      setProduct(activeProduct);
      setIsLoading(false);
      
      // Execute local memory array filter pipeline for recommendations
      fetchLiveRecommendations(activeProduct.category, activeProduct.id);
    } else {
      // 2. FAIL-SAFE FALLBACK PIPELINE
      // Triggers ONLY if a user manually reloads/refreshes the browser tab or shares a deep link directly
      fetchSingleItemFromServer(id);
    }
  }, [id, location.state]);

  // ==========================================
  // FAIL-SAFE SINGLE ITEM FETCH PIPE
  // ==========================================
  const fetchSingleItemFromServer = async (productId) => {
    try {
      setIsLoading(true);
      
      // Connects directly to your live Node.js catalog API distribution endpoint
      const targetUrl = `http://localhost:5000/api/products/${productId}`;
      const response = await fetch(targetUrl);
      
      if (!response.ok) throw new Error(`Fallback item network fetch failure: ${response.status}`);
      
      const targetItemData = await response.json();

      setProduct(targetItemData);
      fetchLiveRecommendations(targetItemData.category, targetItemData.id);
    } catch (error) {
      console.error("Fail-safed single product lookup crashed:", error);
    } finally {
      setIsLoading(false);
    }
  };
  // ==========================================
  // RECOMMENDER DISCOVERY PIPELINE
  // Pulls related catalog objects matching the family family tag
  // ==========================================
  const fetchLiveRecommendations = async (categoryName, currentId) => {
    try {
      // Pulls dynamic database family rows using clean URL query parameters
      const targetUrl = `http://localhost:5000/api/products/recommendations?category=${encodeURIComponent(categoryName)}&exclude=${currentId}`;
      const response = await fetch(targetUrl);
      
      if (!response.ok) throw new Error(`Recommendations request pipeline failure: ${response.status}`);
      
      const targetedDiscoveryArray = await response.json();
      setRecommendations(targetedDiscoveryArray);
    } catch (error) {
      console.error("Fail-safed discovery recommendation map feed crashed:", error);
      setRecommendations([]);
    }
  };

  // ==========================================
  // ELASTIC BOUNDED MAGNIFYING LENS TRACKER
  // Calculates real-time coordinates for dynamic cursor panning pan-on-hover
  // ==========================================
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(1.08)' // Refined subtle micro-scale expansion zoom
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ transformOrigin: 'center center', transform: 'scale(1)' });
  };

  // --- SKELETON LOADING FRAME WORK SHIMMER ---
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse flex flex-col md:flex-row gap-12">
        <div className="w-full md:w-1/2 aspect-[3/4] bg-neutral-100 rounded-2xl"></div>
        <div className="w-full md:w-1/2 space-y-6 pt-6">
          <div className="h-4 bg-neutral-100 rounded w-1/4"></div>
          <div className="h-8 bg-neutral-100 rounded w-3/4"></div>
          <div className="space-y-3 pt-4">
            <div className="h-4 bg-neutral-100 rounded w-full"></div>
            <div className="h-4 bg-neutral-100 rounded w-full"></div>
            <div className="h-4 bg-neutral-100 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }
if (!product) return null;

  return (
    <main className="w-full min-h-screen bg-white py-6">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* BACK TO RESULTS BREADCRUMB ANCHOR (Preserves History Stack Context) */}
        <button
          onClick={() => navigate(-1)} // Pops location history frame to snap scroll coordinate states back to origin
          className="inline-flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-neutral-950 tracking-widest transition-colors uppercase mb-8"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to search results
        </button>

        {/* PRIMARY DETAILS FIELD LAYOUT PANEL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          
          {/* MEDIA BOX LAYER: DYNAMIC RAW ASPECT DISPLAY */}
          <div 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="w-full overflow-hidden rounded-2xl bg-neutral-50 border border-neutral-100 cursor-zoom-in relative group"
            style={{ contentVisibility: 'auto' }}
          >
            <img
              src={product.imageName ? `http://localhost:5000${product.imageName}` : product.image}
              alt="Raw presentation display framework object"
              style={zoomStyle}
              className="w-full h-auto max-h-[70vh] object-contain transition-transform duration-200 ease-out"
            />
          </div>

          {/* TYPOGRAPHY LAYER: UNLOCKED DESCRIPTION METADATA STACK */}
          <div className="flex flex-col space-y-6 pt-2">
            <div>
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest block mb-1">
                {product.category}
              </span>
              <div className="flex items-center text-sm font-bold text-amber-500 gap-1 mt-1">
                <span>{product.rating || '0.0'}</span>
                <span>★</span>
                <span className="text-neutral-300 font-normal ml-1">| Verified Track Asset</span>
              </div>
            </div>

            {/* Complete Multi-paragraph Description Box without any Truncations */}
            <div className="text-neutral-800 text-base md:text-lg font-normal leading-relaxed tracking-normal space-y-4">
              <p>{highlightSearchKeyword(product.description || '', activeSearchQuery)}</p>
            </div>

            {/* SUBMIT BUTTONLESS CORE INTERACTION STRIP */}
            <div className="border-t border-neutral-100 pt-6 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-bold tracking-wider text-neutral-400 uppercase">Valuation Price</span>
                <span className="text-3xl font-extrabold text-neutral-950">KES {product.price}</span>
              </div>

              {/* Hyper-clickable Checkout Target Box Text Link */}
              <button
                type="button"
                onClick={() => {
                  // Connect global action dispatches or context appends here
                  console.log(`Dispatched item object: ${product.id} to transaction arrays.`);
                }}
                className="text-sm font-black text-neutral-950 hover:text-neutral-600 underline underline-offset-8 tracking-widest transition-colors duration-150 uppercase"
              >
                Add to your collection
              </button>
            </div>

          </div>
        </div>
        {/* ========================================================
         * 3. SYNCHRONIZED RECOMMENDATION CAROUSEL SUBSECTION
         * ======================================================== */}
        {recommendations.length > 0 && (
          <section className="mt-24 pt-12 border-t border-neutral-100 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-neutral-950 tracking-tight">
                Recommended Collections
              </h3>
              <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mt-0.5">
                Similar inside {product.category}
              </p>
            </div>

            {/* Horizontal Carriage Frame Layer with Native Invisible Swipe Tracks */}
            <div className="w-full overflow-x-auto flex gap-6 pb-4 scrollbar-none snap-x snap-mandatory">
              {recommendations.map((item) => (
                <Link
                  to={`/search/product/${item.id}`}
                  state={{ product: item, searchQuery: activeSearchQuery }} // Re-inject states safely for cascading micro loops
                  key={item.id}
                  className="group flex-shrink-0 w-64 snap-start flex flex-col bg-white"
                >
                  {/* Reused Fixed Aspect Square Frame Box */}
                  <div className="w-full aspect-square overflow-hidden bg-neutral-50 rounded-xl border border-neutral-100">
                    <img
                      src={item.imageName ? `http://localhost:5000${item.imageName}` : item.image}
                      alt="Recommended item image layer"
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>

                  {/* Reused Grid Metadata Vertical Stack Text Rules */}
                  <div className="flex flex-col pt-3 space-y-1">
                    <p className="text-neutral-700 text-sm font-medium line-clamp-2 leading-snug transition-colors group-hover:text-neutral-950">
                      {item.description}
                    </p>
                    <div className="flex items-center text-xs font-semibold text-amber-500 gap-1">
                      <span>{item.rating || '0.0'}</span>
                      <span>★</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 font-bold text-neutral-950">
                      <span className="text-base font-extrabold">KES {item.price}</span>
                      
                      {/* Interactive Buttonless Action Hook */}
                      <span
                        onClick={(e) => {
                          e.preventDefault(); // Intercepts page traversal clicks 
                          console.log(`Dispatched recommended asset ${item.id} to cart.`);
                        }}
                        className="text-[10px] font-black tracking-widest text-neutral-400 hover:text-neutral-950 underline underline-offset-4 transition-colors"
                      >
                        ADD TO CART
                      </span>
                    </div>
                  </div>

                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}