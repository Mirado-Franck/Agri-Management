import React, { useState, useEffect } from 'react';
import './css/Produits.css';
import { IoMdClose } from "react-icons/io";
import Searchbar from '../components/Searchbar.jsx';
import CrudButtons from '../components/CrudButtons.jsx';
import ProduitForm from '../components/ProduitForm.jsx';


export default function Produits() {
  const [showModal, setShowModal] = useState(false);
  const [produits, setProduits] = useState([]);
  const [erreur, setErreur] = useState(null);
  const refreshProduits = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/produits/produits/");
      const data = await response.json();
      setProduits(data);
    } catch (error) {
      console.error("❌ Erreur fetch produits :", error);
      setErreur(error.message);
    }
    
  };
  
  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/produits/produits/");
        const data = await response.json();
        console.log("📦 Réponse API produits :", data); // 👈 Ajoute cette ligne
        setProduits(data);
      } catch (error) {
        console.error("❌ Erreur fetch produits :", error);
        setErreur(error.message);
      }
      
    };
  
    fetchProduits();
  }, []);

  return (
    <div className="produits-container">
      <div className="produits-header">
        <CrudButtons onOpenModal={() => setShowModal(true)} />
        <div>
          <Searchbar />
        </div>
      </div>

      {erreur && <div className="alert">{erreur}</div>}

      <div className="table-wrapper">
        <table className="styled-table">
          <thead>
            <tr>
              <th><input type="checkbox" /></th>
              <th>#</th>
              <th>Nom produit</th>
              <th>Catégorie</th>
              <th>Date d'ajout</th>
              <th>Prix unitaire</th>
              <th>Stock actuel</th>
              <th>Seuil minimum</th>
            </tr>
          </thead>
          <tbody>
            {produits.map((produit, index) => (
              <tr key={produit.id}>
                <td><input type="checkbox" /></td>
                <td>{index + 1}</td>
                <td>{produit.nom_produit}</td>
                <td>{produit.categorie_produit_nom || '-'}</td>
                <td>{new Date(produit.date_ajout).toLocaleDateString()}</td>
                <td>{produit.prix_unitaire} Ar</td>
                <td>{produit.stock_actuel ?? '–'} kg</td>
                <td>{produit.seuil_alerte} kg</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL FLOTTANTE */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowModal(false)}>
              <div className='rond'>
                <IoMdClose size={20} />
              </div>
            </button>
            
              <ProduitForm
                onClose={() => setShowModal(false)}
                onRefreshProduits={refreshProduits}
              />
          </div>
        </div>
      )}

    </div>

  );
}
