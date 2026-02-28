import { useState, useEffect } from 'react';
import type { Habit, CheckIn, User } from '../types';
import { useApp } from '../context/AppContext';
import * as api from '../api';
import WeekProgress from './WeekProgress';
import CalendarHeatmap from './CalendarHeatmap';

export default function HabitDetail() {
  const { screen, navigate, currentUser } = useApp();
  if (screen.type !== 'habit-detail') return null;

  const { habitId, ownerId, returnTo } = screen;
  const [habit, setHabit] = useState<Habit | null>(null);
  const [owner, setOwner] = useState<User | null>(null);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [tick, setTick] = useState(0);

  const isOwn = currentUser?.id === ownerId;
  const today = new Date().toISOString().split('T')[0];
  const checkedToday = checkIns.some(c => c.date === today);

  useEffect(() => {
    api.getCheckIns(habitId).then(setCheckIns);
    api.getHabits(ownerId).then(habits => {
      setHabit(habits.find(h => h.id === habitId) || null);
    });
    if (!isOwn) {
      api.getUsers().then(users => {
        setOwner(users.find(u => u.id === ownerId) || null);
      });
    }
  }, [habitId, ownerId, isOwn, tick]);

  const handleToggle = async () => {
    if (checkedToday) {
      await api.uncheckIn(habitId, today);
    } else {
      await api.checkIn(habitId, today);
    }
    setTick(t => t + 1);
  };

  if (!habit) return null;

  const currentStreak = computeCurrentStreak(checkIns);
  const bestStreak = computeBestStreak(checkIns);
  const totalCheckIns = checkIns.length;

  return (
    <div className="px-5 pb-8">
      <button
        onClick={() => navigate({ type: returnTo })}
        className="flex items-center gap-1 py-4 text-sm font-medium text-accent transition-colors hover:text-accent/80"
      >
        ← Back
      </button>

      <div className="flex items-center gap-3">
        <span className="text-3xl">{habit.icon}</span>
        <div>
          <h2 className="text-xl font-semibold text-text">{habit.name}</h2>
          {!isOwn && owner && (
            <p className="text-sm text-text-muted">by {owner.name}</p>
          )}
        </div>
      </div>

      {isOwn && (
        <button
          onClick={handleToggle}
          className={`mt-4 w-full rounded-xl py-3 text-sm font-medium transition-all active:scale-[0.98]
            ${checkedToday
              ? 'bg-accent/10 text-accent border border-accent/20'
              : 'bg-accent text-white'
            }`}
        >
          {checkedToday ? 'Checked in today ✓' : 'Check in for today'}
        </button>
      )}

      <div className="mt-6 grid grid-cols-3 gap-3">
        <StatCard label="Current" value={`${currentStreak} 🔥`} />
        <StatCard label="Best" value={String(bestStreak)} />
        <StatCard label="Total" value={String(totalCheckIns)} />
      </div>

      <div className="mt-6">
        <p className="mb-3 text-sm font-medium text-text-muted">This Week</p>
        <WeekProgress checkIns={checkIns} />
      </div>

      <div className="mt-6">
        <p className="mb-3 text-sm font-medium text-text-muted">History</p>
        <CalendarHeatmap checkIns={checkIns} createdAt={habit.createdAt} />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-3 text-center">
      <p className="text-lg font-bold text-text">{value}</p>
      <p className="text-xs text-text-muted">{label}</p>
    </div>
  );
}

function computeCurrentStreak(checkIns: CheckIn[]): number {
  const dates = [...new Set(checkIns.map(c => c.date))].sort().reverse();
  if (dates.length === 0) return 0;
  let streak = 0;
  const today = new Date();
  const d = new Date(today);

  for (let i = 0; i < 365; i++) {
    const dateStr = d.toISOString().split('T')[0];
    if (dates.includes(dateStr)) {
      streak++;
    } else if (i > 0) {
      break;
    }
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

function computeBestStreak(checkIns: CheckIn[]): number {
  const dates = [...new Set(checkIns.map(c => c.date))].sort();
  if (dates.length === 0) return 0;
  let best = 1;
  let current = 1;
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      current++;
      best = Math.max(best, current);
    } else {
      current = 1;
    }
  }
  return best;
}
