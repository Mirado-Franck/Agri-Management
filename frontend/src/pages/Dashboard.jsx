import React, { useEffect, useState } from 'react';
import styles from './css/Dashboard.module.css';
import { FaShoppingCart, FaChartLine, FaStar, FaExclamationTriangle } from 'react-icons/fa';
import { MdShowChart } from "react-icons/md";
import { BiBarChartAlt2 } from "react-icons/bi";
import VenteChart from '../components/VenteChart';
import VentePieChart from '../components/VentePieChart';
import { Link } from 'react-router-dom';
import axiosInstance from '../axiosInstance';

export default function Dashboard() {
  const [ventes, setVentes] = useState([]);
  const [produits, setProduits] = useState([]);
  const [alertCount, setAlertCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        console.log('🔑 Token utilisé:', token);

        const venteRes = await axiosInstance.get('/produits/ventes/');
        const produitRes = await axiosInstance.get('/produits/');
        const stockRes = await axiosInstance.get('/produits/stocks/');

        setVentes(Array.isArray(venteRes.data) ? venteRes.data : []);
        setProduits(Array.isArray(produitRes.data) ? produitRes.data : []);
        const alertes = (Array.isArray(stockRes.data) ? stockRes.data : []).filter(stock => stock.etat === 'alerte' || stock.etat === 'rupture');
        setAlertCount(alertes.length);
      } catch (error) {
        console.error("🛑 Erreur de chargement des données :", error.response?.status, error.response?.data);
        alert(`Erreur lors du chargement des données: ${error.response?.status || 'Inconnue'} - ${error.response?.data?.detail || 'Vérifiez votre token ou l\'URL.'}`);
        setVentes([]);
        setProduits([]);
        setAlertCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className={styles.dashboardContainer}>
        <h1 className={styles.dashboardTitle}>📊 Tableau de bord</h1>
        <p>Chargement des données... ⏳</p>
      </div>
    );
  }

  // Calculs dynamiques
  const totalVentes = ventes.reduce((acc, vente) => acc + parseFloat(vente.total), 0).toFixed(2);
  const nombreVentes = ventes.length;

  // Top produit
  const compteurProduits = {};
  ventes.forEach(vente => {
    vente.details.forEach(detail => {
      const nom = detail.nom_produit; // Utiliser nom_produit directement comme dans Statistiques
      compteurProduits[nom] = (compteurProduits[nom] || 0) + detail.quantite;
    });
  });

  const topProduit = Object.entries(compteurProduits)
    .sort((a, b) => b[1] - a[1])[0] || ['---', 0];

  return (
    <div className={styles.dashboardContainer}>
      {/* KPI Cards */}
      <div className={styles.kpiCards}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon}><FaShoppingCart /></div>
          <div className={styles.kpiLabel}>Total des ventes</div>
          <div className={styles.kpiValue}>{totalVentes} Ar</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon}><FaChartLine /></div>
          <div className={styles.kpiLabel}>Nombre de produits vendus</div>
          <div className={styles.kpiValue}>{nombreVentes}</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon}><FaStar /></div>
          <div className={styles.kpiLabel}>Top produit</div>
          <div className={styles.kpiValue}>{topProduit[0]} ({topProduit[1]})</div>
        </div>

        <div className={`${styles.kpiCard} ${styles.warning}`}>
          <div className={styles.kpiIcon}><FaExclamationTriangle /></div>
          <div className={styles.kpiLabel}>Produits en alerte</div>
          <div className={styles.kpiValue}>{alertCount}</div>
        </div>
      </div>

      {/* Graphiques */}
      <div className={styles.chartsSection}>
        <div className={styles.chartBlock}>
          <h3>
            <BiBarChartAlt2 size={20} color="#10b981" style={{ marginRight: 4 }}/>
            <Link to="/Statistiques">Évolution des ventes (semaine)</Link>
          </h3>
          <div className={styles.chartPlaceholder}>
            <VenteChart />
          </div>
        </div>

        <div className={styles.chartBlock}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MdShowChart size={20} color="#3b82f6" style={{ marginRight: 4 }} />
            <Link to="/Statistiques">Répartition des ventes par produits (semaine)</Link>
          </h3>
          <div className={styles.chartPlaceholder}>
            <VentePieChart />
          </div>
        </div>
      </div>
    </div>
  );
}