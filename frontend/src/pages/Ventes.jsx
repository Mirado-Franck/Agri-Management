import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './css/Ventes.module.css';
import Searchbar from '../components/Searchbar';
import VenteForm from '../components/VenteForm';
import DetailsModalVente from '../components/DetailsModalVente';
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVentes = async () => {
      try {
        const token = localStorage.getItem('access_token');
        console.log('🔑 Token utilisé:', token);
        if (!token) {
          console.error('🛑 Aucun token trouvé');
          alert('Session expirée, veuillez vous reconnecter.');
          navigate('/login');
          return;
        }
        const response = await axiosInstance.get('/produits/ventes/');
        console.log('📦 Données reçues:', response.data);
        setVentes(response.data);
      } catch (err) {
        console.error('🛑 Erreur lors du chargement des ventes:', err.response?.status, err.response?.data);
        if (err.response?.status === 401) {
          alert('Session expirée, veuillez vous reconnecter.');
          localStorage.removeItem('access_token');
          localStorage.removeItem('user_username');
          localStorage.removeItem('user_role');
          navigate('/login');
        } else {
          alert(`Erreur lors du chargement des ventes: ${err.response?.status || 'Inconnue'} - ${err.response?.data?.detail || 'Vérifiez votre connexion.'}`);
        }
      }
    };
    fetchVentes();
  }, [showModal, navigate]);

  const voirDetails = (vente) => {
    setSelectedVente(vente);
  };

  const imprimerFacture = (vente) => {
    console.log('📄 Vente à imprimer:', vente);
    if (!vente) {
      console.error('🛑 Données de vente invalides: vente est null ou undefined');
      alert('Impossible d\'imprimer la facture : aucune vente sélectionnée.');
      return;
    }
    if (!vente.vente_details) {
      console.warn('⚠️ vente_details est absent, mais la facture peut être imprimée');
    } else if (!Array.isArray(vente.vente_details)) {
      console.error('🛑 Données de vente invalides: vente_details n\'est pas un tableau', vente.vente_details);
      alert('Impossible d\'imprimer la facture : détails de la vente mal formés.');
      return;
    }
    setVenteToPrint(vente);
    setTimeout(() => {
      window.print();
      setVenteToPrint(null);
    }, 300);
  };

  const filteredVentes = ventes.filter(vente =>
    vente.id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    vente.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vente.date?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
                  <td>{vente.total?.toFixed(2)} Ar</td>
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
        <DetailsModalVente
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