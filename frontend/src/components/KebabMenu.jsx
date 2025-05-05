import React, { useState, useRef, useEffect } from 'react';
import { FaFilter } from 'react-icons/fa';
import './css/KebabMenu.css';

export default function KebabMenu() {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);

  const toggleMenu = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 5, // petit décalage
        left: rect.left,
      });
    }
    setOpen(!open);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (open && !btnRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="kebab-menu">
      <button className="kebab-btn" ref={btnRef} onClick={toggleMenu}>
        <FaFilter size={16} />
      </button>
      {open && (
        <div
          className="kebab-dropdown"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
        >
          <ul>
            <li>Filtrer</li>
            <li>Trier par date</li>
            <li>Exporter</li>
          </ul>
        </div>
      )}
    </div>
  );
}
