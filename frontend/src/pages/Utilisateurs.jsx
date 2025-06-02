import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import './css/Utilisateurs.css';
import { FaPlus } from "react-icons/fa";
import UserCreateForm from '../components/UserCreateForm';

export default function Utilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axiosInstance.get('/auth/users/')
      .then(res => {
        setUtilisateurs(res.data);
        setLoading(false);
      })
      .catch(err => {
        setErreur("Erreur lors du chargement des utilisateurs");
        setLoading(false);
      });
  }, []);

  const handleUserCreated = () => {
    // Recharge les utilisateurs après création
    axiosInstance.get('/auth/users/')
      .then(res => {
        setUtilisateurs(res.data);
        setShowModal(false); // Fermer la modale après création
      });
  };

  const toggleStatut = async (userId) => {
    try {
      const res = await axiosInstance.patch(`/auth/users/${userId}/toggle_active/`);
      // Met à jour localement la liste
      setUtilisateurs(prev =>
        prev.map(u => (u.id === userId ? { ...u, is_active: res.data.is_active } : u))
      );
    } catch (error) {
      alert("Erreur lors du changement de statut.");
    }
  };
  
  return (
    <div className="utilisateurs-container">
      <div className="utilisateurs-header">
        <h2>Liste des Utilisateurs</h2>
        <button className="btn" onClick={() => setShowModal(true)}>
          <FaPlus /> Créer un utilisateur
        </button>
      </div>

      {erreur && <div className="alert">{erreur}</div>}
      {loading ? (
        <div>Chargement...</div>
      ) : (
        <table className="styled-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nom d'utilisateur</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {utilisateurs.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>{user.is_active ? "Actif" : "Inactif"}</td>
                <td>
                  <button
                    className={`btn ${user.is_active ? 'btn-danger' : 'btn-success'}`}
                    onClick={() => toggleStatut(user.id)}
                  >
                    {user.is_active ? "Désactiver" : "Activer"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <UserCreateForm
              onCancel={() => setShowModal(false)}
              onSuccess={handleUserCreated}
            />
          </div>
        </div>
      )}
    </div>
  );
}
