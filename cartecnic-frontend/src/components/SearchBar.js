import React, { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';

function SearchBar({ onSearch, onCustomerSelect, searchResults, setSearchResults, setShowPopup, onEnterSearch }) {
  const [query, setQuery] = useState('');
  const popupRef = useRef();

  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.length >= 2) {
        onSearch(query);
        setShowPopup(true);
      } else {
        setShowPopup(false);
        setSearchResults([]);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [query, onSearch, setShowPopup, setSearchResults]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowPopup, setSearchResults]);

  return (
    <div className="search-container">
      <div className="search-box">
        <input
          className="search-input"
          type="text"
          placeholder="Customer, plate, transaction no..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && query.length >= 2) {
              onSearch(query);
              setShowPopup(false);
              setSearchResults([]);
              setQuery(''); 
              if (typeof onEnterSearch === 'function') {
                onEnterSearch(query);
              }
            }
          }}
        />
        <button
          className="search-button"
          onClick={() => query.length >= 2 && onSearch(query)}
        >
          <FaSearch /> Search
        </button>
      </div>

      {searchResults?.length > 0 && (
        <div className="popup-container" ref={popupRef}>
          {searchResults.map((result, index) => (
            <div
              key={index}
              className="popup-item"
              onClick={() => {
                setQuery('');
                setShowPopup(false);
                setSearchResults([]);
                onCustomerSelect(result.customerId);
              }}
            >
              <strong>#{result.transactionId}</strong> - {result.ad} {result.soyad} | 📞 {result.telefon} | 🚗 {result.plaka}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
