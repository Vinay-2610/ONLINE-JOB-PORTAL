import React from 'react';
import SearchForm from '../components/SearchForm';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Find Your Dream Job Today
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Search thousands of jobs from top companies and apply with just a few clicks.
        </p>
      </div>
      
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
        <SearchForm />
      </div>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <div className="card text-center">
          <div className="text-primary text-4xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Search Jobs</h3>
          <p className="text-gray-600">Find the perfect job that matches your skills and experience.</p>
        </div>
        
        <div className="card text-center">
          <div className="text-primary text-4xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Apply Easily</h3>
          <p className="text-gray-600">Quick application process with your resume and cover letter.</p>
        </div>
        
        <div className="card text-center">
          <div className="text-primary text-4xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Track Applications</h3>
          <p className="text-gray-600">Keep track of all your job applications in one place.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
