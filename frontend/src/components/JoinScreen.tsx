import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import * as api from '../api';

export default function JoinScreen() {
  const { setCurrentUser, navigate } = useApp();
  const [name, setName] = useState('');
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getUserCount().then(setUserCount);
  }, []);

  const handleJoin = async () => {
    const trimmed = name.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    const user = await api.joinUser(trimmed);
    setCurrentUser(user);
    navigate({ type: 'habits' });
  };

  return (
    <div className="min-h-dvh flex items-center justify-center px-5">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-4xl font-bold tracking-tight text-text">
          habi<span className="text-accent">Trac</span>
        </h1>
        <p className="mt-2 text-text-muted text-sm">track it. own it.</p>

        <div className="mt-10">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleJoin()}
            placeholder="Your name"
            autoFocus
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-center text-lg
                       outline-none transition-shadow focus:ring-2 focus:ring-accent/40
                       placeholder:text-text-muted/50"
          />
        </div>

        <button
          onClick={handleJoin}
          disabled={!name.trim() || loading}
          className="mt-4 w-full rounded-xl bg-accent px-6 py-3 text-base font-medium text-white
                     transition-all hover:opacity-90 active:scale-[0.98]
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? 'Joining...' : "Let's Go →"}
        </button>

        {userCount > 0 && (
          <p className="mt-8 text-sm text-text-muted">
            {userCount} {userCount === 1 ? 'person' : 'people'} tracking habits today
          </p>
        )}
      </div>
    </div>
  );
}
