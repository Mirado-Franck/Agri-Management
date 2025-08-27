import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import styles from './css/ProduitForm.module.css';
import Select from 'react-select';

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
        console.error("Erreur catégories :", err);
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
        toast.success("Produit ajouté avec succès !");
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
        console.error("Erreur API :", err);
        toast.error("Une erreur est survenue lors de l'ajout.");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      toast.error("Erreur de connexion au serveur.");
    }
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <h2>Ajouter un produit</h2>

      <div className={styles.formGroup}>
        <input
          type="text"
          name="nom_produit"
          className={styles.formInput}
          placeholder=" "
          value={formData.nom_produit}
          onChange={handleChange}
          required
        />
        <label className={styles.formLabel}>Nom</label>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.selectLabel}>Catégorie</label>
        <Select
          options={categories.map(cat => ({ value: cat.id, label: cat.nom }))}
          classNamePrefix="react-select"
          placeholder="Choisir une catégorie"
          onChange={(selectedOption) =>
            setFormData(prev => ({
              ...prev,
              categorie_produit: selectedOption ? selectedOption.value : ''
            }))
          }
          value={categories
            .map(cat => ({ value: cat.id, label: cat.nom }))
            .find(opt => opt.value === parseInt(formData.categorie_produit))}
          isClearable
          styles={customSelectStyles}
        />
      </div>

      <div className={styles.formGroup}>
        <input
          type="text"
          name="unite"
          className={styles.formInput}
          placeholder=" "
          value={formData.unite}
          onChange={handleChange}
          required
        />
        <label className={styles.formLabel}>Unité</label>
      </div>

      <div className={styles.formGroup}>
        <input
          type="number"
          name="prix_unitaire"
          className={styles.formInput}
          placeholder=" "
          value={formData.prix_unitaire}
          onChange={handleChange}
          required
          min="0"
        />
        <label className={styles.formLabel}>Prix unitaire</label>
      </div>

      <div className={styles.formGroup}>
        <input
          type="number"
          name="seuil_alerte"
          className={styles.formInput}
          placeholder=" "
          value={formData.seuil_alerte}
          onChange={handleChange}
          required
          min="0"
        />
        <label className={styles.formLabel}>Seuil minimum</label>
      </div>

      <button className={styles.submitBtn}>Envoyer</button>
    </form>
  );
};

// Styles personnalisés pour react-select avec support dark mode
const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: 'var(--form-bg)',
    borderColor: state.isFocused ? 'var(--form-border-focus)' : 'var(--form-border)',
    boxShadow: state.isFocused ? '0 0 0 1px var(--form-border-focus)' : 'none',
    '&:hover': {
      borderColor: 'var(--form-border-hover)'
    },
    minHeight: '48px'
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: 'var(--form-bg)',
    border: '1px solid var(--form-border)'
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? 'var(--form-option-hover)' : 'var(--form-bg)',
    color: 'var(--form-text)',
    '&:active': {
      backgroundColor: 'var(--form-option-active)'
    }
  }),
  singleValue: (base) => ({
    ...base,
    color: 'var(--form-text)'
  }),
  placeholder: (base) => ({
    ...base,
    color: 'var(--form-placeholder)'
  }),
  input: (base) => ({
    ...base,
    color: 'var(--form-text)'
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: 'var(--form-text)'
  }),
  clearIndicator: (base) => ({
    ...base,
    color: 'var(--form-text)'
  }),
  indicatorSeparator: (base) => ({
    ...base,
    backgroundColor: 'var(--form-border)'
  })
};

export default ProduitForm;