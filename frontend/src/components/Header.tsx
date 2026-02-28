import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function Header() {
  const { currentUser, logout } = useApp();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  if (!currentUser) return null;

  const initial = currentUser.name.charAt(0).toUpperCase();

  return (
    <header className="flex items-center justify-between px-5 py-4">
      <p className="text-lg font-semibold text-text">
        Hi, {currentUser.name}
      </p>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setOpen(o => !o)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-sm
                     font-semibold text-accent transition-colors hover:bg-accent/20"
        >
          {initial}
        </button>
        {open && (
          <div className="absolute right-0 top-11 z-40 min-w-[140px] rounded-xl border border-border
                          bg-card py-1 shadow-lg animate-in fade-in slide-in-from-top-1">
            <div className="px-3 py-2 border-b border-border">
              <p className="text-sm font-medium text-text">{currentUser.name}</p>
              <p className="text-xs text-text-muted">Member</p>
            </div>
            <button
              onClick={() => { setOpen(false); logout(); }}
              className="w-full px-3 py-2 text-left text-sm text-danger transition-colors
                         hover:bg-danger/5"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
