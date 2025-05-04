import React, { useState, useRef, useEffect } from 'react';
import './css/KebabMenu.css';

// Composants à afficher
function NomProduit() {
  return <div className="content-box">🛒 Modifier le <strong>nom du produit</strong></div>;
}

function CategorieProduit() {
  return <div className="content-box">📂 Modifier la <strong>catégorie</strong></div>;
}

function StockProduit() {
  return <div className="content-box">📦 Modifier le <strong>stock</strong></div>;
}

function SeuilAlerte() {
  return <div className="content-box">🚨 Modifier le <strong>seuil d’alerte</strong></div>;
}

function DateEntree() {
  return <div className="content-box">📅 Modifier la <strong>date d'entrée</strong></div>;
}

function DateSortie() {
  return <div className="content-box">📤 Modifier la <strong>date de sortie</strong></div>;
}

function KebabMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const menuRef = useRef();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const handleSelect = (component) => {
    setSelectedComponent(component);
    setIsOpen(false); // Ferme le menu après clic
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderSelectedComponent = () => {
    switch (selectedComponent) {
      case 'Nom':
        return <NomProduit />;
      case 'Categorie':
        return <CategorieProduit />;
      case 'Stock':
        return <StockProduit />;
      case 'Seuil':
        return <SeuilAlerte />;
      case 'Dentre':
        return <DateEntree />;
      case 'Dsortie':
        return <DateSortie />;
      default:
        return null;
    }
  };

  return (
    <div className="kebab-container" ref={menuRef}>
      <button className="kebab-button" onClick={toggleMenu} aria-label="Open menu">
        ⋮
      </button>
      {isOpen && (
        <div className="kebab-menu">
          <ul className="kebab-list">
            <li onClick={() => handleSelect('Nom')}>Nom Produit</li>
            <li onClick={() => handleSelect('Categorie')}>Catégorie</li>
            <li onClick={() => handleSelect('Stock')}>Stock</li>
            <li onClick={() => handleSelect('Seuil')}>Seuil d'alerte</li>
            <li onClick={() => handleSelect('Dentre')}>Date d'entrée</li>
            <li onClick={() => handleSelect('Dsortie')}>Date de sortie</li>
          </ul>
        </div>
      )}
      <div className="kebab-result">{renderSelectedComponent()}</div>
    </div>
  );
}

export default KebabMenu;
