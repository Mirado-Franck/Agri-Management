import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBox, FaChartBar, FaShoppingCart, FaFileAlt, FaChartLine, FaUsers, FaCog, FaSignOutAlt } from 'react-icons/fa';
import styles from './css/Sidebar.module.css';
import logo from '../assets/logo.png';

const navItems = [
  { to: '/dashboard', icon: <FaHome className={styles.dashboardIcon} />, label: 'Tableau de Bord' },
  { to: '/produits', icon: <FaBox className={styles.produitsIcon} />, label: 'Produits' },
  { to: '/stocks', icon: <FaChartBar className={styles.stocksIcon} />, label: 'Stocks' },
  { to: '/ventes', icon: <FaShoppingCart className={styles.ventesIcon} />, label: 'Ventes' },
  { to: '/achats', icon: <FaFileAlt className={styles.achatsIcon} />, label: 'Achats' },
  { to: '/statistiques', icon: <FaChartLine className={styles.statsIcon} />, label: 'Statistiques' },
  { to: '/utilisateurs', icon: <FaUsers className={styles.usersIcon} />, label: 'Utilisateurs' },
  { to: '/parametres', icon: <FaCog className={styles.paramsIcon} />, label: 'Paramètres' },
];

export default function Sidebar({ onLogout }) {
  const location = useLocation();

  return (
    <aside className={styles.sidebar} aria-label="Navigation latérale">
      <img src={logo} alt="Logo de l'application" className={styles.logo} />

      <ul className={styles.navList}>
        {navItems.map(({ to, icon, label }) => (
          <li key={to}>
            <Link
              to={to}
              className={location.pathname === to ? styles.active : ''}
              aria-label={label}
            >
              <span className={styles.icon}>{icon}</span>
              <span className={styles.label}>{label}</span>
            </Link>
          </li>
        ))}
        <li>
          <button onClick={onLogout} className={styles.logoutBtn} aria-label="Déconnexion">
            <span className={styles.icon}><FaSignOutAlt className={styles.logoutIcon} /></span>
            <span className={styles.label}>Déconnexion</span>
          </button>
        </li>
      </ul>
    </aside>
  );
}