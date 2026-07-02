import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_DELAY = 300;
const MAX_SUGGESTIONS = 8;

export function SearchBar({ className = "" }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [inputValue, setInputValue] = useState(
    () => searchParams.get("q") || ""
  );

  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedIndex, setSelectedIndex] = useState(-1);

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const debounceRef = useRef(null);
  const abortRef = useRef(null);

  // Cache algorithm
  const cacheRef = useRef(new Map());

  useEffect(() => {
    const query = searchParams.get("q") || "";
    setInputValue(query);
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

      clearTimeout(debounceRef.current);

      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setShowDropdown(false);
    setSelectedIndex(-1);
  }, []);

  const fetchSuggestions = useCallback(async (query) => {
    const term = query.trim();

    if (term.length < MIN_QUERY_LENGTH) {
      clearSuggestions();
      return;
    }

    const cacheKey = term.toLowerCase();

    if (cacheRef.current.has(cacheKey)) {
      const cached = cacheRef.current.get(cacheKey);

      setSuggestions(cached);
      setShowDropdown(cached.length > 0);
      setLoading(false);
      setError(null);

      return;
    }

    if (abortRef.current) {
      abortRef.current.abort();
    }

    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      // Backend pipe
      const response = await fetch(
        `${API_URL}/api/search/suggest?prefix=${encodeURIComponent(
          term
        )}`,
        {
          signal: abortRef.current.signal,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch suggestions.");
      }

      const data = await response.json();

      const results = Array.isArray(data)
        ? data.slice(0, MAX_SUGGESTIONS)
        : [];

      cacheRef.current.set(cacheKey, results);

      setSuggestions(results);
      setShowDropdown(true);
      setSelectedIndex(-1);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error(err);

        setError("Unable to load suggestions.");
        clearSuggestions();
      }
    } finally {
      setLoading(false);
    }
  }, [clearSuggestions]);

  // Debounce algorithm
  const scheduleSuggestionFetch = useCallback(
    (value) => {
      clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
        fetchSuggestions(value);
      }, DEBOUNCE_DELAY);
    },
    [fetchSuggestions]
  );

  const executeSearch = useCallback(
    (value) => {
      const term = value.trim();

      clearSuggestions();

      const current =
        (searchParams.get("q") || "").trim();

      if (term === current) {
        return;
      }

      if (term.length) {
        navigate(
          `/search?q=${encodeURIComponent(term)}`
        );
      } else {
        navigate("/");
      }
    },
    [navigate, searchParams, clearSuggestions]
  );
    const selectSuggestion = useCallback(
    (value) => {
      setInputValue(value);
      executeSearch(value);
    },
    [executeSearch]
  );

  const handleInputChange = useCallback(
    (e) => {
      const value = e.target.value;

      setInputValue(value);
      setSelectedIndex(-1);
      setError(null);

      if (value.trim().length < MIN_QUERY_LENGTH) {
        clearSuggestions();
        return;
      }

      scheduleSuggestionFetch(value);
    },
    [scheduleSuggestionFetch, clearSuggestions]
  );

  const handleInputFocus = useCallback(() => {
    const term = inputValue.trim().toLowerCase();

    if (term.length < MIN_QUERY_LENGTH) return;

    if (cacheRef.current.has(term)) {
      const cached = cacheRef.current.get(term);

      setSuggestions(cached);
      setShowDropdown(cached.length > 0);
      return;
    }

    scheduleSuggestionFetch(term);
  }, [inputValue, scheduleSuggestionFetch]);

  const clearInput = useCallback(() => {
    setInputValue("");
    setError(null);
    clearSuggestions();

    inputRef.current?.focus();

    navigate("/");
  }, [clearSuggestions, navigate]);

  // Keyboard navigation algorithm
  const handleKeyDown = useCallback(
    (e) => {
      if (!showDropdown) {
        if (e.key === "Enter") {
          e.preventDefault();

          clearTimeout(debounceRef.current);

          executeSearch(inputValue);
        }

        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();

          setSelectedIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : 0
          );

          break;

        case "ArrowUp":
          e.preventDefault();

          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : suggestions.length - 1
          );

          break;

        case "Enter":
          e.preventDefault();

          clearTimeout(debounceRef.current);

          if (
            selectedIndex >= 0 &&
            suggestions[selectedIndex]
          ) {
            selectSuggestion(suggestions[selectedIndex]);
          } else {
            executeSearch(inputValue);
          }

          break;

        case "Escape":
          e.preventDefault();

          clearSuggestions();

          break;

        case "Tab":
          clearSuggestions();

          break;

        default:
          break;
      }
    },
    [
      showDropdown,
      suggestions,
      selectedIndex,
      inputValue,
      executeSearch,
      selectSuggestion,
      clearSuggestions,
    ]
  );

  useEffect(() => {
    if (
      selectedIndex >= 0 &&
      selectedIndex < suggestions.length
    ) {
      setInputValue(suggestions[selectedIndex]);
    }
  }, [selectedIndex, suggestions]);

  const hasSuggestions =
    suggestions.length > 0;

  const showNoResults =
    !loading &&
    !error &&
    inputValue.trim().length >= MIN_QUERY_LENGTH &&
    !hasSuggestions;

  const dropdownVisible =
    showDropdown &&
    (
      loading ||
      error ||
      hasSuggestions ||
      showNoResults
    );
      return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-xl mx-auto ${className}`}
    >
      <div className="relative flex items-center w-full">
        <button
          type="button"
          aria-label="Search"
          onClick={() => executeSearch(inputValue)}
          className="absolute left-4 text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </button>

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          placeholder="Search items, categories, tags..."
          autoComplete="off"
          spellCheck={false}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={dropdownVisible}
          aria-controls="search-suggestion-list"
          aria-activedescendant={
            selectedIndex >= 0
              ? `suggestion-${selectedIndex}`
              : undefined
          }
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          className="w-full py-3 pl-12 pr-11 bg-neutral-50 hover:bg-neutral-100 focus:bg-white text-sm text-neutral-800 rounded-xl border border-neutral-200 focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400 outline-none shadow-sm focus:shadow-md transition-all"
        />

        {inputValue && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={clearInput}
            className="absolute right-4 p-1 rounded-full hover:bg-neutral-200 text-neutral-400 hover:text-neutral-600 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {dropdownVisible && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-neutral-200 rounded-xl shadow-xl overflow-hidden z-50">
          <ul
            id="search-suggestion-list"
            role="listbox"
            className="max-h-72 overflow-y-auto py-2"
          >
            {loading && (
              <li className="px-4 py-3 text-sm text-neutral-500">
                Searching...
              </li>
            )}

            {!loading && error && (
              <li className="px-4 py-3 text-sm text-red-500">
                {error}
              </li>
            )}

            {!loading && showNoResults && (
              <li className="px-4 py-3 text-sm text-neutral-500">
                No suggestions found.
              </li>
            )}

            {!loading &&
              !error &&
              suggestions.map((phrase, index) => (
                <li
                  key={phrase}
                  id={`suggestion-${index}`}
                  role="option"
                  aria-selected={selectedIndex === index}
                >
                  <button
                    type="button"
                    onClick={() => selectSuggestion(phrase)}
                    onMouseEnter={() =>
                      setSelectedIndex(index)
                    }
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                      selectedIndex === index
                        ? "bg-neutral-100 text-neutral-900"
                        : "hover:bg-neutral-50 text-neutral-800"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4 text-neutral-400 flex-shrink-0"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>

                    <span className="truncate">
                      {phrase}
                    </span>
                  </button>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}