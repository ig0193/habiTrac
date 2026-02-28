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
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getCommunity().then(setMembers);
  }, []);

  const otherMembers = members.filter(m => m.user.id !== currentUser?.id);
  const filtered = search.trim()
    ? otherMembers.filter(m =>
        m.user.name.toLowerCase().startsWith(search.trim().toLowerCase())
      )
    : otherMembers;

  return (
    <div className="px-5 pb-8">
      {otherMembers.length > 0 && (
        <div className="pt-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">
              &#x1F50D;
            </span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search members..."
              className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-4 text-sm
                         outline-none transition-shadow focus:ring-2 focus:ring-accent/40
                         placeholder:text-text-muted/50"
            />
          </div>
        </div>
      )}

      <p className="py-3 text-sm text-text-muted">
        {search.trim()
          ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''}`
          : `${otherMembers.length} ${otherMembers.length === 1 ? 'member' : 'members'} tracking habits`}
      </p>

      {otherMembers.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-5xl">👋</p>
          <p className="mt-4 text-text-muted">No other members yet</p>
          <p className="text-sm text-text-muted">Share habiTrac with friends!</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-text-muted">No members matching "{search.trim()}"</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {filtered.map(({ user, habits, checkIns }) => (
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
