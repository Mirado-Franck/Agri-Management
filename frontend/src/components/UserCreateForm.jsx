import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import './css/UserCreateForm.css';

export default function UserCreateForm({ onCancel, onSuccess }) {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('employe');
  const [password, setPassword] = useState('');
  const [erreur, setErreur] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Récupère les infos de l'utilisateur connecté
    axiosInstance.get('/auth/me/')
      .then(res => {
        setUserRole(res.data.role);
      })
      .catch(() => {
        setErreur("Erreur lors de la vérification des autorisations.");
      });
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setErreur(null);

    try {
      await axiosInstance.post('/auth/users/create/', {
        username,
        role,
        password,
      });
      onSuccess(); // Fermer la modale + rafraîchir la liste
    } catch (err) {
      setErreur("Erreur lors de la création de l'utilisateur.");
    } finally {
      setLoading(false);
    }
  };

  // Cas où l'utilisateur n'est pas admin
  if (userRole && userRole !== 'admin') {
    return (
      <div className="user-create-form">
        <p className="error-message">❌ Seuls les administrateurs peuvent créer un nouvel utilisateur.</p>
        <div className="form-buttons">
          <button className="btn cancel" onClick={onCancel}>Fermer</button>
        </div>
      </div>
    );
  }

  return (
    <form className="user-create-form" onSubmit={handleSubmit}>
      <h3>Créer un nouvel utilisateur</h3>

      {erreur && <div className="error-message">{erreur}</div>}

      <label>Nom d'utilisateur</label>
      <input
        type="text"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />

      <label>Mot de passe</label>
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />

      <label>Rôle</label>
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="employe">Employé</option>
        <option value="admin">Admin</option>
      </select>

      <div className="form-buttons">
        <button type="button" className="btn cancel" onClick={onCancel}>
          Annuler
        </button>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Création..." : "Créer"}
        </button>
      </div>
    </form>
  );
}
