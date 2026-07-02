import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

export function SearchGrid() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState([]); 
  
  const [page, setPage] = useState(1); 
  const [isLoading, setIsLoading] = useState(true); 
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // --- REFS FOR SAFETY OVERRIDES ---
  const observerRef = useRef(null); 
  const isInitialMount = useRef(true);
 

  const fetchProductChunks = async (searchQuery, pageIndex, isNewSearch = false) => {
    if (!searchQuery) {
      setProducts([]);
      setCategories({});
      setIsLoading(false);
      return;
    }
try {
      if (isNewSearch) {
        setIsLoading(true);
      } else {
        setIsFetchingMore(true);
      }

      const targetUrl = `http://localhost:5000/api/search/query?q=${encodeURIComponent(searchQuery)}&page=${pageIndex}`;
      const response = await fetch(targetUrl);
      
      if (!response.ok) throw new Error(`Query pipeline fetch failure: ${response.status}`);
      
      const data = await response.json();
      const incomingProducts = data.products || [];
      const serverHasMoreData = data.hasMore !== undefined ? data.hasMore : false;

     setProducts((prev) =>
  isNewSearch
    ? incomingProducts
    : [...prev, ...incomingProducts]
);

      setHasMore(serverHasMoreData);

    } catch (error) {
      console.error("Critical failure handling search loop stream chunk:", error);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };
  useEffect(() => {
    setPage(1);
    fetchProductChunks(query, 1, true);
  }, [query]);


  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (page > 1) {
      fetchProductChunks(query, page, false);
    }
  }, [page]);

  useEffect(() => {
    if (isLoading || !hasMore || isFetchingMore) return;

    const sensorElement = observerRef.current;
    if (!sensorElement) return;

    const nativeObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 0.1 }
    );

    nativeObserver.observe(sensorElement);

    return () => {
      if (sensorElement) nativeObserver.unobserve(sensorElement);
    };
  }, [isLoading, hasMore, isFetchingMore]);

  const renderGhostSkeletons = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full animate-pulse px-4 max-w-7xl mx-auto">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={`shimmer-${idx}`} className="flex flex-col space-y-3 bg-white p-3 rounded-xl border border-neutral-100">
            {/* Aspect Square Frame Shell */}
            <div className="w-full aspect-square bg-neutral-200 rounded-lg"></div>
            {/* Description Multi-line Block Shells */}
            <div className="h-4 bg-neutral-200 rounded w-5/6 mt-2"></div>
            <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
            {/* Price metadata tracker shell */}
            <div className="h-5 bg-neutral-200 rounded w-1/4 mt-4"></div>
          </div>
        ))}
      </div>
    );
  };

 
  if (!isLoading && products.length === 0) {
    return (
      <div className="w-full py-24 text-center px-4">
        <h3 className="text-lg font-semibold text-neutral-800">No matches located</h3>
        <p className="text-neutral-500 text-sm mt-1">We couldn't track items matching "{query}". Check terminology or parameters.</p>
      </div>
    );
  }

 return (
  <main className="w-full min-h-screen bg-white py-8 transition-all duration-300">

    {/* SAFE ROUTING LOADING DEFERRAL RENDER */}
    {isLoading ? (
      <div className="space-y-6">
        <div className="h-6 bg-neutral-200 rounded w-48 mx-4 max-w-7xl md:mx-auto animate-pulse"></div>
        {renderGhostSkeletons()}
      </div>
    ) : (
      <div className="max-w-7xl mx-auto px-4 space-y-12">

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              to={`/search/product/${product.id}`}
              key={product.id}
              className="group flex flex-col w-full bg-white rounded-xl overflow-hidden transition-all duration-200 hover:shadow-sm"
            >
              <div className="w-full aspect-square overflow-hidden bg-neutral-50 rounded-xl relative border border-neutral-100">
                <img
                  src={product.imageName ? `http://localhost:5000${product.imageName}` : product.image}
                  alt="Product Content display frame"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>

              <div className="flex flex-col pt-3 pb-2 px-1 space-y-1.5">
                <p className="text-neutral-700 text-sm font-medium leading-snug line-clamp-2 transition-colors group-hover:text-neutral-900">
                  {product.description}
                </p>

                <div className="flex items-center text-xs font-semibold text-amber-500 gap-1">
                  <span>{product.rating}</span>
                  <span>★</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-base font-bold text-neutral-950">
                    KES {product.price}
                  </span>

                  <span
                    onClick={(e) => {
                      e.preventDefault();
                      console.log(`Global integration: Dispatched item ${product.id} to checkout array store.`);
                    }}
                    className="text-xs font-bold text-neutral-500 hover:text-neutral-950 underline underline-offset-4 tracking-wider transition-colors duration-150"
                  >
                    ADD TO CART
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* INFINITE SCROLL SENSOR BOUNDARY ELEMENT */}
        <div ref={observerRef} className="w-full pt-4 flex justify-center items-center">
          {isFetchingMore && (
            <div className="flex items-center gap-2 text-neutral-500 text-sm font-medium animate-pulse py-4">
              <div className="w-4 h-4 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin"></div>
              Streaming additional records...
            </div>
          )}
        </div>

      </div>
    )}
  </main>
)};