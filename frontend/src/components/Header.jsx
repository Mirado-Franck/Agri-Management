import React from 'react';
import './css/Header.css';

function Header({ userInitial = 'M' }) {
  return (
    <header>
      <div className="user-circle">
        <div>{userInitial}</div>
      </div>
    </header>
  );
}

export default Header;