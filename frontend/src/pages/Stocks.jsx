import React from 'react';
import Searchbar from '../components/Searchbar.jsx';
import SortBySelector from '../components/SortBySelector.jsx';
import DateSelector from '../components/DateSelector.jsx';

import { FaPlus, FaMinus} from 'react-icons/fa';
import './css/Stocks.css';

export default function Stocks() {
  return (
    <div className="stocks-container">
      <div className="stocks-header">
      <div className="button-group">
            <p>Date</p>
            <DateSelector/>
            <p>Trier par</p>
            <SortBySelector/>
          </div>
          <div>
            <Searchbar/>
        </div>
      </div>
      <div className="table-wrapper">
        <table className="styled-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nom produits</th>
              <th>Catégorie</th>
              <th>Stock actuel</th>
              <th>Seuil d'alertes</th>
              <th>Etat</th>
              <th>Date d'entrée</th>
              <th>Date de sortie</th>
              <th style={{textAlign: "center"}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 30 }, (_, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>Produit {i + 1}</td>
                <td>Catégorie {i % 5}</td>
                <td>{50 - i * (i + 3) % 2}kg</td>
                <td>{50 + i + 1} kg</td>
                <td>🟢</td>
                <td>0{i + 1}-05-2024</td>
                <td>0{i + 1}-05-2024</td>
                <td className="table-actions">
                  <button className="modern-button add-btn">
                    <FaPlus />
                  </button>
                  <button className="modern-button remove-btn">
                    <FaMinus />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
