import React from 'react';
import './css/Sidebar.css';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <img src={logo} alt="Logo" className="logo" />

      <div className="search-box">
        <input type="text" placeholder="🔍 Rechercher..." />
      </div>

      <ul>
        <li className="active">
          <Link to="/dashboard"><span className="icon">🏠</span>Tableau de Bord</Link>
        </li>
        <li>
          <Link to="/Produits">
            <span className="icon">📦</span>Produits
          </Link>
        </li>
        <li>
          <Link to="/stocks">
            <span className="icon">📊</span>Stocks
          </Link>
        </li>
        <li>
          <Link to="/ventes">
            <span className="icon">🛒</span>Ventes
          </Link>
        </li>
        <li>
          <Link to="/achats">
            <span className="icon">📝</span>Achats
          </Link>
        </li>
        <li>
          <Link to="/statistiques">
            <span className="icon">📈</span>Statistiques
          </Link>
        </li>
        <li>
          <Link to="/utilisateurs"><
              span className="icon">👥</span>Utilisateurs
          </Link>
        </li>
        <li>
          <Link to="/logout">
            <span className="icon">🔒</span>Déconnexion
          </Link>
        </li>
        <li>
          <Link to="/langue">
            <span className="icon">🌐</span>Langue
          </Link>
        </li>
        <li className='settings'>
          <Link to="/parametres">
            <span className="icon">⚙️</span>Paramètres
          </Link>
        </li>
      </ul>

    </div>
  );
}
