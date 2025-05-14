import React, { useEffect, useState } from 'react';
import Searchbar from '../components/Searchbar.jsx';
import SortBySelector from '../components/SortBySelector.jsx';
import DateSelector from '../components/DateSelector.jsx';
import Modal from '../components/Modal.jsx';
import { FaPlus, FaMinus } from 'react-icons/fa';
import './css/Stocks.css';

export default function Stocks() {
  const [stocks, setStocks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [actionType, setActionType] = useState(null); // "add" ou "remove"
  const [quantity, setQuantity] = useState(1); // quantité saisie

  useEffect(() => {
    fetch('http://localhost:8000/api/produits/stocks/')
      .then(response => response.json())
      .then(data => setStocks(data))
      .catch(error => console.error("Erreur lors du chargement des stocks :", error));
  }, []);

  const handleActionClick = (stock, type) => {
    setSelectedStock(stock);
    setActionType(type);
    setIsModalOpen(true);
  };
  
  const handleStockChange = () => {
    if (!selectedStock || !quantity) return;
  
    const updatedQuantity =
      actionType === 'add'
        ? selectedStock.quantite + quantity
        : selectedStock.quantite - quantity;
  
    fetch(`http://localhost:8000/api/produits/stocks/${selectedStock.id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantite: updatedQuantity }),
    })
      .then(response => {
        if (!response.ok) throw new Error("Erreur lors de la mise à jour du stock");
        return response.json();
      })
      .then(data => {
        setStocks(prev =>
          prev.map(item => (item.id === selectedStock.id ? data : item))
        );
        setIsModalOpen(false);
        setQuantity(1);
      })
      .catch(error => {
        console.error("Erreur lors de l'ajustement du stock :", error);
      });
  };
  
  return (
    <div className="stocks-container">
      <div className="stocks-header">
        <div className="button-group">
          <p>Date</p>
          <DateSelector />
          <p>Trier par</p>
          <SortBySelector />
        </div>
        <div>
          <Searchbar />
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
                <td>{stock.seuil_alerte} {stock.produit_unite}</td>
                <td style={{ color: stock.etat ? 'red' : 'green' }}>
                  {stock.etat ? "🔴 Stock bas" : "🟢 OK"}
                </td>
                <td>{new Date(stock.date_entree).toLocaleDateString()}</td>
                <td>{stock.date_sortie ? new Date(stock.date_sortie).toLocaleDateString() : '--'}</td>
                <td className="table-actions">
                  <button
                    className="modern-button add-btn"
                    onClick={() => handleActionClick(stock, 'add')}
                  >
                    <FaPlus />
                  </button>
                  <button
                    className="modern-button remove-btn"
                    onClick={() => handleActionClick(stock, 'remove')}
                  >
                    <FaMinus />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>{actionType === 'add' ? 'Ajouter au stock' : 'Retirer du stock'}</h2>
        <p>Produit : <strong>{selectedStock?.produit_nom}</strong></p>

        <form
          onSubmit={e => {
            e.preventDefault();
            handleStockChange();
          }}
        >
          <label>Quantité :</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min="1"
            required
          />
          <button type="submit" className="submit-button">
            Valider
          </button>
        </form>
      </Modal>

    </div>
  );
}
