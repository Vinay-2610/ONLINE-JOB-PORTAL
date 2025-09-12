import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchJobs } from '../services/api';
import SearchForm from '../components/SearchForm';
import JobCard from '../components/JobCard';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const location = searchParams.get('location') || '';
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  
  const fetchJobs = useCallback(async (searchQuery, searchLocation, pageNum = 1) => {
    if (!searchQuery) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Fetching jobs with query: "${searchQuery}", location: "${searchLocation}", page: ${pageNum}`);
      const data = await searchJobs(searchQuery, searchLocation, pageNum);
      console.log("API response:", data);
      
      // Handle different API response formats
      let jobsData = [];
      let total = 0;
      
      if (data.data && Array.isArray(data.data)) {
        // JSearch API format or similar
        console.log("Using JSearch format, found", data.data.length, "jobs");
        jobsData = data.data;
        total = data.data.length;
      } else if (data.jobs && Array.isArray(data.jobs)) {
        // Remotive API format
        console.log("Using Remotive format, found", data.jobs.length, "jobs");
        jobsData = data.jobs;
        total = data.jobs.length;
      } else if (data.results && Array.isArray(data.results)) {
        // FindWork API format
        console.log("Using FindWork format, found", data.results.length, "jobs");
        jobsData = data.results;
        total = data.results.length;
      } else if (data.error) {
        // Error from API
        console.error("API returned error:", data.error);
        setError(data.error);
        jobsData = [];
      } else {
        console.log("Unknown API format or no jobs found");
        jobsData = [];
      }
      
      // If this is page 1, replace all jobs, otherwise append
      setJobs(prevJobs => pageNum === 1 ? jobsData : [...prevJobs, ...jobsData]);
      setTotalResults(total);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to fetch jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    // Reset page when search parameters change
    setPage(1);
    fetchJobs(query, location, 1);
  }, [query, location, fetchJobs]);
  
  const loadMoreJobs = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchJobs(query, location, nextPage);
  };

  const searchTitle = (() => {
    if (loading && page === 1) return 'Searching for jobs...';
    if (jobs.length === 0) return 'No jobs found';
    return `${jobs.length} Job${jobs.length !== 1 ? 's' : ''} Found for "${query}"${location ? ` in ${location}` : ''}`;
  })();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <SearchForm initialQuery={query} initialLocation={location} />
      </div>
      
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          {searchTitle}
        </h2>
        <div className="flex gap-2">
          <select 
            className="form-select text-sm" 
            aria-label="Sort by"
            onChange={(e) => console.log("Sort by:", e.target.value)}
          >
            <option value="relevance">Relevance</option>
            <option value="date">Date Posted</option>
            <option value="salary">Salary</option>
          </select>
        </div>
      </div>
      
      {loading && page === 1 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-6 rounded-md text-red-700">
          <h3 className="text-xl font-semibold mb-2">Error</h3>
          <p>{error}</p>
          <button 
            onClick={() => fetchJobs(query, location, 1)} 
            className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-yellow-50 p-6 rounded-md text-yellow-700 text-center">
          <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
          <p>Try adjusting your search terms or location.</p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <button 
              onClick={() => fetchJobs("developer", location, 1)} 
              className="px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-md transition-colors"
            >
              Search for "Developer"
            </button>
            <button 
              onClick={() => fetchJobs("engineer", location, 1)} 
              className="px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-md transition-colors"
            >
              Search for "Engineer"
            </button>
            <button 
              onClick={() => fetchJobs(query, "", 1)} 
              className="px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-md transition-colors"
            >
              Clear Location Filter
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6">
            {jobs.map((job) => (
              <JobCard 
                key={(job.job_id || job.id || Math.random().toString(36).substring(2, 9))} 
                job={job} 
              />
            ))}
          </div>
          
          {loading && page > 1 && (
            <div className="flex justify-center my-6">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
          
          <div className="mt-8 flex justify-center">
            <button 
              onClick={loadMoreJobs}
              disabled={loading}
              className="px-6 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-md transition-colors disabled:opacity-50"
            >
              Load More Jobs
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchResultsPage;
