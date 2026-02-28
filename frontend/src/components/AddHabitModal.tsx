import { useState } from 'react';

const ICONS = ['🏃', '📖', '💧', '🧘', '💪', '🎨', '🎵', '✏️', '🍎', '😴', '🧹', '💻'];

interface Props {
  onAdd: (name: string, icon: string) => void;
  onClose: () => void;
}

export default function AddHabitModal({ onAdd, onClose }: Props) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🏃');

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed, icon);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-t-2xl sm:rounded-2xl bg-card p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-text">New Habit</h2>

        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="Habit name"
          autoFocus
          className="mt-4 w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm
                     outline-none focus:ring-2 focus:ring-accent/40 placeholder:text-text-muted/50"
        />

        <p className="mt-4 text-xs text-text-muted">Pick an icon</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {ICONS.map(ic => (
            <button
              key={ic}
              onClick={() => setIcon(ic)}
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-lg transition-all
                ${icon === ic
                  ? 'bg-accent/15 ring-2 ring-accent'
                  : 'bg-bg hover:bg-border/50'
                }`}
            >
              {ic}
            </button>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-border py-2.5 text-sm font-medium text-text-muted
                       transition-colors hover:bg-bg"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="flex-1 rounded-lg bg-accent py-2.5 text-sm font-medium text-white
                       transition-all hover:opacity-90 disabled:opacity-40"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
