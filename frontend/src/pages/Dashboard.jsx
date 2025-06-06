import React, { useEffect, useState } from 'react';
import './css/Dashboard.css';
import { FaShoppingCart, FaChartLine, FaStar, FaExclamationTriangle } from 'react-icons/fa';
import { MdShowChart } from "react-icons/md";
import { BiBarChartAlt2 } from "react-icons/bi";
import VenteChart from '../components/VenteChart';
import VentePieChart from '../components/VentePieChart';

export default function Dashboard() {
  const [ventes, setVentes] = useState([]);
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access_token');

        const venteRes = await fetch('http://localhost:8000/api/produits/ventes/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const produitRes = await fetch('http://localhost:8000/api/produits/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const ventesData = await venteRes.json();
        const produitsData = await produitRes.json();

        setVentes(Array.isArray(ventesData) ? ventesData : []);
        setProduits(Array.isArray(produitsData) ? produitsData : []);
      } catch (error) {
        console.error("Erreur de chargement des données :", error);
        setVentes([]);
        setProduits([]);
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
  const produitsEnAlerte = produits.filter(p => p.quantite_en_stock <= p.seuil_alerte).length;

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
      <h1 className="dashboard-title">📊 Tableau de bord</h1>

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
          <div className="kpi-value">{produitsEnAlerte}</div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="charts-section">
        <div className="chart-block">
        <h3>
          <BiBarChartAlt2 size={20} color="#10b981" style={{ marginRight: 4 }}/>
          Évolution des ventes (semaine)
        </h3>
          <div className="chart-placeholder">
            <VenteChart />
          </div>
        </div>

        <div className="chart-block">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
           <MdShowChart size={20} color="#3b82f6" style={{ marginRight: 4 }} />
            Évolution des ventes (semaine)
          </h3>
          <div className="chart-placeholder">
            <VentePieChart />
          </div>
        </div>
      </div>
    </div>
  );
}
