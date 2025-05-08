import React, { useState } from 'react';
import './css/ComboBox.css'; // Assurez-vous d'inclure le fichier CSS

const SortBySelector = () => {
  const [selectedSort, setSelectedSort] = useState('');

  const handleChange = (e) => {
    setSelectedSort(e.target.value);
  };

  return (
    <div className="combo-box-container">
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
