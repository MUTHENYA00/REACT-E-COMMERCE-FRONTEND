// src/services/currencyResolver.js

const currencyCache = new Map();

export const resolveCurrencyFromCountry = async (iso2) => {
  const code = String(iso2).toUpperCase();

  if (currencyCache.has(code)) {
    return currencyCache.get(code);
  }

  try {
    const res = await fetch(
      `https://restcountries.com/v5.0/alpha/${code}`
    );

    if (!res.ok) throw new Error("API failed");

    const data = await res.json();

    // v5 structure is different:
    const currencies = data?.[0]?.currencies;

    const currency = currencies
      ? Object.keys(currencies)[0]
      : "USD";

    currencyCache.set(code, currency);

    return currency;
  } catch (err) {
    console.error("Currency resolver failed:", err);
    return "USD";
  }
};