import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchForm = ({ initialQuery = '', initialLocation = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const [category, setCategory] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    // Update form values if props change
    setQuery(initialQuery);
    setLocation(initialLocation);
  }, [initialQuery, initialLocation]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    // Build search params
    let searchParams = `?query=${encodeURIComponent(query)}`;
    if (location) searchParams += `&location=${encodeURIComponent(location)}`;
    if (category && category !== 'all') searchParams += `&category=${encodeURIComponent(category)}`;
    
    // Navigate to search results with query parameters
    navigate({
      pathname: '/search',
      search: searchParams,
    });
  };

  const jobCategories = [
    { id: 'all', name: 'All Categories' },
    { id: 'software-development', name: 'Software Development' },
    { id: 'data-science', name: 'Data Science & Analytics' },
    { id: 'design', name: 'Design' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'sales', name: 'Sales' },
    { id: 'customer-service', name: 'Customer Service' },
    { id: 'finance', name: 'Finance' },
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'hr', name: 'HR & Recruiting' },
    { id: 'project-management', name: 'Project Management' }
  ];

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Job title, keywords, or company"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="form-input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Location (city, state, remote)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="form-input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary whitespace-nowrap px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Search Jobs
          </button>
        </div>
        
        <div className="flex flex-wrap gap-3 mt-2">
          <div className="flex items-center">
            <label className="mr-2 text-gray-700 font-medium">Category:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-select px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {jobCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-2">
            {['Remote', 'Full-time', 'Part-time', 'Contract'].map(filter => (
              <label key={filter} className="flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out mr-1" 
                />
                <span className="text-sm">{filter}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
};

export default SearchForm;
