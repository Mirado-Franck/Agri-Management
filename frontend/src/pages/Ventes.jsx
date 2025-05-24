import React, { useState, useEffect, useRef } from 'react';
import './css/Ventes.css';

import { useReactToPrint } from 'react-to-print';
import FacturePrintable from '../components/FacturePrintable';

import Searchbar from '../components/Searchbar';
import VenteForm from '../components/VenteForm';
import DetailsModal from '../components/DetailsModal';

import { FaEye, FaPlus } from "react-icons/fa";
import { PiPrinter } from "react-icons/pi";
import { IoMdClose } from "react-icons/io";

// ... (imports inchangés)
export default function Ventes() {
  const [showModal, setShowModal] = useState(false);
  const [ventes, setVentes] = useState([]);
  const [selectedVente, setSelectedVente] = useState(null);
  const [venteToPrint, setVenteToPrint] = useState(null);

  const factureRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => factureRef.current,
  });

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/produits/ventes/', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log('📦 Données reçues:', data);
        setVentes(data);
      })
      .catch(err => {
        console.error("Erreur lors du chargement des ventes :", err);
        alert("Erreur lors du chargement des ventes. Vérifiez votre token.");
      });
  }, [showModal]);

  // 💡 Déclenchement de l'impression quand le composant est prêt
  useEffect(() => {
    if (venteToPrint) {
      setTimeout(() => {
        handlePrint();
      }, 200); // petit délai pour s'assurer que le DOM est prêt
    }
  }, [venteToPrint]);

  const voirDetails = (vente) => {
    setSelectedVente(vente);
  };

  return (
    <div className='ventes-container'>
      <div className="ventes-header">
        <div className="button-group">
          <button className="btn" onClick={() => setShowModal(true)}>
            <FaPlus />
          </button>
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
              <th>N° du vente</th>
              <th>Date du vente</th>
              <th>Client</th>
              <th>Montant total</th>
              <th>Employé</th>
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ventes.length > 0 ? (
              ventes.map((vente, i) => (
                <tr key={vente.id}>
                  <td>{i + 1}</td>
                  <td>{vente.id}</td>
                  <td>{vente.date}</td>
                  <td>{vente.client}</td>
                  <td>{vente.total.toFixed(2)} Ar</td>
                  <td>{vente.user?.username || '—'}</td>
                  <td className="table-actions">
                    <button
                      className="modern-button view-btn"
                      onClick={() => voirDetails(vente)}
                    >
                      <FaEye />
                    </button>
                    <button
                      className="modern-button print-btn"
                      onClick={() => {
                        setSelectedVente(vente);
                        setTimeout(() => {
                          handlePrint();
                        }, 100); // petite pause pour laisser le DOM se mettre à jour
                      }}
                    >
                      <PiPrinter />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>
                  Aucune vente disponible.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL POUR LES DÉTAILS */}
      {selectedVente && (
        <DetailsModal
          vente={selectedVente}
          onClose={() => setSelectedVente(null)}
        />
      )}

      {/* MODAL DE CRÉATION DE VENTE */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowModal(false)}>
              <div className='rond'>
                <IoMdClose size={20} />
              </div>
            </button>
            <VenteForm />
          </div>
        </div>
      )}

      {/* Facture invisible utilisée uniquement pour impression */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        {selectedVente && <FacturePrintable ref={factureRef} vente={selectedVente} />}
      </div>

    </div>
  );
}

