import React from 'react';
import './css/ProduitForm.css';

const ProduitForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault(); // Empêche le rafraîchissement de la page
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <div className="form-group">
        <h2>Nouvelle produit</h2>
      </div>

      <div className="form-group">
        <input
          type="text"
          name="nom"
          placeholder=" "
          className="form-input"
        />
        <label className="form-label">Nom</label>
      </div>

      <div className="form-group">
        <select
          name="categorie"
          className="form-input"
        >
          <option value="" disabled hidden></option>
          <option value="Alimentaire">Alimentaire</option>
          <option value="Électronique">Électronique</option>
          <option value="Textile">Textile</option>
          <option value="Autre">Autre</option>
        </select>
        <label className="form-label">Catégorie</label>
      </div>

      <div className="form-group">
        <input
          type="text"
          name="unite"
          placeholder=" "
          className="form-input"
        />
        <label className="form-label">Unité</label>
      </div>

      <div className="form-group">
        <input
          type="number"
          name="prix"
          placeholder=" "
          className="form-input"
        />
        <label className="form-label">Prix unitaire</label>
      </div>

      <div className="form-group">
        <input
          type="number"
          name="prix"
          placeholder=" "
          className="form-input"
        />
        <label className="form-label">Seuil Minimum</label>
      </div>

      <button className="submit-btn">Envoyer</button>
    </form>
  );
};

export default ProduitForm;
