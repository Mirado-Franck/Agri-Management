import React, { useEffect, useState } from 'react';
import { 
  FiTrendingUp, 
  FiPieChart, 
  FiAward, 
  FiAlertTriangle,
  FiClipboard,
  FiGrid
} from 'react-icons/fi';
import './css/Statistiques.css';
import VenteChart from '../components/VenteChart1';
import VentePieChart from '../components/VentePieChart';

const Statistiques = () => {
  const [produitsAlerte, setProduitsAlerte] = useState([]);
  const [topProduits, setTopProduits] = useState([]);
  const [performancesCategories, setPerformancesCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Couleurs prédéfinies pour les top produits
  const couleurs = ['#3b82f6', '#10b981', '#6366f1', '#f59e0b', '#ef4444'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access_token');

        // Récupération des ventes pour top produits et performances par catégorie
        const venteRes = await fetch('http://localhost:8000/api/produits/ventes/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Récupération des stocks pour produits en alerte
        const stockRes = await fetch('http://localhost:8000/api/produits/stocks/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Récupération des produits pour les catégories
        const produitRes = await fetch('http://127.0.0.1:8000/api/produits/produits/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const ventesData = await venteRes.json();
        const stocksData = await stockRes.json();
        const produitsData = await produitRes.json();

        // Calcul des top 5 produits
        const compteurProduits = {};
        (Array.isArray(ventesData) ? ventesData : []).forEach(vente => {
          vente.details.forEach(detail => {
            const nom = typeof detail.produit === 'object' ? detail.produit.nom_produit : detail.produit;
            compteurProduits[nom] = (compteurProduits[nom] || 0) + detail.quantite;
          });
        });

        const top5 = Object.entries(compteurProduits)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([nom, ventes], index) => ({
            nom,
            ventes,
            couleur: couleurs[index % couleurs.length]
          }));

        setTopProduits(top5);

        // Calcul des performances par catégorie
        const categoriesVentes = {};
        (Array.isArray(ventesData) ? ventesData : []).forEach(vente => {
          vente.details.forEach(detail => {
            const produit = (Array.isArray(produitsData) ? produitsData : []).find(p => 
              p.nom_produit === (typeof detail.produit === 'object' ? detail.produit.nom_produit : detail.produit)
            );
            if (produit && produit.categorie_produit_nom) {
              const categorie = produit.categorie_produit_nom;
              categoriesVentes[categorie] = (categoriesVentes[categorie] || 0) + detail.quantite;
            }
          });
        });

        // Simulation d'évolution (exemple, à adapter selon tes données réelles)
        const performances = Object.entries(categoriesVentes)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 4) // Limite à 4 catégories comme dans l'original
          .map(([categorie, ventes], index) => ({
            categorie,
            ventes,
            evolution: index % 2 === 0 ? `+${Math.floor(Math.random() * 10 + 1)}%` : `-${Math.floor(Math.random() * 5 + 1)}%`
          }));

        setPerformancesCategories(performances);

        // Produits en alerte
        const alertes = (Array.isArray(stocksData) ? stocksData : []).filter(stock => stock.etat === 'alerte' || stock.etat === 'rupture');
        setProduitsAlerte(alertes);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
        setTopProduits([]);
        setProduitsAlerte([]);
        setPerformancesCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="statistiques-container">
        <h1>📊 Tableau de Statistiques</h1>
        <p>Chargement des données...</p>
      </div>
    );
  }

  return (
    <div className="statistiques-container">

      <div className="statistiques-grid">
        {/* Section Évolution des ventes (2 colonnes) */}
        <section className="stat-card wide-card">
          <div className="card-header">
            <FiTrendingUp className="card-icon" />
            <h2>Évolution des ventes</h2>
          </div>
          <div className="graph-container">
            <VenteChart />
          </div>
        </section>

        {/* Section Performances par catégorie */}
        <section className="stat-card">
          <div className="card-header">
            <FiGrid className="card-icon" />
            <h2>Performances par catégorie</h2>
          </div>
          <div className="categories-list">
            {performancesCategories.map((item, index) => (
              <div key={index} className="categorie-item">
                <div className="categorie-info">
                  <h4>{item.categorie}</h4>
                  <span className="categorie-evolution" style={{
                    color: item.evolution.startsWith('+') ? '#10b981' : '#ef4444'
                  }}>
                    {item.evolution}
                  </span>
                </div>
                <div className="categorie-ventes">
                  <span>{item.ventes} ventes</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{
                        width: `${(item.ventes / Math.max(...performancesCategories.map(c => c.ventes), 500)) * 100}%`,
                        backgroundColor: index % 2 === 0 ? '#3b82f6' : '#10b981'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section Répartition par produit */}
        <section className="stat-card">
          <div className="card-header">
            <FiPieChart className="card-icon" />
            <h2>Répartition par produit</h2>
          </div>
          <div className="graph-container">
            <VentePieChart />
          </div>
        </section>

        {/* Section Top 5 produits */}
        <section className="stat-card">
          <div className="card-header">
            <FiAward className="card-icon" />
            <h2>Top 5 produits</h2>
          </div>
          <div className="top-produits-list">
            {topProduits.map((produit, index) => (
              <div key={index} className="produit-item">
                <span className="produit-rank" style={{ backgroundColor: produit.couleur }}>
                  {index + 1}
                </span>
                <span className="produit-nom">{produit.nom}</span>
                <span className="produit-ventes">{produit.ventes} ventes</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section Produits en alerte */}
        <section className="stat-card alert-card">
          <div className="card-header">
            <FiAlertTriangle className="card-icon" />
            <h2>Produits en alerte</h2>
            <span className="badge">{produitsAlerte.length}</span>
          </div>
          <div className="alerte-list">
            {produitsAlerte.map((produit, index) => (
              <div key={index} className="alerte-item">
                <div>
                  <h4>{produit.produit_nom}</h4>
                  <p>Stock: {produit.quantite} (seuil: {produit.seuil_alerte})</p>
                </div>
                <button className="btn-reappro">Réappro</button>
              </div>
            ))}
          </div>
        </section>

        {/* Section Historique des ajustements */}
        <section className="stat-card wide-card">
          <div className="card-header">
            <FiClipboard className="card-icon" />
            <h2>Historique des ajustements</h2>
          </div>
          <div className="historique-table">
            <div className="table-header">
              <span>Date</span>
              <span>Produit</span>
              <span>Type</span>
              <span>Quantité</span>
            </div>
            <div className="table-row">
              <span>12/06/2023</span>
              <span>Produit A</span>
              <span>Entrée</span>
              <span>+50</span>
            </div>
            <div className="table-row">
              <span>10/06/2023</span>
              <span>Produit B</span>
              <span>Sortie</span>
              <span>-20</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Statistiques;