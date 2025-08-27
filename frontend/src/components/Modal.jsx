import React from 'react';
import { AiOutlinePlus, AiOutlineMinus, AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import { toast } from 'sonner';
import './css/Modal.css';

export default function Modal({ 
  isOpen, 
  onClose, 
  selectedStock, 
  actionType, 
  quantity, 
  setQuantity, 
  onSubmit,
  maxQuantity 
}) {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  // Gestion du changement de quantité
  const handleQuantityChange = (value) => {
    const saisie = Number(value);
    if (!Number.isFinite(saisie) || saisie < 1) {
      toast.error('La quantité doit être au moins 1.', {
        style: { 
          background: '#f44336', 
          color: '#fff', 
          border: 'none' 
        },
      });
      setQuantity(1);
    } else {
      setQuantity(saisie);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">
          {actionType === 'add' ? (
            <>
              <AiOutlinePlus /> Ajouter au stock
            </>
          ) : (
            <>
              <AiOutlineMinus /> Retirer du stock
            </>
          )}
        </h2>

        <div className="modal-body">
          <p className="modal-label">
            Produit : <strong>{selectedStock?.produit_nom}</strong>
          </p>
          <p className="modal-label">
            Stock actuel : <strong>{selectedStock?.quantite || 0}</strong>
          </p>

          <form
            onSubmit={handleSubmit}
            className="modal-form"
          >
            <label htmlFor="quantity" className="modal-input-label">Quantité :</label>
            <input
              type="number"
              id="quantity" 
              value={quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              min="1"
              max={actionType === 'retirer' ? maxQuantity || 1 : undefined}
              required
              className="modal-input"
            />

            <div className="modal-actions">
              <button type="submit" className="modal-submit-button">
                <AiOutlineCheck /> Valider
              </button>
              <button 
                type="button" 
                className="modal-cancel-button" 
                onClick={onClose}
              >
                <AiOutlineClose /> Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}