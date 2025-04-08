
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Profile: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin/profile" replace />;
    case 'trainer':
      return <Navigate to="/trainer/profile" replace />;
    case 'member':
    default:
      return <Navigate to="/member/profile" replace />;
  }
};

export default Profile;
