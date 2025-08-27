import React, { useEffect, useState } from 'react';
import Searchbar from '../components/Searchbar.jsx';
import SortBySelector from '../components/SortBySelector.jsx';
import DateSelector from '../components/DateSelector.jsx';
import Modal from '../components/Modal.jsx';
import { FaPlus, FaMinus, FaCheckCircle, FaExclamationTriangle, FaExclamationCircle, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'sonner';
import styles from './css/Stocks.module.css';

export default function Stocks() {
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [dateFilter, setDateFilter] = useState('anytime');
  const [sortOption, setSortOption] = useState('newest-first');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/api/produits/stocks/')
      .then(response => response.json())
      .then(data => {
        setStocks(data);
        setFilteredStocks(data);
      })
      .catch(error => console.error("Erreur lors du chargement des stocks :", error));
  }, []);

  useEffect(() => {
    const filterAndSortStocks = () => {
      let filtered = stocks.filter(stock => {
        const search = searchTerm.toLowerCase();
        if (!search) return true;
        return (
          (stock.produit_nom && stock.produit_nom.toLowerCase().includes(search)) ||
          (stock.produit_categorie && stock.produit_categorie.toLowerCase().includes(search))
        );
      });

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      filtered = filtered.filter(stock => {
        const entryDate = new Date(stock.date_entree);
        if (dateFilter === 'anytime') {
          return true;
        } else if (dateFilter === 'today') {
          return entryDate.toDateString() === today.toDateString();
        } else if (dateFilter === 'last-7-days') {
          const sevenDaysAgo = new Date(today);
          sevenDaysAgo.setDate(today.getDate() - 7);
          return entryDate >= sevenDaysAgo;
        } else if (dateFilter === 'last-30-days') {
          const thirtyDaysAgo = new Date(today);
          thirtyDaysAgo.setDate(today.getDate() - 30);
          return entryDate >= thirtyDaysAgo;
        }
        return true;
      });

      filtered = [...filtered].sort((a, b) => {
        if (sortOption === 'newest-first') {
          return new Date(b.date_entree) - new Date(a.date_entree);
        } else if (sortOption === 'oldest-first') {
          return new Date(a.date_entree) - new Date(b.date_entree);
        } else if (sortOption === 'a-z') {
          return a.produit_nom.localeCompare(b.produit_nom);
        } else if (sortOption === 'z-a') {
          return b.produit_nom.localeCompare(b.produit_nom);
        }
        return 0;
      });

      setFilteredStocks(filtered);
    };

    filterAndSortStocks();
  }, [dateFilter, sortOption, searchTerm, stocks]);

  const handleActionClick = (stock, type) => {
    setSelectedStock(stock);
    setActionType(type);
    setIsModalOpen(true);
    setQuantity(1); // Réinitialiser la quantité à 1
  };

  const handleStockChange = () => {
    if (!selectedStock || !quantity) return;

    const updatedQuantity =
      actionType === 'add'
        ? selectedStock.quantite + quantity
        : selectedStock.quantite - quantity;

    if (updatedQuantity < 0) {
      toast.error("Erreur : La quantité ne peut pas être négative !");
      return;
    }

    const today = new Date().toISOString();

    const payload = {
      quantite: updatedQuantity,
      ...(actionType === 'add' && { date_entree: today }),
      ...(actionType === 'remove' && { date_sortie: today }),
    };

    fetch(`http://localhost:8000/api/produits/stocks/${selectedStock.id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => {
        if (!response.ok) throw new Error("Erreur lors de la mise à jour du stock");
        return response.json();
      })
      .then(data => {
        setStocks(prev =>
          prev.map(item => (item.id === selectedStock.id ? data : item))
        );
        setFilteredStocks(prev =>
          prev.map(item => (item.id === selectedStock.id ? data : item))
        );

        // Notifications pour les états "alerte" et "rupture"
        if (data.etat === 'alerte') {
          toast.warning(`! Stock en alerte pour ${data.produit_nom} : ${data.quantite} ${data.produit_unite} restant`);
        } else if (data.etat === 'rupture') {
          toast.error(`! Rupture de stock pour ${data.produit_nom}`);
        }

        setIsModalOpen(false);
        setQuantity(1);
      })
      .catch(error => {
        console.error("Erreur lors de l'ajustement du stock :", error);
        toast.error("Une erreur s'est produite. Vérifiez la console pour plus de détails.");
      });
  };

  const getEtatDisplay = (etat) => {
    switch (etat) {
      case 'disponible':
        return { text: <><FaCheckCircle className="inline mr-1" /> Disponible</>, color: 'var(--stocks-etat-disponible)' };
      case 'securite':
        return { text: <><FaExclamationTriangle className="inline mr-1" /> Stock de sécurité</>, color: 'var(--stocks-etat-securite)' };
      case 'alerte':
        return { text: <><FaExclamationCircle className="inline mr-1" /> Stock en alerte</>, color: 'var(--stocks-etat-alerte)' };
      case 'rupture':
        return { text: <><FaTimesCircle className="inline mr-1" /> Rupture</>, color: 'var(--stocks-etat-rupture)' };
      default:
        return { text: <><FaCheckCircle className="inline mr-1" /> OK</>, color: 'var(--stocks-etat-disponible)' };
    }
  };

  return (
    <div className={styles.stocksContainer}>
      <div className={styles.stocksHeader}>
        <div className={styles.buttonGroup}>
          <DateSelector selectedDate={dateFilter} setDateFilter={setDateFilter} />
          <SortBySelector selectedSort={sortOption} setSortOption={setSortOption} />
        </div>
        <div>
          <Searchbar onSearch={(term) => setSearchTerm(term)} />
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.styledTable}>
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
            {filteredStocks.map((stock, i) => {
              const { text, color } = getEtatDisplay(stock.etat);
              return (
                <tr key={stock.id}>
                  <td>{i + 1}</td>
                  <td>{stock.produit_nom}</td>
                  <td>{stock.produit_categorie}</td>
                  <td>{stock.quantite} {stock.produit_unite}</td>
                  <td>{stock.seuil_alerte} {stock.produit_unite}</td>
                  <td style={{ color }}>{text}</td>
                  <td>{new Date(stock.date_entree).toLocaleDateString()}</td>
                  <td>{stock.date_sortie ? new Date(stock.date_sortie).toLocaleDateString() : '--'}</td>
                  <td className={styles.tableActions}>
                    <button
                      className={`${styles.modernButton} ${styles.addBtn}`}
                      onClick={() => handleActionClick(stock, 'add')}
                    >
                      <FaPlus />
                    </button>
                    <button
                      className={`${styles.modernButton} ${styles.removeBtn}`}
                      onClick={() => handleActionClick(stock, 'remove')}
                    >
                      <FaMinus />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        selectedStock={selectedStock}
        actionType={actionType}
        quantity={quantity}
        setQuantity={setQuantity}
        onSubmit={handleStockChange}
        maxQuantity={selectedStock?.quantite || 0} // Toujours passer la quantité actuelle
      />
    </div>
  );
}