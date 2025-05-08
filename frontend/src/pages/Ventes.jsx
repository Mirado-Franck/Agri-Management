import React, { useState } from 'react';
import './css/Ventes.css';

import Searchbar from '../components/Searchbar'
import VenteForm from '../components/VenteForm'; // Assure-toi que le chemin est correct

import { FaEye, FaPlus } from "react-icons/fa"
import { PiPrinter } from "react-icons/pi"
import { IoMdClose } from "react-icons/io";

export default function Ventes() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className='ventes-container'>
      <div className="ventes-header">
        <div className="button-group">
          <button className="btn" onClick={() => setShowModal(true)}>
            <FaPlus />
          </button>
        </div>
        <div>
          <Searchbar />
        </div>
      </div>

      <div className="table-wrapper">
        <table className="styled-table">
          <thead>
            <tr>
              <th>#</th>
              <th>N° du vente</th>
              <th>Date du vente</th>
              <th>Client</th>
              <th>Montant total</th>
              <th>Employé</th>
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 30 }, (_, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>0{i + 1}{i + 5}1{ i * i}</td>
                <td>0{i + 1}-05-2025</td>
                <td>Liva</td>
                <td>{i + 2} 1 {i * 10}.00Ar</td>
                <td>Admin</td>
                <td className="table-actions">
                  <button className="modern-button view-btn">
                    <FaEye />
                  </button>
                  <button className="modern-button print-btn">
                    <PiPrinter />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL FLOTTANTE */}
      {showModal && (

          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-btn" onClick={() => setShowModal(false)}><IoMdClose size={20}/></button>
              <VenteForm />
            </div>
          </div>

      )}
    </div>
  );
}
