import axios from 'axios';

const API_URL = 'http://localhost:8000';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Job search API
export const searchJobs = async (query, location, page = 1, category = '', filters = {}) => {
  try {
    const params = { 
      query,
      page
    };
    
    // Add optional parameters
    if (location) params.location = location;
    if (category && category !== 'all') params.category = category;
    
    // Add any additional filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key] = value;
    });
    
    console.log('Sending search request with params:', params);
    const response = await apiClient.get('/search', { params });
    return response.data;
  } catch (error) {
    console.error('Error searching jobs:', error);
    throw error;
  }
};

// Job application API
export const submitApplication = async (formData) => {
  try {
    const response = await apiClient.post('/apply', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting application:', error);
    throw error;
  }
};

// Get applications API
export const getApplications = async () => {
  try {
    const response = await apiClient.get('/applications');
    return response.data;
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
};
