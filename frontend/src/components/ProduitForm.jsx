import React, { useState, useEffect } from 'react';
import { toast } from 'sonner'; // ✅ Remplace react-toastify
import './css/ProduitForm.css';

const ProduitForm = ({ onClose, onRefreshProduits }) => {
  const [formData, setFormData] = useState({
    nom_produit: '',
    categorie_produit: '',
    unite: '',
    prix_unitaire: '',
    seuil_alerte: ''
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/produits/categories/')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => {
        console.error("❌ Erreur catégories :", err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.nom_produit ||
      !formData.categorie_produit ||
      !formData.unite ||
      parseFloat(formData.prix_unitaire) <= 0 ||
      parseFloat(formData.seuil_alerte) < 0
    ) {
      toast.warning("Veuillez remplir tous les champs correctement.");
      return;
    }

    const payload = {
      nom_produit: formData.nom_produit,
      categorie_produit: parseInt(formData.categorie_produit),
      unite: formData.unite,
      prix_unitaire: formData.prix_unitaire,
      seuil_alerte: formData.seuil_alerte
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/produits/produits/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success("✅ Produit ajouté avec succès !");
        setFormData({
          nom_produit: '',
          categorie_produit: '',
          unite: '',
          prix_unitaire: '',
          seuil_alerte: ''
        });

        if (onRefreshProduits) onRefreshProduits();
        if (onClose) onClose();
      } else {
        const err = await response.json();
        console.error("❌ Erreur API :", err);
        toast.error("Une erreur est survenue lors de l'ajout.");
      }
    } catch (error) {
      console.error("⚠️ Erreur réseau :", error);
      toast.error("Erreur de connexion au serveur.");
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>Ajouter un produit</h2>

      <div className="form-group">
        <input type="text" name="nom_produit" className="form-input" placeholder=" " value={formData.nom_produit} onChange={handleChange} required />
        <label className="form-label">Nom</label>
      </div>

      <div className="form-group">
        <select name="categorie_produit" className="form-input" value={formData.categorie_produit} onChange={handleChange} required>
          <option value="" disabled hidden>Choisir une catégorie</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.nom}</option>
          ))}
        </select>
        <label className="form-label">Catégorie</label>
      </div>

      <div className="form-group">
        <input type="text" name="unite" className="form-input" placeholder=" " value={formData.unite} onChange={handleChange} required />
        <label className="form-label">Unité</label>
      </div>

      <div className="form-group">
        <input type="number" name="prix_unitaire" className="form-input" placeholder=" " value={formData.prix_unitaire} onChange={handleChange} required min="0" />
        <label className="form-label">Prix unitaire</label>
      </div>

      <div className="form-group">
        <input type="number" name="seuil_alerte" className="form-input" placeholder=" " value={formData.seuil_alerte} onChange={handleChange} required min="0" />
        <label className="form-label">Seuil minimum</label>
      </div>

      <button className="submit-btn">Envoyer</button>
    </form>
  );
};

export default ProduitForm;
