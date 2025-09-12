import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">Job Portal</h3>
            <p className="text-gray-400 mt-2">Find your dream job today</p>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <p className="text-gray-400">&copy; {new Date().getFullYear()} Job Portal. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
