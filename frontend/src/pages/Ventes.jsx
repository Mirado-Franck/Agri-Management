import React, { useState, useEffect } from 'react';
import './css/Ventes.css';

import Searchbar from '../components/Searchbar';
import VenteForm from '../components/VenteForm';
import DetailsModal from '../components/DetailsModal';
import FacturePrintable from '../components/FacturePrintable';

import { FaEye, FaPlus } from "react-icons/fa";
import { PiPrinter } from "react-icons/pi";
import { IoMdClose } from "react-icons/io";

import axiosInstance from '../axiosInstance'; // Importer axiosInstance

export default function Ventes() {
  const [showModal, setShowModal] = useState(false);
  const [ventes, setVentes] = useState([]);
  const [selectedVente, setSelectedVente] = useState(null);
  const [venteToPrint, setVenteToPrint] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    axiosInstance.get('/produits/ventes/')
      .then(res => {
        console.log('📦 Données reçues:', res.data);
        setVentes(res.data);
      })
      .catch(err => {
        console.error("Erreur lors du chargement des ventes :", err);
        alert("Erreur lors du chargement des ventes. Vérifiez votre token.");
      });
  }, [showModal]);

  const voirDetails = (vente) => {
    setSelectedVente(vente);
  };

  const imprimerFacture = (vente) => {
    setVenteToPrint(vente);
    setTimeout(() => {
      window.print();
      setVenteToPrint(null); // Nettoyage après impression
    }, 300);
  };

  // Logique de recherche
  const filteredVentes = ventes.filter(vente =>
    vente.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    vente.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vente.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vente.user?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='ventes-container'>
      <div className="ventes-header">
        <div className="button-group">
          <button className="btn" onClick={() => setShowModal(true)}>
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

      <div className="table-wrapper">
        <table className="styled-table">
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
                  <td className="table-actions">
                    <button className="modern-button view-btn" onClick={() => voirDetails(vente)}>
                      <FaEye />
                    </button>
                    <button className="modern-button print-btn" onClick={() => imprimerFacture(vente)}>
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

      {/* Modal pour détails */}
      {selectedVente && (
        <DetailsModal
          vente={selectedVente}
          onClose={() => setSelectedVente(null)}
        />
      )}

      {/* Modal pour ajout de vente */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowModal(false)}>
              <div className='rond'><IoMdClose size={20} /></div>
            </button>
            <VenteForm />
          </div>
        </div>
      )}

      {/* Impression avec animation de chargement */}
      {venteToPrint && (
        <div className="print-container loading">
          <div className="loader"></div>
          <FacturePrintable vente={venteToPrint} />
        </div>
      )}
    </div>
  );
}