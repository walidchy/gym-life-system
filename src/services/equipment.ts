
import api from './api';
import { Equipment, ApiResponse } from '@/types';

export const getEquipment = async (): Promise<Equipment[]> => {
  try {
    // Update to match your actual API response structure
    const response = await api.get<{
      data: Equipment[],
      current_page: number,
      total: number,
      per_page: number,
      last_page: number
    }>('/equipment');
    
    // Return just the data array from the response
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching equipment:', error);
    throw error;
  }
};

export const deleteEquipment = async (id: number): Promise<void> => {
  try {
    await api.delete(`/equipment/${id}`);
  } catch (error) {
    console.error('Error deleting equipment:', error);
    throw error;
  }
};
