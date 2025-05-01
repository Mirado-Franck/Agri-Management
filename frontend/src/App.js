import React from 'react';
import Sidebar from './Components/sidebar/sidebar.jsx'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom'


export default function App() {
  return (
    <div className="p-3 bg-light" style={{ minHeight: '100vh', width: '200px' }}>
      <Router>
        <Sidebar />

      </Router>

    </div>
  );
}
