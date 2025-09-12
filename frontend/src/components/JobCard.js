import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return null;
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch (e) {
    return null;
  }
};

// Helper to extract salary information
const extractSalaryInfo = (job) => {
  if (job.job_salary_min && job.job_salary_max) {
    const currency = job.job_salary_currency || 'USD';
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    });
    
    return {
      min: formatter.format(job.job_salary_min),
      max: formatter.format(job.job_salary_max),
      period: job.job_salary_period?.toLowerCase() || 'year'
    };
  }
  return null;
};

const JobCard = ({ job }) => {
  const [expanded, setExpanded] = useState(false);
  console.log("Rendering job:", job);

  // Extract common fields from different API formats
  const jobId = job.job_id || job.id || `job-${Math.random().toString(36).substring(2, 9)}`;
  const jobTitle = job.job_title || job.title || job.role || "Untitled Position";
  const companyName = job.employer_name || job.company_name || job.company || "Company Not Specified";
  
  // Handle location formats
  let location = "";
  if (job.job_city && job.job_country) {
    location = `${job.job_city}, ${job.job_country}`;
  } else if (job.job_city) {
    location = job.job_city;
  } else if (job.job_country) {
    location = job.job_country;
  } else if (job.candidate_required_location) {
    location = job.candidate_required_location;
  } else if (job.location) {
    location = job.location;
  }
  
  // Job apply link
  const jobLink = job.job_apply_link || job.url || job.application_url || "#";
  
  // Job posting date
  const postedDate = formatDate(job.job_posted_at_timestamp ? new Date(job.job_posted_at_timestamp * 1000) : job.publication_date);
  
  // Job description
  const description = job.job_description || job.description || job.text || "";
  
  // Job employment type
  const employmentType = job.job_employment_type || job.employment_type || job.job_type || "";
  
  // Is job remote
  const isRemote = job.job_is_remote || job.remote || location?.toLowerCase().includes('remote');
  
  // Salary information
  const salary = extractSalaryInfo(job);
  
  // Job highlights
  const highlights = job.job_highlights || {};
  
  // Company logo
  const logo = job.employer_logo || job.company_logo || null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-start">
        {logo && (
          <div className="mr-4 flex-shrink-0">
            <img 
              src={logo} 
              alt={`${companyName} logo`} 
              className="h-12 w-12 object-contain rounded"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800">{jobTitle}</h3>
          <div className="mt-1 flex flex-wrap items-center text-sm">
            <span className="text-gray-700 font-medium">{companyName}</span>
            {location && (
              <>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-gray-600">{location}</span>
              </>
            )}
            {postedDate && (
              <>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-gray-500">{postedDate}</span>
              </>
            )}
          </div>
          
          <div className="mt-3 flex flex-wrap gap-2">
            {employmentType && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {employmentType}
              </span>
            )}
            {isRemote && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                Remote
              </span>
            )}
            {salary && (
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                {salary.min} - {salary.max} / {salary.period}
              </span>
            )}
          </div>
          
          {description && (
            <div className="mt-4 text-gray-600">
              <p className={`${expanded ? '' : 'line-clamp-3'}`}>
                {description}
              </p>
              {description.length > 200 && (
                <button 
                  onClick={() => setExpanded(!expanded)} 
                  className="text-blue-600 hover:text-blue-800 mt-2 text-sm font-medium"
                >
                  {expanded ? 'Show less' : 'Read more'}
                </button>
              )}
            </div>
          )}
          
          {highlights && Object.keys(highlights).length > 0 && expanded && (
            <div className="mt-4 space-y-3">
              {Object.entries(highlights).map(([title, items]) => (
                <div key={title}>
                  <h4 className="text-sm font-semibold text-gray-700">{title}</h4>
                  <ul className="mt-1 list-disc list-inside text-sm text-gray-600 space-y-1">
                    {Array.isArray(items) && items.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-6 flex flex-wrap gap-3 justify-between items-center">
            <Link 
              to={`/apply/${jobId}`}
              state={{ job: job }}
              className="btn btn-primary bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Apply Now
            </Link>
            
            <div className="flex gap-3">
              <button className="text-gray-500 hover:text-blue-600 font-medium text-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
                Save
              </button>
              
              <a 
                href={jobLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
                View Original
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
