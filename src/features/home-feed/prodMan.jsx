import React, { useState, useEffect } from 'react';
import ProductGrid1 from './ProductGrid1'; 

export default function ProductManagement() {
 
  const [processedProducts, setProcessedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let isMounted = true;
    let retryTimer;

    const fetchProducts = () => {
  
      fetch('http://localhost:5000/api/products/homepage') 
        .then((response) => {
          if (!response.ok) throw new Error('Server response error');
          return response.json();
        })
        .then((rawProducts) => {
          if (!isMounted) return;
          
          const formatted = (Array.isArray(rawProducts) ? rawProducts : []).map((product) => {
            const stableStock = ((product.id * 7) % 12) + 1;
            
            // Clean prices down to raw integers/floats
            const cleanDigits = product.price ? String(product.price).replace(/[^0-9.]/g, '') : '0';
            const baseKshPrice = parseFloat(cleanDigits) || 0;
            const finalPath = product.imageName 
              ? `http://localhost:5000${product.imageName.replace('/uploads/', '/Uploads/')}` 
              : null;

            return {
              id: product.id,
              title: product.name || product.title || "Unnamed Product",
              description: product.description || "Fresh product selection ready for checkout.", 
              price: baseKshPrice,
              stockCount: stableStock,
              imageUrl: finalPath 
            };
          }).sort(() => Math.random() - 0.5); 

          setProcessedProducts(formatted);
          setLoading(false);
        })
        .catch((error) => {
          if (!isMounted) return;
          
          console.warn("Backend not running or ready yet. Retrying in 3 seconds...", error);
          setLoading(true); 
          retryTimer = setTimeout(fetchProducts, 3000); 
        });
    };

    fetchProducts();

    // Cleans up timers to prevent memory leaks if user leaves the page
    return () => {
      isMounted = false;
      clearTimeout(retryTimer);
    };
  }, []);

  const gridOneItems = processedProducts.slice(0, 20);
  const gridTwoItems = processedProducts.slice(20, 40); 
  const gridThreeItems = processedProducts.slice(40, 60);

  if (loading) {
    return <div className="text-center py-20 text-gray-500">loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductGrid1 products={gridOneItems} />
      <ProductGrid1 products={gridTwoItems} />
      <ProductGrid1 products={gridThreeItems} />
    </div>
  );
}