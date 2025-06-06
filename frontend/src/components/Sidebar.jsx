import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBox, FaChartBar, FaShoppingCart, FaFileAlt, FaChartLine, FaUsers, FaGlobe, FaCog, FaSignOutAlt } from 'react-icons/fa';
import './css/Sidebar.css';
import logo from '../assets/logo.png';

const navItems = [
  { to: '/dashboard', icon: <FaHome className="icon dashboard-icon" />, label: 'Tableau de Bord' },
  { to: '/Produits', icon: <FaBox className="icon produits-icon" />, label: 'Produits' },
  { to: '/stocks', icon: <FaChartBar className="icon stocks-icon" />, label: 'Stocks' },
  { to: '/ventes', icon: <FaShoppingCart className="icon ventes-icon" />, label: 'Ventes' },
  { to: '/achats', icon: <FaFileAlt className="icon achats-icon" />, label: 'Achats' },
  { to: '/statistiques', icon: <FaChartLine className="icon stats-icon" />, label: 'Statistiques' },
  { to: '/utilisateurs', icon: <FaUsers className="icon users-icon" />, label: 'Utilisateurs' },
  { to: '/langue', icon: <FaGlobe className="icon langue-icon" />, label: 'Langue' },
  { to: '/parametres', icon: <FaCog className="icon params-icon" />, label: 'Paramètres' },
];

export default function Sidebar({ onLogout }) {
  const location = useLocation();

  return (
    <aside className="sidebar" aria-label="Navigation latérale">
      <img src={logo} alt="Logo de l'application" className="logo" />

      <ul className="nav-list">
        {navItems.map(({ to, icon, label }) => (
          <li key={to}>
            <Link
              to={to}
              className={location.pathname === to ? 'active' : ''}
              aria-label={label}
            >
              <span className="icon">{icon}</span>
              <span className="label">{label}</span>
            </Link>
          </li>
        ))}
        <li>
          <button onClick={onLogout} className="logout-btn" aria-label="Déconnexion">
            <span className="icon"><FaSignOutAlt className="logout-icon" /></span>
            <span className="label">Déconnexion</span>
          </button>
        </li>
      </ul>
    </aside>
  );
}
