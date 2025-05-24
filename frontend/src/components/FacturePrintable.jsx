// src/components/FacturePrintable.jsx
import React from 'react';
import './css/FacturePrintable.css';

export default function FacturePrintable({ vente }) {
  return (
    <div className="facture-container">
      <h2 className="facture-title">Facture</h2>
      <p><strong>Date:</strong> {vente.date}</p>
      <p><strong>Client:</strong> {vente.client}</p>
      <p><strong>Employé:</strong> {vente.user?.username}</p>

      <table className="facture-table">
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
              <td>{d.produit_nom}</td>
              <td>{d.quantite}</td>
              <td>{d.prix_unitaire} Ar</td>
              <td>{(d.quantite * d.prix_unitaire).toFixed(2)} Ar</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="facture-total">
        <strong>Total : {vente.total.toFixed(2)} Ar</strong>
      </div>
    </div>
  );
}
