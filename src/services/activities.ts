
import api from './api';
import { Activity, ActivitySchedule, ApiResponse } from '../types';

export const getActivities = async (): Promise<Activity[]> => {
  const response = await api.get<ApiResponse<Activity[]>>('/activities');
  return response.data.data;
};

export const getActivity = async (activityId: number): Promise<Activity> => {
  const response = await api.get<ApiResponse<Activity>>(`/activities/${activityId}`);
  return response.data.data;
};

export const getActivitySchedules = async (activityId: number): Promise<ActivitySchedule[]> => {
  const response = await api.get<ApiResponse<ActivitySchedule[]>>(`/activities/${activityId}/schedules`);
  return response.data.data;
};

export const searchActivities = async (query: string): Promise<Activity[]> => {
  const response = await api.get<ApiResponse<Activity[]>>(`/activities/search?query=${query}`);
  return response.data.data;
};

export const getUpcomingActivities = async (): Promise<Activity[]> => {
  const response = await api.get<ApiResponse<Activity[]>>('/activities/upcoming');
  return response.data.data;
};

export const createActivity = async (activityData: Partial<Activity>): Promise<Activity> => {
  const response = await api.post<ApiResponse<Activity>>('/activities', activityData);
  return response.data.data;
};

export const updateActivity = async (activityId: number, activityData: Partial<Activity>): Promise<Activity> => {
  const response = await api.put<ApiResponse<Activity>>(`/activities/${activityId}`, activityData);
  return response.data.data;
};

export const deleteActivity = async (activityId: number): Promise<void> => {
  await api.delete(`/activities/${activityId}`);
};
