
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { getCurrentUser, logout as logoutService } from '../services/auth';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  checkAuth: () => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const checkAuth = async (): Promise<boolean> => {
    setIsLoading(true);
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      setIsLoading(false);
      return false;
    }
    
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      localStorage.setItem('user', JSON.stringify(currentUser));
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Error checking authentication:', error);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      setUser(null);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      await logoutService();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      setUser(null);
      toast.success('You have been logged out successfully');
      navigate('/login');
    }
  };

  // This function ensures the user is redirected to the correct dashboard based on their role
  const redirectBasedOnRole = (user: User | null) => {
    if (!user) return;
    
    const currentPath = location.pathname;
    
    // Define the correct paths for each role
    let correctPath = '';
    switch (user.role) {
      case 'admin':
        correctPath = '/admin/profile';
        break;
      case 'trainer':
        correctPath = '/trainer/profile';
        break;
      case 'member':
      default:
        correctPath = '/dashboard';
        break;
    }
    
    // If user is on a generic path or wrong section, redirect to correct path
    if (currentPath === '/' || currentPath === '/login' || currentPath === '/dashboard') {
      navigate(correctPath);
      return;
    }
    
    // Check if user is in a section they shouldn't be in
    const pathSegments = currentPath.split('/').filter(Boolean);
    const currentSection = pathSegments[0] || '';
    
    // If admin trying to access member or trainer routes
    if (user.role === 'admin' && (currentSection === 'trainer' || !['admin', ''].includes(currentSection))) {
      navigate(correctPath);
      return;
    }
    
    // If trainer trying to access admin or member routes
    if (user.role === 'trainer' && (currentSection === 'admin' || (!['trainer', ''].includes(currentSection) && !currentPath.startsWith('/profile')))) {
      navigate(correctPath);
      return;
    }
    
    // If member trying to access admin or trainer routes
    if (user.role === 'member' && (currentSection === 'admin' || currentSection === 'trainer')) {
      navigate(correctPath);
      return;
    }
  };

  useEffect(() => {
    // Check authentication when the app loads
    checkAuth().then(isAuth => {
      if (isAuth && user) {
        redirectBasedOnRole(user);
      }
    });
  }, []);

  // Also check auth when navigating between protected routes
  useEffect(() => {
    if (user) {
      redirectBasedOnRole(user);
    } else if (
      location.pathname !== '/login' && 
      location.pathname !== '/register' && 
      location.pathname !== '/forgot-password' &&
      location.pathname !== '/'
    ) {
      checkAuth().then(isAuth => {
        if (!isAuth) {
          navigate('/login');
        } else if (user) {
          redirectBasedOnRole(user);
        }
      });
    }
  }, [location.pathname, user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        setUser,
        checkAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
