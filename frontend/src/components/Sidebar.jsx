import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './css/Sidebar.css';
import logo from '../assets/logo.png';
import Searchbar from './Searchbar';

const navItems = [
  { to: '/dashboard', icon: '🏠', label: 'Tableau de Bord' },
  { to: '/Produits', icon: '📦', label: 'Produits' },
  { to: '/stocks', icon: '📊', label: 'Stocks' },
  { to: '/ventes', icon: '🛒', label: 'Ventes' },
  { to: '/achats', icon: '📝', label: 'Achats' },
  { to: '/statistiques', icon: '📈', label: 'Statistiques' },
  { to: '/utilisateurs', icon: '👥', label: 'Utilisateurs' },
  { to: '/langue', icon: '🌐', label: 'Langue' },
  { to: '/parametres', icon: '⚙️', label: 'Paramètres' }
];

export default function Sidebar({ onLogout }) {
  const location = useLocation();

  return (
    <aside className="sidebar" aria-label="Navigation latérale">
      <img src={logo} alt="Logo de l'application" className="logo" />

      <div className="search-box">
        <Searchbar />
      </div>

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
            <span className="icon">🔒</span>
            <span className="label">Déconnexion</span>
          </button>
        </li>
      </ul>
    </aside>
  );
}
