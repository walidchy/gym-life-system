import api from './api';
import { Membership, ApiResponse } from '../types';

export const getMemberships = async (queryParams?: string): Promise<Membership[]> => {
  try {
    const response = await api.get<ApiResponse<Membership[]>>(`/memberships${queryParams ? `?${queryParams}` : ''}`);

    if (Array.isArray(response.data)) {
      return response.data.map(m => ({
        ...m,
        // Check if 'features' is a string, and only parse it if it's a string
        features: typeof m.features === 'string' ? JSON.parse(m.features) : m.features || []
      }));
    } else if (response.data?.data) {
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


// export const getMemberships = async (queryParams?: string): Promise<Membership[]> => {
//   try {
//     const response = await api.get<ApiResponse<Membership[]>>(`/memberships${queryParams ? `?${queryParams}` : ''}`);
    
//     // Handle different possible response structures
//     if (Array.isArray(response.data)) {
//       // If response.data is already the array
//       return response.data.map(m => ({
//         ...m,
//         features: typeof m.features === 'string' ? JSON.parse(m.features) : m.features || []
//       }));
//     } else if (response.data?.data) {
//       // If response.data has a data property
//       const data = Array.isArray(response.data.data) ? response.data.data : [];
//       return data.map(m => ({
//         ...m,
//         features: typeof m.features === 'string' ? JSON.parse(m.features) : m.features || []
//       }));
//     }
    
//     return [];
//   } catch (error) {
//     console.error('Error fetching memberships:', error);
//     throw error;
//   }
// };

// ... keep other functions the same

export const deleteMembership = async (membershipId: number): Promise<void> => {
  try {
    await api.delete(`/membership-plans/${membershipId}`);
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

export const createBooking = async ({ membership_plan_id }: { membership_plan_id: number }) => {
  const response = await api.post('/bookings', { membership_plan_id });
  return response.data;
};



