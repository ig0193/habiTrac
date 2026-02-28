import type { User, Habit, CheckIn } from './types';

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

const SEED_USERS: User[] = [
  { id: 'u1', name: 'Arjun', joinedAt: '2026-01-15' },
  { id: 'u2', name: 'Sneha', joinedAt: '2026-01-20' },
  { id: 'u3', name: 'Rahul', joinedAt: '2026-02-01' },
];

const SEED_HABITS: Habit[] = [
  { id: 'h1', userId: 'u1', name: 'Morning Run', icon: '🏃', createdAt: '2026-01-16' },
  { id: 'h2', userId: 'u1', name: 'Read', icon: '📖', createdAt: '2026-01-16' },
  { id: 'h3', userId: 'u2', name: 'Meditate', icon: '🧘', createdAt: '2026-01-21' },
  { id: 'h4', userId: 'u2', name: 'Drink Water', icon: '💧', createdAt: '2026-01-21' },
  { id: 'h5', userId: 'u3', name: 'Gym', icon: '💪', createdAt: '2026-02-02' },
  { id: 'h6', userId: 'u3', name: 'Journal', icon: '✏️', createdAt: '2026-02-02' },
];

function generateCheckIns(habitId: string, density: number, days: number): CheckIn[] {
  const result: CheckIn[] = [];
  for (let i = 0; i < days; i++) {
    if (Math.random() < density) {
      result.push({ id: uid(), habitId, date: daysAgo(i) });
    }
  }
  return result;
}

const SEED_CHECKINS: CheckIn[] = [
  ...generateCheckIns('h1', 0.75, 40),
  ...generateCheckIns('h2', 0.5, 40),
  ...generateCheckIns('h3', 0.85, 35),
  ...generateCheckIns('h4', 0.65, 35),
  ...generateCheckIns('h5', 0.4, 25),
  ...generateCheckIns('h6', 0.7, 25),
];

let users: User[] = [...SEED_USERS];
let habits: Habit[] = [...SEED_HABITS];
let checkIns: CheckIn[] = [...SEED_CHECKINS];

export function joinUser(name: string): User {
  const user: User = { id: uid(), name, joinedAt: todayStr() };
  users.push(user);
  return user;
}

export function getUsers(): User[] {
  return [...users];
}

export function getHabits(userId: string): Habit[] {
  return habits.filter(h => h.userId === userId);
}

export function addHabit(userId: string, name: string, icon: string): Habit {
  const habit: Habit = { id: uid(), userId, name, icon, createdAt: todayStr() };
  habits.push(habit);
  return habit;
}

export function deleteHabit(habitId: string): void {
  habits = habits.filter(h => h.id !== habitId);
  checkIns = checkIns.filter(c => c.habitId !== habitId);
}

export function getCheckIns(habitId: string): CheckIn[] {
  return checkIns.filter(c => c.habitId === habitId);
}

export function checkIn(habitId: string, date: string): CheckIn {
  const existing = checkIns.find(c => c.habitId === habitId && c.date === date);
  if (existing) return existing;
  const ci: CheckIn = { id: uid(), habitId, date };
  checkIns.push(ci);
  return ci;
}

export function uncheckIn(habitId: string, date: string): void {
  checkIns = checkIns.filter(c => !(c.habitId === habitId && c.date === date));
}

export function getCommunity(): { user: User; habits: Habit[]; checkIns: CheckIn[] }[] {
  return users.map(user => ({
    user,
    habits: habits.filter(h => h.userId === user.id),
    checkIns: checkIns.filter(c =>
      habits.some(h => h.userId === user.id && h.id === c.habitId)
    ),
  }));
}

export function getUserCount(): number {
  return users.length;
}
