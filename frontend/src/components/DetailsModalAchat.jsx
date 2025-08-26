import React from 'react';
import './css/DetailsModal.css'; // Réutilise le même CSS que DetailsModalVente
import { IoMdClose } from "react-icons/io";

export default function DetailsModalAchat({ achat, onClose }) {
  if (!achat) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          <div className='rond'><IoMdClose size={20} /></div>
        </button>

        <h3>Détails de l'achat #{achat.id}</h3>
        <p><strong>Date :</strong> {achat.date}</p>
        <p><strong>Fournisseur :</strong> {achat.fournisseur}</p>
        <p><strong>Employé :</strong> {achat.user?.username || '---'}</p>

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
            {achat.details.map((d, i) => (
              <tr key={i}>
                <td>{d.nom_produit || '---'}</td>
                <td>{d.quantite}</td>
                <td>{d.prix_unitaire} Ar</td>
                <td>{(d.quantite * d.prix_unitaire).toFixed(2)} Ar</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p><strong>Total :</strong> {achat.total.toFixed(2)} Ar</p>
      </div>
    </div>
  );
}