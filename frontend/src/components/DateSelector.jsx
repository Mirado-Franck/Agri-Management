import React, { useState } from 'react';
import './css/ComboBox.css'; // Assurez-vous d'inclure le fichier CSS

const DateSelector = () => {
  const [selectedDate, setSelectedDate] = useState('');

  const handleChange = (e) => {
    setSelectedDate(e.target.value);
  };

  return (
    <div className="combo-box-container">
      <select 
        id="date-selector"
        className="combo-box"
        value={selectedDate}
        onChange={handleChange}
      >
        <option value="anytime">N'importe quand</option>
        <option value="today">Aujourd'hui</option>
        <option value="last-7-days">7 derniers jours</option>
        <option value="last-30-days">30 derniers jours</option>
      </select>
    </div>
  );
};

export default DateSelector;
