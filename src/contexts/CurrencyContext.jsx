import React, { useEffect, useState } from "react";
import { CurrencyContext } from "./CurrencyContextInstance";

/*
API ENDPOINTS (FREE SERVICES)
IP geolocation: https://ipapi.co/json/
Exchange rates: https://open.er-api.com/v6/latest/KES
*/
const IP_API_URL = "https://ipapi.co/json/";
const EXCHANGE_API_URL = "https://open.er-api.com/v6/latest/KES";
/* BASE CURRENCY*/
const BASE_CURRENCY = "KES";

/* CACHE KEYS (localStorage)*/
const STORAGE_KEYS = {
  CURRENCY: "app_currency",
  RATES: "app_rates",
  RATES_TIMESTAMP: "app_rates_timestamp"
};

/* CACHE VALIDITY-Exchange rates will be considered fresh for 12 hours.*/
const RATES_CACHE_DURATION = 1000 * 60 * 60 * 12;

/* Only used if API fails completely.*/
const FALLBACK_RATES = {
  KES: 1,
  USD: 0.0078,
  EUR: 0.0072,
  GBP: 0.0061,
  ZAR: 0.14,
  UGX: 28.8,
  TZS: 20.5,
  INR: 0.65
};


  export function CurrencyProvider({ children }) {
// Selected active currency (always a valid ISO code)
  const [currency, setCurrency] = useState(BASE_CURRENCY);

  // Exchange rates relative to BASE_CURRENCY (KES)
  const [rates, setRates] = useState(FALLBACK_RATES);

  // Prevents UI from rendering incorrect prices before initialization completes
  const [loading, setLoading] = useState(true);

  /* DERIVED STATE (IN MEMORY ONLY) Optional future extension: 
  Could be populated dynamically from rates API response.*/
 const [supportedCurrencies, setSupportedCurrencies] = useState(
    Object.keys(FALLBACK_RATES)
  );
 /*INTERNAL FLAGS (non-persistent runtime controls)*/
 const [initialized, setInitialized] = useState(false);

   /*STORAGE UTILITIES*/
const readStoredCurrency = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENCY);
      return stored ? stored : null;
    } catch (err) {
      console.error("Failed to read stored currency:", err);
      return null;
    }
  };

  const saveStoredCurrency = (value) => {
    try {
      if (!value) return;
      localStorage.setItem(STORAGE_KEYS.CURRENCY, value);
    } catch (err) {
      console.error("Failed to save currency:", err);
    }
  };

  const clearStoredCurrency = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.CURRENCY);
    } catch (err) {
      console.error("Failed to clear currency:", err);
    }
  };

  /* RATES CACHE HANDLING */
const readCachedRates = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.RATES);
      if (!raw) return null;
  return JSON.parse(raw);
    } catch (err) {
      console.error("Failed to read cached rates:", err);
      return null;
    }
  };
const saveCachedRates = (rates) => {
    try {
      if (!rates) return;
      localStorage.setItem(STORAGE_KEYS.RATES, JSON.stringify(rates));
      localStorage.setItem(
        STORAGE_KEYS.RATES_TIMESTAMP,
        String(Date.now())
      );
    } catch (err) {
      console.error("Failed to save cached rates:", err);
    }
  };
   const isRatesCacheValid = () => {
    try {
      const timestamp = localStorage.getItem(STORAGE_KEYS.RATES_TIMESTAMP);
      if (!timestamp) return false;
      const age = Date.now() - Number(timestamp);
      return age < RATES_CACHE_DURATION;
    } catch (err) {
      console.error("Failed to validate cache:", err);
      return false;
    }
  };
    /*CURRENCY DETECTION*/

  const validateCurrency = (code) => {
    if (!code || typeof code !== "string") return false;
    return true; 
  };

  const detectCurrencyFromIP = async () => {
    try {
      const response = await fetch(IP_API_URL);
       if (!response.ok) {
        throw new Error("IP API request failed");
      }

      const data = await response.json();
      const detected = data?.currency;

      if (validateCurrency(detected)) {
        return detected;
      }

      return BASE_CURRENCY;
    } catch (err) {
      console.error("IP detection failed:", err);
      return BASE_CURRENCY;
    }
  };

  const resolveInitialCurrency = async () => {
    try {
      // 1. Check stored preference first
      const stored = readStoredCurrency()
      if (stored && validateCurrency(stored)) {
        return stored;
      }
       // 2. Otherwise detect via IP
      const detected = await detectCurrencyFromIP();
      return detected || BASE_CURRENCY;
    } catch (err) {
      console.error("Currency resolution failed:", err);
      return BASE_CURRENCY;
    }
  };
  /* EXCHANGE API LAYER*/
   const validateRatesResponse = (data) => {
    if (!data) return false;
    if (data.result !== "success") return false;
    if (!data.rates || typeof data.rates !== "object") return false;
    return true;
  };

  const fetchExchangeRates = async () => {
    try {
      const response = await fetch(EXCHANGE_API_URL);
       if (!response.ok) {
        throw new Error("Exchange rate API failed");
      }
      const data = await response.json();
      if (!validateRatesResponse(data)) {
        throw new Error("Invalid exchange rate response");
      }

      return data.rates;
    } catch (err) {
      console.error("Live rates fetch failed:", err);
      return null;
    }
  };

  const getExchangeRates = async () => {
    try {
      // 1. Use cache if valid
      const cachedRates = readCachedRates();
      const cacheValid = isRatesCacheValid();

      if (cachedRates && cacheValid) {
        return cachedRates;
      }

      // 2. Fetch live rates
      const liveRates = await fetchExchangeRates();
      if (liveRates) {
        saveCachedRates(liveRates);
        return liveRates;
      }

      return FALLBACK_RATES;
    } catch (err) {
      console.error("Exchange rate resolution failed:", err);
      return FALLBACK_RATES;
    }
  };

  const updateSupportedCurrencies = (ratesObject) => {
    try {
      if (!ratesObject || typeof ratesObject !== "object") return;
      const currencies = Object.keys(ratesObject);
      setSupportedCurrencies(currencies);
    } catch (err) {
      console.error("Failed to update supported currencies:", err);
    }
  };

    /* CONVERSION ENGINE*/
