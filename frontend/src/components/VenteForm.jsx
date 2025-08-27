import React, { useState, useEffect } from 'react';
import { FaTrash, FaPlus } from 'react-icons/fa';
import { toast } from 'sonner';
import toastStyles from '../pages/toast/toast.js'; // 👈 Importation du style des toasts
import styles from './css/VenteForm.module.css';

export default function VenteForm() {
  const [produitsDisponibles, setProduitsDisponibles] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [vente, setVente] = useState({
    client: '',
    produits: [{ categorie: '', produitId: '', quantite: 1, prix: 0 }],
  });

  useEffect(() => {
    fetchProduits();
    fetchStocks();
  }, []);

  const fetchProduits = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/produits/produits/');
      const data = await res.json();
      setProduitsDisponibles(data);
    } catch (err) {
      console.error('Erreur chargement produits', err);
    }
  };

  const fetchStocks = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/produits/stocks/');
      const data = await res.json();
      setStocks(data);
    } catch (err) {
      console.error('Erreur chargement stocks', err);
    }
  };

  // Helper : récupère l'objet stock pour un produit (essayes ID puis nom)
  const getStockObjForProduct = (produitId) => {
    const prodId = parseInt(produitId);
    const byId = stocks.find(s => Number(s.produit) === prodId);
    if (byId) return byId;

    const produitSel = produitsDisponibles.find(p => p.id === prodId);
    if (!produitSel) return undefined;

    const byName = stocks.find(s => s.produit_nom === produitSel.nom_produit);
    return byName;
  };

  // Helper : récupère la quantité disponible (stocks -> puis fallback quantite_en_stock)
  const getQuantiteDispo = (produitId) => {
    const stockObj = getStockObjForProduct(produitId);
    if (stockObj && typeof stockObj.quantite === 'number') return stockObj.quantite;

    const prod = produitsDisponibles.find(p => p.id === parseInt(produitId));
    if (prod && typeof prod.quantite_en_stock === 'number') return prod.quantite_en_stock;

    return 0;
  };

  const handleProduitChange = (index, field, value) => {
    const produits = [...vente.produits];

    if (field === 'categorie') {
      produits[index].categorie = value;
      produits[index].produitId = '';
      produits[index].prix = 0;
      produits[index].quantite = 1;
    } else if (field === 'produitId') {
      produits[index].produitId = value;
      const produit = produitsDisponibles.find(p => p.id === parseInt(value));
      produits[index].prix = produit ? parseFloat(produit.prix_unitaire) : 0;
      produits[index].quantite = 1; // reset
    } else if (field === 'quantite') {
      const saisie = Number(value);
      const produitId = produits[index].produitId;
      const produitSel = produitsDisponibles.find(p => p.id === parseInt(produitId));
      const stockDispo = getQuantiteDispo(produitId);

      if (!produitId) {
        toast.error('Veuillez choisir un produit avant de saisir une quantité.', {
          style: toastStyles.error,
        });
        return;
      }

      if (!Number.isFinite(saisie) || saisie < 1) {
        produits[index].quantite = 1;
      } else if (saisie > stockDispo) {
        toast.error(`Stock insuffisant pour ${produitSel?.nom_produit}. Disponible : ${stockDispo}`, {
          style: toastStyles.error,
        });
        produits[index].quantite = stockDispo; // blocage au max
      } else {
        produits[index].quantite = saisie;
      }
    }

    setVente({ ...vente, produits });
  };

  const ajouterProduit = () => {
    setVente(v => ({
      ...v,
      produits: [...v.produits, { categorie: '', produitId: '', quantite: 1, prix: 0 }],
    }));
  };

  const supprimerProduit = (index) => {
    const produits = [...vente.produits];
    produits.splice(index, 1);
    setVente({ ...vente, produits });
  };

  const calculerTotal = () =>
    vente.produits.reduce((total, p) => total + (Number(p.quantite) * Number(p.prix || 0)), 0).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation "anti-dépassement" juste avant envoi
    for (const p of vente.produits) {
      const qMax = getQuantiteDispo(p.produitId);
      if (!p.produitId) {
        toast.error('Veuillez choisir un produit dans chaque ligne.', {
          style: toastStyles.error,
        });
        return;
      }
      if (p.quantite > qMax) {
        toast.error('Certaines quantités dépassent le stock disponible. Corrigez-les avant d\'enregistrer.', {
          style: toastStyles.error,
        });
        return;
      }
    }

    const token = localStorage.getItem('access_token');
    const userId = parseInt(localStorage.getItem('user_id'));

    const venteData = {
      client: vente.client,
      user: userId,
      date: new Date().toISOString().slice(0, 10),
      total: parseFloat(calculerTotal()),
      details: vente.produits.map(p => ({
        produit: parseInt(p.produitId),
        quantite: parseFloat(p.quantite),
        prix_unitaire: parseFloat(p.prix),
      })),
    };

    try {
      const response = await fetch('http://localhost:8000/api/produits/ventes/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(venteData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Vente enregistrée avec succès !', {
          style: toastStyles.success,
        });
        setVente({
          client: '',
          produits: [{ categorie: '', produitId: '', quantite: 1, prix: 0 }],
        });
        await fetchStocks();     // pour refléter la baisse de stock
        await fetchProduits();   // si tu affiches quantite_en_stock côté produits
      } else {
        console.error('Erreur serveur :', result);
        toast.error(`Erreur: ${result.detail || JSON.stringify(result)}`, {
          style: toastStyles.error,
        });
      }
    } catch (err) {
      console.error('Erreur réseau :', err);
      toast.error('Erreur réseau lors de l\'enregistrement de la vente.', {
        style: toastStyles.error,
      });
    }
  };

  const produitsSelectionnes = vente.produits
    .filter(p => p.produitId)
    .map(p => parseInt(p.produitId));

  return (
    <div className={styles['vente-form']}>
      <h2 className={styles['vente-title']}>Nouvelle Vente</h2>

      <div className={styles['vente-group']}>
        <label>Client</label>
        <input
          type="text"
          value={vente.client}
          onChange={(e) => setVente({ ...vente, client: e.target.value })}
          className={styles['vente-input']}
          required
        />
      </div>

      <div className={styles['vente-produits-scrollable']}>
        {vente.produits.map((p, index) => {
          const produitSel = produitsDisponibles.find(prod => prod.id === parseInt(p.produitId));
          const stockObj = getStockObjForProduct(p.produitId);
          const qMax = stockObj?.quantite ?? produitSel?.quantite_en_stock ?? 1;

          return (
            <div className={`${styles['vente-produit-row-custom']} ${styles['produit-fade-in']}`} key={index}>
              {/* Catégorie */}
              <select
                value={p.categorie}
                onChange={(e) => handleProduitChange(index, 'categorie', e.target.value)}
                className={styles['vente-select']}
              >
                <option value="">Catégorie</option>
                {[...new Set(produitsDisponibles.map(prod => prod.categorie_produit_nom))].map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {/* Produit */}
              <select
                value={p.produitId}
                onChange={(e) => handleProduitChange(index, 'produitId', e.target.value)}
                className={styles['vente-select']}
                disabled={!p.categorie}
              >
                <option value="">Produit</option>
                {produitsDisponibles
                  .filter(prod => prod.categorie_produit_nom === p.categorie)
                  .filter(prod => !produitsSelectionnes.includes(prod.id) || prod.id === parseInt(p.produitId))
                  .map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.nom_produit}
                    </option>
                  ))}
              </select>

              {/* Prix unitaire */}
              <input
                type="number"
                placeholder="Prix"
                value={p.prix}
                readOnly
                className={styles['vente-input']}
              />

              {/* Quantité (max dynamique) */}
              <input
                type="number"
                placeholder={`Quantité (Stock: ${Number(qMax) || 0})`}
                min={1}
                max={Math.max(1, Number(qMax))}
                value={p.quantite}
                onChange={(e) => handleProduitChange(index, 'quantite', e.target.value)}
                className={styles['vente-input']}
              />

              {/* Supprimer ligne */}
              <button
                className={styles['vente-suppr-btn']}
                onClick={() => supprimerProduit(index)}
              >
                <FaTrash />
              </button>
            </div>
          );
        })}
      </div>

      <button
        className={`${styles['vente-btn-outline']} ${styles.success}`}
        onClick={ajouterProduit}
      >
        <FaPlus /> Ajouter une ligne
      </button>

      <div className={styles['vente-total']}>
        <strong>Total : {calculerTotal()} Ar</strong>
      </div>

      <button
        className={`${styles['vente-btn-primary']} ${styles.full}`}
        onClick={handleSubmit}
      >
        Enregistrer la vente
      </button>
    </div>
  );
}