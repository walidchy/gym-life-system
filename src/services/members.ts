
import api from './api';
import { Member, Membership, Booking, Payment, ApiResponse } from '../types';


// services/members.ts
export const getMembers = async (): Promise<Member[]> => {
  try {
    const response = await api.get<ApiResponse<{
      current_page: number;
      data: Member[];
    }>>('/members');
    
    return response.data.data.data || [];
  } catch (error) {
    console.error('Error fetching members:', error);
    return [];
  }
};

export const deleteMember = async (memberId: number): Promise<void> => {
  try {
    await api.delete(`/members/${memberId}`);
  } catch (error) {
    console.error('Error deleting member:', error);
    throw error;
  }
};

export const updateMemberProfile = async (memberData: Partial<Member>): Promise<Member> => {
  const response = await api.put<ApiResponse<Member>>('/member/profile', memberData);
  return response.data.data;
};

export const updateMember = async (): Promise<Membership[]> => {
  const response = await api.get<ApiResponse<Membership[]>>('/member/memberships');
  return response.data.data;
};
export const getMemberMemberships = async (): Promise<Membership[]> => {
  const response = await api.get<ApiResponse<Membership[]>>('/member/memberships');
  return response.data.data;
};

export const getMemberBookings = async (): Promise<Booking[]> => {
  const response = await api.get<ApiResponse<Booking[]>>('/member/bookings');
  return response.data.data;
};

export const createBooking = async (bookingData: { activity_id: number, activity_schedule_id?: number, date: string }): Promise<Booking> => {
  const response = await api.post<ApiResponse<Booking>>('/member/bookings', bookingData);
  return response.data.data;
};

export const cancelBooking = async (bookingId: number, cancellation_reason?: string): Promise<Booking> => {
  const response = await api.put<ApiResponse<Booking>>(`/member/bookings/${bookingId}/cancel`, { cancellation_reason });
  return response.data.data;
};

export const getMemberPayments = async (): Promise<Payment[]> => {
  const response = await api.get<ApiResponse<Payment[]>>('/member/payments');
  return response.data.data;
};

export const makePayment = async (paymentData: { 
  membership_plan_id: number,
  payment_method: string,
  amount: number
}): Promise<Payment> => {
  const response = await api.post<ApiResponse<Payment>>('/member/payments', paymentData);
  return response.data.data;
};
