// src/components/Navbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              Medical Records
            </Link>
          </div>
          
          <div className="flex space-x-4">
          <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-blue-50'
              }`}
            >
                Home
            </Link>
            <Link
              to="/patient-list"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/patient-list'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-blue-50'
              }`}
            >
              Patient List
            </Link>
            <Link
              to="/add-patient"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/add-patient'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-blue-50'
              }`}
            >
              Add Patient
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;