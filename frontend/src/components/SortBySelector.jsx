import React from 'react';
import './css/ComboBox.css';

const SortBySelector = ({ selectedSort, setSortOption }) => {
  const handleChange = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <div className="combo-box-container">
      <label htmlFor="sort-by-selector" className="combo-box-label">Trier par :</label>
      <select 
        id="sort-by-selector"
        className="combo-box"
        value={selectedSort}
        onChange={handleChange}
      >
        <option value="newest-first">Plus récents d'abord</option>
        <option value="oldest-first">Moins récents d'abord</option>
        <option value="a-z">A - Z</option>
        <option value="z-a">Z - A</option>
      </select>
    </div>
  );
};

export default SortBySelector;