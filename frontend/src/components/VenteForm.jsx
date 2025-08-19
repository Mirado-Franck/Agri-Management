import React, { useState, useEffect } from 'react';
import { FaTrash, FaPlus } from 'react-icons/fa';
import styles from './css/VenteForm.module.css'; // ✅ Import du CSS module

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
    const interval = setInterval(() => {
      fetchStocks();
      fetchProduits();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchProduits = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/produits/produits/');
      const data = await res.json();
      setProduitsDisponibles(data);
    } catch (err) {
      console.error('❌ Erreur chargement produits', err);
    }
  };

  const fetchStocks = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/produits/stocks/');
      const data = await res.json();
      setStocks(data);
    } catch (err) {
      console.error('❌ Erreur chargement stocks', err);
    }
  };

  const updateStocksAfterSale = async (details) => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch('http://localhost:8000/api/produits/stocks/update/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ details }),
      });
      if (!response.ok) {
        console.error('🛑 Erreur update stocks');
      }
    } catch (err) {
      console.error('🛑 Erreur réseau update stocks', err);
    }
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
      produits[index].quantite = 1;
    } else if (field === 'quantite') {
      const quantite = Number(value);
      const produit = produitsDisponibles.find(p => p.id === parseInt(produits[index].produitId));
      const stock = stocks.find(s => s.produit === parseInt(produits[index].produitId));
      if (stock && quantite > stock.quantite) {
        alert(`⚠️ Stock insuffisant pour ${produit?.nom_produit}. Quantité disponible : ${stock.quantite}`);
        return;
      }
      produits[index].quantite = quantite;
    }

    setVente({ ...vente, produits });
  };

  const ajouterProduit = () => {
    setVente({
      ...vente,
      produits: [...vente.produits, { categorie: '', produitId: '', quantite: 1, prix: 0 }],
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

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        alert('✅ Vente enregistrée !');
        await updateStocksAfterSale(venteData.details);
        setVente({
          client: '',
          produits: [{ categorie: '', produitId: '', quantite: 1, prix: 0 }],
        });
        await fetchStocks();
        await fetchProduits();
      } else {
        console.error('🛑 Erreur serveur :', result);
        alert(`Erreur: ${JSON.stringify(result)}`);
      }
    } catch (err) {
      console.error('🛑 Erreur réseau :', err);
      alert('Erreur réseau lors de l\'enregistrement de la vente.');
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
          const stock = stocks.find(s => s.produit === parseInt(p.produitId));
          return (
            <div className={`${styles['vente-produit-row-custom']} ${styles['produit-fade-in']}`} key={index}>
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
                  .map((prod) => {
                    const stockProd = stocks.find(s => s.produit === prod.id);
                    return (
                      <option key={prod.id} value={prod.id}>
                        {prod.nom_produit} (Stock: {stockProd ? stockProd.quantite : 0})
                      </option>
                    );
                  })}
              </select>

              <input
                type="number"
                placeholder="Prix"
                value={p.prix}
                readOnly
                className={styles['vente-input']}
              />

              <input
                type="number"
                placeholder="Quantité"
                min={1}
                max={stock ? stock.quantite : 1}
                value={p.quantite}
                onChange={(e) => handleProduitChange(index, 'quantite', e.target.value)}
                className={styles['vente-input']}
              />

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
        <strong>Total : {calculerTotal()} €</strong>
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
