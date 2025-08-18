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
import './css/MainContent.css';

function MainContent() {
  return (
    <div className="main-content">
      <div className="headbar">
        <Header userInitial="M" /> {/* 🧑 Initiale utilisateur */}
      </div>
      <div>
        <Routes>
          <Route path="/" element={<Dashboard />} /> {/* 🏠 Redirection racine vers Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} /> {/* 📊 Page Dashboard */}
          <Route path="/Produits" element={<Produits />} /> {/* 🛒 Produits */}
          <Route path="/Stocks" element={<Stocks />} /> {/* 📦 Stocks */}
          <Route path="/Ventes" element={<Ventes />} /> {/* 💸 Ventes */}
          <Route path="/Achats" element={<Achats />} /> {/* 🛍️ Achats */}
          <Route path="/Statistiques" element={<Statistiques />} /> {/* 📈 Statistiques */}
          <Route path="/Utilisateurs" element={<Utilisateurs />} /> {/* 👥 Utilisateurs */}
          <Route path="/Parametres" element={<Parametres />} /> {/* ⚙️ Paramètres */}
          <Route path="/Deconnection" element={<Deconnection />} /> {/* 🚪 Déconnexion */}
        </Routes>
      </div>
    </div>
  );
}

export default MainContent;