import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import StoreLayout from './components/layouts/StoreLayout';
import SignIn from './components/auth/signIn';
import CartPage from './cart/CartPage';

// Features
import Hero from './components/layouts/hero';
import ProductManagement from './features/home-feed/prodMan';
import ProductDetails from './features/home-feed/productDetails';
import { SearchGrid } from './features/search-feed/SearchGrid'; 
import { SearchProdDetail } from './features/search-feed/SearchProdDetails'; 

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Routes>
          
          {/* LAYOUT-BASED ROUTES (These get Nav + Footer automatically) */}
          <Route element={<StoreLayout />}>
            <Route path="/" element={<><Hero /><ProductManagement /></>} />
            <Route path="/product/:id" element={<ProductDetails />} />
            
            {/* Your new Search Routes */}
            <Route path="/search" element={<SearchGrid />} />
            <Route path="/search/product/:id" element={<SearchProdDetail />} />
          </Route>

          {/* STANDALONE ROUTES (These do NOT get Nav or Footer) */}
          <Route path="/cart" element={<CartPage />} />
          <Route path="/signin" element={<SignIn />} />
          
        </Routes>
      </div>
    </BrowserRouter>
  );
}