import React from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import './App.css';

export default function App() {
  return (
    <>
      <div className="app-layout">
        <Sidebar />
        <MainContent />
      </div>
    </>
  );
}

