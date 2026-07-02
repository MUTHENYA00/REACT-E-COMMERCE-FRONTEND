import { useContext } from "react";
import { CurrencyContext } from "../contexts/CurrencyContextInstance";

export function useCurrency() {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }

  const {
    currency,
    setCurrency,
    formatPrice,
    convertPrice,
    loading,
    rates,
    supportedCurrencies,
    initialized,
  } = context;

  return {
    currency,
    setCurrency,
    formatPrice,
    convertPrice,
    loading,
    rates,
    supportedCurrencies,
    initialized,
  };
}