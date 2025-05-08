import React, { useState } from 'react';
import './css/Login.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [erreur, setErreur] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        onLogin();
      } else {
        setErreur(data.message);
      }
    } catch (error) {
      setErreur("Erreur de connexion");
    }
  };

  return (
    <div className="login-container">
      <h2>Connexion</h2>
      {erreur && <div className="alert">{erreur}</div>}

      <form onSubmit={handleLogin}>
        <div className="input-group">
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder=" "
          />
          <label htmlFor="username">Nom d'utilisateur</label>
        </div>

        <div className="input-group password-group">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder=" "
          />
          <label htmlFor="password">Mot de passe</label>
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
            aria-label="Toggle password visibility"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button type="submit" className="submit-button">
          Se connecter
        </button>
      </form>
    </div>
  );
}
