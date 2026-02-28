import { useState, useEffect } from 'react';
import type { User, Habit, CheckIn } from '../types';
import { useApp } from '../context/AppContext';
import * as api from '../api';
import HabitCard from './HabitCard';

interface MemberData {
  user: User;
  habits: Habit[];
  checkIns: CheckIn[];
}

export default function Community() {
  const { currentUser } = useApp();
  const [members, setMembers] = useState<MemberData[]>([]);

  useEffect(() => {
    api.getCommunity().then(setMembers);
  }, []);

  const otherMembers = members.filter(m => m.user.id !== currentUser?.id);

  return (
    <div className="px-5 pb-8">
      <p className="py-4 text-sm text-text-muted">
        {otherMembers.length} {otherMembers.length === 1 ? 'member' : 'members'} tracking habits
      </p>

      {otherMembers.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-5xl">👋</p>
          <p className="mt-4 text-text-muted">No other members yet</p>
          <p className="text-sm text-text-muted">Share habiTrac with friends!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {otherMembers.map(({ user, habits, checkIns }) => (
            <div key={user.id}>
              <div className="mb-2 flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-text">{user.name}</span>
              </div>
              <div className="flex flex-col gap-2">
                {habits.map(habit => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    checkIns={checkIns.filter(c => c.habitId === habit.id)}
                    isOwn={false}
                    returnTo="community"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
