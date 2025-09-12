import axios from 'axios';

// Use relative URLs in production and localhost in development
const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:8000';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle authentication errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

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

// Job application API (now requires authentication)
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

// Get applications API (now user-specific)
export const getApplications = async () => {
  try {
    const response = await apiClient.get('/applications');
    // Backend now returns { status, count, data } structure
    // Extract the data array from the response
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
};

// Authentication APIs
export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post('/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post('/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await apiClient.get('/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Chatbot API
export const sendChatMessage = async (message) => {
  try {
    const response = await apiClient.post('/chatbot', { message });
    return response.data;
  } catch (error) {
    console.error('Error sending chat message:', error);
    
    // Handle specific API overload scenarios with fallback responses
    if (error.response?.status === 503 || 
        error.message?.includes('503') || 
        error.message?.includes('busy') || 
        error.message?.includes('overload')) {
      return {
        status: 'success',
        message: "🤖 I'm currently experiencing high traffic! Here's a quick career tip: Focus on building skills in high-demand areas like cloud computing, AI/ML, web development, and data science. Tech companies like Google, Microsoft, Amazon are actively hiring for these roles! Check job boards like LinkedIn, Indeed, and AngelList.",
        timestamp: new Date().toISOString()
      };
    }
    
    // For other errors, provide a generic helpful response
    if (error.response?.status === 500) {
      return {
        status: 'success',
        message: "💼 While I'm temporarily unavailable, here are some job search tips: 1) Tailor your resume for each application, 2) Network actively on LinkedIn, 3) Prepare for technical interviews, 4) Keep learning new skills, 5) Follow up on applications professionally.",
        timestamp: new Date().toISOString()
      };
    }
    
    throw error;
  }
};
