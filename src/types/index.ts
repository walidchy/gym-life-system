export interface User {
  id: number;
  name: string;
  email: string;
  role: 'member' | 'trainer' | 'admin';
  is_verified: boolean;
  avatar?: string;
}

export interface Member {
  user_id: number;
  birth_date?: string;
  gender?: 'male' | 'female';
  address?: string;
  phone?: string;
  emergency_contact?: string;
  health_conditions?: string;
}

export interface Trainer {
  user_id: number;
  specialization?: string;
  bio?: string;
  experience_years?: number;
  certifications?: string[];
  phone?: string;
}

export interface Admin {
  user_id: number;
  position?: string;
  department?: string;
  phone?: string;
}

export interface MembershipPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  duration_days: number;
  features: string[];
  is_active: boolean;
}

export interface Membership {
  id: number;
  user_id: number;
  membership_plan_id: number;
  membership_plan?: MembershipPlan;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export interface Activity {
  id: number;
  name: string;
  description: string;
  trainer_id?: number;
  trainer_name?: string;
  category: string;
  difficulty_level: string;
  duration_minutes: number;
  max_participants: number;
  location: string;
  equipment_needed?: string[];
  schedules?: ActivitySchedule[];
}

export interface ActivitySchedule {
  id: number;
  activity_id: number;
  day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  start_time: string;
  end_time: string;
  is_recurring: boolean;
  specific_date?: string;
}

export interface Booking {
  id: number;
  user_id: number;
  activity_id: number;
  activity?: Activity;
  activity_schedule_id?: number;
  date: string;
  status: 'upcoming' | 'completed' | 'canceled';
  cancellation_reason?: string;
}

export interface Equipment {
  id: number;
  name: string;
  description?: string;
  category: string;
  quantity: number;
  purchase_date?: string;
  maintenance_date?: string;
  status: 'available' | 'in_use' | 'maintenance' | 'retired';
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  is_read: boolean;
  type: string;
  created_at: string;
}

export interface Payment {
  id: number;
  user_id: number;
  membership_plan_id?: number;
  membership_plan?: MembershipPlan;
  amount: number;
  payment_method: string;
  transaction_id?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_date: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role?: 'member' | 'trainer' | 'admin';
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: string;
}
