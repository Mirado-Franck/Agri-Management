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
  const [userRole, setUserRole] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    // Récupérer les infos de l'utilisateur connecté
    axiosInstance.get('/auth/me/')
      .then(res => {
        setUserRole(res.data.role);
        setCurrentUserId(res.data.id);
      })
      .catch(() => {
        setUserRole(null);
        setCurrentUserId(null);
      });

    // Charger la liste des utilisateurs
    axiosInstance.get('/auth/users/')
      .then(res => {
        setUtilisateurs(res.data);
        setLoading(false);
      })
      .catch(() => {
        setErreur("Erreur lors du chargement des utilisateurs");
        setLoading(false);
      });
  }, []);

  const handleUserCreated = () => {
    axiosInstance.get('/auth/users/')
      .then(res => {
        setUtilisateurs(res.data);
        setShowModal(false);
      });
  };

  const toggleStatut = async (userId) => {
    try {
      const res = await axiosInstance.patch(`/auth/users/${userId}/toggle_active/`);
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
        <div></div>
        <button
          className="btn"
          onClick={() => setShowModal(true)}
          disabled={userRole !== 'admin'}
          title={userRole !== 'admin' ? "Seul un admin peut créer un utilisateur" : ""}
        >
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
            {utilisateurs.map((user, index) => {
              const isCurrentUser = user.id === currentUserId;
              const isActionDisabled = userRole !== 'admin' || isCurrentUser;

              return (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  <td>{user.is_active ? "Actif" : "Inactif"}</td>
                  <td>
                    <button
                      className={`btn ${user.is_active ? 'btn-danger' : 'btn-success'}`}
                      onClick={() => toggleStatut(user.id)}
                      disabled={isActionDisabled}
                      title={
                        userRole !== 'admin'
                          ? "Action réservée à l'admin"
                          : isCurrentUser
                          ? "Vous ne pouvez pas désactiver votre propre compte"
                          : ""
                      }
                    >
                      {user.is_active ? "Désactiver" : "Activer"}
                    </button>
                  </td>
                </tr>
              );
            })}
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
