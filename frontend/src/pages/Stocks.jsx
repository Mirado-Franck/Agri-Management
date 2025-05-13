import React, { useEffect, useState } from 'react';
import Searchbar from '../components/Searchbar.jsx';
import SortBySelector from '../components/SortBySelector.jsx';
import DateSelector from '../components/DateSelector.jsx';
import { FaPlus, FaMinus } from 'react-icons/fa';
import './css/Stocks.css';

export default function Stocks() {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/produits/stocks/')
      .then(response => response.json())
      .then(data => setStocks(data))
      .catch(error => console.error("Erreur lors du chargement des stocks :", error));
  }, []);

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
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock, i) => (
              <tr key={stock.id}>
              <td>{i + 1}</td>
              <td>{stock.produit_nom}</td>
              <td>{stock.produit_categorie}</td>
              <td>{stock.quantite} {stock.produit_unite}</td>
              <td>{stock.seuil_alerte} kg</td> {/* Affiche le seuil d'alerte */}
              <td>🟢</td>
              <td>{new Date(stock.date_entree).toLocaleDateString()}</td>
              <td>{stock.date_sortie ? new Date(stock.date_sortie).toLocaleDateString() : '--'}</td>
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
