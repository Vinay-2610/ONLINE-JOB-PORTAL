import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import ApplyPage from './pages/ApplyPage';
import ApplicationsPage from './pages/ApplicationsPage';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              } />
              <Route path="/search" element={
                <ProtectedRoute>
                  <SearchResultsPage />
                </ProtectedRoute>
              } />
              <Route path="/apply/:jobId" element={
                <ProtectedRoute>
                  <ApplyPage />
                </ProtectedRoute>
              } />
              <Route path="/applications" element={
                <ProtectedRoute>
                  <ApplicationsPage />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
