import React from 'react';
import { AiOutlinePlus, AiOutlineMinus, AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import './css/Modal.css';

export default function Modal({ 
  isOpen, 
  onClose, 
  selectedStock, 
  actionType, 
  quantity, 
  setQuantity, 
  onSubmit 
}) {
  if (!isOpen) return null;

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

          <form
            onSubmit={e => {
              e.preventDefault();
              onSubmit();
            }}
            className="modal-form"
          >
            <label htmlFor="quantity" className="modal-input-label">Quantité :</label>
            <input
              type="number"
              id="quantity" 
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="1"
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
