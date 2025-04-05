
import api from './api';
import { MembershipPlan, Membership, ApiResponse } from '../types';

export const getMembershipPlans = async (): Promise<MembershipPlan[]> => {
  const response = await api.get<ApiResponse<MembershipPlan[]>>('/membership-plans');
  return response.data.data;
};

export const getMembershipPlan = async (planId: number): Promise<MembershipPlan> => {
  const response = await api.get<ApiResponse<MembershipPlan>>(`/membership-plans/${planId}`);
  return response.data.data;
};

export const subscribeToPlan = async (planId: number): Promise<Membership> => {
  const response = await api.post<ApiResponse<Membership>>('/memberships', { membership_plan_id: planId });
  return response.data.data;
};

export const getCurrentMembership = async (): Promise<Membership> => {
  const response = await api.get<ApiResponse<Membership>>('/memberships/current');
  return response.data.data;
};

export const cancelMembership = async (membershipId: number): Promise<void> => {
  await api.put(`/memberships/${membershipId}/cancel`);
};
