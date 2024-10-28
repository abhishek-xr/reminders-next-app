export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface Reminder {
  id: string;
  name: string;
  description: string;
  date: Date;
  time: string;
  priority: Priority;
  category: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReminderFormData {
  name: string;
  description: string;
  date: string;
  time: string;
  priority: Priority;
  category: string;
}

export interface SearchState {
    query: string;
    results: Reminder[];
  }