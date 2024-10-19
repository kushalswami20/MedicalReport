// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PatientForm from './components/PatientForm';
import PatientList from './components/PatientList';
import MetaMaskConnector from './components/MetaMaskConnector';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<MetaMaskConnector />} />
            <Route path="/patient-list" element={<PatientList />} />
            <Route path="/add-patient" element={<PatientForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;