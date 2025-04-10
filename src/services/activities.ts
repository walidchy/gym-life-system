import api from './api';
import { Activity, ActivitySchedule, ApiResponse } from '../types';

// Add this function with proper export


// Your existing functions should look like this:
export const getActivities = async (queryParams?: string): Promise<Activity[]> => {
  try {
    const url = `/activities${queryParams ? `?${queryParams}` : ''}`;
    const response = await api.get<ApiResponse<Activity[]>>(url);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching activities:', error);
    return [];
  }
};

export const deleteActivity = async (activityId: number): Promise<void> => {
  try {
    await api.delete(`/activities/${activityId}`);
  } catch (error) {
    console.error('Error deleting activity:', error);
    throw error;
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

export const updateActivity = async (activityData: Partial<Activity>): Promise<Activity> => {
  try {
    const response = await api.post<{ data: Activity }>('/activities', activityData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating activity:', error);
    throw error;
  }
};