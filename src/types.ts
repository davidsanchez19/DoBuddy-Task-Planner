export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
  startDate?: string;
  startTime?: string;
  endTime?: string;
  category: string;
  completed: boolean;
  completedDate?: string;
  assignees?: string[];
  assignedTo?: string[];
  reminder?: boolean;
  reminderMinutes?: number;
  recurring?: 'none' | 'daily' | 'weekly' | 'monthly';
  progress?: number;
}

export interface User {
  name: string;
  email: string;
  isLoggedIn: boolean;
  avatar: string;
}

export interface AnalyticsStats {
  totalDone: number;
  focusHours: number;
  efficiency: number;
  overdueCount: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'reminder' | 'deadline' | 'info';
  timestamp: number;
  read: boolean;
}
