import React from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import './css/Produits.css';
import Searchbar from '../components/Searchbar.jsx';
import CrudButtons from '../components/CrudButtons.jsx'

export default function Produits() {
  
  return (
    <div className="produits-container">
      <div className="produits-header">
          <CrudButtons/>
        <div>
          <Searchbar/>
      </div>
      </div>
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
              <th>Seuil minimun</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 30 }, (_, i) => (
              <tr key={i}>
                <td><input type="checkbox" /></td>
                <td>{i + 1}</td>
                <td>Produit {i + 1}</td>
                <td>Catégorie {i % 5}</td>
                <td>0{i + 1}-05-2024</td>
                <td>${100 + i * 5}</td>
                <td>{50 - i}kg</td>
                <td> {50 + i + 1} kg</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
