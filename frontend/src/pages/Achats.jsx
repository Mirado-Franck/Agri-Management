import React, { useState, useEffect } from 'react';
import './css/Achats.module.css'; // Supposons un fichier CSS similaire à Ventes.css
import Searchbar from '../components/Searchbar';
import AchatForm from '../components/AchatForm';
import DetailsModal from '../components/DetailsModal'; // Réutilisé, supposant qu'il fonctionne pour les achats
import FacturePrintable from '../components/FacturePrintable'; // Réutilisé, supposant qu'il fonctionne pour les achats
import { FaEye, FaPlus } from "react-icons/fa";
import { PiPrinter } from "react-icons/pi";
import { IoMdClose } from "react-icons/io";
import axiosInstance from '../axiosInstance';

export default function Achat() {
  const [showModal, setShowModal] = useState(false);
  const [achats, setAchats] = useState([]);
  const [selectedAchat, setSelectedAchat] = useState(null);
  const [achatToPrint, setAchatToPrint] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchAchats = async () => {
      try {
        const token = localStorage.getItem('access_token');
        console.log('🔑 Token utilisé:', token);
        const response = await axiosInstance.get('/produits/achats/');
        console.log('📦 Données reçues:', response.data);
        setAchats(response.data);
      } catch (err) {
        console.error('🛑 Erreur lors du chargement des achats:', err.response?.status, err.response?.data);
        alert(`Erreur lors du chargement des achats: ${err.response?.status || 'Inconnue'} - ${err.response?.data?.detail || 'Vérifiez votre token ou l\'URL.'}`);
      }
    };
    fetchAchats();
  }, [showModal]);

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
    <div className='achats-container'>
      <div className="achats-header">
        <div className="button-group">
          <button className="btn" onClick={() => setShowModal(true)}>
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

      <div className="table-wrapper">
        <table className="styled-table">
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
                  <td className="table-actions">
                    <button className="modern-button view-btn" onClick={() => voirDetails(achat)}>
                      <FaEye />
                    </button>
                    <button className="modern-button print-btn" onClick={() => imprimerFacture(achat)}>
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
        <DetailsModal
          vente={selectedAchat} // Supposons que DetailsModal accepte 'vente' comme prop
          onClose={() => setSelectedAchat(null)}
        />
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowModal(false)}>
              <div className='rond'><IoMdClose size={20} /></div>
            </button>
            <AchatForm />
          </div>
        </div>
      )}

      {achatToPrint && (
        <div className="print-container loading">
          <div className="loader"></div>
          <FacturePrintable vente={achatToPrint} /> // Supposons que FacturePrintable accepte 'vente'
        </div>
      )}
    </div>
  );
}