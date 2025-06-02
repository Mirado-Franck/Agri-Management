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
            </tr>
          </thead>
          <tbody>
            {utilisateurs.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>{user.is_active ? "Actif" : "Inactif"}</td>
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
