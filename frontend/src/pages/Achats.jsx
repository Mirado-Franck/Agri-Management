import React, { useState, useEffect } from 'react';
import './css/Achats.css';

import Searchbar from '../components/Searchbar';
import AchatForm from '../components/AchatForm';

import { FaEye, FaPlus } from "react-icons/fa";
import { PiPrinter } from "react-icons/pi";
import { IoMdClose } from "react-icons/io";

import axiosInstance from '../axiosInstance'; // ✅

export default function Achats() {
  const [showModal, setShowModal] = useState(false);
  const [achats, setAchats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axiosInstance.get('/produits/achats/')
      .then(res => {
        console.log('📦 Achats reçus :', res.data);
        setAchats(res.data);
      })
      .catch(err => {
        console.error("❌ Erreur lors du chargement des achats :", err);
        alert("Erreur lors du chargement des achats. Vérifiez votre token.");
      });
  }, [showModal]); // Se recharge après chaque ajout

  const filteredAchats = achats.filter(achat =>
    achat.id.toString().includes(searchTerm.toLowerCase()) ||
    achat.fournisseur?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    achat.date?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    achat.user?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="achats-container">
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
              <th>N° d'achat</th>
              <th>Date d'achat</th>
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
                  <td>ACH-{achat.id.toString().padStart(4, '0')}</td>
                  <td>{achat.date}</td>
                  <td>{achat.fournisseur}</td>
                  <td>{achat.total?.toFixed(2)} Ar</td>
                  <td>{achat.user?.username || '—'}</td>
                  <td className="table-actions">
                    <button className="modern-button view-btn">
                      <FaEye />
                    </button>
                    <button className="modern-button print-btn">
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

      {/* ✅ Modal flottante */}
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
    </div>
  );
}
