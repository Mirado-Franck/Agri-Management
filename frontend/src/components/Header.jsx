import React, { useState, useEffect, useRef } from 'react';
import { FaBell } from 'react-icons/fa'; // FaChevronDown retiré
import './css/Header.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const username = localStorage.getItem('user_username') || 'Utilisateur';
  const role = localStorage.getItem('user_role') || 'Inconnu';
  const initial = username.charAt(0).toUpperCase();
  const dropdownRef = useRef(null);

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

  return (
    <header>
      <div className="notification-icon">
        <FaBell size={20} />
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
