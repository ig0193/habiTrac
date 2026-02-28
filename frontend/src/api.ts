import type { User, Habit, CheckIn } from './types';
import * as mock from './mockData';

/**
 * API layer — currently backed by in-memory mock data.
 * Each function mirrors a future REST endpoint.
 * When the BE is ready, replace implementations with fetch() calls.
 */

// ── Auth ──────────────────────────────────────────────

// POST /api/join
export async function joinUser(name: string): Promise<User> {
  // TODO: replace with fetch('/api/join', { method: 'POST', body: JSON.stringify({ name }) })
  return mock.joinUser(name);
}

// GET /api/users
export async function getUsers(): Promise<User[]> {
  // TODO: replace with fetch('/api/users')
  return mock.getUsers();
}

// ── Habits ────────────────────────────────────────────

// GET /api/users/:userId/habits
export async function getHabits(userId: string): Promise<Habit[]> {
  // TODO: replace with fetch(`/api/users/${userId}/habits`)
  return mock.getHabits(userId);
}

// POST /api/habits
export async function addHabit(userId: string, name: string, icon: string): Promise<Habit> {
  // TODO: replace with fetch('/api/habits', { method: 'POST', body: ... })
  return mock.addHabit(userId, name, icon);
}

// DELETE /api/habits/:habitId
export async function deleteHabit(habitId: string): Promise<void> {
  // TODO: replace with fetch(`/api/habits/${habitId}`, { method: 'DELETE' })
  return mock.deleteHabit(habitId);
}

// ── Check-ins ─────────────────────────────────────────

// GET /api/habits/:habitId/checkins
export async function getCheckIns(habitId: string): Promise<CheckIn[]> {
  // TODO: replace with fetch(`/api/habits/${habitId}/checkins`)
  return mock.getCheckIns(habitId);
}

// POST /api/habits/:habitId/checkin
export async function checkIn(habitId: string, date: string): Promise<CheckIn> {
  // TODO: replace with fetch(`/api/habits/${habitId}/checkin`, { method: 'POST', body: ... })
  return mock.checkIn(habitId, date);
}

// DELETE /api/habits/:habitId/checkin/:date
export async function uncheckIn(habitId: string, date: string): Promise<void> {
  // TODO: replace with fetch(...)
  return mock.uncheckIn(habitId, date);
}

// ── Community ─────────────────────────────────────────

// GET /api/community (all users + their habits + this-week check-ins)
export async function getCommunity(): Promise<{ user: User; habits: Habit[]; checkIns: CheckIn[] }[]> {
  // TODO: replace with fetch('/api/community')
  return mock.getCommunity();
}

// GET /api/stats (total user count for join screen)
export async function getUserCount(): Promise<number> {
  // TODO: replace with fetch('/api/stats')
  return mock.getUserCount();
}
