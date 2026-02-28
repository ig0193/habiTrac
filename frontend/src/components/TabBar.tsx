import { useApp } from '../context/AppContext';

const TABS = [
  { type: 'habits' as const, label: 'My Habits' },
  { type: 'community' as const, label: 'Community' },
];

export default function TabBar() {
  const { screen, navigate } = useApp();
  const activeType = screen.type === 'habit-detail' ? screen.returnTo : screen.type;

  return (
    <div className="flex border-b border-border">
      {TABS.map(tab => {
        const active = activeType === tab.type;
        return (
          <button
            key={tab.type}
            onClick={() => navigate({ type: tab.type })}
            className={`flex-1 py-3 text-sm font-medium transition-colors
              ${active
                ? 'border-b-2 border-accent text-accent'
                : 'text-text-muted hover:text-text'
              }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
