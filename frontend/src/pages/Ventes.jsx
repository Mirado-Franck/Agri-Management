import React, { useState, useEffect } from 'react';
import styles from './css/Ventes.module.css'; // Import du CSS module

import Searchbar from '../components/Searchbar';
import VenteForm from '../components/VenteForm';
import DetailsModal from '../components/DetailsModal';
import FacturePrintable from '../components/FacturePrintable';

import { FaEye, FaPlus } from "react-icons/fa";
import { PiPrinter } from "react-icons/pi";
import { IoMdClose } from "react-icons/io";

import axiosInstance from '../axiosInstance';

export default function Ventes() {
  const [showModal, setShowModal] = useState(false);
  const [ventes, setVentes] = useState([]);
  const [selectedVente, setSelectedVente] = useState(null);
  const [venteToPrint, setVenteToPrint] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchVentes = async () => {
      try {
        const token = localStorage.getItem('access_token');
        console.log('🔑 Token utilisé:', token);
        const response = await axiosInstance.get('/produits/ventes/');
        console.log('📦 Données reçues:', response.data);
        setVentes(response.data);
      } catch (err) {
        console.error('🛑 Erreur lors du chargement des ventes:', err.response?.status, err.response?.data);
        alert(`Erreur lors du chargement des ventes: ${err.response?.status || 'Inconnue'} - ${err.response?.data?.detail || 'Vérifiez votre token ou l\'URL.'}`);
      }
    };
    fetchVentes();
  }, [showModal]);

  const voirDetails = (vente) => {
    setSelectedVente(vente);
  };

  const imprimerFacture = (vente) => {
    setVenteToPrint(vente);
    setTimeout(() => {
      window.print();
      setVenteToPrint(null);
    }, 300);
  };

  const filteredVentes = ventes.filter(vente =>
    vente.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    vente.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vente.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vente.user?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles['ventes-container']}>
      <div className={styles['ventes-header']}>
        <div className={styles['button-group']}>
          <button className={styles['btn']} onClick={() => setShowModal(true)}>
            <FaPlus />
          </button>
        </div>
        <div>
          <Searchbar 
            onSearch={(text) => setSearchTerm(text)} 
            placeholder="Rechercher un produit..."
          />
        </div>
      </div>

      <div className={styles['table-wrapper']}>
        <table className={styles['styled-table']}>
          <thead>
            <tr>
              <th>#</th>
              <th>N° du vente</th>
              <th>Date du vente</th>
              <th>Client</th>
              <th>Montant total</th>
              <th>Employé</th>
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVentes.length > 0 ? (
              filteredVentes.map((vente, i) => (
                <tr key={vente.id}>
                  <td>{i + 1}</td>
                  <td>{vente.id}</td>
                  <td>{vente.date}</td>
                  <td>{vente.client}</td>
                  <td>{vente.total.toFixed(2)} Ar</td>
                  <td>{vente.user?.username || '—'}</td>
                  <td className={styles['table-actions']}>
                    <button className={`${styles['modern-button']} ${styles['view-btn']}`} onClick={() => voirDetails(vente)}>
                      <FaEye />
                    </button>
                    <button className={`${styles['modern-button']} ${styles['print-btn']}`} onClick={() => imprimerFacture(vente)}>
                      <PiPrinter />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="7" style={{ textAlign: 'center' }}>Aucune vente trouvée.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedVente && (
        <DetailsModal
          vente={selectedVente}
          onClose={() => setSelectedVente(null)}
        />
      )}

      {showModal && (
        <div className={styles['modal-overlay']}>
          <div className={styles['modal-content']}>
            <button className={styles['close-btn']} onClick={() => setShowModal(false)}>
              <div className={styles['rond']}><IoMdClose size={20} /></div>
            </button>
            <VenteForm />
          </div>
        </div>
      )}

      {venteToPrint && (
        <div className={`${styles['print-container']} ${styles['loading']}`}>
          <div className={styles['loader']}></div>
          <FacturePrintable vente={venteToPrint} />
        </div>
      )}
    </div>
  );
}
