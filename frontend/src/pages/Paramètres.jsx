import React, { useState, useContext } from 'react';
import { 
  FaChevronDown, 
  FaChevronUp, 
  FaUserCog, 
  FaLock, 
  FaBell, 
  FaInfoCircle, 
  FaPalette,
  FaSun,
  FaMoon,
  FaDesktop
} from 'react-icons/fa';
import './css/Parametres.css';
import { ThemeContext } from './config/ThemeContext'; // À créer ou adapter selon votre structure

const Parametres = () => {
  const [activeSection, setActiveSection] = useState(null);
  const { theme, setTheme } = useContext(ThemeContext);

  const toggleSection = (id) => {
    setActiveSection(prev => (prev === id ? null : id));
  };

  const handleThemeChange = (selectedTheme) => {
    setTheme(selectedTheme);
    // Ici vous pouvez aussi sauvegarder dans localStorage
    localStorage.setItem('theme', selectedTheme);
  };

  const sections = [
    {
      id: 'compte',
      title: 'Compte',
      icon: <FaUserCog className="icon" />,
      content: (
        <div className="content-grid">
          <div className="info-item">
            <span className="info-label">Nom d'utilisateur</span>
            <span className="info-value">admin</span>
          </div>
          <div className="info-item">
            <span className="info-label">Email</span>
            <span className="info-value">admin@exemple.com</span>
          </div>
          <button className="action-btn edit-btn">Modifier le profil</button>
        </div>
      ),
    },
    {
      id: 'apparence',
      title: 'Apparence',
      icon: <FaPalette className="icon" />,
      content: (
        <div className="appearance-options">
          <div className="theme-toggle">
            <h4>Thème de l'application</h4>
            <div className="theme-buttons">
              <button 
                className={`theme-btn light ${theme === 'light' ? 'active' : ''}`}
                onClick={() => handleThemeChange('light')}
              >
                <FaSun className="theme-icon" />
                <span>Clair</span>
              </button>
              <button 
                className={`theme-btn dark ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => handleThemeChange('dark')}
              >
                <FaMoon className="theme-icon" />
                <span>Sombre</span>
              </button>
              <button 
                className={`theme-btn system ${theme === 'system' ? 'active' : ''}`}
                onClick={() => handleThemeChange('system')}
              >
                <FaDesktop className="theme-icon" />
                <span>Système</span>
              </button>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'securite',
      title: 'Sécurité',
      icon: <FaLock className="icon" />,
      content: (
        <div className="security-grid">
          <div className="security-item">
            <h4>Changer le mot de passe</h4>
            <p>Mettez à jour votre mot de passe régulièrement</p>
            <button className="action-btn security-btn">Modifier</button>
          </div>
          <div className="security-item">
            <h4>Authentification à deux facteurs</h4>
            <p>Ajoutez une couche de sécurité supplémentaire</p>
            <button className="action-btn security-btn">Activer 2FA</button>
          </div>
        </div>
      ),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: <FaBell className="icon" />,
      content: (
        <div className="notif-grid">
          <div className="notif-toggle">
            <span>Emails de rappel</span>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="notif-toggle">
            <span>Alertes de stock faible</span>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="notif-toggle">
            <span>Notifications push</span>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
      ),
    },
    {
      id: 'aide',
      title: 'Aide et support',
      icon: <FaInfoCircle className="icon" />,
      content: (
        <div className="help-links">
          <a href="#" className="help-link">
            <span>Documentation</span>
            <FaChevronDown className="link-arrow" />
          </a>
          <a href="#" className="help-link">
            <span>FAQ</span>
            <FaChevronDown className="link-arrow" />
          </a>
          <a href="#" className="help-link">
            <span>Contacter le support</span>
            <FaChevronDown className="link-arrow" />
          </a>
        </div>
      ),
    },
  ];

  return (
    <div className="settings-panel">
      <div className="settings-header">
        <h1>Paramètres</h1>
        <p className="settings-subtitle">Gérez vos préférences et vos informations de compte</p>
      </div>
      
      <div className="settings-sections">
        {sections.map(section => (
          <div key={section.id} className={`settings-card ${activeSection === section.id ? 'active' : ''}`}>
            <div
              className="card-header"
              onClick={() => toggleSection(section.id)}
            >
              <div className="card-title">
                <div className="icon-wrapper">
                  {section.icon}
                </div>
                <h3>{section.title}</h3>
              </div>
              <div className="card-arrow">
                {activeSection === section.id ? <FaChevronUp /> : <FaChevronDown />}
              </div>
            </div>
            
            {activeSection === section.id && (
              <div className="card-content">
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Parametres;