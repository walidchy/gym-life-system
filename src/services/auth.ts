
import api from './api';
import { User, LoginCredentials, RegisterData, ApiResponse } from '../types';

export const login = async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
  const response = await api.post<ApiResponse<{ user: User; token: string }>>('/login', credentials);
  return response.data.data;
};

export const register = async (userData: RegisterData): Promise<{ user: User; token: string }> => {
  const response = await api.post<ApiResponse<{ user: User; token: string }>>('/register', userData);
  return response.data.data;
};

export const logout = async (): Promise<void> => {
  await api.post('/logout');
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<ApiResponse<User>>('/user');
  return response.data.data;
};

export const forgotPassword = async (email: string): Promise<void> => {
  await api.post('/forgot-password', { email });
};

export const resetPassword = async (token: string, email: string, password: string, password_confirmation: string): Promise<void> => {
  await api.post('/reset-password', {
    token,
    email,
    password,
    password_confirmation,
  });
};

export const updateProfile = async (userData: Partial<User>): Promise<User> => {
  const response = await api.put<ApiResponse<User>>('/user', userData);
  return response.data.data;
};
