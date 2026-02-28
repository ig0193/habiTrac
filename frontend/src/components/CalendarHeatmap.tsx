import type { CheckIn } from '../types';

interface Props {
  checkIns: CheckIn[];
  createdAt: string;
}

interface MonthData {
  label: string;
  days: { date: string; checked: boolean; dayOfWeek: number }[];
}

function getMonths(checkIns: CheckIn[], createdAt: string): MonthData[] {
  const checkedSet = new Set(checkIns.map(c => c.date));
  const today = new Date();
  const start = new Date(createdAt);
  const months: MonthData[] = [];

  const current = new Date(today.getFullYear(), today.getMonth(), 1);
  const end = new Date(start.getFullYear(), start.getMonth(), 1);

  while (current >= end) {
    const year = current.getFullYear();
    const month = current.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const label = current.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const days: MonthData['days'] = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      if (date > today) break;
      if (date < start) continue;
      const dateStr = date.toISOString().split('T')[0];
      days.push({
        date: dateStr,
        checked: checkedSet.has(dateStr),
        dayOfWeek: date.getDay(),
      });
    }

    if (days.length > 0) {
      months.push({ label, days });
    }
    current.setMonth(current.getMonth() - 1);
  }

  return months;
}

export default function CalendarHeatmap({ checkIns, createdAt }: Props) {
  const months = getMonths(checkIns, createdAt);

  return (
    <div className="flex flex-col gap-4">
      {months.map(month => (
        <div key={month.label} className="rounded-xl border border-border/50 bg-card p-4">
          <p className="mb-3 text-xs font-medium text-text-muted">{month.label}</p>
          <div className="flex flex-wrap gap-1.5">
            {month.days.map(day => (
              <div
                key={day.date}
                title={day.date}
                className={`h-4 w-4 rounded-sm transition-colors ${
                  day.checked ? 'bg-accent' : 'bg-border/70'
                }`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
