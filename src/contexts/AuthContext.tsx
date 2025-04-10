
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { getCurrentUser } from '../services/auth';
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

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('You have been logged out successfully');
    navigate('/login');
  };

  const redirectBasedOnRole = (isAuth: boolean) => {
    if (!isAuth || !user) return;
    
    // Get the base path of the current location to check what section we're in
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const currentSection = pathSegments[0] || '';
    
    // Define the correct base path for each role
    const rolePaths = {
      admin: 'admin',
      trainer: 'trainer',
      member: ''
    };
    
    // Check if the user is in a section that doesn't match their role
    const userRole = user.role as keyof typeof rolePaths;
    const correctSection = rolePaths[userRole];
    
    // If user is on dashboard, profile, or in wrong section, redirect to the correct page
    if (
      (location.pathname === '/dashboard' || location.pathname === '/profile') ||
      (
        currentSection !== correctSection && 
        currentSection !== '' && // Allow access to root routes
        !(correctSection === '' && currentSection === 'activities') && // Allow members to access /activities
        !(correctSection === '' && currentSection === 'bookings') && // Allow members to access /bookings
        !(correctSection === '' && currentSection === 'membership') && // Allow members to access /membership
        !(correctSection === '' && currentSection === 'member')  // Allow members to access /member routes
      )
    ) {
      const redirectPath = userRole === 'member' ? '/dashboard' : `/${userRole}/profile`;
      navigate(redirectPath);
    }
  };

  useEffect(() => {
    // Check authentication when the app loads
    checkAuth().then(isAuth => {
      if (isAuth && user) {
        redirectBasedOnRole(true);
      }
    });
    
    // Also check auth when navigating between protected routes
    const protectedRoutes = ['/dashboard', '/profile', '/activities', '/bookings', '/membership', '/member'];
    const adminRoutes = ['/admin', '/admin/members', '/admin/trainers', '/admin/activities', '/admin/memberships', '/admin/equipment', '/admin/profile', '/admin/verifications'];
    const trainerRoutes = ['/trainer', '/trainer/profile', '/trainer/activities', '/trainer/schedule', '/trainer/clients'];
    
    const allProtectedRoutes = [...protectedRoutes, ...adminRoutes, ...trainerRoutes];
    
    if (allProtectedRoutes.some(route => location.pathname.startsWith(route))) {
      checkAuth().then(isAuth => {
        if (!isAuth && !isLoading) {
          navigate('/login');
        } else if (isAuth && user) {
          redirectBasedOnRole(true);
        }
      });
    }
  }, [location.pathname]);

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
