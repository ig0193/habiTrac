import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import * as api from '../api';
import type { Habit, CheckIn } from '../types';
import HabitCard from './HabitCard';
import AddHabitModal from './AddHabitModal';

export default function MyHabits() {
  const { currentUser } = useApp();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [checkIns, setCheckIns] = useState<Record<string, CheckIn[]>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick(t => t + 1), []);

  useEffect(() => {
    if (!currentUser) return;
    api.getHabits(currentUser.id).then(async (h) => {
      setHabits(h);
      const entries = await Promise.all(
        h.map(async habit => [habit.id, await api.getCheckIns(habit.id)] as const)
      );
      setCheckIns(Object.fromEntries(entries));
    });
  }, [currentUser, tick]);

  const handleAdd = async (name: string, icon: string) => {
    if (!currentUser) return;
    await api.addHabit(currentUser.id, name, icon);
    setShowAdd(false);
    refresh();
  };

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="px-5 pb-24">
      <p className="py-4 text-sm text-text-muted">Today · {dateStr}</p>

      {habits.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-5xl">🌱</p>
          <p className="mt-4 text-text-muted">No habits yet</p>
          <p className="text-sm text-text-muted">Tap + to add your first habit</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {habits.map(h => (
            <HabitCard
              key={h.id}
              habit={h}
              checkIns={checkIns[h.id] || []}
              isOwn
              onCheckInChange={refresh}
              returnTo="habits"
            />
          ))}
        </div>
      )}

      <button
        onClick={() => setShowAdd(true)}
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full
                   bg-accent text-2xl text-white shadow-lg transition-all hover:scale-105 active:scale-95"
      >
        +
      </button>

      {showAdd && <AddHabitModal onAdd={handleAdd} onClose={() => setShowAdd(false)} />}
    </div>
  );
}
