import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-primary">
            Job Portal
          </Link>
          <div className="flex space-x-6">
            <Link to="/" className="text-gray-600 hover:text-primary">
              Home
            </Link>
            <Link to="/applications" className="text-gray-600 hover:text-primary">
              My Applications
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
