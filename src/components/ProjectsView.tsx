import { useMemo } from 'react';
import { Task } from '../types';
import { CATEGORIES } from '../data';
import { CheckCircle2, Clock } from 'lucide-react';

interface ProjectsViewProps {
  tasks: Task[];
  onToggleCompleteTask: (id: string) => void;
}

const categoryProgress = (tasks: Task[], category: string) => {
  const cat = tasks.filter(t => t.category === category);
  if (cat.length === 0) return null;
  const done = cat.filter(t => t.completed).length;
  const pct = Math.round((done / cat.length) * 100);
  return { total: cat.length, done, pct, tasks: cat };
};

const progressColor = (pct: number) => {
  if (pct >= 80) return 'bg-emerald-500';
  if (pct >= 50) return 'bg-primary';
  if (pct >= 20) return 'bg-amber-500';
  return 'bg-red-400';
};

export default function ProjectsView({ tasks, onToggleCompleteTask }: ProjectsViewProps) {
  const categoryStats = useMemo(() =>
    CATEGORIES.map(cat => ({ category: cat, stats: categoryProgress(tasks, cat) })).filter(c => c.stats !== null),
    [tasks]
  );

  return (
    <div className="flex-1 p-6 max-w-[1280px] w-full mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2 bg-white p-5 rounded-xl border border-outline-variant shadow-sm">
        <span className="text-2xl">📊</span>
        <div>
          <h2 className="text-xl font-bold font-display text-on-surface">Study Projects</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">Track your progress across all study categories</p>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Tasks', value: tasks.length, emoji: '📋' },
          { label: 'Completed', value: tasks.filter(t => t.completed).length, emoji: '✅' },
          { label: 'In Progress', value: tasks.filter(t => !t.completed && (t.progress || 0) > 0).length, emoji: '⚡' },
          { label: 'Categories Active', value: categoryStats.length, emoji: '📂' },
        ].map(card => (
          <div key={card.label} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 text-center shadow-sm">
            <p className="text-2xl mb-1">{card.emoji}</p>
            <p className="font-display text-2xl font-bold text-on-surface">{card.value}</p>
            <p className="text-xs text-on-surface-variant mt-0.5 font-medium">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {categoryStats.map(({ category, stats }) => {
          if (!stats) return null;
          const color = progressColor(stats.pct);
          const pending = stats.tasks.filter(t => !t.completed);
          const completed = stats.tasks.filter(t => t.completed);
          return (
            <div key={category} className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
              {/* Card Header */}
              <div className="p-5 border-b border-outline-variant/40">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-display font-bold text-on-surface text-sm leading-tight">{category}</h3>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full text-white ${color}`}>{stats.pct}%</span>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden mb-2">
                  <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${stats.pct}%` }} />
                </div>
                <div className="flex items-center justify-between text-[11px] text-on-surface-variant font-medium">
                  <span>{stats.done} of {stats.total} tasks done</span>
                  <span className={stats.pct === 100 ? 'text-emerald-600 font-bold' : ''}>
                    {stats.pct === 100 ? '🎉 Complete!' : `${stats.total - stats.done} remaining`}
                  </span>
                </div>
              </div>

              {/* Task List Preview */}
              <div className="p-4 space-y-1.5 max-h-48 overflow-y-auto">
                {/* Active first */}
                {pending.slice(0, 3).map(task => (
                  <div
                    key={task.id}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-container-low/60 cursor-pointer transition-colors"
                    onClick={() => onToggleCompleteTask(task.id)}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${task.priority === 'High' ? 'bg-red-500' : task.priority === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                    <p className="text-xs font-medium text-on-surface flex-1 truncate">{task.title}</p>
                    {task.startTime && <span className="text-[10px] text-on-surface-variant flex items-center gap-0.5"><Clock className="w-3 h-3" />{task.startTime}</span>}
                    {typeof task.progress === 'number' && task.progress > 0 && (
                      <span className="text-[10px] font-bold text-primary">{task.progress}%</span>
                    )}
                  </div>
                ))}
                {completed.slice(0, 2).map(task => (
                  <div
                    key={task.id}
                    className="flex items-center gap-2 p-2 rounded-lg opacity-50 cursor-pointer hover:opacity-70 transition-opacity"
                    onClick={() => onToggleCompleteTask(task.id)}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <p className="text-xs font-medium text-on-surface-variant line-through flex-1 truncate">{task.title}</p>
                  </div>
                ))}
                {stats.total > 5 && (
                  <p className="text-[10px] text-primary font-bold text-center mt-1">+{stats.total - 5} more tasks</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {categoryStats.length === 0 && (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-16 text-center">
          <p className="text-4xl mb-3">🎓</p>
          <p className="font-display font-bold text-on-surface text-lg">No study projects yet</p>
          <p className="text-sm text-on-surface-variant mt-2">Create your first task to start tracking your academic progress!</p>
        </div>
      )}
    </div>
  );
}
