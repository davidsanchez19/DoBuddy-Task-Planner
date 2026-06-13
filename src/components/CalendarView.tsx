import { useState, useMemo } from 'react';
import { Task } from '../types';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';

interface CalendarViewProps {
  tasks: Task[];
  onToggleCompleteTask: (id: string) => void;
}

type ViewMode = 'daily' | 'weekly' | 'monthly';

const priorityBar = (p: string) => {
  if (p === 'High') return 'bg-red-400';
  if (p === 'Medium') return 'bg-amber-400';
  return 'bg-emerald-400';
};

const priorityDot = (p: string) => {
  if (p === 'High') return 'bg-red-500';
  if (p === 'Medium') return 'bg-amber-500';
  return 'bg-emerald-500';
};

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 06:00 to 21:00

export default function CalendarView({ tasks, onToggleCompleteTask }: CalendarViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('monthly');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const navigate = (dir: -1 | 1) => {
    const d = new Date(currentDate);
    if (viewMode === 'daily') d.setDate(d.getDate() + dir);
    else if (viewMode === 'weekly') d.setDate(d.getDate() + dir * 7);
    else d.setMonth(d.getMonth() + dir);
    setCurrentDate(d);
  };

  const headerLabel = useMemo(() => {
    if (viewMode === 'daily') return currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    if (viewMode === 'weekly') {
      const start = new Date(currentDate);
      start.setDate(start.getDate() - start.getDay());
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [currentDate, viewMode]);

  const getTasksForDate = (date: Date) =>
    tasks.filter(t => {
      const d = new Date(t.dueDate);
      return sameDay(d, date);
    });

  // --- MONTHLY VIEW ---
  const monthlyDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = Array(firstDay.getDay()).fill(null);
    for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d));
    return days;
  }, [currentDate]);

  // --- WEEKLY VIEW ---
  const weekDays = useMemo(() => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [currentDate]);

  const selectedDayTasks = useMemo(() => getTasksForDate(selectedDate), [tasks, selectedDate]);

  const today = new Date();

  return (
    <div className="flex-1 p-6 max-w-[1280px] w-full mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-outline-variant shadow-sm">
        <h2 className="text-xl font-bold font-display text-on-surface">📅 Study Calendar</h2>
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex bg-surface-container-low border border-outline-variant rounded-lg p-1 gap-1">
            {(['daily', 'weekly', 'monthly'] as ViewMode[]).map(v => (
              <button
                key={v}
                onClick={() => setViewMode(v)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold capitalize transition-all cursor-pointer ${viewMode === v ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                {v}
              </button>
            ))}
          </div>
          {/* Navigation */}
          <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-lg border border-outline-variant flex items-center justify-center hover:bg-surface-container-low transition-colors cursor-pointer">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => { setCurrentDate(new Date()); setSelectedDate(new Date()); }} className="px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/5 rounded-lg transition-colors cursor-pointer">
            Today
          </button>
          <button onClick={() => navigate(1)} className="w-8 h-8 rounded-lg border border-outline-variant flex items-center justify-center hover:bg-surface-container-low transition-colors cursor-pointer">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-sm font-semibold text-on-surface-variant px-1">{headerLabel}</p>

      {/* MONTHLY VIEW */}
      {viewMode === 'monthly' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-7 text-center border-b border-outline-variant bg-surface-container-low">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="py-2.5 text-xs font-bold text-on-surface-variant uppercase tracking-wider">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 auto-rows-fr">
              {monthlyDays.map((day, idx) => {
                if (!day) return <div key={`e-${idx}`} className="bg-surface-container-low/30 min-h-[80px]" />;
                const dayTasks = getTasksForDate(day);
                const isToday = sameDay(day, today);
                const isSelected = sameDay(day, selectedDate);
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedDate(day)}
                    className={`min-h-[80px] p-2 border-r border-b border-outline-variant/30 cursor-pointer transition-colors ${isSelected ? 'bg-primary/5' : 'hover:bg-surface-container-low/50'}`}
                  >
                    <div className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold mb-1 ${isToday ? 'bg-primary text-white' : isSelected ? 'border-2 border-primary text-primary' : 'text-on-surface-variant'}`}>
                      {day.getDate()}
                    </div>
                    <div className="space-y-0.5">
                      {dayTasks.slice(0, 2).map(t => (
                        <div key={t.id} className={`text-[9px] font-semibold px-1.5 py-0.5 rounded truncate ${t.completed ? 'bg-surface-container line-through text-outline' : `${priorityBar(t.priority)} text-white`}`}>
                          {t.title}
                        </div>
                      ))}
                      {dayTasks.length > 2 && (
                        <div className="text-[9px] text-primary font-bold">+{dayTasks.length - 2} more</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Day detail sidebar */}
          <div className="lg:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm">
            <h3 className="font-display font-bold text-on-surface text-sm mb-3">
              {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h3>
            {selectedDayTasks.length === 0 ? (
              <div className="text-center py-8 text-on-surface-variant">
                <p className="text-3xl mb-2">📭</p>
                <p className="text-xs font-medium">No tasks scheduled</p>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedDayTasks.map(task => (
                  <div key={task.id} className={`p-3 rounded-xl border border-outline-variant/60 ${task.completed ? 'opacity-60' : ''}`}>
                    <div className="flex items-start gap-2">
                      <div className={`w-2 h-2 rounded-full mt-1 ${priorityDot(task.priority)} shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold ${task.completed ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>{task.title}</p>
                        <p className="text-[10px] text-on-surface-variant">{task.category}</p>
                        {task.startTime && (
                          <p className="text-[10px] text-primary flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />{task.startTime}{task.endTime ? `–${task.endTime}` : ''}
                          </p>
                        )}
                        {typeof task.progress === 'number' && (
                          <div className="mt-1.5 h-1 bg-surface-container-high rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${task.progress}%` }} />
                          </div>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        className="accent-primary cursor-pointer mt-0.5"
                        checked={task.completed}
                        onChange={() => onToggleCompleteTask(task.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* WEEKLY VIEW */}
      {viewMode === 'weekly' && (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-7 border-b border-outline-variant bg-surface-container-low">
            {weekDays.map((day, i) => {
              const isToday = sameDay(day, today);
              return (
                <div key={i} className={`p-3 text-center border-r border-outline-variant/30 ${isToday ? 'bg-primary/5' : ''}`}>
                  <p className="text-xs font-bold text-on-surface-variant uppercase">{day.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                  <div className={`w-8 h-8 mx-auto mt-1 flex items-center justify-center rounded-full text-sm font-display font-bold ${isToday ? 'bg-primary text-white' : 'text-on-surface'}`}>
                    {day.getDate()}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-7 min-h-[400px]">
            {weekDays.map((day, i) => {
              const dayTasks = getTasksForDate(day);
              const isToday = sameDay(day, today);
              return (
                <div key={i} className={`p-2 border-r border-outline-variant/30 min-h-[400px] ${isToday ? 'bg-primary/3' : ''}`}>
                  <div className="space-y-1">
                    {dayTasks.map(t => (
                      <div
                        key={t.id}
                        onClick={() => onToggleCompleteTask(t.id)}
                        className={`text-[10px] font-semibold px-2 py-1.5 rounded-lg cursor-pointer transition-all hover:opacity-90 ${t.completed ? 'bg-surface-container line-through text-outline' : `${priorityBar(t.priority)} text-white`}`}
                      >
                        <p className="truncate">{t.title}</p>
                        {t.startTime && <p className="text-white/80 flex items-center gap-0.5 mt-0.5"><Clock className="w-2.5 h-2.5" />{t.startTime}</p>}
                      </div>
                    ))}
                    {dayTasks.length === 0 && <p className="text-[10px] text-outline text-center mt-4">—</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DAILY VIEW */}
      {viewMode === 'daily' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
            <div className="divide-y divide-outline-variant/30">
              {HOURS.map(hour => {
                const hourStr = `${String(hour).padStart(2, '0')}:00`;
                const hourTasks = tasks.filter(t => {
                  if (!sameDay(new Date(t.dueDate), currentDate)) return false;
                  if (!t.startTime) return false;
                  const taskHour = parseInt(t.startTime.split(':')[0]);
                  return taskHour === hour;
                });
                return (
                  <div key={hour} className="flex min-h-[64px]">
                    <div className="w-16 shrink-0 p-2 text-right text-[11px] font-bold text-on-surface-variant border-r border-outline-variant/30 pt-3">{hourStr}</div>
                    <div className="flex-1 p-2 space-y-1">
                      {hourTasks.map(t => (
                        <div
                          key={t.id}
                          onClick={() => onToggleCompleteTask(t.id)}
                          className={`px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all hover:opacity-90 ${t.completed ? 'bg-surface-container text-outline line-through' : `${priorityBar(t.priority)} text-white`}`}
                        >
                          <p className="font-bold">{t.title}</p>
                          <p className="text-white/80 text-[10px]">{t.category} • {t.startTime}{t.endTime ? `–${t.endTime}` : ''}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Daily sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm">
              <h3 className="font-display font-bold text-on-surface text-sm mb-3">All Tasks This Day</h3>
              {getTasksForDate(currentDate).length === 0 ? (
                <p className="text-xs text-on-surface-variant text-center py-6">No tasks scheduled for this day.</p>
              ) : (
                <div className="space-y-2">
                  {getTasksForDate(currentDate).map(task => (
                    <div key={task.id} className="flex items-center gap-2 p-2.5 rounded-lg border border-outline-variant/50 hover:bg-surface-container-low/40 cursor-pointer" onClick={() => onToggleCompleteTask(task.id)}>
                      <div className={`w-2 h-2 rounded-full ${priorityDot(task.priority)} shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold truncate ${task.completed ? 'line-through text-outline' : 'text-on-surface'}`}>{task.title}</p>
                        <p className="text-[10px] text-on-surface-variant">{task.startTime ? `${task.startTime}–${task.endTime || ''}` : task.category}</p>
                      </div>
                      <input type="checkbox" className="accent-primary cursor-pointer" checked={task.completed} onChange={() => {}} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
