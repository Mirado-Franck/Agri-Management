import React from 'react';
import './css/FacturePrintable.css';

const FacturePrintableAchat = React.forwardRef(({ achat }, ref) => {
  if (!achat) return null;

  return (
    <div className="facture-container" ref={ref}>
      {/* Copie fournisseur */}
      <div className="facture-header">
        <h1>Facture d'achat</h1>
        <div>
          <strong>Achat N°:</strong> {achat.id}<br />
          <strong>Date:</strong> {achat.date}<br />
        </div>
      </div>

      <div className="facture-client">
        <strong>Fournisseur:</strong> {achat.fournisseur}<br />
        <strong>Employé:</strong> {achat.user?.username || '—'}
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
            {achat.details?.map((item, idx) => (
              <tr key={idx}>
                <td>{item.nom_produit || '—'}</td>
                <td>{item.quantite}</td>
                <td>{item.prix_unitaire} Ar</td>
                <td>{(item.quantite * item.prix_unitaire).toFixed(2)} Ar</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="facture-total">
        <strong>Total payé:</strong> {achat.total.toFixed(2)} Ar
      </div>

      <div className="facture-footer">
        <p>Merci pour votre collaboration !</p>
      </div>

      {/* Ligne de séparation */}
      <div className="facture-separation"></div>

      {/* Copie magasin */}
      <div className="facture-footer">
        <p><em>Copie magasin - à archiver</em></p>
      </div>
    </div>
  );
});

export default FacturePrintableAchat;