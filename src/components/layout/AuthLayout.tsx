
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex">
      {/* Left side with image or gradient background */}
      <div className="hidden lg:flex lg:w-1/2 bg-gym-secondary relative overflow-hidden">
        <div className="absolute inset-0 gym-gradient opacity-90"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-12">
          <h1 className="text-4xl font-bold mb-6">GYM LIFE SYSTEM</h1>
          <p className="text-xl max-w-md text-center">
            Transform your fitness journey with our advanced gym management platform.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 max-w-md">
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-2">Members</h3>
              <p className="text-sm">Access workouts, schedule classes, and track your progress</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-2">Trainers</h3>
              <p className="text-sm">Manage clients, create programs, and optimize schedules</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-2">Classes</h3>
              <p className="text-sm">Book sessions, explore new activities and improve skills</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-2">Progress</h3>
              <p className="text-sm">Track goals, metrics, and celebrate your achievements</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side with form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link to="/" className="inline-block mb-6">
              <h1 className="text-3xl font-bold text-gym-accent">GYMLIFE</h1>
            </Link>
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
