
import api from './api';
import { User, ApiResponse } from '@/types';

export const getProfile = async (): Promise<User> => {
  try {
    const response = await api.get<ApiResponse<User>>('/profile');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

export const updateProfile = async (data: Partial<User>) => {
  try {
    const response = await api.put<ApiResponse<User>>('/profile', data);
    return response.data.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const updatePassword = async (data: {
  current_password: string;
  new_password: string;
}) => {
  try {
    await api.put('/profile/password', data);
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};
