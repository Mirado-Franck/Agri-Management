import React, { useState } from 'react';
import { MdSearch } from 'react-icons/md';
import './css/Searchbar.css';

export default function Searchbar({ onSearch }) {
  const [searchText, setSearchText] = useState('');

  const handleSearch = () => {
    if (typeof onSearch === 'function') {
      onSearch(searchText.trim());
    }
  };

  return (
    <div className="searchbar">
      <div className="searchbar-input-group">
        <input
          type="text"
          className="searchbar-input"
          placeholder="Rechercher"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button 
          className="searchbar-search-btn"
          onClick={handleSearch}
        >
          <MdSearch size={24} />
        </button>
      </div>
    </div>
  );
}