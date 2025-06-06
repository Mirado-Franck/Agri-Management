import React from 'react';
import './css/FacturePrintable.css';

const FacturePrintable = React.forwardRef(({ vente }, ref) => {
  if (!vente) return null;

  return (
    <div className="facture-container" ref={ref}>
      {/* Copie client */}
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
                <td>{item.produit_nom || item.produit.nom_produit || '—'}</td>
                <td>{item.quantite}</td>
                <td>{item.prix_unitaire} Ar</td>
                <td>{(item.quantite * item.prix_unitaire).toFixed(2)} Ar</td>
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

      {/* Ligne de séparation ✂️ */}
      <div className="facture-separation"></div>

      {/* Partie duplicata / copie magasin */}
      <div className="facture-footer">
        <p><em>Copie magasin - à archiver</em></p>
      </div>
    </div>
  );
});

export default FacturePrintable;
