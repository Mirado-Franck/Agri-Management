import React, { useEffect, useState } from 'react';
import './css/Dashboard.css';
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
        console.log('🔑 Token utilisé:', token); // Log du token pour débogage

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
      <div className="dashboard-container">
        <h1 className="dashboard-title">📊 Tableau de bord</h1>
        <p>Chargement des données...</p>
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
      const nom = typeof detail.produit === 'object' ? detail.produit.nom_produit : detail.produit;
      compteurProduits[nom] = (compteurProduits[nom] || 0) + detail.quantite;
    });
  });

  const topProduit = Object.entries(compteurProduits)
    .sort((a, b) => b[1] - a[1])[0] || ['---', 0];

  return (
    <div className="dashboard-container">
      {/* KPI Cards */}
      <div className="kpi-cards">
        <div className="kpi-card">
          <div className="kpi-icon"><FaShoppingCart /></div>
          <div className="kpi-label">Total des ventes</div>
          <div className="kpi-value">{totalVentes} Ar</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon"><FaChartLine /></div>
          <div className="kpi-label">Nombre de ventes</div>
          <div className="kpi-value">{nombreVentes}</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon"><FaStar /></div>
          <div className="kpi-label">Top produit</div>
          <div className="kpi-value">{topProduit[0]} ({topProduit[1]})</div>
        </div>

        <div className="kpi-card warning">
          <div className="kpi-icon"><FaExclamationTriangle /></div>
          <div className="kpi-label">Produits en alerte</div>
          <div className="kpi-value">{alertCount}</div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="charts-section">
        <div className="chart-block">
          <h3>
            <BiBarChartAlt2 size={20} color="#10b981" style={{ marginRight: 4 }}/>
            <Link to="/Statistiques">Évolution des ventes (semaine)</Link>
          </h3>
          <div className="chart-placeholder">
            <VenteChart />
          </div>
        </div>

        <div className="chart-block">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MdShowChart size={20} color="#3b82f6" style={{ marginRight: 4 }} />
            <Link to="/Statistiques">Répartition des ventes par produits (semaine)</Link>
          </h3>
          <div className="chart-placeholder">
            <VentePieChart />
          </div>
        </div>
      </div>
    </div>
  );
}