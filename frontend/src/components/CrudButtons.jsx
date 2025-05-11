import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import './css/Buttons.css';

function CrudButtons({ loading, selectedProduits, onOpenModal, onEdit, onDelete }) {
  const isEditDisabled = selectedProduits.length !== 1;
  const isDeleteDisabled = selectedProduits.length === 0;

  return (
    <div className="button-group">
      {/* Bouton Supprimer */}
      <button
        className={`btn btn-danger btn-appear delay-1 ${loading ? 'btn-loading' : ''}`}
        disabled={isDeleteDisabled || loading}
        onClick={onDelete}
      >
        <FaTrash />
      </button>

      {/* Bouton Modifier */}
      <button
        className={`btn btn-appear delay-2 ${isEditDisabled ? 'btn-disabled' : ''} ${loading ? 'btn-loading' : ''}`}
        disabled={isEditDisabled || loading}
        onClick={onEdit}
      >
        <FaEdit />
      </button>

      {/* Bouton Ajouter */}
      <button
        className={`btn btn-appear delay-3 ${loading ? 'btn-loading' : ''}`}
        disabled={loading}
        onClick={onOpenModal}
      >
        <FaPlus />
      </button>
    </div>
  );
}

export default CrudButtons;