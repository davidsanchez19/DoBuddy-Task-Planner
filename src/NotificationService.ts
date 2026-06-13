import { Task } from './types';

const scheduledTimers = new Map<string, ReturnType<typeof setTimeout>>();

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

function getTaskReminderTime(task: Task): number | null {
  if (!task.reminder || !task.dueDate) return null;
  const dateStr = task.dueDate;
  const timeStr = task.endTime || task.startTime || '09:00';
  const [hours, minutes] = timeStr.split(':').map(Number);
  const dueDateTime = new Date(dateStr);
  dueDateTime.setHours(hours, minutes, 0, 0);
  const reminderMs = (task.reminderMinutes ?? 15) * 60 * 1000;
  return dueDateTime.getTime() - reminderMs;
}

export function scheduleTaskReminder(
  task: Task,
  onInAppNotification: (title: string, message: string) => void
): void {
  clearTaskReminder(task.id);

  const reminderTime = getTaskReminderTime(task);
  if (reminderTime === null) return;

  const now = Date.now();
  const delay = reminderTime - now;
  if (delay <= 0) return; // Already past

  const timer = setTimeout(() => {
    const title = `⏰ Reminder: ${task.title}`;
    const body = `Due in ${task.reminderMinutes ?? 15} minutes. Category: ${task.category}`;

    // Browser notification
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        tag: task.id,
      });
    }

    // In-app notification always fires
    onInAppNotification(title, body);

    scheduledTimers.delete(task.id);
  }, delay);

  scheduledTimers.set(task.id, timer);
}

export function clearTaskReminder(taskId: string): void {
  const existing = scheduledTimers.get(taskId);
  if (existing !== undefined) {
    clearTimeout(existing);
    scheduledTimers.delete(taskId);
  }
}

export function scheduleAllReminders(
  tasks: Task[],
  onInAppNotification: (title: string, message: string) => void
): void {
  tasks.forEach((task) => {
    if (!task.completed && task.reminder) {
      scheduleTaskReminder(task, onInAppNotification);
    }
  });
}

export function clearAllReminders(): void {
  scheduledTimers.forEach((timer) => clearTimeout(timer));
  scheduledTimers.clear();
}
