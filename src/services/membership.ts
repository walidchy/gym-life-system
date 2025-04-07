import api from './api';
import { Membership, ApiResponse } from '../types';

export const getMemberships = async (queryParams?: string): Promise<Membership[]> => {
  try {
    const response = await api.get<ApiResponse<Membership[]>>(`/memberships${queryParams ? `?${queryParams}` : ''}`);
    
    // Handle different possible response structures
    if (Array.isArray(response.data)) {
      // If response.data is already the array
      return response.data.map(m => ({
        ...m,
        features: typeof m.features === 'string' ? JSON.parse(m.features) : m.features || []
      }));
    } else if (response.data?.data) {
      // If response.data has a data property
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      return data.map(m => ({
        ...m,
        features: typeof m.features === 'string' ? JSON.parse(m.features) : m.features || []
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching memberships:', error);
    throw error;
  }
};

// ... keep other functions the same

export const deleteMembership = async (membershipId: number): Promise<void> => {
  try {
    await api.delete(`/memberships/${membershipId}`);
  } catch (error) {
    console.error('Error deleting membership:', error);
    throw error;
  }
};

export const cancelMembership = async (membershipId: number): Promise<void> => {
  try {
    await api.put(`/memberships/${membershipId}/cancel`);
  } catch (error) {
    console.error('Error canceling membership:', error);
    throw error;
  }
};


export const getCurrentMembership = async (): Promise<Membership> => {
  const response = await api.get<ApiResponse<Membership>>('/memberships/current');
  return response.data.data;
};


