import { useState, useMemo } from 'react';
import { Task } from '../types';
import { ClipboardList, Search, Trash2, PlusCircle, CheckCircle2, Bell, Repeat, Clock, ChevronDown } from 'lucide-react';
import { CATEGORIES } from '../data';

interface MyTasksViewProps {
  tasks: Task[];
  onToggleCompleteTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onOpenNewTaskModal: () => void;
  onUpdateTaskProgress?: (id: string, progress: number) => void;
}

const priorityBadge = (p: string) => {
  if (p === 'High') return 'bg-red-100 text-red-700 border-red-200';
  if (p === 'Medium') return 'bg-amber-100 text-amber-700 border-amber-200';
  return 'bg-emerald-100 text-emerald-700 border-emerald-200';
};

const priorityBar = (p: string) => {
  if (p === 'High') return 'bg-red-500';
  if (p === 'Medium') return 'bg-amber-500';
  return 'bg-emerald-500';
};

export default function MyTasksView({ tasks, onToggleCompleteTask, onDeleteTask, onOpenNewTaskModal, onUpdateTaskProgress }: MyTasksViewProps) {
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState<'All' | 'Active' | 'Completed'>('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const processedTasks = useMemo(() => {
    return tasks
      .filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) ||
          task.category.toLowerCase().includes(search.toLowerCase()) ||
          (task.description || '').toLowerCase().includes(search.toLowerCase());
        const matchesStatus =
          filterMode === 'All' ? true :
          filterMode === 'Completed' ? task.completed : !task.completed;
        const matchesCategory = categoryFilter === 'All' || task.category === categoryFilter;
        const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
        return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
      })
      .sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return a.dueDate.localeCompare(b.dueDate);
      });
  }, [tasks, search, filterMode, categoryFilter, priorityFilter]);

  const counts = {
    All: tasks.length,
    Active: tasks.filter(t => !t.completed).length,
    Completed: tasks.filter(t => t.completed).length,
  };

  return (
    <div className="flex-1 p-6 max-w-[1280px] w-full mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-outline-variant shadow-sm">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold font-display text-on-surface">My Study Tasks</h2>
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">{counts.Active} active</span>
        </div>
        <button
          onClick={onOpenNewTaskModal}
          className="bg-primary hover:bg-primary-container text-white py-2 px-4 rounded-lg font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Sidebar Filters */}
        <div className="md:col-span-3 space-y-4">
          {/* Status Filter */}
          <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant select-none">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">Status</h3>
            <div className="flex flex-col gap-1">
              {(['All', 'Active', 'Completed'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setFilterMode(mode)}
                  className={`px-3 py-2 rounded-lg text-left flex justify-between items-center transition-all cursor-pointer text-sm font-medium ${
                    filterMode === mode ? 'bg-primary/8 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container/40'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {mode === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {mode} Tasks
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${filterMode === mode ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant'}`}>
                    {counts[mode]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant select-none">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-between cursor-pointer"
            >
              <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Category</h3>
              <ChevronDown className={`w-4 h-4 text-outline transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            {showFilters && (
              <div className="mt-3 flex flex-col gap-1">
                {['All', ...CATEGORIES].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-left text-xs font-medium transition-all cursor-pointer ${
                      categoryFilter === cat ? 'bg-primary/8 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container/40'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Priority Filter */}
          <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant select-none">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">Priority</h3>
            <div className="flex flex-col gap-1">
              {['All', 'High', 'Medium', 'Low'].map(p => (
                <button
                  key={p}
                  onClick={() => setPriorityFilter(p)}
                  className={`px-3 py-1.5 rounded-lg text-left text-xs font-medium transition-all cursor-pointer ${
                    priorityFilter === p ? 'bg-primary/8 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container/40'
                  }`}
                >
                  {p !== 'All' && (
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${p === 'High' ? 'bg-red-500' : p === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                  )}
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Task Cards */}
        <div className="md:col-span-9 space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline opacity-60" />
            <input
              type="text"
              placeholder="Search tasks by name, category, or notes..."
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl pl-10 pr-4 py-3 outline-none text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {processedTasks.length === 0 ? (
            <div className="bg-surface-container-lowest p-12 text-center border border-outline-variant rounded-xl">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-sm font-semibold text-on-surface-variant">No tasks found</p>
              <p className="text-xs text-outline mt-1">Try adjusting your filters or create a new task.</p>
            </div>
          ) : (
            processedTasks.map(task => (
              <div
                key={task.id}
                className={`relative bg-white border border-outline-variant/50 rounded-xl hover:shadow-md transition-all overflow-hidden ${task.completed ? 'opacity-70' : ''}`}
              >
                <div className={`absolute top-0 left-0 w-1 h-full ${priorityBar(task.priority)} rounded-l-xl`} />
                <div className="pl-4 pr-4 pt-4 pb-3">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => onToggleCompleteTask(task.id)}
                      className="text-outline hover:text-primary transition-colors cursor-pointer mt-0.5 shrink-0"
                    >
                      <CheckCircle2 className={`w-5 h-5 ${task.completed ? 'text-emerald-500 fill-emerald-100' : ''}`} />
                    </button>

                    <div className="flex-1 min-w-0">
                      {/* Title Row */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`font-display font-semibold text-sm ${task.completed ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>
                          {task.title}
                        </p>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${priorityBadge(task.priority)}`}>
                          {task.priority}
                        </span>
                        {task.recurring && task.recurring !== 'none' && (
                          <span className="flex items-center gap-1 text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded-full font-bold">
                            <Repeat className="w-3 h-3" />{task.recurring}
                          </span>
                        )}
                        {task.reminder && (
                          <span className="flex items-center gap-1 text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full font-bold border border-amber-200">
                            <Bell className="w-3 h-3" />{task.reminderMinutes}min
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      {task.description && (
                        <p className="text-xs text-on-surface-variant mt-1 leading-relaxed line-clamp-2">{task.description}</p>
                      )}

                      {/* Meta info */}
                      <div className="flex flex-wrap gap-3 text-[11px] text-on-surface-variant mt-1.5 font-medium">
                        <span className="bg-surface-container px-1.5 py-0.5 rounded">{task.category}</span>
                        <span>📅 Due {task.dueDate}</span>
                        {task.startTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />{task.startTime}{task.endTime ? `–${task.endTime}` : ''}
                          </span>
                        )}
                      </div>

                      {/* Progress Bar */}
                      {typeof task.progress === 'number' && (
                        <div className="mt-2.5 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-on-surface-variant">Progress</span>
                            <span className="text-[10px] font-bold text-primary">{task.progress}%</span>
                          </div>
                          <div className="relative group/prog">
                            <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full transition-all duration-500"
                                style={{ width: `${task.progress}%` }}
                              />
                            </div>
                            {onUpdateTaskProgress && !task.completed && (
                              <input
                                type="range"
                                min={0}
                                max={100}
                                step={5}
                                value={task.progress}
                                onChange={(e) => onUpdateTaskProgress(task.id, Number(e.target.value))}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full"
                              />
                            )}
                          </div>
                        </div>
                      )}

                      {/* Assignees */}
                      {task.assignedTo && task.assignedTo.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-2">
                          {task.assignees?.slice(0, 3).map((av, i) => (
                            <img key={i} src={av} alt="Assignee" className="w-5 h-5 rounded-full border border-white object-cover" />
                          ))}
                          <span className="text-[10px] text-on-surface-variant">
                            {task.assignedTo.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 text-on-surface-variant transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
