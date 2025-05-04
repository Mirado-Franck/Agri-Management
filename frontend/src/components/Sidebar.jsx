import React from 'react';
import { Link } from 'react-router-dom';
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
  { to: '/parametres', icon: '⚙️', label: 'Paramètres' },
  { to: '/logout', icon: '🔒', label: 'Déconnexion' }
];

export default function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Navigation latérale">
      <img src={logo} alt="Logo de l'application" className="logo" />

      <div className="search-box">
        <Searchbar />
      </div>

      <ul className="nav-list">
        {navItems.map(({ to, icon, label }) => (
          <li key={to}>
            <Link to={to} aria-label={label}>
              <span className="icon">{icon}</span>
              <span className="label">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
