import React, { useState, useMemo, useContext, useEffect } from 'react';
import { allCountries } from 'country-telephone-data';
import Flags from 'country-flag-icons/react/3x2';
import { CurrencyContext } from '../../contexts/CurrencyContextInstance';

export default function CountrySelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState(null);

  const { currency, setCurrency, loading } = useContext(CurrencyContext);
    const cleanCountryList = useMemo(() => {
    const seen = new Set();

    return allCountries
      .filter((c) => {
        if (!c.iso2 || seen.has(c.iso2.toLowerCase())) return false;
        seen.add(c.iso2.toLowerCase());
        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);
   const handleCurrencyRouting = async (isoCode) => {
 
  setCurrency(currency);
};

    const filteredCountries = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) return cleanCountryList;

    return cleanCountryList.filter((c) =>
      c.name.toLowerCase().includes(query) ||
      c.dialCode.includes(query) ||
      c.iso2.toLowerCase().includes(query)
    );
  }, [searchQuery, cleanCountryList]);
    useEffect(() => {
    if (!currency || !cleanCountryList.length) return;

    const syncCountry = async () => {
      for (const c of cleanCountryList) {
      }
    };

    syncCountry();
  }, [currency, cleanCountryList]);
    useEffect(() => {
    if (!selected && cleanCountryList.length) {
      setSelected(
        cleanCountryList.find((c) => c.iso2.toUpperCase() === 'KE') ||
        cleanCountryList[0]
      );
    }
  }, [cleanCountryList]);
    if (loading || !selected) {
    return (
      <div className="text-[11px] font-medium text-white/40 animate-pulse bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
        Locating node...
      </div>
    );
  }
    const ActiveFlag = Flags[selected.iso2.toUpperCase()];

  return (
    <div className="relative select-none z-50">

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-100 hover:border-gray-200 bg-gray-50/50 hover:bg-gray-50 transition-all text-xs font-bold text-gray-700 cursor-pointer shadow-xs active:scale-98"
      >
        {ActiveFlag && <ActiveFlag className="w-4 h-3 rounded-xs shadow-xs shrink-0 object-cover" />}
        <span className="tracking-wide text-gray-800">
          {selected.iso2.toUpperCase()}
        </span>
        <span className="text-gray-900 font-extrabold">
          +{selected.dialCode}
        </span>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2.5 w-64 bg-white border-2 border-gray-200 rounded-2xl shadow-2xl p-2.5 flex flex-col gap-2 ring-1 ring-black/5">

          <input
            type="text"
            placeholder="Search country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-teal-600 transition-colors bg-gray-50/50 text-black font-semibold"
          />

          <div className="max-h-56 overflow-y-auto flex flex-col gap-0.5 pr-0.5 scrollbar-thin">
            {filteredCountries.map((country) => {
              const ItemFlag = Flags[country.iso2.toUpperCase()];

              return (
                <button
                  key={country.iso2}
                  type="button"
                  onClick={async () => {
                    setSelected(country);
                    await handleCurrencyRouting(country.iso2);
                    setIsOpen(false);
                    setSearchQuery('');
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-teal-50/50 transition-all text-xs font-bold text-gray-900"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {ItemFlag && <ItemFlag className="w-4 h-3 rounded-xs shadow-xs shrink-0 object-cover" />}
                    <span className="truncate">{country.name}</span>
                  </div>

                  <span className="text-[10px] font-bold text-gray-400">
                    +{country.dialCode}
                  </span>
                </button>
              );
            })}
          </div>

        </div>
      )}
    </div>
  );
}