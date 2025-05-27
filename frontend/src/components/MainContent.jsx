import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './Header';
import Dashboard from '../pages/Dashboard';
import Produits from '../pages/Produits';
import Stocks from '../pages/Stocks';
import Ventes from '../pages/Ventes';
import Achats from '../pages/Achats';
import Statistiques from '../pages/Statistiques';
import Deconnection from '../pages/Déconnection';
import Parametres from '../pages/Paramètres';
import './css/MainContent.css';

function MainContent() {
  return (
    <div className="main-content">
      <div className="headbar">
        <Header userInitial="M" />
      </div>
      <div>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/Produits" element={<Produits />} />
          <Route path="/Stocks" element={<Stocks />} />
          <Route path="/Ventes" element={<Ventes />} />
          <Route path="/Achats" element={<Achats />} />
          <Route path="/Statistiques" element={<Statistiques />} />
          <Route path="/Deconnection" element={<Deconnection />} />
          <Route path="/Parametres" element={<Parametres />} />
        </Routes>
      </div>
    </div>
  );
}

export default MainContent;