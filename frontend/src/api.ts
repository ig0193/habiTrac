import type { User, Habit, CheckIn } from './types';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.detail ?? 'Something went wrong');
  }
  return res.json();
}

export class ApiError extends Error {
  constructor(status: number, message: string) {
    super(message);
  }
}

// ── Auth ──────────────────────────────────────────────

export async function joinUser(userId: string, name: string): Promise<User> {
  return request<User>('/api/join', {
    method: 'POST',
    body: JSON.stringify({ userId, name }),
  });
}

export async function loginUser(userId: string): Promise<User> {
  return request<User>('/api/login', {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
}

export async function getUsers(): Promise<User[]> {
  return request<User[]>('/api/users');
}

// ── Habits ────────────────────────────────────────────

export async function getHabits(userInternalId: string): Promise<Habit[]> {
  return request<Habit[]>(`/api/users/${userInternalId}/habits`);
}

export async function addHabit(userInternalId: string, name: string, icon: string): Promise<Habit> {
  return request<Habit>('/api/habits', {
    method: 'POST',
    body: JSON.stringify({ userId: userInternalId, name, icon }),
  });
}

export async function deleteHabit(habitId: string): Promise<void> {
  await request(`/api/habits/${habitId}`, { method: 'DELETE' });
}

// ── Check-ins ─────────────────────────────────────────

export async function getCheckIns(habitId: string): Promise<CheckIn[]> {
  return request<CheckIn[]>(`/api/habits/${habitId}/checkins`);
}

export async function checkIn(habitId: string, date: string): Promise<CheckIn> {
  return request<CheckIn>(`/api/habits/${habitId}/checkin`, {
    method: 'POST',
    body: JSON.stringify({ date }),
  });
}

export async function uncheckIn(habitId: string, date: string): Promise<void> {
  await request(`/api/habits/${habitId}/checkin/${date}`, { method: 'DELETE' });
}

// ── Community ─────────────────────────────────────────

export async function getCommunity(): Promise<{ user: User; habits: Habit[]; checkIns: CheckIn[] }[]> {
  return request('/api/community');
}

export async function getUserCount(): Promise<number> {
  const data = await request<{ userCount: number }>('/api/stats');
  return data.userCount;
}
