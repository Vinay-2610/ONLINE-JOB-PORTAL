import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getApplications } from '../services/api';

const ApplicationsPage = () => {
  const location = useLocation();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');
  
  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await getApplications();
        setApplications(data);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Failed to load your applications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplications();
    
    // Clear success message after 5 seconds
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [successMessage]);
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        My Applications
      </h2>
      
      {successMessage && (
        <div className="bg-green-50 p-4 rounded-md text-green-700 mb-6">
          {successMessage}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md text-red-700">
          {error}
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-blue-50 p-6 rounded-md text-blue-700 text-center">
          <h3 className="text-xl font-semibold mb-2">No applications yet</h3>
          <p>When you apply for jobs, they will appear here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => (
            <div key={app.id} className="card border-l-4 border-primary">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{app.job_title}</h3>
                  <p className="text-gray-600 mt-1">{app.company}</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <span className="text-gray-500">
                    Applied on {formatDate(app.applied_at)}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Applicant</h4>
                    <p className="mt-1">{app.name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Email</h4>
                    <p className="mt-1">{app.email}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-500">Resume</h4>
                  <p className="mt-1">{app.resume_filename}</p>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-500">Cover Letter</h4>
                  <p className="mt-1 text-gray-700 whitespace-pre-line">{app.cover_letter}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;
