import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (onSearch) onSearch(query);
  };

  return (
    <div className="top-section">
      <input
        className="search-input"
        type="text"
        placeholder="Müşteri, plaka, işlem no..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="search-button" onClick={handleSearch}>
        <FaSearch /> Arama
      </button>
    </div>
  );
}

export default SearchBar;
