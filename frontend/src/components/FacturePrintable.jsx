import React from 'react';
import './css/FacturePrintable.css';

const FacturePrintable = React.forwardRef(({ vente }, ref) => {
  if (!vente) return null;

  return (
    <div className="facture-container" ref={ref}>
      <div className="facture-header">
        <h1>Facture</h1>
        <div>
          <strong>Vente N°:</strong> {vente.id}<br />
          <strong>Date:</strong> {vente.date}<br />
        </div>
      </div>

      <div className="facture-client">
        <strong>Client:</strong> {vente.client}<br />
        <strong>Employé:</strong> {vente.user?.username || '—'}
      </div>

      <div className="facture-details">
        <table>
          <thead>
            <tr>
              <th>Produit</th>
              <th>Quantité</th>
              <th>Prix unitaire</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {vente.details?.map((item, idx) => (
              <tr key={idx}>
                <td>{item.produit_nom}</td>
                <td>{item.quantite}</td>
                <td>{item.prix_unitaire} Ar</td>
                <td>{item.sous_total} Ar</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="facture-total">
        <strong>Total à payer:</strong> {vente.total.toFixed(2)} Ar
      </div>

      <div className="facture-footer">
        <p>Merci pour votre achat !</p>
      </div>
    </div>
  );
});

export default FacturePrintable;
