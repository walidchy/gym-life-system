
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layout/MainLayout';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      switch (user.role) {
        case 'admin':
          navigate('/admin/profile');
          break;
        case 'trainer':
          navigate('/trainer/profile');
          break;
        case 'member':
        default:
          navigate('/member/profile');
          break;
      }
    }
  }, [user, navigate]);

  return (
    <MainLayout>
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gym-primary"></div>
      </div>
    </MainLayout>
  );
};

export default Profile;
