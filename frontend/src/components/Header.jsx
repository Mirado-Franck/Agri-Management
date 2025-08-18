import React, { useState, useEffect, useRef } from 'react';
import { FaBell } from 'react-icons/fa';
import { useLocation, Link } from 'react-router-dom';
import './css/Header.css';

const pageTitles = {
  '/dashboard': 'Tableau de bord',
  '/produits': 'Produits',
  '/stocks': 'Stocks',
  '/ventes': 'Ventes',
  '/achats': 'Achats',
  '/statistiques': 'Statistiques',
  '/utilisateurs': 'Utilisateurs',
  '/parametres': 'Paramètres',
  '/deconnection': 'Déconnexion'
};

export default function Header() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [alertCount, setAlertCount] = useState(0);
  const username = localStorage.getItem('user_username') || 'Utilisateur';
  const role = localStorage.getItem('user_role') || 'Inconnu';
  const initial = username.charAt(0).toUpperCase();
  const dropdownRef = useRef(null);

  // Récupération du nombre de produits en alerte
  useEffect(() => {
    const fetchAlertes = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://localhost:8000/api/produits/stocks/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const stocksData = await response.json();
        const alertes = (Array.isArray(stocksData) ? stocksData : []).filter(stock => stock.etat === 'alerte' || stock.etat === 'rupture');
        setAlertCount(alertes.length);
      } catch (error) {
        console.error("Erreur lors du chargement des produits en alerte :", error);
        setAlertCount(0);
      }
    };

    fetchAlertes();
  }, []);

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    const path = location.pathname.toLowerCase();
    return pageTitles[path] || 'Tableau de bord';
  };

  return (
    <header>
      <div className="page-title">
        <h1>{getPageTitle()}</h1>
      </div>
      
      <div className="notification-icon">
        <FaBell size={20} />
        {alertCount > 0 && (
          <Link to="/statistiques#footer">
            <span className="alert-badge">{alertCount}</span>
          </Link>
        )}
      </div>

      <div className="user-circle" onClick={toggleMenu} ref={dropdownRef}>
        <div className="user-initial">{initial}</div>

        {menuOpen && (
          <div className="dropdown-menu">
            <div className="dropdown-item"><strong>{username}</strong></div>
            <div className="dropdown-item">{role}</div>
          </div>
        )}
      </div>
    </header>
  );
}