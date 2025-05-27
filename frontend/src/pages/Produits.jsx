import React, { useState, useEffect } from 'react';
import './css/Produits.css';
import { toast } from 'sonner';
import { IoMdClose } from "react-icons/io";
import Searchbar from '../components/Searchbar.jsx';
import CrudButtons from '../components/CrudButtons.jsx';
import ProduitForm from '../components/ProduitForm.jsx';
import ProduitFormEdit from '../components/ProduitFormEdit.jsx';
import ConfirmationDialog from '../components/ConfirmationDialog';

export default function Produits() {
  const [showModal, setShowModal] = useState(false);
  const [produits, setProduits] = useState([]);
  const [erreur, setErreur] = useState(null);
  const [selectedProduits, setSelectedProduits] = useState([]);
  const [editingProduit, setEditingProduit] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [deleteCount, setDeleteCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const refreshProduits = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/produits/produits/");
      const data = await response.json();
      setProduits(data);
    } catch (error) {
      console.error("❌ Erreur fetch produits :", error);
      setErreur(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/produits/produits/");
        const data = await response.json();
        setProduits(data);
      } catch (error) {
        console.error("❌ Erreur fetch produits :", error);
        setErreur(error.message);
      }
    };
    fetchProduits();
  }, []);

  const isAllSelected = produits.length > 0 && selectedProduits.length === produits.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedProduits([]);
    } else {
      setSelectedProduits(produits.map(p => p.id));
    }
  };

  const handleSelectOne = (id) => {
    setSelectedProduits(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);

      const deleteRequests = selectedProduits.map(id =>
        fetch(`http://127.0.0.1:8000/api/produits/produits/${id}/`, {
          method: 'DELETE'
        })
      );

      const responses = await Promise.all(deleteRequests);
      const allSuccessful = responses.every(response => response.ok);

      if (allSuccessful) {
        toast.success(deleteCount > 1
          ? "Produits supprimés avec succès"
          : "Produit supprimé avec succès");
        refreshProduits();
        setSelectedProduits([]);
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setIsLoading(false);
      setShowConfirmDialog(false);
    }
  };

  const getFilteredProduits = () => {
    if (!searchTerm) return produits;

    return produits.filter(produit => {
      const matchesName = produit.nom_produit.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = produit.categorie_produit_nom?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesName || matchesCategory;
    });
  };

  const displayedProduits = getFilteredProduits();

  return (
    <div className="produits-container">
      <div className="produits-header">
        <CrudButtons
          loading={isLoading}
          selectedProduits={selectedProduits}
          onOpenModal={() => {
            setShowModal(true);
            setEditingProduit(null);
          }}
          onEdit={() => {
            if (selectedProduits.length === 1) {
              const produitToEdit = produits.find(p => p.id === selectedProduits[0]);
              setEditingProduit(produitToEdit);
              setShowModal(true);
            }
          }}
          onDelete={() => {
            setDeleteCount(selectedProduits.length);
            setShowConfirmDialog(true);
          }}
        />
        <div>
          <Searchbar
            onSearch={(text) => setSearchTerm(text)}
            placeholder="Rechercher un produit..."
          />
        </div>
      </div>

      {erreur && <div className="alert">{erreur}</div>}

      <div className="table-wrapper">
        <table className="styled-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={isAllSelected}
                  ref={input => {
                    if (input) input.indeterminate = selectedProduits.length > 0 && !isAllSelected;
                  }}
                />
              </th>
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
            {displayedProduits.length > 0 ? (
              displayedProduits.map((produit, index) => (
                <tr key={produit.id || index}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedProduits.includes(produit.id)}
                      onChange={() => handleSelectOne(produit.id)}
                    />
                  </td>
                  <td>{index + 1}</td>
                  <td>{produit.nom_produit || 'N/A'}</td>
                  <td>{produit.categorie_produit_nom || '-'}</td>
                  <td>{produit.date_ajout ? new Date(produit.date_ajout).toLocaleDateString() : '-'}</td>
                  <td>{produit.prix_unitaire || '0'} Ar</td>
                  <td>{produit.stock_actuel ?? '–'} kg</td>
                  <td>{produit.seuil_alerte || '0'} kg</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-results">
                  {searchTerm ? "Aucun résultat trouvé" : "Chargement..."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => {
              setShowModal(false);
              setEditingProduit(null);
            }}>
              <div className='rond'><IoMdClose size={20} /></div>
            </button>

            {editingProduit ? (
              <ProduitFormEdit
                produit={editingProduit}
                onClose={() => {
                  setShowModal(false);
                  setEditingProduit(null);
                }}
                onRefreshProduits={refreshProduits}
              />
            ) : (
              <ProduitForm
                onClose={() => setShowModal(false)}
                onRefreshProduits={refreshProduits}
              />
            )}
          </div>
        </div>
      )}

      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirmDialog(false)}
        title={deleteCount > 1 ? "Supprimer plusieurs produits" : "Supprimer le produit"}
        message={
          deleteCount > 1
            ? `Voulez-vous vraiment supprimer ces ${deleteCount} produits ?`
            : "Voulez-vous vraiment supprimer ce produit ? Cette action est irréversible."
        }
      />
    </div>
  );
}
