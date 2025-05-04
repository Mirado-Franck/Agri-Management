import React from 'react';
import ComboBox from '../components/ComboBox.jsx';
import Searchbar from '../components/Searchbar.jsx';
import KebabMenu from '../components/KebabMenu.jsx';

import { FaPlus, FaMinus, FaFilter} from 'react-icons/fa';
import './css/Stocks.css';

export default function Stocks() {


  return (
    <div className="stocks-container">
      <div className="stocks-header">
        <div className="left-buttons">
          <KebabMenu />
          <ComboBox />
          <ComboBox />  
        </div>
        <div className="searchbar-right">
          <Searchbar />
        </div>
      </div>

      <div className="table-wrapper">
        <table className="styled-table">
          <thead>
            <tr>
              <th><input type="checkbox" /></th>
              <th>#</th>
              <th>Nom produits</th>
              <th>Catégorie</th>
              <th>Stock actuel</th>
              <th>Seuil d'alertes</th>
              <th>Etat</th>
              <th>Date d'entrée</th>
              <th>Date de sortie</th>
              <th>Actions rapide</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 30 }, (_, i) => (
              <tr key={i}>
                <td><input type="checkbox" /></td>
                <td>{i + 1}</td>
                <td>Produit {i + 1}</td>
                <td>Catégorie {i % 5}</td>
                <td>{50 - i * (i + 3) % 2}kg</td>
                <td>{50 + i + 1} kg</td>
                <td>🟢</td>
                <td>0{i + 1}-05-2024</td>
                <td>0{i + 1}-05-2024</td>
                <td>
                  <div className="button-row">
                    <button className="btn-stocks btn-add-stocks"><FaPlus /></button>
                    <button className="btn-stocks btn-minus-stocks"><FaMinus /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
