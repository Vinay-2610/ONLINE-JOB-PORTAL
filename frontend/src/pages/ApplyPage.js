import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { submitApplication } from '../services/api';

const ApplyPage = () => {
  const { jobId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const job = location.state?.job;

  const [formData, setFormData] = useState({
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
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Go Back
        </button>
      </div>
    );
  }

  const jobTitle = job.job_title || job.title;
  const companyName = job.employer_name || job.company_name || 'Unknown Company';

  // Handle text field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle resume upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File must be less than 5MB.');
        return;
      }
      setFormData({ ...formData, resume: file });
      setResumeFileName(file.name);
      setError(null);
    }
  };

  // Submit application
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.resume) {
      setError('Resume is required.');
      return;
    }

    if (!formData.coverLetter.trim()) {
      setError('Cover letter is required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      data.append('job_id', jobId);
      data.append('job_title', jobTitle);
      data.append('company', companyName);
      data.append('resume', formData.resume);
      data.append('cover_letter', formData.coverLetter); // ✅ match backend

      await submitApplication(data);

      navigate('/applications', {
        state: { message: 'Application submitted successfully!' }
      });
    } catch (err) {
      console.error(err);
      setError('Failed to submit application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-2">Apply for {jobTitle}</h2>
      <p className="text-gray-600 mb-2">{companyName}</p>
      
      {/* Show current user info */}
      <div className="bg-blue-50 p-4 rounded-md mb-6">
        <h3 className="font-medium text-blue-900 mb-2">Application Details</h3>
        <p className="text-blue-800"><strong>Name:</strong> {user?.name}</p>
        <p className="text-blue-800"><strong>Email:</strong> {user?.email}</p>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Resume (PDF)</label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          {resumeFileName && (
            <p className="text-sm text-gray-600 mt-1">Selected: {resumeFileName}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Cover Letter</label>
          <textarea
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleChange}
            rows="5"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Write a compelling cover letter explaining why you're the perfect fit for this position..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-md transition duration-200"
        >
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
};

export default ApplyPage;
