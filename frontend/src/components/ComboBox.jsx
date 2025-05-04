import React, { useState } from 'react';
import './css/ComboBox.css';

const ComboBox = () => {
  const [selected, setSelected] = useState('');

  const options = [
    { value: 'fr', label: 'France' },
    { value: 'de', label: 'Allemagne' },
    { value: 'it', label: 'Italie' },
    { value: 'es', label: 'Espagne' },
    { value: 'uk', label: 'Royaume-Uni' }
  ];

  const handleChange = (e) => {
    setSelected(e.target.value);
    console.log("Option sélectionnée :", e.target.value);
  };

  return (
    <div className="combobox-container">

      <select
        value={selected}
        onChange={handleChange}
        className="combobox-select"
      >
        <option className="option" value="" disabled>-- Sélectionner un pays --</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ComboBox;

