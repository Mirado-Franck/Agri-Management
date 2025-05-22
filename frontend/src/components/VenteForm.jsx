import React, { useState, useEffect } from 'react';
import './css/VenteForm.css';
import { FaTrash, FaPlus } from 'react-icons/fa';

export default function VenteForm() {
  const [produitsDisponibles, setProduitsDisponibles] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [vente, setVente] = useState({
    client: '',
    produits: [{ categorie: '', produitId: '', quantite: 1, prix: 0 }],
  });

  useEffect(() => {
    fetch('http://localhost:8000/api/produits/produits/')
      .then(res => res.json())
      .then(data => setProduitsDisponibles(data))
      .catch(err => console.error('Erreur chargement produits', err));
  }, []);

  useEffect(() => {
    fetch('http://localhost:8000/api/produits/stocks/')
      .then(res => res.json())
      .then(data => setStocks(data))
      .catch(err => console.error('Erreur chargement stocks', err));
  }, []);

  const handleProduitChange = (index, field, value) => {
    const produits = [...vente.produits];

    if (field === 'categorie') {
      produits[index].categorie = value;
      produits[index].produitId = '';
      produits[index].prix = 0;
    } else if (field === 'produitId') {
      produits[index].produitId = value;
      const produit = produitsDisponibles.find(p => p.id === parseInt(value));
      produits[index].prix = produit ? parseFloat(produit.prix_unitaire) : 0;
    } else if (field === 'quantite') {
      const produitId = parseInt(produits[index].produitId);
      const produit = produitsDisponibles.find(p => p.id === produitId);
      const stock = stocks.find(s => s.produit_nom === produit?.nom_produit);
      const quantite = Number(value);
      const stockDisponible = stock ? parseInt(stock.quantite) : 0;

      if (quantite <= stockDisponible) {
        produits[index].quantite = quantite;
      } else {
        alert(`La quantité demandée dépasse le stock disponible (${stockDisponible}).`);
      }
    }

    setVente({ ...vente, produits });
  };

  const ajouterProduit = () => {
    setVente({
      ...vente,
      produits: [...vente.produits, { categorie: '', produitId: '', quantite: 1, prix: 0 }]
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
      details: vente.produits.map(p => ({   // 👈 ici
        produit: parseInt(p.produitId),
        quantite: parseFloat(p.quantite),
        prix_unitaire: parseFloat(p.prix),
      })),
    };    
  
    console.log('🧾 Vente envoyée :', venteData);
  
    const response = await fetch('http://localhost:8000/api/produits/ventes/', {
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
    } else {
      console.error('🛑 Erreur serveur :', result);
      alert(`Erreur: ${JSON.stringify(result)}`);
    }
  };
  
  const produitsSelectionnes = vente.produits
    .filter(p => p.produitId)
    .map(p => parseInt(p.produitId));

  return (
    <div className="vente-form">
      <h2 className="vente-title">Nouvelle Vente</h2>

      <div className="vente-group">
        <label>Client</label>
        <input
          type="text"
          value={vente.client}
          onChange={(e) => setVente({ ...vente, client: e.target.value })}
          className="vente-input"
          required
        />
      </div>

      <div className="vente-produits-scrollable">
        {vente.produits.map((p, index) => (
          <div className="vente-produit-row-custom produit-fade-in" key={index}>
            <select
              value={p.categorie}
              onChange={(e) => handleProduitChange(index, 'categorie', e.target.value)}
              className="vente-select"
            >
              <option value="">Catégorie</option>
              {[...new Set(produitsDisponibles.map(prod => prod.categorie_produit_nom))].map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={p.produitId}
              onChange={(e) => handleProduitChange(index, 'produitId', e.target.value)}
              className="vente-select"
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
              className="vente-input"
            />

            <input
              type="number"
              placeholder="Quantité"
              min={1}
              value={p.quantite}
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

      <button className="vente-btn-primary full" onClick={handleSubmit}>
        Enregistrer la vente
      </button>
    </div>
  );
}
