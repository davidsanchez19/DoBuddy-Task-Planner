import { useMemo } from 'react';
import { Task } from '../types';
import { Sparkles, Clock, TrendingUp, AlertTriangle, Download, Flame, Target } from 'lucide-react';
import { CATEGORIES } from '../data';

interface AnalyticsViewProps {
  tasks: Task[];
}

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function AnalyticsView({ tasks }: AnalyticsViewProps) {
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const highCount = tasks.filter(t => t.priority === 'High' && !t.completed).length;
    const focusHours = tasks.reduce((acc, t) => {
      if (t.startTime && t.endTime) {
        const [sh, sm] = t.startTime.split(':').map(Number);
        const [eh, em] = t.endTime.split(':').map(Number);
        return acc + ((eh * 60 + em) - (sh * 60 + sm)) / 60;
      }
      return acc + 1; // assume 1 hr if no time set
    }, 0);

    // Streak
    const completedDates = tasks.filter(t => t.completed && t.completedDate).map(t => t.completedDate!).sort().reverse();
    let streak = 0;
    const check = new Date();
    for (let i = 0; i < 30; i++) {
      const d = check.toISOString().split('T')[0];
      if (completedDates.includes(d)) { streak++; }
      else if (streak > 0) break;
      check.setDate(check.getDate() - 1);
    }

    return { total, completed, pending, completionRate, highCount, focusHours: Math.round(focusHours * 10) / 10, streak };
  }, [tasks]);

  // Category breakdown
  const categoryStats = useMemo(() =>
    CATEGORIES.map(cat => {
      const catTasks = tasks.filter(t => t.category === cat);
      const done = catTasks.filter(t => t.completed).length;
      return { cat, total: catTasks.length, done, pct: catTasks.length > 0 ? Math.round(done / catTasks.length * 100) : 0 };
    }).filter(c => c.total > 0).sort((a, b) => b.total - a.total),
    [tasks]
  );

  // Weekly tasks per day
  const weeklyActivity = useMemo(() => {
    const today = new Date();
    return WEEK_DAYS.map((_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - today.getDay() + i);
      const dateStr = d.toISOString().split('T')[0];
      const completed = tasks.filter(t => t.completedDate === dateStr).length;
      const total = tasks.filter(t => t.dueDate === dateStr).length;
      return { completed, total };
    });
  }, [tasks]);

  const maxBar = Math.max(...weeklyActivity.map(w => w.total), 1);

  const completedLog = useMemo(() => tasks.filter(t => t.completed), [tasks]);

  const handleExport = () => {
    alert('Exporting Report: DoBuddy_Performance_Report.pdf download started successfully!');
  };

  return (
    <div className="flex-1 p-6 max-w-[1280px] w-full mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-display text-on-surface">📊 Performance Analytics</h2>
          <p className="text-sm text-on-surface-variant mt-1 font-medium">Your DoBuddy productivity insights</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => alert('Showing stats for this week!')}
            className="px-4 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            This Week
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />Export Report
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Tasks Done', value: stats.completed, icon: <Sparkles className="w-5 h-5" />, bg: 'bg-primary/10 text-primary' },
          { label: 'Focus Hours', value: `${stats.focusHours}h`, icon: <Clock className="w-5 h-5" />, bg: 'bg-emerald-100 text-emerald-700' },
          { label: 'Study Streak', value: `${stats.streak}d`, icon: <Flame className="w-5 h-5" />, bg: 'bg-orange-100 text-orange-600' },
          { label: 'High Priority', value: stats.highCount, icon: <AlertTriangle className="w-5 h-5" />, bg: 'bg-red-100 text-red-600' },
        ].map(card => (
          <div key={card.label} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.bg} mb-3`}>{card.icon}</div>
            <p className="font-display text-3xl font-bold text-on-surface">{card.value}</p>
            <p className="text-xs text-on-surface-variant mt-1 font-semibold">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Productivity Score */}
        <div className="md:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
          <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Overall Score</h3>
          <div className="relative w-40 h-40 mb-4">
            <svg className="w-full h-full -rotate-90">
              <circle cx="80" cy="80" r="66" fill="transparent" stroke="currentColor" strokeWidth="10" className="text-surface-container-high" />
              <circle cx="80" cy="80" r="66" fill="transparent" stroke="currentColor" strokeWidth="10" className="text-primary transition-all duration-1000"
                strokeDasharray={414.7} strokeDashoffset={414.7 - (414.7 * stats.completionRate / 100)} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-4xl font-bold text-primary">{stats.completionRate}</span>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Score</span>
            </div>
          </div>
          <p className="text-xs text-on-surface-variant font-medium">
            {stats.completionRate >= 80 ? '🔥 Excellent! Keep it up!' :
              stats.completionRate >= 50 ? '💪 Good progress, push harder!' :
                '📚 Just getting started. You got this!'}
          </p>
          <div className="w-full mt-4 space-y-2 text-xs">
            <div className="flex justify-between items-center bg-surface-container-low p-2.5 rounded-lg">
              <span className="text-on-surface-variant flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-emerald-600" />Completed</span>
              <span className="font-bold">{stats.completed}</span>
            </div>
            <div className="flex justify-between items-center bg-surface-container-low p-2.5 rounded-lg">
              <span className="text-on-surface-variant flex items-center gap-1.5"><Target className="w-3.5 h-3.5 text-primary" />Total Goals</span>
              <span className="font-bold">{stats.total}</span>
            </div>
          </div>
        </div>

        {/* Weekly Activity Chart */}
        <div className="md:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">Weekly Study Activity</h3>
            <div className="flex items-center gap-4 text-xs font-semibold text-on-surface-variant">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-primary inline-block" />Completed</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-surface-container-high inline-block" />Scheduled</span>
            </div>
          </div>
          <div className="flex items-end justify-between gap-3 h-44 px-2">
            {weeklyActivity.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="w-full flex flex-col justify-end gap-1 h-[85%]">
                  {day.total > 0 && (
                    <div
                      className="bg-surface-container-high rounded-t-sm w-full transition-all"
                      style={{ height: `${(day.total / maxBar) * 100}%` }}
                    />
                  )}
                  {day.completed > 0 && (
                    <div
                      className="bg-primary rounded-t-sm w-full group-hover:brightness-110 transition-all"
                      style={{ height: `${(day.completed / maxBar) * 100}%`, marginTop: day.total > 0 ? '-100%' : 0 }}
                    />
                  )}
                  {day.total === 0 && day.completed === 0 && (
                    <div className="w-full h-2 bg-surface-container-high/30 rounded-sm" />
                  )}
                </div>
                <span className="text-xs font-bold text-on-surface-variant">{WEEK_DAYS[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="md:col-span-6 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider mb-4">Category Progress</h3>
          <div className="space-y-4">
            {categoryStats.length === 0 ? (
              <p className="text-xs text-on-surface-variant text-center py-4">No data yet</p>
            ) : (
              categoryStats.map(({ cat, total, done, pct }) => (
                <div key={cat} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-on-surface">{cat}</span>
                    <span className="text-on-surface-variant">{done}/{total} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Completed Log */}
        <div className="md:col-span-6 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-outline-variant bg-surface-container-low/30 flex items-center justify-between">
            <h3 className="font-bold text-on-surface text-sm">Completed Tasks</h3>
            <span className="text-xs text-on-surface-variant">{completedLog.length} total</span>
          </div>
          <div className="overflow-y-auto max-h-64">
            {completedLog.length === 0 ? (
              <p className="text-center text-xs text-on-surface-variant py-10">No completed tasks yet. Check one off!</p>
            ) : (
              completedLog.map(task => (
                <div key={task.id} className="px-5 py-3 border-b border-outline-variant/30 hover:bg-surface-container-low/30 transition-colors flex items-center gap-3">
                  <span className="text-emerald-500">✅</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-on-surface truncate">{task.title}</p>
                    <p className="text-[10px] text-on-surface-variant">{task.category}</p>
                  </div>
                  <span className="text-[10px] text-on-surface-variant shrink-0">{task.completedDate || '—'}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
