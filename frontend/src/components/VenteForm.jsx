import React, { useState } from 'react';
import './css/VenteForm.css';
import { FaTrash, FaPlus } from 'react-icons/fa';

export default function VenteForm() {
  const [vente, setVente] = useState({
    produits: [{ categorie: '', nom: '', quantite: 1, prix: 0 }],
    remarques: ''
  });

  const categories = ['Céréales', 'Fruits', 'Légumes'];
  const produitsFictifs = {
    Céréales: ['Maïs', 'Riz'],
    Fruits: ['Mangue', 'Banane'],
    Légumes: ['Carotte', 'Tomate']
  };

  const handleProduitChange = (index, field, value) => {
    const produits = [...vente.produits];
    produits[index][field] = field === 'quantite' || field === 'prix' ? Number(value) : value;

    if (field === 'categorie') produits[index].nom = '';
    if (field === 'nom') produits[index].prix = Math.floor(Math.random() * 100) + 1;

    setVente({ ...vente, produits });
  };

  const ajouterProduit = () => {
    setVente({
      ...vente,
      produits: [...vente.produits, { categorie: '', nom: '', quantite: 1, prix: 0 }]
    });
  };

  const supprimerProduit = (index) => {
    const produits = [...vente.produits];
    produits.splice(index, 1);
    setVente({ ...vente, produits });
  };

  const calculerTotal = () => {
    return vente.produits.reduce((total, p) => total + p.quantite * p.prix, 0).toFixed(2);
  };

  return (
    <div className="vente-form">
      <h2 className="vente-title">Nouvelle Vente</h2>

      {/* Conteneur scrollable pour les produits */}
      <div className="vente-produits-scrollable">
        {vente.produits.map((produit, index) => (
          <div className="vente-produit-row-custom produit-fade-in" key={index}>
            <select
              value={produit.categorie}
              onChange={(e) => handleProduitChange(index, 'categorie', e.target.value)}
              className="vente-select"
            >
              <option value="">Catégorie</option>
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={produit.nom}
              onChange={(e) => handleProduitChange(index, 'nom', e.target.value)}
              className="vente-select"
              disabled={!produit.categorie}
            >
              <option value="">Produit</option>
              {(produitsFictifs[produit.categorie] || []).map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Prix"
              value={produit.prix}
              readOnly
              className="vente-input"
            />

            <input
              type="number"
              placeholder="Quantité"
              min={1}
              value={produit.quantite}
              onChange={(e) => handleProduitChange(index, 'quantite', e.target.value)}
              className="vente-input"
            />

            <button className="vente-suppr-btn" onClick={() => supprimerProduit(index)}>
              <FaTrash />
            </button>
          </div>
        ))}
      </div>

      <button className="vente-btn-outline success" onClick={ajouterProduit}>
        <FaPlus /> Ajouter une ligne
      </button>

      <div className="vente-total">
        <strong>Total : {calculerTotal()} €</strong>
      </div>

      <div className="vente-group">
        <label>Remarques</label>
        <textarea
          rows="3"
          value={vente.remarques}
          onChange={(e) => setVente({ ...vente, remarques: e.target.value })}
        ></textarea>
      </div>

      <button className="vente-btn-primary full">Enregistrer la vente</button>
    </div>
  );
}
