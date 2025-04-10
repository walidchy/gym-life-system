
import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LandingPage from './LandingPage';
import Dashboard from './Dashboard';
import { useNavigate } from 'react-router-dom';

const Index: React.FC = () => {
  const { isAuthenticated, isLoading, checkAuth, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check auth status when component mounts
    const verifyAuth = async () => {
      const isAuth = await checkAuth();
      
      // If authenticated, redirect based on role
      if (isAuth && user) {
        switch (user.role) {
          case 'admin':
            navigate('/admin/profile');
            break;
          case 'trainer':
            navigate('/trainer/profile');
            break;
          case 'member':
            navigate('/dashboard');
            break;
          default:
            navigate('/dashboard');
        }
      }
    };
    
    verifyAuth();
  }, [checkAuth, user, navigate]);

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
