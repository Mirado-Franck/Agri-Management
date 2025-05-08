import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import './css/Buttons.css';

function CrudButtons({ loading, disabled }) {
  return (
    <div className="button-group">
      <button
        className={`btn btn-appear delay-1 ${loading ? 'btn-loading' : ''}`}
        disabled={disabled}
      >
        <FaTrash />
      </button>
      <button
        className={`btn btn-appear delay-2 ${loading ? 'btn-loading' : ''}`}
        disabled={disabled}
      >
        <FaEdit />
      </button>
      <button
        className={`btn btn-appear delay-3 ${loading ? 'btn-loading' : ''}`}
        disabled={disabled}
      >
        <FaPlus />
      </button>
    </div>
  );
}
 export default CrudButtons;