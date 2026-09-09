import React, { useState, useEffect } from 'react';
import { FaTrash, FaPlus } from 'react-icons/fa';
import { toast } from 'sonner';
import toastStyles from '../pages/toast/toast.js'; // 👈 Importation du style des toasts
import styles from './css/AchatForm.module.css';

export default function AchatForm() {
  const [produitsDisponibles, setProduitsDisponibles] = useState([]);
  const [, setStocks] = useState([]);
  const [achat, setAchat] = useState({
    fournisseur: '',
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

  const handleProduitChange = (index, field, value) => {
    const produits = [...achat.produits];

    if (field === 'categorie') {
      produits[index].categorie = value;
      produits[index].produitId = '';
      produits[index].prix = 0;
    } else if (field === 'produitId') {
      produits[index].produitId = value;
      const produit = produitsDisponibles.find(p => p.id === parseInt(value));
      produits[index].prix = produit ? parseFloat(produit.prix_unitaire) : 0;
    } else if (field === 'quantite') {
      produits[index].quantite = Number(value);
    }

    setAchat({ ...achat, produits });
  };

  const ajouterProduit = () => {
    setAchat({
      ...achat,
      produits: [...achat.produits, { categorie: '', produitId: '', quantite: 1, prix: 0 }],
    });
  };

  const supprimerProduit = (index) => {
    const produits = [...achat.produits];
    produits.splice(index, 1);
    setAchat({ ...achat, produits });
  };

  const calculerTotal = () => {
    return achat.produits.reduce((total, p) => total + p.quantite * p.prix, 0).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('access_token');
    const userId = parseInt(localStorage.getItem('user_id'));

    const achatData = {
      fournisseur: achat.fournisseur,
      user: userId,
      date: new Date().toISOString().slice(0, 10),
      total: parseFloat(calculerTotal()),
      details: achat.produits.map(p => ({
        produit: parseInt(p.produitId),
        quantite: parseFloat(p.quantite),
        prix_unitaire: parseFloat(p.prix),
      })),
    };

    console.log('Achat envoyé :', achatData);

    try {
      const response = await fetch('http://localhost:8000/api/produits/achats/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(achatData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Achat enregistré avec succès !', {
          style: toastStyles.success,
        });
        setAchat({
          fournisseur: '',
          produits: [{ categorie: '', produitId: '', quantite: 1, prix: 0 }],
        });
        await fetchStocks();
      } else {
        console.error('Erreur serveur :', result);
        toast.error(`Erreur: ${result.detail || JSON.stringify(result)}`, {
          style: toastStyles.error,
        });
      }
    } catch (err) {
      console.error('Erreur réseau :', err);
      toast.error('Erreur réseau lors de l\'enregistrement de l\'achat.', {
        style: toastStyles.error,
      });
    }
  };

  const produitsSelectionnes = achat.produits
    .filter(p => p.produitId)
    .map(p => parseInt(p.produitId));

  return (
    <div className={styles['achat-form']}>
      <h2 className={styles['achat-title']}>Nouvel Achat</h2>

      <div className={styles['achat-group']}>
        <label>Fournisseur</label>
        <input
          type="text"
          value={achat.fournisseur}
          onChange={(e) => setAchat({ ...achat, fournisseur: e.target.value })}
          className={styles['achat-input']}
          required
        />
      </div>

      <div className={styles['achat-produits-scrollable']}>
        {achat.produits.map((p, index) => (
          <div className={`${styles['achat-produit-row-custom']} ${styles['produit-fade-in']}`} key={index}>
            <select
              value={p.categorie}
              onChange={(e) => handleProduitChange(index, 'categorie', e.target.value)}
              className={styles['achat-select']}
            >
              <option value="">Catégorie</option>
              {[...new Set(produitsDisponibles.map(prod => prod.categorie_produit_nom))].map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={p.produitId}
              onChange={(e) => handleProduitChange(index, 'produitId', e.target.value)}
              className={styles['achat-select']}
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

            <input
              type="number"
              placeholder="Prix"
              value={p.prix}
              readOnly
              className={styles['achat-input']}
            />

            <input
              type="number"
              placeholder="Quantité"
              min={1}
              value={p.quantite}
              onChange={(e) => handleProduitChange(index, 'quantite', e.target.value)}
              className={styles['achat-input']}
            />

            <button className={styles['achat-suppr-btn']} onClick={() => supprimerProduit(index)}>
              <FaTrash />
            </button>
          </div>
        ))}
      </div>

      <button className={`${styles['achat-btn-outline']} ${styles.success}`} onClick={ajouterProduit}>
        <FaPlus /> Ajouter une ligne
      </button>

      <div className={styles['achat-total']}>
        <strong>Total : {calculerTotal()} Ar</strong>
      </div>

      <button className={`${styles['achat-btn-primary']} ${styles.full}`} onClick={handleSubmit}>
        Enregistrer l'achat
      </button>
    </div>
  );
}