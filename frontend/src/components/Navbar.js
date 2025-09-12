import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-primary">
            Check-It
          </Link>
          
          <div className="flex items-center space-x-6">
            {isAuthenticated() ? (
              <>
                <Link to="/" className="text-gray-600 hover:text-primary">
                  Home
                </Link>
                <Link to="/applications" className="text-gray-600 hover:text-primary">
                  My Applications
                </Link>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">
                    Welcome, <span className="font-medium">{user?.name}</span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-primary px-4 py-2 rounded transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
