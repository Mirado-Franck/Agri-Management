import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  FiTrendingUp, 
  FiPieChart, 
  FiAward, 
  FiAlertTriangle,
  FiClipboard,
  FiGrid
} from 'react-icons/fi';
import styles from './css/Statistiques.module.css';
import VenteChart from '../components/VenteChart1';
import VentePieChart from '../components/VentePieChart';

// Couleurs prédéfinies pour les top produits
// (définies hors du composant : constante stable, pas une dépendance réactive)
const couleurs = ['#3b82f6', '#10b981', '#6366f1', '#f59e0b', '#ef4444'];

const Statistiques = () => {
  const location = useLocation();
  const [produitsAlerte, setProduitsAlerte] = useState([]);
  const [topProduits, setTopProduits] = useState([]);
  const [performancesCategories, setPerformancesCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Scroll automatique vers la section Produits en alerte
  useEffect(() => {
    if (location.hash === '#footer') {
      const footer = document.getElementById('footer');
      if (footer) {
        footer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => window.scrollBy({ top: -100, behavior: 'smooth' }), 500);
      }
    }
  }, [location]);

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
            const nom = detail.nom_produit;
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
              p.nom_produit === detail.nom_produit
            );
            if (produit && produit.categorie_produit_nom) {
              const categorie = produit.categorie_produit_nom;
              categoriesVentes[categorie] = (categoriesVentes[categorie] || 0) + detail.quantite;
            }
          });
        });

        const performances = Object.entries(categoriesVentes)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 4)
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
      <div className={styles['statistiques-container']}>
        <h1>📊 Tableau de Statistiques</h1>
        <p>Chargement des données... ⏳</p>
      </div>
    );
  }

  return (
    <div className={styles['statistiques-container']}>
      <div className={styles['statistiques-grid']}>
        {/* Section Évolution des ventes (2 colonnes) */}
        <section className={`${styles['stat-card']} ${styles['wide-card']}`}>
          <div className={styles['card-header']}>
            <FiTrendingUp className={styles['card-icon']} />
            <h2>Évolution des ventes</h2>
          </div>
          <div className={styles['graph-container']}>
            <VenteChart />
          </div>
        </section>

        {/* Section Performances par catégorie */}
        <section className={styles['stat-card']}>
          <div className={styles['card-header']}>
            <FiGrid className={styles['card-icon']} />
            <h2>Performances par catégorie</h2>
          </div>
          <div className={styles['categories-list']}>
            {performancesCategories.map((item, index) => (
              <div key={index} className={styles['categorie-item']}>
                <div className={styles['categorie-info']}>
                  <h4>{item.categorie}</h4>
                  <span className={styles['categorie-evolution']} style={{
                    color: item.evolution.startsWith('+') ? '#10b981' : '#ef4444'
                  }}>
                    {item.evolution}
                  </span>
                </div>
                <div className={styles['categorie-ventes']}>
                  <span>{item.ventes} ventes</span>
                  <div className={styles['progress-bar']}>
                    <div 
                      className={styles['progress-fill']} 
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
        <section className={styles['stat-card']}>
          <div className={styles['card-header']}>
            <FiPieChart className={styles['card-icon']} />
            <h2>Répartition par produit</h2>
          </div>
          <div className={styles['graph-container']}>
            <VentePieChart />
          </div>
        </section>

        {/* Section Top 5 produits */}
        <section className={styles['stat-card']}>
          <div className={styles['card-header']}>
            <FiAward className={styles['card-icon']} />
            <h2>Top 5 produits</h2>
          </div>
          <div className={styles['top-produits-list']}>
            {topProduits.map((produit, index) => (
              <div key={index} className={styles['produit-item']}>
                <span className={styles['produit-rank']} style={{ backgroundColor: produit.couleur }}>
                  {index + 1}
                </span>
                <span className={styles['produit-nom']}>{produit.nom}</span>
                <span className={styles['produit-ventes']}>{produit.ventes} ventes</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section Produits en alerte avec ancre */}
        <section id="footer" className={`${styles['stat-card']} ${styles['alert-card']}`}>
          <div className={styles['card-header']}>
            <FiAlertTriangle className={styles['card-icon']} />
            <h2>Produits en alerte</h2>
            <span className={styles['badge']}>{produitsAlerte.length}</span>
          </div>
          <div className={styles['alerte-list']}>
            {produitsAlerte.map((produit, index) => (
              <div key={index} className={styles['alerte-item']}>
                <div>
                  <h4>{produit.produit_nom}</h4>
                  <p>Stock: {produit.quantite} (seuil: {produit.seuil_alerte})</p>
                </div>
                <Link to="/Stocks">
                  <button className={styles['btn-reappro']}>Réappro</button>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Section Historique des ajustements */}
        <section className={`${styles['stat-card']} ${styles['wide-card']}`}>
          <div className={styles['card-header']}>
            <FiClipboard className={styles['card-icon']} />
            <h2>Historique des ajustements</h2>
          </div>
          <div className={styles['historique-table']}>
            <div className={styles['table-header']}>
              <span>Date</span>
              <span>Produit</span>
              <span>Type</span>
              <span>Quantité</span>
            </div>
            <div className={styles['table-row']}>
              <span>12/06/2023</span>
              <span>Maïs</span>
              <span>Entrée</span>
              <span>+50</span>
            </div>
            <div className={styles['table-row']}>
              <span>10/06/2023</span>
              <span>Carotte</span>
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