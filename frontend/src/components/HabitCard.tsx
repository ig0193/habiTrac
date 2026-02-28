import { useState } from 'react';
import type { Habit, CheckIn } from '../types';
import { useApp } from '../context/AppContext';
import WeekProgress from './WeekProgress';
import * as api from '../api';

interface Props {
  habit: Habit;
  checkIns: CheckIn[];
  isOwn: boolean;
  onCheckInChange?: () => void;
  returnTo: 'habits' | 'community';
}

export default function HabitCard({ habit, checkIns, isOwn, onCheckInChange, returnTo }: Props) {
  const { navigate } = useApp();
  const today = new Date().toISOString().split('T')[0];
  const checkedToday = checkIns.some(c => c.date === today);
  const [toggling, setToggling] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (toggling) return;
    setToggling(true);
    if (checkedToday) {
      await api.uncheckIn(habit.id, today);
    } else {
      await api.checkIn(habit.id, today);
    }
    onCheckInChange?.();
    setToggling(false);
  };

  const handleClick = () => {
    navigate({
      type: 'habit-detail',
      habitId: habit.id,
      ownerId: habit.userId,
      returnTo,
    });
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center justify-between rounded-xl bg-card p-4 shadow-sm
                 border border-border/50 cursor-pointer transition-all hover:shadow-md active:scale-[0.99]"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-lg">{habit.icon}</span>
          <span className="font-medium text-text truncate">{habit.name}</span>
        </div>
        <div className="mt-2">
          <WeekProgress checkIns={checkIns} compact />
        </div>
      </div>

      {isOwn && (
        <button
          onClick={handleToggle}
          disabled={toggling}
          className={`ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold
                      transition-all active:scale-95
            ${checkedToday
              ? 'bg-accent text-white'
              : 'border-2 border-accent/30 text-accent hover:border-accent hover:bg-accent-light'
            }`}
        >
          ✓
        </button>
      )}
    </div>
  );
}
