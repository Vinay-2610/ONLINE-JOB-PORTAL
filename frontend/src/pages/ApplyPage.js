import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { submitApplication } from '../services/api';

const ApplyPage = () => {
  const { jobId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const job = location.state?.job;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    coverLetter: '',
    resume: null,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resumeFileName, setResumeFileName] = useState('');
  
  if (!job) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Not Found</h2>
        <p className="text-gray-600 mb-6">Sorry, we couldn't find the job details.</p>
        <button
          onClick={() => navigate('/')}
          className="btn btn-primary"
        >
          Go Back to Search
        </button>
      </div>
    );
  }
  
  // Handle different API formats (JSearch or Remotive)
  const isJSearch = job.job_id || job.job_apply_link;
  const jobTitle = isJSearch ? job.job_title : job.title;
  const companyName = isJSearch ? job.employer_name : job.company_name;
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file.');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should be less than 5MB.');
        return;
      }
      
      setFormData({ ...formData, resume: file });
      setResumeFileName(file.name);
      setError(null);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.resume) {
      setError('Please upload your resume.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Create FormData object for file upload
      const data = new FormData();
      data.append('job_id', jobId);
      data.append('job_title', jobTitle);
      data.append('company', companyName);
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('resume', formData.resume);
      data.append('cover_letter', formData.coverLetter);
      
      await submitApplication(data);
      
      // Redirect to applications page on success
      navigate('/applications', { 
        state: { message: 'Application submitted successfully!' } 
      });
    } catch (err) {
      console.error('Error submitting application:', err);
      setError('Failed to submit application. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Apply for: {jobTitle}
        </h2>
        <p className="text-lg text-gray-600">
          {companyName}
        </p>
      </div>
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 p-4 rounded-md text-red-700 mb-6">
              {error}
            </div>
          )}
          
          <div className="mb-6">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="resume" className="form-label">
              Resume (PDF only, max 5MB)
            </label>
            <div className="flex items-center">
              <input
                type="file"
                id="resume"
                name="resume"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="resume"
                className="btn btn-secondary cursor-pointer"
              >
                Select File
              </label>
              {resumeFileName && (
                <span className="ml-3 text-gray-600">
                  {resumeFileName}
                </span>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="coverLetter" className="form-label">
              Cover Letter
            </label>
            <textarea
              id="coverLetter"
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleChange}
              rows="6"
              className="form-input"
              required
            ></textarea>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyPage;
