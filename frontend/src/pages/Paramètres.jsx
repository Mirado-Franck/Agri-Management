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
import styles from './css/Parametres.module.css';
import { ThemeContext } from './config/ThemeContext';

const Parametres = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const { theme, setTheme } = useContext(ThemeContext);
  const username = localStorage.getItem('user_username') || 'Utilisateur';
  const role = localStorage.getItem('user_role') || 'Inconnu';

  const toggleSection = (id) => {
    setActiveSection(prev => (prev === id ? null : id));
  };

  const handleThemeChange = (selectedTheme) => {
    setTheme(selectedTheme);
    localStorage.setItem('theme', selectedTheme);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage('');

    if (newPassword !== confirmPassword) {
      setMessage('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/auth/change-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      });

      const result = await response.json();
      console.log('API Response:', result); // Log pour déboguer

      if (response.ok) {
        setMessage('Mot de passe modifié avec succès !');
        setShowModal(false);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        // Gérer les erreurs du serializer (tableaux)
        const errorMessage = 
          (result.old_password && result.old_password[0]) ||
          (result.new_password && result.new_password[0]) ||
          (result.confirm_password && result.confirm_password[0]) ||
          'Erreur lors de la modification.';
        setMessage(errorMessage);
      }
    } catch (err) {
      console.error('Network Error:', err); // Log pour déboguer
      setMessage('Erreur réseau.');
    }
  };

  const sections = [
    {
      id: 'compte',
      title: 'Compte',
      icon: <FaUserCog className={styles['icon']} />,
      content: (
        <div className={styles['content-grid']}>
          <div className={styles['info-item']}>
            <span className={styles['info-label']}>Nom d'utilisateur</span>
            <span className={styles['info-value']}>{username}</span>
          </div>
          <div className={styles['info-item']}>
            <span className={styles['info-label']}>Rôle</span>
            <span className={styles['info-value']}>{role}</span>
          </div>
          <button className={`${styles['action-btn']} ${styles['edit-btn']}`}>Modifier le profil</button>
        </div>
      ),
    },
    {
      id: 'apparence',
      title: 'Apparence',
      icon: <FaPalette className={styles['icon']} />,
      content: (
        <div className={styles['appearance-options']}>
          <div className={styles['theme-toggle']}>
            <h4>Thème de l'application</h4>
            <div className={styles['theme-buttons']}>
              <button 
                className={`${styles['theme-btn']} ${styles['light']} ${theme === 'light' ? styles['active'] : ''}`}
                onClick={() => handleThemeChange('light')}
              >
                <FaSun className={styles['theme-icon']} />
                <span>Clair</span>
              </button>
              <button 
                className={`${styles['theme-btn']} ${styles['dark']} ${theme === 'dark' ? styles['active'] : ''}`}
                onClick={() => handleThemeChange('dark')}
              >
                <FaMoon className={styles['theme-icon']} />
                <span>Sombre</span>
              </button>
              <button 
                className={`${styles['theme-btn']} ${styles['system']} ${theme === 'system' ? styles['active'] : ''}`}
                onClick={() => handleThemeChange('system')}
              >
                <FaDesktop className={styles['theme-icon']} />
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
      icon: <FaLock className={styles['icon']} />,
      content: (
        <div className={styles['security-grid']}>
          <div className={styles['security-item']}>
            <h4>Changer le mot de passe</h4>
            <p>Mettez à jour votre mot de passe régulièrement</p>
            <button className={`${styles['action-btn']} ${styles['security-btn']}`} onClick={() => setShowModal(true)}>Modifier</button>
          </div>
        </div>
      ),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: <FaBell className={styles['icon']} />,
      content: (
        <div className={styles['notif-grid']}>
          <div className={styles['notif-toggle']}>
            <span>Emails de rappel</span>
            <label className={styles['switch']}>
              <input type="checkbox" defaultChecked />
              <span className={`${styles['slider']} ${styles['round']}`}></span>
            </label>
          </div>
          <div className={styles['notif-toggle']}>
            <span>Alertes de stock faible</span>
            <label className={styles['switch']}>
              <input type="checkbox" defaultChecked />
              <span className={`${styles['slider']} ${styles['round']}`}></span>
            </label>
          </div>
        </div>
      ),
    },
    {
      id: 'aide',
      title: 'Aide et support',
      icon: <FaInfoCircle className={styles['icon']} />,
      content: (
        <div className={styles['help-links']}>
          <button className={styles['help-link']}>
            <span>Documentation</span>
            <FaChevronDown className={styles['link-arrow']} />
          </button>
          <button className={styles['help-link']}>
            <span>FAQ</span>
            <FaChevronDown className={styles['link-arrow']} />
          </button>
          <button className={styles['help-link']}>
            <span>Contacter le support</span>
            <FaChevronDown className={styles['link-arrow']} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className={styles['settings-panel']}>
      <p className={styles['settings-subtitle']}>Gérez vos préférences et vos informations de compte</p>
      
      <div className={styles['settings-sections']}>
        {sections.map(section => (
          <div key={section.id} className={`${styles['settings-card']} ${activeSection === section.id ? styles['active'] : ''}`}>
            <div
              className={styles['card-header']}
              onClick={() => toggleSection(section.id)}
            >
              <div className={styles['card-title']}>
                <div className={styles['icon-wrapper']}>
                  {section.icon}
                </div>
                <h3>{section.title}</h3>
              </div>
              <div className={styles['card-arrow']}>
                {activeSection === section.id ? <FaChevronUp /> : <FaChevronDown />}
              </div>
            </div>
            
            {activeSection === section.id && (
              <div className={styles['card-content']}>
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal pour changer le mot de passe */}
      {showModal && (
        <div className={styles['modal-overlay']} onClick={() => setShowModal(false)}>
          <div className={styles['modal-content']} onClick={e => e.stopPropagation()}>
            <h2>Changer le mot de passe</h2>
            <form onSubmit={handleChangePassword}>
              <input 
                type="password" 
                placeholder="Ancien mot de passe" 
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required 
                className={styles['modal-input']}
              />
              <input 
                type="password" 
                placeholder="Nouveau mot de passe" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required 
                className={styles['modal-input']}
              />
              <input 
                type="password" 
                placeholder="Confirmer le nouveau mot de passe" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
                className={styles['modal-input']}
              />
              <button type="submit" className={styles['modal-btn']}>Confirmer</button>
            </form>
            {message && <p className={styles['modal-message']}>{message}</p>}
            <button onClick={() => setShowModal(false)} className={styles['modal-close']}>Annuler</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Parametres;