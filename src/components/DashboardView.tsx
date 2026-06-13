import { useState, useMemo } from 'react';
import { Task } from '../types';
import { Search, Bell, Settings as SettingsIcon, Calendar as CalendarIcon, Folder, AlertTriangle, Sparkles, TrendingUp, Flame, Clock, CheckCircle } from 'lucide-react';

interface DashboardViewProps {
  tasks: Task[];
  onToggleCompleteTask: (id: string) => void;
  onOpenNewTaskModal: () => void;
  user: { name: string; email: string; avatar: string };
  onNavigateToTab: (tab: string) => void;
}

const fmt = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
const todayStr = () => new Date().toISOString().split('T')[0];

function getGreeting(name: string) {
  const hour = new Date().getHours();
  if (hour < 12) return `Good morning, ${name.split(' ')[0]}! ☀️`;
  if (hour < 17) return `Good afternoon, ${name.split(' ')[0]}! 📚`;
  return `Good evening, ${name.split(' ')[0]}! 🌙`;
}

const priorityStyle = (p: string) => {
  if (p === 'High') return { bar: 'bg-red-500', badge: 'bg-red-100 text-red-700 border-red-200' };
  if (p === 'Medium') return { bar: 'bg-amber-500', badge: 'bg-amber-100 text-amber-700 border-amber-200' };
  return { bar: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
};

export default function DashboardView({ tasks, onToggleCompleteTask, onOpenNewTaskModal, user, onNavigateToTab }: DashboardViewProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const today = todayStr();

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const highCount = tasks.filter(t => t.priority === 'High' && !t.completed).length;
    const todayCount = tasks.filter(t => t.dueDate === today && !t.completed).length;
    return { total, completed, pending, completionRate, highCount, todayCount };
  }, [tasks, today]);

  // Streak: count consecutive days with completions
  const streak = useMemo(() => {
    const completedDates = tasks
      .filter(t => t.completed && t.completedDate)
      .map(t => t.completedDate!)
      .sort()
      .reverse();
    if (completedDates.length === 0) return 0;
    let streak = 0;
    const check = new Date();
    for (let i = 0; i < 30; i++) {
      const d = check.toISOString().split('T')[0];
      if (completedDates.includes(d)) {
        streak++;
      } else if (streak > 0) {
        break;
      }
      check.setDate(check.getDate() - 1);
    }
    return streak;
  }, [tasks]);

  // Today's tasks
  const todayTasks = useMemo(() =>
    tasks.filter(t => t.dueDate === today && !t.completed),
    [tasks, today]
  );

  // Upcoming (next 7 days, not today)
  const upcomingTasks = useMemo(() => {
    const d7 = new Date(); d7.setDate(d7.getDate() + 7);
    const d7str = d7.toISOString().split('T')[0];
    return tasks
      .filter(t => !t.completed && t.dueDate > today && t.dueDate <= d7str)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .slice(0, 5);
  }, [tasks, today]);

  // Active tasks filtered by search
  const activeTasks = useMemo(() =>
    tasks
      .filter(t => !t.completed)
      .filter(t =>
        !searchQuery ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    [tasks, searchQuery]
  );

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Top Navbar */}
      <header className="bg-surface-container-lowest sticky top-0 z-40 border-b border-outline-variant h-16 flex items-center shadow-sm">
        <div className="flex justify-between items-center w-full px-6 max-w-[1280px] mx-auto">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline opacity-60" />
            <input
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-transparent rounded-full focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all text-sm outline-none"
              placeholder="Search tasks, subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('No new notifications.')}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant"
            >
              <Bell className="w-5 h-5" />
            </button>
            <button
              onClick={() => onNavigateToTab('settings')}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant"
            >
              <SettingsIcon className="w-5 h-5" />
            </button>
            <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-outline-variant ml-1 cursor-pointer" />
          </div>
        </div>
      </header>

      <div className="flex-1 p-6 max-w-[1280px] mx-auto w-full space-y-6">
        {/* Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold font-display text-on-surface">{getGreeting(user.name)}</h2>
            <p className="text-sm text-on-surface-variant mt-1 font-medium">
              {stats.todayCount > 0
                ? `You have ${stats.todayCount} task${stats.todayCount > 1 ? 's' : ''} due today. Let's get it done!`
                : "You're all caught up for today! Great work 🎉"}
            </p>
          </div>
          <button
            onClick={onOpenNewTaskModal}
            className="bg-primary text-white font-semibold py-2.5 px-5 rounded-xl flex items-center gap-2 shadow-sm hover:bg-primary-container active:scale-95 transition-all cursor-pointer text-sm"
          >
            ✨ New Task
          </button>
        </div>

        {/* Stats Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Today's Tasks", value: stats.todayCount, icon: <CalendarIcon className="w-5 h-5" />, accent: 'bg-primary/10 text-primary', border: 'border-primary/20' },
            { label: 'Completion Rate', value: `${stats.completionRate}%`, icon: <TrendingUp className="w-5 h-5" />, accent: 'bg-emerald-100 text-emerald-700', border: 'border-emerald-200' },
            { label: 'High Priority', value: stats.highCount, icon: <AlertTriangle className="w-5 h-5" />, accent: 'bg-red-100 text-red-600', border: 'border-red-200' },
            { label: 'Study Streak', value: `${streak} day${streak !== 1 ? 's' : ''}`, icon: <Flame className="w-5 h-5" />, accent: 'bg-orange-100 text-orange-600', border: 'border-orange-200' },
          ].map((card) => (
            <div key={card.label} className={`bg-surface-container-lowest p-4 rounded-xl border ${card.border} shadow-sm`}>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.accent} mb-3`}>
                {card.icon}
              </div>
              <p className="text-2xl font-display font-bold text-on-surface">{card.value}</p>
              <p className="text-xs font-semibold text-on-surface-variant mt-0.5">{card.label}</p>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Tasks Column */}
          <div className="lg:col-span-8 space-y-4">
            {/* Today's tasks */}
            {todayTasks.length > 0 && (
              <div className="bg-gradient-to-br from-primary/5 to-transparent border border-primary/15 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <h3 className="font-display font-bold text-on-surface text-sm uppercase tracking-wider">Due Today</h3>
                </div>
                {todayTasks.map(task => {
                  const style = priorityStyle(task.priority);
                  return (
                    <div key={task.id} className="bg-white border border-outline-variant/60 rounded-xl p-4 flex items-center gap-3 hover:shadow-sm transition-all">
                      <div className={`w-1 h-10 rounded-full ${style.bar} shrink-0`} />
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-primary cursor-pointer shrink-0"
                        checked={task.completed}
                        onChange={() => onToggleCompleteTask(task.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-on-surface truncate">{task.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-on-surface-variant font-medium">{task.category}</span>
                          {task.startTime && (
                            <span className="text-[10px] text-outline flex items-center gap-0.5">
                              <Clock className="w-3 h-3" />{task.startTime}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${style.badge}`}>{task.priority}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* All Active Tasks */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-bold text-on-surface">Active Tasks</h3>
                <button
                  onClick={() => onNavigateToTab('tasks')}
                  className="text-xs text-primary font-bold hover:underline cursor-pointer"
                >
                  View all →
                </button>
              </div>
              {activeTasks.length === 0 ? (
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-10 text-center">
                  <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                  <p className="font-semibold text-on-surface">All caught up!</p>
                  <p className="text-sm text-on-surface-variant mt-1">No active tasks match your search.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {activeTasks.slice(0, 6).map(task => {
                    const style = priorityStyle(task.priority);
                    return (
                      <div key={task.id} className="group bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-4 hover:shadow-sm transition-all relative overflow-hidden">
                        <div className={`absolute top-0 left-0 w-1 h-full ${style.bar}`} />
                        <div className="flex items-start gap-3 pl-2">
                          <input
                            type="checkbox"
                            className="w-4 h-4 accent-primary cursor-pointer mt-0.5 shrink-0"
                            checked={task.completed}
                            onChange={() => onToggleCompleteTask(task.id)}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-sm text-on-surface group-hover:text-primary transition-colors">{task.title}</p>
                              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${style.badge}`}>{task.priority}</span>
                              {task.recurring && task.recurring !== 'none' && (
                                <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded-full font-bold">↻ {task.recurring}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-[11px] text-on-surface-variant mt-1 font-medium">
                              <span className="flex items-center gap-1"><Folder className="w-3 h-3" />{task.category}</span>
                              <span className="flex items-center gap-1"><CalendarIcon className="w-3 h-3" />Due {fmt(task.dueDate)}</span>
                              {task.startTime && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{task.startTime}–{task.endTime}</span>}
                            </div>
                            {typeof task.progress === 'number' && task.progress > 0 && (
                              <div className="mt-2 flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${task.progress}%` }} />
                                </div>
                                <span className="text-[10px] font-bold text-primary">{task.progress}%</span>
                              </div>
                            )}
                          </div>
                          {task.assignees && task.assignees.length > 0 && (
                            <div className="flex -space-x-1.5 shrink-0">
                              {task.assignees.slice(0, 3).map((av, i) => (
                                <img key={i} src={av} alt="Assignee" className="w-6 h-6 rounded-full border-2 border-white object-cover" />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-5">
            {/* Productivity Score */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5">
              <h3 className="font-display font-bold text-on-surface mb-4 text-sm">Productivity Score</h3>
              <div className="relative w-28 h-28 mx-auto mb-4">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="56" cy="56" r="46" fill="transparent" stroke="currentColor" strokeWidth="7" className="text-surface-container-high" />
                  <circle
                    cx="56" cy="56" r="46" fill="transparent" stroke="currentColor" strokeWidth="7"
                    className="text-primary transition-all duration-1000"
                    strokeDasharray={289}
                    strokeDashoffset={289 - (289 * stats.completionRate / 100)}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-3xl font-bold text-on-surface">{stats.completionRate}</span>
                  <span className="text-[9px] uppercase font-bold text-on-surface-variant tracking-wider">Score</span>
                </div>
              </div>
              <div className="space-y-2 text-xs font-medium">
                <div className="flex justify-between items-center bg-surface-container-low p-2.5 rounded-lg">
                  <span className="text-on-surface-variant flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-primary" />Completed</span>
                  <span className="font-bold text-on-surface">{stats.completed}</span>
                </div>
                <div className="flex justify-between items-center bg-surface-container-low p-2.5 rounded-lg">
                  <span className="text-on-surface-variant flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-emerald-600" />Pending</span>
                  <span className="font-bold text-on-surface">{stats.pending}</span>
                </div>
                <div className="flex justify-between items-center bg-orange-50 border border-orange-100 p-2.5 rounded-lg">
                  <span className="text-orange-700 flex items-center gap-1.5"><Flame className="w-3.5 h-3.5" />Study Streak</span>
                  <span className="font-bold text-orange-700">{streak} days</span>
                </div>
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5">
              <h3 className="font-display font-bold text-on-surface mb-3 text-sm">Upcoming (7 days)</h3>
              {upcomingTasks.length === 0 ? (
                <p className="text-xs text-on-surface-variant text-center py-4">No upcoming deadlines 🎉</p>
              ) : (
                <div className="space-y-2">
                  {upcomingTasks.map(task => {
                    const style = priorityStyle(task.priority);
                    const daysLeft = Math.ceil((new Date(task.dueDate).getTime() - new Date(today).getTime()) / 86400000);
                    return (
                      <div key={task.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-surface-container-low transition-colors">
                        <div className={`w-2 h-2 rounded-full ${style.bar} shrink-0`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-on-surface truncate">{task.title}</p>
                          <p className="text-[10px] text-on-surface-variant">{task.category}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${daysLeft <= 2 ? 'bg-red-100 text-red-600' : 'bg-surface-container text-on-surface-variant'}`}>
                          {daysLeft}d
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Add Promo */}
            <div
              onClick={onOpenNewTaskModal}
              className="bg-gradient-to-br from-primary to-primary-container rounded-xl p-5 cursor-pointer hover:shadow-lg transition-all active:scale-95 text-white"
            >
              <p className="text-2xl mb-1">✨</p>
              <h4 className="font-display font-bold text-base">Add a Task</h4>
              <p className="text-xs text-white/80 mt-1">Stay on top of your studies with DoBuddy.</p>
              <div className="mt-3 text-xs font-bold bg-white/20 rounded-lg py-1.5 text-center">
                + Create Now
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
