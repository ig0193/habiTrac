import type { CheckIn } from '../types';

interface Props {
  checkIns: CheckIn[];
  compact?: boolean;
}

function getWeekDates(): { label: string; date: string }[] {
  const today = new Date();
  const day = today.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);

  const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  return labels.map((label, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return { label, date: d.toISOString().split('T')[0] };
  });
}

export default function WeekProgress({ checkIns, compact }: Props) {
  const week = getWeekDates();
  const checkedDates = new Set(checkIns.map(c => c.date));
  const filled = week.filter(d => checkedDates.has(d.date)).length;

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {week.map(d => (
          <div
            key={d.date}
            className={`h-2.5 w-2.5 rounded-sm ${
              checkedDates.has(d.date) ? 'bg-accent' : 'bg-border'
            }`}
          />
        ))}
        <span className="ml-1.5 text-xs text-text-muted">{filled}/7</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      {week.map(d => (
        <div key={d.date} className="flex flex-col items-center gap-1">
          <span className="text-[10px] text-text-muted">{d.label}</span>
          <div
            className={`h-3 w-3 rounded-sm ${
              checkedDates.has(d.date) ? 'bg-accent' : 'bg-border'
            }`}
          />
        </div>
      ))}
      <span className="ml-2 text-xs text-text-muted">{filled}/7</span>
    </div>
  );
}
