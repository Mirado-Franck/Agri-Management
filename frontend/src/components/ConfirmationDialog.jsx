import React from 'react';
import './css/ConfirmationDialog.css'; // Nous le créerons après

const ConfirmationDialog = ({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  title, 
  message 
}) => {
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="dialog-actions">
          <button className="cancel-btn" onClick={onCancel}>
            Annuler
          </button>
          <button className="confirm-btn" onClick={onConfirm}>
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;