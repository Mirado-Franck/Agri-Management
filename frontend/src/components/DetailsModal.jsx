// src/components/DetailsModal.jsx
import React from 'react';
import './css/DetailsModal.css'; // à créer pour le style si besoin
import { IoMdClose } from "react-icons/io";

export default function DetailsModal({ vente, onClose }) {
  if (!vente) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          <div className='rond'><IoMdClose size={20} /></div>
        </button>

        <h3>Détails de la vente #{vente.id}</h3>
        <p><strong>Date :</strong> {vente.date}</p>
        <p><strong>Client :</strong> {vente.client}</p>
        <p><strong>Employé :</strong> {vente.user?.username || '---'}</p>

        <table className="details-table">
          <thead>
            <tr>
              <th>Produit</th>
              <th>Quantité</th>
              <th>Prix unitaire</th>
              <th>Sous-total</th>
            </tr>
          </thead>
          <tbody>
            {vente.details.map((d, i) => (
              <tr key={i}>
                <td>{d.produit_nom || d.produit}</td>
                <td>{d.quantite}</td>
                <td>{d.prix_unitaire} Ar</td>
                <td>{(d.quantite * d.prix_unitaire).toFixed(2)} €</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p><strong>Total :</strong> {vente.total} Ar</p>
      </div>
    </div>
  );
}