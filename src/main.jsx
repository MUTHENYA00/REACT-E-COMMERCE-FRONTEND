import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
// 1. FIXED IMPORT: Import CurrencyProvider instead of the naked CurrencyContext object
import { CurrencyProvider } from './contexts/CurrencyContext';
import './global.css'; // Make sure your Tailwind directives are inside this file!

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. FIXED WRAPPER: Replaced <CurrencyContext> with the functional <CurrencyProvider> */}
    <CurrencyProvider>
      <App />
    </CurrencyProvider>
  </React.StrictMode>
);
