import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import * as api from '../api';
import { ApiError } from '../api';

type Mode = 'signup' | 'login';

export default function JoinScreen() {
  const { setCurrentUser, navigate } = useApp();
  const [mode, setMode] = useState<Mode>('signup');
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getUserCount().then(setUserCount).catch(() => {});
  }, []);

  const handleSubmit = async () => {
    setError('');
    const trimmedId = userId.trim();
    if (!trimmedId) return;
    if (mode === 'signup' && !name.trim()) return;
    if (loading) return;

    setLoading(true);
    try {
      const user =
        mode === 'signup'
          ? await api.joinUser(trimmedId, name.trim())
          : await api.loginUser(trimmedId);
      setCurrentUser(user);
      navigate({ type: 'habits' });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(
          err.status === 409
            ? 'That user ID is already taken'
            : err.status === 404
              ? 'User not found — check your ID'
              : err.message
        );
      } else {
        setError('Could not connect to server');
      }
    } finally {
      setLoading(false);
    }
  };

  const canSubmit =
    userId.trim() && (mode === 'login' || name.trim()) && !loading;

  return (
    <div className="min-h-dvh flex items-center justify-center px-5">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-4xl font-bold tracking-tight text-text">
          habi<span className="text-accent">Trac</span>
        </h1>
        <p className="mt-2 text-text-muted text-sm">track it. own it.</p>

        {/* Tab switcher */}
        <div className="mt-8 flex rounded-lg bg-border/40 p-1">
          {(['signup', 'login'] as Mode[]).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(''); }}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-all
                ${mode === m
                  ? 'bg-card text-text shadow-sm'
                  : 'text-text-muted hover:text-text'
                }`}
            >
              {m === 'signup' ? 'Sign Up' : 'Log In'}
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <input
            type="text"
            value={userId}
            onChange={e => setUserId(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && canSubmit && handleSubmit()}
            placeholder="Your secret user ID"
            autoFocus
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-center text-base
                       outline-none transition-shadow focus:ring-2 focus:ring-accent/40
                       placeholder:text-text-muted/50"
          />

          {mode === 'signup' && (
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && canSubmit && handleSubmit()}
              placeholder="Display name (public)"
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-center text-base
                         outline-none transition-shadow focus:ring-2 focus:ring-accent/40
                         placeholder:text-text-muted/50"
            />
          )}
        </div>

        {error && (
          <p className="mt-3 text-sm text-danger">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="mt-4 w-full rounded-xl bg-accent px-6 py-3 text-base font-medium text-white
                     transition-all hover:opacity-90 active:scale-[0.98]
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading
            ? (mode === 'signup' ? 'Creating...' : 'Logging in...')
            : (mode === 'signup' ? "Let's Go →" : 'Log In →')}
        </button>

        {mode === 'signup' && (
          <p className="mt-3 text-xs text-text-muted">
            Your user ID is private — only you use it to log in
          </p>
        )}

        {userCount > 0 && (
          <p className="mt-6 text-sm text-text-muted">
            {userCount} {userCount === 1 ? 'person' : 'people'} tracking habits today
          </p>
        )}
      </div>
    </div>
  );
}
