import { useState, useEffect, useMemo, useCallback } from 'react';
import { Task, Notification } from './types';
import { INITIAL_TASKS } from './data';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import DashboardView from './components/DashboardView';
import AnalyticsView from './components/AnalyticsView';
import CalendarView from './components/CalendarView';
import ProjectsView from './components/ProjectsView';
import MyTasksView from './components/MyTasksView';
import SettingsView from './components/SettingsView';
import TaskModal from './components/TaskModal';
import { scheduleAllReminders, scheduleTaskReminder, clearTaskReminder, requestNotificationPermission } from './NotificationService';
import {
  Zap,
  Plus,
  LayoutDashboard,
  CheckCircle2,
  Calendar as CalendarIcon,
  FolderMinus,
  BarChart3,
  Settings as SettingsIcon,
  HelpCircle,
  Menu,
  X,
  LogOut,
  Bell,
  CheckCircle,
} from 'lucide-react';

interface User {
  name: string;
  email: string;
  avatar: string;
  isLoggedIn: boolean;
}

// Toast component
function Toast({ notifications, onDismiss }: { notifications: Notification[]; onDismiss: (id: string) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
      {notifications.map(n => (
        <div
          key={n.id}
          className="toast-enter pointer-events-auto bg-white border border-outline-variant rounded-xl shadow-2xl p-4 max-w-sm flex items-start gap-3"
        >
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-bold text-on-surface text-xs">{n.title}</p>
            <p className="text-[11px] text-on-surface-variant mt-0.5">{n.message}</p>
          </div>
          <button
            onClick={() => onDismiss(n.id)}
            className="text-outline hover:text-on-surface transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const loggedIn = localStorage.getItem('taskflow_is_logged_in') === 'true';
    const email = localStorage.getItem('taskflow_user_email');
    return loggedIn && email === 'davidsanchez8925@gmail.com';
  });

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const [user, setUser] = useState<User>(() => {
    const savedName = localStorage.getItem('taskflow_user_name');
    const savedEmail = localStorage.getItem('taskflow_user_email');
    return {
      name: savedName || 'David Sanchez',
      email: savedEmail || 'davidsanchez8925@gmail.com',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAraTcmdabOP6hOYivIYhbzFlHp9Tp3wiXPHjAeaYiQTYhE6t6XPxADxKTuly2x6mETbnj7sYb0t_n-sRKK350d35hEIQIpK1Vp5M5dh-zGB0tjgM9gEeKLynyiOu7Hi5tWzKgaKQm4XzpUhMkIjAhtNxrapbKikPsL6uAu_-iyZV5KKVjy0sju6F15nT_WJOHEoAvFxhDrLqpLahf_9bj2po7hqqi9bfLDwgcH2kdpK4Xsu5HGTpw6A8wftGH6l60Nqiw_gtXwoVg',
      isLoggedIn: false,
    };
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('taskflow_tasks_store');
    if (savedTasks) {
      try { return JSON.parse(savedTasks); } catch { /* */ }
    }
    return INITIAL_TASKS;
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [toastNotifications, setToastNotifications] = useState<Notification[]>([]);

  // Sync tasks to localStorage
  useEffect(() => {
    localStorage.setItem('taskflow_tasks_store', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('taskflow_is_logged_in', isLoggedIn ? 'true' : 'false');
    if (isLoggedIn) {
      localStorage.setItem('taskflow_user_name', user.name);
      localStorage.setItem('taskflow_user_email', user.email);
    }
  }, [isLoggedIn, user]);

  // In-app notification handler
  const handleInAppNotification = useCallback((title: string, message: string) => {
    const n: Notification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type: 'reminder',
      timestamp: Date.now(),
      read: false,
    };
    setToastNotifications(prev => [...prev, n]);
    // Auto dismiss after 6 seconds
    setTimeout(() => {
      setToastNotifications(prev => prev.filter(x => x.id !== n.id));
    }, 6000);
  }, []);

  // Schedule reminders on login / task change
  useEffect(() => {
    if (!isLoggedIn) return;
    scheduleAllReminders(tasks, handleInAppNotification);
  }, [isLoggedIn, tasks, handleInAppNotification]);

  // Request notification permission on login
  useEffect(() => {
    if (isLoggedIn) {
      requestNotificationPermission();
    }
  }, [isLoggedIn]);

  // Mouse glow
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const dynamicStyleBackground = useMemo(() => {
    const xPct = Math.round((mousePos.x / window.innerWidth) * 100);
    const yPct = Math.round((mousePos.y / window.innerHeight) * 100);
    return {
      backgroundImage: `
        radial-gradient(at ${xPct}% ${yPct}%, rgba(108, 71, 255, 0.07) 0px, transparent 40%),
        radial-gradient(at 0% 0%, rgba(108, 71, 255, 0.04) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(0, 137, 123, 0.04) 0px, transparent 50%)
      `
    };
  }, [mousePos]);

  const handleSignInSubmit = (email: string, name: string) => {
    setUser(prev => ({ ...prev, email, name, isLoggedIn: true }));
    setIsLoggedIn(true);
  };

  const handleSignUpSubmit = (email: string, name: string) => {
    setUser(prev => ({ ...prev, email, name, isLoggedIn: true }));
    setIsLoggedIn(true);
  };

  const handleLogOut = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('taskflow_is_logged_in');
    localStorage.removeItem('taskflow_user_name');
    localStorage.removeItem('taskflow_user_email');
    alert('Logged out from DoBuddy successfully.');
  };

  const handleToggleCompleteTask = (id: string) => {
    const timestamp = new Date().toISOString().split('T')[0];
    setTasks(prev => prev.map(task =>
      task.id === id
        ? { ...task, completed: !task.completed, completedDate: !task.completed ? timestamp : undefined, progress: !task.completed ? 100 : task.progress }
        : task
    ));
  };

  const handleDeleteTask = (id: string) => {
    clearTaskReminder(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleCreateTask = (taskData: Omit<Task, 'id' | 'completed' | 'completedDate'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      completed: false,
    };
    setTasks(prev => [newTask, ...prev]);
    if (newTask.reminder) {
      scheduleTaskReminder(newTask, handleInAppNotification);
    }
  };

  const handleUpdateUser = (name: string, email: string) => {
    setUser(prev => ({ ...prev, name, email }));
  };

  const handleUpdateTaskProgress = (id: string, progress: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, progress } : t));
  };

  const handleResetApp = () => {
    setTasks(INITIAL_TASKS);
  };

  const dismissToast = (id: string) => {
    setToastNotifications(prev => prev.filter(n => n.id !== id));
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'My Tasks', icon: CheckCircle2 },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'projects', label: 'Projects', icon: FolderMinus },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  if (!isLoggedIn) {
    return (
      <div
        style={dynamicStyleBackground}
        className="min-h-screen flex items-center justify-center relative p-4 bg-background transition-all duration-300 overflow-hidden"
      >
        <div className="blur-glow-left" />
        <div className="blur-glow-right" />
        {authMode === 'signin' ? (
          <SignIn onSignIn={handleSignInSubmit} onToggleMode={() => setAuthMode('signup')} />
        ) : (
          <SignUp onSignUp={handleSignUpSubmit} onToggleMode={() => setAuthMode('signin')} />
        )}
      </div>
    );
  }

  const renderCurrentView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            tasks={tasks}
            onToggleCompleteTask={handleToggleCompleteTask}
            onOpenNewTaskModal={() => setIsTaskModalOpen(true)}
            user={user}
            onNavigateToTab={setActiveTab}
          />
        );
      case 'tasks':
        return (
          <MyTasksView
            tasks={tasks}
            onToggleCompleteTask={handleToggleCompleteTask}
            onDeleteTask={handleDeleteTask}
            onOpenNewTaskModal={() => setIsTaskModalOpen(true)}
            onUpdateTaskProgress={handleUpdateTaskProgress}
          />
        );
      case 'calendar':
        return <CalendarView tasks={tasks} onToggleCompleteTask={handleToggleCompleteTask} />;
      case 'projects':
        return <ProjectsView tasks={tasks} onToggleCompleteTask={handleToggleCompleteTask} />;
      case 'analytics':
        return <AnalyticsView tasks={tasks} />;
      case 'settings':
        return <SettingsView user={user} onUpdateUser={handleUpdateUser} onResetApp={handleResetApp} />;
      default:
        return <div className="p-6 text-center text-on-surface-variant">Section under development.</div>;
    }
  };

  return (
    <div
      style={dynamicStyleBackground}
      className="min-h-screen bg-background relative flex flex-col md:flex-row font-sans text-sm font-medium transition-all duration-300"
    >
      <div className="blur-glow-left opacity-40" />
      <div className="blur-glow-right opacity-40" />

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-surface-container-low border-r border-outline-variant h-screen sticky top-0 hidden md:flex flex-col p-5 gap-5 z-50">
        {/* Brand */}
        <div className="flex items-center gap-3 select-none px-1">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-sm shrink-0">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-primary leading-tight">DoBuddy</h1>
            <p className="text-[10px] uppercase tracking-wider text-outline font-black">STUDENT PLANNER</p>
          </div>
        </div>

        {/* New Task CTA */}
        <button
          onClick={() => setIsTaskModalOpen(true)}
          className="w-full bg-primary hover:bg-primary-container text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>

        {/* Nav */}
        <nav className="flex flex-col gap-1 flex-1 font-semibold select-none">
          {navItems.map(item => {
            const isSelected = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-xs text-left transition-all cursor-pointer ${
                  isSelected ? 'bg-primary/8 text-primary font-bold shadow-xs' : 'text-on-surface-variant hover:bg-surface-container/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-primary' : 'text-outline/80'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-outline-variant/30 pt-4 flex flex-col gap-1 font-semibold text-xs">
          <button
            onClick={() => setIsHelpOpen(true)}
            className="flex items-center gap-3 rounded-xl px-4 py-2 text-on-surface-variant hover:bg-surface-container/40 transition-all cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-outline/80" />Help Guide
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-3 rounded-xl px-4 py-2 transition-all cursor-pointer ${activeTab === 'settings' ? 'bg-primary/8 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container/40'}`}
          >
            <SettingsIcon className={`w-4 h-4 ${activeTab === 'settings' ? 'text-primary' : 'text-outline/80'}`} />Settings
          </button>
          <button
            onClick={handleLogOut}
            className="flex items-center gap-3 rounded-xl px-4 py-2 text-on-surface-variant hover:bg-red-500/10 hover:text-red-600 transition-all cursor-pointer mt-1"
          >
            <LogOut className="w-4 h-4 text-outline/80" />Log Out
          </button>

          {/* User info */}
          <div className="flex items-center gap-2 px-4 py-2 mt-1 bg-surface-container-low rounded-xl border border-outline-variant/30">
            <img src={user.avatar} alt="Profile" className="w-7 h-7 rounded-full object-cover shrink-0" />
            <div className="min-w-0">
              <p className="font-bold text-on-surface text-[11px] truncate">{user.name}</p>
              <p className="text-[9px] text-on-surface-variant truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden bg-surface-container-lowest border-b border-outline-variant h-14 flex items-center justify-between px-4 sticky top-0 z-50">
        <div className="flex items-center gap-2 select-none">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <span className="font-display font-bold text-primary text-base">DoBuddy</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsTaskModalOpen(true)} className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
            <Plus className="w-4 h-4" />
          </button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low">
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-14 bg-surface-container-lowest border-b border-outline-variant py-4 z-50 space-y-2 px-4 shadow-xl flex flex-col font-semibold">
          {navItems.map(item => {
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                className={`w-full text-left py-2 px-4 rounded-xl text-xs flex items-center gap-2 ${isSelected ? 'bg-primary/8 text-primary' : 'text-on-surface-variant'}`}
              >
                {item.label}
              </button>
            );
          })}
          <div className="border-t border-outline-variant/30 pt-2 flex flex-col gap-1">
            <button onClick={() => { setIsHelpOpen(true); setIsMobileMenuOpen(false); }} className="w-full text-left py-2 px-4 rounded-xl text-xs text-on-surface-variant">Help Guide</button>
            <button onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false); }} className="w-full text-left py-2 px-4 rounded-xl text-xs text-on-surface-variant">Settings</button>
            <button onClick={() => { handleLogOut(); setIsMobileMenuOpen(false); }} className="w-full text-left py-2 px-4 rounded-xl text-xs text-red-600 hover:bg-red-50">Log Out</button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 min-h-screen flex flex-col overflow-x-hidden relative pb-16 md:pb-0">
        {renderCurrentView()}
      </main>

      {/* FAB */}
      <button
        onClick={() => setIsTaskModalOpen(true)}
        className="md:hidden fixed bottom-20 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center z-40 active:scale-90 transition-transform cursor-pointer"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Mobile Footer Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container-lowest border-t border-outline-variant flex justify-around items-center h-16 z-40 select-none">
        {navItems.slice(0, 4).map(item => {
          const isSelected = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
              className={`flex flex-col items-center gap-1 cursor-pointer ${isSelected ? 'text-primary font-bold' : 'text-on-surface-variant'}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-bold">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
        <button
          onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false); }}
          className={`flex flex-col items-center gap-1 cursor-pointer ${activeTab === 'settings' ? 'text-primary font-bold' : 'text-on-surface-variant'}`}
        >
          <SettingsIcon className="w-5 h-5" />
          <span className="text-[10px] font-bold">Settings</span>
        </button>
      </nav>

      {/* Task Modal */}
      <TaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} onCreateTask={handleCreateTask} />

      {/* Help Modal */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-inverse-surface/60 backdrop-blur-sm" onClick={() => setIsHelpOpen(false)} />
          <div className="bg-white border border-outline-variant p-6 rounded-2xl max-w-md w-full shadow-2xl z-10 space-y-4 animate-zoom-in">
            <div className="border-b border-outline-variant/30 pb-3">
              <h3 className="font-display font-black text-on-surface text-lg">DoBuddy Manual 🎓</h3>
              <p className="text-xs text-on-surface-variant font-semibold mt-0.5">How to make the most of your student planner</p>
            </div>
            <div className="text-xs text-on-surface-variant leading-relaxed space-y-2.5 font-medium">
              <p>Welcome to <strong className="text-primary font-bold">DoBuddy</strong> — your all-in-one student productivity companion!</p>
              <ul className="list-disc pl-4 space-y-1.5">
                <li><strong className="text-on-surface">Dashboard</strong>: See today's tasks, upcoming deadlines, and your study streak at a glance.</li>
                <li><strong className="text-on-surface">My Tasks</strong>: Create, filter, and track progress on all your study tasks with inline progress sliders.</li>
                <li><strong className="text-on-surface">Calendar</strong>: Switch between Daily, Weekly, and Monthly views to plan your schedule visually.</li>
                <li><strong className="text-on-surface">Projects</strong>: Track completion across all 10 student categories like Assignments, Coding, and Exams.</li>
                <li><strong className="text-on-surface">Analytics</strong>: View weekly study activity, category breakdowns, and your productivity score.</li>
                <li><strong className="text-on-surface">Reminders</strong>: Set alarms on tasks — DoBuddy will notify you before deadlines!</li>
              </ul>
            </div>
            <button
              onClick={() => setIsHelpOpen(false)}
              className="w-full bg-primary hover:bg-primary-container text-white py-2.5 rounded-xl font-bold text-xs cursor-pointer shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />Got it, let's study!
            </button>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <Toast notifications={toastNotifications} onDismiss={dismissToast} />
    </div>
  );
}
