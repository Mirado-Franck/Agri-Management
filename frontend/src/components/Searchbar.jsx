import React from 'react'
import { MdSearch } from 'react-icons/md'
import './css/Searchbar.css'

export default function Searchbar() {
  return (
    <div className="searchbar">
      <div className="searchbar-input-group">
        <input
          type="text"
          className="searchbar-input"
          placeholder="Rechercher"
        />
        <button className="searchbar-search-btn">
          <MdSearch size={24} />
        </button>
      </div>
    </div>
  );
}




