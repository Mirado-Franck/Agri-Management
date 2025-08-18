import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import styles from './css/ProduitFormEdit.module.css';
import Select from 'react-select';

const ProduitFormEdit = ({ produit, onClose, onRefreshProduits }) => {
  const [formData, setFormData] = useState({
    nom_produit: '',
    categorie_produit: '',
    unite: '',
    prix_unitaire: '',
    seuil_alerte: ''
  });

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await fetch('http://127.0.0.1:8000/api/produits/categories/');
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        if (produit) {
          setFormData({
            nom_produit: produit.nom_produit,
            categorie_produit: produit.categorie_produit,
            unite: produit.unite,
            prix_unitaire: produit.prix_unitaire,
            seuil_alerte: produit.seuil_alerte
          });
        }
      } catch (err) {
        console.error("❌ Erreur chargement données:", err);
        toast.error("Erreur lors du chargement des données");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [produit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nom_produit || parseFloat(formData.prix_unitaire) <= 0) {
      toast.warning("Veuillez vérifier les champs requis");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/produits/produits/${produit.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom_produit: formData.nom_produit,
          categorie_produit: parseInt(formData.categorie_produit),
          unite: formData.unite,
          prix_unitaire: formData.prix_unitaire,
          seuil_alerte: formData.seuil_alerte
        })
      });

      if (response.ok) {
        toast.success("✅ Produit modifié avec succès !");
        if (onRefreshProduits) onRefreshProduits();
        if (onClose) onClose();
      } else {
        const errorData = await response.json();
        console.error("❌ Erreur modification:", errorData);
        toast.error(`Échec de la modification: ${errorData.detail || 'Erreur inconnue'}`);
      }
    } catch (error) {
      console.error("⚠️ Erreur réseau:", error);
      toast.error("Erreur de connexion au serveur");
    }
  };

  if (isLoading) return <div className="loading">Chargement...</div>;

  return (
    <form className={styles['form-container']} onSubmit={handleSubmit}>
      <h2>Modifier le produit</h2>

      <div className={styles['form-group']}>
        <input
          type="text"
          name="nom_produit"
          className={styles['form-input']}
          value={formData.nom_produit}
          onChange={handleChange}
          required
        />
        <label className={styles['form-label']}>Nom</label>
      </div>

      <div className={styles['form-group']}>
        <label className={styles['form-label']}>Catégorie</label>
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
        />
      </div>

      <div className={styles['form-group']}>
        <input
          type="text"
          name="unite"
          className={styles['form-input']}
          value={formData.unite}
          onChange={handleChange}
          required
        />
        <label className={styles['form-label']}>Unité</label>
      </div>

      <div className={styles['form-group']}>
        <input
          type="number"
          name="prix_unitaire"
          className={styles['form-input']}
          value={formData.prix_unitaire}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
        />
        <label className={styles['form-label']}>Prix unitaire</label>
      </div>

      <div className={styles['form-group']}>
        <input
          type="number"
          name="seuil_alerte"
          className={styles['form-input']}
          value={formData.seuil_alerte}
          onChange={handleChange}
          required
          min="0"
        />
        <label className={styles['form-label']}>Seuil minimum</label>
      </div>

      <div className={styles['form-actions']}>
        {/* <button type="button" className={styles['cancel-btn']} onClick={onClose}>
          Annuler
        </button> */}
        <button type="submit" className={styles['submit-btn']}>
          Enregistrer
        </button>
      </div>
    </form>
  );
};

export default ProduitFormEdit;
