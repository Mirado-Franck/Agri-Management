import React from 'react'
import {Link} from 'react-router-dom'

export default function Sidebar() {
  return (
  <>
      <ul className="list-unstyled">
        
        <Link to="">
          <li>Tableau de bord</li>
        </Link>

        <Link to="/">
          <li>Produit</li>
        </Link>

        <Link to="/">
          <li>Stocks</li>
        </Link>

        <Link to="/">
          <li>Ventes</li>
        </Link>

        <Link to="/">
          <li>Achats</li>
        </Link>

        <Link to="/">
          <li>Statistiques</li>
        </Link>

        <Link to="/">
          <li>Paramètres</li>
        </Link>

      </ul>
  </>
  )
}
