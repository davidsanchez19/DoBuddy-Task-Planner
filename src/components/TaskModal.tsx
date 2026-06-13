import React, { useState } from 'react';
import { X, Bell, Repeat, Clock, Calendar, Users, ChevronDown } from 'lucide-react';
import { CATEGORIES, TEAM_MEMBERS } from '../data';
import { Task } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTask: (task: Omit<Task, 'id' | 'completed' | 'completedDate'>) => void;
}

const TODAY = new Date().toISOString().split('T')[0];

export default function TaskModal({ isOpen, onClose, onCreateTask }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [dueDate, setDueDate] = useState(TODAY);
  const [startDate, setStartDate] = useState(TODAY);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [recurring, setRecurring] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none');
  const [reminder, setReminder] = useState(false);
  const [reminderMinutes, setReminderMinutes] = useState(15);
  const [progress, setProgress] = useState(0);
  const [assignedTo, setAssignedTo] = useState<string[]>(['David Sanchez']);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const assigneeAvatars = TEAM_MEMBERS
      .filter(m => assignedTo.includes(m.name))
      .map(m => m.avatar);
    onCreateTask({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate,
      startDate,
      startTime,
      endTime,
      category,
      recurring,
      reminder,
      reminderMinutes: reminder ? reminderMinutes : undefined,
      progress,
      assignedTo,
      assignees: assigneeAvatars,
    });
    // Reset form
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setDueDate(TODAY);
    setStartDate(TODAY);
    setStartTime('09:00');
    setEndTime('10:00');
    setCategory(CATEGORIES[0]);
    setRecurring('none');
    setReminder(false);
    setReminderMinutes(15);
    setProgress(0);
    setAssignedTo(['David Sanchez']);
    onClose();
  };

  const toggleAssignee = (name: string) => {
    setAssignedTo(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const priorityConfig = {
    Low: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
    Medium: { color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
    High: { color: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' },
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-inverse-surface/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-zoom-in z-10 border border-outline-variant max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-outline-variant flex justify-between items-center bg-gradient-to-r from-primary/5 to-transparent shrink-0">
          <div>
            <h3 className="font-display text-lg font-bold text-on-surface">Create New Task</h3>
            <p className="text-xs text-on-surface-variant mt-0.5">Add a new study task to your DoBuddy planner</p>
          </div>
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant hover:text-on-surface cursor-pointer"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto flex-1">
          <form id="task-form" onSubmit={handleSubmit}>
            <div className="p-5 space-y-5">

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Task Title *
                </label>
                <input
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant focus:border-primary focus:bg-surface-container-lowest rounded-xl transition-all outline-none text-sm text-on-surface font-medium placeholder:text-outline"
                  placeholder="e.g. Complete Chapter 3 – Algorithms"
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant focus:border-primary focus:bg-surface-container-lowest rounded-xl transition-all outline-none text-sm text-on-surface resize-none placeholder:text-outline"
                  placeholder="Add notes, instructions, or references..."
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => {
                    const isSelected = category === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`px-3 py-1.5 text-xs rounded-full font-semibold cursor-pointer border transition-all ${
                          isSelected
                            ? 'bg-primary text-white border-primary shadow-sm'
                            : 'bg-surface-container-low text-on-surface-variant border-outline-variant hover:border-primary/40 hover:text-primary'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Priority
                </label>
                <div className="flex gap-2">
                  {(['Low', 'Medium', 'High'] as const).map((p) => {
                    const cfg = priorityConfig[p];
                    const isSelected = priority === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          isSelected ? cfg.color + ' shadow-sm' : 'border-outline-variant text-on-surface-variant hover:border-outline'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${isSelected ? cfg.dot : 'bg-outline-variant'}`} />
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dates Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Start Date
                  </label>
                  <input
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant focus:border-primary rounded-xl transition-all outline-none text-sm text-on-surface cursor-pointer"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Due Date
                  </label>
                  <input
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant focus:border-primary rounded-xl transition-all outline-none text-sm text-on-surface cursor-pointer"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Times Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Start Time
                  </label>
                  <input
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant focus:border-primary rounded-xl transition-all outline-none text-sm text-on-surface cursor-pointer"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> End Time
                  </label>
                  <input
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant focus:border-primary rounded-xl transition-all outline-none text-sm text-on-surface cursor-pointer"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>

              {/* Recurring + Reminder Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Recurring */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
                    <Repeat className="w-3.5 h-3.5" /> Recurring
                  </label>
                  <div className="relative">
                    <select
                      className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant focus:border-primary rounded-xl transition-all outline-none text-sm text-on-surface cursor-pointer appearance-none"
                      value={recurring}
                      onChange={(e) => setRecurring(e.target.value as typeof recurring)}
                    >
                      <option value="none">None</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline pointer-events-none" />
                  </div>
                </div>

                {/* Reminder */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
                    <Bell className="w-3.5 h-3.5" /> Reminder
                  </label>
                  <div className="flex items-center gap-3 px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl">
                    <button
                      type="button"
                      onClick={() => setReminder(!reminder)}
                      className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer shrink-0 ${reminder ? 'bg-primary' : 'bg-outline-variant'}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${reminder ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                    {reminder && (
                      <select
                        className="flex-1 bg-transparent outline-none text-xs font-semibold text-on-surface cursor-pointer"
                        value={reminderMinutes}
                        onChange={(e) => setReminderMinutes(Number(e.target.value))}
                      >
                        <option value={5}>5 min before</option>
                        <option value={10}>10 min before</option>
                        <option value={15}>15 min before</option>
                        <option value={30}>30 min before</option>
                        <option value={60}>1 hour before</option>
                        <option value={120}>2 hours before</option>
                      </select>
                    )}
                    {!reminder && <span className="text-xs text-outline">Off</span>}
                  </div>
                </div>
              </div>

              {/* Progress Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Progress
                  </label>
                  <span className="text-xs font-bold text-primary">{progress}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer accent-primary"
                />
                <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Assignees */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> Assign To
                </label>
                <div className="flex flex-wrap gap-2">
                  {TEAM_MEMBERS.map((member) => {
                    const isSelected = assignedTo.includes(member.name);
                    return (
                      <button
                        key={member.name}
                        type="button"
                        onClick={() => toggleAssignee(member.name)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-outline-variant text-on-surface-variant hover:border-primary/40'
                        }`}
                      >
                        <img src={member.avatar} alt={member.name} className="w-5 h-5 rounded-full object-cover" />
                        {member.name}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-5 border-t border-outline-variant bg-surface-container-low/50 flex gap-3 shrink-0">
              <button
                type="button"
                className="flex-1 py-3 border border-outline text-on-surface-variant font-bold rounded-xl hover:bg-surface-container-high transition-colors cursor-pointer bg-white text-sm"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-[2] py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-container transition-all active:scale-95 cursor-pointer text-sm"
              >
                ✨ Create Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
