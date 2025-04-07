
import api from './api';
import { User, ApiResponse } from '../types';

export const getTrainers = async (queryParams?: string): Promise<ApiResponse<User[]>> => {
  try {
    const url = `/trainers${queryParams ? `?${queryParams}` : ''}`;
    const response = await api.get<ApiResponse<{
      current_page: number;
      data: User[];
    }>>(url);
    
    // Return the proper data structure
    return {
      ...response.data,
      data: response.data.data.data || []
    };
  } catch (error) {
    console.error('Error fetching trainers:', error);
    return { data: [], status: "error" };
  }
};

export const deleteTrainer = async (userId: number): Promise<void> => {
  try {
    await api.delete(`/trainers/${userId}`);
  } catch (error) {
    console.error('Error deleting trainer:', error);
    throw error;
  }
};
