export interface User {
  id: string;
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
