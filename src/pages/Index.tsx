
import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LandingPage from './LandingPage';
import Dashboard from './Dashboard';
import { useNavigate } from 'react-router-dom';

const Index: React.FC = () => {
  const { isAuthenticated, isLoading, checkAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check auth status when component mounts
    const verifyAuth = async () => {
      await checkAuth();
    };
    
    verifyAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gym-secondary"></div>
      </div>
    );
  }

  return isAuthenticated ? <Dashboard /> : <LandingPage />;
};

export default Index;
