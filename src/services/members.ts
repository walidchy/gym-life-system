
import api from './api';
import { Member, Membership, Booking, Payment, ApiResponse } from '../types';

export const getMemberProfile = async (): Promise<Member> => {
  const response = await api.get<ApiResponse<Member>>('/member/profile');
  return response.data.data;
};

export const updateMemberProfile = async (memberData: Partial<Member>): Promise<Member> => {
  const response = await api.put<ApiResponse<Member>>('/member/profile', memberData);
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
