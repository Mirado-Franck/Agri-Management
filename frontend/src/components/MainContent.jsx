import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './Header';
import Dashboard from '../pages/Dashboard';
import Produits from '../pages/Produits';
import Stocks from '../pages/Stocks';
import Ventes from '../pages/Ventes';
import Achats from '../pages/Achats';
import Statistiques from '../pages/Statistiques';
import Utilisateurs from '../pages/Utilisateurs';
import Deconnection from '../pages/Déconnection';
import Parametres from '../pages/Paramètres';
import styles from './css/MainContent.module.css';

function MainContent() {
  return (
    <div className={styles.mainContent}>
      <div className={styles.headbar}>
        <Header /> {/* Le composant Header gère lui-même l'initiale utilisateur */}
      </div>
      <div className={styles.contentArea}>
        <Routes>
          <Route path="/" element={<Dashboard />} /> {/* 🏠 Redirection racine vers Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} /> {/* 📊 Page Dashboard */}
          <Route path="/produits" element={<Produits />} /> {/* 🛒 Produits */}
          <Route path="/stocks" element={<Stocks />} /> {/* 📦 Stocks */}
          <Route path="/ventes" element={<Ventes />} /> {/* 💸 Ventes */}
          <Route path="/achats" element={<Achats />} /> {/* 🛍️ Achats */}
          <Route path="/statistiques" element={<Statistiques />} /> {/* 📈 Statistiques */}
          <Route path="/utilisateurs" element={<Utilisateurs />} /> {/* 👥 Utilisateurs */}
          <Route path="/parametres" element={<Parametres />} /> {/* ⚙️ Paramètres */}
          <Route path="/deconnection" element={<Deconnection />} /> {/* 🚪 Déconnexion */}
        </Routes>
      </div>
    </div>
  );
}

export default MainContent;