const sanitizeNumber = (value) => {
    const num = parseFloat(String(value).replace(/[^0-9.]/g, ""));
    return isNaN(num) ? 0 : num;
  };
   const getSafeRate = (currencyCode) => {
    if (!currencyCode) return 1;
    const rate = rates?.[currencyCode];
     // If rate is missing, fallback to KES (1:1)
    if (typeof rate !== "number") return 1;
     return rate;
  };

  /* CONVERT PRICE*/
  const convertPrice = (basePriceInKES, targetCurrency = currency) => {
    try {
      const numericPrice = sanitizeNumber(basePriceInKES);
      const rate = getSafeRate(targetCurrency);

      return numericPrice * rate;
    } catch (err) {
      console.error("Price conversion failed:", err);
      return 0;
    }
  };

  /*FORMAT PRICE*/
  const formatPrice = (basePriceInKES) => {
    try {
      const converted = convertPrice(basePriceInKES);
      const safeCurrency = currency || BASE_CURRENCY;

      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: safeCurrency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(converted);
    } catch (err) {
      console.error("Price formatting failed:", err);

      // Final fallback (never crash UI)
      const fallback = convertPrice(basePriceInKES);
      return `${currency} ${fallback.toFixed(2)}`;
    }
  };
    /* INITIALIZATION ENGINE*/

  const initializeCurrencySystem = async () => {
    try {
      setLoading(true);

    /*resolve currency*/
      const resolvedCurrency = await resolveInitialCurrency();
      const resolvedRates = await getExchangeRates();
      const finalCurrency =
        validateCurrency(resolvedCurrency)
          ? resolvedCurrency
          : BASE_CURRENCY;

      const finalRates =
        resolvedRates && typeof resolvedRates === "object"
          ? resolvedRates
          : FALLBACK_RATES;

      setCurrency(finalCurrency);
      setRates(finalRates);
      updateSupportedCurrencies(finalRates);
      saveStoredCurrency(finalCurrency);
      setInitialized(true);
    } catch (err) {
      console.error("Currency system initialization failed:", err);

 /*HARD FALLBACK SAFETY  */
   setCurrency(BASE_CURRENCY);
      setRates(FALLBACK_RATES);
      setInitialized(true);
    } finally {
      setLoading(false);
    }
  };
    /* INITIALIZATION HOOK.Runs once when provider mounts*/

  useEffect(() => {
    if (!initialized) {
      initializeCurrencySystem();
    }
  }, []);

  /* MANUAL CURRENCY UPDATE (USER ACTION) */
  const changeCurrency = (newCurrency) => {
    try {
      if (!validateCurrency(newCurrency)) return;
      setCurrency(newCurrency);
      saveStoredCurrency(newCurrency);
    } catch (err) {
      console.error("Failed to change currency:", err);
    }
  };

  /*CONTEXT VALUE (PUBLIC API) */
  const value = {
    currency,
    rates,
    loading,
    supportedCurrencies,

    // Core utilities
    convertPrice,
    formatPrice,

    // User controls
    setCurrency: changeCurrency,

    // System state
    initialized,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}