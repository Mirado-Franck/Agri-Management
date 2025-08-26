import React, { useState, useEffect } from 'react';
import styles from './css/Achats.module.css';
import Searchbar from '../components/Searchbar';
import AchatForm from '../components/AchatForm';
import DetailsModalAchat from '../components/DetailsModalAchat';
import FacturePrintableAchat from '../components/FacturePrintableAchat';
import { FaEye, FaPlus } from "react-icons/fa";
import { PiPrinter } from "react-icons/pi";
import { IoMdClose } from "react-icons/io";
import axiosInstance from '../axiosInstance';

export default function Achats() {
  const [showModal, setShowModal] = useState(false);
  const [achats, setAchats] = useState([]);
  const [selectedAchat, setSelectedAchat] = useState(null);
  const [achatToPrint, setAchatToPrint] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAchats = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axiosInstance.get('/produits/achats/');
        setAchats(response.data);
      } catch (err) {
        console.error('Erreur lors du chargement des achats:', err.response?.status, err.response?.data);
        alert(`Erreur lors du chargement des achats: ${err.response?.status || 'Inconnue'} - ${err.response?.data?.detail || 'Vérifiez votre token ou l\'URL.'}`);
      }
    };
    fetchAchats();
  }, []); // Supprimé showModal des dépendances

  const voirDetails = (achat) => {
    setSelectedAchat(achat);
  };

  const imprimerFacture = (achat) => {
    setAchatToPrint(achat);
    setTimeout(() => {
      window.print();
      setAchatToPrint(null);
    }, 300);
  };

  const filteredAchats = achats.filter(achat =>
    achat.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    achat.fournisseur.toLowerCase().includes(searchTerm.toLowerCase()) ||
    achat.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
    achat.user?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles['achats-container']}>
      <div className={styles['achats-header']}>
        <div className={styles['button-group']}>
          <button className={styles['btn']} onClick={() => setShowModal(true)}>
            <FaPlus />
          </button>
        </div>
        <div>
          <Searchbar 
            onSearch={(text) => setSearchTerm(text)} 
            placeholder="Rechercher un achat..."
          />
        </div>
      </div>

      <div className={styles['table-wrapper']}>
        <table className={styles['styled-table']}>
          <thead>
            <tr>
              <th>#</th>
              <th>N° de l'achat</th>
              <th>Date de l'achat</th>
              <th>Fournisseur</th>
              <th>Montant total</th>
              <th>Employé</th>
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAchats.length > 0 ? (
              filteredAchats.map((achat, i) => (
                <tr key={achat.id}>
                  <td>{i + 1}</td>
                  <td>{achat.id}</td>
                  <td>{achat.date}</td>
                  <td>{achat.fournisseur}</td>
                  <td>{achat.total.toFixed(2)} Ar</td>
                  <td>{achat.user?.username || '—'}</td>
                  <td className={styles['table-actions']}>
                    <button className={`${styles['modern-button']} ${styles['view-btn']}`} onClick={() => voirDetails(achat)}>
                      <FaEye />
                    </button>
                    <button className={`${styles['modern-button']} ${styles['print-btn']}`} onClick={() => imprimerFacture(achat)}>
                      <PiPrinter />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="7" style={{ textAlign: 'center' }}>Aucun achat trouvé.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedAchat && (
        <DetailsModalAchat
          achat={selectedAchat}
          onClose={() => setSelectedAchat(null)}
        />
      )}

      {showModal && (
        <div className={styles['modal-overlay']}>
          <div className={styles['modal-content']}>
            <button className={styles['close-btn']} onClick={() => setShowModal(false)}>
              <div className={styles['rond']}><IoMdClose size={20} /></div>
            </button>
            <AchatForm />
          </div>
        </div>
      )}

      {achatToPrint && (
        <div className={`${styles['print-container']} ${styles['loading']}`}>
          <div className={styles['loader']}></div>
          <FacturePrintableAchat achat={achatToPrint} />
        </div>
      )}
    </div>
  );
}