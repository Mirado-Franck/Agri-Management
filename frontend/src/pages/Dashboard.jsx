import React from 'react';
import './css/Dashboard.css';
import { FaShoppingCart, FaChartLine, FaStar, FaExclamationTriangle } from 'react-icons/fa';
import VenteChart from '../components/VenteChart';
import VentePieChart from '../components/VentePieChart';

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">📊 Tableau de bord</h1>

      {/* KPI Cards */}
      <div className="kpi-cards">
        <div className="kpi-card">
          <div className="kpi-icon"><FaShoppingCart /></div>
          <div className="kpi-label">Total des ventes</div>
          <div className="kpi-value">3 500 €</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon"><FaChartLine /></div>
          <div className="kpi-label">Nombre de ventes</div>
          <div className="kpi-value">28</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon"><FaStar /></div>
          <div className="kpi-label">Top produit</div>
          <div className="kpi-value">Savon Lux (43)</div>
        </div>

        <div className="kpi-card warning">
          <div className="kpi-icon"><FaExclamationTriangle /></div>
          <div className="kpi-label">Produits en alerte</div>
          <div className="kpi-value">5</div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="charts-section">
        <div className="chart-block">
          <h3>📈 Évolution des ventes (semaine)</h3>
          <div className="chart-container">
            <VenteChart />
          </div>
        </div>

        <div className="chart-block">
          <h3>🍕 Répartition des ventes par produit</h3>
          <div className="chart-container">
            <VentePieChart />
          </div>
        </div>
      </div>
    </div>
  );
}