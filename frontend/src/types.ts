export interface User {
  id: string;
  userId?: string; // private handle — only present for the current user, never in community data
  name: string;
  joinedAt: string;
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  icon: string;
  createdAt: string;
}

export interface CheckIn {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
}

export type Screen =
  | { type: 'join' }
  | { type: 'habits' }
  | { type: 'community' }
  | { type: 'habit-detail'; habitId: string; ownerId: string; returnTo: 'habits' | 'community' };
