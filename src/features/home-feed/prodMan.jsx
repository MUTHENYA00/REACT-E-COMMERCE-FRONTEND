import React, { useState, useEffect } from 'react';
import ProductGrid1 from './ProductGrid1'; 

export default function ProductManagement() {
  // Start with an empty canvas. Your backend data machine will fill this up.
  const [processedProducts, setProcessedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch your 60+ real products from your backend pipeline
    fetch('http://localhost:5000/api/products/homepage') 
      .then((response) => response.json())
      .then((rawProducts) => {
        
        const formatted = (Array.isArray(rawProducts) ? rawProducts : []).map((product) => {
          // Stable stock generator
          const stableStock = ((product.id * 7) % 12) + 1;
          
          // Clean prices down to raw integers/floats
          const cleanDigits = product.price ? String(product.price).replace(/[^0-9.]/g, '') : '0';
          const baseKshPrice = parseFloat(cleanDigits) || 0;

         // Change this line inside your ProductManagement data processing loop:
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
        console.error("Error connecting to data machine:", error);
        setLoading(false);
      });
  }, []); 
  
  const gridOneItems = processedProducts.slice(0, 20);
  const gridTwoItems = processedProducts.slice(20, 40); 
  const gridThreeItems = processedProducts.slice(40, 60);

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Connecting to data machine...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductGrid1 products={gridOneItems} />
      <ProductGrid1 products={gridTwoItems} />
      <ProductGrid1 products={gridThreeItems} />
    </div>
  );
}