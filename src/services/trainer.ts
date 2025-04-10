
import api from './api';
import { Activity, User, ApiResponse, Member } from '@/types';

// Fetch all trainer activities
export const getTrainerActivities = async (): Promise<ApiResponse<Activity[]>> => {
  try {
    const response = await api.get<ApiResponse<Activity[]>>('/trainers/activities');
    return response.data;
  } catch (error) {
    console.error('Error fetching trainer activities:', error);
    return { data: [], status: 'error' };
  }
};

export const getMembers = async (): Promise<ApiResponse<Member[]>> => {
  try {
    const response = await api.get<ApiResponse<Member[]>>('/members');
    return response.data;
  } catch (error) {
    console.error('Error fetching members:', error);
    return { data: [], status: 'error' };
  }
};

export const getTrainerSchedule = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await api.get<ApiResponse<any>>('/trainer/schedule');
    return response.data;
  } catch (error) {
    console.error('Error fetching trainer schedule:', error);
    return { data: [], status: 'error' };
  }
};

export const createActivity = async (activityData: Partial<Activity>): Promise<Activity> => {
  try {
    const response = await api.post<{ data: Activity }>('/activities', activityData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating activity:', error);
    throw error;
  }
};

export const updateActivity = async (activityId: number, activityData: Partial<Activity>): Promise<Activity> => {
  try {
    const response = await api.put<{ data: Activity }>(`/trainer/activities/${activityId}`, activityData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating activity:', error);
    throw error;
  }
};

export const deleteActivity = async (activityId: number): Promise<void> => {
  try {
    await api.delete(`/activities`);
  } catch (error) {
    console.error('Error deleting activity:', error);
    throw error;
  }
};
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



export const updateTrainer = async (userId: number): Promise<void> => {
  try {
    await api.delete(`/trainers/${userId}`);
  } catch (error) {
    console.error('Error deleting trainer:', error);
    throw error;
  }
};